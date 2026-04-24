/**
 * MainLayout - Layout principal do painel administrativo
 * Responsivo: sidebar colapsa em drawer em telas pequenas
 * Cores: Azul #0374C8 e Amarelo #F7B733
 */

import React, { useState, useEffect } from 'react';
import { Layout, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Sidebar } from '../Sidebar';
import { Topbar } from '../Topbar';
import { useTheme } from '@/themes/ThemeProvider';

const { Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth <= 768) {
                setCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    const sidebarContent = (
        <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop/Tablet: Sidebar fixa */}
            {!isMobile && sidebarContent}

            {/* Mobile: Sidebar em Drawer */}
            {isMobile && (
                <Drawer
                    title="Menu VAMU"
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    styles={{ body: { padding: 0 } }}
                    width={250}
                    destroyOnHidden
                >
                    <Sidebar collapsed={false} onCollapse={() => {}} />
                </Drawer>
            )}

            <Layout style={{
                marginLeft: isMobile ? 0 : (collapsed ? 80 : 240),
                transition: 'margin-left 0.2s',
            }}>
                {/* Topbar com botão de menu para mobile */}
                <div style={{ position: 'relative' }}>
                    {isMobile && (
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            size="large"
                            onClick={() => setDrawerVisible(true)}
                            style={{
                                position: 'absolute',
                                left: 16,
                                top: 12,
                                zIndex: 101,
                                color: '#0374C8',
                            }}
                        />
                    )}
                    <Topbar onSearch={(value) => console.log('Search:', value)} />
                </div>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: isDark ? '#111827' : '#F3F4F6',
                        borderRadius: 12,
                        transition: 'background 0.3s ease',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};