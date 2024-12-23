import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

interface AuthResponse {
  access: string;
  refresh?: string;
}

interface Credentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: Credentials = { username: '', password: '' };
  isLoading = false;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    if (!this.credentials.username || !this.credentials.password) {
      this.snackBar.open('Please enter both username and password', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    
    this.http.post<AuthResponse>(`${environment.apiUrl}/api/token/`, this.credentials)
      .subscribe({
        next: (response: AuthResponse) => {
          localStorage.setItem('access_token', response.access);
          this.snackBar.open('Login Successful', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Login failed';
          
          if (error.status === 401) {
            errorMessage = 'Invalid username or password';
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server';
          }
          
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
