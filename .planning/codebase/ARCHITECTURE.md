# Architecture

**Analysis Date:** 2026-03-19

## Pattern Overview

**Overall:** Layered MVC-inspired Angular standalone components with role-based access control and feature-based module organization.

**Key Characteristics:**
- Standalone Angular components (Angular 19.2) with composition-based architecture
- HTTP-based client-server communication with JWT authentication
- Role-based access control (ROLE_ADMIN, ROLE_USER) via route guards
- Feature modules organized by domain (cliente, solicitacao, endereco, tema, tipo-evento)
- Lazy-loaded child routes for each feature module
- BehaviorSubject-based state management for authentication and notifications

## Layers

**Presentation Layer (UI Components):**
- Purpose: Handle user interactions, display data, and manage component-level state
- Location: `src/app/components/`, `src/app/auth/`, `src/app/dashboard/`, `src/app/customer/`
- Contains: List components (*-list), Form components (*-form), Layout components
- Depends on: Services, Models, Shared components
- Used by: Router, other components

**Service Layer (Business Logic):**
- Purpose: Handle API communication, state management, and cross-cutting concerns
- Location: `src/app/services/`
- Contains: API-facing services (ClienteService, TemaFestaService, etc.), AuthService, NotificationService
- Depends on: HttpClient, Models, Environment config
- Used by: Components, Guards

**Data Access Layer (HTTP Client):**
- Purpose: Manage HTTP requests/responses with JWT interceptor
- Location: `src/app/interceptors/auth.interceptor.ts`
- Contains: HTTP interceptor that injects Bearer tokens
- Depends on: AuthService, HttpClient
- Used by: Services

**Security Layer (Guards & Authentication):**
- Purpose: Protect routes and validate authorization
- Location: `src/app/guards/`, `src/app/services/auth.service.ts`
- Contains: AuthGuard, AdminGuard, CustomerGuard, AuthService
- Depends on: Router, localStorage, JWT decoding
- Used by: App routes configuration

**Shared/Infrastructure Layer:**
- Purpose: Reusable UI components, configuration, and utilities
- Location: `src/app/shared/`, `src/app/models/`, `src/environments/`
- Contains: Layout, Navbar, Toast notifications, API config, models/interfaces
- Depends on: Angular core
- Used by: All layers

## Data Flow

**User Authentication Flow:**

1. User enters credentials on `LoginComponent` (`src/app/auth/login/`)
2. Component calls `AuthService.login(credentials)`
3. AuthService makes POST to `/api/auth/login`
4. Backend returns JWT token + user data
5. AuthService decodes JWT (extract role, userId) and stores token + user in localStorage
6. AuthService emits `loggedIn` BehaviorSubject → true
7. AuthService emits `currentUser` BehaviorSubject with user object
8. Router navigates based on user role via guard redirect logic
9. Subsequent requests include token via `AuthInterceptor` (Bearer header)

**CRUD Operation Flow (Example: Cliente):**

1. User navigates to `/clientes` → `ClienteListComponent` loads
2. Component calls `ClienteService.buscarTodos()`
3. Service makes GET to `/api/clientes`
4. AuthInterceptor intercepts request, adds `Authorization: Bearer {token}`
5. Response received, mapped to `Cliente[]` interface
6. Component updates `clientes` property
7. Template re-renders with data
8. User clicks Edit → `router.navigate(['/clientes/editar', id])`
9. `ClienteFormComponent` loads with `id` from route params
10. Form component calls `ClienteService.buscarPorId(id)` to load existing data
11. User modifies and clicks Save → `ClienteService.atualizar(id, cliente)`
12. Service makes PUT request with updated object
13. On success: notification shown, router navigates back to list
14. List component reloads data via `carregarClientes()`

**Role-Based Access Control Flow:**

1. Route accessed → appropriate guard evaluates (AdminGuard, CustomerGuard)
2. Guard calls `AuthService.getUserRole()`
3. AuthService decodes JWT payload, returns role string (ROLE_ADMIN, ROLE_USER)
4. Guard compares role against required permission
5. If unauthorized: router redirects to appropriate fallback
   - AdminGuard blocks non-admin → redirects to `/meus-orcamentos`
   - CustomerGuard blocks unauthenticated → redirects to `/login`
6. If authorized: route activates

**State Management:**

