import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Candidature {
  private apiUrl = 'http://localhost:3000/api/candidatures';

  constructor(private http: HttpClient) {}

  getCandidatures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCandidature(candidature: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, candidature);
  }

  updateStatut(id: number, statut: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { statut });
  }

  deleteCandidature(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}