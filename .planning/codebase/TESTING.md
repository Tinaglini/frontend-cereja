# Testing Patterns

**Analysis Date:** 2026-03-19

## Test Framework

**Runner:**
- Karma 6.4.0
- Built into Angular CLI via `@angular-devkit/build-angular:karma`
- Config file integrated in `angular.json` under `projects.festa-frontend.architect.test`

**Assertion Library:**
- Jasmine ~5.6.0
- Types: `@types/jasmine ~5.1.0`

**Run Commands:**
```bash
npm run test              # Run tests via ng test
ng test                   # Equivalent - runs Karma test runner
ng test --watch          # Watch mode (auto-rerun on changes)
ng test --code-coverage  # Run with coverage reports
```

**Test Configuration:**
- `tsConfig`: `tsconfig.spec.json` (extends base tsconfig.json)
- `inlineStyleLanguage`: `scss` (matches source style language)
- `karma-chrome-launcher` for browser testing
- `karma-coverage` for coverage reports
- `karma-jasmine` for Jasmine integration
- `karma-jasmine-html-reporter` for HTML reporting

## Test File Organization

**Location:**
- Co-located with source files: same directory as component/service
- Pattern: `feature-name.component.ts` → `feature-name.component.spec.ts`

**Naming:**
- `*.component.spec.ts` for component tests
- `*.service.spec.ts` for service tests
- Example files:
  - `src/app/shared/components/logo/logo.component.spec.ts`
  - `src/app/components/solicitacao/solicitacao-list/solicitacao-list.component.spec.ts`
  - `src/app/services/solicitacao.service.spec.ts`

**Directory Structure:**
```
src/app/
├── components/
│   ├── cliente/
│   │   ├── cliente-form/
│   │   │   ├── cliente-form.component.ts
│   │   │   └── cliente-form.component.spec.ts  (if it exists)
│   │   └── cliente-list/
│   │       ├── cliente-list.component.ts
│   │       └── cliente-list.component.spec.ts  (if it exists)
├── services/
│   ├── cliente.service.ts
│   ├── cliente.service.spec.ts  (exists)
│   └── auth.service.ts
└── shared/
    └── components/
        └── logo/
            ├── logo.component.ts
            └── logo.component.spec.ts  (exists)
```

## Test Structure

**Suite Organization:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

**Patterns:**
- `beforeEach(async () => { ... })` - Setup before each test (async for component initialization)
- `TestBed.configureTestingModule()` - Configure test module with imports/declarations
- `.compileComponents()` - Compile component template and CSS
- `fixture = TestBed.createComponent(Component)` - Create component fixture
- `component = fixture.componentInstance` - Access component instance
- `fixture.detectChanges()` - Trigger initial change detection
- Single test per describe block: `it('should create', () => { ... })`

**Service Test Structure:**
```typescript
import { TestBed } from '@angular/core/testing';
import { SolicitacaoService } from './solicitacao.service';

describe('SolicitacaoService', () => {
  let service: SolicitacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## Mocking

**Framework:** Jasmine spies (built-in, no separate mocking library detected)

**Patterns:**
- Current tests use minimal mocking - mostly basic instantiation checks
- No HttpClientTestingModule imports detected in current specs
- No service mocking in component specs shown (components directly use `imports: [Component]`)

**What to Mock (when expanding tests):**
- HTTP calls: Use `HttpClientTestingModule` from `@angular/common/http/testing`
- Services injected into components: Use `jasmine.createSpyObj()` or `TestBed.inject()`
- Router: Use `Router` from `@angular/router`
- Example mocking pattern (not currently used):
  ```typescript
  let mockClienteService = jasmine.createSpyObj('ClienteService', ['buscarTodos', 'salvar']);
  TestBed.configureTestingModule({
    declarations: [ClienteFormComponent],
    providers: [
      { provide: ClienteService, useValue: mockClienteService }
    ]
  });
  ```

**What NOT to Mock:**
- Components in standalone mode should import real dependencies
- Internal component state and methods (test behavior, not internals)
- Angular framework classes (TestBed, ComponentFixture)

## Fixtures and Factories

**Test Data:**
- Not implemented in current codebase
- Current tests only verify component/service creation
- When needed, create factory functions or fixture files

**Location (recommended):**
- `src/app/testing/fixtures/` or `src/app/testing/factories/`
- Example: `src/app/testing/fixtures/cliente.fixture.ts`

## Coverage

**Requirements:** Not enforced

**View Coverage:**
```bash
ng test --code-coverage
# Generates coverage report in coverage/ directory
# View HTML report: coverage/index.html
```

**Coverage Configuration:**
- Defined in `angular.json` under test builder options
- Coverage reporter: `karma-coverage`
- No minimum coverage threshold configured

## Test Types

**Unit Tests:**
- Scope: Individual components and services
- Current approach: Basic instantiation tests verifying component/service creation
- Pattern: `it('should create', () => { expect(component).toBeTruthy(); })`
- No actual behavior testing or user interaction testing

**Integration Tests:**
- Not found in current codebase
- Could test component + service together
- Would require `HttpClientTestingModule` and service mocking
- Example area: `ClienteFormComponent` with `ClienteService` HTTP calls

**E2E Tests:**
- Not configured
- Angular testing: Cypress or Protractor could be added
- No e2e framework detected in dependencies

## Common Patterns

**Async Testing:**
- Components: Use `async()` or `fakeAsync()` helpers (not shown in current specs)
- Pattern (when needed):
  ```typescript
  it('should load data', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.data).toBeDefined();
  }));
  ```

**Error Testing:**
- Not implemented in current specs
- Would test error handling in subscription handlers
- Example pattern (recommended):
  ```typescript
  it('should handle error', (done) => {
    service.getData().subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error).toBeDefined();
        done();
      }
    );
    httpMock.expectOne('/api/data').flush([], { status: 500, statusText: 'Server Error' });
  });
  ```

## Test Coverage Analysis

**Current State:**
- Very minimal test coverage - only 6 spec files exist for 30+ components/services
- Tests created automatically by Angular CLI schematic but not maintained
- No tests for:
  - Service HTTP calls and Observable responses
  - Component form submission and validation
  - Error handling in subscribe handlers
  - Async operations (loading states, delays)
  - User interactions (clicks, form input)
  - Navigation and routing
  - Authentication and interceptors

**Critical Areas Without Tests:**
- `ClienteService` - CRUD operations on HTTP client
- `AuthService` - Token storage, JWT decoding, role extraction
- `AuthInterceptor` - Token injection logic
- All list/form components - data loading, filtering, form submission
- `NotificationService` - notification display and auto-removal
- All model transformations and data binding

## Setting Up New Tests

**Component Test Template:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MyComponent } from './my.component';
import { MyService } from '../services/my.service';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let service: MyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [MyService]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MyService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add behavior tests here
});
```

**Service Test Template:**
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService]
    });
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add behavior tests using httpMock
});
```

---

*Testing analysis: 2026-03-19*
