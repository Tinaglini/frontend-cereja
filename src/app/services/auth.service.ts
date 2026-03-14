import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = environment.SERVIDOR + '/api/auth/login';
  private readonly registerUrl = environment.SERVIDOR + '/api/auth/registrar';

  // Este BehaviorSubject vai "transmitir" o status de login para quem quiser ouvir (como a Navbar)
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  // BehaviorSubject para armazenar dados do usuário logado
  private currentUser = new BehaviorSubject<Usuario | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap(response => {
        const token = response.tokenJWT || response.token;
        if (token) {
          localStorage.setItem('token', token);
          
          let role = null;
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            role = payload.role || payload.roles || payload.authorities || payload.scope || '';
            if (Array.isArray(role)) role = role[0];
          } catch (e) {
            console.error('Erro ao decodificar token payload no login', e);
          }
          
          const usuario: Usuario = response.usuario || {
            email: credentials.login,
            nome: credentials.login.split('@')[0],
            role: role
          };

          localStorage.setItem('user', JSON.stringify(usuario));
          this.currentUser.next(usuario);
          this.loggedIn.next(true); // Avisa que o login foi feito com sucesso
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this.loggedIn.next(false); // Avisa que o logout foi feito
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // A Navbar vai "ouvir" este Observable para saber se mostra "Login" ou "Logout"
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Método para obter dados do usuário atual
  getCurrentUser(): Observable<Usuario | null> {
    return this.currentUser.asObservable();
  }

  // Método para obter dados do usuário atual (síncrono)
  getCurrentUserValue(): Usuario | null {
    return this.currentUser.value;
  }

  // Verifica qual a role do token decodificado
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // spring boot JWT costuma colocar as roles em um claim de array ou comma-separated string
      // Vamos tentar algumas convenções comuns, dependendo de como o backend gerou
      // Se houver múltiplas, pegaremos a de maior privilégio 
      const authClaim = payload.roles || payload.authorities || payload.role || payload.scope || '';
      
      if (Array.isArray(authClaim)) {
        if (authClaim.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
        if (authClaim.includes('ROLE_USER')) return 'ROLE_USER';
        return authClaim[0] || null;
      }
      
      if (typeof authClaim === 'string') {
        if (authClaim.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
        if (authClaim.includes('ROLE_USER')) return 'ROLE_USER';
        return authClaim;
      }

      return null;
    } catch (e) {
      console.error('Erro ao decodificar token', e);
      return null;
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user;
      } catch (error) {
        console.error('Erro ao fazer parse do usuário:', error);
        return null;
      }
    }
    return null;
  }
}