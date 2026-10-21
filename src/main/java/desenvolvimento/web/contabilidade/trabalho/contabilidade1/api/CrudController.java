package desenvolvimento.web.contabilidade.trabalho.contabilidade1.api;

import java.lang.reflect.Field;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.BaseEntity;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.domain.EmpresaOwnedEntity;
import desenvolvimento.web.contabilidade.trabalho.contabilidade1.repository.EmpresaRepository;
import jakarta.validation.Valid;

/** Operações REST comuns. Exclusões são arquivadas para preservar o histórico. */
public abstract class CrudController<T extends BaseEntity> {
    private final JpaRepository<T, Long> repository;
    private final EmpresaRepository empresas;

    protected CrudController(JpaRepository<T, Long> repository, EmpresaRepository empresas) {
        this.repository = repository;
        this.empresas = empresas;
    }

    @GetMapping
    public Page<T> listar(@PageableDefault(size = 50, sort = "id") Pageable pageable) {
        Pageable limite = PageRequest.of(pageable.getPageNumber(), Math.min(pageable.getPageSize(), 100), pageable.getSort());
        return repository.findAll(limite);
    }

    @GetMapping("/{id}")
    public T buscar(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado."));
    }

    @PostMapping
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public T criar(@Valid @RequestBody T registro) {
        registro.id = null;
        registro.criadoEm = null;
        registro.atualizadoEm = null;
        registro.versao = null;
        validarEmpresaVinculada(registro);
        vincularEmpresa(registro);
        return repository.save(registro);
    }

    @PutMapping("/{id}")
    @Transactional
    public T atualizar(@PathVariable Long id, @Valid @RequestBody T recebido) {
        T atual = buscar(id);
        copiarCampos(recebido, atual);
        validarEmpresaVinculada(atual);
        vincularEmpresa(atual);
        return repository.save(atual);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public T arquivar(@PathVariable Long id) {
        T atual = buscar(id);
        try {
            Field ativo = atual.getClass().getField("ativo");
            ativo.setBoolean(atual, false);
        } catch (NoSuchFieldException ignored) {
            try {
                Field situacao = atual.getClass().getField("situacao");
                situacao.set(atual, "Arquivada");
            } catch (NoSuchFieldException e) {
                throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "Este registro não pode ser arquivado.");
            } catch (IllegalAccessException e) {
                throw new IllegalStateException(e);
            }
        } catch (IllegalAccessException e) {
            throw new IllegalStateException(e);
        }
        return repository.save(atual);
    }

    private void validarEmpresaVinculada(T registro) {
        try {
            Field campo = registro.getClass().getField("empresaId");
            Object valor = campo.get(registro);
            if (!(valor instanceof Number number) || !empresas.existsById(number.longValue())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A empresa vinculada não existe.");
            }
        } catch (NoSuchFieldException ignored) {
            // Cadastros que não pertencem a uma empresa específica não têm empresaId.
        } catch (IllegalAccessException e) {
            throw new IllegalStateException(e);
        }
    }

    private void vincularEmpresa(T registro) {
        if (registro instanceof EmpresaOwnedEntity vinculado) {
            vinculado.empresa = empresas.getReferenceById(vinculado.empresaId);
        }
    }

    private void copiarCampos(T origem, T destino) {
        for (Class<?> tipo = origem.getClass(); tipo != null && tipo != BaseEntity.class; tipo = tipo.getSuperclass()) {
            for (Field campo : tipo.getDeclaredFields()) {
                if (List.of("serialVersionUID").contains(campo.getName())) continue;
                try {
                    campo.setAccessible(true);
                    campo.set(destino, campo.get(origem));
                } catch (IllegalAccessException e) {
                    throw new IllegalStateException(e);
                }
            }
        }
    }
}
