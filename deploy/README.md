# Deploy do Sistema Waldo Ferreira Assessoria Contábil

Este diretório contém os arquivos necessários para rodar a aplicação completa via Docker Compose:
- **MySQL 8.4** (com carga automática do script `schema.sql`)
- **Backend Spring Boot**
- **Frontend**

## Como rodar localmente com Docker Compose

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Inicie os containers:
   ```bash
   docker compose up -d --build
   ```
3. Acesse:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:8080/api/health`
