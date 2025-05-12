# Sistema de Gerenciamento Bancário

Este projeto implementa uma arquitetura de microserviços para um sistema de
gerenciamento e movimentação de contas bancárias, conforme especificações
técnicas do desafio. A solução conta com:

- **People.API** - Gerenciamento de usuários e autenticação
- **Account.API** - Gerenciamento de contas bancárias
- **Transaction.API** - Movimentações financeiras
- **BFF.API** - Backend for Frontend, integrando todos os serviços
- **Frontend** - Interface de usuário em Angular

## Arquitetura

A solução implementa:

- Microserviços independentes
- Comunicação via mensageria com RabbitMQ
- Cache com Redis
- Banco de dados PostgreSQL
- Autenticação JWT
- Docker e Docker Compose
- Frontend em Angular com PrimeNG

## Pré-requisitos

- Docker e Docker Compose
- .NET 6 SDK (para desenvolvimento)
- Node.js e Angular CLI (para desenvolvimento do frontend)
- Git

## Como executar

O projeto está configurado para ser executado completamente com Docker Compose,
incluindo todos os serviços e dependências.

### Usando Docker Compose (Recomendado)

1. Clone o repositório:

```powershell
git clone https://github.com/seu-usuario/iac-banking.git
cd iac-banking
```

2. Execute todos os serviços com Docker Compose:

```powershell
docker-compose up --build
```

Isso inicializará:

- **PostgreSQL** - Banco de dados (porta 5432)
- **RabbitMQ** - Mensageria (porta 5672, interface em 15672)
- **Redis** - Cache (porta 6379)
- **People API** - http://localhost:5001
- **Account API** - http://localhost:5002
- **Transaction API** - http://localhost:5003
- **BFF API** - http://localhost:5000
- **Frontend Angular** - http://localhost:4200

3. Acesse o sistema em: http://localhost:4200

### Desenvolvimento local (sem Docker)

#### Backend (APIs)

1. Certifique-se de ter PostgreSQL, Redis e RabbitMQ rodando localmente ou via
   Docker:

```powershell
docker run -d -p 5432:5432 --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bankingdb postgres:13
docker run -d -p 6379:6379 --name redis redis:alpine
docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq rabbitmq:3-management
```

2. Configure suas conexões no arquivo `appsettings.json` de cada API

3. Inicie cada API separadamente:

```powershell
cd Backend/People/People.API
dotnet run

cd Backend/Account/Account.API
dotnet run

cd Backend/Transaction/Transaction.API
dotnet run

cd Backend/BFF/BFF.API
dotnet run
```

#### Frontend

```powershell
cd Frontend
npm install
ng serve --open
```

## Endpoints da API

### Autenticação

- `POST /api/auth/login` - Login (email/senha)
- `POST /api/auth/logout` - Logout (requer autenticação)

### Usuários

- `GET /api/usuarios` - Listar todos os usuários (requer perfil GERENTE)
- `GET /api/usuarios/{id}` - Obter usuário por ID
- `POST /api/usuarios` - Criar novo usuário (requer perfil GERENTE)

### Contas

- `GET /api/contas` - Listar todas as contas
- `GET /api/contas/{id}` - Obter conta por ID
- `GET /api/contas/usuario/{usuarioId}` - Listar contas de um usuário
- `POST /api/contas` - Criar nova conta (requer perfil GERENTE)
- `POST /api/contas/inativar/{id}` - Inativar/remover conta (requer perfil
  GERENTE)

### Movimentações

- `POST /api/movimentacoes` - Criar movimentação financeira
- `GET /api/movimentacoes/extrato/{contaId}` - Extrato de movimentações com
  filtro por período

### Dashboard

- `GET /api/dashboard/cliente` - Dashboard para clientes
- `GET /api/dashboard/gerente` - Dashboard para gerentes (requer perfil GERENTE)

## Usuários Demo

O sistema é inicializado com dois usuários para teste:

1. **Cliente**

   - Email: cliente@teste.com
   - Senha: senha

2. **Gerente**
   - Email: gerente@teste.com
   - Senha: senha

## Recursos Implementados

- ✅ Autenticação JWT com diferentes perfis de acesso
- ✅ API RESTful com padrão de arquitetura em camadas
- ✅ Banco de dados PostgreSQL com Entity Framework Core
- ✅ Cache distribuído com Redis
- ✅ Mensageria com RabbitMQ
- ✅ Containerização com Docker e Docker Compose
- ✅ Injeção de Dependência
- ✅ Arquitetura de Microserviços
- ✅ BFF (Backend For Frontend)
- ✅ Versionamento da API
- ✅ Frontend com Angular
