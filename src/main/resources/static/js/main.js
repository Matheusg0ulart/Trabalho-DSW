/**
 * ==============================================================================
 * WALDO FERREIRA ASSESSORIA CONTÁBIL - SCRIPTS DA LANDING PAGE PÚBLICA
 * Otimizado, Modular, Acessível e 100% Responsivo
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initPublicTheme();
    initNavbar();
    initServicesFilterAndExpand();
    initSimuladorTributario();
    initFaqAccordion();
    initInputMasks();
    initContactForm();
    initEmailCopy();
    initWhatsAppFloat();
    initSmoothScroll();
});

/* ==============================================================================
   1. NAVBAR SCROLL & MOBILE TOGGLE COM ACESSIBILIDADE
   ============================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sombra e transparência ao rolar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight do link ativo conforme scroll
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 110;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    if (navToggle && navMenu) {
        const closeNavMenu = () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        };

        const openNavMenu = () => {
            navMenu.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        };

        // Toggle menu mobile
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeNavMenu();
            } else {
                openNavMenu();
            }
        });

        // Fechar ao clicar em qualquer link da navegação
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeNavMenu();
            });
        });

        // Fechar com a tecla ESC para acessibilidade
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeNavMenu();
                navToggle.focus();
            }
        });

        // Fechar ao redimensionar para desktop (> 1080px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1080 && navMenu.classList.contains('active')) {
                closeNavMenu();
            }
        });

        // Fechar ao clicar fora do menu
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeNavMenu();
            }
        });
    }
}

/* ==============================================================================
   2. FILTRO DE SERVIÇOS E EXPANSÃO "SAIBA MAIS"
   ============================================================================== */
function initServicesFilterAndExpand() {
    const tabBtns = document.querySelectorAll('.services-tab-btn');
    const serviceCards = document.querySelectorAll('.service-card-modern');
    const toggleBtns = document.querySelectorAll('.btn-service-toggle');
    const serviceCtaLinks = document.querySelectorAll('.service-details-cta');

    // Filtros de Categoria
    if (tabBtns && serviceCards) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const selectedCategory = btn.dataset.category || 'todos';

                serviceCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    if (selectedCategory === 'todos' || cardCategory === selectedCategory) {
                        card.classList.remove('category-hidden');
                    } else {
                        card.classList.add('category-hidden');
                    }
                });
            });
        });
    }

    // Botões "Saiba mais" expansíveis
    if (toggleBtns) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                const targetId = btn.getAttribute('aria-controls');
                const targetDetails = document.getElementById(targetId);

                if (!targetDetails) return;

                if (isExpanded) {
                    btn.setAttribute('aria-expanded', 'false');
                    targetDetails.classList.remove('expanded');
                    const span = btn.querySelector('span');
                    if (span) span.textContent = 'Saiba mais';
                } else {
                    btn.setAttribute('aria-expanded', 'true');
                    targetDetails.classList.add('expanded');
                    const span = btn.querySelector('span');
                    if (span) span.textContent = 'Menos detalhes';
                }
            });
        });
    }

    // Botões "Solicitar este serviço" dentro dos detalhes expansíveis
    if (serviceCtaLinks) {
        serviceCtaLinks.forEach(link => {
            link.addEventListener('click', () => {
                const serviceName = link.dataset.serviceSelect;
                const mensagemInput = document.getElementById('mensagem');
                if (mensagemInput && serviceName) {
                    mensagemInput.value = `Olá! Tenho interesse no serviço de ${serviceName}. Gostaria de entender o escopo e receber uma proposta para minha empresa.`;
                    mensagemInput.focus();
                }
            });
        });
    }
}

/* ==============================================================================
   3. SIMULADOR DE ESTIMATIVA TRIBUTÁRIA INTERATIVO
   ============================================================================== */
