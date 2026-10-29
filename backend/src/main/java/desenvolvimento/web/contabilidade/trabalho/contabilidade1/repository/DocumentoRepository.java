package desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Documento;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {}
