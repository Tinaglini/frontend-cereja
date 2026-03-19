# Codebase Structure

**Analysis Date:** 2026-03-19

## Directory Layout

```
frontend-cereja/
├── src/                           # Application source code
│   ├── app/                       # Angular application root
│   │   ├── auth/                  # Authentication feature
│   │   │   └── login/             # Login page component
│   │   ├── components/            # Admin feature modules (lazy-loaded)
│   │   │   ├── cliente/           # Client management
│   │   │   ├── solicitacao/       # Request management
│   │   │   ├── endereco/          # Address management
│   │   │   ├── tema/              # Event theme management
│   │   │   └── tipo-evento/       # Event type management
│   │   ├── customer/              # Customer/user feature modules
│   │   │   ├── layout/            # Customer layout wrapper
│   │   │   ├── orcamentos/        # Quote management for customers
│   │   │   └── perfil/            # Customer profile
│   │   ├── dashboard/             # Admin dashboard
│   │   ├── shared/                # Shared UI components and layout
│   │   │   ├── layout/            # Admin main layout wrapper
│   │   │   ├── navbar/            # Navigation bar
│   │   │   ├── toast/             # Toast notification component
│   │   │   └── components/        # Reusable UI components (logo, etc.)
│   │   ├── guards/                # Route protection guards
│   │   ├── interceptors/          # HTTP interceptors
│   │   ├── services/              # Business logic and API services
│   │   ├── models/                # Data interfaces and types
│   │   ├── app.component.ts       # Root component
│   │   ├── app.routes.ts          # Main route configuration
│   │   └── app.config.ts          # Angular application config
│   ├── environments/              # Environment-specific config
│   ├── styles/                    # Global styles
│   └── main.ts                    # Application entry point
├── public/                        # Static assets
├── angular.json                   # Angular CLI configuration
├── package.json                   # npm dependencies
├── tsconfig.json                  # TypeScript configuration
└── dist/                          # Build output (not committed)
```

## Directory Purposes

**`src/app/auth/`**
- Purpose: Authentication UI components
- Contains: Login page with credential form, registration modal
- Key files: `src/app/auth/login/login.component.ts`, `login.component.html`

**`src/app/components/`**
- Purpose: Domain-specific feature modules for admin panel
- Contains: CRUD list/form components for each entity
- Key files: Each subdirectory has `*-list/`, `*-form/`, `*.routes.ts` pattern
- Structure: `cliente/`, `solicitacao/`, `endereco/`, `tema/`, `tipo-evento/`

**`src/app/components/cliente/`**
- Purpose: Client management CRUD operations
- Contains: List view with filters, form for create/edit, route config
- Key files: `src/app/components/cliente/cliente-list/cliente-list.component.ts`, `cliente-form/cliente-form.component.ts`, `cliente.routes.ts`

**`src/app/components/solicitacao/`**
- Purpose: Request/solicitation management
- Contains: List with search, form for submission
- Key files: `solicitacao-list.component.ts`, `solicitacao-form.component.ts`, `solicitacao.routes.ts`

**`src/app/components/endereco/`**
- Purpose: Address/location management
- Contains: List and form components, linked to clients
- Key files: `endereco-list.component.ts`, `endereco-form.component.ts`, `endereco.routes.ts`

**`src/app/components/tema/`**
- Purpose: Event theme/party theme management
- Contains: List with CRUD, form for create/edit
- Key files: `tema-list.component.ts`, `tema-form.component.ts`, `tema.routes.ts`

**`src/app/components/tipo-evento/`**
- Purpose: Event type configuration
- Contains: List and form components
- Key files: `tipo-evento-list.component.ts`, `tipo-evento-form.component.ts`, `tipo-evento.routes.ts`

**`src/app/customer/`**
- Purpose: Customer/end-user feature set (non-admin roles)
- Contains: Layout wrapper, quote management, profile pages
- Key files: `src/app/customer/layout/customer-layout.component.ts`, routes files for each feature

**`src/app/customer/orcamentos/`**
- Purpose: Quote/estimate viewing and requesting for customers
- Contains: List of customer's quotes, form to request new quote
- Key files: `customer-orcamentos-list.component.ts`, `solicitar-orcamento.component.ts`

**`src/app/customer/perfil/`**
- Purpose: Customer profile and account management
- Contains: Profile view/edit page
- Key files: `meu-perfil.component.ts`

**`src/app/dashboard/`**
- Purpose: Admin dashboard with overview statistics
- Contains: Summary cards, quick links
- Key files: `src/app/dashboard/dashboard.component.ts`, `dashboard.component.html`

**`src/app/shared/`**
- Purpose: Reusable UI components and shared infrastructure
- Contains: Layout wrappers, navigation, notifications
- Key files: Layout, Navbar, Toast, Logo components

**`src/app/shared/layout/`**
- Purpose: Main admin layout wrapper with sidebar and header
- Contains: Navigation, router outlet, layout logic
- Key files: `src/app/shared/layout/layout.component.ts` - provides main layout structure for admin area

