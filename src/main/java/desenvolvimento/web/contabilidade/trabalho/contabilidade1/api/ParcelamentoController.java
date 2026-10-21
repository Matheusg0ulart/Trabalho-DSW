package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.DomainModels.Parcelamento;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.ParcelamentoRepository;
@RestController @RequestMapping("/api/parcelamentos")
public class ParcelamentoController extends CrudController<Parcelamento> { public ParcelamentoController(ParcelamentoRepository r, EmpresaRepository e) { super(r, e); } }
