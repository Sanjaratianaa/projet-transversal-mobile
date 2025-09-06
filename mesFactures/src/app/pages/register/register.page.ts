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
  IonIcon,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonDatetime
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonButtons,
    IonBackButton,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  showPassword = false;

  genderOptions = [
    { value: 'Homme', label: 'Homme' },
    { value: 'Femme', label: 'Femme' },
    { value: 'Autre', label: 'Autre' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthentificationService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ eye, eyeOff });
    
    this.registerForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenoms: ['', [Validators.required]],
      dateDeNaissance: ['', [Validators.required]],
      lieuDeNaissance: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      numeroTelephone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.registerForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Inscription en cours...',
        translucent: true
      });
      await loading.present();

      const userData = {
        nom: this.registerForm.value.nom,
        prenom: this.registerForm.value.prenoms,
        dateDeNaissance: this.registerForm.value.dateDeNaissance,
        lieuDeNaissance: this.registerForm.value.lieuDeNaissance,
        genre: this.registerForm.value.genre,
        etat: "Active",
        numeroTelephone: this.registerForm.value.numeroTelephone,
        email: this.registerForm.value.email,
        motDePasse: this.registerForm.value.motDePasse,
        idRole: "client"
      };

      this.authService.register(userData).subscribe({
        next: async (response: any) => {
          await loading.dismiss();
          
          // Show success alert
          const alert = await this.alertController.create({
            header: 'Inscription réussie',
            message: 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigate(['/login']);
              }
            }]
          });
          await alert.present();
        },
        error: async (error: any) => {
          await loading.dismiss();
          
          // Show error alert
          const alert = await this.alertController.create({
            header: 'Erreur d\'inscription',
            message: error.message || 'Une erreur est survenue lors de l\'inscription',
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

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
