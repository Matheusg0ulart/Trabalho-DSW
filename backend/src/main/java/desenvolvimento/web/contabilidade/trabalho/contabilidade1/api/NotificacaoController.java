package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Notificacao;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.NotificacaoRepository;
@RestController @RequestMapping("/api/notificacoes")
public class NotificacaoController extends CrudController<Notificacao> { public NotificacaoController(NotificacaoRepository r, EmpresaRepository e) { super(r, e); } }
