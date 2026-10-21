package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.NotaFiscal;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.NotaFiscalRepository;
@RestController @RequestMapping("/api/notas-fiscais")
public class NotaFiscalController extends CrudController<NotaFiscal> { public NotaFiscalController(NotaFiscalRepository r, EmpresaRepository e) { super(r, e); } }
