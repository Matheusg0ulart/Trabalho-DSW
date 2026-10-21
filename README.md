# Waldo Ferreira Assessoria Contábil — Sistema de Gestão & Landing Page

> **Projeto de Desenvolvimento de Software para Web (DSW)**  
> **Status:** Site público e painel administrativo; módulos administrativos conectados à API Spring com persistência local H2.
> **Stack Atual:** HTML5 Semântico, CSS3, JavaScript ES6+, Chart.js local, Maven, Spring Boot e H2.

---

## 1. Visão Geral do Projeto

Este projeto moderniza integralmente a presença digital e as rotinas operacionais do escritório **Waldo Ferreira Assessoria Contábil** (CRC-SP 1SP234567/O-8), dividindo a aplicação em duas áreas complementares:

1. **Landing Page Pública (`index.html`):**  
   Interface institucional voltada a clientes e potenciais contratantes. Apresenta a história do escritório, diferencial consultivo, portfólio completo com 10 serviços contábeis, simulador tributário interativo com cálculo de alíquotas em tempo real, depoimentos de clientes reais, perguntas frequentes (FAQ) com sanfona/accordion, múltiplos canais de contato e botão direto para a **Área do Contador**.

2. **Área Administrativa Privada (`login.html` & `admin/*.html`):**  
   Painel de controle profissional completo para a equipe do escritório acompanhar a rotina operacional contábil, fiscal e trabalhista das empresas atendidas, distribuído em **12 páginas/módulos dedicados**:
   - **Dashboard Principal:** 11 cards de KPIs em tempo real, 2 gráficos interativos (Chart.js), alertas de atenção imediata e feed de atividades recentes.
   - **Empresas & Clientes:** Tabela com busca em tempo real, filtros por regime tributário e situação, cadastro, edição e **modal com 8 abas** de detalhes completos.
   - **Impostos & Obrigações Fiscais:** Controle de guias tributárias (DAS, DCTFWeb, Reinf, PIS/COFINS, IRPJ/CSLL), filtros por competência/empresa/situação, destaques visuais para vencimentos próximos/atrasados e atualização de situação.
   - **Folha de Pagamento & DP:** Pipeline mensal por empresa e competência, acompanhamento das etapas (Aguardando Informações, Processamento, Conferência, Fechada, Entregue) e checklist demonstrativo.
   - **Serviços & Demandas:** Gestão de tarefas societárias e extraordinárias (Abertura, alteração, regularização, CNDs), ordenação por prazo e prioridades (Urgente, Alta, Normal).
   - **Solicitações de Notas Fiscais:** Acompanhamento de pedidos de emissão (NFS-e, NF-e, CT-e), com atualização de situação e persistência dos registros.
   - **Parcelamentos Tributários:** Acompanhamento de acordos junto à Receita Federal, PGFN e Prefeituras, com extrato de parcelas e registro de pagamento.
   - **Documentos:** Controle de solicitações e situação de documentos; o backend atual armazena metadados, não o conteúdo dos arquivos.
   - **Agenda & Calendário:** Calendário mensal visual unificado (Outubro de 2026) e linha do tempo dos próximos prazos por cores de categoria.
   - **Relatórios Gerenciais:** 6 relatórios analíticos completos com indicadores de síntese e **exportação real para arquivo CSV compatível com Microsoft Excel** (com suporte nativo a acentuação UTF-8 BOM).
   - **Usuários & Perfis:** Gestão da equipe contábil interna, controle de perfis (Administrador vs Colaborador) e aba de configurações cadastrais do escritório.
   - **Central de Notificações:** Feed de alertas classificados por severidade (Crítico, Alerta, Info, Sucesso) com marcação de leitura e atalhos diretos aos módulos.

---

## 2. Estrutura do Repositório

