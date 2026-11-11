import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  message = '';

  constructor(private authService: Auth, private router: Router) {}

  seConnecter(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (data: any) => {
        this.message = '';
        localStorage.setItem('utilisateur', JSON.stringify(data));
        if (data.role === 'ADMIN') this.router.navigate(['/admin']);
        else if (data.role === 'STAGIAIRE') this.router.navigate(['/stagiaire']);
        else if (data.role === 'ENCADRANT') this.router.navigate(['/encadrant']);
        else if (data.role === 'RH') this.router.navigate(['/rh']);
      },
      error: (err: any) => {
        this.message = 'Identifiants incorrects';
      }
    });
  }
}