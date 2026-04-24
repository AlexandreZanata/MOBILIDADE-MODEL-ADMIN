/**
 * Sidebar - Navegação lateral otimizada e profissional
 * Cores: Azul #0374C8 e Amarelo #F7B733
 * Com logos dinâmicos (vamu. png e v.png)
 */

import React, { useMemo } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    CarOutlined,
    TeamOutlined,
    DollarOutlined,
    BarChartOutlined,
    SettingOutlined,
    CustomerServiceOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CreditCardOutlined,
    UserOutlined,
    AppstoreOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import vamuLogo from '@/img/vamu.png';
import vLogo from '@/img/v.png';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
    },
    {
        key: '/rides',
        icon: <CarOutlined />,
        label: 'Corridas',
    },
    {
        key: '/drivers',
        icon: <TeamOutlined />,
        label: 'Motoristas',
    },
    {
        key: '/vehicles',
        icon: <AppstoreOutlined />,
        label: 'Veículos',
    },
    {
        key: '/customers',
        icon: <UserOutlined />,
        label: 'Clientes',
    },
    {
        key: '/payments',
        icon: <DollarOutlined />,
        label: 'Tipos/P',
    },
    {
        key: '/billing',
        icon: <WalletOutlined />,
        label: 'Pagamentos',
    },
    {
        key: '/financial',
        icon: <CreditCardOutlined />,
        label: 'Custos',
    },
    {
        key: '/reports',
        icon: <BarChartOutlined />,
        label: 'Relatórios',
    },
    {
        key: '/settings',
        icon: <SettingOutlined />,
        label: 'Configurações',
    },
    {
        key: '/support',
        icon: <CustomerServiceOutlined />,
        label: 'Suporte',
    },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Memoizar handler para evitar re-renders
    const handleMenuClick = useMemo(() => {
        return (e: { key: string }) => {
            navigate(e.key);
        };
    }, [navigate]);

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={240}
            theme="dark"
            trigger={null}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #0374C8 0%, #025BA0 100%)',
                boxShadow: '4px 0 12px rgba(3, 116, 200, 0.2)',
            }}
            aria-label="Menu de navegação principal"
        >
            {/* Logo */}
            <div
                style={{
                    height: 80,
                    margin: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Tooltip title="VAMU - Sistema Administrativo" placement="right">
                    <img
                        src={collapsed ? vLogo : vamuLogo}
                        alt={collapsed ? 'Logo V' : 'Logo VAMU'}
                        style={{
                            width: collapsed ? 80 : 200,
                            height: 'auto',
                            maxHeight: 80,
                            transition: 'all 0.3s ease',
                            objectFit: 'contain',
                        }}
                    />
                </Tooltip>
            </div>

            {/* Menu */}
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 0',
                }}
            />

            {/* Botão de Toggle - Abaixo do menu */}
            <div style={{ padding: '0 16px 16px 16px', marginTop: 'auto' }}>
                {collapsed ? (
                    <Tooltip title="Expandir menu" placement="right">
                        <Button
                            type="text"
                            icon={<MenuUnfoldOutlined />}
                            onClick={() => onCollapse(false)}
                            style={{
                                width: '100%',
                                color: '#fff',
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease',
                                fontSize: 16,
                            }}
                            aria-label="Expandir menu"
                        />
                    </Tooltip>
                ) : (
                    <Tooltip title="Recolher menu" placement="right">
                        <Button
                            type="text"
                            icon={<MenuFoldOutlined />}
                            onClick={() => onCollapse(true)}
                            style={{
                                width: '100%',
                                color: '#fff',
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease',
                            }}
                            aria-label="Recolher menu"
                        >
                            Recolher Menu
                        </Button>
                    </Tooltip>
                )}
            </div>
        </Sider>
    );
};