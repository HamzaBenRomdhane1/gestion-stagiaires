import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Encadrant {
  private apiUrl = 'http://localhost:3000/api/encadrants';

  constructor(private http: HttpClient) {}

  getEncadrants(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addEncadrant(encadrant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, encadrant);
  }

  updateEncadrant(id: number, encadrant: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, encadrant);
  }

  deleteEncadrant(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getMesStagiaires(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${userId}/stagiaires`);
  }
}