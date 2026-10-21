package desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailIgnoreCase(String email);
    long countByPerfilIgnoreCaseAndAtivoTrue(String perfil);
}
