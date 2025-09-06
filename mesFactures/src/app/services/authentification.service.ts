import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  message: string;
  data: any;
}

interface ChangePasswordResponse {
  message: string;
  data: any;
}

interface TokenVerificationSuccessResponse {
  success: true;
  user: any;
}

interface TokenVerificationErrorResponse {
  success: false;
  message: string;
}

type TokenVerificationResponse =
  | TokenVerificationSuccessResponse
  | TokenVerificationErrorResponse;

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl = environment.apiUrl + '/auth';
  private authSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);

  // Observables for reactive programming
  public isAuthenticated$ = this.authSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.initStorage();
  }

  /**
   * Initialize Ionic Storage
   */
  private async initStorage() {
    await this.storage.create();
    await this.checkAuthStatus();
  }

  /**
   * Check if user is authenticated on app start
   */
  private async checkAuthStatus() {
    try {
      const token = await this.getToken();
      if (token) {
        this.verifyToken(token).subscribe({
          next: (response) => {
            if (response.success) {
              this.authSubject.next(true);
              this.userSubject.next(response.user);
            } else {
              this.logout();
            }
          },
          error: () => {
            this.logout();
          }
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }

  /**
   * Login user
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(
      tap(async (response) => {
        // Store token securely
        await this.setToken(response.token);
        
        // Verify token and get user data
        this.verifyToken(response.token).subscribe({
          next: async (verificationResponse) => {
            if (verificationResponse.success) {
              await this.setUser(verificationResponse.user);
              this.authSubject.next(true);
              this.userSubject.next(verificationResponse.user);
            }
          }
        });
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Register user
   */
  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Change password
   */
  changePassword(
    email: string, 
    oldPassword: string, 
    newPassword: string, 
    confirmPassword: string
  ): Observable<ChangePasswordResponse> {
    const body = { email, oldPassword, newPassword, confirmPassword };
    return this.http.post<ChangePasswordResponse>(`${this.apiUrl}/change-password`, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Verify token
   */
  verifyToken(token: string): Observable<TokenVerificationResponse> {
    return this.http.post<TokenVerificationResponse>(`${this.apiUrl}/verifyToken`, { token }).pipe(
      tap(response => {
        console.log("verifyToken response received:", response);
      }),
      catchError(error => {
        console.error("Error in verifyToken:", error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.storage.remove('token');
      await this.storage.remove('user');
      this.authSubject.next(false);
      this.userSubject.next(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    try {
      return await this.storage.get('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Set token in storage
   */
  private async setToken(token: string): Promise<void> {
    try {
      await this.storage.set('token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<any> {
    try {
      return await this.storage.get('user');
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Set user data in storage
   */
  private async setUser(user: any): Promise<void> {
    try {
      await this.storage.set('user', user);
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }

  /**
   * Check if user is currently authenticated
   */
  get isAuthenticated(): boolean {
    return this.authSubject.value;
  }

  /**
   * Get current user data
   */
  get currentUser(): any {
    return this.userSubject.value;
  }

  /**
   * Error handling function
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `${error.error.message || error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
