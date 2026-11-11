import { Component } from '@angular/core';
import { MesStagiaires } from '../../components/mes-stagiaires/mes-stagiaires';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-encadrant-page',
  standalone: true,
  imports: [MesStagiaires, ],
  templateUrl: './encadrant-page.html',
  styleUrl: './encadrant-page.css'
})
export class EncadrantPage {}