package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;

import java.util.Locale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Usuario;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.UsuarioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwords;

    public UsuarioController(UsuarioRepository usuarios, PasswordEncoder passwords) {
        this.usuarios = usuarios;
        this.passwords = passwords;
    }

    @GetMapping
    public Page<UsuarioView> listar(@PageableDefault(size = 50, sort = "id") Pageable pageable) {
        return usuarios.findAll(pageable).map(this::view);
    }

    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioView criar(@Valid @RequestBody UserRequest request) {
        String email = normalizeEmail(request.email());
        if (usuarios.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário com esse e-mail.");
        }
        Usuario user = new Usuario();
        user.nome = request.nome().trim();
        user.email = email;
        user.senhaHash = passwords.encode(request.senha());
        user.cargo = request.cargo();
        user.perfil = normalizeRole(request.perfil());
        user.ativo = true;
        user.avatar = initials(user.nome);
        return view(usuarios.save(user));
    }

    @PutMapping("/{id}")
    @Transactional
    public UsuarioView atualizar(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request, Authentication authentication) {
        Usuario user = usuarios.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        String email = normalizeEmail(request.email());
        usuarios.findByEmailIgnoreCase(email).filter(other -> !other.id.equals(id)).ifPresent(other -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário com esse e-mail.");
        });
        String newRole = normalizeRole(request.perfil());
        if (user.ativo && "ADMINISTRADOR".equalsIgnoreCase(user.perfil)
                && !"ADMINISTRADOR".equals(newRole)
                && usuarios.countByPerfilIgnoreCaseAndAtivoTrue("ADMINISTRADOR") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mantenha ao menos um administrador ativo.");
        }
        user.nome = request.nome().trim();
        user.email = email;
        user.cargo = request.cargo();
        user.perfil = newRole;
        if (request.senha() != null && !request.senha().isBlank()) user.senhaHash = passwords.encode(request.senha());
        user.avatar = initials(user.nome);
        return view(usuarios.save(user));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public UsuarioView desativar(@PathVariable Long id, Authentication authentication) {
        return alterarStatus(id, false, authentication);
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public UsuarioView alterarStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request, Authentication authentication) {
        return alterarStatus(id, request.ativo(), authentication);
    }

    private UsuarioView alterarStatus(Long id, boolean ativo, Authentication authentication) {
        Usuario user = usuarios.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        Usuario actor = (Usuario) authentication.getPrincipal();
        if (actor.id.equals(user.id) && !ativo) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Não é permitido desativar a própria conta.");
        }
        if (user.ativo && !ativo && "ADMINISTRADOR".equalsIgnoreCase(user.perfil)
                && usuarios.countByPerfilIgnoreCaseAndAtivoTrue("ADMINISTRADOR") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mantenha ao menos um administrador ativo.");
        }
        user.ativo = ativo;
        return view(usuarios.save(user));
    }

    private UsuarioView view(Usuario user) {
        return new UsuarioView(user.id, user.nome, user.email, user.cargo, user.perfil,
            user.ativo ? "Ativo" : "Inativo", user.avatar, user.criadoEm);
    }

    private static String normalizeEmail(String email) { return email.trim().toLowerCase(Locale.ROOT); }
    private static String normalizeRole(String role) {
        if ("ADMINISTRADOR".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role)) return "ADMINISTRADOR";
        if ("COLABORADOR".equalsIgnoreCase(role) || "COLLABORATOR".equalsIgnoreCase(role)) return "COLABORADOR";
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Perfil deve ser ADMINISTRADOR ou COLABORADOR.");
    }
    private static String initials(String name) {
        String[] parts = name.trim().split("\\s+");
        return parts.length == 1 ? parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase(Locale.ROOT)
            : (parts[0].charAt(0) + "" + parts[parts.length - 1].charAt(0)).toUpperCase(Locale.ROOT);
    }

    public record UserRequest(@NotBlank @Size(max = 140) String nome,
        @NotBlank @Email @Size(max = 180) String email,
        @NotBlank @Size(min = 12, max = 72) String senha,
        @NotBlank String perfil, @Size(max = 100) String cargo) {}

    public record UserUpdateRequest(@NotBlank @Size(max = 140) String nome,
        @NotBlank @Email @Size(max = 180) String email,
        @Size(min = 12, max = 72) String senha,
        @NotBlank String perfil, @Size(max = 100) String cargo) {}

    public record StatusRequest(boolean ativo) {}

    public record UsuarioView(Long id, String nome, String email, String cargo, String perfil,
        String situacao, String avatar, java.time.Instant criadoEm) {}
}
