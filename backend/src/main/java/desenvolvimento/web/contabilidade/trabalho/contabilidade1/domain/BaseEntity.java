package desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;

@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @CreationTimestamp
    public Instant criadoEm;

    @UpdateTimestamp
    public Instant atualizadoEm;

    @Version
    public Long versao;

    protected BaseEntity() {}
}
