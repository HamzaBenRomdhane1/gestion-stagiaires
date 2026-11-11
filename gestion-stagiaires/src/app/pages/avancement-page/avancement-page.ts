import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { Stagiaire } from '../../services/stagiaire';
import { Avancement } from '../../services/avancement';

@Component({
  selector: 'app-avancement-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avancement-page.html',
  styleUrl: './avancement-page.css'
})
export class AvancementPage implements OnInit {
  @ViewChild('fichierInput') fichierInput?: ElementRef<HTMLInputElement>;

  profil: any = null;
  depots: any[] = [];
  chargement = true;
  envoiEnCours = false;
  message = '';
  erreur = '';
  fichierChoisi: File | null = null;

  nouveau = { titre: '', description: '', pourcentage: 0 };

  constructor(
    private stagiaireService: Stagiaire,
    private avancementService: Avancement,
    private cdr: ChangeDetectorRef
  ) {}

  get avancementActuel(): number {
    return this.depots.length > 0 ? this.depots[0].pourcentage : 0;
  }

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!utilisateur) {
      this.chargement = false;
      return;
    }

    this.stagiaireService.getProfil(utilisateur.id).subscribe({
      next: (profil: any) => {
        this.profil = profil;
        this.chargement = false;
        this.cdr.detectChanges();
        if (profil.statut_dossier === 'ACCEPTE') this.charger(true);
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  charger(initialiserCurseur = false): void {
    this.avancementService.getParStagiaire(this.profil.id).subscribe({
      next: (data: any) => {
        this.depots = data;
        if (initialiserCurseur) this.nouveau.pourcentage = this.avancementActuel;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  onFichier(event: any): void {
    this.fichierChoisi = event.target.files[0] || null;
  }

  deposer(): void {
    this.message = '';
    this.erreur = '';

    if (!this.nouveau.titre.trim()) {
      this.erreur = 'Le titre est obligatoire.';
      return;
    }

    this.envoiEnCours = true;

    if (this.fichierChoisi) {
      this.stagiaireService.uploadFichier(this.fichierChoisi).subscribe({
        next: (res: any) => this.enregistrer(res.chemin),
        error: () => {
          this.erreur = "Échec de l'envoi du fichier.";
          this.envoiEnCours = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.enregistrer(null);
    }
  }

  private enregistrer(chemin: string | null): void {
    const depot = {
      stagiaire_id: this.profil.id,
      titre: this.nouveau.titre,
      description: this.nouveau.description,
      fichier: chemin,
      pourcentage: Number(this.nouveau.pourcentage)
    };

    this.avancementService.deposer(depot).subscribe({
      next: () => {
        this.nouveau.titre = '';
        this.nouveau.description = '';
        this.fichierChoisi = null;
        if (this.fichierInput) this.fichierInput.nativeElement.value = '';
        this.envoiEnCours = false;
        this.message = 'Dépôt envoyé. Votre encadrant a été prévenu.';
        this.charger(true);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.erreur = err.error?.error || "Impossible d'enregistrer le dépôt.";
        this.envoiEnCours = false;
        this.cdr.detectChanges();
      }
    });
  }
}