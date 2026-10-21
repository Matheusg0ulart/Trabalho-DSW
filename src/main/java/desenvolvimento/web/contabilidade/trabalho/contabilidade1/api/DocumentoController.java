package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Documento;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.DocumentoRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
@RestController @RequestMapping("/api/documentos")
public class DocumentoController extends CrudController<Documento> { public DocumentoController(DocumentoRepository r, EmpresaRepository e) { super(r, e); } }
