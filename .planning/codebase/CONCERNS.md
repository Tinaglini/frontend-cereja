# Codebase Concerns

**Analysis Date:** 2026-03-19

## Security Concerns

**JWT Token Handling & localStorage Storage:**
- Risk: JWT tokens are stored in localStorage, exposing them to XSS attacks. No httpOnly cookies are used for secure storage. Tokens are decoded client-side using `atob()` without validation of the JWT structure first.
- Files: `src/app/services/auth.service.ts`, `src/app/interceptors/auth.interceptor.ts`, `src/app/auth/login/login.component.ts`
- Current mitigation: Token presence check in guards; no CSRF protection visible
- Recommendations:
  - Migrate to httpOnly cookies for token storage
  - Implement proper JWT validation before decoding
  - Add request forgery protection headers
  - Remove tokens from localStorage entirely

**Token Decoding Without Proper Error Handling:**
- Risk: Multiple places decode JWT tokens using `atob(token.split('.')[1])` without validating that the token structure is valid. If token is malformed, this silently fails with try-catch blocks that only log errors.
- Files: `src/app/services/auth.service.ts` (lines 38, 92, 119)
- Trigger: Malformed token in localStorage or JWT with unusual structure
- Workaround: Gracefully returns null, but may leave user in inconsistent state

**Admin Endpoint Exposed to Bootstrap Modal Initialization:**
- Risk: Bootstrap modal instance is created via `declare const bootstrap: any` and managed with direct DOM manipulation. This could expose security boundaries if modal state is not properly isolated.
- Files: `src/app/auth/login/login.component.ts`, `src/app/components/cliente/cliente-list/cliente-list.component.ts`
- Current state: `declare const bootstrap: any` bypasses type safety

**Password Handling:**
- Risk: Password is sent in plain text over HTTP if HTTPS is not enforced. Password confirmation field stored in plain text in component memory until form submission.
- Files: `src/app/auth/login/login.component.ts` (line 72), `src/app/services/auth.service.ts`
- Recommendation: Verify HTTPS enforcement on backend, consider in-transit encryption

## Memory Leaks & Subscription Management

**Unmanaged Observable Subscriptions:**
- Issue: 36+ `.subscribe()` calls found across components with no unsubscribe or takeUntil pattern. Components may accumulate subscriptions if destroyed while observables are still active.
- Files:
  - `src/app/dashboard/dashboard.component.ts` (4 subscriptions in loadStats, lines 44-84)
  - `src/app/components/cliente/cliente-list/cliente-list.component.ts` (6+ subscriptions, lines 43-174)
  - `src/app/components/solicitacao/solicitacao-form/solicitacao-form.component.ts` (lines 69-71, 76-108, 130-152)
  - `src/app/components/tipo-evento/` - similar pattern
  - `src/app/components/tema/` - similar pattern
- Impact: Memory leaks in long-lived views (dashboard, list components). User can navigate away while HTTP requests are in-flight, causing subscription ghost-listeners.
- Recommendation: Use `takeUntil` pattern with a destroy$ subject or unsubscribe in ngOnDestroy for all components

**No ngOnDestroy in Components:**
- Issue: 0 observable-consuming components implement ngOnDestroy for cleanup
- Files: All list and form components in `src/app/components/` and `src/app/customer/`
- Test Coverage Gap: No tests validate subscription cleanup

## Test Coverage Gaps

**Minimal Test Coverage:**
- Issue: Only 6 .spec.ts files found for 40+ TypeScript source files. Most test files are placeholder stubs (e.g., `solicitacao.service.spec.ts` has only "should be created" test).
- Files: `src/app/services/solicitacao.service.spec.ts`, others with placeholder tests
- Untested areas:
  - Auth service (token decode, role parsing) - line 38-44 has error handling but never tested
  - Auth guard logic (token validation is commented out, actual guard only checks token presence)
  - All form components (validation, error handling)
  - All list components (loading state, error state, filter logic)
  - Error interceptor and error scenarios
- Risk: Silent failures in JWT parsing, role extraction, and auth state management are not caught

**No Integration Tests:**
- What's not tested: API error responses (400, 404, 500), network timeouts, concurrent request scenarios
- Files: No test files for integration patterns
- Priority: High - authentication flow is critical

**No E2E Tests:**
- Not used
- Recommendation: Add Cypress or Playwright tests for critical flows (login, admin client creation, customer quote request)

## Fragile Areas & Code Patterns

