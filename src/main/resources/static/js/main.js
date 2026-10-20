/**
 * ==============================================================================
 * WALDO FERREIRA ASSESSORIA CONTÁBIL - SCRIPTS DA LANDING PAGE PÚBLICA
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSimuladorTributario();
    initFaqAccordion();
    initContactForm();
    initEmailCopy();
    initWhatsAppFloat();
    initSmoothScroll();
});

/* ==============================================================================
   1. NAVBAR SCROLL & MOBILE TOGGLE
   ============================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sombra ao rolar a página
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
    });

    // Toggle menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Fechar ao clicar em link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Fechar ao redimensionar para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1080 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Fechar ao clicar fora do menu
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

/* ==============================================================================
   2. SIMULADOR DE ECONOMIA TRIBUTÁRIA INTERATIVO
   ============================================================================== */
function initSimuladorTributario() {
    const rangeInput = document.getElementById('faturamentoRange');
    const rangeDisplay = document.getElementById('rangeValueDisplay');
    const segmentoSelect = document.getElementById('tipoSegmento');
    const objetivoBtns = document.querySelectorAll('.option-btn');

    const regimeRecomendado = document.getElementById('regimeRecomendado');
    const aliquotaEfetiva = document.getElementById('aliquotaEfetiva');
    const impostoAtual = document.getElementById('impostoAtual');
    const impostoOtimizado = document.getElementById('impostoOtimizado');
    const economiaAnual = document.getElementById('economiaAnual');
    const whatsappBtn = document.getElementById('btnSimuladorWhatsApp');

    if (!rangeInput || !segmentoSelect) return;

    let objetivoSelecionado = "abrir";

    if (objetivoBtns) {
        objetivoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                objetivoBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                objetivoSelecionado = btn.dataset.value || "abrir";
                calcularSimulacao();
            });
        });
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    function calcularSimulacao() {
        const faturamento = parseFloat(rangeInput.value);
        const segmento = segmentoSelect.value;

        rangeDisplay.textContent = formatCurrency(faturamento);

        let aliquotaNormal = 0.155; // 15.5% média sem planejamento
        let aliquotaOtimizada = 0.06; // 6% com Fator R no Simples Anexo III
        let regimeTxt = "Simples Nacional (Anexo III - Fator R)";
        let descAliquota = "Alíquota otimizada em ~6.0%";

        if (segmento === 'comercio') {
            aliquotaNormal = 0.095;
            aliquotaOtimizada = 0.04; // Anexo I comércio inicial
            regimeTxt = "Simples Nacional (Anexo I - Comércio)";
            descAliquota = "Alíquota inicial em ~4.0% com segregação ICMS/ST";
        } else if (segmento === 'industria') {
            aliquotaNormal = 0.115;
            aliquotaOtimizada = 0.055;
            regimeTxt = "Simples Nacional (Anexo II - Indústria)";
            descAliquota = "Alíquota otimizada com IPI e ICMS reduzido";
        } else {
            // Serviços gerais
            if (faturamento > 180000) {
                aliquotaNormal = 0.195;
                aliquotaOtimizada = 0.1333; // Lucro Presumido bem estruturado
                regimeTxt = "Lucro Presumido Estruturado";
                descAliquota = "Otimização de IRPJ/CSLL com retenção na fonte";
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
            const msg = `Olá Waldo Ferreira! Fiz a simulação no site:
- *Segmento:* ${segmento.toUpperCase()}
- *Faturamento:* ${formatCurrency(faturamento)}/mês
- *Economia Estimada:* ${formatCurrency(econAnual)}/ano
Gostaria de receber uma proposta personalizada para a minha empresa.`;
            whatsappBtn.href = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
        }
    }

    rangeInput.addEventListener('input', calcularSimulacao);
    segmentoSelect.addEventListener('change', calcularSimulacao);
    calcularSimulacao();
}

/* ==============================================================================
   3. FAQ ACCORDION
   ============================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ==============================================================================
   4. FORMULÁRIO DE CONTATO (VALIDAÇÃO & DEMONSTRAÇÃO)
   ============================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const telefone = document.getElementById('whatsapp')?.value.trim();
        const faturamento = document.getElementById('faturamentoForm')?.value;
        const mensagem = document.getElementById('mensagem')?.value.trim();

        if (!nome || !email || !telefone) {
            alert('Por favor, preencha os campos obrigatórios (*).');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando sua mensagem...';

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            form.reset();

            if (feedback) {
                feedback.className = 'form-feedback-alert success';
                feedback.innerHTML = `
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <i class="fa-solid fa-circle-check" style="font-size: 1.3rem; margin-top: 2px;"></i>
                        <div>
                            <strong>Solicitação Registrada com Sucesso!</strong><br>
                            Obrigado, <strong>${nome}</strong>. Sua solicitação foi direcionada ao e-mail <u>waldoferreira@gmail.com</u>. Nossa equipe entrará em contato em breve pelo telefone/WhatsApp informado.<br><br>
                            <a href="https://wa.me/5511999999999?text=Ol%C3%A1%20Waldo!%20Acabei%20de%20enviar%20uma%20solicita%C3%A7%C3%A3o%20pelo%20site%20da%20minha%20empresa%20(${encodeURIComponent(nome)})." target="_blank" class="btn btn-whatsapp btn-sm" style="display: inline-flex; margin-top: 6px;">
                                <i class="fa-brands fa-whatsapp"></i> Falar Agora no WhatsApp
                            </a>
                        </div>
                    </div>
                `;
            }
        }, 800);
    });
}

/* ==============================================================================
   5. CÓPIA DE E-MAIL COM 1 CLIQUE
   ============================================================================== */
function initEmailCopy() {
    const copyTriggers = document.querySelectorAll('[data-copy-email]');
    copyTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const email = trigger.dataset.copyEmail || 'waldoferreira@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const originalText = trigger.innerHTML;
                trigger.innerHTML = `<i class="fa-solid fa-check text-green"></i> E-mail copiado!`;
                setTimeout(() => {
                    trigger.innerHTML = originalText;
                }, 2200);
            }).catch(() => {
                alert(`E-mail do escritório: ${email}`);
            });
        });
    });
}

/* ==============================================================================
   6. WHATSAPP FLUTUANTE POPOVER
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
   7. ROLAGEM SUAVE
   ============================================================================== */
function initSmoothScroll() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
