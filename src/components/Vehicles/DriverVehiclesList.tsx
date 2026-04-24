import React, { useState, useEffect } from 'react';
import {
    Button,
    Input,
    Select,
    Card,
    Row,
    Col,
    Spin,
    Empty,
    Tag,
    App,
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { BookIcon } from '@/components/BookIcon';
import { DriverVehicle } from '@/types/driver-vehicle';
import driverVehicleService from '@/services/driverVehicleService';
import { VehicleDetailsModal } from './VehicleDetailsModal';
import { useTheme } from '@/themes/ThemeProvider';

interface DriverVehiclesListProps {
    refreshTrigger?:  number;
}

export const DriverVehiclesList: React.FC<DriverVehiclesListProps> = ({
                                                                          refreshTrigger = 0,
                                                                      }) => {
    const { message } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const [vehicles, setVehicles] = useState<DriverVehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<DriverVehicle | undefined>();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });

    const loadVehicles = async () => {
        setLoading(true);
        try {
            console.log('🚗 Carregando veículos com filtros:', {
                status: statusFilter,
                search: searchText,
            });

            const response = await driverVehicleService.listVehicles({
                limit: pagination.pageSize,
                sort: '-createdAt,licensePlate',
                q: searchText || undefined,
                status: statusFilter as 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_DOCS' | undefined,
            });

            console.log('✅ Resposta da API:', response);

            if (response.success && response.data) {
                console.log('✅ Veículos carregados:', response.data.items?. length || 0);
                setVehicles(response.data. items || []);
                setPagination((prev) => ({
                    ...prev,
                    total: response. data?. totalCount || 0,
                }));
            } else {
                message.error(response.error || 'Erro ao carregar veículos');
                setVehicles([]);
            }
        } catch (error: any) {
            console.error('❌ Erro ao carregar veículos:', error);
            message.error('Erro ao carregar veículos');
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPagination((prev) => ({ ...prev, current: 1 }));
        loadVehicles();
    }, [searchText, statusFilter, refreshTrigger]);

    const handleViewDetails = (vehicle: DriverVehicle) => {
        setSelectedVehicle(vehicle);
        setSelectedVehicleId(vehicle.id);
        setDetailsVisible(true);
    };

    const handleRefresh = () => {
        loadVehicles();
    };

    // ✅ CORRIGIDO: Adicionado suporte para PENDING_DOCS com cor azul
    const getStatusTag = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Tag color="green">Aprovado</Tag>;
            case 'REJECTED':
                return <Tag color="red">Rejeitado</Tag>;
            case 'PENDING':
                return <Tag color="orange">Pendente</Tag>;
            case 'PENDING_DOCS':
                return <Tag color="blue">Aguardando Documentos</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Placa',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
            width: '12%',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Marca/Modelo',
            key: 'vehicle',
            width: '20%',
            render: (_: any, record: DriverVehicle) => (
                <div style={{ fontWeight: 500 }}>
                    {record.brand} {record.model}
                </div>
            ),
        },
        {
            title: 'Cor',
            dataIndex: 'color',
            key: 'color',
            width: '12%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '12%',
            render: (status: string) => getStatusTag(status),
        },
        {
            title: 'Data de Criação',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '14%',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 80,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: DriverVehicle) => (
                <Button
                    type="text"
                    size="small"
                    icon={<BookIcon style={{ color: '#0374C8' }} />}
                    onClick={() => handleViewDetails(record)}
                    title="Ver detalhes"
                />
            ),
        },
    ];

    return (
        <>
            {/* Card Unificado - Filtros + Tabela */}
            <Card
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
                styles={{ body: { padding: '16px' } }}
            >
                {/* Linha de Filtros */}
                <Row gutter={[12, 12]} style={{ marginBottom: '16px' }} align="middle">
                    <Col flex="auto">
                        <Input. Search
                                placeholder="Buscar por placa, marca ou modelo..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                size="large"
                                prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col flex="200px">
                        <Select
                            placeholder="Status"
                            value={statusFilter || undefined}
                            onChange={(value) => setStatusFilter(value || undefined)}
                            allowClear
                            size="large"
                            // ✅ CORRIGIDO: Adicionado PENDING_DOCS na lista de opções
                            options={[
                                { label: 'Pendente', value: 'PENDING' },
                                { label:  'Aguardando Documentos', value:  'PENDING_DOCS' },
                                { label: 'Aprovado', value: 'APPROVED' },
                                { label: 'Rejeitado', value: 'REJECTED' },
                            ]}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col flex="100px">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={loading}
                            style={{ width: '100%' }}
                        >
                            Atualizar
                        </Button>
                    </Col>
                </Row>

                {/* Tabela */}
                <Spin spinning={loading}>
                    {vehicles.length > 0 ?  (
                        <div style={{ marginRight: '-16px', marginBottom: '-16px', marginLeft: '-16px' }}>
                            <ProfessionalTable
                                columns={columns}
                                dataSource={vehicles}
                                rowKey="id"
                                pagination={{
                                    pageSize: pagination.pageSize,
                                    current: pagination.current,
                                    total: pagination.total,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    showTotal: (total) => `Total: ${total} veículo(s)`,
                                    onChange: (page, pageSize) => {
                                        setPagination({ current: page, pageSize, total:  pagination.total });
                                    },
                                }}
                                scroll={{ x: 'max-content' }}
                            />
                        </div>
                    ) : (
                        <Empty
                            description="Nenhum veículo encontrado"
                            style={{ padding: '50px 0' }}
                        />
                    )}
                </Spin>
            </Card>

            {/* Modal de Detalhes */}
            <VehicleDetailsModal
                visible={detailsVisible}
                vehicleId={selectedVehicleId}
                vehicle={selectedVehicle}
                onClose={() => {
                    setDetailsVisible(false);
                    setSelectedVehicle(undefined);
                    setSelectedVehicleId(undefined);
                }}
                onSuccess={() => {
                    loadVehicles();
                }}
            />
        </>
    );
};