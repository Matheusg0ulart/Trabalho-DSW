package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.FolhaPagamento;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.FolhaPagamentoRepository;
@RestController @RequestMapping("/api/folhas")
public class FolhaPagamentoController extends CrudController<FolhaPagamento> { public FolhaPagamentoController(FolhaPagamentoRepository r, EmpresaRepository e) { super(r, e); } }
