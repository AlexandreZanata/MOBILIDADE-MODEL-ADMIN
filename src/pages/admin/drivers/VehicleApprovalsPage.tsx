import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Tag,
    Space,
    Input,
    Button,
    Modal,
    Form,
    message,
    Spin,
    Drawer,
    Descriptions,
    Divider,
    Alert,
} from 'antd';
import {
    CarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useVehicles } from '@/hooks/useVehicles';
import { DriverVehicle } from '@/types/driver-vehicle';
import { useTheme } from '@/themes/ThemeProvider';

export const VehicleApprovalsPage:  React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { vehicles, loading, fetchPendingVehicles, approveVehicle, rejectVehicle } = useVehicles();
    const [searchText, setSearchText] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState<DriverVehicle[]>([]);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [rejectReason, setRejectReason] = useState('');
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<DriverVehicle | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() => {
        fetchPendingVehicles();
    }, [fetchPendingVehicles]);

    useEffect(() => {
        // ✅ CORRIGIDO: Usa campos corretos da API
        const filtered = vehicles.filter(
            (vehicle) =>
                vehicle.licensePlate?. toLowerCase().includes(searchText.toLowerCase()) ||
                vehicle.color?.toLowerCase().includes(searchText. toLowerCase()) ||
                vehicle.chassis?.toLowerCase().includes(searchText. toLowerCase()) ||
                `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredVehicles(filtered);
    }, [searchText, vehicles]);

    const handleApprove = async (vehicleId: string) => {
        Modal.confirm({
            title: 'Aprovar Veículo',
            content: 'Tem certeza que deseja aprovar este veículo?',
            okText: 'Aprovar',
            cancelText: 'Cancelar',
            okButtonProps: { type: 'primary' },
            onOk:  async () => {
                setApproving(true);
                try {
                    await approveVehicle(vehicleId);
                    await fetchPendingVehicles();
                } catch (error:  any) {
                    message. error(error.message || 'Erro ao aprovar veículo');
                } finally {
                    setApproving(false);
                }
            },
        });
    };

    const handleRejectClick = (vehicleId: string) => {
        setSelectedVehicleId(vehicleId);
        setRejectReason('');
        setRejectModalVisible(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason. trim()) {
            message.error('Por favor, informe o motivo da rejeição');
            return;
        }

        setRejecting(true);
        try {
            await rejectVehicle(selectedVehicleId, rejectReason);
            setRejectModalVisible(false);
            setRejectReason('');
            await fetchPendingVehicles();
        } catch (error: any) {
            message.error(error.message || 'Erro ao rejeitar veículo');
        } finally {
            setRejecting(false);
        }
    };

    const columns = [
        {
            title: 'Placa',
            // ✅ CORRIGIDO: Usa licensePlate em vez de plate
            dataIndex: 'licensePlate',
            key: 'licensePlate',
            width: '12%',
            render: (licensePlate: string | undefined) => (
                <Space size="small">
                    <CarOutlined style={{ color: '#0374C8' }} />
                    <strong>{licensePlate || '-'}</strong>
                </Space>
            ),
        },
        {
            title: 'Marca/Modelo',
            // ✅ CORRIGIDO: Adiciona coluna de marca e modelo
            key: 'vehicle',
            width: '18%',
            render: (_: any, record: DriverVehicle) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {record.brand} {record.model}
                    </div>
                    <small style={{ color: isDark ? '#9CA3AF' : '#999' }}>
                        Ano {record.year}
                    </small>
                </div>
            ),
        },
        {
            title: 'Cor',
            dataIndex: 'color',
            key: 'color',
            width: '10%',
            render: (color: string | undefined) => color || '-',
        },
        {
            title: 'Chassi',
            dataIndex: 'chassis',
            key: 'chassis',
            width: '15%',
            render: (chassis: string | undefined) => (
                <span
                    title={chassis}
                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                >
                    {chassis ?  `${chassis.substring(0, 12)}...` : '-'}
                </span>
            ),
        },
        {
            title:  'Status',
            dataIndex: 'status',
            key: 'status',
            width: '12%',
            render: (status: string | undefined) => {
                const colors:  Record<string, string> = {
                    PENDING: 'orange',
                    APPROVED: 'green',
                    REJECTED: 'red',
                };
                const labels:  Record<string, string> = {
                    PENDING: 'Pendente',
                    APPROVED: 'Aprovado',
                    REJECTED: 'Rejeitado',
                    PENDING_DOCS: 'Aguardando CRLV',
                };
                return (
                    <Tag color={colors[status || ''] || 'default'}>
                        {labels[status || ''] || status || '-'}
                    </Tag>
                );
            },
        },
        {
            title: 'Solicitado em',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            render: (date: string | undefined) =>
                date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
        },
        {
            title: 'Ações',
            key: 'actions',
            width: '18%',
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: unknown, record: DriverVehicle) => (
                <Space size="small" wrap>
                    <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedVehicle(record);
                            setDrawerVisible(true);
                        }}
                    >
                        Ver
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(record.id)}
                        loading={approving}
                        disabled={record.status !== 'PENDING'}
                    >
                        Aprovar
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleRejectClick(record.id)}
                        loading={rejecting}
                        disabled={record.status !== 'PENDING'}
                    >
                        Rejeitar
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
                styles={{ body: { padding: '16px' } }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Filtros */}
                    <Space style={{ width: '100%' }}>
                        <Input. Search
                                placeholder="Buscar por placa, marca, modelo ou chassi..."
                                value={searchText}
                                onChange={(e) => setSearchText(e. target.value)}
                                allowClear
                                prefix={<SearchOutlined />}
                                style={{ width: '400px' }}
                        />
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => fetchPendingVehicles()}
                            loading={loading}
                        >
                            Atualizar
                        </Button>
                    </Space>

                    {/* Tabela */}
                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={filteredVehicles}
                            pagination={{
                                pageSize: 15,
                                total: filteredVehicles.length,
                                showSizeChanger: true,
                                showTotal: (total) => `Total: ${total} veículos`,
                            }}
                            rowKey="id"
                            size="small"
                            scroll={{ x: 'max-content' }}
                        />
                    </Spin>
                </Space>
            </Card>

            {/* Drawer de Detalhes */}
            <Drawer
                title={`Detalhes do Veículo - ${selectedVehicle?.licensePlate || '-'}`}
                placement="right"
                onClose={() => {
                    setDrawerVisible(false);
                    setSelectedVehicle(null);
                }}
                open={drawerVisible}
                width={750}
            >
                {selectedVehicle && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div>
                            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                                Informações do Veículo
                            </h3>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="ID">{selectedVehicle.id}</Descriptions.Item>
                                {/* ✅ CORRIGIDO: Usa licensePlate */}
                                <Descriptions.Item label="Placa">
                                    {selectedVehicle.licensePlate}
                                </Descriptions.Item>
                                {/* ✅ CORRIGIDO:  Usa brand e model */}
                                <Descriptions.Item label="Marca">
                                    {selectedVehicle.brand || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Modelo">
                                    {selectedVehicle.model || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ano">{selectedVehicle.year}</Descriptions.Item>
                                <Descriptions.Item label="Cor">
                                    {selectedVehicle.color || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Chassi">
                                    {selectedVehicle.chassis || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Motorista ID">
                                    {selectedVehicle. driverProfileId || '-'}
                                </Descriptions.Item>
                                {selectedVehicle.driverName && (
                                    <Descriptions.Item label="Motorista">
                                        {selectedVehicle.driverName}
                                    </Descriptions.Item>
                                )}
                                {selectedVehicle. driverEmail && (
                                    <Descriptions.Item label="Email do Motorista">
                                        {selectedVehicle.driverEmail}
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item label="Status">
                                    <Tag
                                        color={
                                            selectedVehicle. status === 'APPROVED'
                                                ? 'green'
                                                :  selectedVehicle.status === 'REJECTED'
                                                    ? 'red'
                                                    : 'orange'
                                        }
                                    >
                                        {selectedVehicle.status === 'PENDING'
                                            ? 'Pendente'
                                            :  selectedVehicle.status === 'APPROVED'
                                                ? 'Aprovado'
                                                : 'Rejeitado'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Data de Registro">
                                    {dayjs(selectedVehicle.createdAt).format('DD/MM/YYYY HH:mm')}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        {selectedVehicle.rejectionReason && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Alert
                                    message="Motivo da Rejeição"
                                    type="error"
                                    showIcon
                                    icon={<ExclamationCircleOutlined />}
                                    description={selectedVehicle.rejectionReason}
                                />
                            </>
                        )}

                        {selectedVehicle. status === 'PENDING' && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="middle">
                                    <Button
                                        danger
                                        size="large"
                                        onClick={() => {
                                            setDrawerVisible(false);
                                            handleRejectClick(selectedVehicle.id);
                                        }}
                                    >
                                        Rejeitar Veículo
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => handleApprove(selectedVehicle.id)}
                                    >
                                        Aprovar Veículo
                                    </Button>
                                </Space>
                            </>
                        )}
                    </Space>
                )}
            </Drawer>

            {/* Modal de Rejeição */}
            <Modal
                title="Rejeitar Veículo"
                open={rejectModalVisible}
                onOk={handleRejectSubmit}
                onCancel={() => setRejectModalVisible(false)}
                okText="Rejeitar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
                confirmLoading={rejecting}
            >
                <Form layout="vertical">
                    <Form.Item label="Motivo da Rejeição" required>
                        <Input.TextArea
                                rows={4}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Informe o motivo detalhado da rejeição..."
                                maxLength={500}
                            />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default VehicleApprovalsPage;