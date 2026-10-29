/**
 * ==============================================================================
 * WALDO FERREIRA ASSESSORIA CONTÁBIL - CAMADA DE DADOS DA API
 * ==============================================================================
 * Mantém a interface síncrona existente e sincroniza os cadastros com a API Spring.
 * 
 * Permite persistência temporária no LocalStorage para que alterações feitas na UI
 * (como cadastrar empresa, concluir obrigação, atualizar folha) reflitam em tempo real
 * entre todas as telas administrativas e no dashboard.
 * ==============================================================================
 */

const STORAGE_KEY = 'WALDO_CONTABILIDADE_DEMO_DATA_V1';
const API_AUTH_KEY = 'WALDO_API_AUTH';
const API_COLLECTIONS = {
    empresas: '/api/empresas', impostos: '/api/impostos', folha: '/api/folhas',
    servicos: '/api/servicos', notasFiscais: '/api/notas-fiscais',
    parcelamentos: '/api/parcelamentos', documentos: '/api/documentos',
    notificacoes: '/api/notificacoes'
};

const DEFAULT_DATA = {
    escritorio: {
        nomeFantasia: "Waldo Ferreira Assessoria Contábil",
        razaoSocial: "Waldo Ferreira Assessoria & Consultoria Contábil Ltda",
        cnpj: "11.222.333/0001-44 [Demonstrativo]",
        crc: "CRC-SP 1SP234567/O-8",
        responsavel: "Waldo Ferreira",
        email: "waldoferreira@gmail.com",
        emailComercial: "contato@waldocontabilidade.com.br",
        telefone: "(11) 3999-8888",
        whatsapp: "(11) 99999-9999",
        endereco: "Av. Paulista, 1000 - Sala 501 - Bela Vista",
        cidade: "São Paulo",
        uf: "SP",
        cep: "01310-100",
        horario: "Segunda a Sexta, das 08h às 18h"
    },

    usuarios: [
        {
            id: 1,
            nome: "Waldo Ferreira",
            email: "waldo@waldocontabilidade.com.br",
            cargo: "Contador Responsável / Sócio",
            perfil: "Administrador",
            situacao: "Ativo",
            dataCadastro: "2024-01-10",
            avatar: "WF"
        },
        {
            id: 2,
            nome: "Juliana Martins",
            email: "juliana.martins@waldocontabilidade.com.br",
            cargo: "Contadora Sênior",
            perfil: "Administrador",
            situacao: "Ativo",
            dataCadastro: "2024-03-15",
            avatar: "JM"
        },
        {
            id: 3,
            nome: "Carlos Silveira",
            email: "carlos.fiscal@waldocontabilidade.com.br",
            cargo: "Analista Fiscal Pleno",
            perfil: "Colaborador",
            situacao: "Ativo",
            dataCadastro: "2024-06-01",
            avatar: "CS"
        },
        {
            id: 4,
            nome: "Beatriz Oliveira",
            email: "beatriz.dp@waldocontabilidade.com.br",
            cargo: "Analista de Departamento Pessoal",
            perfil: "Colaborador",
            situacao: "Ativo",
            dataCadastro: "2024-07-20",
            avatar: "BO"
        },
        {
            id: 5,
            nome: "Ricardo Mendes",
            email: "ricardo.assistente@waldocontabilidade.com.br",
            cargo: "Assistente Contábil",
            perfil: "Colaborador",
            situacao: "Ativo",
            dataCadastro: "2025-02-10",
            avatar: "RM"
        }
    ],

    empresas: [
        {
            id: 1,
            razaoSocial: "Tech Solutions Consultoria & Software Ltda",
            nomeFantasia: "Tech Solutions IT",
            cnpj: "34.567.890/0001-12 [Demo]",
            inscricaoEstadual: "Isento",
            inscricaoMunicipal: "8.765.432-1",
            regimeTributario: "Simples Nacional",
            fatorR: true,
            dataAbertura: "2021-04-15",
            cnae: "6201-5/01 - Desenvolvimento de programas de computador sob encomenda",
            endereco: "Rua Funchal, 418 - Vila Olímpia, São Paulo/SP",
            responsavel: "Carlos Eduardo Santos",
            email: "carlos@techsolutions.com.br",
            telefone: "(11) 98765-4321",
            responsavelInterno: "Carlos Silveira",
            dataInicio: "2022-01-10",
            situacao: "Ativa",
            faturamentoMedio: 75000,
            funcionarios: 6,
            observacoes: "Empresa de tecnologia focada em SaaS. Enquadrada no Anexo III do Simples Nacional via Fator R."
        },
        {
            id: 2,
            razaoSocial: "Clínica Médica Saúde & Vida Ltda",
            nomeFantasia: "Clínica Saúde & Vida",
            cnpj: "45.678.901/0001-23 [Demo]",
            inscricaoEstadual: "Isento",
            inscricaoMunicipal: "7.654.321-0",
            regimeTributario: "Simples Nacional",
            fatorR: true,
            dataAbertura: "2020-08-20",
            cnae: "8630-5/03 - Atividade médica ambulatorial restrita a consultas",
            endereco: "Av. Brigadeiro Luís Antônio, 2500 - Bela Vista, São Paulo/SP",
            responsavel: "Dra. Juliana Mendes",
            email: "contato@saudevida.med.br",
            telefone: "(11) 97654-3210",
            responsavelInterno: "Juliana Martins",
            dataInicio: "2022-03-01",
            situacao: "Ativa",
            faturamentoMedio: 120000,
            funcionarios: 4,
            observacoes: "Sociedade Uniprofissional médica com recolhimento fixo de ISS e acompanhamento do Fator R."
        },
        {
            id: 3,
            razaoSocial: "Empório & Distribuidora Lima Comércio Varejista Ltda",
            nomeFantasia: "Empório Lima",
            cnpj: "56.789.012/0001-34 [Demo]",
            inscricaoEstadual: "110.220.330.440",
            inscricaoMunicipal: "6.543.210-9",
            regimeTributario: "Simples Nacional",
            fatorR: false,
            dataAbertura: "2019-11-10",
            cnae: "4712-1/00 - Comércio varejista de mercadorias em geral",
            endereco: "Rua Teodoro Sampaio, 1420 - Pinheiros, São Paulo/SP",
            responsavel: "Roberto Lima",
            email: "roberto@emporiolima.com.br",
            telefone: "(11) 96543-2109",
            responsavelInterno: "Carlos Silveira",
            dataInicio: "2021-08-15",
            situacao: "Ativa",
            faturamentoMedio: 180000,
            funcionarios: 12,
            observacoes: "Comércio com segregação de ICMS Substituição Tributária e PIS/COFINS monofásico."
        },
        {
            id: 4,
            razaoSocial: "Inovare Engenharia e Projetos Estruturais Ltda",
            nomeFantasia: "Inovare Engenharia",
            cnpj: "67.890.123/0001-45 [Demo]",
            inscricaoEstadual: "Isento",
            inscricaoMunicipal: "5.432.109-8",
            regimeTributario: "Lucro Presumido",
            fatorR: false,
            dataAbertura: "2018-05-12",
            cnae: "7112-0/00 - Serviços de engenharia",
            endereco: "Av. Engenheiro Luís Carlos Berrini, 105 - Brooklin, São Paulo/SP",
            responsavel: "Eng. Marcos Vinícius Prado",
            email: "marcos@inovareeng.com.br",
            telefone: "(11) 95432-1098",
            responsavelInterno: "Waldo Ferreira",
            dataInicio: "2020-02-10",
            situacao: "Ativa",
            faturamentoMedio: 240000,
            funcionarios: 8,
            observacoes: "Enquadrada no Lucro Presumido. Retenções na fonte de IRRF, CSLL, PIS e COFINS."
        },
        {
            id: 5,
            razaoSocial: "Nexus Soluções Digitais & Marketing SLU",
            nomeFantasia: "Nexus Digital",
            cnpj: "78.901.234/0001-56 [Demo]",
            inscricaoEstadual: "Isento",
            inscricaoMunicipal: "Em emissão",
            regimeTributario: "Simples Nacional",
            fatorR: true,
            dataAbertura: "2026-09-01",
            cnae: "7311-4/00 - Agências de publicidade e marketing",
            endereco: "Rua Augusta, 1500 - Consolação, São Paulo/SP",
            responsavel: "Fernanda Costa",
            email: "fernanda@nexusdigital.com.br",
            telefone: "(11) 94321-0987",
            responsavelInterno: "Juliana Martins",
            dataInicio: "2026-09-15",
            situacao: "Em Abertura",
            faturamentoMedio: 35000,
            funcionarios: 2,
            observacoes: "Processo de abertura de SLU em fase final de emissão de CCM e alvará."
        },
        {
            id: 6,
            razaoSocial: "Arte & Sabor Panificadora e Confeitaria ME",
            nomeFantasia: "Panificadora Pão D'Ouro",
            cnpj: "89.012.345/0001-67 [Demo]",
            inscricaoEstadual: "123.456.789.012",
            inscricaoMunicipal: "4.321.098-7",
            regimeTributario: "Simples Nacional",
            fatorR: false,
            dataAbertura: "2017-03-25",
            cnae: "1091-1/02 - Fabricação de produtos de padaria e confeitaria",
            endereco: "Rua Vergueiro, 3100 - Vila Mariana, São Paulo/SP",
            responsavel: "Antônio Ferreira",
            email: "antonio@paodouro.com.br",
            telefone: "(11) 93210-9876",
            responsavelInterno: "Carlos Silveira",
            dataInicio: "2023-05-10",
            situacao: "Regularização",
            faturamentoMedio: 65000,
            funcionarios: 7,
            observacoes: "Em regularização cadastral após desenquadramento do MEI e parcelamento de débitos."
        },
        {
            id: 7,
            razaoSocial: "Alpha Logística e Armazenagem de Cargas Ltda",
            nomeFantasia: "Alpha Logística",
            cnpj: "90.123.456/0001-78 [Demo]",
            inscricaoEstadual: "135.792.468.001",
            inscricaoMunicipal: "3.210.987-6",
            regimeTributario: "Lucro Presumido",
            fatorR: false,
            dataAbertura: "2016-09-18",
            cnae: "5211-7/99 - Depósitos de mercadorias para terceiros",
            endereco: "Av. Marginal Tietê, 7800 - Lapa, São Paulo/SP",
            responsavel: "Rodrigo Alencar",
            email: "rodrigo@alphalog.com.br",
            telefone: "(11) 92109-8765",
            responsavelInterno: "Waldo Ferreira",
            dataInicio: "2019-11-01",
            situacao: "Ativa",
            faturamentoMedio: 410000,
            funcionarios: 22,
            observacoes: "Grande operação logística com emissão volumosa de CT-e e NF-e de entrada/saída."
        },
        {
            id: 8,
            razaoSocial: "Moda & Estilo Confecções e Acessórios Eireli",
            nomeFantasia: "Moda & Estilo",
            cnpj: "01.234.567/0001-89 [Demo]",
            inscricaoEstadual: "147.258.369.002",
            inscricaoMunicipal: "2.109.876-5",
            regimeTributario: "Simples Nacional",
            fatorR: false,
            dataAbertura: "2015-02-14",
            cnae: "1412-6/01 - Confecção de peças do vestuário",
            endereco: "Rua da Graça, 650 - Bom Retiro, São Paulo/SP",
            responsavel: "Sandra Helena Gomes",
            email: "sandra@modaeestilo.com.br",
            telefone: "(11) 91098-7654",
            responsavelInterno: "Ricardo Mendes",
            dataInicio: "2018-04-20",
            situacao: "Inativa",
            faturamentoMedio: 0,
            funcionarios: 0,
            observacoes: "Atividades paralisadas temporariamente a pedido dos sócios. Entrega de declarações sem movimento."
        }
    ],

    impostos: [
        {
            id: 101,
            empresaId: 1,
            tipo: "DAS - Simples Nacional",
            competencia: "09/2026",
            vencimento: "2026-10-20",
            valor: 4500.00,
            responsavel: "Carlos Silveira",
            situacao: "Pendente",
            protocolo: "DAS-202609-00129",
            observacoes: "Guia apurada com Fator R no Anexo III (6%). Aguardando envio da guia ao cliente."
        },
        {
            id: 102,
            empresaId: 2,
            tipo: "DAS - Simples Nacional",
            competencia: "09/2026",
            vencimento: "2026-10-20",
            valor: 7200.00,
            responsavel: "Juliana Martins",
            situacao: "Pronta para Entrega",
            protocolo: "DAS-202609-00130",
            observacoes: "Alíquota efetiva de 6% aplicada com sucesso após folha de pro-labore dos médicos."
        },
        {
            id: 103,
            empresaId: 3,
            tipo: "DAS - Simples Nacional",
            competencia: "09/2026",
            vencimento: "2026-10-20",
            valor: 11450.00,
            responsavel: "Carlos Silveira",
            situacao: "Entregue",
            protocolo: "DAS-202609-00115",
            observacoes: "Guia transmitida e enviada por e-mail e WhatsApp com comprovante de recebimento."
        },
        {
            id: 104,
            empresaId: 4,
            tipo: "DCTFWeb / Previdenciário",
            competencia: "09/2026",
            vencimento: "2026-10-15",
            valor: 8900.00,
            responsavel: "Waldo Ferreira",
            situacao: "Atrasada",
            protocolo: "DCTF-202609-PEND",
            observacoes: "Venceu no dia 15/10. Aguardando extrato complementar de retenções de obras para emissão com juros."
        },
        {
            id: 105,
            empresaId: 4,
            tipo: "PIS / COFINS (Cumulativo)",
            competencia: "09/2026",
            vencimento: "2026-10-25",
            valor: 8760.00,
            responsavel: "Waldo Ferreira",
            situacao: "Em Andamento",
            protocolo: "DARF-PISCOF-0926",
            observacoes: "Calculando créditos e retenções sofridas no faturamento das notas de engenharia."
        },
        {
            id: 106,
            empresaId: 7,
            tipo: "IRPJ / CSLL Trimestral (3º Tri)",
            competencia: "03T/2026",
            vencimento: "2026-10-31",
            valor: 32450.00,
            responsavel: "Waldo Ferreira",
            situacao: "Em Andamento",
            protocolo: "DARF-IRPJ-3T26",
            observacoes: "Fechamento do terceiro trimestre de 2026 em conferência de balancete."
        },
        {
            id: 107,
            empresaId: 7,
            tipo: "ICMS - Transporte / Armazém",
            competencia: "09/2026",
            vencimento: "2026-10-25",
            valor: 14800.00,
            responsavel: "Carlos Silveira",
            situacao: "Pendente",
            protocolo: "GARE-ICMS-SP",
            observacoes: "Aguardando livro fiscal de entradas e saídas da filial de São Paulo."
        },
        {
            id: 108,
            empresaId: 6,
            tipo: "DAS - Simples Nacional",
            competencia: "09/2026",
            vencimento: "2026-10-20",
            valor: 3950.00,
            responsavel: "Carlos Silveira",
            situacao: "Aguardando Documentos",
            protocolo: "DAS-202609-00140",
            observacoes: "Cliente não enviou redução Z e relatório de cartão de crédito até o momento."
        },
        {
            id: 109,
            empresaId: 1,
            tipo: "ISSQN Próprio - São Paulo",
            competencia: "09/2026",
            vencimento: "2026-10-10",
            valor: 0.00,
            responsavel: "Carlos Silveira",
            situacao: "Concluída",
            protocolo: "ISS-SP-ISENTO-SN",
            observacoes: "Recolhido conjuntamente no DAS do Simples Nacional."
        },
        {
            id: 110,
            empresaId: 3,
            tipo: "EFD-Reinf",
            competencia: "09/2026",
            vencimento: "2026-10-15",
            valor: 0.00,
            responsavel: "Carlos Silveira",
            situacao: "Concluída",
            protocolo: "REINF-SPED-0098712",
            observacoes: "Transmitido com sucesso no SPED eSocial/Reinf."
        }
    ],

    folha: [
        {
            id: 201,
            empresaId: 1,
            competencia: "10/2026",
            prazoPrevisto: "2026-11-06 (5º dia útil)",
            totalFuncionarios: 6,
            responsavel: "Beatriz Oliveira",
            situacao: "Em Processamento",
            dataFechamento: null,
            dataEntrega: null,
            observacoes: "Processando pro-labore dos 2 sócios e folha de 4 desenvolvedores."
        },
        {
            id: 202,
            empresaId: 2,
            competencia: "10/2026",
            prazoPrevisto: "2026-11-06 (5º dia útil)",
            totalFuncionarios: 4,
            responsavel: "Beatriz Oliveira",
            situacao: "Aguardando Informações",
            dataFechamento: null,
            dataEntrega: null,
            observacoes: "Aguardando espelho de ponto e eventuais horas extras dos plantonistas."
        },
        {
            id: 203,
            empresaId: 3,
            competencia: "09/2026",
            prazoPrevisto: "2026-10-07",
            totalFuncionarios: 12,
            responsavel: "Beatriz Oliveira",
            situacao: "Fechada",
            dataFechamento: "2026-10-04",
            dataEntrega: "2026-10-05",
            observacoes: "Holerites e guias de FGTS Digital transmitidas ao cliente."
        },
        {
            id: 204,
            empresaId: 4,
            competencia: "09/2026",
            prazoPrevisto: "2026-10-07",
            totalFuncionarios: 8,
            responsavel: "Beatriz Oliveira",
            situacao: "Entregue",
            dataFechamento: "2026-10-03",
            dataEntrega: "2026-10-04",
            observacoes: "Folha fechada com cálculo de adicional noturno de engenheiros de campo."
        },
        {
            id: 205,
            empresaId: 6,
            competencia: "09/2026",
            prazoPrevisto: "2026-10-07",
            totalFuncionarios: 7,
            responsavel: "Beatriz Oliveira",
            situacao: "Pendente de Correção",
            dataFechamento: null,
            dataEntrega: null,
            observacoes: "Atestado médico de funcionário padeiro entregue com divergência no CID."
        },
        {
            id: 206,
            empresaId: 7,
            competencia: "10/2026",
            prazoPrevisto: "2026-11-06 (5º dia útil)",
            totalFuncionarios: 22,
            responsavel: "Beatriz Oliveira",
            situacao: "Em Conferência",
            dataFechamento: null,
            dataEntrega: null,
            observacoes: "Conferindo comissão de motoristas e adicionais de periculosidade."
        }
    ],

    servicos: [
        {
            id: 301,
            titulo: "Abertura de Empresa SLU",
            descricao: "Registro na JUCESP, emissão de CNPJ, CCM e enquadramento no Simples Nacional",
            empresaId: 5,
            categoria: "Abertura de Empresa",
            responsavel: "Juliana Martins",
            prioridade: "Alta",
            dataAbertura: "2026-09-20",
            prazoEntrega: "2026-10-24",
            situacao: "Em Andamento",
            dataConclusao: null,
            observacoes: "DBE deferido pela Receita. Aguardando validação de viabilidade na prefeitura."
        },
        {
            id: 302,
            titulo: "Alteração Contratual - Entrada de Sócio",
            descricao: "Elaboração do 4º Aditivo ao Contrato Social e redistribuição de cotas de capital",
            empresaId: 1,
            categoria: "Alteração Contratual",
            responsavel: "Waldo Ferreira",
            prioridade: "Urgente",
            dataAbertura: "2026-10-05",
            prazoEntrega: "2026-10-18",
            situacao: "Em Andamento",
            dataConclusao: null,
            observacoes: "Prazo original venceu no dia 18/10. Aguardando assinatura com certificado A1 dos 2 sócios."
        },
        {
            id: 303,
            titulo: "Regularização de Pendência Cadastral SEFAZ",
            descricao: "Desbloqueio de Inscrição Estadual após atualização de endereço fiscal",
            empresaId: 6,
            categoria: "Regularização",
            responsavel: "Carlos Silveira",
            prioridade: "Alta",
            dataAbertura: "2026-10-01",
            prazoEntrega: "2026-10-22",
            situacao: "Aguardando Órgão Público",
            dataConclusao: null,
            observacoes: "Protocolo aberto no Posto Fiscal Eletrônico sob nº 98421."
        },
        {
            id: 304,
            titulo: "Emissão de Certidão Negativa de Débitos (CND RFB)",
            descricao: "Emissão de CND conjunta federal para participação em concorrência pública",
            empresaId: 4,
            categoria: "Emissão de Certidões",
            responsavel: "Ricardo Mendes",
            prioridade: "Normal",
            dataAbertura: "2026-10-12",
            prazoEntrega: "2026-10-21",
            situacao: "Concluído",
            dataConclusao: "2026-10-16",
            observacoes: "Certidão emitida sem pendências válida até abril de 2027."
        },
        {
            id: 305,
            titulo: "Estudo de Planejamento Tributário para 2027",
            descricao: "Comparativo entre Lucro Real e Lucro Presumido face à expansão da frota",
            empresaId: 7,
            categoria: "Planejamento Tributário",
            responsavel: "Waldo Ferreira",
            prioridade: "Normal",
            dataAbertura: "2026-09-15",
            prazoEntrega: "2026-11-15",
            situacao: "Aberto",
            dataConclusao: null,
            observacoes: "Coletando projeções de receita e despesas com folha e combustíveis."
        },
        {
            id: 306,
            titulo: "Renovação de Certificado Digital e-CNPJ A1",
            descricao: "Acompanhamento da validação por videoconferência com a autoridade certificadora",
            empresaId: 3,
            categoria: "Atendimento a Solicitações",
            responsavel: "Ricardo Mendes",
            prioridade: "Baixa",
            dataAbertura: "2026-10-14",
            prazoEntrega: "2026-10-28",
            situacao: "Aguardando Cliente",
            dataConclusao: null,
            observacoes: "Link de agendamento enviado ao WhatsApp do Sr. Roberto."
        }
    ],

    notasFiscais: [
        {
            id: 401,
            empresaId: 1,
            tipoNota: "NFS-e (Serviços)",
            descricao: "Consultoria em Arquitetura Cloud - Cliente Banco Alfa S/A",
            dataSolicitacao: "2026-10-18",
            dataPrevista: "2026-10-20",
            valor: 45000.00,
            responsavel: "Carlos Silveira",
            situacao: "Pronta para Emissão",
            numeroNota: null,
            chaveAcesso: null,
            observacoes: "Dados do tomador validados. Retenção de ISS devida no município de São Paulo."
        },
        {
            id: 402,
            empresaId: 2,
            tipoNota: "NFS-e (Serviços)",
            descricao: "Plantão Médico Ambulatorial Mensal - Hospital Santa Clara",
            dataSolicitacao: "2026-10-19",
            dataPrevista: "2026-10-21",
            valor: 28000.00,
            responsavel: "Juliana Martins",
            situacao: "Solicitada",
            numeroNota: null,
            chaveAcesso: null,
            observacoes: "Aguardando confirmação do relatório de plantões assinado pela diretoria clínica."
        },
        {
            id: 403,
            empresaId: 4,
            tipoNota: "NFS-e (Serviços)",
            descricao: "Medição nº 04 - Projeto Estrutural Residencial Jardim das Flores",
            dataSolicitacao: "2026-10-10",
            dataPrevista: "2026-10-12",
            valor: 85000.00,
            responsavel: "Waldo Ferreira",
            situacao: "Emitida",
            numeroNota: "2026/001452",
            chaveAcesso: "35261067890123000145550010000014521004589211",
            observacoes: "Nota transmitida com sucesso. XML e PDF disponibilizados no drive do cliente."
        },
        {
            id: 404,
            empresaId: 3,
            tipoNota: "NF-e (Mercadorias)",
            descricao: "Venda Varejo / Remessa de mercadorias para revenda interestadual",
            dataSolicitacao: "2026-10-16",
            dataPrevista: "2026-10-17",
            valor: 14200.00,
            responsavel: "Carlos Silveira",
            situacao: "Atrasada",
            numeroNota: null,
            chaveAcesso: null,
            observacoes: "Divergência no NCM de 2 itens importados. Aguardando ficha técnica do fornecedor."
        },
        {
            id: 405,
            empresaId: 7,
            tipoNota: "CT-e (Conhecimento de Transporte)",
            descricao: "Transporte intermunicipal de cargas secas - Lote SP-Campinas",
            dataSolicitacao: "2026-10-15",
            dataPrevista: "2026-10-16",
            valor: 19500.00,
            responsavel: "Ricardo Mendes",
            situacao: "Emitida",
            numeroNota: "2026/008901",
            chaveAcesso: "35261090123456000178570010000089011987452310",
            observacoes: "Emissão autorizada pela SEFAZ-SP sem ressalvas."
        }
    ],

    parcelamentos: [
        {
            id: 501,
            empresaId: 6,
            orgao: "Simples Nacional Especial (RFB/PGFN)",
            numeroAcordo: "PARC-SN-2024-9812",
            dataAdesao: "2024-05-10",
            totalParcelas: 60,
            parcelasPagas: 29,
            valorParcela: 840.50,
            diaVencimento: 25,
            situacao: "Ativo",
            observacoes: "Consolidação de débitos anteriores do Simples. Parcela 30 vence em 25/10/2026.",
            parcelasRecentes: [
                { numero: 28, competencia: "08/2026", vencimento: "2026-08-25", valor: 840.50, situacao: "Paga", dataPagamento: "2026-08-24" },
                { numero: 29, competencia: "09/2026", vencimento: "2026-09-25", valor: 840.50, situacao: "Paga", dataPagamento: "2026-09-25" },
                { numero: 30, competencia: "10/2026", vencimento: "2026-10-25", valor: 840.50, situacao: "A Vencer", dataPagamento: null },
                { numero: 31, competencia: "11/2026", vencimento: "2026-11-25", valor: 840.50, situacao: "A Vencer", dataPagamento: null }
            ]
        },
        {
            id: 502,
            empresaId: 3,
            orgao: "Prefeitura de São Paulo - PPI Tributário",
            numeroAcordo: "PPI-PMSP-2023-450",
            dataAdesao: "2023-09-15",
            totalParcelas: 36,
            parcelasPagas: 35,
            valorParcela: 1250.00,
            diaVencimento: 28,
            situacao: "Ativo",
            observacoes: "Última parcela para quitação total do acordo do ISS municipal de 2021.",
            parcelasRecentes: [
                { numero: 34, competencia: "08/2026", vencimento: "2026-08-28", valor: 1250.00, situacao: "Paga", dataPagamento: "2026-08-27" },
                { numero: 35, competencia: "09/2026", vencimento: "2026-09-28", valor: 1250.00, situacao: "Paga", dataPagamento: "2026-09-28" },
                { numero: 36, competencia: "10/2026", vencimento: "2026-10-28", valor: 1250.00, situacao: "A Vencer", dataPagamento: null }
            ]
        },
        {
            id: 503,
            empresaId: 4,
            orgao: "Receita Federal do Brasil (Transação Tributária)",
            numeroAcordo: "TRANS-RFB-2025-110",
            dataAdesao: "2025-01-20",
            totalParcelas: 48,
            parcelasPagas: 20,
            valorParcela: 2340.00,
            diaVencimento: 30,
            situacao: "Com Atraso",
            observacoes: "A parcela nº 21 com vencimento em 30/09 está em aberto. Necessário recalcular com acréscimos.",
            parcelasRecentes: [
                { numero: 19, competencia: "07/2026", vencimento: "2026-07-30", valor: 2340.00, situacao: "Paga", dataPagamento: "2026-07-29" },
                { numero: 20, competencia: "08/2026", vencimento: "2026-08-30", valor: 2340.00, situacao: "Paga", dataPagamento: "2026-08-30" },
                { numero: 21, competencia: "09/2026", vencimento: "2026-09-30", valor: 2340.00, situacao: "Vencida", dataPagamento: null },
                { numero: 22, competencia: "10/2026", vencimento: "2026-10-30", valor: 2340.00, situacao: "A Vencer", dataPagamento: null }
            ]
        }
    ],

    documentos: [
        {
            id: 601,
            empresaId: 1,
            nome: "Extratos Bancários Mensais em OFX (Itaú / Inter)",
            categoria: "Contábil / Financeiro",
            dataSolicitacao: "2026-10-01",
            prazoEnvio: "2026-10-10",
            responsavel: "Carlos Silveira",
            situacao: "Recebido",
            dataRecebimento: "2026-10-08",
            arquivoMock: "extrato_itau_setembro2026.ofx",
            tamanhoMock: "142 KB",
            observacoes: "Importado para conciliação bancária do mês de setembro."
        },
        {
            id: 602,
            empresaId: 2,
            nome: "Relatório de Despesas Médicas e Livro Caixa",
            categoria: "Fiscal",
            dataSolicitacao: "2026-10-05",
            prazoEnvio: "2026-10-15",
            responsavel: "Juliana Martins",
            situacao: "Em Conferência",
            dataRecebimento: "2026-10-14",
            arquivoMock: "livro_caixa_clinica_set26.xlsx",
            tamanhoMock: "380 KB",
            observacoes: "Conferindo deduções de próteses e medicamentos para apuração de IRPJ."
        },
        {
            id: 603,
            empresaId: 3,
            nome: "Comprovantes de Pagamento de Fornecedores e Guias",
            categoria: "Contábil",
            dataSolicitacao: "2026-10-02",
            prazoEnvio: "2026-10-12",
            responsavel: "Carlos Silveira",
            situacao: "Aguardando Cliente",
            dataRecebimento: null,
            arquivoMock: null,
            tamanhoMock: null,
            observacoes: "Cliente avisou que enviará na próxima segunda-feira."
        },
        {
            id: 604,
            empresaId: 4,
            nome: "Contratos de Prestação de Serviços de Subempreiteiros",
            categoria: "Departamento Pessoal / Jurídico",
            dataSolicitacao: "2026-09-25",
            prazoEnvio: "2026-10-05",
            responsavel: "Beatriz Oliveira",
            situacao: "Pendente de Correção",
            dataRecebimento: "2026-10-06",
            arquivoMock: "contrato_obra_berrini.pdf",
            tamanhoMock: "1.2 MB",
            observacoes: "Faltou assinatura de testemunhas e especificação do percentual de retenção de INSS."
        },
        {
            id: 605,
            empresaId: 5,
            nome: "Documento de Identidade dos Sócios (RG/CNH) e Comprovante de Residência",
            categoria: "Societário / Cadastral",
            dataSolicitacao: "2026-09-18",
            prazoEnvio: "2026-09-22",
            responsavel: "Juliana Martins",
            situacao: "Aprovado",
            dataRecebimento: "2026-09-20",
            arquivoMock: "cnh_fernanda_costa.pdf",
            tamanhoMock: "850 KB",
            observacoes: "Documentos validados na Junta Comercial."
        },
        {
            id: 606,
            empresaId: 6,
            nome: "Relatório de Reduções Z e Movimento de Cartões de Crédito",
            categoria: "Fiscal",
            dataSolicitacao: "2026-10-02",
            prazoEnvio: "2026-10-08",
            responsavel: "Carlos Silveira",
            situacao: "Aguardando Cliente",
            dataRecebimento: null,
            arquivoMock: null,
            tamanhoMock: null,
            observacoes: "Prazo expirado. Cobrança enviada por WhatsApp em 14/10."
        }
    ],

    notificacoes: [
        {
            id: 1,
            tipo: "critico",
            titulo: "Obrigação Fiscal em Atraso",
            mensagem: "DCTFWeb de Inovare Engenharia (09/2026) venceu em 15/10 e aguarda transmissão com juros.",
            data: "Há 5 dias",
            link: "impostos.html?filtro=atrasadas",
            lida: false
        },
        {
            id: 2,
            tipo: "alerta",
            titulo: "Vencimento Próximo - DAS Simples Nacional",
            mensagem: "Guias de DAS de 4 empresas vencem hoje (20/10). 2 guias ainda pendentes de envio.",
            data: "Hoje, às 08:30",
            link: "impostos.html?filtro=hoje",
            lida: false
        },
        {
            id: 3,
            tipo: "alerta",
            titulo: "Serviço com Prazo Expirado",
            mensagem: "Alteração Contratual da Tech Solutions IT com prazo final em 18/10.",
            data: "Ontem, às 17:00",
            link: "servicos.html?filtro=atrasados",
            lida: false
        },
        {
            id: 4,
            tipo: "info",
            titulo: "Solicitação de Nota Fiscal Pendente",
            mensagem: "Tech Solutions solicitou emissão de NFS-e de R$ 45.000,00 para Banco Alfa.",
            data: "18/10 às 14:15",
            link: "notas-fiscais.html",
            lida: false
        },
        {
            id: 5,
            tipo: "sucesso",
            titulo: "CND Federal Emitida com Sucesso",
            mensagem: "Certidão Negativa de Débitos Federais da Inovare Engenharia foi emitida sem restrições.",
            data: "16/10 às 11:20",
            link: "servicos.html",
            lida: true
        },
        {
            id: 6,
            tipo: "alerta",
            titulo: "Parcelamento com Parcela Vencida",
            mensagem: "Transação RFB da Inovare Engenharia possui parcela nº 21 vencida em 30/09.",
            data: "15/10 às 09:00",
            link: "parcelamentos.html",
            lida: false
        }
    ]
};

