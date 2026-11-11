import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Encadrant } from '../../services/encadrant';

@Component({
  selector: 'app-encadrants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encadrants.html',
  styleUrl: './encadrants.css'
})
export class Encadrants implements OnInit {
  encadrants: any[] = [];

  nouvelEncadrant = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    departement: '',
    specialite: '',
    password: ''
  };
  messageAjout = '';
  erreurAjout = '';

  encadrantEnEdition: any = null;

  constructor(
    private encadrantService: Encadrant,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerEncadrants();
  }

  chargerEncadrants(): void {
    this.encadrantService.getEncadrants().subscribe({
      next: (data: any) => {
        this.encadrants = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  ajouterEncadrant(): void {
    this.messageAjout = '';
    this.erreurAjout = '';

    const e = this.nouvelEncadrant;
    if (!e.nom.trim() || !e.prenom.trim() || !e.email.trim()) {
      this.erreurAjout = 'Le nom, le prénom et l\'email sont obligatoires.';
      return;
    }
    if (e.password.length < 6) {
      this.erreurAjout = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    const identifiant = e.email;
    this.encadrantService.addEncadrant(e).subscribe({
      next: () => {
        this.messageAjout = `Encadrant créé. Identifiant de connexion : ${identifiant}`;
        this.nouvelEncadrant = {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          departement: '',
          specialite: '',
          password: ''
        };
        this.chargerEncadrants();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.erreurAjout = err.error?.error || 'Impossible de créer l\'encadrant.';
        this.cdr.detectChanges();
      }
    });
  }

  commencerEdition(encadrant: any): void {
    this.encadrantEnEdition = { ...encadrant };
    this.cdr.detectChanges();
  }

  annulerEdition(): void {
    this.encadrantEnEdition = null;
    this.cdr.detectChanges();
  }

  sauvegarderEdition(): void {
    this.encadrantService.updateEncadrant(this.encadrantEnEdition.id, this.encadrantEnEdition).subscribe({
      next: () => {
        this.encadrantEnEdition = null;
        this.chargerEncadrants();
      },
      error: (err: any) => {
        this.erreurAjout = err.error?.error || 'Impossible de modifier l\'encadrant.';
        this.cdr.detectChanges();
      }
    });
  }

  supprimerEncadrant(id: number): void {
    if (confirm('Supprimer cet encadrant et son compte ? Ses stagiaires n\'auront plus d\'encadrant.')) {
      this.encadrantService.deleteEncadrant(id).subscribe({
        next: () => this.chargerEncadrants(),
        error: (err: any) => console.error('Erreur:', err)
      });
    }
  }
}