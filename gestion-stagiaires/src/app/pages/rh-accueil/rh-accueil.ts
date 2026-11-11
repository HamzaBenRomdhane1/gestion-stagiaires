import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Stagiaire } from '../../services/stagiaire';
import { Encadrant } from '../../services/encadrant';
import { Candidature } from '../../services/candidature';

@Component({
  selector: 'app-rh-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rh-accueil.html',
  styleUrl: './rh-accueil.css'
})
export class RhAccueil implements OnInit {
  stagiaires: any[] = [];
  encadrants: any[] = [];
  candidatures: any[] = [];

  recherche = '';
  resultats: any[] = [];

  constructor(
    private stagiaireService: Stagiaire,
    private encadrantService: Encadrant,
    private candidatureService: Candidature,
    private cdr: ChangeDetectorRef
  ) {}

  get candidaturesEnAttente(): number {
    return this.candidatures.filter((c) => c.statut === 'EN_ATTENTE').length;
  }

  get dossiersAValider(): any[] {
    return this.stagiaires.filter((s) => s.statut_dossier === 'EN_ATTENTE');
  }

  ngOnInit(): void {
    this.stagiaireService.getStagiaires().subscribe({
      next: (data: any) => {
        this.stagiaires = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });

    this.encadrantService.getEncadrants().subscribe({
      next: (data: any) => {
        this.encadrants = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });

    this.candidatureService.getCandidatures().subscribe({
      next: (data: any) => {
        this.candidatures = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  chercher(valeur: string): void {
    this.recherche = valeur;
    const q = valeur.trim().toLowerCase();

    if (q.length < 2) {
      this.resultats = [];
      return;
    }

    const correspond = (p: any) => `${p.nom} ${p.prenom} ${p.email}`.toLowerCase().includes(q);

    const stagiaires = this.stagiaires
      .filter(correspond)
      .map((p) => ({ ...p, type: 'Stagiaire', lien: '/rh/stagiaires' }));
    const encadrants = this.encadrants
      .filter(correspond)
      .map((p) => ({ ...p, type: 'Encadrant', lien: '/rh/encadrants' }));

    this.resultats = [...stagiaires, ...encadrants].slice(0, 8);
  }
}