/**
 * Tema VAMU - Paleta de cores Light e Dark
 * Tokens customizados para Ant Design 5.0
 * Cores VAMU: Azul #0374C8 e Amarelo #F7B733
 * Garantindo contraste WCAG mínimo 4.5:1
 */

import { ThemeConfig } from 'antd';

// Paleta VAMU - Modo Light
export const vamuLightTokens = {
    // Cores primárias - AZUL VAMU
    colorPrimary: '#0374C8', // Azul VAMU corporativo
    colorPrimaryHover: '#025BA0',
    colorPrimaryActive: '#024A7D',

    // Cores secundárias - AMARELO VAMU
    colorSecondary: '#F7B733', // Amarelo VAMU para entregas/destaques
    colorSecondaryHover: '#E8A821',
    colorSecondaryActive: '#D9970F',

    // Cores de destaque
    colorAccent: '#F7B733', // Amarelo VAMU
    colorAccentHover: '#E8A821',
    colorAccentActive: '#D9970F',

    // Backgrounds
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#F9FAFB',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F3F4F6',

    // Textos
    colorText: '#111827',
    colorTextSecondary: '#6B7280',
    colorTextTertiary: '#9CA3AF',
    colorTextQuaternary: '#D1D5DB',

    // Bordas
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',

    // Status colors
    colorSuccess: '#10B981',
    colorWarning: '#F7B733', // Amarelo VAMU para warnings
    colorError: '#EF4444',
    colorInfo: '#0374C8', // Azul VAMU para info

    // Componentes específicos
    colorBgHeader: '#FFFFFF',
    colorBgSidebar: '#0374C8', // Azul VAMU
    colorTextSidebar: '#F9FAFB',
    colorTextSidebarHover: '#FFFFFF',

    // Shadows
    boxShadow: '0 1px 3px 0 rgba(3, 116, 200, 0.1), 0 1px 2px 0 rgba(3, 116, 200, 0.06)',
    boxShadowSecondary: '0 4px 6px -1px rgba(3, 116, 200, 0.1), 0 2px 4px -1px rgba(3, 116, 200, 0.06)',

    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Font
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
};

// Paleta VAMU - Modo Dark
export const vamuDarkTokens = {
    // Cores primárias - AZUL VAMU (versão clara para dark)
    colorPrimary: '#3B9CE8', // Azul VAMU mais claro para dark mode
    colorPrimaryHover: '#5DACF0',
    colorPrimaryActive: '#0374C8', // Volta ao azul original quando ativo

    // Cores secundárias - AMARELO VAMU
    colorSecondary: '#FFC947', // Amarelo VAMU mais claro
    colorSecondaryHover: '#FFD45F',
    colorSecondaryActive: '#F7B733',

    // Cores de destaque
    colorAccent: '#FFC947', // Amarelo VAMU claro
    colorAccentHover: '#FFD45F',
    colorAccentActive: '#F7B733',

    // Backgrounds
    colorBgBase: '#111827',
    colorBgContainer: '#1F2937',
    colorBgElevated: '#374151',
    colorBgLayout: '#0F172A',

    // Textos
    colorText: '#F9FAFB',
    colorTextSecondary: '#D1D5DB',
    colorTextTertiary: '#9CA3AF',
    colorTextQuaternary: '#6B7280',

    // Bordas
    colorBorder: '#374151',
    colorBorderSecondary: '#4B5563',

    // Status colors (mantém contraste)
    colorSuccess: '#34D399',
    colorWarning: '#FFC947', // Amarelo VAMU claro
    colorError: '#F87171',
    colorInfo: '#3B9CE8', // Azul VAMU claro

    // Componentes específicos
    colorBgHeader: '#1F2937',
    colorBgSidebar: '#0374C8', // Azul VAMU (mesmo no dark)
    colorTextSidebar: '#F9FAFB',
    colorTextSidebarHover: '#FFFFFF',

    // Shadows (mais sutis no dark)
    boxShadow: '0 1px 3px 0 rgba(3, 116, 200, 0.3), 0 1px 2px 0 rgba(3, 116, 200, 0.2)',
    boxShadowSecondary: '0 4px 6px -1px rgba(3, 116, 200, 0.3), 0 2px 4px -1px rgba(3, 116, 200, 0.2)',

    // Border radius (mesmo do light)
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,

    // Spacing (mesmo do light)
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Font (mesmo do light)
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
};

/**
 * Configuração do tema Ant Design para modo Light
 */
