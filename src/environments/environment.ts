interface Environment {
  production: boolean;
  apiUrl: string;
  wsUrl: string;
  getWebSocketUrl: (userId: number) => string;

}

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',  // Verify this matches your Django backend
  wsUrl: 'ws://localhost:8001',
  getWebSocketUrl: (userId: number) => `${environment.wsUrl}/ws/notifications/${userId}/`

};  