import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stage } from '../../services/stage';

@Component({
  selector: 'app-stages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stages.html',
  styleUrl: './stages.css'
})
export class Stages implements OnInit {
  stages: any[] = [];

  nouveauStage = {
    stagiaire_id: 1,
    encadrant_id: 1,
    titre: '',
    date_debut: '',
    date_fin: '',
    statut: 'EN_ATTENTE'
  };

  stageEnEdition: any = null;

  constructor(
    private stageService: Stage,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerStages();
  }

  chargerStages(): void {
    this.stageService.getStages().subscribe({
      next: (data: any) => {
        this.stages = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  ajouterStage(): void {
    this.stageService.addStage(this.nouveauStage).subscribe({
      next: () => {
        this.nouveauStage = {
          stagiaire_id: 1,
          encadrant_id: 1,
          titre: '',
          date_debut: '',
          date_fin: '',
          statut: 'EN_ATTENTE'
        };
        this.chargerStages();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  commencerEdition(stage: any): void {
    this.stageEnEdition = { ...stage };
    this.cdr.detectChanges();
  }

  annulerEdition(): void {
    this.stageEnEdition = null;
    this.cdr.detectChanges();
  }

  sauvegarderEdition(): void {
    this.stageService.updateStage(this.stageEnEdition.id, this.stageEnEdition).subscribe({
      next: () => {
        this.stageEnEdition = null;
        this.chargerStages();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  supprimerStage(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce stage ?')) {
      this.stageService.deleteStage(id).subscribe({
        next: () => this.chargerStages(),
        error: (err: any) => console.error('Erreur:', err)
      });
    }
  }
}