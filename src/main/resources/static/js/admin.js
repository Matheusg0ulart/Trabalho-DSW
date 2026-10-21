/**
 * ==============================================================================
 * WALDO FERREIRA ASSESSORIA CONTÁBIL - SCRIPTS DO SISTEMA ADMINISTRATIVO
 * ==============================================================================
 * Controla componentes compartilhados da área privada:
 * - Sidebar com marcação do módulo ativo e contadores dinâmicos
 * - Topbar com notificações, busca e perfil
 * - Sistema de Modais reutilizáveis
 * - Toast alerts para feedback de operações
 * - Formatadores de moeda (BRL), CNPJ e datas (pt-BR)
 * - Exportação de relatórios
 * ==============================================================================
 */

/**
 * ==============================================================================
 * GUARD DE NAVEGAÇÃO SEGURA BASEADA EM TOKENS (Frontend Token Security Layer)
 * ==============================================================================
 * Valida a sessão com o backend antes de exibir os módulos privados.
 * ==============================================================================
 */
(async function enforceBackendSession() {
    if (sessionStorage.getItem('WALDO_PRESENTATION_DEMO') === '1') {
        sessionStorage.setItem('WALDO_USER_SESSION', JSON.stringify({
            nome: 'Waldo Ferreira', cargo: 'Modo de apresentação', perfil: 'DEMONSTRAÇÃO'
        }));
        return;
    }
    const authorization = sessionStorage.getItem('WALDO_API_AUTH');
    if (!authorization) {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        sessionStorage.setItem('WALDO_REDIRECT_AFTER_LOGIN', currentPage);
        window.location.replace('../login.html?motivo=acesso_restrito');
        return;
    }
    try {
        const response = await fetch('/api/auth/me', { headers: { Authorization: `Basic ${authorization}` } });
        if (!response.ok) throw new Error('Sessão inválida');
        const user = await response.json();
        sessionStorage.setItem('WALDO_USER_SESSION', JSON.stringify({ usuario: user.email, nome: user.nome, cargo: user.cargo, perfil: user.perfil }));
    } catch (error) {
        sessionStorage.removeItem('WALDO_API_AUTH');
        sessionStorage.removeItem('WALDO_USER_SESSION');
        sessionStorage.removeItem('WALDO_DEMO_SESSION');
        sessionStorage.removeItem('WALDO_PRESENTATION_DEMO');
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        sessionStorage.setItem('WALDO_REDIRECT_AFTER_LOGIN', currentPage);
        window.location.replace('../login.html?motivo=sessao_expirada');
    }
})();

