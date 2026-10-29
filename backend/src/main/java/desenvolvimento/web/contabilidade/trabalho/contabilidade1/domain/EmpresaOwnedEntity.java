package desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Empresa;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;

@MappedSuperclass
public abstract class EmpresaOwnedEntity extends BaseEntity {
    @JsonProperty("empresaId")
    @Transient
    @NotNull
    public Long empresaId;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "empresa_id", nullable = false)
    public Empresa empresa;

    @PostLoad
    protected void carregarIdEmpresa() {
        if (empresa != null) empresaId = empresa.id;
    }
}
