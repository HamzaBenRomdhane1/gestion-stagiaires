import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Stage {
  private apiUrl = 'http://localhost:3000/api/stages';

  constructor(private http: HttpClient) {}

  getStages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addStage(stage: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, stage);
  }

  updateStage(id: number, stage: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, stage);
  }

  deleteStage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}