function initSimuladorTributario() {
    const rangeInput = document.getElementById('faturamentoRange');
    const textInput = document.getElementById('faturamentoInput');
    const rangeDisplay = document.getElementById('rangeValueDisplay');
    const validationMsg = document.getElementById('faturamentoValidationMsg');
    const segmentoSelect = document.getElementById('tipoSegmento');
    const objetivoBtns = document.querySelectorAll('.option-btn');
    const contextInfo = document.getElementById('simContextInfo');

    const regimeRecomendado = document.getElementById('regimeRecomendado');
    const aliquotaEfetiva = document.getElementById('aliquotaEfetiva');
    const impostoAtual = document.getElementById('impostoAtual');
    const impostoOtimizado = document.getElementById('impostoOtimizado');
    const economiaAnual = document.getElementById('economiaAnual');
    const whatsappBtn = document.getElementById('btnSimuladorWhatsApp');
    const contatoBtn = document.getElementById('btnSimuladorContato');

    const assumptionsToggle = document.getElementById('simAssumptionsToggle');
    const assumptionsBody = document.getElementById('simAssumptionsBody');

    if (!rangeInput || !segmentoSelect) return;

    let objetivoSelecionado = "abrir";

    const objectiveLabels = {
        abrir: "Abrir Novo CNPJ",
        trocar: "Trocar de Contador",
        mei: "Migrar de MEI para ME",
        existente: "Otimizar Empresa Ativa"
    };

    const objectiveContexts = {
        abrir: "Cenário de Abertura: Planejamento prévio para constituição no melhor enquadramento desde o primeiro mês fiscal.",
        trocar: "Cenário de Migração: Revisão da escrita fiscal anterior e aplicação técnica imediata do Fator R no Simples.",
        mei: "Cenário de Transição MEI: Desenquadramento seguro para Microempresa (ME) com emissão regular de notas e folha.",
        existente: "Cenário de Empresa Ativa: Auditoria para redução legal da carga tributária e proteção contra autuações fiscais."
    };

    if (objetivoBtns) {
        objetivoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                objetivoBtns.forEach(b => {
                    b.classList.remove('selected');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('selected');
                btn.setAttribute('aria-pressed', 'true');
                objetivoSelecionado = btn.dataset.value || "abrir";
                if (contextInfo && objectiveContexts[objetivoSelecionado]) {
                    contextInfo.textContent = objectiveContexts[objetivoSelecionado];
                }
                calcularSimulacao();
            });
        });
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    // Parser robusto para moeda brasileira
    function parseBRL(valueStr) {
        if (typeof valueStr === 'number') return (isNaN(valueStr) || valueStr < 0) ? null : valueStr;
        if (!valueStr) return null;
        const str = valueStr.toString().trim();
        // Rejeita valores negativos explicitamente
        if (str.includes('-')) return null;

        let clean = str.replace(/[^\d.,]/g, '').trim();
        if (!clean) return null;
        if (clean.includes('.') && clean.includes(',')) {
            clean = clean.replace(/\./g, '').replace(',', '.');
        } else if (clean.includes(',')) {
            clean = clean.replace(',', '.');
        } else if (clean.includes('.')) {
            const parts = clean.split('.');
            if (parts.length > 1 && parts[parts.length - 1].length === 3) {
                clean = clean.replace(/\./g, '');
            }
        }
        const num = parseFloat(clean);
        return (isNaN(num) || num < 0) ? null : num;
    }

    function getFaturamentoAtual() {
        const textVal = textInput ? parseBRL(textInput.value) : null;
        if (textVal !== null) return textVal;
        return parseFloat(rangeInput.value) || 50000;
    }

    function calcularSimulacao() {
        const faturamento = getFaturamentoAtual();
        const segmento = segmentoSelect.value;

        // Validação de limites (R$ 1.000 a R$ 1.000.000)
        const MIN_FAT = 1000;
        const MAX_FAT = 1000000;

        if (faturamento < MIN_FAT || faturamento > MAX_FAT) {
            if (validationMsg) validationMsg.classList.add('visible');
            if (textInput) textInput.classList.add('error');
            return;
        }

        if (validationMsg) validationMsg.classList.remove('visible');
        if (textInput) textInput.classList.remove('error');

        if (rangeDisplay) {
            rangeDisplay.textContent = formatCurrency(faturamento);
        }

        let aliquotaNormal = 0.155; // 15.5% padrão Anexo V
        let aliquotaOtimizada = 0.06; // 6.0% Anexo III via Fator R
        let regimeTxt = "Simples Nacional (Anexo III - Fator R)";
        let descAliquota = "Alíquota estimada em ~6.0% condicionado a folha/pró-labore >= 28%";

        if (segmento === 'comercio') {
            aliquotaNormal = 0.095;
            aliquotaOtimizada = 0.04; // Anexo I comércio inicial
            regimeTxt = "Simples Nacional (Anexo I - Comércio)";
            descAliquota = "Alíquota inicial em ~4.0% com segregação de ICMS-ST e monofásicos";
        } else if (segmento === 'industria') {
            aliquotaNormal = 0.115;
            aliquotaOtimizada = 0.055; // Anexo II indústria inicial
            regimeTxt = "Simples Nacional (Anexo II - Indústria)";
            descAliquota = "Alíquota estimada em ~5.5% com apropriação adequada de IPI e ICMS";
        } else {
            // Serviços
            if (faturamento > 180000) {
                aliquotaNormal = 0.195;
                aliquotaOtimizada = 0.1333; // Lucro Presumido estruturado
                regimeTxt = "Lucro Presumido Estruturado";
                descAliquota = "Presunção de 32% (IRPJ/CSLL) e retenções federais de 4,65%";
            }
        }

        const vlrImpostoAtual = faturamento * aliquotaNormal;
        const vlrImpostoOtimizado = faturamento * aliquotaOtimizada;
        const econMensal = vlrImpostoAtual - vlrImpostoOtimizado;
        const econAnual = econMensal * 12;

        if (regimeRecomendado) regimeRecomendado.textContent = regimeTxt;
        if (aliquotaEfetiva) aliquotaEfetiva.textContent = descAliquota;
        if (impostoAtual) impostoAtual.textContent = `${formatCurrency(vlrImpostoAtual)} /mês`;
        if (impostoOtimizado) impostoOtimizado.textContent = `${formatCurrency(vlrImpostoOtimizado)} /mês`;
        if (economiaAnual) economiaAnual.textContent = `${formatCurrency(econAnual)} /ano`;

        if (whatsappBtn) {
            const msg = `Olá Waldo Ferreira! Realizei a simulação tributária pelo site:
- *Objetivo:* ${objectiveLabels[objetivoSelecionado] || objetivoSelecionado}
- *Segmento:* ${segmento.toUpperCase()}
- *Faturamento Médio:* ${formatCurrency(faturamento)}/mês
- *Cenário Estimado:* ${regimeTxt}
- *Diferença Anual Projetada:* ${formatCurrency(econAnual)}/ano
Gostaria de agendar uma avaliação técnica personalizada para a minha empresa.`;
            whatsappBtn.href = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
        }
    }

    // Sincronização entre Slider e Campo de Texto
    rangeInput.addEventListener('input', () => {
        const val = parseFloat(rangeInput.value);
        if (textInput) {
            textInput.value = formatCurrency(val);
        }
        calcularSimulacao();
    });

    if (textInput) {
        textInput.addEventListener('input', () => {
            const val = parseBRL(textInput.value);
            if (val !== null && val >= 5000 && val <= 500000) {
                rangeInput.value = val;
            }
            calcularSimulacao();
        });

        textInput.addEventListener('blur', () => {
            const val = parseBRL(textInput.value);
            if (val !== null && val >= 1000 && val <= 1000000) {
                textInput.value = formatCurrency(val);
            }
        });
    }

    segmentoSelect.addEventListener('change', calcularSimulacao);

    // Accordion de Premissas
    if (assumptionsToggle && assumptionsBody) {
        assumptionsToggle.addEventListener('click', () => {
            const isExp = assumptionsToggle.getAttribute('aria-expanded') === 'true';
            if (isExp) {
                assumptionsToggle.setAttribute('aria-expanded', 'false');
                assumptionsBody.classList.remove('expanded');
            } else {
                assumptionsToggle.setAttribute('aria-expanded', 'true');
                assumptionsBody.classList.add('expanded');
            }
        });
    }

    // Botão de scroll para contato a partir do simulador
    if (contatoBtn) {
        contatoBtn.addEventListener('click', () => {
            const faturamento = getFaturamentoAtual();
            const selectForm = document.getElementById('faturamentoForm');
            if (selectForm) {
                if (faturamento <= 20000) {
                    selectForm.value = "Até R$ 20.000 / mês";
                } else if (faturamento <= 50000) {
                    selectForm.value = "R$ 20.000 a R$ 50.000 / mês";
                } else if (faturamento <= 150000) {
                    selectForm.value = "R$ 50.000 a R$ 150.000 / mês";
                } else {
                    selectForm.value = "Acima de R$ 150.000 / mês";
                }
            }
        });
    }

    calcularSimulacao();
}

