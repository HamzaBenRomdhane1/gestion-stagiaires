import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stagiaire } from '../../services/stagiaire';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-sujet-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sujet-page.html',
  styleUrl: './sujet-page.css'
})
export class SujetPage implements OnInit {
  profil: any = null;
  sujet: any = null;
  chargement = true;

  constructor(
    private stagiaireService: Stagiaire,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!utilisateur) {
      this.chargement = false;
      return;
    }

    this.stagiaireService.getProfil(utilisateur.id).subscribe({
      next: (profil: any) => {
        this.profil = profil;
        if (profil.sujet_id) {
          this.stagiaireService.getSujet(profil.sujet_id).subscribe({
            next: (sujet: any) => {
              this.sujet = sujet;
              this.chargement = false;
              this.cdr.detectChanges();
            },
            error: () => {
              this.chargement = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.chargement = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  get sections(): any[] {
    if (!this.sujet?.cahier_charge) return [];
    const resultat: any[] = [];
    let courante: any = null;

    for (const ligne of this.sujet.cahier_charge.split('\n')) {
      const l = ligne.trim();
      if (!l) continue;

      if (l.startsWith('## ')) {
        courante = { titre: l.substring(3), lignes: [] };
        resultat.push(courante);
      } else {
        if (!courante) {
          courante = { titre: '', lignes: [] };
          resultat.push(courante);
        }
        courante.lignes.push(
          l.startsWith('- ')
            ? { item: true, texte: l.substring(2) }
            : { item: false, texte: l }
        );
      }
    }
    return resultat;
  }
}