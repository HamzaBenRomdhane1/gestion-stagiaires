import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notif {
  private apiUrl = 'http://localhost:3000/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  marquerLue(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/lu`, {});
  }

  toutMarquerLu(userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/utilisateur/${userId}/lire-tout`, {});
  }
}