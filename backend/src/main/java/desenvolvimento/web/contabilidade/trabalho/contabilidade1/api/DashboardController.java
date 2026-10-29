package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.DocumentoRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.FolhaPagamentoRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.NotaFiscalRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.NotificacaoRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.ObrigacaoFiscalRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.ParcelamentoRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.ServicoRepository;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.UsuarioRepository;

@RestController
public class DashboardController {
    private final EmpresaRepository empresas;
    private final ObrigacaoFiscalRepository impostos;
    private final FolhaPagamentoRepository folhas;
    private final ServicoRepository servicos;
    private final NotaFiscalRepository notas;
    private final ParcelamentoRepository parcelamentos;
    private final DocumentoRepository documentos;
    private final UsuarioRepository usuarios;
    private final NotificacaoRepository notificacoes;

    public DashboardController(EmpresaRepository empresas, ObrigacaoFiscalRepository impostos,
            FolhaPagamentoRepository folhas, ServicoRepository servicos, NotaFiscalRepository notas,
            ParcelamentoRepository parcelamentos, DocumentoRepository documentos,
            UsuarioRepository usuarios, NotificacaoRepository notificacoes) {
        this.empresas = empresas;
        this.impostos = impostos;
        this.folhas = folhas;
        this.servicos = servicos;
        this.notas = notas;
        this.parcelamentos = parcelamentos;
        this.documentos = documentos;
        this.usuarios = usuarios;
        this.notificacoes = notificacoes;
    }

    @GetMapping("/api/dashboard/resumo")
    public Map<String, Long> resumo() {
        return Map.of(
            "empresas", empresas.count(),
            "impostos", impostos.count(),
            "folhas", folhas.count(),
            "servicos", servicos.count(),
            "notasFiscais", notas.count(),
            "parcelamentos", parcelamentos.count(),
            "documentos", documentos.count(),
            "usuarios", usuarios.count(),
            "notificacoesNaoLidas", notificacoes.countByLidaFalse()
        );
    }
}
