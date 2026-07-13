# 🎬 Cinemais API

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/NixonSL/cinemais-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2-green)](https://fastify.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/tests-vitest-purple)](https://vitest.dev/)

API REST profissional para gerenciamento de catálogo de mídias (filmes e séries) e sistema de favoritos de usuários. Desenvolvida com foco em segurança, escalabilidade e melhores práticas de desenvolvimento.

## 📋 Sobre o Projeto

A Cinemais API é uma solução completa para plataformas de streaming e catálogos de cinema, fornecendo endpoints robustos para:
- Gerenciamento de catálogo de mídias (filmes e séries)
- Sistema personalizado de favoritos por usuário
- Autenticação e autorização JWT
- Documentação automática via Swagger/OpenAPI

**Problema que resolve:** Simplifica a integração de serviços de streaming com sistemas de gerenciamento de catálogo, oferecendo uma API RESTful segura, documentada e testada.

## 🛠 Stack Tecnológica

- **Runtime:** Node.js 18+
- **Linguagem:** TypeScript 5.8
- **Framework Web:** Fastify 5.2
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma 6.5
- **Validação:** Zod 3.24
- **Testes:** Vitest 3.0
- **Documentação:** Swagger/OpenAPI
- **Containerização:** Docker & Docker Compose
- **Linting:** ESLint + Prettier

## ✨ Features Principais

- **CRUD completo de mídias** - Criar, ler, atualizar e deletar filmes e séries
- **Sistema de favoritos** - Gerenciamento personalizado por usuário
- **Validação de dados** - Schema validation com Zod
- **Documentação automática** - Swagger UI disponível em `/docs`
- **Testes automatizados** - Cobertura de testes unitários
- **Docker containerizado** - Deploy simplificado com Docker Compose
- **Type-safe** - Desenvolvimento totalmente tipado com TypeScript

## 🔒 Segurança (Destaque Importante)

A API implementa múltiplas camadas de segurança:

- **Helmet** - Security headers otimizados (CSP, HSTS, X-Frame-Options)
- **CORS configurado** - Controle rigoroso de origens permitidas
- **Rate limiting** - 100 requisições por minuto por IP
- **Input sanitization** - Proteção contra XSS e injection attacks
- **Secure logging** - Logs sem dados sensíveis (senhas, tokens)
- **JWT authentication** - Autenticação baseada em tokens JWT
- **HTTPS enforcement** - Redirecionamento automático para HTTPS em produção
- **Docker Secrets** - Gestão segura de secrets em produção
- **Database encryption** - Suporte para conexões SSL/TLS com PostgreSQL
- **Audit logging** - Rastreabilidade completa de operações críticas

## 📦 Pré-requisitos

- **Node.js** 18 ou superior
- **Docker** e **Docker Compose** (para execução com containers)
- **PostgreSQL** (opcional, pode usar Docker)

## 🚀 Instalação e Execução

### Clone do repositório

```bash
git clone https://github.com/NixonSL/cinemais-api.git
cd cinemais-api
```

### Instalação de dependências

```bash
npm install
```

### Configuração de variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cinemais?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
HOST="0.0.0.0"
NODE_ENV="development"
CORS_ORIGIN="*"
```

### Execução local

```bash
# Gererar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

### Execução com Docker

```bash
# Build e start dos containers
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar containers
docker-compose down
```

## 📁 Estrutura do Projeto

```
cinemais-api/
├── src/
│   ├── errors/           # Tratamento de erros customizados
│   ├── lib/              # Utilitários (Prisma client)
│   ├── plugins/          # Plugins Fastify (auth, sanitize, logger)
│   ├── repositories/     # Camada de acesso a dados
│   ├── routes/           # Definição de rotas da API
│   ├── app.ts            # Configuração do Fastify
│   └── server.ts         # Entry point da aplicação
├── prisma/
│   ├── migrations/       # Migrações do banco de dados
│   └── schema.prisma     # Schema do Prisma
├── tests/
│   └── unit/             # Testes unitários
├── .env.example          # Exemplo de variáveis de ambiente
├── docker-compose.yml    # Configuração Docker (dev)
├── docker-compose.prod.yml # Configuração Docker (prod)
├── Dockerfile            # Imagem Docker
└── package.json          # Dependências e scripts
```

## 🌐 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/docs` | Documentação Swagger UI |
| GET | `/media` | Listar todas as mídias |
| POST | `/media` | Criar nova mídia |
| GET | `/media/:id` | Buscar mídia por ID |
| PUT | `/media/:id` | Atualizar mídia |
| DELETE | `/media/:id` | Deletar mídia |
| GET | `/users/:userId/favorites` | Listar favoritos do usuário |
| POST | `/users/:userId/favorites` | Adicionar mídia aos favoritos |
| DELETE | `/users/:userId/favorites/:mediaId` | Remover mídia dos favoritos |

### Exemplos de Requisições

**Criar nova mídia:**
```bash
curl -X POST http://localhost:3000/media \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "description": "A thief who steals corporate secrets through dream-sharing technology",
    "type": "movie",
    "releaseYear": 2010,
    "genre": "Sci-Fi"
  }'
```

**Listar favoritos:**
```bash
curl -X GET http://localhost:3000/users/user123/favorites \
  -H "Authorization: Bearer <your-jwt-token>"
```

📖 **Documentação completa disponível em:** `http://localhost:3000/docs`

## 🧪 Testes

### Executar testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch
```

### Cobertura

Os testes cobrem:
- Repositories (Media, Favorites)
- Services de negócio
- Validação de schemas
- Plugins customizados

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Executa em modo desenvolvimento com hot-reload |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm start` | Executa a aplicação em produção |
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run lint` | Verifica código com ESLint |
| `npm run format` | Formata código com Prettier |
| `npm run db:migrate` | Executa migrações do Prisma |
| `npm run db:generate` | Gera cliente Prisma |

## 💻 Desenvolvimento

### Como contribuir

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de código

- **TypeScript strict mode** habilitado
- **ESLint** para linting
- **Prettier** para formatação consistente
- **Conventional Commits** para mensagens de commit
- **Testes unitários** obrigatórios para novas features

### Linting e formatação

```bash
# Verificar lint
npm run lint

# Formatar código
npm run format
```

## 🚀 Deploy

### Docker Compose (Produção)

```bash
# Usar docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

### Docker Secrets

Para produção, use Docker Secrets para gerenciar informações sensíveis:

```bash
echo "your-secret-key" | docker secret create jwt_secret -
echo "db-password" | docker secret create db_password -
```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ para a comunidade de streaming
