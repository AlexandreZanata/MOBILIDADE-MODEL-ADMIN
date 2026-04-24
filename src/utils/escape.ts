// src/utils/escape.ts

/**
 * Escapa caracteres especiais HTML
 */
export const escapeHtml = (text: string): string => {
    if (! text) return '';

    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Formata número de telefone
 */
export const formatPhone = (phone: string | undefined): string => {
    if (!phone) return '-';

    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned. slice(6)}`;
    }

    return phone;
};

/**
 * Formata valor em moeda
 */
export const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

/**
 * Formata percentual
 */
export const formatPercent = (value: number | undefined): string => {
    if (value === undefined || value === null) return '0%';

    return `${value. toFixed(2)}%`;
};

/**
 * Sanitiza entrada de usuário
 */
export const sanitizeInput = (input: string): string => {
    if (!input) return '';

    return escapeHtml(input. trim());
};