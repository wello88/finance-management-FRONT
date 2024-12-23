import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BonusService } from '../../services/bonus.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';
import { WebSocketService } from '../../services/websocket.service';


Chart.register(...registerables);

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatSnackBarModule,
        MatTableModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('bonusChart') bonusChart!: ElementRef;
  private chart: Chart | null = null;

  bonusRequests: any[] = [];
  isFinanceRole = false;
  username: string | null = null;
  isLoading = false;
  notifications: string[] = [];

  constructor(
    private bonusService: BonusService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService  // Add WebSocket service

  ) {}

  ngOnInit(): void {
    this.isFinanceRole = this.authService.hasRole('FINANCE');
    this.username = this.authService.getUsername();
    this.loadBonusRequests();
    this.connectWebSocket();  // Add WebSocket connection

  }

  private connectWebSocket(): void {
    this.webSocketService.connect().subscribe({
      next: (notification: any) => {
        console.log('Received notification:', notification);
        this.notifications.unshift(notification.message);
        this.showSuccess(notification.message);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });
  }

  ngAfterViewInit() {
      // Only initialize chart for finance role
  if (this.isFinanceRole) {
    setTimeout(() => {
      this.initializeChart();
      if (this.bonusRequests.length > 0) {
        this.updateChart(this.bonusRequests);
      }
    }, 100);
  }

  }

  private initializeChart() {
    if (!this.bonusChart) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = this.bonusChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Approved Bonus Amounts',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
  }

  private updateChart(requests: any[]) {
    if (!this.chart) {
      console.error('Chart not initialized');
      return;
    }

    // Filter approved requests
    const approvedRequests = requests.filter(req => req.status === 'APPROVED');
    console.log('Approved requests:', approvedRequests);

    // Group by month using created_at
    const monthlyData = approvedRequests.reduce((acc: any, request: any) => {
      if (!request.created_at) {
        console.log('Request missing created_at:', request);
        return acc;
      }

      const date = new Date(request.created_at);
      if (isNaN(date.getTime())) {
        console.log('Invalid created_at date:', request.created_at);
        return acc;
      }

      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }

      // Parse amount, assuming it's a number or string
      const amount = typeof request.amount === 'string' ? 
                    parseFloat(request.amount.replace(/[^0-9.-]+/g, '')) : 
                    parseFloat(request.amount) || 0;

      acc[monthYear] += amount;
      return acc;
    }, {});

    console.log('Processed monthly data:', monthlyData);

    // Sort months chronologically
    const sortedLabels = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Update chart
    this.chart.data.labels = sortedLabels;
    this.chart.data.datasets[0].data = sortedLabels.map(label => monthlyData[label]);
    
    this.chart.update();
  }

  createBonusRequest(): void {
    this.router.navigate(['/bonus-request']);
  }

  loadBonusRequests(): void {
    this.isLoading = true;
    this.bonusService.getBonusRequests().subscribe({
      next: (requests) => {
        console.log('Received bonus requests:', requests);
        this.bonusRequests = requests;
        if (this.chart&& this.isFinanceRole) {
          this.updateChart(requests);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bonus requests:', error);
        console.error('Error loading requests:', error);
        this.snackBar.open('Error loading requests. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }


  approveBonusRequest(id: number): void {
    this.isLoading = true;
    this.bonusService.approveBonusRequest(id).subscribe({
      next: (response) => {
        this.snackBar.open('Request approved successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadBonusRequests(); // Refresh the table
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error approving request:', error);
        this.snackBar.open('Error approving request. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  rejectBonusRequest(id: number): void {
    this.isLoading = true;
    this.bonusService.rejectBonusRequest(id).subscribe({
      next: (response) => {
        const index = this.bonusRequests.findIndex(req => req.id === id);
      if (index !== -1) {
        this.bonusRequests[index].status = 'REJECTED';
      }
        this.snackBar.open('Request rejected successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadBonusRequests(); // Refresh the table
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
        this.snackBar.open('Error rejecting request. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}