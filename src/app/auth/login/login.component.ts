import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/usuario.model';
import { LogoComponent } from '../../shared/components/logo/logo.component';

// Bootstrap Modal declarado globalmente via CDN/bundle
declare const bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  @ViewChild('modalCadastroEl') modalCadastroEl!: ElementRef;

  credentials: LoginRequest = {
    login: '',
    senha: ''
  };

  // Campos do formulário de cadastro
  cadastro = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  loading = false;
  registrando = false;
  emailJaCadastrado = false;

  private modalInstance: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  abrirModalCadastro() {
    this.emailJaCadastrado = false;
    this.cadastro = { nome: '', email: '', senha: '', confirmarSenha: '' };
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.modalCadastroEl.nativeElement);
    }
    this.modalInstance.show();
  }

  fecharModalCadastro() {
    this.modalInstance?.hide();
  }

  registrar(form: NgForm) {
    if (form.invalid) return;
    if (this.cadastro.senha !== this.cadastro.confirmarSenha) return;

    this.registrando = true;
    this.emailJaCadastrado = false;

    const body = {
      nome: this.cadastro.nome,
      email: this.cadastro.email,
      senha: this.cadastro.senha
    };

    this.authService.registrar(body).subscribe({
      next: () => {
        this.registrando = false;
        this.fecharModalCadastro();
        // Pré-preenche o email no formulário de login para facilitar
        this.credentials.login = this.cadastro.email;
        Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado!',
          text: 'Faça login para continuar.',
          confirmButtonColor: '#DB2777',
          timer: 3000,
          timerProgressBar: true
        });
      },
      error: (err: any) => {
        this.registrando = false;
        const msg: string = err.error?.erro || err.error || '';

        if (err.status === 400 && msg.toLowerCase().includes('já existente')) {
          this.emailJaCadastrado = true;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            text: msg || 'Ocorreu um erro inesperado. Tente novamente.',
            confirmButtonColor: '#DB2777'
          });
        }
      }
    });
  }

  login() {
    if (!this.credentials.login || !this.credentials.senha) {
      Swal.fire('Atenção!', 'Por favor, preencha o email e a senha.', 'warning');
      return;
    }

    this.loading = true;
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Login realizado!',
          text: `Bem-vindo!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          const role = this.authService.getUserRole();
          if (role === 'ROLE_ADMIN') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/meus-orcamentos']);
          }
        });
      },
      error: (errorResponse) => {
        this.loading = false;
        console.error('Erro completo no login:', errorResponse);
        
        let mensagemErro = 'Ocorreu um erro inesperado. Tente novamente.';

        if (errorResponse.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else if (errorResponse.error) {
          mensagemErro = errorResponse.error;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Ops... Falha no login',
          text: mensagemErro,
        });
      }
    });
  }
}