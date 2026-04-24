/**
 * ✅ QUOTA CARD COMPONENT - MELHORADO
 * Componente para exibir estatísticas de quota da API Google Maps
 * Retorna TODAS as informações da API em formato padronizado
 */

import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Empty, Spin, Table, Divider } from 'antd';
import {
    ApiOutlined,
    DollarOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    ClockCircleOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { QuotaStatistics } from '@/types/quota';
import { formatCurrency, formatPercent } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import quotaService from '@/services/quotaService';

interface QuotaCardProps {
    data? :   QuotaStatistics;
    loading?:  boolean;
    error?: string;
}

export const QuotaCard: React.FC<QuotaCardProps> = ({ data, loading = false, error }) => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    if (loading) {
        return (
            <Card
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Spin size="large" tip="Carregando dados de quota..." />
            </Card>
        );
    }

    if (error || !data) {
        return (
            <Card
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' :  '1px solid #E5E7EB',
                    background:  isDark ? '#1F2937' : '#FFFFFF',
                }}
            >
                <Empty
                    description={error || 'Falha ao carregar dados de quota'}
                    style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                />
            </Card>
        );
    }

    const remainingBudget = quotaService.getRemainingBudget(data. currentCost, data.dailyBudget);
    const isAlert = quotaService.isAlertThreshold(data.budgetUsedPercent);
    const isCritical = quotaService.isLimitReached(data.budgetUsedPercent);

    const getStatusColor = () => {
        if (isCritical) return 'red';
        if (isAlert) return 'orange';
        return 'green';
    };

    const getStatusIcon = () => {
        if (isCritical) return <ExclamationCircleOutlined />;
        if (isAlert) return <WarningOutlined />;
        return <CheckCircleOutlined />;
    };

    const getStatusLabel = () => {
        if (isCritical) return 'CRÍTICO';
        if (isAlert) return 'ALERTA';
        return 'SAUDÁVEL';
    };

    // ✅ TODOS OS DADOS DA API - Tabela de Requisições
    const requestsData = [
        {
            key: '1',
            type: 'Autocomplete',
            requests: data.autocompleteRequests,
            icon: <ApiOutlined style={{ color: '#3B82F6' }} />,
            percent: ((data.autocompleteRequests / data.totalRequests) * 100).toFixed(1),
            cost: (data.autocompleteRequests * 0.017).toFixed(2),
        },
        {
            key:  '2',
            type: 'Geocoding',
            requests: data.geocodingRequests,
            icon: <ApiOutlined style={{ color: '#8B5CF6' }} />,
            percent: ((data.geocodingRequests / data.totalRequests) * 100).toFixed(1),
            cost: (data.geocodingRequests * 0.005).toFixed(2),
        },
        {
            key:  '3',
            type: 'Reverse Geocoding',
            requests: data.reverseGeocodingRequests,
            icon: <ApiOutlined style={{ color: '#EC4899' }} />,
            percent: ((data.reverseGeocodingRequests / data. totalRequests) * 100).toFixed(1),
            cost: (data.reverseGeocodingRequests * 0.005).toFixed(2),
        },
        {
            key:  '4',
            type: 'Place Details',
            requests: data. placeDetailsRequests,
            icon: <ApiOutlined style={{ color: '#F59E0B' }} />,
            percent:  ((data.placeDetailsRequests / data.totalRequests) * 100).toFixed(1),
            cost: (data.placeDetailsRequests * 0.017).toFixed(2),
        },
    ];

    const requestColumns = [
        {
            title: 'Tipo de Requisição',
            dataIndex: 'type',
            key: 'type',
            render: (text: string, record: any) => (
                <span style={{ color: isDark ? '#F9FAFB' : '#111827', fontWeight: 500 }}>
          {record.icon} {text}
        </span>
            ),
        },
        {
            title: 'Quantidade',
            dataIndex: 'requests',
            key: 'requests',
            align: 'right' as const,
            render: (value: number) => (
                <span style={{ color: isDark ? '#F9FAFB' :  '#111827', fontWeight: 600 }}>
          {value. toLocaleString('pt-BR')}
        </span>
            ),
        },
        {
            title: 'Percentual',
            dataIndex: 'percent',
            key: 'percent',
            align: 'right' as const,
            render: (value: string) => (
                <span style={{ color: '#0EA5E9', fontWeight: 600 }}>
          {value}%
        </span>
            ),
        },
        {
            title: 'Custo Estimado',
            key: 'cost',
            align: 'right' as const,
            render: (_: any, record: any) => (
                <span style={{ color: '#10B981', fontWeight: 600 }}>
          R$ {record.  cost}
        </span>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection:  'column', gap: 16 }}>
            {/* ===== SEÇÃO 1: STATUS PRINCIPAL ===== */}
            <Card
                extra={
                    <Tag
                        icon={getStatusIcon()}
                        color={getStatusColor()}
                        style={{ fontSize: 11, padding: '6px 14px', fontWeight: 600 }}
                    >
                        {getStatusLabel()}
                    </Tag>
                }
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' :  '1px solid #E5E7EB',
                    background:  isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Row gutter={[12, 12]}>
                    {/* Data */}
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ?  '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Data</span>}
                                value={data.date}
                                prefix={<ClockCircleOutlined style={{ color: '#6B7280', marginRight: 8 }} />}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    {/* Custo Atual */}
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ?  '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Custo Atual</span>}
                                value={data.currentCost}
                                prefix={<DollarOutlined style={{ color:  getStatusColor(), marginRight: 8 }} />}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    {/* Orçamento Diário */}
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius:  12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize:  11, color: isDark ?  '#9CA3AF' : '#6B7280', fontWeight:  600 }}>Orçamento Diário</span>}
                                value={data.dailyBudget}
                                prefix={<DollarOutlined style={{ color: '#10B981', marginRight: 8 }} />}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    {/* Saldo Restante */}
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            style={{
                                borderRadius:  12,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize:  11, color: isDark ?  '#9CA3AF' : '#6B7280', fontWeight:  600 }}>Saldo Restante</span>}
                                value={remainingBudget}
                                prefix={<DollarOutlined style={{ color:  '#8B5CF6', marginRight:  8 }} />}
                                formatter={(value) => formatCurrency(Number(value))}
                                valueStyle={{ fontSize: 14, fontWeight: 700, color:  isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* ===== SEÇÃO 2: BARRA DE PROGRESSO ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>Utilização do Orçamento Diário</span>}
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' :  '1px solid #E5E7EB',
                    background:  isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Progress
                        percent={Math.min(data.budgetUsedPercent, 100)}
                        strokeColor={{
                            '0%': '#10B981',
                            '80%': '#F59E0B',
                            '100%': '#EF4444',
                        }}
                        format={() => `${formatPercent(data.budgetUsedPercent)}`}
                        status={isCritical ? 'exception' : 'normal'}
                        strokeWidth={8}
                    />
                </div>
                {isAlert && (
                    <div style={{
                        padding: '14px 16px',
                        borderRadius: 8,
                        background: isDark ? '#7F1D1D' : '#FEE2E2',
                        borderLeft: '4px solid #EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                        <ExclamationCircleOutlined style={{ color: isDark ? '#FCA5A5' : '#DC2626', fontSize: 16 }} />
                        <span style={{
                            color: isDark ? '#FCA5A5' : '#DC2626',
                            fontSize: 13,
                            fontWeight: 600,
                        }}>
              {isCritical
                  ? '⛔ Limite de quota atingido!  API será bloqueada até meia-noite.'
                  : '⚠️ Atenção: 80% do orçamento foi utilizado. '}
            </span>
                    </div>
                )}
            </Card>

            {/* ===== SEÇÃO 3: TABELA DE REQUISIÇÕES ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight:  700, color: isDark ?  '#F9FAFB' : '#111827' }}>Detalhamento de Requisições (API)</span>}
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' :  '1px solid #E5E7EB',
                    background:  isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ?  '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
                styles={{ body: { padding: 0 } }}
            >
                <Table
                    columns={requestColumns}
                    dataSource={requestsData}
                    rowKey="key"
                    pagination={false}
                    size="middle"
                    style={{ borderRadius: 12 }}
                    summary={() => {
                        const totalCost = requestsData.reduce((sum, item) => sum + parseFloat(item.cost), 0);
                        return (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}>
                                        <strong style={{ color: isDark ? '#F9FAFB' : '#111827', fontSize: 13 }}>Total</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <div style={{ textAlign: 'right' }}>
                                            <strong style={{ color: isDark ? '#F9FAFB' : '#111827', fontSize: 13 }}>
                                                {data.totalRequests.toLocaleString('pt-BR')}
                                            </strong>
                                        </div>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <div style={{ textAlign: 'right' }}>
                                            <strong style={{ color: '#0EA5E9', fontSize: 13 }}>100%</strong>
                                        </div>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>
                                        <div style={{ textAlign: 'right' }}>
                                            <strong style={{ color: '#10B981', fontSize: 13 }}>
                                                R$ {totalCost.toFixed(2)}
                                            </strong>
                                        </div>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                    );
                    }}
                />
            </Card>

            {/* ===== SEÇÃO 4: EFICIÊNCIA DE CACHE ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>Eficiência de Cache</span>}
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ?  '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ?  '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Total de Requisições</span>}
                                value={data.totalRequests}
                                formatter={(value) => value.toLocaleString('pt-BR')}
                                valueStyle={{ fontSize: 16, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ?  '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Cache Hits</span>}
                                value={data.totalCacheHits}
                                prefix={<RiseOutlined style={{ color: '#10B981', marginRight: 6 }} />}
                                formatter={(value) => value.toLocaleString('pt-BR')}
                                valueStyle={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: isDark ?  '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#111827' : '#F9FAFB',
                            }}
                            styles={{ body: { padding: '14px' } }}
                        >
                            <Statistic
                                title={<span style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600 }}>Taxa de Hit</span>}
                                value={data.cacheHitRatePercent}
                                formatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : value}%`}
                                valueStyle={{ fontSize: 16, fontWeight: 700, color: '#0EA5E9' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Divider style={{ margin: '16px 0', borderColor: isDark ? '#374151' : '#E5E7EB' }} />

                {/* Informações adicionais de Cache */}
                <Row gutter={[12, 12]}>
                    <Col xs={24}>
                        <div style={{
                            padding: '12px',
                            borderRadius: 8,
                            background: isDark ? '#111827' : '#F0F9FF',
                            border: `1px solid ${isDark ? '#374151' : '#E0F2FE'}`,
                        }}>
              <span style={{ fontSize: 12, color: isDark ? '#9CA3AF' :  '#0369A1', fontWeight: 500 }}>
                💡 Com {data.totalCacheHits. toLocaleString('pt-BR')} cache hits, você economizou aproximadamente{' '}
                  <strong>R$ {(data.totalCacheHits * 0.005).toFixed(2)}</strong> em custos de requisições.
              </span>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* ===== SEÇÃO 5: RESUMO FINANCEIRO ===== */}
            <Card
                title={<span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>Resumo Financeiro</span>}
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={6}>
                        <div style={{ textAlign: 'center', padding: '12px', borderRadius: 8, background: isDark ? '#111827' : '#F9FAFB' }}>
                            <div style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, marginBottom: 8 }}>Custo Total do Dia</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#F9FAFB' : '#111827' }}>
                                {formatCurrency(data.currentCost)}
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <div style={{ textAlign: 'center', padding: '12px', borderRadius:  8, background: isDark ?  '#111827' : '#F9FAFB' }}>
                            <div style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, marginBottom: 8 }}>Orçamento Disponível</div>
                            <div style={{ fontSize:  20, fontWeight: 700, color: '#10B981' }}>
                                {formatCurrency(remainingBudget)}
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <div style={{ textAlign:  'center', padding: '12px', borderRadius: 8, background: isDark ? '#111827' : '#F9FAFB' }}>
                            <div style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, marginBottom: 8 }}>Custo Médio/Requisição</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#0EA5E9' }}>
                                R$ {(data.currentCost / data.totalRequests).toFixed(4)}
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <div style={{ textAlign:  'center', padding: '12px', borderRadius: 8, background: isDark ? '#111827' : '#F9FAFB' }}>
                            <div style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 600, marginBottom: 8 }}>Economia com Cache</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#8B5CF6' }}>
                                {formatCurrency(data. totalCacheHits * 0.005)}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};