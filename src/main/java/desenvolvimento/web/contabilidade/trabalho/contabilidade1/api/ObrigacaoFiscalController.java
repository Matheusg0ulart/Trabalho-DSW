package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.ObrigacaoFiscal;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.ObrigacaoFiscalRepository;
@RestController @RequestMapping("/api/impostos")
public class ObrigacaoFiscalController extends CrudController<ObrigacaoFiscal> { public ObrigacaoFiscalController(ObrigacaoFiscalRepository r, EmpresaRepository e) { super(r, e); } }
