/**
 * Reports - Página de Relatórios Avançados
 * Relatórios por período, filtros avançados e exportação
 */

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    DatePicker,
    Button,
    Select,
    Space,
    Statistic,
    Table,
} from 'antd';
import {
    DownloadOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/themes/ThemeProvider';
import { formatCurrency } from '@/utils/escape';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface ReportData {
    id: string;
    date: string;
    totalRides: number;
    totalDeliveries: number;
    revenue: number;
    expenses: number;
    activeDrivers: number;
    activeOrders: number;
}

const mockReportData: ReportData[] = [
    {
        id: '1',
        date: '2024-01-20',
        totalRides: 245,
        totalDeliveries: 189,
        revenue: 8750.50,
        expenses: 2100.00,
        activeDrivers: 52,
        activeOrders: 34,
    },
    {
        id: '2',
        date: '2024-01-19',
        totalRides: 212,
        totalDeliveries: 156,
        revenue: 7620.30,
        expenses: 1950.00,
        activeDrivers: 48,
        activeOrders: 28,
    },
    {
        id: '3',
        date: '2024-01-18',
        totalRides: 298,
        totalDeliveries: 223,
        revenue: 10450.75,
        expenses: 2500.00,
        activeDrivers: 61,
        activeOrders: 42,
    },
    {
        id: '4',
        date: '2024-01-17',
        totalRides: 187,
        totalDeliveries: 132,
        revenue: 6890.00,
        expenses: 1750.00,
        activeDrivers: 44,
        activeOrders: 22,
    },
    {
        id: '5',
        date: '2024-01-16',
        totalRides: 267,
        totalDeliveries: 201,
        revenue: 9320.25,
        expenses: 2200.00,
        activeDrivers: 56,
        activeOrders: 38,
    },
];

export const Reports: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [reportType, setReportType] = useState('daily');

    const columns = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a: ReportData, b: ReportData) =>
                dayjs(b.date).unix() - dayjs(a.date).unix(),
        },
        {
            title: 'Corridas',
            dataIndex: 'totalRides',
            key: 'totalRides',
            width: 100,
            render: (value: number) => value.toLocaleString('pt-BR'),
            sorter: (a: ReportData, b: ReportData) => a.totalRides - b.totalRides,
        },
        {
            title: 'Entregas',
            dataIndex: 'totalDeliveries',
            key: 'totalDeliveries',
            width: 100,
            render: (value: number) => value.toLocaleString('pt-BR'),
            sorter: (a: ReportData, b: ReportData) => a.totalDeliveries - b.totalDeliveries,
        },
        {
            title: 'Receita',
            dataIndex: 'revenue',
            key: 'revenue',
            width: 120,
            render: (value: number) => (
                <span style={{ fontWeight: 600, color: '#10B981' }}>
          {formatCurrency(value)}
        </span>
            ),
            sorter: (a: ReportData, b: ReportData) => a.revenue - b.revenue,
        },
        {
            title: 'Despesas',
            dataIndex: 'expenses',
            key: 'expenses',
            width: 120,
            render: (value: number) => (
                <span style={{ fontWeight: 600, color: '#EF4444' }}>
          {formatCurrency(value)}
        </span>
            ),
            sorter: (a: ReportData, b: ReportData) => a.expenses - b.expenses,
        },
        {
            title: 'Lucro',
            key: 'profit',
            width: 120,
            render: (_: any, record: ReportData) => {
                const profit = record.revenue - record.expenses;
                return (
                    <span style={{ fontWeight: 600, color: '#0374C8' }}>
            {formatCurrency(profit)}
          </span>
                );
            },
            sorter: (a: ReportData, b: ReportData) =>
                a.revenue - a.expenses - (b.revenue - b.expenses),
        },
        {
            title: 'Motoristas',
            dataIndex: 'activeDrivers',
            key: 'activeDrivers',
            width: 100,
            render: (value: number) => value.toLocaleString('pt-BR'),
        },
        {
            title: 'Pedidos Ativos',
            dataIndex: 'activeOrders',
            key: 'activeOrders',
            width: 120,
            render: (value: number) => value.toLocaleString('pt-BR'),
        },
    ];

    const stats = {
        totalRevenue: mockReportData.reduce((sum, r) => sum + r.revenue, 0),
        totalExpenses: mockReportData.reduce((sum, r) => sum + r.expenses, 0),
        totalRides: mockReportData.reduce((sum, r) => sum + r.totalRides, 0),
        totalDeliveries: mockReportData.reduce((sum, r) => sum + r.totalDeliveries, 0),
    };

    return (
        <div>
            {/* Resumo */}
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
                            title="Receita Total"
                            value={stats.totalRevenue}
                            prefix="R$"
                            precision={2}
                            valueStyle={{ color: '#10B981', fontWeight: 700 }}
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
                            title="Total de Despesas"
                            value={stats.totalExpenses}
                            prefix="R$"
                            precision={2}
                            valueStyle={{ color: '#EF4444', fontWeight: 700 }}
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
                            title="Lucro Líquido"
                            value={stats.totalRevenue - stats.totalExpenses}
                            prefix="R$"
                            precision={2}
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
                            title="Total de Corridas"
                            value={stats.totalRides}
                            valueStyle={{ color: '#F7B733', fontWeight: 700 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filtros */}
            <Card
                style={{
                    marginBottom: 24,
                    borderRadius: 12,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Select
                            value={reportType}
                            onChange={setReportType}
                            options={[
                                { label: 'Diário', value: 'daily' },
                                { label: 'Semanal', value: 'weekly' },
                                { label: 'Mensal', value: 'monthly' },
                            ]}
                            size="large"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                        <DatePicker.RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            size="large"
                            style={{ width: '100%' }}
                            placeholder={['Data Início', 'Data Fim']}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Space style={{ width: '100%' }}>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="large"
                                style={{ backgroundColor: '#0374C8', borderColor: '#0374C8' }}
                            >
                                Exportar
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Tabela de Relatórios */}
            <Card
                title={
                    <span style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: isDark ? '#F9FAFB' : '#111827',
                    }}>
            Relatórios Detalhados
          </span>
                }
                style={{
                    borderRadius: 12,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
            >
                <Table
                    columns={columns}
                    dataSource={mockReportData}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                    style={{ borderRadius: 8 }}
                />
            </Card>
        </div>
    );
};