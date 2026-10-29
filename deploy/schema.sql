-- =============================================================================
-- Banco de dados MySQL do projeto Contabilidade Waldo
-- Compatível com MySQL 8.0+ (testado também em MariaDB 10.11).
--
-- Como executar:
--   mysql -u root -p < database/waldo_contabilidade.sql
--
-- As tabelas e colunas seguem exatamente o mapeamento das entidades JPA
-- (DomainModels.java + BaseEntity.java), por isso passam na validação do
-- Hibernate (spring.jpa.hibernate.ddl-auto=validate).
-- O banco começa vazio: o primeiro administrador é criado via
-- POST /api/auth/bootstrap (requer APP_BOOTSTRAP_SECRET).
-- =============================================================================

CREATE DATABASE IF NOT EXISTS waldo_contabilidade
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE waldo_contabilidade;

-- Empresas (clientes do escritório)
CREATE TABLE IF NOT EXISTS empresas (
    id                   BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em            DATETIME(6)    NULL,
    atualizado_em        DATETIME(6)    NULL,
    versao               BIGINT         NULL,
    razao_social         VARCHAR(200)   NOT NULL,
    nome_fantasia        VARCHAR(160)   NOT NULL,
    cnpj                 VARCHAR(18)    NOT NULL,
    inscricao_estadual   VARCHAR(40)    NULL,
    inscricao_municipal  VARCHAR(40)    NULL,
    regime_tributario    VARCHAR(50)    NULL,
    fator_r              BIT(1)         NULL,
    data_abertura        DATE           NULL,
    cnae                 VARCHAR(180)   NULL,
    endereco             VARCHAR(240)   NULL,
    responsavel          VARCHAR(160)   NULL,
    email                VARCHAR(180)   NULL,
    telefone             VARCHAR(30)    NULL,
    responsavel_interno  VARCHAR(160)   NULL,
    data_inicio          DATE           NULL,
    situacao             VARCHAR(40)    NULL,
    faturamento_medio    DECIMAL(15,2)  NULL,
    funcionarios         INT            NULL,
    observacoes          VARCHAR(2000)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_empresa_cnpj UNIQUE (cnpj)
) ENGINE=InnoDB;

-- Obrigações fiscais (impostos)
CREATE TABLE IF NOT EXISTS obrigacoes_fiscais (
    id             BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em      DATETIME(6)    NULL,
    atualizado_em  DATETIME(6)    NULL,
    versao         BIGINT         NULL,
    empresa_id     BIGINT         NOT NULL,
    tipo           VARCHAR(140)   NOT NULL,
    competencia    VARCHAR(20)    NOT NULL,
    vencimento     DATE           NULL,
    valor          DECIMAL(15,2)  NULL,
    responsavel    VARCHAR(160)   NULL,
    situacao       VARCHAR(40)    NULL,
    protocolo      VARCHAR(100)   NULL,
    observacoes    VARCHAR(2000)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_obrigacoes_fiscais_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id)
) ENGINE=InnoDB;

-- Folhas de pagamento
CREATE TABLE IF NOT EXISTS folhas_pagamento (
    id                  BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em           DATETIME(6)    NULL,
    atualizado_em       DATETIME(6)    NULL,
    versao              BIGINT         NULL,
    empresa_id          BIGINT         NOT NULL,
    competencia         VARCHAR(20)    NOT NULL,
    prazo_previsto      VARCHAR(60)    NULL,
    total_funcionarios  INT            NULL,
    responsavel         VARCHAR(160)   NULL,
    situacao            VARCHAR(40)    NULL,
    data_fechamento     DATE           NULL,
    data_entrega        DATE           NULL,
    observacoes         VARCHAR(2000)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_folhas_pagamento_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id)
) ENGINE=InnoDB;

-- Serviços sob demanda
CREATE TABLE IF NOT EXISTS servicos_demanda (
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em       DATETIME(6)    NULL,
    atualizado_em   DATETIME(6)    NULL,
    versao          BIGINT         NULL,
    empresa_id      BIGINT         NOT NULL,
    titulo          VARCHAR(180)   NOT NULL,
    descricao       VARCHAR(2000)  NULL,
    categoria       VARCHAR(100)   NULL,
    responsavel     VARCHAR(160)   NULL,
    prioridade      VARCHAR(30)    NULL,
    data_abertura   DATE           NULL,
    prazo_entrega   DATE           NULL,
    situacao        VARCHAR(50)    NULL,
    data_conclusao  DATE           NULL,
    observacoes     VARCHAR(2000)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_servicos_demanda_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id)
) ENGINE=InnoDB;

-- Solicitações de notas fiscais
CREATE TABLE IF NOT EXISTS solicitacoes_notas_fiscais (
    id                BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em         DATETIME(6)    NULL,
    atualizado_em     DATETIME(6)    NULL,
    versao            BIGINT         NULL,
    empresa_id        BIGINT         NOT NULL,
    tipo_nota         VARCHAR(80)    NULL,
    descricao         VARCHAR(500)   NULL,
    data_solicitacao  DATE           NULL,
    data_prevista     DATE           NULL,
    valor             DECIMAL(15,2)  NULL,
    responsavel       VARCHAR(160)   NULL,
    situacao          VARCHAR(40)    NULL,
    numero_nota       VARCHAR(80)    NULL,
    chave_acesso      VARCHAR(100)   NULL,
    observacoes       VARCHAR(2000)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_solicitacoes_notas_fiscais_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id)
) ENGINE=InnoDB;