**`src/app/shared/navbar/`**
- Purpose: Top navigation bar
- Contains: Logo, user menu, navigation links
- Key files: `src/app/shared/navbar/navbar.component.ts`

**`src/app/shared/toast/`**
- Purpose: Toast notification display
- Contains: Notification UI component that subscribes to NotificationService
- Key files: `src/app/shared/toast/toast.component.ts`

**`src/app/shared/components/`**
- Purpose: Reusable smaller components
- Contains: Logo component, potentially other shared UI elements
- Key files: `src/app/shared/components/logo/logo.component.ts`

**`src/app/guards/`**
- Purpose: Route protection and authorization
- Contains: CanActivate guards for different user roles
- Key files: `src/app/guards/auth.guard.ts`, `admin.guard.ts`, `customer.guard.ts`
- Responsibilities:
  - `auth.guard.ts`: Checks if user is authenticated (token exists)
  - `admin.guard.ts`: Checks if user has ROLE_ADMIN
  - `customer.guard.ts`: Checks if user has ROLE_USER or ROLE_ADMIN

**`src/app/interceptors/`**
- Purpose: HTTP request/response interception
- Contains: Authentication interceptor
- Key files: `src/app/interceptors/auth.interceptor.ts` - Injects JWT Bearer token into API requests

**`src/app/services/`**
- Purpose: Business logic, API communication, state management
- Contains: Service classes for each entity + cross-cutting services
- Key files:
  - `auth.service.ts` - Authentication, token management, user state (BehaviorSubjects)
  - `cliente.service.ts` - Client CRUD API calls
  - `solicitacao.service.ts` - Request CRUD API calls
  - `endereco.service.ts` - Address CRUD API calls
  - `tema-festa.service.ts` - Event theme CRUD API calls
  - `tipo-evento.service.ts` - Event type CRUD API calls
  - `solicitacao-orcamento.service.ts` - Quote management API calls
  - `notification.service.ts` - Toast notifications state management
  - `busca.service.ts` - Search/lookup functionality

**`src/app/models/`**
- Purpose: TypeScript interfaces and data models
- Contains: Data contracts for all entities
- Key files:
  - `usuario.model.ts` - User/authentication models (Usuario, LoginRequest, LoginResponse)
  - `cliente.model.ts` - Cliente and Endereco interfaces
  - `solicitacao.model.ts` - Request model
  - `endereco.model.ts` - Address model (also in cliente.model.ts)
  - `tema-festa.model.ts` - Event theme model
  - `tipo-evento.model.ts` - Event type model
  - `solicitacao-orcamento.model.ts` - Quote model

**`src/environments/`**
- Purpose: Environment-specific configuration
- Contains: API base URL and environment flags
- Key files: `environment.ts` - Contains `SERVIDOR` URL and `production` flag

**`src/styles/`**
- Purpose: Global CSS/SCSS styles
- Contains: Application-wide styling

**`src/app/app.component.ts`**
- Purpose: Root component of Angular application
- Responsibilities: Render router outlet, apply root layout

**`src/app/app.routes.ts`**
- Purpose: Master route configuration
- Responsibilities: Define public/admin/customer route hierarchies with guards and lazy loading

**`src/app/app.config.ts`**
- Purpose: Angular application providers configuration
- Responsibilities: Wire up HTTP client, router, interceptors, zone detection

## Key File Locations

**Entry Points:**
- `src/main.ts` - Application bootstrap, loads AppComponent with appConfig
- `src/app/app.component.ts` - Root component with router outlet
- `src/app/app.routes.ts` - Route definitions and guards

**Configuration:**
- `src/app/app.config.ts` - Angular providers, HTTP config, interceptor registration
- `src/environments/environment.ts` - API base URL
- `src/app/shared/api.config.ts` - API endpoint definitions

**Core Logic:**
- `src/app/services/auth.service.ts` - Authentication and user state management
- `src/app/guards/admin.guard.ts`, `customer.guard.ts` - Authorization logic
- `src/app/interceptors/auth.interceptor.ts` - JWT token injection

**Layout & Navigation:**
- `src/app/shared/layout/layout.component.ts` - Admin main layout wrapper
- `src/app/shared/navbar/navbar.component.ts` - Navigation bar
- `src/app/dashboard/dashboard.component.ts` - Admin dashboard overview

**Feature Entry Points:**
- `src/app/auth/login/login.component.ts` - Login page
- `src/app/components/*/` subdirectories - Each feature module with routes

**Testing:**
- `src/app/services/solicitacao.service.spec.ts` - Service unit tests
- `src/app/components/*/solicitacao-list.component.spec.ts` - Component tests
- Various `.spec.ts` files throughout

## Naming Conventions

**Files:**
- Components: `{name}.component.ts` (e.g., `cliente-list.component.ts`)
- Services: `{name}.service.ts` (e.g., `cliente.service.ts`)
- Guards: `{name}.guard.ts` (e.g., `admin.guard.ts`)
- Models/Interfaces: `{name}.model.ts` (e.g., `cliente.model.ts`)
- Routes: `{feature}.routes.ts` (e.g., `cliente.routes.ts`)
- Tests: `{name}.spec.ts` (e.g., `cliente.service.spec.ts`)
- HTML templates: `{name}.component.html`
- Styles: `{name}.component.scss`

