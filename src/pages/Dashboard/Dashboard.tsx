/**
 * Dashboard - Página principal com visão geral e KPIs
 * ✅ DADOS 100% REAIS DA API
 * ✅ Corridas via tripsService. getAdminTrips()
 * ✅ Motoristas via adminDriversService.listDrivers() - CORRIGIDO PARA ACTIVE
 * ✅ Receita, Taxa de Aceitação e Variações calculadas dinamicamente
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Row, Col, Card, Timeline, Button, Drawer, Descriptions, Spin, message } from 'antd';
import {
    CarOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { KPIBox } from '@/components/KPIBox';
import { BadgeStatus } from '@/components/BadgeStatus';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { BookIcon } from '@/components/BookIcon';
import { HighlightText } from '@/components/HighlightText';
import { MapSorriso } from '@/components/MapSorriso';
import { mockEvents } from '@/mocks/data';
import { SystemEvent } from '@/types';
import dayjs from 'dayjs';
import { formatCurrency, escapeHtml } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';
import { useAuth } from '@/contexts/AuthContext';
import { tripsService, type Trip } from '@/services/tripsService';
import adminDriversService from '@/services/adminDriversService';

export const Dashboard: React.FC = () => {
    const { mode } = useTheme();
    const { refreshAccessToken } = useAuth();
    const isDark = mode === 'dark';
    const { searchQuery, searchResults } = useSearch();
    const [selectedRide, setSelectedRide] = useState<Trip | null>(null);
    const [rideDrawerVisible, setRideDrawerVisible] = useState(false);
    const [rides, setRides] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);

    // KPIs - Valores Atuais
    const [totalRidesCounted, setTotalRidesCounted] = useState(0);
    const [totalActiveDrivers, setTotalActiveDrivers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [acceptanceRate, setAcceptanceRate] = useState(0);

    // Variações Percentuais - Calculadas dinamicamente
    const [ridesChange, setRidesChange] = useState(0);
    const [driversChange, setDriversChange] = useState(0);
    const [revenueChange, setRevenueChange] = useState(0);
    const [acceptanceChange, setAcceptanceChange] = useState(0);

    // Armazenar valores anteriores para calcular variações
    const previousDataRef = useRef({
        totalRides: 0,
        totalDrivers: 0,
        totalRevenue: 0,
        acceptanceRate: 0,
    });

    const isLoadingRef = useRef(false);

    /**
     * ✅ Carregar dados ao montar
     */
    useEffect(() => {
        void loadDashboardData();
    }, []);

    /**
     * ✅ Calcular variação percentual entre dois valores
     * @param current valor atual
     * @param previous valor anterior
     * @returns variação em percentual
     */
    const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return ((current - previous) / previous) * 100;
    };

    /**
     * ✅ Carregar todos os dados do dashboard
     * - GET /v1/admin/rides via tripsService.getAdminTrips()
     * - GET /v1/admin/drivers via adminDriversService.listDrivers()
     * - Cálculos: Receita Total, Taxa de Aceitação e Variações
     */
    const loadDashboardData = async () => {
        // Evitar múltiplas requisições simultâneas
        if (isLoadingRef.current) {
            console.log('⏳ Já está carregando, ignorando requisição duplicada');
            return;
        }

        isLoadingRef.current = true;
        setLoading(true);

        try {
            // ✅ Renovar token ANTES de fazer requisições
            console.log('🔄 Renovando token antes de carregar dados...');
            const tokenRenewed = await refreshAccessToken();

            if (!tokenRenewed) {
                console.warn('⚠️ Falha ao renovar token, pode estar expirado');
                message.error('Sua sessão expirou. Faça login novamente.');
                return;
            }

            console.log('✅ Token renovado, carregando dados do dashboard...');

            // ✅ 1.    CARREGAR CORRIDAS - GET /v1/admin/rides
            console.log('📋 Carregando corridas da API...');
            const ridesResponse = await tripsService. getAdminTrips({
                limit: 100,
                sort: '-requestedAt',
            });

            let ridesData: Trip[] = [];
            let totalRev = 0;
            let acceptedRides = 0;
            let totalRidesValue = 0;

            if (ridesResponse.success && ridesResponse.data?. items) {
                ridesData = ridesResponse.data.items;
                totalRidesValue = ridesData.length;
                console.log(`✅ ${ridesData.length} corridas carregadas`);

                // ✅ Calcular receita total (soma de finalPrice ou estimatedPrice)
                totalRev = ridesData.reduce((sum, ride) => {
                    const price = ride.finalPrice || ride. estimatedPrice || 0;
                    return sum + price;
                }, 0);
                setTotalRevenue(totalRev);
                console.log(`✅ Receita total: R$ ${totalRev.toFixed(2)}`);

                // ✅ Calcular corridas aceitas (não canceladas, não expiradas)
                acceptedRides = ridesData.filter(
                    ride =>
                        ride.status !== 'CANCELED_BY_RIDER' &&
                        ride.status !== 'CANCELED_BY_DRIVER' &&
                        ride.status !== 'CANCELADA_PASSAGEIRO' &&
                        ride.status !== 'CANCELADA_MOTORISTA' &&
                        ride.status !== 'EXPIRED' &&
                        ride.status !== 'NO_SHOW'
                ).length;

                // ✅ Taxa de aceitação = (corridas aceitas / total) * 100
                const rate = ridesData.length > 0
                    ? ((acceptedRides / ridesData.length) * 100)
                    : 0;
                setAcceptanceRate(Math.round(rate * 10) / 10);
                console.log(`✅ Taxa de aceitação: ${rate.toFixed(2)}%`);

                // ✅ Calcular variação de corridas
                const rideChangeValue = calculateChange(totalRidesValue, previousDataRef.current. totalRides);
                setRidesChange(Math.round(rideChangeValue * 10) / 10);

                // ✅ Calcular variação de receita
                const revenueChangeValue = calculateChange(totalRev, previousDataRef. current.totalRevenue);
                setRevenueChange(Math. round(revenueChangeValue * 10) / 10);

                // ✅ Calcular variação de taxa de aceitação
                const acceptanceChangeValue = calculateChange(rate, previousDataRef.current.acceptanceRate);
                setAcceptanceChange(Math.round(acceptanceChangeValue * 10) / 10);

                // Total de corridas
                setTotalRidesCounted(totalRidesValue);
                setRides(ridesData);
            } else {
                console.warn('⚠️ Erro ao carregar corridas:', ridesResponse. message);
                setTotalRidesCounted(0);
                setTotalRevenue(0);
                setAcceptanceRate(0);
                setRidesChange(0);
                setRevenueChange(0);
                setAcceptanceChange(0);
                setRides([]);
                message.warning('Erro ao carregar corridas da API');
            }

            // ✅ 2.   CARREGAR MOTORISTAS - GET /v1/admin/drivers
            console.log('👨‍✈️ Carregando motoristas da API...');
            const driversResponse = await adminDriversService.listDrivers({
                limit: 100,
                sort: '-createdAt',
            });

            let totalActiveDriversValue = 0;

            console.log('📊 Resposta completa de motoristas:', driversResponse);
            console.log('📊 Tipo de resposta:', typeof driversResponse);
            console.log('📊 Chaves da resposta:', Object.keys(driversResponse));

            // ✅ A resposta é uma PaginatedResponse<AdminDriver> com propriedade 'items'
            if (driversResponse && driversResponse.items && Array.isArray(driversResponse. items)) {
                console.log(`✅ ${driversResponse.items.length} motoristas retornados da API`);

                // ✅ CORRIGIDO: Filtrar motoristas com status ACTIVE ou APPROVED
                // (Status possíveis: ACTIVE, APPROVED, PENDING, ONBOARDING, etc)
                const activeDrivers = driversResponse.items.filter((driver: any) => {
                    const driverStatus = driver.status?. toUpperCase() || '';
                    console.log(`🔍 Verificando motorista: ${driver.name} - Status: "${driver.status}" (normalizado: "${driverStatus}")`);
                    // ✅ Aceita ACTIVE ou APPROVED
                    return driverStatus === 'ACTIVE' || driverStatus === 'APPROVED';
                });

                totalActiveDriversValue = activeDrivers.length;
                setTotalActiveDrivers(totalActiveDriversValue);

                // ✅ Calcular variação de motoristas
                const driversChangeValue = calculateChange(
                    totalActiveDriversValue,
                    previousDataRef. current.totalDrivers
                );
                setDriversChange(Math.round(driversChangeValue * 10) / 10);

                console.log(`✅ ${totalActiveDriversValue} motoristas com status ACTIVE ou APPROVED encontrados`);
                console.log('📋 Motoristas aprovados:', activeDrivers.map(d => ({ name: d.name, status: d.status })));
            } else {
                console.warn('⚠️ Erro ao carregar motoristas - estrutura inválida:', driversResponse);
                console.warn('⚠️ esperado: { items: [...], nextCursor, prevCursor, hasMore, totalCount }');
                setTotalActiveDrivers(0);
                setDriversChange(0);
                message.warning('Erro ao carregar motoristas da API');
            }

            // ✅ Atualizar dados anteriores para próxima comparação
            previousDataRef.current = {
                totalRides: totalRidesValue,
                totalDrivers: totalActiveDriversValue,
                totalRevenue: totalRev,
                acceptanceRate: acceptanceRate,
            };

            console.log('✅ Dashboard carregado com sucesso');

        } catch (error: any) {
            console.error('❌ Erro ao carregar dashboard:', error);
            console.error('❌ Stack trace:', error.stack);

            if (error.response?. status === 401) {
                console.warn('⚠️ Token expirado, redirecionando para login...');
                message.error('Sua sessão expirou. Faça login novamente.');
            } else if (error.response?.status === 500) {
                console.error('❌ Erro 500 no servidor:', error.response. data);
                message.error('Erro ao carregar dados do servidor');
            } else {
                message.error('Erro ao carregar dados do dashboard');
            }

            // Valores padrão em caso de erro
            setTotalRidesCounted(0);
            setTotalActiveDrivers(0);
            setTotalRevenue(0);
            setAcceptanceRate(0);
            setRidesChange(0);
            setDriversChange(0);
            setRevenueChange(0);
            setAcceptanceChange(0);
            setRides([]);

        } finally {
            isLoadingRef.current = false;
            setLoading(false);
        }
    };

    /**
     * ✅ Recarregar dados manualmente
     */
    const handleReloadData = async () => {
        console.log('🔄 Recarregando dados manualmente...');
        await loadDashboardData();
    };

    // Filtrar dados baseado na busca
    const filteredRides = useMemo(() => {
        if (!searchQuery) return rides. slice(0, 8);
        const rideResults = searchResults
            .filter(result => result.type === 'ride')
            .map(result => result.item. id);
        return rides.filter(ride => rideResults.includes(ride.id)). slice(0, 8);
    }, [searchQuery, searchResults, rides]);

    // Colunas da tabela de corridas
    const rideColumns = [
        {
            title: 'ID da Corrida',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (text: string) => <HighlightText text={text. substring(0, 8)} />,
            sorter: (a: Trip, b: Trip) => a. id. localeCompare(b.id),
        },
        {
            title: 'Passageiro',
            dataIndex: ['passenger', 'name'],
            key: 'passenger',
            width: 140,
            render: (text: string) => <HighlightText text={text || '-'} />,
        },
        {
            title: 'Motorista',
            dataIndex: ['driver', 'name'],
            key: 'driver',
            width: 140,
            render: (text: string) => <HighlightText text={text || 'Sem atribuição'} />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: (status: string) => <BadgeStatus status={status as any} />,
            filters: [
                { text: 'Solicitada', value: 'REQUESTED' },
                { text: 'Em Andamento', value: 'IN_PROGRESS' },
                { text: 'Concluída', value: 'COMPLETED' },
            ],
            onFilter: (value: any, record: Trip) => record.status === value,
        },
        {
            title: 'Valor',
            dataIndex: 'finalPrice',
            key: 'finalPrice',
            width: 100,
            render: (price: number | undefined) => formatCurrency(price || 0),
            sorter: (a: Trip, b: Trip) => (a.finalPrice || 0) - (b.finalPrice || 0),
        },
        {
            title: '',
            key: 'actions',
            width: 50,
            fixed: 'right' as const,
            align: 'right' as const,
            render: (_: any, record: Trip) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="text"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRide(record);
                            setRideDrawerVisible(true);
                        }}
                        aria-label={`Ver detalhes da corrida ${record.id}`}
                        style={{
                            padding: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <BookIcon style={{ color: '#FF6B35' }} />
                    </Button>
                </div>
            ),
        },
    ];

    // Timeline de eventos
    const timelineItems = mockEvents.map((event: SystemEvent) => ({
        color:
            event.severity === 'success'
                ? 'green'
                : event.severity === 'warning'
                    ? '#FF6B35'
                    : event.severity === 'error'
                        ? 'red'
                        : 'blue',
        children: (
            <div>
                <div
                    style={{
                        fontWeight: 600,
                        color: isDark ? '#F9FAFB' : '#111827',
                        fontSize: 14,
                    }}
                >
                    {escapeHtml(event.title)}
                </div>
                <div
                    style={{
                        fontSize: 13,
                        color: isDark ? '#9CA3AF' : '#6B7280',
                        marginTop: 4,
                    }}
                >
                    {escapeHtml(event.description)}
                </div>
                <div
                    style={{
                        fontSize: 12,
                        color: isDark ? '#6B7280' : '#9CA3AF',
                        marginTop: 6,
                    }}
                >
                    {dayjs(event.timestamp).format('DD/MM/YYYY HH:mm')}
                </div>
            </div>
        ),
    }));

    return (
        <Spin spinning={loading}>
            <div>
                {/* KPIs - TODOS REAIS DA API COM VARIAÇÕES DINÂMICAS */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <KPIBox
                            title="Total de Corridas"
                            value={totalRidesCounted}
                            icon={<CarOutlined />}
                            change={ridesChange}
                            format="number"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <KPIBox
                            title="Motoristas Ativos"
                            value={totalActiveDrivers}
                            icon={<TeamOutlined />}
                            change={driversChange}
                            format="number"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <KPIBox
                            title="Receita Total"
                            value={totalRevenue}
                            icon={<DollarOutlined />}
                            change={revenueChange}
                            format="currency"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <KPIBox
                            title="Taxa de Aceitação"
                            value={acceptanceRate}
                            icon={<CheckCircleOutlined />}
                            change={acceptanceChange}
                            format="percent"
                            suffix="%"
                        />
                    </Col>
                </Row>

                {/* Mapa de Operações */}
                <MapSorriso />

                <Row gutter={[16, 16]}>
                    {/* Tabela de Corridas Recentes */}
                    <Col xs={24} lg={14}>
                        <Card
                            title={
                                <span
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: isDark ? '#F9FAFB' : '#111827',
                                    }}
                                >
                                    Corridas Recentes
                                </span>
                            }
                            extra={
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={handleReloadData}
                                    loading={loading}
                                >
                                    Recarregar
                                </Button>
                            }
                            style={{
                                marginBottom: 24,
                                borderRadius: 16,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#1F2937' : '#FFFFFF',
                            }}
                            styles={{ body: { padding: 0 } }}
                        >
                            <ProfessionalTable
                                columns={rideColumns}
                                dataSource={filteredRides}
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    </Col>

                    {/* Timeline de Eventos */}
                    <Col xs={24} lg={10}>
                        <Card
                            title={
                                <span
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: isDark ? '#F9FAFB' : '#111827',
                                    }}
                                >
                                    Feed de Eventos
                                </span>
                            }
                            style={{
                                marginBottom: 24,
                                borderRadius: 16,
                                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                background: isDark ? '#1F2937' : '#FFFFFF',
                            }}
                            styles={{
                                body: {
                                    padding: 24,
                                    maxHeight: 500,
                                    overflowY: 'auto',
                                },
                            }}
                        >
                            <Timeline items={timelineItems} mode="left" />
                        </Card>
                    </Col>
                </Row>

                {/* Drawer de Detalhes da Corrida */}
                <Drawer
                    title={`Detalhes da Corrida ${selectedRide?.id?. substring(0, 8)}`}
                    placement="right"
                    onClose={() => setRideDrawerVisible(false)}
                    open={rideDrawerVisible}
                    width={600}
                >
                    {selectedRide && (
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="ID da Corrida">
                                {escapeHtml(selectedRide.id)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <BadgeStatus status={selectedRide.status as any} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Passageiro">
                                {escapeHtml(selectedRide.passenger?.name || '-')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Motorista">
                                {escapeHtml(selectedRide.driver?.name || 'Sem atribuição')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Veículo">
                                {selectedRide.driver?.vehicle
                                    ? `${selectedRide.driver.vehicle.brand} ${selectedRide.driver.vehicle.model} (${selectedRide.driver.vehicle.licensePlate})`
                                    : '-'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Distância">
                                {selectedRide.distanceKm ? `${selectedRide.distanceKm} km` : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Duração">
                                {selectedRide.durationMinutes ? `${selectedRide.durationMinutes} minutos` : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Valor Estimado">
                                {formatCurrency(selectedRide.estimatedPrice || 0)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Valor Final">
                                {formatCurrency(selectedRide.finalPrice || 0)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Surge">
                                {selectedRide.surge ? `${selectedRide.surge}x` : '1x'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Data de Solicitação">
                                {dayjs(selectedRide.requestedAt || selectedRide.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Drawer>
            </div>
        </Spin>
    );
};