# External Integrations

**Analysis Date:** 2026-03-19

## APIs & External Services

**Backend REST API:**
- Tia Cereja Backend Service - Custom backend for business logic
  - SDK/Client: Angular HttpClient (@angular/common/http)
  - Base URL configured via `environment.SERVIDOR`
    - Development: `http://localhost:8080`
    - Production: `http://18.230.20.100:8080`
  - Authentication: JWT Bearer tokens

## Data Storage

**Databases:**
- Backend-managed (no direct frontend database access)
  - Connection: Via REST API endpoints
  - Client: Angular HttpClient with RxJS Observables

**Client-Side Storage:**
- LocalStorage - Stores authentication tokens and user data
  - `token` - JWT authentication token (set on successful login)
  - `user` - JSON serialized user object with id, email, nome, and role

**Caching:**
- None - No dedicated caching library; relies on RxJS service caching patterns

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication (backend-implemented)
  - Implementation: JWT Bearer token in Authorization header
  - Token decoding: Client-side JWT payload extraction via jwt-decode and base64 decoding
  - Token storage: localStorage with key `token`
  - User data storage: localStorage with key `user`

**Auth Endpoints:**
- `POST /api/auth/login` - User login endpoint (returns JWT token)
- `POST /api/auth/registrar` - User registration endpoint
- `POST /api/auth/criar-admin` - Admin user creation endpoint

**Auth Interceptor:**
- File: `src/app/interceptors/auth.interceptor.ts`
- Automatically adds `Authorization: Bearer <token>` header to all API requests
- Excludes auth endpoints (`/auth/`) from token attachment
- Only attaches token to requests starting with configured `SERVIDOR` base URL

**Role-Based Authorization:**
- Supported roles: `ROLE_ADMIN`, `ROLE_USER`
- Roles extracted from JWT payload claims: `roles`, `authorities`, `role`, or `scope`
- Client-side role checking via `AuthService.getUserRole()` method
- Route guards for admin/customer views: `src/app/guards/admin.guard.ts`, `src/app/guards/customer.guard.ts`

## REST API Endpoints

**Authentication:**
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/registrar` - User registration
- `POST /api/auth/criar-admin` - Admin creation (admin-only)
- `GET /api/auth/validate` - Token validation

**Clients (Clientes):**
- Base: `GET/POST /api/clientes`
- By ID: `GET/PUT /api/clientes/{id}`
- Delete: `DELETE /api/clientes/{id}`
- Search: `GET /api/clientes/buscar?nome=<name>`
- Phone search: `GET /api/clientes/telefone?telefone=<phone>`
- Status filter: `GET /api/clientes/status/{status}`
- Admin client creation: `POST /api/admin/clientes`
- Service: `src/app/services/cliente.service.ts`

**Addresses (Endereços):**
- Base: `GET/POST /api/enderecos`
- By ID: `GET/PUT /api/enderecos/{id}`
- Delete: `DELETE /api/enderecos/{id}`
- Service: `src/app/services/endereco.service.ts`

**Event Requests (Solicitações):**
- Base: `GET/POST /api/solicitacoes`
- By ID: `GET /api/solicitacoes/{id}`
- Service: `src/app/services/solicitacao.service.ts`

**Event Quotes (Solicitações de Orçamento):**
- Base: `GET/POST /api/solicitacoes` (note: uses same endpoint as solicitacoes)
- Service: `src/app/services/solicitacao-orcamento.service.ts`

**Event Types (Tipos de Evento):**
- Base: `GET/POST /api/tipos-evento`
- By ID: `GET/PUT /api/tipos-evento/{id}`
- Delete: `DELETE /api/tipos-evento/{id}`
- Service: `src/app/services/tipo-evento.service.ts`

**Party Themes (Temas de Festa):**
- Base: `GET/POST /api/temas`
- By ID: `GET/PUT /api/temas/{id}`
- Delete: `DELETE /api/temas/{id}`
- Service: `src/app/services/tema-festa.service.ts`

**Users (Usuários):**
- Base: `GET/POST /api/usuarios`
- Service: Generic endpoint configured in `src/app/shared/api.config.ts`

## API Configuration

**Config File:** `src/app/shared/api.config.ts`

**Environment-based URL resolution:**
- Base URL: `environment.SERVIDOR` environment variable
- All services construct full URLs as: `environment.SERVIDOR + '/api/<endpoint>'`

**HTTP Patterns:**
- All services use Angular HttpClient with Observable-based returns
- CRUD operations: GET (read), POST (create), PUT (update), DELETE (delete)
- Query parameters via HttpParams for filtering and search

## Monitoring & Observability

**Error Tracking:**
- None - No external error tracking service configured

**Logs:**
- Console logging only
- Key logs: JWT decoding errors, token parsing failures
- Log locations:
  - `src/app/services/auth.service.ts` - Token decoding errors
  - `src/app/interceptors/auth.interceptor.ts` - Token validation

## User Notifications

**UI Alerts:**
- SweetAlert2 11.23.0 - Beautiful alert modals for:
  - Success notifications after API calls
  - Error messages with detailed descriptions
  - Confirmation dialogs for destructive actions
  - Warning alerts for permission errors (e.g., insufficient JWT permissions)

**UI Components:**
- Bootstrap 5.3.8 modals - Used alongside SweetAlert2 for custom forms
  - Login page registration modal: `src/app/auth/login/login.component.ts`
  - Client creation modal: `src/app/components/cliente/cliente-list/cliente-list.component.ts`

## CI/CD & Deployment

**Hosting:**
- Not configured in codebase - Deployment handled externally

**CI Pipeline:**
- Not detected - No CI configuration files (.github/workflows, .gitlab-ci.yml, etc.)

## Environment Configuration

**Development Setup:**
- `src/environments/environment.development.ts` - Dev environment configuration
- Key configuration: `SERVIDOR: 'http://localhost:8080'` (local backend)

**Production Setup:**
- `src/environments/environment.ts` - Prod environment configuration
- Key configuration: `SERVIDOR: 'http://18.230.20.100:8080'` (AWS EC2 instance)

**Build-time Environment Switching:**
- Angular build configuration in `angular.json`:
  - Development build uses `environment.development.ts`
  - Production build uses `environment.ts`
  - Controlled via `--configuration` flag or default configuration

## Security Considerations

**JWT Token Handling:**
- Tokens stored in localStorage (client-side, accessible to XSS attacks)
- Tokens sent via standard Bearer scheme in Authorization header
- No token refresh mechanism detected
- Token payload decoded client-side to extract user role and ID

**CORS:**
- Not explicitly configured in frontend; backend likely handles CORS

**API Validation:**
- Backend should validate all requests (not frontend responsibility)
- Frontend validation: Form validation, role-based access control via guards

---

*Integration audit: 2026-03-19*