/**
 * Classe controladora do Store Centralizado
 */
class WaldoDataStore {
    constructor() {
        this.data = this.load();
        this.saveLocalCache();
        this.apiSnapshot = null;
        this.persistQueue = Promise.resolve();
        this.ready = this.hydrateFromApi();
    }

    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.warn("Não foi possível carregar dados do localStorage, usando padrões.", e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }

    save() {
        try {
            this.saveLocalCache();
        } catch (e) {
            console.error("Erro ao salvar dados no localStorage", e);
        }
        if (this.apiSnapshot) {
            this.persistQueue = this.persistQueue.then(() => this.persistChanges()).catch(error => {
                console.error('Falha na fila de sincronização da API:', error);
            });
        }
    }

    saveLocalCache() {
        const safeCopy = JSON.parse(JSON.stringify(this.data));
        (safeCopy.usuarios || []).forEach(user => delete user.senha);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeCopy));
    }

    async apiRequest(url, options = {}) {
        const auth = sessionStorage.getItem(API_AUTH_KEY);
        const headers = new Headers(options.headers || {});
        if (auth) headers.set('Authorization', `Basic ${auth}`);
        if (options.body) headers.set('Content-Type', 'application/json');
        if (options.method && !['GET', 'HEAD'].includes(options.method.toUpperCase())) {
            const csrfResponse = await fetch('/api/auth/csrf', { headers: auth ? { Authorization: `Basic ${auth}` } : {} });
            if (!csrfResponse.ok) throw new Error('Não foi possível validar a sessão para salvar os dados.');
            const csrf = await csrfResponse.json();
            headers.set(csrf.headerName, csrf.token);
        }
        const response = await fetch(url, { ...options, headers, credentials: 'same-origin' });
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.message || `Falha ao acessar a API (${response.status}).`);
        }
        if (response.status === 204) return null;
        return response.json();
    }

    async loadCollection(path) {
        const page = await this.apiRequest(`${path}?size=100&sort=id,asc`);
        return Array.isArray(page) ? page : (page.content || []);
    }

    async hydrateFromApi() {
        if (!sessionStorage.getItem(API_AUTH_KEY)) return;
        const cachedBeforeRequest = localStorage.getItem(STORAGE_KEY);
        try {
            const entries = await Promise.all(Object.entries(API_COLLECTIONS).map(async ([key, path]) => [key, await this.loadCollection(path)]));
            for (const [key, rows] of entries) this.data[key] = rows;
            try {
                const users = await this.loadCollection('/api/usuarios');
                this.data.usuarios = users.map(user => ({ ...user, perfil: /ADMIN/i.test(user.perfil) ? 'Administrador' : 'Colaborador', dataCadastro: user.criadoEm ? user.criadoEm.split('T')[0] : '' }));
            } catch (error) {
                // Colaboradores não têm acesso ao cadastro de usuários.
                this.data.usuarios = [];
            }
            try {
                const offices = await this.loadCollection('/api/escritorio');
                this.data.escritorio = offices[0] || {};
            } catch (error) {
                // A configuração do escritório é restrita a administradores.
                this.data.escritorio = {};
            }
            const before = localStorage.getItem(STORAGE_KEY);
            const next = JSON.stringify(this.data);
            this.apiSnapshot = JSON.parse(next);
            this.saveLocalCache();
            if (before !== next) {
                const pageKey = `WALDO_API_REFRESHED:${location.pathname}`;
                if (!sessionStorage.getItem(pageKey)) {
                    sessionStorage.setItem(pageKey, '1');
                    location.reload();
                }
            }
        } catch (error) {
            console.error('Falha ao carregar os dados do backend:', error);
            for (const key of Object.keys(API_COLLECTIONS)) this.data[key] = [];
            this.data.usuarios = [];
            this.data.escritorio = {};
            this.apiSnapshot = null;
            this.saveLocalCache();
            if (cachedBeforeRequest !== localStorage.getItem(STORAGE_KEY)) {
                const pageKey = `WALDO_API_REFRESHED:${location.pathname}`;
                if (!sessionStorage.getItem(pageKey)) {
                    sessionStorage.setItem(pageKey, '1');
                    location.reload();
                }
            }
            if (window.AdminUI) window.AdminUI.showToast(error.message || 'Não foi possível carregar os dados do servidor.', 'danger');
        }
    }

    async persistChanges() {
        const previous = this.apiSnapshot;
        const current = JSON.parse(JSON.stringify(this.data));
        for (const [key, path] of Object.entries(API_COLLECTIONS)) {
            const oldRows = previous[key] || [];
            const newRows = current[key] || [];
            for (const row of newRows) {
                const old = oldRows.find(item => Number(item.id) === Number(row.id));
                if (old && JSON.stringify(old) === JSON.stringify(row)) continue;
                const payload = { ...row };
                delete payload.criadoEm;
                delete payload.atualizadoEm;
                delete payload.versao;
                try {
                    const saved = await this.apiRequest(old ? `${path}/${row.id}` : path, {
                        method: old ? 'PUT' : 'POST', body: JSON.stringify(payload)
                    });
                    if (!old && saved && saved.id) {
                        const localRow = (this.data[key] || []).find(item => Number(item.id) === Number(row.id));
                        if (localRow) localRow.id = saved.id;
                        row.id = saved.id;
                        this.saveLocalCache();
                    }
                    this.apiSnapshot[key] = this.apiSnapshot[key] || [];
                    const index = this.apiSnapshot[key].findIndex(item => Number(item.id) === Number(row.id));
                    if (index >= 0) this.apiSnapshot[key][index] = JSON.parse(JSON.stringify(row));
                    else this.apiSnapshot[key].push(JSON.parse(JSON.stringify(row)));
                } catch (error) {
                    console.error(`Falha ao salvar ${key} na API:`, error);
                    if (window.AdminUI) window.AdminUI.showToast(error.message || 'Erro ao salvar no servidor.', 'danger');
                }
            }
        }
        this.apiSnapshot.usuarios = this.apiSnapshot.usuarios || [];
        for (const row of current.usuarios || []) {
            const old = this.apiSnapshot.usuarios.find(item => Number(item.id) === Number(row.id));
            if (old && JSON.stringify(old) === JSON.stringify(row)) continue;
            try {
                let saved;
                if (old) {
                    if (old.situacao !== row.situacao) {
                        saved = await this.apiRequest(`/api/usuarios/${row.id}/status`, { method: 'PATCH', body: JSON.stringify({ ativo: row.situacao === 'Ativo' }) });
                    } else {
                        saved = await this.apiRequest(`/api/usuarios/${row.id}`, { method: 'PUT', body: JSON.stringify({ nome: row.nome, email: row.email, cargo: row.cargo, perfil: row.perfil, senha: row.senha || null }) });
                    }
                } else if (row.senha) {
                    saved = await this.apiRequest('/api/usuarios', { method: 'POST', body: JSON.stringify({ nome: row.nome, email: row.email, cargo: row.cargo, perfil: row.perfil, senha: row.senha }) });
                } else continue;
                if (saved) {
                    const user = { ...saved, perfil: /ADMIN/i.test(saved.perfil) ? 'Administrador' : 'Colaborador', dataCadastro: saved.criadoEm ? saved.criadoEm.split('T')[0] : '', situacao: saved.situacao };
                    delete user.senha;
                    const localUser = this.data.usuarios.find(item => Number(item.id) === Number(row.id));
                    if (localUser) delete localUser.senha;
                    if (!old && localUser && saved.id) localUser.id = saved.id;
                    const index = this.apiSnapshot.usuarios.findIndex(item => Number(item.id) === Number(user.id));
                    if (index >= 0) this.apiSnapshot.usuarios[index] = user; else this.apiSnapshot.usuarios.push(user);
                    this.saveLocalCache();
                }
            } catch (error) {
                if (window.AdminUI) window.AdminUI.showToast(error.message || 'Erro ao salvar usuário.', 'danger');
            }
        }
        const oldOffice = previous.escritorio || {};
        const office = current.escritorio || {};
        if (JSON.stringify(oldOffice) !== JSON.stringify(office)) {
            try {
                const officePath = '/api/escritorio';
                const saved = office.id
                    ? await this.apiRequest(`${officePath}/${office.id}`, { method: 'PUT', body: JSON.stringify(office) })
                    : await this.apiRequest(officePath, { method: 'POST', body: JSON.stringify(office) });
                this.data.escritorio = saved;
                this.apiSnapshot.escritorio = JSON.parse(JSON.stringify(saved));
                this.saveLocalCache();
            } catch (error) {
                if (window.AdminUI) window.AdminUI.showToast(error.message || 'Erro ao salvar os dados do escritório.', 'danger');
            }
        }
    }

    /**
     * Sanitização preventiva contra injeção de tags HTML/scripts
     */
    sanitize(val) {
        if (typeof val !== 'string') return val;
        return val
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/[<>]/g, '');
    }

    sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        const clean = {};
        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === 'string') {
                clean[key] = this.sanitize(val.trim());
            } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                clean[key] = this.sanitizeObject(val);
            } else {
                clean[key] = val;
            }
        }
        return clean;
    }

    resetToDefault() {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.save();
        return this.data;
    }

    // ==========================================
    // EMPRESAS
    // ==========================================
    getEmpresas(filtros = {}) {
        let list = [...this.data.empresas];
        if (filtros.busca) {
            const q = filtros.busca.toLowerCase();
            list = list.filter(e => 
                e.razaoSocial.toLowerCase().includes(q) ||
                e.nomeFantasia.toLowerCase().includes(q) ||
                e.cnpj.includes(q)
            );
        }
        if (filtros.situacao && filtros.situacao !== 'Todas') {
            list = list.filter(e => e.situacao === filtros.situacao);
        }
        if (filtros.regime && filtros.regime !== 'Todos') {
            list = list.filter(e => e.regimeTributario === filtros.regime);
        }
        if (filtros.ordem) {
            switch(filtros.ordem) {
                case 'nomeAsc':
                    list.sort((a,b) => a.nomeFantasia.localeCompare(b.nomeFantasia));
                    break;
                case 'nomeDesc':
                    list.sort((a,b) => b.nomeFantasia.localeCompare(a.nomeFantasia));
                    break;
                case 'inicioAsc':
                    list.sort((a,b) => a.dataInicio.localeCompare(b.dataInicio));
                    break;
                case 'inicioDesc':
                    list.sort((a,b) => b.dataInicio.localeCompare(a.dataInicio));
                    break;
            }
        }
        return list;
    }

    getEmpresaById(id) {
        return this.data.empresas.find(e => e.id === Number(id));
    }

    saveEmpresa(empresaData) {
        const cleanData = this.sanitizeObject(empresaData);
        if (cleanData.id) {
            const index = this.data.empresas.findIndex(e => e.id === Number(cleanData.id));
            if (index !== -1) {
                this.data.empresas[index] = { ...this.data.empresas[index], ...cleanData };
                this.save();
                return this.data.empresas[index];
            }
        } else {
            const newId = this.data.empresas.length > 0 ? Math.max(...this.data.empresas.map(e => e.id)) + 1 : 1;
            const newEmpresa = {
                id: newId,
                ...cleanData,
                dataInicio: cleanData.dataInicio || new Date().toISOString().split('T')[0],
                situacao: cleanData.situacao || 'Ativa'
            };
            this.data.empresas.push(newEmpresa);
            this.save();
            return newEmpresa;
        }
    }

    desativarEmpresa(id) {
        const emp = this.getEmpresaById(id);
        if (emp) {
            emp.situacao = (emp.situacao === 'Inativa') ? 'Ativa' : 'Inativa';
            this.save();
            return emp;
        }
        return null;
    }

    // ==========================================
    // IMPOSTOS & OBRIGAÇÕES FISCAIS
    // ==========================================
    getImpostos(filtros = {}) {
        let list = [...this.data.impostos];
        if (filtros.busca) {
            const q = filtros.busca.toLowerCase();
            list = list.filter(item => {
                const emp = this.getEmpresaById(item.empresaId);
                const empNome = emp ? emp.nomeFantasia.toLowerCase() : '';
                return item.tipo.toLowerCase().includes(q) ||
                       empNome.includes(q) ||
                       (item.protocolo && item.protocolo.toLowerCase().includes(q));
            });
        }
        if (filtros.empresaId && filtros.empresaId !== 'Todas') {
            list = list.filter(i => i.empresaId === Number(filtros.empresaId));
        }
        if (filtros.competencia && filtros.competencia !== 'Todas') {
            list = list.filter(i => i.competencia === filtros.competencia);
        }
        if (filtros.situacao && filtros.situacao !== 'Todas') {
            list = list.filter(i => i.situacao === filtros.situacao);
        }
        return list;
    }

    saveImposto(data) {
        const cleanData = this.sanitizeObject(data);
        if (cleanData.id) {
            const idx = this.data.impostos.findIndex(i => i.id === Number(cleanData.id));
            if (idx !== -1) {
                this.data.impostos[idx] = { ...this.data.impostos[idx], ...cleanData };
                this.save();
                return this.data.impostos[idx];
            }
        } else {
            const newId = this.data.impostos.length > 0 ? Math.max(...this.data.impostos.map(i => i.id)) + 1 : 101;
            const newImposto = { id: newId, ...cleanData };
            this.data.impostos.push(newImposto);
            this.save();
            return newImposto;
        }
    }

    concluirImposto(id) {
        const imp = this.data.impostos.find(i => i.id === Number(id));
        if (imp) {
            imp.situacao = 'Concluída';
            imp.protocolo = imp.protocolo || `REC-${Date.now().toString().slice(-6)}`;
            this.save();
            return imp;
        }
        return null;
    }

    // ==========================================
    // FOLHA DE PAGAMENTO
    // ==========================================
    getFolha(filtros = {}) {
        let list = [...this.data.folha];
        if (filtros.empresaId && filtros.empresaId !== 'Todas') {
            list = list.filter(f => f.empresaId === Number(filtros.empresaId));
        }
        if (filtros.competencia && filtros.competencia !== 'Todas') {
            list = list.filter(f => f.competencia === filtros.competencia);
        }
        if (filtros.situacao && filtros.situacao !== 'Todas') {
            list = list.filter(f => f.situacao === filtros.situacao);
        }
        return list;
    }

    updateFolhaStatus(id, novaSituacao) {
        const f = this.data.folha.find(item => item.id === Number(id));
        if (f) {
            f.situacao = novaSituacao;
            if (novaSituacao === 'Fechada' && !f.dataFechamento) {
                f.dataFechamento = new Date().toISOString().split('T')[0];
            }
            if (novaSituacao === 'Entregue' && !f.dataEntrega) {
                f.dataEntrega = new Date().toISOString().split('T')[0];
            }
            this.save();
            return f;
        }
        return null;
    }

    // ==========================================
    // SERVIÇOS E TAREFAS
    // ==========================================
    getServicos(filtros = {}) {
        let list = [...this.data.servicos];
        if (filtros.empresaId && filtros.empresaId !== 'Todas') {
            list = list.filter(s => s.empresaId === Number(filtros.empresaId));
        }
        if (filtros.situacao && filtros.situacao !== 'Todas') {
            list = list.filter(s => s.situacao === filtros.situacao);
        }
        if (filtros.prioridade && filtros.prioridade !== 'Todas') {
            list = list.filter(s => s.prioridade === filtros.prioridade);
        }
        if (filtros.responsavel && filtros.responsavel !== 'Todos') {
            list = list.filter(s => s.responsavel === filtros.responsavel);
        }
        return list;
    }

    saveServico(data) {
        if (data.id) {
            const idx = this.data.servicos.findIndex(s => s.id === Number(data.id));
            if (idx !== -1) {
                this.data.servicos[idx] = { ...this.data.servicos[idx], ...data };
                this.save();
                return this.data.servicos[idx];
            }
        } else {
            const newId = this.data.servicos.length > 0 ? Math.max(...this.data.servicos.map(s => s.id)) + 1 : 301;
            const newServ = {
                id: newId,
                ...data,
                dataAbertura: data.dataAbertura || new Date().toISOString().split('T')[0],
                situacao: data.situacao || 'Aberto'
            };
            this.data.servicos.push(newServ);
            this.save();
            return newServ;
        }
    }

    concluirServico(id) {
        const serv = this.data.servicos.find(s => s.id === Number(id));
        if (serv) {
            serv.situacao = 'Concluído';
            serv.dataConclusao = new Date().toISOString().split('T')[0];
            this.save();
            return serv;
        }
        return null;
    }

    // ==========================================
    // NOTAS FISCAIS
    // ==========================================
    getNotas(filtros = {}) {
        let list = [...this.data.notasFiscais];
        if (filtros.empresaId && filtros.empresaId !== 'Todas') {
            list = list.filter(n => n.empresaId === Number(filtros.empresaId));
        }
        if (filtros.situacao && filtros.situacao !== 'Todas') {
            list = list.filter(n => n.situacao === filtros.situacao);
        }
        return list;
    }

    saveNota(data) {
        if (data.id) {
            const idx = this.data.notasFiscais.findIndex(n => n.id === Number(data.id));
            if (idx !== -1) {
                this.data.notasFiscais[idx] = { ...this.data.notasFiscais[idx], ...data };
                this.save();
                return this.data.notasFiscais[idx];
            }
        } else {
            const newId = this.data.notasFiscais.length > 0 ? Math.max(...this.data.notasFiscais.map(n => n.id)) + 1 : 401;
            const newNota = {
                id: newId,
                ...data,
                dataSolicitacao: data.dataSolicitacao || new Date().toISOString().split('T')[0],
                situacao: data.situacao || 'Solicitada'
            };
            this.data.notasFiscais.push(newNota);
            this.save();
            return newNota;
        }
    }

    emitirNota(id) {
        const nota = this.data.notasFiscais.find(n => n.id === Number(id));
        if (nota) {
            nota.situacao = 'Emitida';
            this.save();
            return nota;
        }
        return null;
    }

    // ==========================================
    // PARCELAMENTOS
    // ==========================================
    getParcelamentos(filtros = {}) {
        let list = [...this.data.parcelamentos];
        if (filtros.empresaId && filtros.empresaId !== 'Todas') {
            list = list.filter(p => p.empresaId === Number(filtros.empresaId));
        }
        if (filtros.situacao && filtros.situacao !== 'Todas') {
            list = list.filter(p => p.situacao === filtros.situacao);
        }
        return list;
    }

    pagarParcela(parcelamentoId, parcelaNumero) {
        const parc = this.data.parcelamentos.find(p => p.id === Number(parcelamentoId));
        if (parc && parc.parcelasRecentes) {
            const p = parc.parcelasRecentes.find(item => item.numero === Number(parcelaNumero));
            if (p) {
                p.situacao = 'Paga';
                p.dataPagamento = new Date().toISOString().split('T')[0];
                parc.parcelasPagas += 1;
                this.save();
                return p;
            }
        }
        return null;
    }

    // ==========================================
    // DOCUMENTOS
    // ==========================================
    getDocumentos(filtros = {}) {
        let list = [...this.data.documentos];
        if (filtros.empresaId && filtros.empresaId !== 'Todas') {
            list = list.filter(d => d.empresaId === Number(filtros.empresaId));
        }
        if (filtros.situacao && filtros.situacao !== 'Todas') {
            list = list.filter(d => d.situacao === filtros.situacao);
        }
        if (filtros.categoria && filtros.categoria !== 'Todas') {
            list = list.filter(d => d.categoria.includes(filtros.categoria));
        }
        return list;
    }

    saveDocumento(data) {
        if (data.id) {
            const idx = this.data.documentos.findIndex(d => d.id === Number(data.id));
            if (idx !== -1) {
                this.data.documentos[idx] = { ...this.data.documentos[idx], ...data };
                this.save();
                return this.data.documentos[idx];
            }
        } else {
            const newId = this.data.documentos.length > 0 ? Math.max(...this.data.documentos.map(d => d.id)) + 1 : 601;
            const newDoc = {
                id: newId,
                ...data,
                dataSolicitacao: data.dataSolicitacao || new Date().toISOString().split('T')[0],
                situacao: data.situacao || 'Solicitado'
            };
            this.data.documentos.push(newDoc);
            this.save();
            return newDoc;
        }
    }

    aprovarDocumento(id) {
        const doc = this.data.documentos.find(d => d.id === Number(id));
        if (doc) {
            doc.situacao = 'Aprovado';
            this.save();
            return doc;
        }
        return null;
    }

    // ==========================================
    // USUÁRIOS
    // ==========================================
    getUsuarios() {
        return [...this.data.usuarios];
    }

    saveUsuario(data) {
        if (data.id) {
            const idx = this.data.usuarios.findIndex(u => u.id === Number(data.id));
            if (idx !== -1) {
                this.data.usuarios[idx] = { ...this.data.usuarios[idx], ...data };
                this.save();
                return this.data.usuarios[idx];
            }
        } else {
            const newId = this.data.usuarios.length > 0 ? Math.max(...this.data.usuarios.map(u => u.id)) + 1 : 1;
            const initials = data.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const newU = {
                id: newId,
                ...data,
                dataCadastro: new Date().toISOString().split('T')[0],
                avatar: initials
            };
            this.data.usuarios.push(newU);
            this.save();
            return newU;
        }
    }

    alternarSituacaoUsuario(id) {
        const u = this.data.usuarios.find(user => user.id === Number(id));
        if (u) {
            u.situacao = (u.situacao === 'Ativo') ? 'Inativo' : 'Ativo';
            this.save();
            return u;
        }
        return null;
    }

    // ==========================================
    // NOTIFICAÇÕES
    // ==========================================
    getNotificacoes() {
        return [...this.data.notificacoes];
    }

    getNaoLidasCount() {
        return this.data.notificacoes.filter(n => !n.lida).length;
    }

    marcarNotificacaoComoLida(id) {
        const notif = this.data.notificacoes.find(n => n.id === Number(id));
        if (notif) {
            notif.lida = true;
            this.save();
            return notif;
        }
        return null;
    }

    marcarTodasNotificacoesComoLidas() {
        this.data.notificacoes.forEach(n => n.lida = true);
        this.save();
    }

    // ==========================================
    // DASHBOARD KPI DERIVADOS
    // ==========================================
    getDashboardKPIs() {
        const empresasAtivas = this.data.empresas.filter(e => e.situacao === 'Ativa').length;
        const empresasProcesso = this.data.empresas.filter(e => e.situacao === 'Em Abertura' || e.situacao === 'Regularização').length;
        
        const impostosPendentes = this.data.impostos.filter(i => i.situacao === 'Pendente' || i.situacao === 'Em Andamento' || i.situacao === 'Aguardando Documentos').length;
        const impostosProximos = this.data.impostos.filter(i => {
            if (i.situacao === 'Concluída') return false;
            // vencimento nos próximos 5 dias
            return i.vencimento >= '2026-10-20' && i.vencimento <= '2026-10-25';
        }).length;
        const impostosConcluidos = this.data.impostos.filter(i => i.situacao === 'Concluída' || i.situacao === 'Entregue').length;
        const impostosAtrasados = this.data.impostos.filter(i => i.situacao === 'Atrasada' || (i.vencimento < '2026-10-20' && i.situacao !== 'Concluída')).length;

        const folhaPendente = this.data.folha.filter(f => f.situacao !== 'Fechada' && f.situacao !== 'Entregue').length;
        
        const servicosAbertos = this.data.servicos.filter(s => s.situacao === 'Aberto' || s.situacao === 'Em Andamento' || s.situacao.includes('Aguardando')).length;
        const servicosAtrasados = this.data.servicos.filter(s => s.prazoEntrega < '2026-10-20' && s.situacao !== 'Concluído').length;

        const notasPendentes = this.data.notasFiscais.filter(n => n.situacao === 'Solicitada' || n.situacao === 'Pronta para Emissão' || n.situacao === 'Atrasada').length;
        const parcelamentosAtivos = this.data.parcelamentos.filter(p => p.situacao === 'Ativo' || p.situacao === 'Com Atraso').length;
        const documentosPendentes = this.data.documentos.filter(d => d.situacao === 'Solicitado' || d.situacao === 'Aguardando Cliente' || d.situacao === 'Pendente de Correção').length;

        return {
            empresasAtivas,
            empresasProcesso,
            impostosPendentes,
            impostosProximos,
            impostosConcluidos,
            impostosAtrasados,
            folhaPendente,
            servicosAbertos,
            servicosAtrasados,
            notasPendentes,
            parcelamentosAtivos,
            documentosPendentes
        };
    }

    // ==========================================
    // AGENDA GERADA DINAMICAMENTE
    // ==========================================
    getAgendaEventos(filtros = {}) {
        let eventos = [];

        // Impostos
        this.data.impostos.forEach(imp => {
            const emp = this.getEmpresaById(imp.empresaId);
            eventos.push({
                id: `imp-${imp.id}`,
                data: imp.vencimento,
                tipo: 'imposto',
                categoria: 'Fiscal / Impostos',
                titulo: `${imp.tipo} - ${emp ? emp.nomeFantasia : 'Empresa'}`,
                detalhes: `Vencimento: ${imp.vencimento} | Valor: R$ ${imp.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Situação: ${imp.situacao}`,
                situacao: imp.situacao,
                empresaId: imp.empresaId,
                cor: imp.situacao === 'Atrasada' ? 'var(--danger)' : 'var(--primary)',
                url: 'impostos.html'
            });
        });

        // Folha
        this.data.folha.forEach(f => {
            const emp = this.getEmpresaById(f.empresaId);
            eventos.push({
                id: `folha-${f.id}`,
                data: "2026-10-25", // referência do mês
                tipo: 'folha',
                categoria: 'Folha de Pagamento',
                titulo: `Folha ${f.competencia} - ${emp ? emp.nomeFantasia : 'Empresa'}`,
                detalhes: `Prazo: ${f.prazoPrevisto} | Status: ${f.situacao}`,
                situacao: f.situacao,
                empresaId: f.empresaId,
                cor: 'var(--info)',
                url: 'folha.html'
            });
        });

        // Serviços
        this.data.servicos.forEach(s => {
            const emp = this.getEmpresaById(s.empresaId);
            eventos.push({
                id: `serv-${s.id}`,
                data: s.prazoEntrega,
                tipo: 'servico',
                categoria: 'Serviços & Tarefas',
                titulo: `${s.titulo} (${emp ? emp.nomeFantasia : 'Geral'})`,
                detalhes: `Responsável: ${s.responsavel} | Prioridade: ${s.prioridade}`,
                situacao: s.situacao,
                empresaId: s.empresaId,
                cor: 'var(--purple)',
                url: 'servicos.html'
            });
        });

        // Parcelamentos
        this.data.parcelamentos.forEach(parc => {
            const emp = this.getEmpresaById(parc.empresaId);
            parc.parcelasRecentes.forEach(p => {
                eventos.push({
                    id: `parc-${parc.id}-${p.numero}`,
                    data: p.vencimento,
                    tipo: 'parcelamento',
                    categoria: 'Parcelamentos',
                    titulo: `Parc. ${p.numero}/${parc.totalParcelas} ${parc.orgao} (${emp ? emp.nomeFantasia : ''})`,
                    detalhes: `Valor: R$ ${p.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})} | Status: ${p.situacao}`,
                    situacao: p.situacao,
                    empresaId: parc.empresaId,
                    cor: 'var(--warning)',
                    url: 'parcelamentos.html'
                });
            });
        });

        // Filtros de agenda
        if (filtros.empresaId && filtros.empresaId !== 'Todas') {
            eventos = eventos.filter(e => e.empresaId === Number(filtros.empresaId));
        }
        if (filtros.categoria && filtros.categoria !== 'Todas') {
            eventos = eventos.filter(e => e.categoria.includes(filtros.categoria));
        }

        // Ordenar por data
        eventos.sort((a,b) => a.data.localeCompare(b.data));

        return eventos;
    }

    // ==========================================
    // EXPORTAÇÃO CSV REAL
    // ==========================================
    exportToCSV(filename, rows) {
        if (!rows || !rows.length) {
            alert("Nenhum registro para exportar.");
            return;
        }
        const separator = ';';
        const keys = Object.keys(rows[0]);
        let csvContent = '\uFEFF'; // UTF-8 BOM para garantir acentuação correta no Microsoft Excel
        
        // Cabeçalhos
        csvContent += keys.join(separator) + '\r\n';

        // Linhas
        rows.forEach(row => {
            const values = keys.map(k => {
                let val = row[k] === null || row[k] === undefined ? '' : String(row[k]);
                // Se contiver ponto e vírgula, quebra de linha ou aspas, escapar
                if (val.includes(separator) || val.includes('\n') || val.includes('"')) {
                    val = `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            });
            csvContent += values.join(separator) + '\r\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Instância global única compartilhada
window.DataStore = new WaldoDataStore();
