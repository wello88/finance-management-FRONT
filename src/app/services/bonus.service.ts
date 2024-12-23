import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BonusService {
  private apiUrl = `${environment.apiUrl}/api/bonus-requests`;

  constructor(private http: HttpClient) {}

  getBonusRequests(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createBonusRequest(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateBonusRequest(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, data);
  }

  deleteBonusRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
  approveBonusRequest(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve/`, { action: 'APPROVED' });
  }

  rejectBonusRequest(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve/`, { action: 'REJECTED' });
  }
}
