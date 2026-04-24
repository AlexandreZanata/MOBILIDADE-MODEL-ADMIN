/**
 * Support - Página de Suporte ao Cliente
 * Central de ajuda, tickets e documentação
 */

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Tabs,
    Form,
    Input,
    Button,
    Table,
    Tag,
    Space,
    Collapse,
    Modal,
    Typography,
} from 'antd';
import {
    CustomerServiceOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    BugOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/themes/ThemeProvider';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea: AntTextArea } = Input;

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    updatedAt: string;
}

const mockTickets: Ticket[] = [
    {
        id: 'TKT-001',
        title: 'Erro ao fazer login',
        description: 'Usuário não consegue fazer login no painel',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
    },
    {
        id: 'TKT-002',
        title: 'Relatório não carrega',
        description: 'A página de relatórios está lenta para carregar',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2024-01-19T14:15:00Z',
        updatedAt: '2024-01-20T09:00:00Z',
    },
    {
        id: 'TKT-003',
        title: 'Dúvida sobre precificação',
        description: 'Como funciona o sistema de precificação dinâmica?',
        status: 'resolved',
        priority: 'low',
        createdAt: '2024-01-18T16:45:00Z',
        updatedAt: '2024-01-19T11:20:00Z',
    },
];

const mockFAQ = [
    {
        key: '1',
        label: 'Como alterar o preço do KM?',
        children: (
            <Text>
                Para alterar o preço do KM, acesse a página de Precificação no menu lateral.
                Selecione a regra que deseja editar, altere os valores e clique em Salvar.
                As mudanças são aplicadas imediatamente para novas corridas.
            </Text>
        ),
    },
    {
        key: '2',
        label: 'Como ver relatórios financeiros?',
        children: (
            <Text>
                Acesse a página de Relatórios ou Financeiro no menu. Selecione o período desejado
                e escolha o tipo de relatório. Você pode exportar em PDF ou Excel.
            </Text>
        ),
    },
    {
        key: '3',
        label: 'Como gerenciar motoristas?',
        children: (
            <Text>
                Na página de Motoristas, você pode visualizar todos os motoristas cadastrados,
                ver suas avaliações, status online/offline e histórico de corridas.
            </Text>
        ),
    },
    {
        key: '4',
        label: 'Como bloquear um cliente?',
        children: (
            <Text>
                Na página de Clientes, localize o cliente desejado, clique em Editar e altere
                o status para Bloqueado. O cliente não poderá mais fazer corridas.
            </Text>
        ),
    },
    {
        key: '5',
        label: 'Como exportar dados?',
        children: (
            <Text>
                A maioria das páginas possui um botão Exportar. Clique nele para baixar os dados
                em formato CSV ou Excel. Você também pode filtrar antes de exportar.
            </Text>
        ),
    },
];

const mockDocumentation = [
    {
        id: '1',
        title: 'Guia de Início Rápido',
        description: 'Aprenda o básico sobre o painel de administração',
        category: 'Introdução',
        readTime: '5 min',
    },
    {
        id: '2',
        title: 'Gestão de Motoristas',
        description: 'Dicas para gerenciar motoristas e garantir qualidade',
        category: 'Gestão',
        readTime: '8 min',
    },
    {
        id: '3',
        title: 'Análise de Relatórios',
        description: 'Como interpretar e analisar os relatórios',
        category: 'Análise',
        readTime: '10 min',
    },
    {
        id: '4',
        title: 'Configurações Avançadas',
        description: 'Configurações e integrações avançadas',
        category: 'Configuração',
        readTime: '12 min',
    },
];