export const vamuLightTheme: ThemeConfig = {
    token: {
        ...vamuLightTokens,
    },
    components: {
        Layout: {
            bodyBg: vamuLightTokens.colorBgLayout,
            headerBg: vamuLightTokens.colorBgHeader,
            siderBg: vamuLightTokens.colorBgSidebar,
        },
        Menu: {
            darkItemBg: vamuLightTokens.colorBgSidebar,
            darkItemSelectedBg: '#025BA0',
            darkItemHoverBg: '#025BA0',
            darkItemColor: vamuLightTokens.colorTextSidebar,
            darkItemSelectedColor: vamuLightTokens.colorTextSidebarHover,
            darkItemHoverColor: vamuLightTokens.colorTextSidebarHover,
        },
        Card: {
            borderRadiusLG: vamuLightTokens.borderRadiusLG,
            headerBg: vamuLightTokens.colorBgElevated,
            actionsBg: vamuLightTokens.colorBgContainer,
        },
        Button: {
            borderRadius: vamuLightTokens.borderRadius,
            colorPrimary: '#0374C8',
            controlOutline: 'rgba(3, 116, 200, 0.1)',
        },
        Input: {
            borderRadius: vamuLightTokens.borderRadius,
            hoverBorderColor: '#0374C8',
            activeBorderColor: '#0374C8',
        },
        Table: {
            borderRadius: vamuLightTokens.borderRadius,
            headerBg: vamuLightTokens.colorBgContainer,
            headerColor: vamuLightTokens.colorText,
            rowHoverBg: '#F0F7FF',
            borderColor: vamuLightTokens.colorBorder,
        },
        Select: {
            colorPrimary: '#0374C8',
        },
        DatePicker: {
            colorPrimary: '#0374C8',
        },
    },
    algorithm: undefined, // default algorithm (light)
};

/**
 * Configuração do tema Ant Design para modo Dark
 */
export const vamuDarkTheme: ThemeConfig = {
    token: {
        ...vamuDarkTokens,
    },
    components: {
        Layout: {
            bodyBg: vamuDarkTokens.colorBgLayout,
            headerBg: vamuDarkTokens.colorBgHeader,
            siderBg: vamuDarkTokens.colorBgSidebar,
        },
        Menu: {
            darkItemBg: vamuDarkTokens.colorBgSidebar,
            darkItemSelectedBg: '#025BA0',
            darkItemHoverBg: '#025BA0',
            darkItemColor: vamuDarkTokens.colorTextSidebar,
            darkItemSelectedColor: vamuDarkTokens.colorTextSidebarHover,
            darkItemHoverColor: vamuDarkTokens.colorTextSidebarHover,
        },
        Card: {
            borderRadiusLG: vamuDarkTokens.borderRadiusLG,
            headerBg: vamuDarkTokens.colorBgElevated,
            actionsBg: vamuDarkTokens.colorBgContainer,
        },
        Button: {
            borderRadius: vamuDarkTokens.borderRadius,
            colorPrimary: '#3B9CE8',
            controlOutline: 'rgba(59, 156, 232, 0.1)',
        },
        Input: {
            borderRadius: vamuDarkTokens.borderRadius,
            hoverBorderColor: '#3B9CE8',
            activeBorderColor: '#3B9CE8',
        },
        Table: {
            borderRadius: vamuDarkTokens.borderRadius,
            headerBg: vamuDarkTokens.colorBgElevated,
            headerColor: vamuDarkTokens.colorText,
            rowHoverBg: '#1E3A5F',
            borderColor: vamuDarkTokens.colorBorder,
        },
        Select: {
            colorPrimary: '#3B9CE8',
        },
        DatePicker: {
            colorPrimary: '#3B9CE8',
        },
    },
    algorithm: undefined,
};

// CSS Variables para uso em componentes customizados
export const vamuCSSVariables = {
    light: {
        '--color-primary': '#0374C8',
        '--color-secondary': '#F7B733',
        '--color-accent': '#F7B733',
        '--color-background': vamuLightTokens.colorBgBase,
        '--color-background-container': vamuLightTokens.colorBgContainer,
        '--color-text': vamuLightTokens.colorText,
        '--color-text-secondary': vamuLightTokens.colorTextSecondary,
        '--color-warning': '#F7B733',
    },
    dark: {
        '--color-primary': '#3B9CE8',
        '--color-secondary': '#FFC947',
        '--color-accent': '#FFC947',
        '--color-background': vamuDarkTokens.colorBgBase,
        '--color-background-container': vamuDarkTokens.colorBgContainer,
        '--color-text': vamuDarkTokens.colorText,
        '--color-text-secondary': vamuDarkTokens.colorTextSecondary,
        '--color-warning': '#FFC947',
    },
};