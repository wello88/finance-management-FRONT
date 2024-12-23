// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { BonusService } from '../../services/bonus.service';
// import { NotificationService } from '../../services/notification.service';
// import { CommonModule } from '@angular/common';


import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
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
export class DashboardComponent implements OnInit {

  bonusRequests: any[] = [];
  isFinanceRole = false;
  isLoading = false;
  notifications: string[] = []; // Add missing notifications property

  constructor(
    private bonusService: BonusService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.isFinanceRole = this.authService.hasRole('FINANCE');
    console.log('Token:', localStorage.getItem('access_token')); // Debug log
    console.log('Is Finance Role:', this.isFinanceRole); // Debug log
    this.loadBonusRequests();
  }
  // ngOnInit(): void {
  //   this.fetchBonusRequests();
  // }
  loadBonusRequests(): void {
    this.isLoading = true;
    this.bonusService.getBonusRequests().subscribe({
      next: (requests) => {
        this.bonusRequests = requests;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Failed to load bonus requests');
        this.isLoading = false;
      }
    });
  }

  approveBonusRequest(id: number): void {
    this.bonusService.approveBonusRequest(id).subscribe({
      next: () => {
        this.showSuccess('Bonus request approved');
        this.loadBonusRequests();
      },
      error: () => this.showError('Failed to approve bonus request')
    });
  }

  rejectBonusRequest(id: number): void {
    this.bonusService.rejectBonusRequest(id).subscribe({
      next: () => {
        this.showSuccess('Bonus request rejected');
        this.loadBonusRequests();
      },
      error: () => this.showError('Failed to reject bonus request')
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
  fetchBonusRequests(): void {
    this.bonusService.getBonusRequests().subscribe((data) => {
      this.bonusRequests = data;
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