export const Support: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const [form] = Form.useForm();
    const [tickets, setTickets] = useState(mockTickets);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [, setLoading] = useState(false);

    const ticketColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id: string) => <span style={{ fontWeight: 600 }}>{id}</span>,
        },
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const colors: Record<string, string> = {
                    open: 'blue',
                    in_progress: 'orange',
                    resolved: 'green',
                    closed: 'gray',
                };
                const labels: Record<string, string> = {
                    open: 'Aberto',
                    in_progress: 'Em Progresso',
                    resolved: 'Resolvido',
                    closed: 'Fechado',
                };
                return <Tag color={colors[status]}>{labels[status]}</Tag>;
            },
        },
        {
            title: 'Prioridade',
            dataIndex: 'priority',
            key: 'priority',
            width: 100,
            render: (priority: string) => {
                const colors: Record<string, string> = {
                    low: 'green',
                    medium: 'orange',
                    high: 'red',
                    urgent: 'volcano',
                };
                const labels: Record<string, string> = {
                    low: 'Baixa',
                    medium: 'Média',
                    high: 'Alta',
                    urgent: 'Urgente',
                };
                return <Tag color={colors[priority]}>{labels[priority]}</Tag>;
            },
        },
        {
            title: 'Data',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 130,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
    ];

    const handleCreateTicket = async (values: any) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newTicket: Ticket = {
                id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
                title: values.title,
                description: values.description,
                status: 'open',
                priority: values.priority,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setTickets([...tickets, newTicket]);
            form.resetFields();
            setIsModalVisible(false);
            // message.success('Ticket criado com sucesso!');
        } catch (error) {
            // message.error('Erro ao criar ticket');
        } finally {
            setLoading(false);
        }
    };

    const ticketsTab = (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsModalVisible(true)}
                    style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}
                >
                    Criar Novo Ticket
                </Button>
            </div>

            <Table
                columns={ticketColumns}
                dataSource={tickets}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title="Criar Novo Ticket de Suporte"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                width={600}
                okText="Enviar"
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateTicket}
                >
                    <Form.Item
                        label="Título"
                        name="title"
                        rules={[{ required: true, message: 'Título obrigatório' }]}
                    >
                        <Input placeholder="Descreva brevemente seu problema" />
                    </Form.Item>

                    <Form.Item
                        label="Descrição"
                        name="description"
                        rules={[{ required: true, message: 'Descrição obrigatória' }]}
                    >
                        <AntTextArea rows={4} placeholder="Forneça detalhes completos do seu problema" />
                    </Form.Item>

                    <Form.Item
                        label="Prioridade"
                        name="priority"
                        rules={[{ required: true }]}
                    >
                        <select style={{
                            padding: '6px 11px',
                            borderRadius: 4,
                            border: isDark ? '1px solid #374151' : '1px solid #d9d9d9',
                            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                            color: isDark ? '#F9FAFB' : '#000',
                        }}>
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                        </select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );

    const faqTab = (
        <div>
            <Collapse
                items={mockFAQ}
                style={{
                    borderRadius: 8,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                }}
            />
        </div>
    );

    const documentationTab = (
        <Row gutter={[16, 16]}>
            {mockDocumentation.map((doc) => (
                <Col xs={24} sm={12} lg={6} key={doc.id}>
                    <Card
                        hoverable
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ marginBottom: 12 }}>
                            <FileTextOutlined style={{ fontSize: 32, color: '#0374C8' }} />
                        </div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            {doc.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                            {doc.description}
                        </Text>
                        <Space size="small" style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Tag color="blue">{doc.category}</Tag>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {doc.readTime}
                            </Text>
                        </Space>
                    </Card>
                </Col>
            ))}
        </Row>
    );

    const statsTickets = {
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
    };

    return (
        <div>
            {/* Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <ClockCircleOutlined style={{ fontSize: 24, color: '#0374C8' }} />
                            <Text strong>Tickets Abertos</Text>
                            <Title level={3} style={{ margin: 0, color: '#0374C8' }}>
                                {statsTickets.open}
                            </Title>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <BugOutlined style={{ fontSize: 24, color: '#F7B733' }} />
                            <Text strong>Em Progresso</Text>
                            <Title level={3} style={{ margin: 0, color: '#F7B733' }}>
                                {statsTickets.inProgress}
                            </Title>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <CheckCircleOutlined style={{ fontSize: 24, color: '#10B981' }} />
                            <Text strong>Resolvidos</Text>
                            <Title level={3} style={{ margin: 0, color: '#10B981' }}>
                                {statsTickets.resolved}
                            </Title>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Main Card */}
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
                            key: 'tickets',
                            label: <span><CustomerServiceOutlined /> Tickets de Suporte</span>,
                            children: ticketsTab,
                        },
                        {
                            key: 'faq',
                            label: <span><QuestionCircleOutlined /> Perguntas Frequentes</span>,
                            children: faqTab,
                        },
                        {
                            key: 'docs',
                            label: <span><FileTextOutlined /> Documentação</span>,
                            children: documentationTab,
                        },
                    ]}
                />
            </Card>
        </div>
    );
};