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

  // getBonusRequests(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  createBonusRequest(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateBonusRequest(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, data);
  }

  deleteBonusRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
  // approveBonusRequest(requestId: number): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/${requestId}/approve/`, {});
  // }
  getApprovedBonuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/approved-bonuses/`);
  }
  rejectBonusRequest(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve/`, {
      action: 'REJECTED'
    });
  }

  approveBonusRequest(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve/`, {
      action: 'APPROVED'  
    });
  }

  getBonusRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
