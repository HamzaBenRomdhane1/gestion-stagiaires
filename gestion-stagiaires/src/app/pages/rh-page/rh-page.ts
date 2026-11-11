import { Component } from '@angular/core';
import { ListeStagiaires } from '../../components/liste-stagiaires/liste-stagiaires';
import { Candidatures } from '../../components/candidatures/candidatures';
import { Encadrants } from '../../components/encadrants/encadrants';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-rh-page',
  standalone: true,
  imports: [ListeStagiaires, Candidatures, Encadrants, Header],
  templateUrl: './rh-page.html',
  styleUrl: './rh-page.css'
})
export class RhPage {}