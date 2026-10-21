package desenvolvimento.web.contabilidade.trabalho.contabilidade1.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.UsuarioRepository;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {
    private final UsuarioRepository usuarios;

    public DatabaseUserDetailsService(UsuarioRepository usuarios) { this.usuarios = usuarios; }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarios.findByEmailIgnoreCase(email.trim())
            .orElseThrow(() -> new UsernameNotFoundException("Credenciais inválidas."));
    }
}
