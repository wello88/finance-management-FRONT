import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class FileUploadDialogComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadError: string | null = null;
  uploadSuccess: boolean = false;
  allowedFileTypes = ['.jpg', '.png', '.pdf'];
  maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<FileUploadDialogComponent>) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.uploadError = null;
        this.uploadSuccess = false;
      }
    }
  }

  validateFile(file: File): boolean {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedFileTypes.includes(fileExtension)) {
      this.uploadError = 'Invalid file type. Allowed types: ' + this.allowedFileTypes.join(', ');
      return false;
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      this.uploadError = 'File size exceeds 5MB limit';
      return false;
    }

    return true;
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file first';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post(`${environment.apiUrl}/api/attachments/`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadSuccess = true;
          this.uploadProgress = 100;
          this.selectedFile = null;
          this.dialogRef.close();
        }
      },
      error: (error) => {
        this.uploadError = 'Upload failed: ' + (error.message || 'Unknown error');
        this.uploadProgress = 0;
      }
    });
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.uploadSuccess = false;
  }

  get fileName(): string {
    return this.selectedFile ? this.selectedFile.name : 'No file selected';
  }
}