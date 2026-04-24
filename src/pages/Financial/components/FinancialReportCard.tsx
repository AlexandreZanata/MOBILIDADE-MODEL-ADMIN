/**
 * ✅ FINANCIAL REPORT CARD - PADRONIZADO
 * Relatório de corridas: Ganho R$ 1 por corrida
 * Gasto: Custo da API de quota
 * Cores VAMU: Azul #0374C8 e Amarelo #F7B733
 */

import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Progress, Divider, Table, Tag, Empty, Spin } from 'antd';
import {
    DollarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CarOutlined,
    LineChartOutlined,
    CheckCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Ride } from '@/types/ride';
import { formatCurrency } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import financialReportService from '@/services/financialReportService';

interface FinancialReportCardProps {
    rides?: Ride[];
    apiQuotaCost?: number;
    loading?: boolean;
    error?: string;
}

// Cores VAMU padronizadas
const VAMU_COLORS = {
    primary: '#0374C8',    // Azul VAMU
    secondary: '#F7B733',  // Amarelo VAMU
    success: '#10B981',    // Verde
    error: '#EF4444',      // Vermelho
    info: '#3B82F6',       // Azul info
    warning: '#F59E0B',    // Laranja warning
};

export const FinancialReportCard: React.FC<FinancialReportCardProps> = ({
                                                                            rides = [],
                                                                            apiQuotaCost = 0,
                                                                            loading = false,
                                                                            error,
                                                                        }) => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    // Calcular relatório financeiro
    const report = useMemo(() => {
        return financialReportService.generateFinancialReport(
            rides.map(r => ({
                id: r.id,
                status: r.status,
                fare: (r as any).fare || (r as any).finalPrice || 0,
            })),
            apiQuotaCost
        );
    }, [rides, apiQuotaCost]);

    if (loading) {
        return (
            <Card style={{
                borderRadius: 16,
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                background: isDark ? '#1F2937' : '#FFFFFF',
            }}>
                <Spin size="large" tip="Carregando relatório financeiro..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Card style={{
                borderRadius: 16,
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                background: isDark ? '#1F2937' : '#FFFFFF',
            }}>
                <Empty description={error} />
            </Card>
        );
    }

    const profitMarginColor = financialReportService.getProfitMarginColor(report.profitMargin);
    const isHealthy = report.profitMargin >= 40;

    // Dados para tabela de resumo
    const summaryData = [
        {
            key: '1',
            metric: 'Total de Corridas Completadas',
            value: report.totalRidesCompleted,
            unit: 'corridas',
        },
        {
            key: '2',
            metric: 'Ganho por Corrida',
            value: report.gainPerRide,
            unit: 'R$',
        },
        {
            key: '3',
            metric: 'Ganho Bruto Total',
            value: report.totalGainBruto,
            unit: 'R$',
        },
        {
            key: '4',
                    metric: 'Custo da API',
                    value: report.apiQuotaCost,
                    unit: 'R$',
        },
        {
            key: '5',
            metric: 'Lucro Líquido',
            value: report.totalLiquidProfit,
            unit: 'R$',
        },
    ];

    const summaryColumns = [
        {
            title: 'Métrica',
            dataIndex: 'metric',
            key: 'metric',
            width: '50%',
            render: (text: string) => (
                <span style={{ color: isDark ? '#F9FAFB' : '#111827', fontWeight: 500, fontSize: 13 }}>
          {text}
        </span>
            ),
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            width: '30%',
            align: 'right' as const,
            render: (value: number, record: any) => {
                let color = isDark ? '#F9FAFB' : '#111827';
                if (record.unit === 'R$') {
                    if (record.metric.includes('Ganho')) color = VAMU_COLORS.success;
                    if (record.metric.includes('Custo')) color = VAMU_COLORS.error;
                    if (record.metric.includes('Lucro')) color = VAMU_COLORS.info;
                }
                const formatted = record.unit === 'R$' ? formatCurrency(value) : value.toLocaleString('pt-BR');
                return (
                    <span style={{ color, fontWeight: 600, fontSize: 13 }}>
            {formatted}
          </span>
                );
            },
        },
        {
            title: 'Unidade',
            dataIndex: 'unit',
            key: 'unit',
            width: '20%',
            align: 'center' as const,
            render: (text: string) => (
                <span style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12, fontWeight: 500 }}>
          {text}
        </span>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* ===== SEÇÃO 1: VISÃO GERAL EXECUTIVA ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>Visão Geral Executiva</span>}
                extra={
                    <Tag
                        icon={isHealthy ? <CheckCircleOutlined /> : <WarningOutlined />}
                        color={isHealthy ?  VAMU_COLORS.success :  VAMU_COLORS.warning}
                        style={{ fontSize: 11, padding: '6px 14px', fontWeight: 600 }}
                    >
                        {isHealthy ? 'SAUDÁVEL' : 'ATENÇÃO'}
                    </Tag>
                }
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Row gutter={[12, 12]}>
                    {/* Ganho Bruto */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Ganho Bruto Total</span>}
                                value={report.totalGainBruto}
                                prefix={<DollarOutlined style={{ color:  VAMU_COLORS.success, marginRight: 6 }} />}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 16, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    {/* Custo da API */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Gasto da API</span>}
                                value={report.apiQuotaCost}
                                prefix={<ArrowDownOutlined style={{ color: VAMU_COLORS.error, marginRight: 6 }} />}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 16, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    {/* Lucro Líquido */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Lucro Líquido</span>}
                                value={report.totalLiquidProfit}
                                prefix={<ArrowUpOutlined style={{ color: VAMU_COLORS.info, marginRight: 6 }} />}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 16, fontWeight: 700, color: VAMU_COLORS.info }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* ===== SEÇÃO 2: DETALHAMENTO DE CORRIDAS ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>Métricas de Corridas</span>}
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Row gutter={[12, 12]}>
                    {/* Total de Corridas */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Total de Corridas</span>}
                                value={report.totalRidesCompleted}
                                prefix={<CarOutlined style={{ color: VAMU_COLORS.info, marginRight: 6 }} />}
                                formatter={(value) => value.toLocaleString('pt-BR')}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    {/* Ganho por Corrida */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Ganho por Corrida</span>}
                                value={report.gainPerRide}
                                prefix={<DollarOutlined style={{ color:  VAMU_COLORS.success, marginRight: 6 }} />}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    {/* Margem de Lucro */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body:  { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Margem de Lucro</span>}
                                value={report.profitMargin}
                                prefix={<LineChartOutlined style={{ color: profitMarginColor, marginRight: 6 }} />}
                                formatter={(value) => `${typeof value === 'number' ? value.toFixed(2) : value}%`}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: profitMarginColor }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* ===== SEÇÃO 3: TABELA DE RESUMO ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>Resumo Financeiro</span>}
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
                styles={{ body: { padding: 0 } }}
            >
                <Table
                    columns={summaryColumns}
                    dataSource={summaryData}
                    rowKey="key"
                    pagination={false}
                    size="middle"
                />
            </Card>

            {/* ===== SEÇÃO 4: PROJEÇÕES MENSAIS ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>Projeções Mensais</span>}
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background:  isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ?  '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Ganho Diário (Est.)</span>}
                                value={report.estimatedDailyGain}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: VAMU_COLORS.success }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ?  '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Gasto Mensal (Est.)</span>}
                                value={report.estimatedMonthlyCost}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: VAMU_COLORS.error }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body:  { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Lucro Mensal (Est.)</span>}
                                value={report.estimatedMonthlyProfit}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: VAMU_COLORS.success }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>ROI Mensal</span>}
                                value={(report.estimatedMonthlyProfit / (report.estimatedMonthlyCost || 1) * 100)}
                                formatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : value}%`}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: profitMarginColor }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Divider style={{ margin: '16px 0', borderColor: isDark ? '#374151' : '#E5E7EB' }} />

                {/* Barra de proporção Ganho vs Gasto */}
                <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#9CA3AF' : '#6B7280', marginBottom: 12 }}>
                        Proporção Ganho vs Gasto
                    </div>
                    <Progress
                        percent={100}
                        strokeColor={{
                            '0%': VAMU_COLORS.success,
                            '100%': VAMU_COLORS.error,
                        }}
                        format={() => '100%'}
                    />
                    <div style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 12, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <span>Ganho:  <strong style={{ color: VAMU_COLORS.success }}>{((report.totalGainBruto / (report.totalGainBruto + report.apiQuotaCost || 1)) * 100).toFixed(1)}%</strong></span>
                        <span>Gasto: <strong style={{ color: VAMU_COLORS.error }}>{((report.apiQuotaCost / (report.totalGainBruto + report.apiQuotaCost || 1)) * 100).toFixed(1)}%</strong></span>
                    </div>
                </div>
            </Card>
        </div>
    );
};