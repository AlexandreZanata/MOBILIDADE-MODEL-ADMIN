/**
 * Pricing - Gestão de Preços do KM
 * Página para configurar e gerenciar tarifas por km
 */

import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Form,
    Input,
    Modal,
    Row,
    Col,
    Tag,
    Space,
    InputNumber,
    Select,
    Statistic,
    Empty,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DollarOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/themes/ThemeProvider';
import { formatCurrency, escapeHtml } from '@/utils/escape';

interface PricingRule {
    id: string;
    name: string;
    type: 'car' | 'motorcycle' | 'bicycle';
    baseFare: number;
    pricePerKm: number;
    pricePerMinute: number;
    minimumFare: number;
    surgeMultiplier: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

const mockPricingRules: PricingRule[] = [
    {
        id: '1',
        name: 'Padrão - Carro',
        type: 'car',
        baseFare: 5.0,
        pricePerKm: 2.5,
        pricePerMinute: 0.5,
        minimumFare: 10.0,
        surgeMultiplier: 1.5,
        status: 'active',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
    },
    {
        id: '2',
        name: 'Padrão - Moto',
        type: 'motorcycle',
        baseFare: 3.0,
        pricePerKm: 1.8,
        pricePerMinute: 0.3,
        minimumFare: 7.0,
        surgeMultiplier: 1.3,
        status: 'active',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
    },
    {
        id: '3',
        name: 'Padrão - Bike',
        type: 'bicycle',
        baseFare: 2.0,
        pricePerKm: 1.2,
        pricePerMinute: 0.2,
        minimumFare: 5.0,
        surgeMultiplier: 1.1,
        status: 'active',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
    },
];

export const Pricing: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
    const [form] = Form.useForm();
    const [pricingRules, setPricingRules] = useState(mockPricingRules);

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span style={{ fontWeight: 600 }}>{escapeHtml(text)}</span>,
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                const colors: Record<string, string> = {
                    car: '#0374C8',
                    motorcycle: '#F7B733',
                    bicycle: '#10B981',
                };
                const labels: Record<string, string> = {
                    car: 'Carro',
                    motorcycle: 'Moto',
                    bicycle: 'Bike',
                };
                return <Tag color={colors[type]}>{labels[type]}</Tag>;
            },
        },
        {
            title: 'Tarifa Base',
            dataIndex: 'baseFare',
            key: 'baseFare',
            render: (value: number) => formatCurrency(value),
        },
        {
            title: 'Preço/KM',
            dataIndex: 'pricePerKm',
            key: 'pricePerKm',
            render: (value: number) => formatCurrency(value),
        },
        {
            title: 'Preço/Min',
            dataIndex: 'pricePerMinute',
            key: 'pricePerMinute',
            render: (value: number) => formatCurrency(value),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Ativo' : 'Inativo'}
                </Tag>
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: any, record: PricingRule) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => {
                            setEditingRule(record);
                            form.setFieldsValue(record);
                            setIsModalVisible(true);
                        }}
                        style={{ color: '#0374C8' }}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={() => {
                            setPricingRules(pricingRules.filter(r => r.id !== record.id));
                        }}
                    />
                </Space>
            ),
        },
    ];

    const handleAddRule = () => {
        setEditingRule(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleSaveRule = async (values: any) => {
        if (editingRule) {
            setPricingRules(
                pricingRules.map(r =>
                    r.id === editingRule.id
                        ? { ...r, ...values, updatedAt: new Date().toISOString() }
                        : r
                )
            );
        } else {
            const newRule: PricingRule = {
                id: String(Date.now()),
                ...values,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setPricingRules([...pricingRules, newRule]);
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const activeRules = pricingRules.filter(r => r.status === 'active');
    const totalRules = pricingRules.length;

    return (
        <div>
            {/* KPIs */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        style={{
                            borderRadius: 12,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                        }}
                    >
                        <Statistic
                            title="Regras Ativas"
                            value={activeRules.length}
                            prefix={<CheckCircleOutlined style={{ color: '#0374C8' }} />}
                            valueStyle={{ color: '#0374C8', fontWeight: 700 }}
                        />
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
                        <Statistic
                            title="Total de Regras"
                            value={totalRules}
                            prefix={<DollarOutlined style={{ color: '#F7B733' }} />}
                            valueStyle={{ color: '#F7B733', fontWeight: 700 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Tabela de Regras */}
            <Card
                title={
                    <span style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: isDark ? '#F9FAFB' : '#111827',
                    }}>
            Regras de Preço por KM
          </span>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddRule}
                        style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}
                    >
                        Nova Regra
                    </Button>
                }
                style={{
                    borderRadius: 12,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
            >
                {pricingRules.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={pricingRules}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        style={{
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}
                    />
                ) : (
                    <Empty description="Nenhuma regra de preço configurada" />
                )}
            </Card>

            {/* Modal de Edição */}
            <Modal
                title={editingRule ? 'Editar Regra de Preço' : 'Nova Regra de Preço'}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveRule}
                >
                    <Form.Item
                        label="Nome da Regra"
                        name="name"
                        rules={[{ required: true, message: 'Nome obrigatório' }]}
                    >
                        <Input placeholder="Ex: Padrão - Carro" />
                    </Form.Item>

                    <Form.Item
                        label="Tipo de Veículo"
                        name="type"
                        rules={[{ required: true, message: 'Tipo obrigatório' }]}
                    >
                        <Select
                            options={[
                                { label: 'Carro', value: 'car' },
                                { label: 'Moto', value: 'motorcycle' },
                                { label: 'Bike', value: 'bicycle' },
                            ]}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Tarifa Base (R$)"
                                name="baseFare"
                                rules={[{ required: true, message: 'Tarifa obrigatória' }]}
                            >
                                <InputNumber min={0} step={0.5} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Preço por KM (R$)"
                                name="pricePerKm"
                                rules={[{ required: true, message: 'Preço obrigatório' }]}
                            >
                                <InputNumber min={0} step={0.1} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Preço por Minuto (R$)"
                                name="pricePerMinute"
                                rules={[{ required: true, message: 'Preço obrigatório' }]}
                            >
                                <InputNumber min={0} step={0.05} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Tarifa Mínima (R$)"
                                name="minimumFare"
                                rules={[{ required: true, message: 'Tarifa mínima obrigatória' }]}
                            >
                                <InputNumber min={0} step={0.5} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Multiplicador de Surge"
                        name="surgeMultiplier"
                        rules={[{ required: true, message: 'Multiplicador obrigatório' }]}
                    >
                        <InputNumber min={1} step={0.1} />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Status obrigatório' }]}
                    >
                        <Select
                            options={[
                                { label: 'Ativo', value: 'active' },
                                { label: 'Inativo', value: 'inactive' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};