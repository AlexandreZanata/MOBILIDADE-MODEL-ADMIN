/**
 * useAccessibility - Hook para gerenciar configurações de acessibilidade
 */

import { useState, useEffect } from 'react';

export interface AccessibilitySettings {
    vlibrasEnabled: boolean;
    fontSizeMultiplier: number;
    highContrast: boolean;
    reduceMotion: boolean;
}

const ACCESSIBILITY_STORAGE_KEY = 'vamu-accessibility-settings';

export const useAccessibility = () => {
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        const saved = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
        return saved ? JSON.parse(saved) : {
            vlibrasEnabled: false,
            fontSizeMultiplier: 1,
            highContrast: false,
            reduceMotion: false,
        };
    });

    // Persistir configurações no localStorage
    useEffect(() => {
        localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    // Aplicar multiplicador de fonte
    useEffect(() => {
        if (settings.fontSizeMultiplier !== 1) {
            document.documentElement.style.fontSize = `${16 * settings.fontSizeMultiplier}px`;
        } else {
            document.documentElement.style.fontSize = '16px';
        }
    }, [settings.fontSizeMultiplier]);

    // Aplicar alto contraste
    useEffect(() => {
        if (settings.highContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        } else {
            document.documentElement.removeAttribute('data-high-contrast');
        }
    }, [settings.highContrast]);

    // Aplicar redução de movimento
    useEffect(() => {
        if (settings.reduceMotion) {
            document.documentElement.setAttribute('data-reduce-motion', 'true');
            document.documentElement.style.setProperty('--transition-duration', '0s');
        } else {
            document.documentElement.removeAttribute('data-reduce-motion');
            document.documentElement.style.setProperty('--transition-duration', '0.3s');
        }
    }, [settings.reduceMotion]);

    const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return {
        settings,
        updateSettings,
    };
};