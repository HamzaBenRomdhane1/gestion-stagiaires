import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Encadrant } from '../../services/encadrant';
import { Avancement } from '../../services/avancement';

@Component({
  selector: 'app-encadrant-avancement-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encadrant-avancement-page.html',
  styleUrl: './encadrant-avancement-page.css'
})
export class EncadrantAvancementPage implements OnInit {
  stagiaires: any[] = [];
  depots: { [stagiaireId: number]: any[] } = {};
  chargement = true;
  erreur = '';

  constructor(
    private encadrantService: Encadrant,
    private avancementService: Avancement,
    private cdr: ChangeDetectorRef
  ) {}

  get totalDepots(): number {
    return this.stagiaires.reduce((total, s) => total + Number(s.nb_depots || 0), 0);
  }

  get moyenne(): number {
    if (this.stagiaires.length === 0) return 0;
    const somme = this.stagiaires.reduce((total, s) => total + Number(s.avancement_actuel || 0), 0);
    return Math.round(somme / this.stagiaires.length);
  }

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!utilisateur) {
      this.chargement = false;
      return;
    }

    this.encadrantService.getMesStagiaires(utilisateur.id).subscribe({
      next: (data: any) => {
        this.stagiaires = data;
        this.chargement = false;
        this.cdr.detectChanges();
        data.forEach((s: any) => this.chargerDepots(s.id));
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.erreur = err.error?.error || 'Impossible de charger vos stagiaires.';
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  chargerDepots(stagiaireId: number): void {
    this.avancementService.getParStagiaire(stagiaireId).subscribe({
      next: (data: any) => {
        this.depots[stagiaireId] = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur avancement:', err)
    });
  }
}