- **Authentication State:** Managed by AuthService via BehaviorSubjects (`loggedIn`, `currentUser`)
  - Components subscribe to `authService.isLoggedIn()` and `getCurrentUser()`
  - State persists in localStorage (token, user JSON)
  - Location: `src/app/services/auth.service.ts`

- **Notification State:** Managed by NotificationService via BehaviorSubject (`notifications$`)
  - Components can show toast via `notificationService.success/error/warning/info()`
  - Auto-dismisses based on duration
  - Location: `src/app/services/notification.service.ts`

- **Component State:** Local to each component
  - Lists maintain `data: Entity[]` array
  - Forms maintain `entity: Entity` object
  - Loading/UI state: `loading: boolean`, `isEditando: boolean`

- **Server State:** Fetched on-demand via services
  - No client-side caching mechanism observed
  - Each navigation/action triggers fresh HTTP request

## Key Abstractions

**Service Pattern:**
- Purpose: Encapsulate HTTP communication and business logic
- Examples: `ClienteService` (`src/app/services/cliente.service.ts`), `TemaFestaService`, `AuthService`
- Pattern:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class EntityService {
    private API = environment.SERVIDOR + '/api/entity';

    constructor(private http: HttpClient) {}

    buscarTodos(): Observable<Entity[]> { return this.http.get<Entity[]>(this.API); }
    buscarPorId(id: number): Observable<Entity> { return this.http.get<Entity>(this.API + '/' + id); }
    salvar(entity: Entity): Observable<Entity> { return this.http.post<Entity>(this.API, entity); }
    atualizar(id: number, entity: Entity): Observable<Entity> { return this.http.put<Entity>(this.API + '/' + id, entity); }
    deletar(id: number): Observable<void> { return this.http.delete<void>(this.API + '/' + id); }
  }
  ```

**Model/Interface Pattern:**
- Purpose: Define data contracts for type safety
- Examples: `Cliente`, `Endereco`, `Solicitacao` interfaces in `src/app/models/`
- Pattern: Export interfaces with optional properties (?) for partial updates
  ```typescript
  export interface Cliente {
    id?: number;
    nome: string;
    email?: string;
    // ...
  }
  ```

**Component CRUD Pattern:**
- Purpose: Reusable pattern for list + form functionality
- Examples: `ClienteListComponent`/`ClienteFormComponent`, `TemaListComponent`/`TemaFormComponent`
- Pattern:
  - List: Load entities, display in table, provide filters, actions (edit, delete, new)
  - Form: Load single entity (if editing), bind form fields, handle save/cancel
  - Both use similar error handling (Swal modals) and loading states

**Route Configuration Pattern:**
- Purpose: Organize routes by feature with lazy loading
- Examples: `src/app/components/cliente/cliente.routes.ts`, `src/app/components/solicitacao/solicitacao.routes.ts`
- Pattern: Each feature defines its own routes array, loaded via `loadChildren` in main routes
  ```typescript
  // In main app.routes.ts
  { path: 'clientes', loadChildren: () => import('./components/cliente/cliente.routes').then(m => m.clienteRoutes) }

  // In cliente.routes.ts
  export const clienteRoutes: Routes = [
    { path: '', component: ClienteListComponent },
    { path: 'novo', component: ClienteFormComponent },
    { path: 'editar/:id', component: ClienteFormComponent }
  ];
  ```

**BehaviorSubject Observable Pattern:**
- Purpose: Maintain reactive state accessible across components
- Examples: `authService.loggedIn$`, `authService.currentUser$`, `notificationService.notifications$`
- Pattern:
  ```typescript
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Update from internal logic
  this.loggedIn.next(true);
  ```

## Entry Points

**Application Bootstrap:**
- Location: `src/main.ts`
- Triggers: Browser loads `/index.html`
- Responsibilities: Initialize Angular application, load `AppComponent` with `appConfig`

**Root Component:**
- Location: `src/app/app.component.ts`
- Triggers: Bootstrap process
- Responsibilities: Render `<router-outlet>` for route switching, apply global styles

**Router:**
- Location: `src/app/app.routes.ts`
- Triggers: Navigation events
- Responsibilities:
  - Route public `/login` to `LoginComponent`
  - Route admin area (`/`) with `LayoutComponent` wrapper + AdminGuard
  - Route customer area (`/`) with `CustomerLayoutComponent` wrapper + CustomerGuard
  - Lazy-load feature modules (clientes, solicitacoes, etc.)
  - Redirect unmatched routes to `/login`

**Admin Layout:**
- Location: `src/app/shared/layout/layout.component.ts`
- Triggers: User navigates to protected admin route
- Responsibilities: Render main navigation, sidebar, footer, nested router outlet for feature content

**Customer Layout:**
- Location: `src/app/customer/layout/customer-layout/customer-layout.component.ts`
- Triggers: User navigates to protected customer route
- Responsibilities: Render customer-specific layout for non-admin users

**Authentication Entry:**
- Location: `src/app/auth/login/login.component.ts`
- Triggers: User accesses `/login` or redirected by guards
- Responsibilities: Collect credentials, call `AuthService.login()`, navigate on success

## Error Handling

**Strategy:** Layered with user-facing notifications via SweetAlert2 (Swal) modals and console logging for debugging.

**Patterns:**

**HTTP Error Handling:**
```typescript
service.method().subscribe({
  next: (data) => { /* success */ },
  error: (error) => {
    let mensagem = 'Erro desconhecido';
    if (error.status === 0) mensagem = 'Sem conexão com servidor';
    else if (error.status === 404) mensagem = 'Não encontrado';
    else if (error.status === 500) mensagem = 'Erro interno do servidor';
    else if (error.error) mensagem = error.error.message || error.error;

    Swal.fire({ icon: 'error', title: 'Erro', text: mensagem, footer: `Status: ${error.status}` });
  }
});
```
- Location examples: `src/app/components/cliente/cliente-list/cliente-list.component.ts` (lines 44-72)

**Form Validation Error Handling:**
```typescript
// Client-side: NgForm invalid state prevents submission
if (form.invalid) return;

