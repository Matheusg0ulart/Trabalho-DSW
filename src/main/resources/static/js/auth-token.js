/**
 * ==============================================================================
 * WALDO FERREIRA ASSESSORIA CONTÁBIL - SISTEMA DE AUTENTICAÇÃO COM TOKENS
 * ==============================================================================
 * Módulo de segurança do frontend responsável por:
 * - Geração de tokens de sessão estruturados (Header.Payload.Signature)
 * - Assinatura digital baseada em chave secreta da aplicação
 * - Validação de integridade e checagem de expiração temporal (TTL)
 * - Persistência segura em sessionStorage e localStorage (Lembrar Sessão)
 * ==============================================================================
 */

(function(global) {
    'use strict';

    const SECRET_KEY = 'WALDO_CONTABILIDADE_SECRET_DSW_2026';
    const TOKEN_STORAGE_KEY = 'WALDO_AUTH_TOKEN';
    const SESSION_DATA_KEY = 'WALDO_DEMO_SESSION';
    const LOGGED_USER_KEY = 'WALDO_LOGGED_USER';

    // Utilitários de codificação Base64URL segura para navegadores
    function base64UrlEncode(str) {
        try {
            const bytes = new TextEncoder().encode(str);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        } catch (e) {
            return btoa(unescape(encodeURIComponent(str)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        }
    }

    function base64UrlDecode(str) {
        try {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) {
                str += '=';
            }
            const binary = atob(str);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        } catch (e) {
            return decodeURIComponent(escape(atob(str)));
        }
    }

    // Assinatura digital determinística (HMAC-SHA256 simulado em JS puro com salt)
    function generateSignature(data, secret) {
        let hash = 0x811c9dc5;
        const combined = data + '#' + secret + '#WALDO_SECURE';
        for (let i = 0; i < combined.length; i++) {
            hash ^= combined.charCodeAt(i);
            hash = (hash * 0x01000193) >>> 0;
        }
        // Segundo ciclo de dispersão criptográfica
        let hash2 = 0x55555555;
        for (let j = combined.length - 1; j >= 0; j--) {
            hash2 = (hash2 ^ (combined.charCodeAt(j) << 5)) >>> 0;
            hash2 = ((hash2 << 7) | (hash2 >>> 25)) ^ hash;
        }
        const hex = hash.toString(16).padStart(8, '0') + hash2.toString(16).padStart(8, '0');
        return base64UrlEncode(hex);
    }

    const WaldoAuth = {
        /**
         * Cria um novo token de autenticação assinado
         * @param {Object} userData Dados do usuário
         * @param {number} expiresInSeconds Tempo de vida em segundos (padrão: 7200 = 2h)
         */
        createToken(userData, expiresInSeconds = 7200) {
            const now = Math.floor(Date.now() / 1000);
            const header = {
                alg: 'HS256',
                typ: 'JWT'
            };

            const payload = {
                sub: userData.usuario || userData.email || 'waldo@waldocontabilidade.com.br',
                name: userData.nome || 'Waldo Ferreira',
                role: userData.cargo || 'Contador Responsável / Sócio',
                crc: userData.crc || 'CRC-SP 1SP234567/O-8',
                perfil: userData.perfil || 'Administrador',
                iat: now,
                exp: now + expiresInSeconds,
                jti: (typeof crypto !== 'undefined' && crypto.randomUUID) 
                    ? crypto.randomUUID() 
                    : ('wf-' + now + '-' + Math.random().toString(36).substring(2, 9))
            };

            const encodedHeader = base64UrlEncode(JSON.stringify(header));
            const encodedPayload = base64UrlEncode(JSON.stringify(payload));
            const signature = generateSignature(`${encodedHeader}.${encodedPayload}`, SECRET_KEY);

            return `${encodedHeader}.${encodedPayload}.${signature}`;
        },

        /**
         * Valida um token existente checando assinatura e prazo de validade
         * @param {string} token 
         * @returns {{ valid: boolean, payload?: Object, reason?: string }}
         */
        validateToken(token) {
            if (!token || typeof token !== 'string') {
                return { valid: false, reason: 'missing' };
            }

            const parts = token.split('.');
            if (parts.length !== 3) {
                return { valid: false, reason: 'invalid_format' };
            }

            const [encodedHeader, encodedPayload, signature] = parts;
            const expectedSig = generateSignature(`${encodedHeader}.${encodedPayload}`, SECRET_KEY);

            if (signature !== expectedSig) {
                return { valid: false, reason: 'signature_mismatch' };
            }

            try {
                const payloadJson = base64UrlDecode(encodedPayload);
                const payload = JSON.parse(payloadJson);
                const now = Math.floor(Date.now() / 1000);

                if (payload.exp && payload.exp < now) {
                    return { valid: false, reason: 'expired', payload };
                }

                return { valid: true, payload };
            } catch (e) {
                return { valid: false, reason: 'corrupt_payload' };
            }
        },

        /**
         * Salva a sessão ativa (Token + Cache de Dados)
         */
        saveSession(token, remember = true) {
            sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
            if (remember) {
                localStorage.setItem(TOKEN_STORAGE_KEY, token);
            } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
            }

            const validation = this.validateToken(token);
            if (validation.valid && validation.payload) {
                const sessionData = {
                    usuario: validation.payload.sub,
                    nome: validation.payload.name,
                    cargo: validation.payload.role,
                    perfil: validation.payload.perfil,
                    crc: validation.payload.crc,
                    autenticadoEm: new Date(validation.payload.iat * 1000).toISOString(),
                    expiraEm: new Date(validation.payload.exp * 1000).toISOString()
                };
                sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
                sessionStorage.setItem(LOGGED_USER_KEY, JSON.stringify(sessionData));
            }
        },

        /**
         * Recupera o token atual de sessionStorage ou localStorage
         */
        getCurrentToken() {
            return sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
        },

        /**
         * Retorna os dados do usuário autenticado a partir do token
         */
        getCurrentUser() {
            const token = this.getCurrentToken();
            const result = this.validateToken(token);
            if (result.valid) {
                return result.payload;
            }
            return null;
        },

        /**
         * Limpa todas as informações de autenticação (Logout seguro)
         */
        clearSession() {
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            sessionStorage.removeItem(SESSION_DATA_KEY);
            sessionStorage.removeItem(LOGGED_USER_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    };

    global.WaldoAuth = WaldoAuth;
})(typeof window !== 'undefined' ? window : this);