/* ==============================================================================
   4. FAQ ACCORDION COM ACESSIBILIDADE
   ============================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (questionBtn && answer) {
            const answerId = `faq-answer-${index + 1}`;
            answer.id = answerId;
            questionBtn.setAttribute('aria-controls', answerId);
            questionBtn.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const b = i.querySelector('.faq-question');
                    if (b) b.setAttribute('aria-expanded', 'false');
                });
                if (!isActive) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
}

/* ==============================================================================
   5. FORMULÁRIO DE CONTATO (VALIDAÇÃO INLINE & MODO DEMONSTRATIVO)
   ============================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (!form) return;

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const whatsappInput = document.getElementById('whatsapp');
    const faturamentoInput = document.getElementById('faturamentoForm');
    const mensagemInput = document.getElementById('mensagem');

    const nomeError = document.getElementById('nomeError');
    const emailError = document.getElementById('emailError');
    const whatsappError = document.getElementById('whatsappError');

    const clearErrors = () => {
        [nomeError, emailError, whatsappError].forEach(span => {
            if (span) {
                span.textContent = '';
                span.classList.remove('visible');
            }
        });
        [nomeInput, emailInput, whatsappInput].forEach(inp => {
            if (inp) inp.classList.remove('error');
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const nome = nomeInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const whatsapp = whatsappInput?.value.trim() || '';
        const faturamento = faturamentoInput?.value || '';
        const mensagem = mensagemInput?.value.trim() || '';

        let hasError = false;

        if (!nome || nome.length < 3) {
            if (nomeError) {
                nomeError.textContent = 'Por favor, informe seu nome completo (mínimo de 3 caracteres).';
                nomeError.classList.add('visible');
            }
            if (nomeInput) nomeInput.classList.add('error');
            hasError = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            if (emailError) {
                emailError.textContent = 'Por favor, informe um endereço de e-mail corporativo válido.';
                emailError.classList.add('visible');
            }
            if (emailInput) emailInput.classList.add('error');
            hasError = true;
        }

        const phoneDigits = whatsapp.replace(/\D/g, '');
        if (!whatsapp || phoneDigits.length < 10) {
            if (whatsappError) {
                whatsappError.textContent = 'Por favor, informe um número de WhatsApp ou celular com DDD (mínimo 10 dígitos).';
                whatsappError.classList.add('visible');
            }
            if (whatsappInput) whatsappInput.classList.add('error');
            hasError = true;
        }

        if (hasError) {
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Registrando solicitação...';

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            form.reset();

            if (feedback) {
                feedback.className = 'form-feedback-alert success';
                const whatsappMsg = `Olá Waldo Ferreira! Enviei meus dados pelo site da minha empresa:
- *Nome:* ${nome}
- *E-mail:* ${email}
- *WhatsApp:* ${whatsapp}
- *Faturamento Médio:* ${faturamento}
- *Mensagem:* ${mensagem || "Gostaria de uma proposta de assessoria."}`;

                feedback.innerHTML = `
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <i class="fa-solid fa-circle-check" aria-hidden="true" style="font-size: 1.4rem; color: var(--green-600); margin-top: 2px;"></i>
                        <div>
                            <strong>Solicitação Registrada no Modo Demonstrativo!</strong><br>
                            Obrigado, <strong>${nome}</strong>. Seus dados foram salvos no ambiente demonstrativo do frontend. Como este site opera sem backend ou banco de dados ativo, clique abaixo para falar diretamente com o contador e receber seu orçamento imediato:<br><br>
                            <a href="https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMsg)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display: inline-flex; margin-top: 4px;">
                                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Continuar Conversa no WhatsApp
                            </a>
                        </div>
                    </div>
                `;
            }
        }, 600);
    });
}

/* ==============================================================================
   6. CÓPIA DE E-MAIL COM 1 CLIQUE
   ============================================================================== */
