import React, { useState, useMemo, useEffect } from 'react';
import {
    Card,
    Drawer,
    Descriptions,
    Button,
    Space,
    Spin,
    Modal,
    App,
    Input,
    Select,
    Row,
    Col,
    Empty,
    Divider,
    Tag,
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    EditOutlined,
    CloseOutlined,
    CopyOutlined,
} from '@ant-design/icons';
import { BookIcon } from '@/components/BookIcon';
import { BadgeStatus } from '@/components/BadgeStatus';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { HighlightText } from '@/components/HighlightText';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';
import { tripsService, type Trip, type TripStatus } from '@/services/tripsService';
import { paymentService, type PaymentMethod, type CardBrand } from '@/services/paymentService';
import { serviceCategoryService } from '@/services/serviceCategoryService';
import { type ServiceCategory } from '@/types/payment';

export const Rides: React.FC = () => {
    const { message, modal } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { searchQuery } = useSearch();

    // Estados
    const [selectedRide, setSelectedRide] = useState<Trip | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [rides, setRides] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [prevCursor, setPrevCursor] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    // Filtros
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<TripStatus | undefined>();
    const [sortOrder, setSortOrder] = useState('-requestedAt');

    // Estados para modal de atualizar status
    const [statusLoading, setStatusLoading] = useState(false);
    const [selectedNewStatus, setSelectedNewStatus] = useState<TripStatus | null>(null);

    // Estados para métodos de pagamento dinâmicos
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [paymentBrands, setPaymentBrands] = useState<CardBrand[]>([]);
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);

    const rideStatuses = [
        { label: 'Solicitada', value: 'REQUESTED' },
        { label: 'Motorista Atribuído', value: 'DRIVER_ASSIGNED' },
        { label: 'Motorista Chegando', value: 'DRIVER_ARRIVING' },
        { label: 'Motorista Chegou', value: 'DRIVER_ARRIVED' },
        { label: 'Em Andamento', value: 'IN_PROGRESS' },
        { label: 'Aguardando Destino', value: 'WAITING_AT_DESTINATION' },
        { label: 'Concluída', value: 'COMPLETED' },
        { label: 'CANCELADA', value: 'CANCELED_BY_RIDER' },
        { label: 'CANCELADA', value: 'CANCELED_BY_DRIVER' },
        { label: 'CANCELADA', value: 'CANCELADA_MOTORISTA' },
        { label: 'CANCELADA', value: 'CANCELADA_PASSAGEIRO' },
        { label: 'Motorista Aceitou', value: 'MOTORISTA_ACEITOU' },
        { label: 'Motorista Chegando', value: 'MOTORISTA_CHEGANDO' },
        { label: 'Motorista Chegou', value: 'MOTORISTA_CHEGOU' },
        { label: 'Em Progresso', value: 'EM_PROGRESSO' },
        { label: 'Aguardando Destino', value: 'AGUARDANDO_DESTINO' },
        { label: 'Não Compareceu', value: 'NO_SHOW' },
        { label: 'Expirada', value: 'EXPIRED' },
    ];

    const cancellableStatuses = [
        'REQUESTED',
        'DRIVER_ASSIGNED',
        'DRIVER_ARRIVING',
        'DRIVER_ARRIVED',
        'IN_PROGRESS',
        'WAITING_AT_DESTINATION',
        'MOTORISTA_ACEITOU',
        'MOTORISTA_CHEGANDO',
        'MOTORISTA_CHEGOU',
        'EM_PROGRESSO',
        'AGUARDANDO_DESTINO',
        'SOLICITADA'
    ];

    // Carregar métodos, bandeiras e categorias ao iniciar
    useEffect(() => {
        loadPaymentMethods();
        loadPaymentBrands();
        loadServiceCategories();
    }, []);

    const loadPaymentMethods = async () => {
        setPaymentMethodsLoading(true);
        try {
            const methods = await paymentService.getAllPaymentMethods();
            setPaymentMethods(methods);
            console.log('Métodos de pagamento carregados:', methods);
        } catch (error) {
            console.error('Erro ao carregar métodos:', error);
            setPaymentMethods([]);
        } finally {
            setPaymentMethodsLoading(false);
        }
    };

    const loadPaymentBrands = async () => {
        try {
            const brands = await paymentService.getCardBrands();
            setPaymentBrands(brands || []);
        } catch (error) {
            console.error('Erro ao carregar bandeiras:', error);
            setPaymentBrands([]);
        }
    };

    const loadServiceCategories = async () => {
        try {
            const response = await serviceCategoryService.list({ limit: 200, sort: 'name' });
            setServiceCategories(response?.items || []);
        } catch (error) {
            console.error('Erro ao carregar categorias de serviço:', error);
            setServiceCategories([]);
        }
    };

    // Carregar corridas
    useEffect(() => {
        loadRides(undefined);
    }, [statusFilter, sortOrder, searchText]);

    const loadRides = async (cursor?: string) => {
        setLoading(true);
        try {
            const response = await tripsService.getAdminTrips({
                cursor: cursor,
                limit: pageSize,
                sort: sortOrder,
                q: searchText || undefined,
                status: statusFilter,
            });

            console.log('Resposta da API:', response);

            if (response.success && response.data) {
                setRides(response.data.items || []);
                setNextCursor(response.data.nextCursor);
                setPrevCursor(response.data.prevCursor);

                if (response.data.items.length > 0) {
                    response.data.items.forEach(ride => {
                        console.log(`Corrida ${ride.id}: status = "${ride.status}"`);
                    });
                }
            } else {
                console.error('Erro na resposta:', response.message);
                setRides([]);
                message.error(response.message || 'Erro ao carregar corridas');
            }
        } catch (error) {
            console.error('Erro ao carregar corridas:', error);
            message.error('Erro ao carregar corridas');
            setRides([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar por busca local
    const filteredRides = useMemo(() => {
        if (!searchQuery) return rides;

        return rides.filter(ride =>
            ride.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.passenger?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.driver?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    }, [searchQuery, rides]);

    // Obter nome do método de pagamento
    const getPaymentMethodName = (id?: string) => {
        if (!id) return '-';
        const method = paymentMethods.find((m) => m.id === id);
        return method?.name || '-';
    };

    const getPaymentBrandName = (id?: string) => {
        if (!id) return '-';
        const brand = paymentBrands.find((b) => b.id === id);
        return brand?.name || '-';
    };

    const getServiceCategoryName = (id?: string) => {
        if (!id) return '-';
        const category = serviceCategories.find((c) => c.id === id);
        return category?.name || '-';
    };

    // Handlers
    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (value: TripStatus | undefined) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleSortChange = (value: string) => {
        setSortOrder(value);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (nextCursor) {
            setCurrentPage(currentPage + 1);
            loadRides(nextCursor);
        }
    };

    const handlePrevPage = () => {
        if (prevCursor) {
            setCurrentPage(currentPage - 1);
            loadRides(prevCursor);
        }
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        loadRides();
    };

    const handleOpenStatusModal = (ride: Trip) => {
        setSelectedRide(ride);
        setSelectedNewStatus(ride.status);
        setStatusModalVisible(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedRide || !selectedNewStatus) return;

        setStatusLoading(true);
        try {
            const response = await tripsService.updateAdminTripStatus(
                selectedRide.id,
                selectedNewStatus
            );

            if (response.success) {
                message.success({
                    content: (
                        <div>
                            <p>Status atualizado com sucesso!</p>
                            <p style={{ fontSize: '12px', marginTop: '8px' }}>
                                Novo status: {rideStatuses.find(s => s.value === selectedNewStatus)?.label || selectedNewStatus}
                            </p>
                        </div>
                    ),
                    duration: 3,
                });
                setStatusModalVisible(false);
                handleRefresh();
            } else {
                message.error(response.message || 'Erro ao atualizar status');
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            message.error('Erro ao atualizar status');
        } finally {
            setStatusLoading(false);
        }
    };

    const handleCancelRide = async (rideId: string) => {
        modal.confirm({
            title: 'Cancelar Corrida',
            content: (
                <div>
                    <p>Tem certeza que deseja cancelar esta corrida?</p>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                        Esta ação não pode ser desfeita.
                    </p>
                </div>
            ),
            okText: 'Sim, Cancelar',
            cancelText: 'Não, Voltar',
            okButtonProps: { danger: true },
            cancelButtonProps: { type: 'default' },
            onOk: async () => {
                setCancelLoading(true);
                try {
                    const response = await tripsService.cancelAdminTrip(
                        rideId,
                        'Cancelada pelo administrador'
                    );

                    if (response.success) {
                        message.success({
                            content: (
                                <div>
                                    <p>Corrida cancelada com sucesso!</p>
                                    <p style={{ fontSize: '12px', marginTop: '8px' }}>
                                        Motivo: {response.  data.  cancellationReason}
                                    </p>
                                    <p style={{ fontSize: '12px' }}>
                                        Cancelada em: {dayjs(response.data.cancelledAt).format('DD/MM/YYYY HH:mm:ss')}
                                    </p>
                                    <p style={{ fontSize: '12px' }}>
                                        Taxa: R$ {response.data.cancellationFee.toFixed(2)}
                                    </p>
                                </div>
                            ),
                            duration: 5,
                        });

                        setDrawerVisible(false);
                        setTimeout(() => handleRefresh(), 500);
                    } else {
                        message.error(response.message || 'Erro ao cancelar corrida');
                    }
                } catch (error: any) {
                    console.error('Erro ao cancelar:', error);
                    message.error('Erro ao cancelar corrida');
                } finally {
                    setCancelLoading(false);
                }
            },
        });
    };

    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copiado!`);
    };

    // Colunas da tabela
    const columns = [
        {
            title: 'Passageiro',
            dataIndex: ['passenger', 'name'],
            key: 'passenger',
            width: 160,
            render: (text: string) => <HighlightText text={text || '-'} />,
        },
        {
            title: 'Motorista',
            key: 'driver',
            width: 160,
            render: (_: any, record: Trip) => (
                <HighlightText text={record.driver?.name || '-'} />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: TripStatus) => <BadgeStatus status={status as any} />,
        },
        {
            title: 'Preço',
            dataIndex: 'estimatedPrice',
            key: 'estimatedPrice',
            width: 100,
            render: (price: number | undefined) =>
                formatCurrency(price || 0),
            sorter: (a: Trip, b: Trip) =>
                (a.estimatedPrice || 0) - (b.estimatedPrice || 0),
        },
        {
            title: 'Data',
            dataIndex: 'requestedAt',
            key: 'requestedAt',
            width: 150,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a: Trip, b: Trip) =>
                dayjs(a.requestedAt).unix() - dayjs(b.requestedAt).unix(),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 140,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: Trip) => {
                const canCancel = cancellableStatuses.includes(record.status);
        return (
            <Space size="small">
                <Button
                    type="text"
                    size="small"
                    onClick={() => {
                        setSelectedRide(record);
                        setDrawerVisible(true);
                    }}
                    title="Ver detalhes"
                    style={{ padding: '4px 8px' }}
                >
                    <BookIcon style={{ color: '#0374C8' }} />
                </Button>

                <Button
                    type="text"
                    size="small"
                    title="Atualizar status"
                    icon={<EditOutlined />}
                    onClick={() => handleOpenStatusModal(record)}
                    style={{ color: '#F7B733' }}
                    disabled={!canCancel}
                />
            </Space>
        );
            },
        },
    ];

    return (
        <div>
            {/* Tabela de Corridas + filtros integrados */}
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
                        placeholder="Buscar corrida por ID, passageiro ou motorista"
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
                        options={rideStatuses}
                        style={{ minWidth: 200 }}
                    />
                    <Select
                        placeholder="Ordenar por"
                        value={sortOrder}
                        onChange={handleSortChange}
                        options={[
                            { label: 'Mais recentes', value: '-requestedAt' },
                            { label: 'Mais antigas', value: 'requestedAt' },
                            { label: 'Maior preço', value: '-estimatedPrice' },
                            { label: 'Menor preço', value: 'estimatedPrice' },
                        ]}
                        style={{ minWidth: 180 }}
                    />
                    <Button
                        type="default"
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={loading}
                        style={{ height: 40 }}
                    >
                        Atualizar
                    </Button>
                </div>

                <Spin spinning={loading}>
                    <ProfessionalTable
                        columns={columns}
                        dataSource={filteredRides}
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
                        <Button
                            onClick={handlePrevPage}
                            disabled={!prevCursor || loading}
                        >
                            Anterior
                        </Button>
                        <Button
                            onClick={handleNextPage}
                            disabled={!nextCursor || loading}
                        >
                            Próxima
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* DRAWER DETALHES */}
            <Drawer
                title="Detalhes da Corrida"
                placement="right"
                onClose={() => {
                    setDrawerVisible(false);
                    setSelectedRide(null);
                }}
                open={drawerVisible}
                width={750}
                styles={{ body: { overflow: 'auto', padding: '24px' } }}
            >
                {selectedRide ?     (
                    <div>
                        {/* RESUMO DA CORRIDA */}
                        <div style={{ marginBottom: 28 }}>
                            <h4 style={{ marginBottom: 14, fontSize: 14, fontWeight: 700, color: isDark ? '#F3F4F6' : '#111827' }}>
                                Corrida
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
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>ID</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <code style={{ fontSize: 12 }}>{selectedRide.id}</code>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => handleCopyToClipboard(selectedRide.id, 'ID Corrida')}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Status</span>
                                    <BadgeStatus status={selectedRide.status as any} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Preço Estimado</span>
                                    <strong>{formatCurrency(selectedRide.estimatedPrice || 0)}</strong>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Preço Final</span>
                                    {selectedRide.finalPrice !== null ? (
                                        <strong>{formatCurrency(selectedRide.finalPrice)}</strong>
                                    ) : (
                                        <span style={{ color: '#999' }}>Pendente</span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Distância</span>
                                    <span>{selectedRide.distanceKm ? `${selectedRide.distanceKm.toFixed(2)} km` : '-'}</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Duração</span>
                                    <span>{selectedRide.durationMinutes ? `${selectedRide.durationMinutes} min` : '-'}</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>Surge</span>
                                    <span>{selectedRide.surge ? `${selectedRide.surge.toFixed(2)}x` : '1.00x'}</span>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        {/* SEÇÃO: PASSAGEIRO */}
                        <div style={{ marginBottom: 28 }}>
                            <h4 style={{ marginBottom: 14, fontSize: 14, fontWeight: 700, color: isDark ? '#F3F4F6' : '#111827' }}>
                                Passageiro
                            </h4>
                            <Descriptions column={2} bordered size="small">
                                <Descriptions.Item label="ID" span={2}>
                                    <Row gutter={8}>
                                        <Col flex="auto">
                                            <code style={{ fontSize: '11px' }}>{selectedRide.passengerId}</code>
                                        </Col>
                                        <Col>
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopyToClipboard(selectedRide.passengerId, 'ID Passageiro')}
                                            />
                                        </Col>
                                    </Row>
                                </Descriptions.Item>

                                <Descriptions.Item label="Nome" span={1}>
                                    <strong>{selectedRide.passenger?.name || '-'}</strong>
                                </Descriptions.Item>

                                <Descriptions.Item label="Avaliação" span={1}>
                                    {selectedRide.passenger?.rating ? (
                                        <span>{selectedRide.passenger.rating.toFixed(2)} ⭐</span>
                                    ) : (
                                        '-'
                                    )}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        <Divider />

                        {/* SEÇÃO: MOTORISTA */}
                        <div style={{ marginBottom: 28 }}>
                            <h4 style={{ marginBottom: 14, fontSize: 14, fontWeight: 700, color: isDark ? '#F3F4F6' : '#111827' }}>
                                Motorista
                            </h4>
                            {selectedRide.driver ? (
                                <Descriptions column={2} bordered size="small">
                                    <Descriptions.Item label="ID" span={2}>
                                        <Row gutter={8}>
                                            <Col flex="auto">
                                                <code style={{ fontSize: '11px' }}>{selectedRide.  driverId}</code>
                                            </Col>
                                            <Col>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => handleCopyToClipboard(selectedRide.driverId || '', 'ID Motorista')}
                                                />
                                            </Col>
                                        </Row>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Nome" span={1}>
                                        <strong>{selectedRide.driver.name}</strong>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Avaliação" span={1}>
                                        {selectedRide.driver.rating.toFixed(2)} ⭐
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Marca" span={1}>
                                        {selectedRide.driver.  vehicle?. brand || '-'}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Modelo" span={1}>
                                        {selectedRide.driver.vehicle?.model || '-'}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Cor" span={1}>
                                        {selectedRide.driver.vehicle?.color || '-'}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Placa" span={1}>
                                        <Tag color="cyan">{selectedRide.driver.vehicle?.licensePlate || '-'}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            ) : (
                                <div style={{ padding: '12px', background: isDark ? '#374151' : '#f0f0f0', borderRadius: 4 }}>
                                    <span style={{ color: '#999' }}>Motorista não atribuído</span>
                                </div>
                            )}
                        </div>

                        <Divider />

                        {/* SEÇÃO: LOCALIZAÇÃO */}
                        <div style={{ marginBottom: 28 }}>
                            <h4 style={{ marginBottom: 14, fontSize: 14, fontWeight: 700, color: isDark ?  '#F3F4F6' : '#111827' }}>
                                Localização
                            </h4>
                            <Descriptions column={2} bordered size="small">
                                <Descriptions.Item label="Origem (Lat)" span={1}>
                                    <code style={{ fontSize: '11px' }}>{selectedRide.origin?.lat?.toFixed(6) || '-'}</code>
                                </Descriptions.Item>

                                <Descriptions.Item label="Origem (Lng)" span={1}>
                                    <code style={{ fontSize: '11px' }}>{selectedRide.origin?.lng?.toFixed(6) || '-'}</code>
                                </Descriptions.Item>

                                <Descriptions.Item label="Destino (Lat)" span={1}>
                                    <code style={{ fontSize: '11px' }}>{selectedRide.destination?.lat?.toFixed(6) || '-'}</code>
                                </Descriptions.Item>

                                <Descriptions.Item label="Destino (Lng)" span={1}>
                                    <code style={{ fontSize: '11px' }}>{selectedRide.destination?.lng?.toFixed(6) || '-'}</code>
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        <Divider />

                        {/* SEÇÃO: PAGAMENTO */}
                        <div style={{ marginBottom: 28 }}>
                            <h4 style={{ marginBottom: 14, fontSize: 14, fontWeight: 700, color: isDark ?  '#F3F4F6' : '#111827' }}>
                                Pagamento
                            </h4>
                            <Spin spinning={paymentMethodsLoading}>
                                <Descriptions column={2} bordered size="small">
                                    <Descriptions.Item label="Método" span={2}>
                                        <Tag color="blue">{getPaymentMethodName(selectedRide.paymentMethodId)}</Tag>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Bandeira" span={2}>
                                        <Tag color="orange">{getPaymentBrandName(selectedRide.cardBrandId)}</Tag>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Categoria" span={2}>
                                        <Tag>{getServiceCategoryName(selectedRide.serviceCategoryId)}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Spin>
                        </div>

                        <Divider />

                        {/* SEÇÃO: DATAS */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ marginBottom: 14, fontSize: 14, fontWeight: 700, color: isDark ? '#F3F4F6' : '#111827' }}>
                                Datas e Horários
                            </h4>
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="Solicitada">
                                    {dayjs(selectedRide.requestedAt).format('DD/MM/YYYY HH:mm:ss')}
                                </Descriptions.Item>

                                <Descriptions.Item label="Criada">
                                    {dayjs(selectedRide.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: isDark ? '1px solid #374151' : '1px solid #e8e8e8' }}>
                            {cancellableStatuses.includes(selectedRide.status) && (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => handleOpenStatusModal(selectedRide)}
                                    >
                                        Atualizar Status
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => handleCancelRide(selectedRide.id)}
                                        loading={cancelLoading}
                                    >
                                        Cancelar
                                    </Button>
                                </>
                            )}
                            <Button onClick={() => setDrawerVisible(false)}>Fechar</Button>
                        </Space>
                    </div>
                ) : (
                    <Empty description="Nenhuma corrida selecionada" />
                )}
            </Drawer>

            {/* Modal de Atualizar Status */}
            <Modal
                title="Atualizar Status da Corrida"
                open={statusModalVisible}
                onOk={handleUpdateStatus}
                onCancel={() => setStatusModalVisible(false)}
                okText="Atualizar"
                cancelText="Cancelar"
                confirmLoading={statusLoading}
            >
                <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>
                                Status atual: <strong>{selectedRide?.status}</strong>
                    </p>
                </div>
                <Select
                    placeholder="Selecione novo status"
                    value={selectedNewStatus || undefined}
                    onChange={(value) => setSelectedNewStatus(value)}
                    options={rideStatuses}
                    style={{ width: '100%' }}
                />
            </Modal>
        </div>
    );
};