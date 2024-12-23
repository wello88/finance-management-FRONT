import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  exp: number;
  user_id: number;
  username: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  hasRole(requiredRole: string): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // Debug log

      return decodedToken.role.toUpperCase()  === requiredRole.toUpperCase();;
    } catch (error) {
      console.error('Token decode error:', error);
      return false;
    }
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.role;
    } catch (error) {
      return null;
    }
  }
  getUsername(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.username;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }
  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}