// Server-side: Check response status + error message
if (error.status === 400 && msg.includes('já existente')) {
  this.emailJaCadastrado = true; // Show field-level error
}
```
- Location: `src/app/components/cliente/cliente-list/cliente-list.component.ts` (lines 141-175)

**Route Guard Error Handling:**
- Guards check token validity and role
- On failure, redirect to `/login` (AuthGuard, CustomerGuard) or `/meus-orcamentos` (AdminGuard)
- Location: `src/app/guards/` files

**Notification Service Error Wrapper:**
```typescript
notificationService.error(title, message, duration);
```
- Used in dashboard for non-blocking warnings
- Location: `src/app/dashboard/dashboard.component.ts` (line 51)

## Cross-Cutting Concerns

**Logging:**
- Approach: Console.log for development, console.error for errors
- Patterns:
  - Component lifecycle: `ngOnInit` logs when component initializes
  - Service calls: Log responses and errors
  - Auth: Log in AuthInterceptor, AuthService, guards
- Examples: `src/app/guards/auth.guard.ts` (lines 24-30), `src/app/services/auth.service.ts` (lines 43, 109)

**Validation:**
- Approach: Two-layer (client + server)
- Client-side: NgForm `[ngForm]` directive tracks validity
  - Forms validate on input change
  - Submit button disabled if invalid
- Server-side: HTTP request response checked for 400/422 status
- Example: `src/app/components/cliente/cliente-form/cliente-form.component.ts` (lines 55-106)

**Authentication:**
- Approach: JWT-based with localStorage persistence
- Token injected in HTTP requests via `AuthInterceptor`
- Token decoded to extract role/userId without server round-trip
- Logout clears token + user from localStorage, updates BehaviorSubjects
- Location: `src/app/services/auth.service.ts`, `src/app/interceptors/auth.interceptor.ts`

**Error Notifications:**
- Approach: Swal.fire() modals for user-facing errors, console for debugging
- Used consistently across all components
- Examples: `src/app/components/cliente/cliente-list/cliente-list.component.ts` (lines 65-70, 86-90)

**Toast/In-App Notifications:**
- Approach: NotificationService with BehaviorSubject + auto-dismiss
- Can be triggered from any component via `notificationService.success/error/warning/info()`
- Toast component `src/app/shared/toast/toast.component.ts` subscribes to notifications$
- Auto-dismisses after configurable duration (default 4s, error 6s)
- Location: `src/app/services/notification.service.ts`

---

*Architecture analysis: 2026-03-19*
