# Technology Stack

**Analysis Date:** 2026-03-19

## Languages

**Primary:**
- TypeScript 5.7.2 - All application code, component logic, and services

**Secondary:**
- SCSS - Styling (configured via Angular)
- HTML - Templates (Angular template syntax)

## Runtime

**Environment:**
- Node.js 22.18.0 (no .nvmrc pinning; development uses v22.18.0)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present and maintained)

## Frameworks

**Core:**
- Angular 19.2.0 - Main framework for application structure, routing, and components
- @angular/core 19.2.0 - Core framework functionality
- @angular/common 19.2.0 - Common directives, pipes, and services
- @angular/router 19.2.0 - Application routing and navigation
- @angular/forms 19.2.0 - Reactive and template-driven forms
- @angular/platform-browser 19.2.0 - Browser platform support
- @angular/platform-browser-dynamic 19.2.0 - Dynamic component loading

**Testing:**
- Jasmine 5.6.0 - Test framework
- Karma 6.4.0 - Test runner
- karma-chrome-launcher 3.2.0 - Chrome testing
- karma-jasmine 5.1.0 - Jasmine integration for Karma
- karma-jasmine-html-reporter 2.1.0 - HTML test reports
- karma-coverage 2.2.0 - Code coverage reporting

**Build/Dev:**
- @angular-devkit/build-angular 19.2.15 - Angular build system
- @angular/cli 19.2.15 - Angular CLI for scaffolding and commands
- @angular/compiler-cli 19.2.0 - Ahead-of-time compiler

## Key Dependencies

**Critical:**
- RxJS 7.8.0 - Reactive programming library for observables, used extensively in services and components
- zone.js 0.15.0 - Zone management for Angular change detection

**UI & Styling:**
- Bootstrap 5.3.8 - CSS framework for responsive design and base components
- MDB Angular UI Kit 8.0.0 - Material Design Bootstrap components for Angular (modals, dropdowns, etc.)
- SCSS - Configured for styles preprocessing in `src/styles.scss` with imports from `src/styles/` directory

**Authentication & JWT:**
- jwt-decode 4.0.0 - JWT token decoding and payload extraction

**User Notifications:**
- SweetAlert2 11.23.0 - Beautiful alert dialogs for user feedback (confirmations, errors, success messages)

**Utilities:**
- tslib 2.3.0 - TypeScript helper library for decorators and async/await support

## Configuration

**Environment:**
- Environment configuration via `src/environments/` with two profiles:
  - `environment.ts` - Production configuration
  - `environment.development.ts` - Development configuration
- Environment variable: `SERVIDOR` - Base API URL (http://localhost:8080 for dev, http://18.230.20.100:8080 for production)

**Build:**
- `angular.json` - Main Angular CLI configuration
- `tsconfig.json` - TypeScript compiler options (strict mode enabled, ES2022 target)
- `tsconfig.app.json` - Application-specific TypeScript configuration
- `tsconfig.spec.json` - Test-specific TypeScript configuration
- `src/main.ts` - Application bootstrap entry point
- `src/app/app.config.ts` - Angular application configuration with providers (HttpClient, Router, HTTP Interceptors)

**Styling:**
- SCSS configured as inline style language in Angular build
- Style preprocessor options include `src/styles/` path
- Global styles: `src/styles.scss`
- Component SCSS: configured per component

## Platform Requirements

**Development:**
- Node.js 22.x
- npm (version from package-lock.json)
- Angular CLI 19.2.15 (installed locally)
- Chrome or compatible browser for testing (Karma configuration)

**Production:**
- Deployment target: Web servers supporting static file serving
- Build output: `dist/festa-frontend/` (configured in angular.json)
- Requires backend API at configured `SERVIDOR` endpoint for all functionality

## Build & Development Scripts

**Available npm scripts:**
```bash
npm start              # Start Angular dev server (ng serve)
npm run build          # Build for production (ng build)
npm run watch          # Watch mode build (ng build --watch)
npm test               # Run tests via Karma (ng test)
npm run ng             # Direct Angular CLI access
```

## Strict TypeScript Configuration

- `strict: true` - All strict type checking enabled
- `noImplicitOverride: true` - Require override keyword for overridden methods
- `noPropertyAccessFromIndexSignature: true` - Restrict property access via index signatures
- `noImplicitReturns: true` - Require explicit return types
- `noFallthroughCasesInSwitch: true` - Prevent fallthrough in switch cases
- Target: ES2022 with ES2022 modules

## Angular Compiler Options

- `strictInjectionParameters: true` - Strict dependency injection validation
- `strictInputAccessModifiers: true` - Strict input property validation
- `strictTemplates: true` - Strict template type checking

---

*Stack analysis: 2026-03-19*
