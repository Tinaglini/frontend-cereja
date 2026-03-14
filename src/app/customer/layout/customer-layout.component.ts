import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.scss'
})
export class CustomerLayoutComponent {
  userEmail: string = '';
  userName: string = '';
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getCurrentUserValue();
    if (user) {
      this.userEmail = user.email;
      this.userName = user.nome || user.email.split('@')[0];
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