```text
Trabalho-DSW/
├── pom.xml                                   # Configuração Maven do Spring Boot
├── mvnw / mvnw.cmd                           # Maven Wrapper
├── site-contabilidade-waldo/                 # Cópia estática espelhada para uso isolado
│   ├── Agents.md                             # Diretrizes e regras do projeto
│   ├── index.html                            # Landing page
│   ├── login.html                            # Login
│   ├── css/                                  # Estilos
│   ├── js/                                   # Scripts e DataStore
│   └── admin/                                # 12 telas administrativas
├── src/
│   ├── main/
│   │   ├── java/desenvolvimento/web/contabilidade/trabalho/contabilidade1/
│   │   │   ├── Application.java              # Classe principal Spring Boot
│   │   │   └── SecurityConfig.java           # Configuração de segurança (libera estáticos)
│   │   └── resources/
│   │       ├── application.properties        # Propriedades da aplicação
│   │       └── static/                       # Diretório servido pelo Spring Boot
│   │           ├── index.html                # Landing page pública modernizada
│   │           ├── index.react-bundle.html   # Backup de segurança da versão anterior
│   │           ├── login.html                # Tela de login na Área do Contador
│   │           ├── favicon.svg               # Identidade visual em vetor
│   │           ├── waldo-portrait.jpg        # Foto institucional do contador Waldo Ferreira
│   │           ├── hero-office.jpg           # Imagem corporativa do escritório
│   │           ├── assets/                   # Imagens e bundles preservados
│   │           ├── css/
│   │           │   ├── styles.css            # Design system da Landing Page e Login
│   │           │   └── admin.css             # Design system do Painel Administrativo
│   │           ├── js/
│   │           │   ├── data.js               # DATA STORE CENTRALIZADO (dados mock + CRUD + CSV)
│   │           │   ├── main.js               # Lógica interativa da Landing Page (simulador, etc.)
│   │           │   ├── admin.js              # Controladores compartilhados (sidebar, toast, modal)
│   │           │   └── chart.min.js          # Biblioteca Chart.js local (100% offline)
│   │           └── admin/                    # MÓDULOS ADMINISTRATIVOS INDEPENDENTES
│   │               ├── dashboard.html        # Dashboard principal
│   │               ├── empresas.html         # Módulo de Empresas & Clientes
│   │               ├── impostos.html         # Módulo de Obrigações Fiscais
│   │               ├── folha.html            # Módulo de Folha de Pagamento
│   │               ├── servicos.html         # Módulo de Serviços & Demandas
│   │               ├── notas-fiscais.html    # Módulo de Solicitações de NF
│   │               ├── parcelamentos.html    # Módulo de Parcelamentos
│   │               ├── documentos.html       # Módulo de Documentos de Clientes
│   │               ├── agenda.html           # Módulo de Agenda & Prazos
│   │               ├── relatorios.html       # Módulo de Relatórios & CSV
│   │               ├── usuarios.html         # Módulo de Usuários & Configurações
│   │               └── notificacoes.html     # Central de Notificações
└── target/                                   # Artefato compilado (.jar)
```

---

## 3. Como Executar o Projeto

Você pode executar o projeto de **duas maneiras**:

### Opção A: Executar via Spring Boot (Servidor Web)
O Spring Boot serve a interface e a API. O perfil padrão usa H2 persistido em `./data/`, sem exigir outro servidor de banco.

1. No terminal, na raiz do repositório, execute:
   ```bash
   # Windows PowerShell
   $env:APP_BOOTSTRAP_SECRET = "defina-uma-chave-local-forte"
   .\mvnw.cmd spring-boot:run

   # macOS / Linux
   export APP_BOOTSTRAP_SECRET="defina-uma-chave-local-forte"
   ./mvnw spring-boot:run
   ```

