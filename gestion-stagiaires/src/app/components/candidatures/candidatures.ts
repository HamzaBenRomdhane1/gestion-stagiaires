import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidature } from '../../services/candidature';

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidatures.html',
  styleUrl: './candidatures.css'
})
export class Candidatures implements OnInit {
  candidatures: any[] = [];

  nouvelleCandidature = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: ''
  };

  constructor(
    private candidatureService: Candidature,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerCandidatures();
  }

  chargerCandidatures(): void {
    this.candidatureService.getCandidatures().subscribe({
      next: (data: any) => {
        this.candidatures = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  ajouterCandidature(): void {
    this.candidatureService.addCandidature(this.nouvelleCandidature).subscribe({
      next: () => {
        this.nouvelleCandidature = { nom: '', prenom: '', email: '', telephone: '', sujet: '' };
        this.chargerCandidatures();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  accepter(id: number): void {
    this.candidatureService.updateStatut(id, 'ACCEPTEE').subscribe({
      next: () => this.chargerCandidatures(),
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  refuser(id: number): void {
    this.candidatureService.updateStatut(id, 'REFUSEE').subscribe({
      next: () => this.chargerCandidatures(),
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  supprimer(id: number): void {
    if (confirm('Supprimer cette candidature ?')) {
      this.candidatureService.deleteCandidature(id).subscribe({
        next: () => this.chargerCandidatures(),
        error: (err: any) => console.error('Erreur:', err)
      });
    }
  }
}