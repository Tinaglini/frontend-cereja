# 🍒 Tia Cereja — Sistema de Festas (Frontend)

![Angular](https://img.shields.io/badge/Angular-19.2-dd0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3?style=flat-square&logo=bootstrap&logoColor=white)

Sistema web completo para gerenciamento de eventos e orçamentos de festas. Permite que clientes solicitem orçamentos online e que administradores gerenciem solicitações, tipos de eventos, temas e clientes.

---

## 📋 Pré-requisitos

| Requisito | Versão |
|---|---|
| Node.js | 18+ |
| Angular CLI | 19.x (`npm install -g @angular/cli`) |
| Backend (Spring Boot) | Rodando em `http://localhost:8080` |

---

## 🚀 Instalação e execução

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento (porta 4200)
ng serve
# ou
npm start
```

Acesse em: **http://localhost:4200**

---

## ⚙️ Variáveis de ambiente

Configure a URL base da API em `src/environments/`:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  SERVIDOR: 'http://localhost:8080'
};
```

Para produção, edite `src/environments/environment.prod.ts` com a URL do servidor de produção.

---

## 🔧 Scripts disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `start` | `ng serve` | Desenvolvimento com live reload |
| `build` | `ng build` | Build de produção em `dist/` |
| `watch` | `ng build --watch` | Build contínuo (observa alterações) |
| `test` | `ng test` | Testes unitários via Karma |

### Build de produção

```bash
ng build
# Artefatos gerados em: dist/festa-frontend/
```

---

## 🏗️ Arquitetura

```
src/app/
├── auth/login/        # Tela de login e modal de cadastro
├── components/        # Componentes administrativos (CRUD)
│   ├── cliente/
│   ├── solicitacao/
│   ├── tema/
│   └── tipo-evento/
├── customer/          # Área do cliente (portal)
│   ├── orcamentos/    # Solicitar e listar orçamentos
│   └── perfil/        # Perfil do usuário
├── dashboard/         # Painel inicial do administrador
├── guards/            # Proteção de rotas por role
├── interceptors/      # JWT interceptor (injeta token no header)
├── models/            # Interfaces e tipos TypeScript
├── services/          # Serviços HTTP
│   ├── auth.service.ts
│   ├── cliente.service.ts
│   ├── solicitacao.service.ts
│   ├── tipo-evento.service.ts
│   └── tema-festa.service.ts
└── shared/            # Recursos compartilhados (LogoComponent, etc.)
```

### Descrição das pastas

| Pasta | Responsabilidade |
|---|---|
| `auth/` | Login com JWT, cadastro de usuários, redirecionamento por role |
| `components/` | Páginas e formulários da área administrativa (ROLE_ADMIN) |
| `customer/` | Portal do cliente — solicitar orçamentos, acompanhar status |
| `dashboard/` | Página inicial do admin com visão geral do sistema |
| `guards/` | `AdminGuard` e `CustomerGuard` — controle de acesso por role |
| `interceptors/` | `AuthInterceptor` — adiciona `Authorization: Bearer <token>` em todas as chamadas à API |
| `models/` | Interfaces TypeScript espelhando as entidades do backend |
| `services/` | Camada de comunicação HTTP com o backend |
| `shared/` | Componentes e utilitários reutilizáveis entre módulos |

---

## 🔐 Fluxo de Autenticação

```
Login (POST /api/auth/login)
  └─► JWT recebido → salvo em localStorage
        └─► AuthInterceptor injeta token em todas as requisições
              └─► Guards verificam ROLE no JWT antes de ativar rotas
                    ├─► ROLE_ADMIN → /dashboard
                    └─► ROLE_USER  → /meus-orcamentos
```

O token JWT é decodificado no frontend via `atob()` para extrair role e ID do usuário — sem dependência de bibliotecas externas.

---

## 🌐 CORS

Para que o frontend se comunique com o backend Spring Boot, é necessário configurar o CORS no servidor.

Consulte o arquivo **`CORS_CONFIG.md`** na raiz do projeto com as instruções completas para configurar o `WebMvcConfigurer` no Spring Boot.

---

## 🛠 Stack

| Tecnologia | Uso |
|---|---|
| Angular 19.2 | Framework principal (Standalone Components) |
| TypeScript 5.7 | Tipagem estática |
| SCSS | Estilos com variáveis e design system próprio |
| Bootstrap 5.3 | Grid e componentes base |
| MDB Angular UI Kit 8 | Componentes UI extras |
| SweetAlert2 | Alertas e confirmações |
| Angular HTTP + Interceptors | Comunicação com API REST |

---

## 🍒 Sobre o projeto

**Tia Cereja** é um sistema de gestão de festas e eventos com duas áreas distintas:

- **Área Administrativa** — gerenciamento completo de solicitações, clientes, tipos de evento e temas
- **Área do Cliente** — portal onde o cliente solicita orçamentos e acompanha o status dos pedidos

O backend é desenvolvido em **Spring Boot** e expõe uma API REST consumida por este frontend.
