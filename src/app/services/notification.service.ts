import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageSubject = new Subject<string>();  // Subject to emit notifications
  message$ = this.messageSubject.asObservable();   // Observable to subscribe to

  private socket: WebSocket | null = null;

  constructor() {
    this.initializeWebSocket();
  }

  /**
   * Initialize WebSocket connection.
   */
  private initializeWebSocket(): void {
    const socketUrl = 'ws://localhost:8000/ws/notifications';  // WebSocket server URL

    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      this.messageSubject.next(message);  // Push the message to subscribers
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  /**
   * Emit a message through WebSocket.
   * @param message - Message to be sent to the WebSocket server
   */
  emitMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }

  /**
   * Clear all notifications (can be used when the user logs out or closes the app)
   */
  clearMessages(): void {
    this.messageSubject.complete();
    this.messageSubject = new Subject<string>();  // Recreate the subject
  }
}


export interface Notification {
  type: string;
  message: string;
  bonus_id: number;
  notification_id: number;
  created_at: string;
}