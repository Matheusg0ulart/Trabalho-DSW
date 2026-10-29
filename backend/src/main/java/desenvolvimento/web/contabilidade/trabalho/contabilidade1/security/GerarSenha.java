package desenvolvimento.web.contabilidade.trabalho.contabilidade1.security;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GerarSenha {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String senha = "123456";

        System.out.println(encoder.encode(senha));
    }
}