-- Parcelamentos (e suas parcelas recentes)
CREATE TABLE IF NOT EXISTS parcelamentos (
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em       DATETIME(6)    NULL,
    atualizado_em   DATETIME(6)    NULL,
    versao          BIGINT         NULL,
    empresa_id      BIGINT         NOT NULL,
    orgao           VARCHAR(160)   NULL,
    numero_acordo   VARCHAR(80)    NULL,
    data_adesao     DATE           NULL,
    total_parcelas  INT            NULL,
    parcelas_pagas  INT            NULL,
    valor_parcela   DECIMAL(15,2)  NULL,
    dia_vencimento  INT            NULL,
    situacao        VARCHAR(40)    NULL,
    observacoes     VARCHAR(2000)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_parcelamentos_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS parcelas_recentes (
    parcelamento_id  BIGINT         NOT NULL,
    numero           INT            NULL,
    competencia      VARCHAR(20)    NULL,
    vencimento       DATE           NULL,
    valor            DECIMAL(15,2)  NULL,
    situacao         VARCHAR(30)    NULL,
    data_pagamento   DATE           NULL,
    CONSTRAINT fk_parcelas_recentes_parcelamento FOREIGN KEY (parcelamento_id) REFERENCES parcelamentos (id)
) ENGINE=InnoDB;

-- Documentos (somente metadados, sem upload binário)
CREATE TABLE IF NOT EXISTS documentos (
    id                BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em         DATETIME(6)    NULL,
    atualizado_em     DATETIME(6)    NULL,
    versao            BIGINT         NULL,
    empresa_id        BIGINT         NOT NULL,
    nome              VARCHAR(240)   NOT NULL,
    categoria         VARCHAR(100)   NULL,
    data_solicitacao  DATE           NULL,
    prazo_envio       DATE           NULL,
    responsavel       VARCHAR(160)   NULL,
    situacao          VARCHAR(50)    NULL,
    data_recebimento  DATE           NULL,
    arquivo_mock      VARCHAR(240)   NULL,
    tamanho_mock      VARCHAR(40)    NULL,
    observacoes       VARCHAR(2000)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_documentos_empresa FOREIGN KEY (empresa_id) REFERENCES empresas (id)
) ENGINE=InnoDB;

-- Usuários do sistema (login)
CREATE TABLE IF NOT EXISTS usuarios (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    criado_em      DATETIME(6)   NULL,
    atualizado_em  DATETIME(6)   NULL,
    versao         BIGINT        NULL,
    nome           VARCHAR(140)  NOT NULL,
    email          VARCHAR(180)  NOT NULL,
    senha_hash     VARCHAR(100)  NOT NULL,
    cargo          VARCHAR(100)  NULL,
    perfil         VARCHAR(30)   NOT NULL DEFAULT 'COLABORADOR',
    ativo          BIT(1)        NOT NULL DEFAULT b'1',
    avatar         VARCHAR(30)   NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuario_email UNIQUE (email)
) ENGINE=InnoDB;

-- Notificações
CREATE TABLE IF NOT EXISTS notificacoes (
    id             BIGINT         NOT NULL AUTO_INCREMENT,
    criado_em      DATETIME(6)    NULL,
    atualizado_em  DATETIME(6)    NULL,
    versao         BIGINT         NULL,
    tipo           VARCHAR(30)    NULL,
    titulo         VARCHAR(180)   NOT NULL,
    mensagem       VARCHAR(2000)  NULL,
    `data`         VARCHAR(60)    NULL,
    link           VARCHAR(300)   NULL,
    lida           BIT(1)         NOT NULL DEFAULT b'0',
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Configuração do escritório
CREATE TABLE IF NOT EXISTS configuracao_escritorio (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    criado_em        DATETIME(6)   NULL,
    atualizado_em    DATETIME(6)   NULL,
    versao           BIGINT        NULL,
    nome_fantasia    VARCHAR(180)  NOT NULL,
    razao_social     VARCHAR(180)  NULL,
    cnpj             VARCHAR(18)   NULL,
    crc              VARCHAR(30)   NULL,
    responsavel      VARCHAR(140)  NULL,
    email            VARCHAR(180)  NULL,
    email_comercial  VARCHAR(180)  NULL,
    telefone         VARCHAR(30)   NULL,
    whatsapp         VARCHAR(30)   NULL,
    endereco         VARCHAR(240)  NULL,
    cidade           VARCHAR(100)  NULL,
    uf               VARCHAR(2)    NULL,
    cep              VARCHAR(12)   NULL,
    horario          VARCHAR(100)  NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

USE waldo_contabilidade;

INSERT INTO usuarios (
    nome,
    email,
    senha_hash,
    cargo,
    perfil,
    ativo
) VALUES (
    'Administrador Teste',
    'admin@teste.com',
    '$2a$10$uNhWXgNlNJHiJ4fOCHMtX.KChZUKEsvisBtGEWyTQlrRasjEEk0Te',
    'Administrador',
    'ADMIN',
    b'1'
);
SELECT
    id,
    nome,
    email,
    senha_hash,
    perfil,
    ativo
FROM usuarios
WHERE email = 'admin@teste.com'
;
SELECT * FROM configuracao_escritorio;