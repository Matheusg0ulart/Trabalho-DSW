/**
 * ==============================================================================
 * WALDO FERREIRA ASSESSORIA CONTÁBIL - SCRIPTS DO SISTEMA ADMINISTRATIVO
 * ==============================================================================
 * Controla componentes compartilhados da área privada:
 * - Sidebar com marcação do módulo ativo e contadores dinâmicos
 * - Topbar com notificações, busca e perfil
 * - Sistema de Modais reutilizáveis
 * - Toast alerts para feedback visual de ações demonstrativas
 * - Formatadores de moeda (BRL), CNPJ e datas (pt-BR)
 * - Exportação de relatórios
 * ==============================================================================
 */

/**
 * ==============================================================================
 * GUARD DE NAVEGAÇÃO DEMONSTRATIVA (Frontend Security Layer)
 * ==============================================================================
 * Centraliza a verificação de sessão demonstrativa para evitar acessos acidentais
 * às páginas internas do escritório sem passagem prévia pelo login.
 * 
 * AVISO OBRIGATÓRIO DE SEGURANÇA:
 * Esta verificação é executada no navegador do cliente (frontend) e simula o
 * comportamento de controle de acesso para fins demonstrativos e didáticos.
 * Ela NÃO substitui autenticação de backend e NÃO protege dados contra manipulação
 * no console ou leitura direta de arquivos estáticos.
 * ==============================================================================
 */
(function enforceDemoNavigationGuard() {
    const session = sessionStorage.getItem('WALDO_DEMO_SESSION');
    if (!session) {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        sessionStorage.setItem('WALDO_REDIRECT_AFTER_LOGIN', currentPage);
        window.location.replace('../login.html?motivo=acesso_restrito');
    }
})();

class AdminUI {
    constructor() {
        this.initMobileSidebar();
        this.initNotifications();
        this.initGlobalSearch();
        this.initUserProfile();
        this.initLogoutEvents();
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
    resetDemoData() {
        if (confirm("Deseja restaurar todos os dados demonstrativos para os valores originais do escritório?")) {
            if (window.DataStore) {
                window.DataStore.resetToDefault();
                this.showToast("Dados demonstrativos restaurados com sucesso!", "info");
                setTimeout(() => window.location.reload(), 600);
            }
        }
    }

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
            const sessionStr = sessionStorage.getItem('WALDO_DEMO_SESSION');
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
     * Vincula todos os gatilhos de encerramento de sessão demonstrativa
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
     * Encerra a sessão demonstrativa com limpeza total de storage
     */
    logout() {
        if (confirm("Deseja realmente encerrar a sessão demonstrativa do painel?")) {
            sessionStorage.removeItem('WALDO_DEMO_SESSION');
            sessionStorage.removeItem('WALDO_LOGGED_USER');
            sessionStorage.removeItem('WALDO_REDIRECT_AFTER_LOGIN');
            window.location.replace('../login.html?motivo=logout');
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
});
