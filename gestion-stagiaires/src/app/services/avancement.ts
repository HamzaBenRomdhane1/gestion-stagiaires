import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Avancement {
  private apiUrl = 'http://localhost:3000/api/avancements';

  constructor(private http: HttpClient) {}

  getParStagiaire(stagiaireId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stagiaire/${stagiaireId}`);
  }

  deposer(depot: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, depot);
  }
}