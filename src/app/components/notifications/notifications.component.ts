import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/notification.service';

interface CustomNotification {
  id?: number;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule, 
    MatSnackBarModule, 
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private wsSubscription!: Subscription;
  notifications: CustomNotification[] = [];

  constructor(
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.connectWebSocket();
  }

  connectWebSocket(): void {
    this.wsSubscription = this.webSocketService.connect()
      .subscribe({
        next: (value: any) => {
          const notification: CustomNotification = {
            message: value.message,
            timestamp: new Date()
          };
          this.handleNewNotification(notification);
        },
        error: (error) => {
          console.error('WebSocket error:', error);
          this.snackBar.open('Connection error', 'Close', {
            duration: 3000
          });
          setTimeout(() => this.connectWebSocket(), 5000);
        }
      });
  }

  handleNewNotification(notification: CustomNotification): void {
    this.notifications.push(notification);
    this.snackBar.open(notification.message, 'Close', {
      duration: 3000
    });
  }

  sendNotification(message: string): void {
    const notification: CustomNotification = {
      message,
      timestamp: new Date()
    };
    this.handleNewNotification(notification);
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }
}