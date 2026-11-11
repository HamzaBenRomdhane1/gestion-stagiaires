import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidature } from '../../services/candidature';

@Component({
  selector: 'app-candidature-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidature-page.html',
  styleUrl: './candidature-page.css'
})
export class CandidaturePage {
  nouvelleCandidature = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: ''
  };

  envoye = false;

  constructor(private candidatureService: Candidature) {}

  envoyerCandidature(): void {
    this.candidatureService.addCandidature(this.nouvelleCandidature).subscribe({
      next: () => {
        this.envoye = true;
        this.nouvelleCandidature = { nom: '', prenom: '', email: '', telephone: '', sujet: '' };
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }
}