# Coding Conventions

**Analysis Date:** 2026-03-19

## Naming Patterns

**Files:**
- Components: `component-name.component.ts` (kebab-case)
  - Example: `cliente-form.component.ts`, `solicitacao-list.component.ts`
- Services: `service-name.service.ts` (kebab-case)
  - Example: `cliente.service.ts`, `auth.service.ts`
- Models/Interfaces: `model-name.model.ts` (kebab-case)
  - Example: `cliente.model.ts`, `solicitacao-orcamento.model.ts`
- Spec files: `component-name.component.spec.ts` or `service-name.service.spec.ts`
- Directories: kebab-case (e.g., `cliente`, `solicitacao`, `tipo-evento`)

**Classes & Components:**
- PascalCase: `ClienteService`, `SolicitacaoFormComponent`, `AuthInterceptor`
- Angular decorators use PascalCase with exported keywords
  - Example: `@Injectable()`, `@Component()`, `export class ClienteService`

**Functions & Methods:**
- camelCase: `carregarTodos()`, `buscarPorId()`, `aplicarFiltros()`, `salvar()`
- Common patterns:
  - Data loading: `carregarXxx()`, `buscarXxx()`
  - Form submission: `salvar()`, `atualizar()`, `deletar()`
  - Filtering: `aplicarFiltros()`, `filtrar()`
  - Closing modals: `fecharModalXxx()`

**Variables:**
- camelCase for local/property variables
  - Public properties: `clientes: Cliente[] = []`, `loading = false`
  - Private properties: `private notifications$: Observable<Notification[]>`
  - Form models: `cliente: Cliente`, `solicitacaoReq: SolicitacaoOrcamentoRequest`
- Boolean flags use meaningful names: `isEditando`, `loading`, `registrando`, `isReadOnly`, `emailJaCadastrado`

**Types & Interfaces:**
- PascalCase for interfaces and types: `Cliente`, `SolicitacaoOrcamento`, `LoginRequest`
- Properties inside interfaces use camelCase
- Types exported from model files: `NotificationType = 'success' | 'error' | 'warning' | 'info'`

**Constants:**
- Observable streams end with `$`: `loggedIn$`, `notifications$`, `currentUser$`
- API endpoints built from environment: `this.API = environment.SERVIDOR + '/api/clientes'`

## Code Style

**Formatting:**
- No explicit formatter configured (no .prettierrc, .eslintrc files detected in root)
- TypeScript strict mode enabled: `"strict": true` in `tsconfig.json`
- SCSS is the style language for all components (`inlineStyleLanguage: "scss"`)
- Components use standalone: `standalone: true` in all recent components

**Linting:**
- No ESLint or Prettier configuration files found
- TypeScript strict compiler options enforced:
  - `noImplicitOverride: true`
  - `noPropertyAccessFromIndexSignature: true`
  - `noImplicitReturns: true`
  - `noFallthroughCasesInSwitch: true`

**Language Target:**
- Target: ES2022
- Module: ES2022

## Import Organization

**Order:**
1. Angular core and common modules (`@angular/core`, `@angular/common`, etc.)
2. Angular forms and routing (`@angular/forms`, `@angular/router`)
3. RxJS imports (`rxjs`, `rxjs/operators`)
4. Internal models and services (relative paths `../models/`, `../services/`)
5. Third-party libraries (`sweetalert2`, `mdb-angular-ui-kit`)
6. Global declarations (`declare const bootstrap`)

**Path Aliases:**
- No path aliases configured in `tsconfig.json` (uses relative imports only)
- Standard pattern: `import { XService } from '../../../services/x.service'`
- Models imported from: `import { Client } from '../../../models/client.model'`

