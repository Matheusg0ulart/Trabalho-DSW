package desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Notificacao;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    long countByLidaFalse();
}
