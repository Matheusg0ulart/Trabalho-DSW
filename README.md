# Waldo Ferreira Assessoria Contábil — Sistema de Gestão & Landing Page

> **Projeto de Desenvolvimento de Software para Web (DSW)**  
> **Status:** Frontend completo, modular, responsivo e interativo (Modo Demonstrativo).  
> **Stack Atual:** HTML5 Semântico, CSS3 Moderno (Design System Corporativo), JavaScript ES6+ desacoplado, Chart.js local (offline), Maven & Spring Boot 4.x.

---

## 1. Visão Geral do Projeto

Este projeto moderniza integralmente a presença digital e as rotinas operacionais do escritório **Waldo Ferreira Assessoria Contábil** (CRC-SP 1SP234567/O-8), dividindo a aplicação em duas áreas complementares:

1. **Landing Page Pública (`index.html`):**  
   Interface institucional voltada a clientes e potenciais contratantes. Apresenta a história do escritório, diferencial consultivo, portfólio completo com 10 serviços contábeis, simulador tributário interativo com cálculo de alíquotas em tempo real, depoimentos de clientes reais, perguntas frequentes (FAQ) com sanfona/accordion, múltiplos canais de contato e botão direto para a **Área do Contador**.

2. **Área Administrativa Privada (`login.html` & `admin/*.html`):**  
   Painel de controle profissional completo para a equipe do escritório acompanhar a rotina operacional contábil, fiscal e trabalhista das empresas atendidas, distribuído em **12 páginas/módulos dedicados**:
   - **Dashboard Principal:** 11 cards de KPIs em tempo real, 2 gráficos interativos (Chart.js), alertas de atenção imediata e feed de atividades recentes.
   - **Empresas & Clientes:** Tabela com busca em tempo real, filtros por regime tributário e situação, cadastro, edição, desativação demonstrativa e **modal com 8 abas** de detalhes completos.
   - **Impostos & Obrigações Fiscais:** Controle de guias tributárias (DAS, DCTFWeb, Reinf, PIS/COFINS, IRPJ/CSLL), filtros por competência/empresa/situação, destaques visuais para vencimentos próximos/atrasados e ação de conclusão com emissão de protocolo demonstrativo.
   - **Folha de Pagamento & DP:** Pipeline mensal por empresa e competência, acompanhamento das etapas (Aguardando Informações, Processamento, Conferência, Fechada, Entregue) e checklist demonstrativo.
   - **Serviços & Demandas:** Gestão de tarefas societárias e extraordinárias (Abertura, alteração, regularização, CNDs), ordenação por prazo e prioridades (Urgente, Alta, Normal).
   - **Solicitações de Notas Fiscais:** Acompanhamento de pedidos de emissão (NFS-e, NF-e, CT-e) com valores, tomadores e emissão demonstrativa com geração de chave de acesso.
   - **Parcelamentos Tributários:** Acompanhamento de acordos junto à Receita Federal, PGFN e Prefeituras, com visualização do extrato de parcelas individuais e registro de pagamento demonstrativo.
   - **Documentos & Anexos:** Controle de solicitações de extratos bancários (OFX/PDF), livros e comprovantes enviados pelos clientes, com badges visuais de anexos e aprovação na demonstração.
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
Como o projeto utiliza Spring Boot configurado para servir arquivos estáticos em `src/main/resources/static/`:

1. No terminal, na raiz do repositório, execute:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(No Windows, utilize `mvnw.cmd spring-boot:run`)*

2. Abra o navegador e acesse:
   - **Landing Page Pública:** [http://localhost:8080/](http://localhost:8080/)
   - **Login / Área do Contador:** [http://localhost:8080/login.html](http://localhost:8080/login.html)
   - **Dashboard Administrativo:** [http://localhost:8080/admin/dashboard.html](http://localhost:8080/admin/dashboard.html)

### Opção B: Executar como Site Estático (Live Server / Navegador Direto)
Como a aplicação foi construída utilizando padrões web modernos e arquivos desacoplados sem necessidade de transpilação:
- Abra o arquivo `index.html` ou `site-contabilidade-waldo/index.html` diretamente em qualquer navegador moderno.
- Ou utilize a extensão **Live Server** do VS Code / servidor HTTP local (`python -m http.server 8080`).

---

## 4. O Modo Demonstrativo & Dados Centralizados

Conforme os requisitos do projeto, **não foram implementados** nesta etapa bancos de dados (MySQL, PostgreSQL), tabelas SQL, migrations ou endpoints REST reais de backend.

Para que a interface seja 100% dinâmica, consistente e navegável:
- Toda a lógica de dados está centralizada no arquivo `js/data.js` através da classe global `window.DataStore`.
- Os dados representam **8 empresas fictícias** coerentes entre si (ex: Tech Solutions IT, Clínica Saúde & Vida, Empório Lima, Inovare Engenharia, Nexus Digital, Panificadora Pão D'Ouro, Alpha Logística, Moda & Estilo).
- As obrigações fiscais, folhas de pagamento, serviços e documentos pertencem a essas empresas com identificadores vinculados.
- Os indicadores do Dashboard são **calculados dinamicamente** sobre os dados reais da tabela, e não com números estáticos fictícios desencontrados.
- Ao cadastrar uma empresa, concluir um imposto, avançar uma folha ou cadastrar um serviço, as alterações são salvas na sessão do `localStorage` do navegador e refletidas em tempo real em todas as telas.
- Há um botão **"Restaurar Dados Padrão"** no banner de demonstração caso queira reiniciar o estado de exemplo a qualquer momento.
- A exportação para **CSV** gera e baixa um arquivo `.csv` real gerado diretamente pelo navegador via `Blob`, com formatação compatível com Excel brasileiro (delimitador ponto e vírgula e BOM UTF-8).

---

## 5. Próximos Passos (Futura Integração com Backend & API)

Para a próxima fase do projeto (quando a infraestrutura de backend e banco de dados for introduzida), o código já está estrategicamente preparado:

1. **Modelagem de Entidades:**  
   Criar as entidades JPA correspondentes em Java (`Empresa`, `ObrigacaoFiscal`, `FolhaPagamento`, `Servico`, `NotaFiscal`, `Parcelamento`, `Documento`, `Usuario`).
2. **Banco de Dados Relacional:**  
   Reativar no `application.properties` os drivers do MySQL e configurar o Spring Data JPA / Hibernate.
3. **Endpoints REST:**  
   Criar `@RestController` para cada módulo mapeando `/api/empresas`, `/api/impostos`, `/api/folha`, etc.
4. **Substituição da Camada de Dados no Frontend:**  
   No arquivo `js/data.js`, substituir os métodos síncronos locais por chamadas `fetch('/api/...')` assíncronas. Os nomes de propriedades e campos já foram mantidos idênticos aos padrões de API REST corporativa.
5. **Autenticação Segura:**  
   Configurar Spring Security com autenticação JWT / Sessão HttpOnly para proteger as rotas da pasta `/admin/**`.