**Example Import Block:**
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';
```

## Error Handling

**Patterns:**
- Observable subscription pattern with `next/error` handlers:
  ```typescript
  this.clienteService.buscarTodos().subscribe({
    next: (dados) => {
      // Handle success
    },
    error: (erro) => {
      console.error('Error message:', erro);
      // Show user-facing error via Swal or NotificationService
    }
  });
  ```
- Try-catch blocks for JWT decoding in `AuthService`:
  ```typescript
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Use decoded payload
  } catch (e) {
    console.error('Erro ao decodificar token', e);
  }
  ```
- Error messages from response:
  - Check `error.error`, `error.message`, `error.status`
  - Provide fallback messages based on HTTP status codes
  - Example: status 0 = connection failure, 404 = not found, 500 = server error

**User-Facing Errors:**
- SweetAlert2 (`Swal.fire()`) for critical errors and confirmations
- NotificationService for less critical notifications (`warning()`, `success()`, `info()`)
- Console.error() for server response logging and debugging

## Logging

**Framework:** console methods (no abstraction layer for non-error logs)

**Patterns:**
- `console.error()` for errors in subscription handlers:
  - `console.error('Erro ao carregar clientes:', error)`
  - `console.error('Erro ao decodificar token', e)`
- `console.log()` used sparingly for success confirmations:
  - `console.log('Cliente salvo com sucesso:', clienteSalvo)`
  - `console.log('Clientes carregados:', clientes)`
- Logging happens in error handlers and sometimes in success handlers (not consistent)
- No structured logging or log levels beyond console methods

## Comments

**When to Comment:**
- Explain complex logic or non-obvious transformations
- Example: Data transformation in `SolicitacaoFormComponent`:
  ```typescript
  // Transformar Date em string (YYYY-MM-DD para usar no type="date")
  let dataStr = '';
  if(dados.dataEvento) {
    const d = new Date(dados.dataEvento);
    dataStr = d.toISOString().split('T')[0];
  }
  ```
- Comments for conditional logic and filters:
  ```typescript
  // Filtro por status
  if (this.filtroStatus === 'ativo') {
    filtrados = filtrados.filter(t => t.ativo);
  }
  ```
- Comments for role-based visibility:
  ```typescript
  // Só adiciona o token se a requisição for para a nossa API e não for para o login/registro
  if (token && isApiUrl && !request.url.includes('/auth/')) {
  ```

**JSDoc/TSDoc:**
- Not systematically used
- No @param, @returns, or type documentation in most functions
- Some input properties documented with comments:
  ```typescript
  @Input() size: number = 48;
  @Input() cherryColor: string = '#e11d48'; // Red/Pink (Danger/Cherry natural)
  ```

## Function Design

**Size:**
- Typical methods range from 10-60 lines
- Larger components like `ClienteListComponent` (~217 lines) handle multiple concerns
- Service methods are generally 1-10 lines (simple CRUD operations)

**Parameters:**
- Single parameter or data object preferred
- Example: `buscarPorId(id: number)`, `atualizar(id: number, cliente: Cliente)`
- Constructor injection pattern standard in all services
- Components use `inject()` helper or constructor injection

**Return Values:**
- Services return `Observable<T>` for HTTP operations
- Methods return `void` for side-effect operations (loading state, filtering)
- No null coalescing - optional properties use `?` in interfaces

## Module Design

**Exports:**
- Standalone components: `standalone: true` (no shared modules)
- Components import what they need: `imports: [CommonModule, FormsModule, RouterModule]`
- Services use `providedIn: 'root'` pattern for dependency injection

**Barrel Files:**
- Not used - imports are direct file references
- Example: `import { Cliente } from '../../../models/cliente.model'` (not from barrel index)

## HTML/Template Conventions

**Template Syntax:**
- Two-way binding with `[(ngModel)]` for form inputs
- Event binding: `(click)="methodName()"`, `(submit)="onSubmit()"`
- Property binding: `[property]="value"`
- Structural directives: `*ngIf`, `*ngFor`
- Interpolation: `{{ variable }}`

**Example Pattern:**
```html
<div *ngIf="loading" class="spinner"></div>
<form (ngSubmit)="salvar()" #form="ngForm">
  <input [(ngModel)]="cliente.nome" name="nome">
  <button type="submit" [disabled]="loading">Salvar</button>
</form>
```

---

*Convention analysis: 2026-03-19*
