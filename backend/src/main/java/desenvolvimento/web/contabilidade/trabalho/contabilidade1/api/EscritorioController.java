package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Escritorio;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EscritorioRepository;
@RestController @RequestMapping("/api/escritorio")
public class EscritorioController extends CrudController<Escritorio> { public EscritorioController(EscritorioRepository r, EmpresaRepository e) { super(r, e); } }
