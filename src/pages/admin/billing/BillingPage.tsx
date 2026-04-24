/**
 * BillingPage - Página de gestão de ciclos de cobrança de motoristas
 * Segue a padronização das páginas drivers, rides, etc.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    Card,
    Drawer,
    Descriptions,
    Button,
    Space,
    Spin,
    Modal,
    Tag,
    Input,
    Select,
    Empty,
    Row,
    Col,
    App,
    Divider,
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    CopyOutlined,
    UnlockOutlined,
    PlayCircleOutlined,
    SettingOutlined,
    ExperimentOutlined,
} from '@ant-design/icons';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { HighlightText } from '@/components/HighlightText';
import { BookIcon } from '@/components/BookIcon';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';
import billingService, {
    BillingCycle,
    BillingCycleStatus,
    DriverBillingStatus,
} from '@/services/billingService';
import { BillingConfigModal } from './BillingConfigModal';
import { CreateTestDebtModal } from '../payments/CreateTestDebtModal';

const statusColorMap: Record<BillingCycleStatus, string> = {
    PENDING: 'default',
    PROCESSING: 'processing',
    AWAITING_PAYMENT: 'warning',
    PAID: 'success',
    PARTIALLY_PAID: 'orange',
    OVERDUE: 'error',
    GRACE_PERIOD: 'warning',
    BLOCKED: 'error',
    CANCELLED: 'default',
};

const statusLabelMap: Record<BillingCycleStatus, string> = {
    PENDING: 'Pendente',
    PROCESSING: 'Processando',
    AWAITING_PAYMENT: 'Aguardando Pagamento',
    PAID: 'Pago',
    PARTIALLY_PAID: 'Pago Parcialmente',
    OVERDUE: 'Vencido',
    GRACE_PERIOD: 'Período de Carência',
    BLOCKED: 'Bloqueado',
    CANCELLED: 'Cancelado',
};

export const BillingPage: React.FC = () => {
    const { message } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { searchQuery } = useSearch();

    // Estados
    const [cycles, setCycles] = useState<BillingCycle[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<BillingCycle | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [driverStatus, setDriverStatus] = useState<DriverBillingStatus | null>(null);
    const [loadingDriverStatus, setLoadingDriverStatus] = useState(false);
    const [configModalVisible, setConfigModalVisible] = useState(false);
    const [testDebtModalVisible, setTestDebtModalVisible] = useState(false);

    // Filtros e paginação
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<BillingCycleStatus | undefined>();
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [prevCursor, setPrevCursor] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Opções de status para filtro
    const statusOptions = Object.entries(statusLabelMap).map(([value, label]) => ({
        label,
        value: value as BillingCycleStatus,
    }));

    // Carregar ciclos
    useEffect(() => {
        loadCycles();
    }, [statusFilter, searchText]);

    const loadCycles = async (cursor?: string) => {
        setLoading(true);
        try {
            const response = await billingService.listCycles({
                status: statusFilter,
                cursor: cursor,
                limit: pageSize,
                sort: '-createdAt',
            });

            setCycles(response.items || []);
            setNextCursor(response.nextCursor || null);
            setPrevCursor(response.prevCursor || null);
        } catch (error: any) {
            console.error('Erro ao carregar ciclos:', error);
            message.error(error.message || 'Erro ao carregar ciclos de cobrança');
            setCycles([]);
        } finally {
            setLoading(false);
        }
    };

    // Carregar status do motorista ao abrir drawer
    const loadDriverStatus = async (driverId: string) => {
        setLoadingDriverStatus(true);
        try {
            const status = await billingService.getDriverStatus(driverId);
            setDriverStatus(status);
        } catch (error: any) {
            console.error('Erro ao carregar status do motorista:', error);
            message.error(error.message || 'Erro ao carregar status do motorista');
        } finally {
            setLoadingDriverStatus(false);
        }
    };

    // Filtrar ciclos localmente
    const filteredCycles = useMemo(() => {
        let filtered = cycles;

        if (searchQuery || searchText) {
            const query = (searchQuery || searchText).toLowerCase();
            filtered = filtered.filter(
                (cycle) =>
                    cycle.driverName.toLowerCase().includes(query) ||
                    cycle.id.toLowerCase().includes(query) ||
                    cycle.driverId.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [cycles, searchQuery, searchText]);

    // Handlers
    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (value: BillingCycleStatus | undefined) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (nextCursor) {
            setCurrentPage(currentPage + 1);
            loadCycles(nextCursor);
        }
    };

    const handlePrevPage = () => {
        if (prevCursor) {
            setCurrentPage(currentPage - 1);
            loadCycles(prevCursor);
        }
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        loadCycles();
    };

    const handleViewCycle = async (cycle: BillingCycle) => {
        setSelectedCycle(cycle);
        setDrawerVisible(true);
        await loadDriverStatus(cycle.driverId);
    };

    const handleUnblockDriver = async (driverId: string, driverName: string) => {
        Modal.confirm({
            title: 'Desbloquear Motorista',
            content: `Tem certeza que deseja desbloquear o motorista ${driverName}?`,
            okText: 'Desbloquear',
            cancelText: 'Cancelar',
            okButtonProps: { danger: false },
            onOk: async () => {
                try {
                    await billingService.unblockDriver(driverId);
                    message.success('Motorista desbloqueado com sucesso!');
                    if (selectedCycle) {
                        await loadDriverStatus(selectedCycle.driverId);
                    }
                    handleRefresh();
                } catch (error: any) {
                    message.error(error.message || 'Erro ao desbloquear motorista');
                }
            },
        });
    };

    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copiado!`);
    };

    // Executar jobs manualmente
    const handleRunBillingCycleJob = async () => {
        Modal.confirm({
            title: 'Executar Job de Ciclos',
            content: 'Deseja executar o job de geração de ciclos de cobrança agora?',
            okText: 'Executar',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await billingService.runBillingCycleJob();
                    message.success('Job executado com sucesso!');
                    handleRefresh();
                } catch (error: any) {
                    message.error(error.message || 'Erro ao executar job');
                }
            },
        });
    };

    const handleRunExpirationCheckJob = async () => {
        Modal.confirm({
            title: 'Executar Verificação de Expiração',
            content: 'Deseja executar a verificação de ciclos vencidos e bloqueios agora?',
            okText: 'Executar',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await billingService.runExpirationCheckJob();
                    message.success('Verificação executada com sucesso!');
                    handleRefresh();
                } catch (error: any) {
                    message.error(error.message || 'Erro ao executar verificação');
                }
            },
        });
    };

    // Colunas da tabela
    const columns = [
        {
            title: 'Motorista',
            dataIndex: 'driverName',
            key: 'driverName',
            width: 200,
            render: (text: string) => <HighlightText text={text || '-'} />,
            sorter: (a: BillingCycle, b: BillingCycle) => a.driverName.localeCompare(b.driverName),
        },
        {
            title: 'Período',
            key: 'period',
            width: 180,
            render: (_: any, record: BillingCycle) => (
                <div>
                    <div style={{ fontSize: '12px' }}>
                        {dayjs(record.periodStart).format('DD/MM/YYYY')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        até {dayjs(record.periodEnd).format('DD/MM/YYYY')}
                    </div>
                </div>
            ),
        },
        {
            title: 'Corridas',
            dataIndex: 'rideCount',
            key: 'rideCount',
            width: 100,
            align: 'center' as const,
            sorter: (a: BillingCycle, b: BillingCycle) => a.rideCount - b.rideCount,
        },
        {
            title: 'Valor Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            render: (amount: number) => formatCurrency(amount),
            sorter: (a: BillingCycle, b: BillingCycle) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Pago',
            dataIndex: 'paidAmount',
            key: 'paidAmount',
            width: 120,
            render: (amount: number) => formatCurrency(amount),
            sorter: (a: BillingCycle, b: BillingCycle) => a.paidAmount - b.paidAmount,
        },
        {
            title: 'Restante',
            dataIndex: 'remainingAmount',
            key: 'remainingAmount',
            width: 120,
            render: (amount: number) => (
                <span style={{ color: amount > 0 ? '#f5222d' : '#52c41a' }}>
                    {formatCurrency(amount)}
                </span>
            ),
            sorter: (a: BillingCycle, b: BillingCycle) => a.remainingAmount - b.remainingAmount,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (status: BillingCycleStatus) => (
                <Tag color={statusColorMap[status] || 'default'}>
                    {statusLabelMap[status] || status}
                </Tag>
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 100,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: BillingCycle) => (
                <Button
                    type="text"
                    size="small"
                    icon={<BookIcon style={{ color: '#0374C8' }} />}
                    onClick={() => handleViewCycle(record)}
                    title="Ver detalhes"
                />
            ),
        },
    ];

    return (
        <div>
            {/* Tabela de Ciclos + filtros integrados */}
            <Card
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
                styles={{ body: { padding: 16 } }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        alignItems: 'center',
                        marginBottom: 12,
                    }}
                >
                    <Input
                        placeholder="Buscar por motorista ou ID do ciclo"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                        style={{ minWidth: 240, flex: 1, borderRadius: 10, height: 40 }}
                    />
                    <Select
                        placeholder="Filtrar por status"
                        value={statusFilter || undefined}
                        onChange={handleStatusFilterChange}
                        allowClear
                        options={statusOptions}
                        style={{ minWidth: 200 }}
                    />
                    <Button
                        type="default"
                        icon={<PlayCircleOutlined />}
                        onClick={handleRunBillingCycleJob}
                        style={{ height: 40 }}
                    >
                        Gerar Ciclos
                    </Button>
                    <Button
                        type="default"
                        icon={<PlayCircleOutlined />}
                        onClick={handleRunExpirationCheckJob}
                        style={{ height: 40 }}
                    >
                        Verificar Expirações
                    </Button>
                    <Button
                        type="primary"
                        icon={<SettingOutlined />}
                        onClick={() => setConfigModalVisible(true)}
                        style={{ height: 40 }}
                    >
                        Configuração
                    </Button>
                    <Button
                        type="default"
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={loading}
                        style={{ height: 40 }}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="default"
                        icon={<ExperimentOutlined />}
                        onClick={() => setTestDebtModalVisible(true)}
                        style={{ height: 40 }}
                        danger
                    >
                        Criar Débito de Teste
                    </Button>
                </div>

                <Spin spinning={loading}>
                    <ProfessionalTable
                        columns={columns}
                        dataSource={filteredCycles}
                        rowKey="id"
                        pagination={false}
                    />
                </Spin>

                {/* Controles de Paginação */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 24px',
                        borderTop: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                        background: isDark ? '#111827' : '#F9FAFB',
                        marginTop: 8,
                    }}
                >
                    <div style={{ fontSize: 14, color: isDark ? '#D1D5DB' : '#6B7280' }}>
                        Página {currentPage}
                    </div>

                    <Space>
                        <Button onClick={handlePrevPage} disabled={!prevCursor || loading}>
                            Anterior
                        </Button>
                        <Button onClick={handleNextPage} disabled={!nextCursor || loading}>
                            Próxima
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* DRAWER DETALHES */}
            <Drawer
                title={`Detalhes do Ciclo - ${selectedCycle?.driverName || '-'}`}
                placement="right"
                onClose={() => {
                    setDrawerVisible(false);
                    setSelectedCycle(null);
                    setDriverStatus(null);
                }}
                open={drawerVisible}
                width={750}
                styles={{ body: { overflow: 'auto', padding: '24px' } }}
            >
                {selectedCycle ? (
                    <div>
                        {/* RESUMO DO CICLO */}
                        <div style={{ marginBottom: 28 }}>
                            <h4
                                style={{
                                    marginBottom: 14,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: isDark ? '#F3F4F6' : '#111827',
                                }}
                            >
                                Ciclo de Cobrança
                            </h4>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: 12,
                                    background: isDark ? '#111827' : '#F9FAFB',
                                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                    borderRadius: 12,
                                    padding: 16,
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>ID do Ciclo</span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <code style={{ fontSize: 12 }}>
                                            {selectedCycle.id.substring(0, 8)}...
                                        </code>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() =>
                                                handleCopyToClipboard(selectedCycle.id, 'ID do Ciclo')
                                            }
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Status</span>
                                    <Tag color={statusColorMap[selectedCycle.status] || 'default'}>
                                        {statusLabelMap[selectedCycle.status] || selectedCycle.status}
                                    </Tag>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Valor Total</span>
                                    <strong>{formatCurrency(selectedCycle.totalAmount)}</strong>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Valor Pago</span>
                                    <strong style={{ color: '#52c41a' }}>
                                        {formatCurrency(selectedCycle.paidAmount)}
                                    </strong>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Restante</span>
                                    <strong style={{ color: '#f5222d' }}>
                                        {formatCurrency(selectedCycle.remainingAmount)}
                                    </strong>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Corridas</span>
                                    <strong>{selectedCycle.rideCount}</strong>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                                        Preço por Corrida
                                    </span>
                                    <span>{formatCurrency(selectedCycle.pricePerRide)}</span>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        {/* DETALHES DO CICLO */}
                        <div style={{ marginBottom: 28 }}>
                            <h4
                                style={{
                                    marginBottom: 14,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: isDark ? '#F3F4F6' : '#111827',
                                }}
                            >
                                Informações do Ciclo
                            </h4>
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="ID do Motorista">
                                    <Row gutter={8}>
                                        <Col flex="auto">
                                            <code style={{ fontSize: '11px' }}>
                                                {selectedCycle.driverId}
                                            </code>
                                        </Col>
                                        <Col>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() =>
                                                    handleCopyToClipboard(
                                                        selectedCycle.driverId,
                                                        'ID do Motorista'
                                                    )
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Descriptions.Item>

                                <Descriptions.Item label="Período Início">
                                    {dayjs(selectedCycle.periodStart).format('DD/MM/YYYY HH:mm:ss')}
                                </Descriptions.Item>

                                <Descriptions.Item label="Período Fim">
                                    {dayjs(selectedCycle.periodEnd).format('DD/MM/YYYY HH:mm:ss')}
                                </Descriptions.Item>

                                {selectedCycle.pixGeneratedAt && (
                                    <Descriptions.Item label="PIX Gerado Em">
                                        {dayjs(selectedCycle.pixGeneratedAt).format(
                                            'DD/MM/YYYY HH:mm:ss'
                                        )}
                                    </Descriptions.Item>
                                )}

                                {selectedCycle.pixExpiresAt && (
                                    <Descriptions.Item label="PIX Expira Em">
                                        {dayjs(selectedCycle.pixExpiresAt).format(
                                            'DD/MM/YYYY HH:mm:ss'
                                        )}
                                    </Descriptions.Item>
                                )}

                                {selectedCycle.gracePeriodEndsAt && (
                                    <Descriptions.Item label="Carência Termina Em">
                                        {dayjs(selectedCycle.gracePeriodEndsAt).format(
                                            'DD/MM/YYYY HH:mm:ss'
                                        )}
                                    </Descriptions.Item>
                                )}

                                {selectedCycle.paidAt && (
                                    <Descriptions.Item label="Pago Em">
                                        {dayjs(selectedCycle.paidAt).format('DD/MM/YYYY HH:mm:ss')}
                                    </Descriptions.Item>
                                )}

                                {selectedCycle.blockedAt && (
                                    <Descriptions.Item label="Bloqueado Em">
                                        {dayjs(selectedCycle.blockedAt).format('DD/MM/YYYY HH:mm:ss')}
                                    </Descriptions.Item>
                                )}

                                <Descriptions.Item label="Criado Em">
                                    {dayjs(selectedCycle.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        {/* STATUS DO MOTORISTA */}
                        {driverStatus && (
                            <>
                                <Divider />
                                <div style={{ marginBottom: 28 }}>
                                    <h4
                                        style={{
                                            marginBottom: 14,
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: isDark ? '#F3F4F6' : '#111827',
                                        }}
                                    >
                                        Status do Motorista
                                    </h4>
                                    <Spin spinning={loadingDriverStatus}>
                                        <Descriptions column={1} bordered size="small">
                                            <Descriptions.Item label="Bloqueado">
                                                {driverStatus.blocked ? (
                                                    <Tag color="error">Sim</Tag>
                                                ) : (
                                                    <Tag color="success">Não</Tag>
                                                )}
                                            </Descriptions.Item>

                                            {driverStatus.blockedAt && (
                                                <Descriptions.Item label="Bloqueado Em">
                                                    {dayjs(driverStatus.blockedAt).format(
                                                        'DD/MM/YYYY HH:mm:ss'
                                                    )}
                                                </Descriptions.Item>
                                            )}

                                            {driverStatus.blockedReason && (
                                                <Descriptions.Item label="Motivo do Bloqueio">
                                                    {driverStatus.blockedReason}
                                                </Descriptions.Item>
                                            )}

                                            <Descriptions.Item label="Débito Total Pendente">
                                                <strong style={{ color: '#f5222d' }}>
                                                    {formatCurrency(driverStatus.totalPending)}
                                                </strong>
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Corridas Pendentes">
                                                {driverStatus.totalPendingRides}
                                            </Descriptions.Item>
                                        </Descriptions>

                                        {driverStatus.blocked && (
                                            <div style={{ marginTop: 16 }}>
                                                <Button
                                                    type="primary"
                                                    danger
                                                    icon={<UnlockOutlined />}
                                                    onClick={() =>
                                                        handleUnblockDriver(
                                                            selectedCycle.driverId,
                                                            selectedCycle.driverName
                                                        )
                                                    }
                                                    block
                                                >
                                                    Desbloquear Motorista
                                                </Button>
                                            </div>
                                        )}
                                    </Spin>
                                </div>
                            </>
                        )}

                        {/* BOTÕES DE AÇÃO */}
                        <Space
                            style={{
                                width: '100%',
                                justifyContent: 'flex-end',
                                marginTop: 24,
                                paddingTop: 16,
                                borderTop: isDark ? '1px solid #374151' : '1px solid #e8e8e8',
                            }}
                        >
                            <Button onClick={() => setDrawerVisible(false)}>Fechar</Button>
                        </Space>
                    </div>
                ) : (
                    <Empty description="Nenhum ciclo selecionado" />
                )}
            </Drawer>

            {/* Modal de Configuração */}
            <BillingConfigModal
                visible={configModalVisible}
                onClose={() => setConfigModalVisible(false)}
                onSuccess={() => {
                    setConfigModalVisible(false);
                    handleRefresh();
                }}
            />

            {/* Modal de Criar Débito de Teste */}
            <CreateTestDebtModal
                visible={testDebtModalVisible}
                onClose={() => setTestDebtModalVisible(false)}
                onSuccess={() => {
                    setTestDebtModalVisible(false);
                    handleRefresh();
                }}
            />
        </div>
    );
};

export default BillingPage;

