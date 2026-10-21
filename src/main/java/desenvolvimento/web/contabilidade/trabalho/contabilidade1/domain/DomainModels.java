package desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

/** Entidades persistidas para os módulos da aplicação contábil. */
public final class DomainModels {
    private DomainModels() {}

    @Entity
    @Table(name = "empresas", uniqueConstraints = @UniqueConstraint(name = "uk_empresa_cnpj", columnNames = "cnpj"))
    public static class Empresa extends BaseEntity {
        @NotBlank @Column(nullable = false, length = 200) public String razaoSocial;
        @NotBlank @Column(nullable = false, length = 160) public String nomeFantasia;
        @NotBlank @Column(nullable = false, length = 18) public String cnpj;
        @Column(length = 40) public String inscricaoEstadual;
        @Column(length = 40) public String inscricaoMunicipal;
        @Column(length = 50) public String regimeTributario;
        public Boolean fatorR;
        public LocalDate dataAbertura;
        @Column(length = 180) public String cnae;
        @Column(length = 240) public String endereco;
        @Column(length = 160) public String responsavel;
        @Email @Column(length = 180) public String email;
        @Column(length = 30) public String telefone;
        @Column(length = 160) public String responsavelInterno;
        public LocalDate dataInicio;
        @Column(length = 40) public String situacao;
        @PositiveOrZero @Column(precision = 15, scale = 2) public BigDecimal faturamentoMedio;
        @PositiveOrZero public Integer funcionarios;
        @Column(length = 2000) public String observacoes;
    }

    @Entity
    @Table(name = "obrigacoes_fiscais")
    public static class ObrigacaoFiscal extends EmpresaOwnedEntity {
        @NotBlank @Column(nullable = false, length = 140) public String tipo;
        @NotBlank @Column(nullable = false, length = 20) public String competencia;
        public LocalDate vencimento;
        @PositiveOrZero @Column(precision = 15, scale = 2) public BigDecimal valor;
        @Column(length = 160) public String responsavel;
        @Column(length = 40) public String situacao;
        @Column(length = 100) public String protocolo;
        @Column(length = 2000) public String observacoes;
    }

    @Entity
    @Table(name = "folhas_pagamento")
    public static class FolhaPagamento extends EmpresaOwnedEntity {
        @NotBlank @Column(nullable = false, length = 20) public String competencia;
        @Column(length = 60) public String prazoPrevisto;
        @PositiveOrZero public Integer totalFuncionarios;
        @Column(length = 160) public String responsavel;
        @Column(length = 40) public String situacao;
        public LocalDate dataFechamento;
        public LocalDate dataEntrega;
        @Column(length = 2000) public String observacoes;
    }

    @Entity
    @Table(name = "servicos_demanda")
    public static class Servico extends EmpresaOwnedEntity {
        @NotBlank @Column(nullable = false, length = 180) public String titulo;
        @Column(length = 2000) public String descricao;
        @Column(length = 100) public String categoria;
        @Column(length = 160) public String responsavel;
        @Column(length = 30) public String prioridade;
        public LocalDate dataAbertura;
        public LocalDate prazoEntrega;
        @Column(length = 50) public String situacao;
        public LocalDate dataConclusao;
        @Column(length = 2000) public String observacoes;
    }

    @Entity
    @Table(name = "solicitacoes_notas_fiscais")
    public static class NotaFiscal extends EmpresaOwnedEntity {
        @Column(length = 80) public String tipoNota;
        @Column(length = 500) public String descricao;
        public LocalDate dataSolicitacao;
        public LocalDate dataPrevista;
        @PositiveOrZero @Column(precision = 15, scale = 2) public BigDecimal valor;
        @Column(length = 160) public String responsavel;
        @Column(length = 40) public String situacao;
        @Column(length = 80) public String numeroNota;
        @Column(length = 100) public String chaveAcesso;
        @Column(length = 2000) public String observacoes;
    }

