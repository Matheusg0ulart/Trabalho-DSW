package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Servico;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.ServicoRepository;
@RestController @RequestMapping("/api/servicos")
public class ServicoController extends CrudController<Servico> { public ServicoController(ServicoRepository r, EmpresaRepository e) { super(r, e); } }