**Role & Authority Field Inconsistency:**
- Issue: JWT payload can have `role`, `roles`, `authorities`, or `scope` fields. Code checks multiple field names in different orders across different functions, making role extraction fragile.
- Files: `src/app/services/auth.service.ts` (lines 39, 93)
- Why fragile: If backend changes JWT structure, code silently falls back to next field name without clear error. AdminGuard (line 26) checks role===ROLE_ADMIN but could receive array if roles field is used.
- Safe modification: Normalize JWT structure in auth service, not components

**Dashboard Stats Misalignment:**
- Issue: `stats.solicitacoes` is populated from endereços (addresses), not actual solicitacoes (quote requests). Comment on line 57 acknowledges this: "Endereços não são solicitacoes, mas vamos usar como exemplo"
- Files: `src/app/dashboard/dashboard.component.ts` (lines 55-64)
- Impact: Dashboard displays incorrect data to admins
- Fix approach: Load actual solicitacoes data

**Bootstrap Modal State Management:**
- Issue: Modal instances are created and stored as `private modalInstance: any` and reused. If component is destroyed before modal is closed, dangling modal instance may remain.
- Files: `src/app/auth/login/login.component.ts` (lines 42, 52-55), `src/app/components/cliente/cliente-list/cliente-list.component.ts` (line 32, 131-134)
- Why fragile: No ngOnDestroy cleanup, no typing, modal lifecycle not tracked
- Safe modification: Implement modal cleanup in ngOnDestroy, use typed Bootstrap API

**Form Validation Without Clear Feedback:**
- Issue: Forms check `form.invalid` and return early (e.g., line 63 in login.component), but user receives no error message about which field is invalid.
- Files: `src/app/auth/login/login.component.ts` (line 63), `src/app/components/cliente/cliente-list/cliente-list.component.ts` (line 142)
- Impact: Poor UX - silent failures on form submission

**Error Message Extraction Inconsistency:**
- Issue: Error messages extracted with `.error?.erro || .error || ''` pattern across components, but actual backend error structure is inconsistent.
- Files: `src/app/components/cliente/cliente-list/cliente-list.component.ts` (line 162), `src/app/auth/login/login.component.ts` (line 92)
- Impact: Error messages may be blank or contain raw error objects

**Token Validation Disabled in Production:**
- Issue: AuthGuard has backend token validation commented out (lines 32-47). Guard only checks token presence, not validity. This means expired or revoked tokens are not detected until API calls fail.
- Files: `src/app/guards/auth.guard.ts` (lines 32-47)
- Impact: Users with invalid tokens can access protected routes until they attempt an API call (which will fail with 401)
- Recommendation: Re-enable token validation or implement a token refresh strategy

## Known Issues

**Async Nested Loading in Components:**
- Issue: `solicitar-orcamento.component.ts` loads domain data with nested subscribe calls (temas subscribed inside tiposEvento subscription, line 71-75)
- Files: `src/app/customer/orcamentos/solicitar-orcamento/solicitar-orcamento.component.ts`
- Cause: Lack of RxJS combinatorial operators (combineLatest, forkJoin)
- Improvement: Use `forkJoin` to parallel load all domain data

**Type Safety Issues:**
- 20 instances of `any` type found across codebase
- Files: `src/app/auth/login/login.component.ts` (line 11 - bootstrap any), `src/app/customer/orcamentos/solicitar-orcamento/solicitar-orcamento.component.ts` (lines 73-74)
- Impact: Loss of IDE autocomplete and type checking for modal management and API responses

**Console.error Spam in Production:**
- 43 console.error/console.log statements across codebase
- Files: Especially `src/app/services/auth.service.ts`, guards, all list/form components
- Impact: Pollutes user console, may leak sensitive error info in production
- Recommendation: Use a proper logging service with environment-based filtering

**Unhandled Route Parameters:**
- Issue: Some routes use snapshot params (e.g., `route.snapshot.params['id']`) which don't react to route param changes
- Files: `src/app/components/endereco/endereco-form/endereco-form.component.ts` (line 38)
- Impact: If user navigates from edit/:id1 to edit/:id2, component won't reload data

## Tech Debt

**Hardcoded Bootstrap CDN via declare:**
- Issue: Bootstrap is imported via `declare const bootstrap: any;` rather than proper Angular module
- Files: `src/app/auth/login/login.component.ts`, `src/app/components/cliente/cliente-list/cliente-list.component.ts`
- Workaround: Works in practice but not type-safe
- Debt approach: Use ng-bootstrap library instead of raw Bootstrap JS

