import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage {
  nouveauCompte = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: ''
  };

  message = '';

  constructor(private authService: Auth, private router: Router) {}

  creerCompte(): void {
    this.authService.register(this.nouveauCompte).subscribe({
      next: () => {
        this.message = 'Compte créé avec succès ! Vous pouvez vous connecter.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.message = 'Erreur : ' + (err.error?.error || 'impossible de créer le compte');
      }
    });
  }
}