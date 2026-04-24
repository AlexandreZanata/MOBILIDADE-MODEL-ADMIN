/**
 * Financial - Página de relatórios financeiros
 * Relatório de corridas com ganho de R$ 1 por corrida
 * Gasto da API obtido do Controle de Quota
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Row, Col, Statistic, Tabs, Spin } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { mockFinancialReports, mockRides } from '@/mocks/data';
import { formatCurrency, escapeHtml } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import quotaService from '@/services/quotaService';
import { QuotaCard } from './components/QuotaCard';
import { FinancialReportCard } from './components/FinancialReportCard';
import { QuotaStatistics } from '@/types/quota';

const { Text } = Typography;

export const Financial: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    // Estados para quota
    const [quotaData, setQuotaData] = useState<QuotaStatistics | undefined>();
    const [quotaLoading, setQuotaLoading] = useState(true);
    const [quotaError, setQuotaError] = useState<string | undefined>();

    // Carregar dados de quota ao montar componente
    useEffect(() => {
        const loadQuotaData = async () => {
            setQuotaLoading(true);
            setQuotaError(undefined);

            const result = await quotaService.getQuotaStatistics();

            if (result.success && result.data) {
                setQuotaData(result.data);
            } else {
                setQuotaError(result. error || 'Erro ao carregar quota');
            }

            setQuotaLoading(false);
        };

        void loadQuotaData();
    }, []);

    const columns = [
        {
            title: 'Período',
            dataIndex: 'period',
            key: 'period',
            render: (period: string) => escapeHtml(period),
        },
        {
            title: 'Receita Total',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render:  (value: number) => formatCurrency(value),
            sorter: (a: any, b: any) => a.totalRevenue - b.totalRevenue,
        },
        {
            title: 'Despesas',
            dataIndex: 'totalExpenses',
            key: 'totalExpenses',
            render: (value: number) => formatCurrency(value),
            sorter: (a: any, b: any) => a.totalExpenses - b.totalExpenses,
        },
        {
            title: 'Receita Líquida',
            dataIndex:  'netRevenue',
            key: 'netRevenue',
            render: (value: number) => formatCurrency(value),
            sorter: (a: any, b: any) => a.netRevenue - b.netRevenue,
        },
        {
            title: 'Corridas',
            dataIndex: 'ridesCount',
            key: 'ridesCount',
            render: (value: number) => value.toLocaleString('pt-BR'),
            sorter: (a: any, b:  any) => a.ridesCount - b.ridesCount,
        },
        {
            title: 'Entregas',
            dataIndex: 'deliveriesCount',
            key: 'deliveriesCount',
            render: (value: number) => value.toLocaleString('pt-BR'),
            sorter: (a: any, b: any) => a.deliveriesCount - b.deliveriesCount,
        },
        {
            title: 'Ticket Médio',
            dataIndex: 'averageTicket',
            key: 'averageTicket',
            render:  (value: number) => formatCurrency(value),
            sorter: (a: any, b:  any) => a.averageTicket - b.averageTicket,
        },
    ];

    // Calcular totais
    const totals = mockFinancialReports.reduce(
        (acc, report) => ({
            totalRevenue: acc.totalRevenue + report.totalRevenue,
            totalExpenses: acc.totalExpenses + report.totalExpenses,
            netRevenue: acc.netRevenue + report.netRevenue,
            ridesCount: acc.ridesCount + report.ridesCount,
            deliveriesCount: acc.deliveriesCount + report.deliveriesCount,
        }),
        { totalRevenue:  0, totalExpenses: 0, netRevenue: 0, ridesCount: 0, deliveriesCount: 0 }
    );

    const averageTicket = totals.totalRevenue / (totals.ridesCount + totals.deliveriesCount);

    const tabItems = [
        {
            key: 'report',
            label: 'Relatório de Corridas',
            children: (
                <FinancialReportCard
                    rides={mockRides as any}
                    apiQuotaCost={quotaData?.currentCost || 0}
                    loading={quotaLoading}
                    error={quotaError}
                />
            ),
        },
        {
            key: 'financial',
            label: 'Histórico',
            children: (
                <>
                    {/* Resumo Financeiro */}
                    <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                        <Col xs={12} sm={6}>
                            <Card
                                style={{
                                    borderRadius: 12,
                                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                    background: isDark ? '#1F2937' : '#FFFFFF',
                                }}
                                styles={{ body: { padding: '16px 12px' } }}
                            >
                                <Statistic
                                    title={<Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280' }}>Receita Total</Text>}
                                    value={totals.totalRevenue}
                                    prefix={<DollarOutlined style={{ color: '#0374C8', fontSize: 16 }} />}
                                    formatter={(value) => formatCurrency(Number(value))}
                                    valueStyle={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color:  isDark ? '#F9FAFB' : '#111827',
                                        lineHeight: 1.2,
                                        wordBreak: 'break-word',
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card
                                style={{
                                    borderRadius: 12,
                                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                    background: isDark ? '#1F2937' : '#FFFFFF',
                                }}
                                styles={{ body: { padding: '16px 12px' } }}
                            >
                                <Statistic
                                    title={<Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280' }}>Despesas</Text>}
                                    value={totals.totalExpenses}
                                    prefix={<DollarOutlined style={{ color:  '#EF4444', fontSize: 16 }} />}
                                    formatter={(value) => formatCurrency(Number(value))}
                                    valueStyle={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: isDark ? '#F9FAFB' :  '#111827',
                                        lineHeight: 1.2,
                                        wordBreak: 'break-word',
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card
                                style={{
                                    borderRadius:  12,
                                    border:  isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                    background: isDark ?  '#1F2937' : '#FFFFFF',
                                }}
                                styles={{ body: { padding: '16px 12px' } }}
                            >
                                <Statistic
                                    title={<Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280' }}>Receita Líquida</Text>}
                                    value={totals.netRevenue}
                                    prefix={<DollarOutlined style={{ color: '#10B981', fontSize: 16 }} />}
                                    valueStyle={{
                                        color: '#10B981',
                                        fontSize: 20,
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                        wordBreak:  'break-word',
                                    }}
                                    formatter={(value) => formatCurrency(Number(value))}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card
                                style={{
                                    borderRadius:  12,
                                    border:  isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                    background: isDark ?  '#1F2937' : '#FFFFFF',
                                }}
                                styles={{ body: { padding: '16px 12px' } }}
                            >
                                <Statistic
                                    title={<Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280' }}>Ticket Médio</Text>}
                                    value={averageTicket}
                                    prefix={<DollarOutlined style={{ color:  '#0374C8', fontSize:  16 }} />}
                                    formatter={(value) => formatCurrency(Number(value))}
                                    valueStyle={{
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: isDark ? '#F9FAFB' : '#111827',
                                        lineHeight: 1.2,
                                        wordBreak:  'break-word',
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Tabela de Relatórios */}
                    <Card
                        title={
                            <span style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: isDark ? '#F9FAFB' : '#111827',
                            }}>
                Histórico de Períodos
              </span>
                        }
                        style={{
                            borderRadius: 16,
                            border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                        }}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table
                            columns={columns}
                            dataSource={mockFinancialReports}
                            rowKey="period"
                            pagination={false}
                            summary={() => {
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0}>
                                                <strong>Total</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <strong>{formatCurrency(totals.totalRevenue)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <strong>{formatCurrency(totals.totalExpenses)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={3}>
                                                <strong>{formatCurrency(totals.netRevenue)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}>
                                                <strong>{totals.ridesCount.toLocaleString('pt-BR')}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}>
                                                <strong>{totals.deliveriesCount.toLocaleString('pt-BR')}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={6}>
                                                <strong>{formatCurrency(averageTicket)}</strong>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Card>
                </>
            ),
        },
        {
            key: 'quota',
            label: 'Controle de Quota',
            children: (
                <>
                    {quotaLoading ? (
                        <Card style={{
                            borderRadius: 16,
                            border: isDark ?  '1px solid #374151' : '1px solid #E5E7EB',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            minHeight: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Spin size="large" tip="Carregando dados de quota..." />
                        </Card>
                    ) : (
                        <QuotaCard
                            data={quotaData}
                            loading={false}
                            error={quotaError}
                        />
                    )}
                </>
            ),
        },
    ];

    return (
        <div>
            <Tabs
                items={tabItems}
                defaultActiveKey="report"
            />
        </div>
    );
};