    @Entity
    @Table(name = "parcelamentos")
    public static class Parcelamento extends EmpresaOwnedEntity {
        @Column(length = 160) public String orgao;
        @Column(length = 80) public String numeroAcordo;
        public LocalDate dataAdesao;
        @PositiveOrZero public Integer totalParcelas;
        @PositiveOrZero public Integer parcelasPagas;
        @PositiveOrZero @Column(precision = 15, scale = 2) public BigDecimal valorParcela;
        @PositiveOrZero public Integer diaVencimento;
        @Column(length = 40) public String situacao;
        @Column(length = 2000) public String observacoes;
        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(name = "parcelas_recentes", joinColumns = @JoinColumn(name = "parcelamento_id"))
        public List<ParcelaResumo> parcelasRecentes = new ArrayList<>();
    }

    @Embeddable
    public static class ParcelaResumo {
        public Integer numero;
        @Column(length = 20) public String competencia;
        public LocalDate vencimento;
        @PositiveOrZero @Column(precision = 15, scale = 2) public BigDecimal valor;
        @Column(length = 30) public String situacao;
        public LocalDate dataPagamento;
    }

    @Entity
    @Table(name = "documentos")
    public static class Documento extends EmpresaOwnedEntity {
        @NotBlank @Column(nullable = false, length = 240) public String nome;
        @Column(length = 100) public String categoria;
        public LocalDate dataSolicitacao;
        public LocalDate prazoEnvio;
        @Column(length = 160) public String responsavel;
        @Column(length = 50) public String situacao;
        public LocalDate dataRecebimento;
        @Column(length = 240) public String arquivoMock;
        @Column(length = 40) public String tamanhoMock;
        @Column(length = 2000) public String observacoes;
    }

    @Entity
    @Table(name = "usuarios", uniqueConstraints = @UniqueConstraint(name = "uk_usuario_email", columnNames = "email"))
    public static class Usuario extends BaseEntity implements UserDetails {
        @NotBlank @Column(nullable = false, length = 140) public String nome;
        @Email @NotBlank @Column(nullable = false, length = 180) public String email;
        @JsonIgnore @Column(nullable = false, length = 100) public String senhaHash;
        @Column(length = 100) public String cargo;
        @NotBlank @Column(nullable = false, length = 30) public String perfil = "COLABORADOR";
        @Column(nullable = false) public boolean ativo = true;
        @Column(length = 30) public String avatar;

        @Override @JsonIgnore public Collection<? extends GrantedAuthority> getAuthorities() {
            String role = "ADMINISTRADOR".equalsIgnoreCase(perfil) || "ADMIN".equalsIgnoreCase(perfil) ? "ROLE_ADMIN" : "ROLE_COLLABORATOR";
            return List.of(new SimpleGrantedAuthority(role));
        }
        @Override @JsonIgnore public String getPassword() { return senhaHash; }
        @Override @JsonIgnore public String getUsername() { return email; }
        @Override @JsonIgnore public boolean isAccountNonExpired() { return true; }
        @Override @JsonIgnore public boolean isAccountNonLocked() { return ativo; }
        @Override @JsonIgnore public boolean isCredentialsNonExpired() { return true; }
        @Override @JsonIgnore public boolean isEnabled() { return ativo; }
    }

    @Entity
    @Table(name = "notificacoes")
    public static class Notificacao extends BaseEntity {
        @Column(length = 30) public String tipo;
        @NotBlank @Column(nullable = false, length = 180) public String titulo;
        @Column(length = 2000) public String mensagem;
        @Column(length = 60) public String data;
        @Column(length = 300) public String link;
        @Column(nullable = false) public boolean lida;
    }

    @Entity
    @Table(name = "configuracao_escritorio")
    public static class Escritorio extends BaseEntity {
        @NotBlank @Column(nullable = false, length = 180) public String nomeFantasia;
        @Column(length = 180) public String razaoSocial;
        @Column(length = 18) public String cnpj;
        @Column(length = 30) public String crc;
        @Column(length = 140) public String responsavel;
        @Email @Column(length = 180) public String email;
        @Column(length = 180) public String emailComercial;
        @Column(length = 30) public String telefone;
        @Column(length = 30) public String whatsapp;
        @Column(length = 240) public String endereco;
        @Column(length = 100) public String cidade;
        @Column(length = 2) public String uf;
        @Column(length = 12) public String cep;
        @Column(length = 100) public String horario;
    }
}
