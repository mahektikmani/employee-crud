import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7227/api/Auth';

  constructor(private http: HttpClient) {}


  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  
  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      data
    );
  }

  
  saveAuth(token: string, roles: string[]) {
    localStorage.setItem('token', token);
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  
  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn(' AuthService: Token NOT found in localStorage');
    }
    return token;
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  isAdmin(): boolean {
    return this.getRoles().includes('Admin');
  }

  
  isLoggedIn(): boolean {
    const loggedIn = !!this.getToken();
    console.log(` AuthService: Is logged in? ${loggedIn}`);
    return loggedIn;
  }

  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }
}
