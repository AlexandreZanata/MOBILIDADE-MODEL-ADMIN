/**
 * Topbar - Barra superior profissional com VLibras e Acessibilidade
 * Cores: Azul #0374C8 e Amarelo #F7B733
 * ✅ ADICIONADO: Logout funcional e navegação para perfil
 * ✅ MODIFICADO: Campo de busca removido e localização fixada em "Vamu - Sorriso"
 */

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Badge, Dropdown, Space, Button, Typography, Tooltip, Avatar, message } from 'antd';
import type { MenuProps } from 'antd';
import {
    BellOutlined,
    MoonOutlined,
    SunOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    DownOutlined,
    GlobalOutlined,
    AudioOutlined,
    FontSizeOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/themes/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

interface TopbarProps {
    onSearch?: (value: string) => void;
}

declare global {
    interface Window {
        vLLibras?:  any;
    }
}

export const Topbar: React.FC<TopbarProps> = () => {
    const { mode, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [, setFontSizeMultiplier] = useState(1);
    const [, setVlibrasLoaded] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);

    // Carregar VLibras
    useEffect(() => {
        // Verificar se já foi carregado
        if (document.getElementById('vlibras-script')) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'vlibras-script';
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin. js';
        script.async = true;

        script.onload = () => {
            console.log('VLibras carregado');
            setTimeout(() => {
                if (typeof window. vLLibras !== 'undefined') {
                    window.vLLibras.init({
                        autoplay: false,
                        top: '100px',
                        right: '0px',
                    });
                    setVlibrasLoaded(true);
                    console.log('VLibras inicializado');
                }
            }, 500);
        };

        script.onerror = () => {
            console.error('Erro ao carregar VLibras');
        };

        document.head.appendChild(script);
    }, []);

    // Recuperar fonte salva
    useEffect(() => {
        const savedFontSize = localStorage.getItem('vamu-font-size');
        if (savedFontSize) {
            const size = parseFloat(savedFontSize);
            changeFontSize(size);
        }
    }, []);

    // Aplicar multiplicador de fonte
    const changeFontSize = (multiplier: number) => {
        setFontSizeMultiplier(multiplier);

        // Aplicar ao documento
        if (multiplier === 1) {
            document. documentElement.style.fontSize = '16px';
            document.body.classList.remove('font-small', 'font-large', 'font-xlarge');
        } else if (multiplier === 0.8) {
            document.documentElement.style.fontSize = '14px';
            document.body. classList.remove('font-large', 'font-xlarge');
            document.body.classList.add('font-small');
        } else if (multiplier === 1.2) {
            document. documentElement.style.fontSize = '18px';
            document.body. classList.remove('font-small', 'font-xlarge');
            document.body.classList. add('font-large');
        } else if (multiplier === 1.5) {
            document.documentElement.style.fontSize = '20px';
            document. body.classList.remove('font-small', 'font-large');
            document.body.classList. add('font-xlarge');
        }

        // Salvar no localStorage
        localStorage.setItem('vamu-font-size', String(multiplier));
    };

    const handleToggleVLibras = () => {
        if (typeof window.vLLibras !== 'undefined') {
            console.log('Tentando ativar/desativar VLibras');
            window.vLLibras. toggle();
        } else {
            console.log('VLibras não está disponível');
            // Tentar recarregar o script
            const script = document. createElement('script');
            script. src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
            script.async = true;
            script.onload = () => {
                setTimeout(() => {
                    if (typeof window.vLLibras !== 'undefined') {
                        window.vLLibras.init({
                            autoplay: false,
                            top: '100px',
                            right: '0px',
                        });
                        window.vLLibras.toggle();
                    }
                }, 500);
            };
            document.head.appendChild(script);
        }
    };

    // ✅ HANDLER PARA LOGOUT REAL
    const handleLogout = async () => {
        try {
            await logout();
            message.success('Logout realizado com sucesso');
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            message.error('Erro ao fazer logout');
            // Mesmo com erro, redireciona para login
            navigate('/login');
        }
    };

    // ✅ HANDLER PARA NAVEGAÇÃO AO PERFIL
    const handleNavigateToProfile = () => {
        setUserDropdownOpen(false);
        navigate('/settings');
    };

    const handleNavigateToSettings = () => {
        setUserDropdownOpen(false);
        navigate('/settings');
    };

    const handleLogoutClick = async () => {
        setUserDropdownOpen(false);
        await handleLogout();
    };

    // Fechar menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userMenuOptions = [
        {
            key:  'profile',
            icon: <UserOutlined />,
            label: 'Meu Perfil',
            onClick: handleNavigateToProfile,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Configurações',
            onClick: handleNavigateToSettings,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sair',
            danger: true,
            onClick: handleLogoutClick,
        },
    ];

    // Menu de Acessibilidade
    const accessibilityMenuItems:  MenuProps['items'] = [
        {
            key: 'vlibras-header',
            label: 'VLibras (Libras)',
            disabled: true,
            style: { fontWeight: 'bold', color: '#0374C8' },
        },
        {
            key: 'vlibras',
            icon: <AudioOutlined />,
            label:  'Ativar VLibras',
            onClick: handleToggleVLibras,
        },
        {
            type: 'divider',
        },
        {
            key:  'font-header',
            label: 'Tamanho de Fonte',
            disabled: true,
            style: { fontWeight: 'bold', color: '#0374C8' },
        },
        {
            key:  'font-small',
            icon: <FontSizeOutlined style={{ fontSize: 10 }} />,
            label:  'A - Reduzir (80%)',
            onClick: () => changeFontSize(0.8),
        },
        {
            key: 'font-normal',
            icon: <FontSizeOutlined style={{ fontSize: 14 }} />,
            label:  'A - Normal (100%)',
            onClick: () => changeFontSize(1),
        },
        {
            key: 'font-large',
            icon: <FontSizeOutlined style={{ fontSize: 16 }} />,
            label:  'A+ - Aumentar (120%)',
            onClick: () => changeFontSize(1.2),
        },
        {
            key: 'font-xlarge',
            icon: <FontSizeOutlined style={{ fontSize:  18 }} />,
            label: 'A++ - Muito Grande (150%)',
            onClick:  () => changeFontSize(1.5),
        },
    ];

    // Nome e papel do usuário para exibir
    const userName = user?.name || 'Admin';
    const userEmail = user?.email;
    const userInitial = userName?.[0]?.toUpperCase();

    return (
        <Header
            style={{
                background: mode === 'dark' ?  '#1F2937' : '#FFFFFF',
                boxShadow: mode === 'dark'
                    ? '0 1px 3px rgba(0, 0, 0, 0.3)'
                    : '0 1px 3px rgba(3, 116, 200, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 24px',
                borderBottom: mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                height: 64,
            }}
        >
            {/* Ações à direita */}
            <Space size={12} style={{ marginLeft: 'auto' }}>
                {/* Notificações */}
                <Tooltip title="Notificações">
                    <Badge count={5} offset={[-5, 5]}>
                        <Button
                            type="text"
                            icon={<BellOutlined style={{ fontSize: 18, color: '#0374C8' }} />}
                            style={{
                                height: 40,
                                width: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                padding: 0,
                            }}
                            aria-label="Notificações"
                        />
                    </Badge>
                </Tooltip>

                {/* Toggle de Tema */}
                <Tooltip title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}>
                    <Button
                        type="text"
                        icon={
                            mode === 'light' ? (
                                <MoonOutlined style={{ fontSize: 18, color: '#F7B733' }} />
                            ) : (
                                <SunOutlined style={{ fontSize:  18, color: '#F7B733' }} />
                            )
                        }
                        onClick={toggleTheme}
                        style={{
                            height: 40,
                            width: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            padding: 0,
                        }}
                        aria-label="Toggle de tema"
                    />
                </Tooltip>

                {/* Acessibilidade - com ícone de "i" */}
                <Dropdown menu={{ items: accessibilityMenuItems }} placement="bottomRight" trigger={['click']}>
                    <Tooltip title="Opções de Acessibilidade">
                        <Button
                            type="text"
                            icon={<InfoCircleOutlined style={{ fontSize: 18, color:  '#10B981' }} />}
                            style={{
                                height:  40,
                                width:  40,
                                display:  'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                padding: 0,
                            }}
                            aria-label="Opções de acessibilidade"
                        />
                    </Tooltip>
                </Dropdown>

                {/* Seletor de Empresa - FIXO EM VAMU SORRISO */}
                <Button
                    type="text"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        height: 40,
                        color: mode === 'dark' ?  '#D1D5DB' : '#6B7280',
                        fontSize: 13,
                        borderRadius: 8,
                        border: mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                        padding:  '0 12px',
                        transition: 'all 0.3s ease',
                        cursor: 'not-allowed',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget. style.background = mode === 'dark' ? '#374151' : '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <GlobalOutlined style={{ fontSize: 14 }} />
                    <Text style={{ fontSize: 13 }}>Vamu Sorriso</Text>
                </Button>

                {/* Perfil do usuário */}
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                    <Button
                        type="text"
                        onClick={() => setUserDropdownOpen((prev) => !prev)}
                        style={{
                            display:  'flex',
                            alignItems: 'center',
                            gap: 8,
                            height: 40,
                            padding: '0 12px',
                            borderRadius: 8,
                            border: mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: mode === 'dark' ?  '#374151' : '#F9FAFB',
                            transition: 'all 0.3s ease',
                            cursor:  'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget. style.background = mode === 'dark' ? '#4B5563' : '#F0F7FF';
                            e.currentTarget.style.borderColor = '#0374C8';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = mode === 'dark' ? '#374151' : '#F9FAFB';
                            e. currentTarget.style.borderColor = mode === 'dark' ? '#374151' : '#E5E7EB';
                        }}
                        aria-label="Menu do usuário"
                    >
                        <Avatar
                            icon={! userInitial ? <UserOutlined /> :  undefined}
                            size={28}
                            style={{
                                backgroundColor: '#F7B733',
                                border: '2px solid',
                                borderColor: mode === 'dark' ? '#374151' : '#FFFFFF',
                                color: '#111827',
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {userInitial}
                        </Avatar>
                        {userEmail && (
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: mode === 'dark' ? '#F9FAFB' : '#111827',
                                    maxWidth: 160,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                ellipsis
                            >
                                {userEmail}
                            </Text>
                        )}
                        <DownOutlined
                            style={{
                                fontSize: 10,
                                color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
                                flexShrink: 0,
                                transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                            }}
                        />
                    </Button>

                    {userDropdownOpen && (
                        <div
                            style={{
                                position:  'absolute',
                                top: 48,
                                right: 0,
                                width: 220,
                                background: mode === 'dark' ? '#1F2937' : '#FFFFFF',
                                border: mode === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                                borderRadius: 10,
                                boxShadow: mode === 'dark'
                                    ? '0 10px 30px rgba(0,0,0,0.35)'
                                    : '0 10px 30px rgba(3, 116, 200, 0.15)',
                                padding: 8,
                                zIndex: 2000,
                            }}
                        >
                            {userMenuOptions.map((item, index) => (
                                <React.Fragment key={item.key}>
                                    <Button
                                        type="text"
                                        icon={item.icon}
                                        danger={item.danger}
                                        onClick={item.onClick}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            gap: 10,
                                            width: '100%',
                                            padding: '10px 12px',
                                            color: mode === 'dark' ? '#E5E7EB' : '#111827',
                                            borderRadius: 8,
                                            background: 'transparent',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = mode === 'dark' ? '#374151' : '#F3F4F6';
                                            e.currentTarget.style. color = item.danger ? '#DC2626' : '#0374C8';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style. color = item.danger
                                                ? '#DC2626'
                                                : mode === 'dark'
                                                    ? '#E5E7EB'
                                                    : '#111827';
                                        }}
                                    >
                                        <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                                    </Button>
                                    {index === 1 && (
                                        <div
                                            style={{
                                                height: 1,
                                                background: mode === 'dark' ? '#374151' : '#E5E7EB',
                                                margin: '4px 0',
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                                ))}
                        </div>
                    )}
                </div>
            </Space>
        </Header>
    );
};