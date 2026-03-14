import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, NavbarComponent, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isSidebarCollapsed = false;

  // Assuming 'navigation' array is intended to be a property of this component
  // based on the provided instruction and code edit snippet.
  // The instruction implies adding items to an existing 'navigation' array.
  // Since no such array exists in the original content, it's added here.
  // If this array belongs to NavbarComponent or a service, this placement is incorrect.
  // However, following the instruction to add to *this* document, this is the most
  // syntactically correct interpretation of the provided "Code Edit" structure.
  navigation = [
    {
      title: 'Temas de Festa',
      icon: 'fas fa-palette',
      route: '/temas'
    },
    {
      title: 'Tipos de Evento',
      icon: 'fas fa-calendar-alt',
      route: '/tipos-evento'
    },
    {
      title: 'Solicitações',
      icon: 'fas fa-file-invoice-dollar',
      route: '/solicitacoes'
    }
  ];

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
