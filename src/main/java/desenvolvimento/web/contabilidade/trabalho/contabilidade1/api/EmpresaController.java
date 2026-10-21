package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Empresa;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
@RestController @RequestMapping("/api/empresas")
public class EmpresaController extends CrudController<Empresa> { public EmpresaController(EmpresaRepository r, EmpresaRepository e) { super(r, e); } }