function initEmailCopy() {
    const copyTriggers = document.querySelectorAll('[data-copy-email]');
    copyTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const email = trigger.dataset.copyEmail || 'waldoferreira@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const originalHtml = trigger.innerHTML;
                trigger.innerHTML = `<div class="c-icon icon-mail"><i class="fa-solid fa-check text-green" aria-hidden="true"></i></div><div><strong>E-mail Copiado!</strong><span>${email}</span></div>`;
                setTimeout(() => {
                    trigger.innerHTML = originalHtml;
                }, 2200);
            }).catch(() => {
                alert(`E-mail do escritório: ${email}`);
            });
        });
    });
}

/* ==============================================================================
   7. WHATSAPP FLUTUANTE POPOVER
   ============================================================================== */
function initWhatsAppFloat() {
    const popover = document.getElementById('whatsappPopover');
    const closeBtn = document.getElementById('popoverCloseBtn');

    if (closeBtn && popover) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            popover.style.display = 'none';
        });
    }
}

/* ==============================================================================
   8. ROLAGEM SUAVE
   ============================================================================== */
function initSmoothScroll() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ==============================================================================
   9. MODO NOTURNO NA LANDING PAGE PÚBLICA (Alternância & Persistência)
   ============================================================================== */
function initPublicTheme() {
    const btnDesktop = document.getElementById('publicThemeToggleBtn');
    const btnMobile = document.getElementById('publicThemeToggleBtnMobile');
    const iconDesktop = document.getElementById('themeIconDesktop');
    const iconMobile = document.getElementById('themeIconMobile');
    const textMobile = document.getElementById('themeTextMobile');

    function updateIcons(isDark) {
        if (iconDesktop) {
            iconDesktop.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
        if (iconMobile) {
            iconMobile.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
        if (textMobile) {
            textMobile.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
        }
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 
                         localStorage.getItem('WALDO_PUBLIC_THEME') || 
                         'light';
    updateIcons(currentTheme === 'dark');

    function toggleTheme() {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

        if (nextTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('WALDO_PUBLIC_THEME', 'dark');
            updateIcons(true);
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('WALDO_PUBLIC_THEME', 'light');
            updateIcons(false);
        }
    }

    if (btnDesktop) {
        btnDesktop.addEventListener('click', toggleTheme);
    }
    if (btnMobile) {
        btnMobile.addEventListener('click', toggleTheme);
    }
}

/* ==============================================================================
   10. MÁSCARAS EM TEMPO REAL NOS FORMULÁRIOS (TELEFONE & CNPJ)
   ============================================================================== */
function formatPhone(value) {
    if (!value) return '';
    let digits = value.replace(/\D/g, '');
    // Se colou com DDI +55, remove o 55 inicial
    if (digits.length > 11 && digits.startsWith('55')) {
        digits = digits.substring(2);
    }
    digits = digits.substring(0, 11);

    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    if (digits.length <= 10) {
        // Fixo: (XX) XXXX-XXXX
        return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
    }
    // Celular: (XX) XXXXX-XXXX
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
}

function formatCNPJ(value) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').substring(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.substring(0, 2)}.${digits.substring(2)}`;
    if (digits.length <= 8) return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5)}`;
    if (digits.length <= 12) return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8)}`;
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12)}`;
}

function initInputMasks() {
    // Máscara no campo de WhatsApp do formulário de proposta
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            const start = whatsappInput.selectionStart;
            const prevLen = whatsappInput.value.length;
            whatsappInput.value = formatPhone(whatsappInput.value);
            // Ajuste básico de cursor
            const newLen = whatsappInput.value.length;
            if (start !== null && start === prevLen) {
                whatsappInput.setSelectionRange(newLen, newLen);
            }
        });
    }

    // Suporte genérico para campos com data-mask="phone" e data-mask="cnpj"
    document.querySelectorAll('input[data-mask="phone"]').forEach(input => {
        input.addEventListener('input', () => {
            input.value = formatPhone(input.value);
        });
    });

    document.querySelectorAll('input[data-mask="cnpj"]').forEach(input => {
        input.addEventListener('input', () => {
            input.value = formatCNPJ(input.value);
        });
    });
}

