import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

interface JwtPayload {
  id?: number;
  userId?: number;
  usuarioId?: number;
  role?: string | string[];
  roles?: string | string[];
  authorities?: string | string[];
  scope?: string | string[];
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = environment.SERVIDOR + '/api/auth/login';
  private readonly registerUrl = environment.SERVIDOR + '/api/auth/registrar';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<Usuario | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  registrar(dados: { nome: string; email: string; senha: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.registerUrl, dados);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap(response => {
        const token = response.tokenJWT || response.token;
        if (token) {
          localStorage.setItem('token', token);

          const payload = this.decodeToken(token);
          const role = payload ? this.extractRole(payload) : null;
          const userId = payload?.id || payload?.userId || payload?.usuarioId;

          const usuario: Usuario = response.usuario || {
            id: userId,
            email: credentials.login,
            nome: credentials.login.split('@')[0],
            role: role ?? undefined
          };

          localStorage.setItem('user', JSON.stringify(usuario));
          this.currentUser.next(usuario);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): Observable<Usuario | null> {
    return this.currentUser.asObservable();
  }

  getCurrentUserValue(): Usuario | null {
    return this.currentUser.value;
  }

  getUserRole(): string | null {
    const payload = this.decodeToken(this.getToken());
    if (!payload) return null;
    return this.extractRole(payload);
  }

  getUserId(): number | null {
    const payload = this.decodeToken(this.getToken());
    if (!payload) return null;
    return payload.id || payload.userId || payload.usuarioId || null;
  }

  isTokenExpired(): boolean {
    const payload = this.decodeToken(this.getToken());
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private decodeToken(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private extractRole(payload: JwtPayload): string | null {
    const authClaim = payload.roles || payload.authorities || payload.role || payload.scope || '';

    if (Array.isArray(authClaim)) {
      if (authClaim.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
      if (authClaim.includes('ROLE_USER')) return 'ROLE_USER';
      return authClaim[0] || null;
    }

    if (typeof authClaim === 'string') {
      if (authClaim.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
      if (authClaim.includes('ROLE_USER')) return 'ROLE_USER';
      return authClaim || null;
    }

    return null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}