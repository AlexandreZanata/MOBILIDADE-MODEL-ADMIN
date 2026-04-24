/**
 * Settings - Página de Configurações
 * Gerenciar preferências do sistema, segurança e integrações
 */

import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Switch,
    Select,
    Row,
    Col,
    Divider,
    Space,
    Tabs,
    message,
    Typography,
} from 'antd';
import {
    SaveOutlined,
    LockOutlined,
    BellOutlined,
    GlobalOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/themes/ThemeProvider';

const { Text, Title } = Typography;

export const Settings: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1500));
            message.success('Configurações salvas com sucesso!');
        } catch (error) {
            message.error('Erro ao salvar configurações');
        } finally {
            setLoading(false);
        }
    };

    const generalTab = (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveSettings}
            initialValues={{
                companyName: 'VAMU',
                email: 'admin@vamu.com.br',
                timezone: 'America/Sao_Paulo',
                language: 'pt-BR',
                currency: 'BRL',
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Nome da Empresa"
                        name="companyName"
                        rules={[{ required: true, message: 'Nome obrigatório' }]}
                    >
                        <Input size="large" placeholder="Nome da empresa" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Email inválido' }]}
                    >
                        <Input size="large" placeholder="email@empresa.com.br" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Fuso Horário"
                        name="timezone"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { label: 'São Paulo (UTC-3)', value: 'America/Sao_Paulo' },
                                { label: 'Rio de Janeiro (UTC-3)', value: 'America/Rio_Branco' },
                                { label: 'Brasília (UTC-3)', value: 'America/Fortaleza' },
                            ]}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Idioma"
                        name="language"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { label: 'Português (Brasil)', value: 'pt-BR' },
                                { label: 'Inglês', value: 'en-US' },
                                { label: 'Espanhol', value: 'es-ES' },
                            ]}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Moeda"
                name="currency"
                rules={[{ required: true }]}
            >
                <Select
                    options={[
                        { label: 'Real (R$)', value: 'BRL' },
                        { label: 'Dólar (USD)', value: 'USD' },
                        { label: 'Euro (EUR)', value: 'EUR' },
                    ]}
                    size="large"
                />
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}
            >
                Salvar Configurações
            </Button>
        </Form>
    );

    const securityTab = (
        <Form layout="vertical">
            <Title level={4} style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                <LockOutlined /> Segurança
            </Title>

            <Divider />

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Senha Atual"
                        required
                    >
                        <Input.Password size="large" placeholder="Digite sua senha atual" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Nova Senha"
                        required
                    >
                        <Input.Password size="large" placeholder="Digite a nova senha" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Confirmar Senha"
                        required
                    >
                        <Input.Password size="large" placeholder="Confirme a nova senha" />
                    </Form.Item>
                </Col>
            </Row>

            <Button
                type="primary"
                size="large"
                style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}
            >
                Alterar Senha
            </Button>

            <Divider />

            <Title level={5} style={{ color: isDark ? '#F9FAFB' : '#111827', marginTop: 24 }}>
                Autenticação de Dois Fatores
            </Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 0',
                        }}>
                            <Text>Habilitar Autenticação de Dois Fatores</Text>
                            <Switch defaultChecked={false} />
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Adicione uma camada extra de segurança à sua conta
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Form>
    );

    const notificationsTab = (
        <Form layout="vertical">
            <Title level={4} style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                <BellOutlined /> Notificações
            </Title>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                }}>
                    <Text>Notificações por Email</Text>
                    <Switch defaultChecked={true} />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                }}>
                    <Text>Alertas de Sistema</Text>
                    <Switch defaultChecked={true} />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                }}>
                    <Text>Relatórios Diários</Text>
                    <Switch defaultChecked={false} />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                }}>
                    <Text>Notificações de Promoções</Text>
                    <Switch defaultChecked={true} />
                </div>
            </Space>
        </Form>
    );

    const integrationsTab = (
        <div>
            <Title level={4} style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                <GlobalOutlined /> Integrações
            </Title>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <GlobalOutlined style={{ fontSize: 32, color: '#0374C8' }} />
                        </div>
                        <Text strong>API REST</Text>
                        <p style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 8 }}>
                            Integração com serviços externos
                        </p>
                        <Button type="primary" size="small" style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}>
                            Configurar
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <GlobalOutlined style={{ fontSize: 32, color: '#F7B733' }} />
                        </div>
                        <Text strong>Webhooks</Text>
                        <p style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 8 }}>
                            Receba notificações em tempo real
                        </p>
                        <Button type="primary" size="small" style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}>
                            Configurar
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <GlobalOutlined style={{ fontSize: 32, color: '#10B981' }} />
                        </div>
                        <Text strong>OAuth 2.0</Text>
                        <p style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 8 }}>
                            Autenticação segura de terceiros
                        </p>
                        <Button type="primary" size="small" style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}>
                            Configurar
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    return (
        <Card
            style={{
                borderRadius: 12,
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                background: isDark ? '#1F2937' : '#FFFFFF',
            }}
        >
            <Tabs
                items={[
                    {
                        key: 'general',
                        label: 'Geral',
                        children: generalTab,
                    },
                    {
                        key: 'security',
                        label: 'Segurança',
                        children: securityTab,
                    },
                    {
                        key: 'notifications',
                        label: 'Notificações',
                        children: notificationsTab,
                    },
                    {
                        key: 'integrations',
                        label: 'Integrações',
                        children: integrationsTab,
                    },
                ]}
            />
        </Card>
    );
};