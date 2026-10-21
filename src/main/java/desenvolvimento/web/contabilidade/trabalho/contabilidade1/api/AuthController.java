package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Usuario;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.UsuarioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwordEncoder;
    private final String bootstrapSecret;

    public AuthController(UsuarioRepository usuarios, PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.secret:}") String bootstrapSecret) {
        this.usuarios = usuarios;
        this.passwordEncoder = passwordEncoder;
        this.bootstrapSecret = bootstrapSecret;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(@RequestAttribute("_csrf") CsrfToken token) {
        return Map.of("headerName", token.getHeaderName(), "token", token.getToken());
    }

    /** One-time first administrator setup; requires APP_BOOTSTRAP_SECRET. */
    @PostMapping("/bootstrap")
    @Transactional
    public synchronized Map<String, Object> bootstrap(@RequestHeader(value = "X-Setup-Secret", required = false) String suppliedSecret,
            @Valid @RequestBody BootstrapRequest request) {
        if (bootstrapSecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Configure APP_BOOTSTRAP_SECRET antes da configuração inicial.");
        }
        if (suppliedSecret == null || !MessageDigest.isEqual(
                bootstrapSecret.getBytes(StandardCharsets.UTF_8), suppliedSecret.getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chave de configuração inválida.");
        }
        if (usuarios.count() != 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A configuração inicial já foi concluída.");
        }
        Usuario admin = new Usuario();
        admin.nome = request.nome().trim();
        admin.email = request.email().trim().toLowerCase();
        admin.senhaHash = passwordEncoder.encode(request.senha());
        admin.perfil = "ADMINISTRADOR";
        admin.ativo = true;
        usuarios.save(admin);
        return Map.of("id", admin.id, "nome", admin.nome, "email", admin.email, "perfil", admin.perfil);
    }

    @GetMapping("/me")
    public Map<String, Object> currentUser(Authentication authentication) {
        Usuario user = (Usuario) authentication.getPrincipal();
        return Map.of("id", user.id, "nome", user.nome, "email", user.email, "perfil", user.perfil, "cargo", user.cargo == null ? "" : user.cargo);
    }

    public record BootstrapRequest(
        @NotBlank @Size(max = 140) String nome,
        @NotBlank @Email @Size(max = 180) String email,
        @NotBlank @Size(min = 12, max = 72) String senha
    ) {}
}
