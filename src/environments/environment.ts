interface Environment {
  production: boolean;
  apiUrl: string;
  wsUrl: string;
}

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',  // Verify this matches your Django backend
  wsUrl: 'ws://localhost:8000'
};  