2. Abra o navegador e acesse:
   - **Landing Page Pública:** [http://localhost:8080/](http://localhost:8080/)
   - **Login / Área do Contador:** [http://localhost:8080/login.html](http://localhost:8080/login.html)
   - **Dashboard Administrativo:** [http://localhost:8080/admin/dashboard.html](http://localhost:8080/admin/dashboard.html)
   - **Saúde da API:** [http://localhost:8080/api/health](http://localhost:8080/api/health)

### Opção B: Executar como Site Estático (Live Server / Navegador Direto)
Como a aplicação foi construída utilizando padrões web modernos e arquivos desacoplados sem necessidade de transpilação:
- Abra `src/main/resources/static/index.html` diretamente em um navegador moderno.
- Ou utilize a extensão **Live Server** do VS Code / servidor HTTP local (`python -m http.server 8080`).

---

## 4. Banco de dados e API REST

O backend possui entidades JPA para empresas, obrigações fiscais, folhas, serviços, notas fiscais, parcelamentos, documentos, usuários, notificações e dados do escritório. O perfil padrão usa H2 persistido em arquivo em `./data/`; não é necessário iniciar um servidor de banco separado.
O banco começa vazio: os registros fictícios da interface não são copiados automaticamente para a API.

### Interface conectada ao backend

- `js/data.js` mantém a interface existente e carrega/salva os registros pela API Spring.
- O login valida a conta no backend. A credencial HTTP Basic fica na sessão da aba e é enviada às rotas protegidas; as operações de escrita usam o token CSRF.
- Empresas, obrigações fiscais, folhas, serviços, notas, parcelamentos, documentos, notificações, usuários e dados do escritório são ligados às respectivas rotas da API.
- O banco começa vazio. Os registros fictícios antigos do navegador não são importados para o banco; após autenticar, o cache local é substituído pelos dados recebidos da API.
- Para apresentação escolar, o login tem o botão **Acessar Demonstração para Apresentação**. Ele abre o painel com dados fictícios locais, sem autenticar nem gravar no banco.
- CSV continua sendo gerado no navegador; não é uma gravação no servidor.
- A exportação para **CSV** gera e baixa um arquivo `.csv` real gerado diretamente pelo navegador via `Blob`, com formatação compatível com Excel brasileiro (delimitador ponto e vírgula e BOM UTF-8).

### Configuração inicial do primeiro administrador

1. Defina `APP_BOOTSTRAP_SECRET` antes de iniciar o Spring Boot.
2. Faça `GET /api/auth/csrf` e guarde o cookie `XSRF-TOKEN` e o valor `token` retornado.
3. Faça uma única chamada `POST /api/auth/bootstrap`, enviando o cookie, o cabeçalho `X-XSRF-TOKEN`, o cabeçalho `X-Setup-Secret` e um JSON com `nome`, `email` e `senha` (mínimo de 12 caracteres).
4. Depois da configuração inicial, use autenticação HTTP Basic com o e-mail e a senha. Requisições de escrita também precisam do token CSRF.

Exemplo de configuração inicial no PowerShell (execute em outro terminal enquanto o aplicativo está rodando):

```powershell
$env:APP_BOOTSTRAP_SECRET = "a-mesma-chave-local-configurada-no-servidor"
$web = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$csrf = Invoke-RestMethod "http://localhost:8080/api/auth/csrf" -WebSession $web
$headers = @{
  "X-Setup-Secret" = $env:APP_BOOTSTRAP_SECRET
  "X-XSRF-TOKEN" = $csrf.token
}
$body = @{ nome = "Administrador"; email = "admin@exemplo.local"; senha = "troque-por-uma-senha-forte-com-12-caracteres" } | ConvertTo-Json
Invoke-RestMethod "http://localhost:8080/api/auth/bootstrap" -Method Post -WebSession $web -Headers $headers -ContentType "application/json" -Body $body
```

### Recursos

- `GET/POST /api/empresas` e `GET/PUT/DELETE /api/empresas/{id}`
- CRUD paginado em `/api/impostos`, `/api/folhas`, `/api/servicos`, `/api/notas-fiscais`, `/api/parcelamentos`, `/api/documentos` e `/api/notificacoes`
- CRUD em `/api/usuarios` para administradores; senhas são armazenadas com BCrypt e `PATCH /api/usuarios/{id}/status` ativa/desativa contas
- CRUD em `/api/escritorio` para administradores
- `GET /api/dashboard/resumo`, `GET /api/auth/me` e `GET /api/health`

As listagens são paginadas (padrão 50 itens; use `?page=0&size=50`). `DELETE` arquiva registros de negócio para preservar o histórico. Os dados do H2 ficam em `./data/`, pasta ignorada pelo Git. O perfil `prod` lê `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` para MySQL e valida o esquema existente; a migração inicial desse banco ainda precisa ser preparada antes de uma implantação.

## 5. Escopo atual e próximos passos

A integração cobre os cadastros e operações demonstrativas disponíveis na interface. O simulador tributário público e formulários de contato da landing page ainda não gravam solicitações na API. A área de documentos armazena metadados, sem upload binário. A emissão exibida na interface altera o registro do sistema e não transmite notas a serviços fiscais externos. Antes de uso comercial, prepare migrações do banco MySQL, HTTPS e integrações fiscais/documentais necessárias.
