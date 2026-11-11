import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Messagerie {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getConversation(user1: number, user2: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/conversation/${user1}/${user2}`);
  }

  envoyer(expediteurId: number, destinataireId: number, contenu: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages`, {
      expediteur_id: expediteurId,
      destinataire_id: destinataireId,
      contenu
    });
  }

  marquerLus(userId: number, contactId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/messages/lire/${userId}/${contactId}`, {});
  }

  getNonLus(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/non-lus/${userId}`);
  }

  getEncadrantDuStagiaire(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stagiaires/utilisateur/${userId}/encadrant`);
  }
}