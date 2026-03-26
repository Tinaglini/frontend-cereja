import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.getToken() || this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authService.getUserRole();
    if (role === 'ROLE_USER' || role === 'ROLE_ADMIN') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