// Aplicação instantânea do tema salvo no localStorage antes da renderização do DOM
(function applyAdminThemeEarly() {
    const saved = localStorage.getItem('WALDO_ADMIN_THEME') || 'light';
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

class AdminUI {
    constructor() {
        this.initThemeToggle();
        this.initMobileSidebar();
        this.initNotifications();
        this.initGlobalSearch();
        this.initUserProfile();
        this.initLogoutEvents();
        this.initInputMasks();
    }

    /**
     * Atualiza contadores dinâmicos na Sidebar a partir do DataStore
     */
    updateSidebarCounters() {
        if (!window.DataStore) return;
        const kpis = window.DataStore.getDashboardKPIs();

        const badgeImpostos = document.getElementById('badge-sidebar-impostos');
        if (badgeImpostos) {
            badgeImpostos.textContent = kpis.impostosPendentes;
            badgeImpostos.className = kpis.impostosAtrasados > 0 ? 'counter-badge danger' : 'counter-badge warning';
        }

        const badgeFolha = document.getElementById('badge-sidebar-folha');
        if (badgeFolha) {
            badgeFolha.textContent = kpis.folhaPendente;
            badgeFolha.className = 'counter-badge warning';
        }

        const badgeServicos = document.getElementById('badge-sidebar-servicos');
        if (badgeServicos) {
            badgeServicos.textContent = kpis.servicosAbertos;
            badgeServicos.className = kpis.servicosAtrasados > 0 ? 'counter-badge danger' : 'counter-badge';
        }

        const badgeNotas = document.getElementById('badge-sidebar-notas');
        if (badgeNotas) {
            badgeNotas.textContent = kpis.notasPendentes;
        }

        const badgeDocumentos = document.getElementById('badge-sidebar-documentos');
        if (badgeDocumentos) {
            badgeDocumentos.textContent = kpis.documentosPendentes;
            badgeDocumentos.className = 'counter-badge warning';
        }

        const topbarNotifBadge = document.getElementById('topbarNotifBadge');
        if (topbarNotifBadge) {
            const unread = window.DataStore.getNaoLidasCount();
            topbarNotifBadge.textContent = unread;
            topbarNotifBadge.style.display = unread > 0 ? 'flex' : 'none';
        }
    }

    /**
     * Alternador de Tema Claro / Escuro (Modo Noturno)
     */
    initThemeToggle() {
        const savedTheme = localStorage.getItem('WALDO_ADMIN_THEME') || 'light';
        
        // Assegura que o botão exista na barra superior em qualquer página administrativa
        const topbarRight = document.querySelector('.topbar-right');
        let themeBtn = document.getElementById('themeToggleBtn');
        
        if (!themeBtn && topbarRight) {
            themeBtn = document.createElement('button');
            themeBtn.type = 'button';
            themeBtn.className = 'topbar-btn-icon theme-toggle-btn';
            themeBtn.id = 'themeToggleBtn';
            
            // Inserir antes do link do site público (globo)
            const globeBtn = topbarRight.querySelector('a[href*="index.html"]');
            if (globeBtn) {
                topbarRight.insertBefore(themeBtn, globeBtn);
            } else {
                topbarRight.appendChild(themeBtn);
            }
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const nextTheme = isDark ? 'light' : 'dark';
                this.applyTheme(nextTheme, true);
            });
        }

        this.applyTheme(savedTheme, false);
    }

    applyTheme(theme, showToast = false) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (document.body) document.body.classList.add('dark-mode');
            localStorage.setItem('WALDO_ADMIN_THEME', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (document.body) document.body.classList.remove('dark-mode');
            localStorage.setItem('WALDO_ADMIN_THEME', 'light');
        }

        const themeBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
        themeBtns.forEach(btn => {
            if (theme === 'dark') {
                btn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
                btn.setAttribute('title', 'Mudar para Modo Claro');
                btn.setAttribute('aria-label', 'Mudar para Modo Claro');
            } else {
                btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                btn.setAttribute('title', 'Mudar para Modo Noturno');
                btn.setAttribute('aria-label', 'Mudar para Modo Noturno');
            }
        });

        if (showToast) {
            this.showToast(theme === 'dark' ? 'Modo Noturno ativado.' : 'Modo Claro ativado.', 'info');
        }
    }

    /**
     * Alternância do menu lateral em telas menores / celulares
     */
    initMobileSidebar() {
        const toggleBtn = document.getElementById('menuToggleBtn');
        const sidebar = document.querySelector('.admin-sidebar');
        const closeBtn = document.getElementById('sidebarCloseBtn');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        if (closeBtn && sidebar) {
            closeBtn.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
            });
        }
    }

    /**
     * Dropdown de Notificações no Topbar
     */
    initNotifications() {
        const btn = document.getElementById('notifToggleBtn');
        const dropdown = document.getElementById('notifDropdown');

        if (btn && dropdown) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
                this.renderNotifDropdown();
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && e.target !== btn) {
                    dropdown.classList.remove('active');
                }
            });
        }
    }

    renderNotifDropdown() {
        const listContainer = document.getElementById('notifDropdownList');
        if (!listContainer || !window.DataStore) return;

        const notifs = window.DataStore.getNotificacoes();
        if (!notifs.length) {
            listContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Nenhuma notificação no momento.</div>';
            return;
        }

        listContainer.innerHTML = notifs.map(n => `
            <a href="${n.link || 'notificacoes.html'}" class="notif-item ${!n.lida ? 'unread' : ''}" onclick="window.AdminUI.markAsRead(${n.id})">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${this.escapeHtml(n.titulo)}</strong>
                    <span>${n.data}</span>
                </div>
                <p>${this.escapeHtml(n.mensagem)}</p>
            </a>
        `).join('');
    }

    markAsRead(id) {
        if (window.DataStore) {
            window.DataStore.marcarNotificacaoComoLida(id);
            this.updateSidebarCounters();
        }
    }

    initGlobalSearch() {
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const q = searchInput.value.trim();
                    if (q) {
                        window.location.href = `empresas.html?busca=${encodeURIComponent(q)}`;
                    }
                }
            });
        }

        // Atalho Ctrl+K ou / para focar busca
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        });
    }

    /**
     * Sistema de Feedback Visual (Toast Notification)
     */
    showToast(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-circle-check';
        if (type === 'danger') icon = 'fa-circle-exclamation';
        if (type === 'warning') icon = 'fa-triangle-exclamation';
        if (type === 'info') icon = 'fa-circle-info';

        toast.innerHTML = `
            <i class="fa-solid ${icon}" style="font-size: 1.15rem;"></i>
            <span>${this.escapeHtml(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    /**
     * Controle de Abertura/Fechamento de Modais
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Configura fechamento de modais pelo botão fechar e backdrop
     */
    bindModalEvents() {
        document.querySelectorAll('.admin-modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    backdrop.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            const closeBtn = backdrop.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    backdrop.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.admin-modal-backdrop.active').forEach(m => {
                    m.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        });
    }

    /**
     * Restaura os dados padrão para demonstração
     */
    // ==========================================
    // UTILITÁRIOS DE FORMATAÇÃO (PT-BR)
    // ==========================================
    formatCurrency(val) {
        if (val === null || val === undefined) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    formatDate(dateStr) {
        if (!dateStr) return '-';
        if (dateStr.includes('T')) dateStr = dateStr.split('T')[0];
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    }

    /**
     * Preenche os dados do perfil logado na barra lateral a partir da sessão
     */
    initUserProfile() {
        try {
            const sessionStr = sessionStorage.getItem('WALDO_USER_SESSION');
            if (!sessionStr) return;
            const user = JSON.parse(sessionStr);
            document.querySelectorAll('.user-info-text strong').forEach(el => {
                el.textContent = user.nome || 'Waldo Ferreira';
            });
            document.querySelectorAll('.user-info-text span').forEach(el => {
                el.textContent = user.cargo || 'Contador Responsável';
            });
        } catch (e) {
            // Falha silenciosa
        }
    }

    /**
     * Vincula os gatilhos de encerramento da sessão
     */
    initLogoutEvents() {
        document.querySelectorAll('.btn-sidebar-exit, .btn-logout').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    }

    /**
     * Encerra a sessão removendo a credencial mantida nesta aba
     */
    logout() {
        if (confirm("Deseja realmente encerrar sua sessão?")) {
            sessionStorage.removeItem('WALDO_USER_SESSION');
            sessionStorage.removeItem('WALDO_DEMO_SESSION');
            sessionStorage.removeItem('WALDO_LOGGED_USER');
            sessionStorage.removeItem('WALDO_REDIRECT_AFTER_LOGIN');
            sessionStorage.removeItem('WALDO_API_AUTH');
            sessionStorage.removeItem('WALDO_PRESENTATION_DEMO');
            localStorage.removeItem('WALDO_API_AUTH');
            window.location.replace('../login.html?motivo=logout');
        }
    }

    /**
     * ==============================================================================
     * MÁSCARAS EM TEMPO REAL NOS FORMULÁRIOS DO ADMIN (CNPJ & TELEFONE)
     * ==============================================================================
     */
    formatPhone(value) {
        if (!value) return '';
        let digits = String(value).replace(/\D/g, '');
        if (digits.length > 11 && digits.startsWith('55')) {
            digits = digits.substring(2);
        }
        digits = digits.substring(0, 11);

        if (digits.length === 0) return '';
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
        if (digits.length <= 10) {
            return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
        }
        return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
    }

    formatCNPJ(value) {
        if (!value) return '';
        const digits = String(value).replace(/\D/g, '').substring(0, 14);
        if (digits.length <= 2) return digits;
        if (digits.length <= 5) return `${digits.substring(0, 2)}.${digits.substring(2)}`;
        if (digits.length <= 8) return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5)}`;
        if (digits.length <= 12) return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8)}`;
        return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12)}`;
    }

    initInputMasks() {
        const bindMask = (input, formatter) => {
            if (!input) return;
            input.addEventListener('input', () => {
                const start = input.selectionStart;
                const prevLen = input.value.length;
                input.value = formatter(input.value);
                const newLen = input.value.length;
                if (start !== null && start === prevLen) {
                    input.setSelectionRange(newLen, newLen);
                }
            });
        };

        // Inputs de CNPJ específicos e genéricos
        const cnpjInputs = document.querySelectorAll('#campoCNPJ, #cfgCNPJ, input[data-mask="cnpj"]');
        cnpjInputs.forEach(input => bindMask(input, this.formatCNPJ));

        // Inputs de Telefone específicos e genéricos
        const phoneInputs = document.querySelectorAll('#campoTelefone, #cfgTelefone, input[data-mask="phone"]');
        phoneInputs.forEach(input => bindMask(input, this.formatPhone));
    }

    /**
     * ==============================================================================
     * EXPORTAÇÃO DE RELATÓRIOS E LISTAS EM CSV (COMPATÍVEL COM EXCEL)
     * ==============================================================================
     */
    exportToCSV(filename, rows) {
        if (window.DataStore && typeof window.DataStore.exportToCSV === 'function') {
            window.DataStore.exportToCSV(filename, rows);
            this.showToast(`Relatório exportado em formato CSV/Excel com sucesso!`, 'success');
        } else {
            if (!rows || !rows.length) {
                this.showToast("Nenhum registro para exportar.", "warning");
                return;
            }
            const separator = ';';
            const keys = Object.keys(rows[0]);
            let csvContent = '\uFEFF' + keys.join(separator) + '\r\n';

            rows.forEach(row => {
                const values = keys.map(k => {
                    let val = row[k] === null || row[k] === undefined ? '' : String(row[k]);
                    if (val.includes(separator) || val.includes('\n') || val.includes('"')) {
                        val = `"${val.replace(/"/g, '""')}"`;
                    }
                    return val;
                });
                csvContent += values.join(separator) + '\r\n';
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${filename}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            this.showToast(`Relatório exportado em formato CSV/Excel com sucesso!`, 'success');
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

// Expõe helper global de escape para uso em scripts inline e templates
window.escapeHtml = function(text) {
    if (!text && text !== 0) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
};

// Inicializa a UI Administrativa Global
document.addEventListener('DOMContentLoaded', () => {
    window.AdminUI = new AdminUI();
    window.AdminUI.updateSidebarCounters();
    window.AdminUI.bindModalEvents();
    if (sessionStorage.getItem('WALDO_PRESENTATION_DEMO') === '1') {
        const notice = document.querySelector('.admin-banner-notice .notice-text > div');
        if (notice) notice.innerHTML = '<strong>Modo de demonstração para apresentação</strong> — Estes registros são fictícios e ficam salvos apenas neste navegador.';
    }
});
