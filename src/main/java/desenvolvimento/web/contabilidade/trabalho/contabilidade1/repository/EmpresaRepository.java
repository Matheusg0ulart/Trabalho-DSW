package desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    boolean existsByCnpjIgnoreCase(String cnpj);
}