**Inconsistent Service Error Handling:**
- Issue: Services don't implement error handling; all error handling deferred to components. Services like `SolicitacaoService` (line 23-37) have no try-catch or error transformation.
- Files: `src/app/services/solicitacao.service.ts`, `src/app/services/cliente.service.ts`, all domain services
- Impact: Component error handling code is repetitive and error-prone
- Debt approach: Implement a shared error handling RxJS operator in a base service or interceptor

**No Centralized Error Handling Interceptor:**
- Issue: HTTP errors handled individually in each component's subscribe error block
- Files: 10+ components with duplicate error handling logic
- Debt approach: Create an HTTP interceptor that handles common error codes (401, 403, 500) globally

**Inconsistent API URL Construction:**
- Issue: Services concatenate URLs with `+` operator: `this.API + '/' + id` instead of using URL builders
- Files: `src/app/services/solicitacao.service.ts` (lines 20, 28, 32), all CRUD services
- Debt approach: Create a URL builder utility or use HttpClient request path parameters

**No Environment Variable Validation:**
- Issue: `environment.SERVIDOR` and `environment.apiUrl` used but no validation that they're set
- Files: `src/app/services/auth.service.ts` (line 12), `src/app/shared/api.config.ts` (line 4)
- Risk: Silent failures if environment config is missing

## Performance Bottlenecks

**No HTTP Response Caching:**
- Issue: List components reload all data every time they're accessed. Dashboard loads stats with 4 parallel requests with no caching.
- Files: `src/app/dashboard/dashboard.component.ts` (loadStats calls all services without caching)
- Cause: Services don't implement shareReplay or client-side caching
- Improvement path: Add RxJS shareReplay() to domain queries, implement HttpClient caching strategy

**Inefficient List Filtering:**
- Issue: ClienteListComponent loads entire client list, then calls separate search endpoints for name/phone/status filtering. No client-side filtering option for small datasets.
- Files: `src/app/components/cliente/cliente-list/cliente-list.component.ts` (lines 75-126)
- Cause: Each filter triggers new API call
- Scaling concern: Performance degrades with large datasets; no pagination visible

**No Virtual Scrolling:**
- Issue: No mention of virtual scroll or pagination in list components
- Files: All `*-list.component.ts` files
- Risk: Rendering 1000+ items in DOM causes UI freeze

**Nested Component Data Loads:**
- Issue: SolicitacaoFormComponent loads all clients, tipos-evento, and temas on init (lines 69-71). No lazy loading of related data only when user interacts with field.
- Files: `src/app/components/solicitacao/solicitacao-form/solicitacao-form.component.ts`
- Impact: Slow form initialization

## Scaling Limits

**Single Backend Instance Assumption:**
- Issue: No load balancer detection, no retry strategy for failed requests, no circuit breaker pattern
- Files: All HTTP service calls
- Current capacity: Works for single server; breaks if backend goes down (user sees frozen UI)

**JWT Expiration & Refresh:**
- Issue: No token refresh mechanism visible. If token expires mid-session, all subsequent API calls fail.
- Files: `src/app/interceptors/auth.interceptor.ts`, `src/app/services/auth.service.ts`
- Current behavior: User must manually refresh page or re-login
- Scaling path: Implement silent token refresh with 401 interceptor

**No Request Deduplication:**
- Issue: Rapid clicks on buttons can trigger duplicate API calls (no debounce on save buttons)
- Files: All form components (submit buttons in templates)
- Impact: Potential race conditions (create customer twice)
- Improvement: Add debounce/throttle to save button clicks or implement optimistic locking

## Missing Critical Features

**No Loading Indicators for Long Operations:**
- Issue: While `loading` flags exist in components, not all forms show loading state to user (e.g., no disabled submit button during submission)
- Files: Components set `loading = true/false` but template implementation may be incomplete
- Blocks: User can't see if form submission is in progress

**No Offline Detection:**
- What's missing: No indication to user if network is disconnected. API calls just hang.
- Risk: User submits form, network drops, they don't know form didn't save

**No Pagination in List Views:**
- What's missing: All list endpoints likely return unlimited results
- Files: `src/app/components/cliente/cliente-list/cliente-list.component.ts`, all list components
- Blocks: App doesn't scale to 10K+ records

---

*Concerns audit: 2026-03-19*
