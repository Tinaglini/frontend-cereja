import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.notificationService.error(
              'Servidor indisponivel',
              'Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.'
            );
            break;

          case 401:
            this.authService.logout();
            this.router.navigate(['/login']);
            this.notificationService.warning(
              'Sessao expirada',
              'Faca login novamente para continuar.'
            );
            break;

          case 403:
            this.notificationService.warning(
              'Acesso negado',
              'Voce nao possui permissao para esta acao. Tente fazer logout e login novamente.'
            );
            break;

          case 404:
            this.notificationService.error(
              'Nao encontrado',
              'O recurso solicitado nao foi encontrado.'
            );
            break;

          case 500:
            this.notificationService.error(
              'Erro no servidor',
              'Ocorreu um erro interno. Tente novamente mais tarde.'
            );
            break;
        }

        return throwError(() => error);
      })
    );
  }
}
