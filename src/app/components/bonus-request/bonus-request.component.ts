import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BonusRequestService } from '../../services/bonus-request.service';
import { FileUploadDialogComponent } from '../file-upload/file-upload.component';

export interface BonusRequest {
  title: string;
  reason: string;
  amount: number;
  assigned_to: number | null;
  attachment?: File | null;
}

@Component({
  selector: 'app-bonus-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './bonus-request.component.html',
  styleUrls: ['./bonus-request.component.scss']
})
export class BonusRequestComponent implements OnInit {
  bonusRequest: BonusRequest = {
    title: '',
    reason: '',
    amount: 0,
    assigned_to: null
  };

  selectedFile: File | null = null;
  users: any[] = [];
  isSubmitting = false;

  constructor(
    private bonusRequestService: BonusRequestService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.bonusRequestService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => this.showError('Failed to load users')
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitForm() {
    this.isSubmitting = true;
    this.bonusRequestService.createBonusRequest(this.bonusRequest, this.selectedFile ?? undefined)
      .subscribe({
        next: (response) => {
          this.showSuccess('Bonus request submitted successfully');
          this.resetForm();
        },
        error: (error) => {
          this.showError('Failed to submit bonus request');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  resetForm() {
    this.bonusRequest = {
      title: '',
      reason: '',
      amount: 0,
      assigned_to: null
    };
    this.selectedFile = null;
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  openFileUploadDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}