**Directories:**
- Feature modules: PascalCase plural or domain name (e.g., `cliente/`, `solicitacao/`)
- Subdirectories within features: {entity}-{purpose} (e.g., `cliente-list/`, `cliente-form/`)
- Shared utilities: lowercase functional names (e.g., `shared/`, `guards/`, `interceptors/`)

**Classes & Interfaces:**
- Classes: PascalCase (e.g., `ClienteService`, `LoginComponent`, `AuthGuard`)
- Interfaces: PascalCase with `I` prefix optional, commonly plain name (e.g., `Cliente`, `Usuario`, `Notification`)
- Enums: PascalCase (if used)

**Properties & Methods:**
- Properties: camelCase (e.g., `clientes`, `isLoading`, `novoClienteForm`)
- Methods: camelCase with action verbs (e.g., `carregarClientes()`, `salvarCliente()`, `deletar()`, `buscarPorNome()`)
- Event handlers: camelCase with `on` prefix or descriptive name (e.g., `salvar()`, `fecharModal()`)
- Observables: camelCase with `$` suffix (e.g., `notifications$`, common pattern in RxJS)

**API Methods (Service Pattern):**
- Read: `buscar*()` or `get*()` (e.g., `buscarTodos()`, `buscarPorId()`, `buscarPorNome()`)
- Create: `salvar()` or `criar*()` (e.g., `salvar(entity)`, `criarClienteAdmin()`)
- Update: `atualizar()` (e.g., `atualizar(id, entity)`)
- Delete: `deletar()` or `delete()` (e.g., `deletar(id)`)

**Routes Path Convention:**
- Feature modules use kebab-case (e.g., `/clientes`, `/tipos-evento`, `/meus-orcamentos`)
- Parameters use single letter or descriptor (e.g., `/:id`, not `/:cliente_id`)

## Where to Add New Code

**New Feature (e.g., New CRUD Module):**
- Primary code: `src/app/components/{feature-name}/`
- List component: `src/app/components/{feature-name}/{feature-name}-list/{feature-name}-list.component.ts`
- Form component: `src/app/components/{feature-name}/{feature-name}-form/{feature-name}-form.component.ts`
- Routes file: `src/app/components/{feature-name}/{feature-name}.routes.ts`
- Service: `src/app/services/{feature-name}.service.ts`
- Model: `src/app/models/{feature-name}.model.ts`
- Tests: `src/app/services/{feature-name}.service.spec.ts`, `src/app/components/{feature-name}/*/*.spec.ts`

**New Component/Module (Non-CRUD UI):**
- Shared/reusable: `src/app/shared/components/{component-name}/`
- Feature-specific: `src/app/components/{feature-name}/{component-name}/`
- Implementation: `{component-name}.component.ts`, `{component-name}.component.html`, `{component-name}.component.scss`

**Utilities/Helpers:**
- Shared services (non-domain): `src/app/services/` (e.g., `notification.service.ts`)
- Shared guards: `src/app/guards/` (e.g., new role-based guard)
- Shared interceptors: `src/app/interceptors/` (e.g., error handling interceptor)

**For Admin Feature:**
- Add route to admin section in `src/app/app.routes.ts` under the `LayoutComponent` route group
- Use `loadChildren` to lazy-load new feature module
- Route should be guarded by `AdminGuard`

**For Customer Feature:**
- Add route to customer section in `src/app/app.routes.ts` under the `CustomerLayoutComponent` route group
- Use `loadChildren` to lazy-load new feature module
- Route should be guarded by `CustomerGuard`

## Special Directories

**`src/environments/`**
- Purpose: Environment-specific configuration files
- Generated: No (manually maintained)
- Committed: Yes
- Usage: `environment.ts` for dev/prod build configuration

**`.angular/`**
- Purpose: Angular CLI cache and build artifacts
- Generated: Yes (auto-generated by CLI)
- Committed: No (in .gitignore)

**`dist/`**
- Purpose: Production build output
- Generated: Yes (output of `ng build`)
- Committed: No (in .gitignore)

**`node_modules/`**
- Purpose: npm dependencies
- Generated: Yes (output of `npm install`)
- Committed: No (in .gitignore)

**`public/`**
- Purpose: Static assets (favicon, index metadata, etc.)
- Generated: No (manually maintained)
- Committed: Yes

**`.planning/codebase/`**
- Purpose: Architecture and structure documentation
- Generated: No (manually maintained, generated by GSD tools)
- Committed: Yes

## File Statistics

- Total TypeScript files: ~64 `.ts` files
- Component files: List + Form pattern for each of 5 main features = 10 main components, plus shared and auth components
- Service files: 10 domain services + cross-cutting services (auth, notification, busca)
- Guard files: 3 (auth, admin, customer)
- Model files: 6 (usuario, cliente, endereco, solicitacao, tema-festa, tipo-evento, solicitacao-orcamento)
- Route configuration files: 1 main (`app.routes.ts`) + 1 per feature module

---

*Structure analysis: 2026-03-19*
