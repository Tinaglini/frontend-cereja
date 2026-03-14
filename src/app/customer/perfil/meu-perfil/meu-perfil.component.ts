import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meu-perfil.component.html',
  styleUrl: './meu-perfil.component.scss'
})
export class MeuPerfilComponent implements OnInit {

  usuario: any = {
    nome: '',
    email: '',
    telefone: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUserValue();
    if(user) {
      this.usuario.nome = user.nome || (user.email.split('@')[0]);
      this.usuario.email = user.email;
      // Removido this.usuario.telefone pois a interface Usuario não possui o campo
    }
  }

  salvarPerfil() {
    // Aqui seria chamada uma API para atualizar os dados, ex: this.clienteService.atualizarPerfil(...)
    Swal.fire({
      icon: 'success',
      title: 'Perfil Atualizado!',
      text: 'Suas informações foram salvas com sucesso.',
      confirmButtonColor: '#DB2777'
    });
  }
}
