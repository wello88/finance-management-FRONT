
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BonusRequest } from '../components/bonus-request/bonus-request.component';

@Injectable({
  providedIn: 'root'
})
export class BonusRequestService {
  private apiUrl = `${environment.apiUrl}/api/bonus-requests/`;

  constructor(private http: HttpClient) {}

  createBonusRequest(bonusRequest: BonusRequest, attachment?: File): Observable<BonusRequest> {
    const formData = new FormData();
    formData.append('title', bonusRequest.title);
    formData.append('reason', bonusRequest.reason);
    formData.append('amount', bonusRequest.amount.toString());
    if (bonusRequest.assigned_to !== null && bonusRequest.assigned_to !== undefined) {
      formData.append('assigned_to', bonusRequest.assigned_to.toString());
    }
    
    if (attachment) {
      formData.append('attachment', attachment);
    }

    return this.http.post<BonusRequest>(this.apiUrl, formData);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/users/`);
  }
}