import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon,
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthentificationService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ eye, eyeOff });
    
    this.loginForm = this.formBuilder.group({
      email: ['maria@example.com', [Validators.required, Validators.email]],
      password: ['maria1234', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Check if user is already authenticated
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/tabs']);
      }
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Connexion en cours...',
        translucent: true
      });
      await loading.present();

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: async (response) => {
          await loading.dismiss();
          
          // Navigate to main app
          this.router.navigate(['/tabs']);
          
          // Show success toast
          const toast = await this.toastController.create({
            message: 'Connexion réussie!',
            duration: 2000,
            color: 'success',
            position: 'top'
          });
          await toast.present();
        },
        error: async (error) => {
          await loading.dismiss();
          
          // Show error alert
          const alert = await this.alertController.create({
            header: 'Erreur de connexion',
            message: error.message || 'Email ou mot de passe incorrect',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
    } else {
      // Show validation errors
      const toast = await this.toastController.create({
        message: 'Veuillez remplir tous les champs requis',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
