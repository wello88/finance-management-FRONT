import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  
  constructor() {
    const userId = this.getUserIdFromToken();
    const wsUrl = environment.getWebSocketUrl(userId);
    this.socket$ = webSocket({
      url: wsUrl,
      deserializer: msg => JSON.parse(msg.data)
    });
  }

  connect() {
    return this.socket$;
  }

  private getUserIdFromToken(): number {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.user_id;
    }
    return 0;
  }
}