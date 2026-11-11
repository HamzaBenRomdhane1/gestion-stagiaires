import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Stagiaire {
  private apiUrl = 'http://localhost:3000/api/stagiaires';

  constructor(private http: HttpClient) {}

  getStagiaires(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addStagiaire(stagiaire: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, stagiaire);
  }

  updateStagiaire(id: number, stagiaire: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, stagiaire);
  }

  deleteStagiaire(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getProfil(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profil/${userId}`);
  }

  updateProfil(id: number, profil: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profil/${id}`, profil);
  }

  updateStatutDossier(id: number, statut_dossier: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/statut/${id}`, { statut_dossier });
  }

  updateDossier(id: number, dossier: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/dossier/${id}`, dossier);
  }

  uploadFichier(fichier: File): Observable<any> {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return this.http.post<any>('http://localhost:3000/api/upload', formData);
  }

  tirerSujet(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/tirer-sujet`, {});
  }

  getSujet(sujetId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/sujets/${sujetId}`);
  }

  affecterEncadrant(id: number, encadrantId: number | null): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/encadrant`, { encadrant_id: encadrantId });
  }
}