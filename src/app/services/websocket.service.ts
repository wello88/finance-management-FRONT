import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  private userId: number;

  constructor() {
    this.userId = this.getUserIdFromToken();
    this.socket$ = webSocket({
      url: `${environment.wsUrl}/ws/user_${this.userId}/`
    });
  }

  connect(): Observable<Notification> {
    return this.socket$.asObservable();
  }

  private getUserIdFromToken(): number {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.user_id;
    }
    return 0;
  }
}