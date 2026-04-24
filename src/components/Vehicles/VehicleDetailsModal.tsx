import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Spin,
    Descriptions,
    Button,
    Divider,
    Input,
    Form,
    Row,
    Col,
    Tag,
    Alert,
    App,
    Space,
} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { DriverVehicle } from '@/types/driver-vehicle';
import driverVehicleService from '@/services/driverVehicleService';

interface VehicleDetailsModalProps {
    visible: boolean;
    vehicleId? :   string;
    vehicle?: DriverVehicle;
    onClose: () => void;
    onSuccess: () => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
                                                                            visible,
                                                                            vehicleId,
                                                                            vehicle:   initialVehicle,
                                                                            onClose,
                                                                            onSuccess,
                                                                        }) => {
    const { message } = App.useApp();

    const [vehicle, setVehicle] = useState<DriverVehicle | null>(initialVehicle || null);
    const [loading, setLoading] = useState(false);
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (visible && vehicleId && !initialVehicle) {
            void loadVehicleDetails();
        } else if (visible && initialVehicle) {
            setVehicle(initialVehicle);
        }
    }, [visible, vehicleId, initialVehicle]);

    const loadVehicleDetails = async () => {
        if (!vehicleId) return;

        setLoading(true);
        try {
            const response = await driverVehicleService.getVehicle(vehicleId);
            if (response.success && response.data) {
                setVehicle(response.data);
            } else {
                message.error(response.error || 'Erro ao carregar detalhes do veículo');
            }
        } catch (error: any) {
            message.error('Erro ao carregar detalhes do veículo');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!vehicle?.id) return;

        setApproving(true);
        try {
            const response = await driverVehicleService.approveVehicle(vehicle.id);
            if (response.success) {
                message.success('Veículo aprovado com sucesso!');
                onSuccess();
                onClose();
            } else {
                message.error(response.error || 'Erro ao aprovar veículo');
            }
        } catch (error: any) {
            message.error('Erro ao aprovar veículo');
            console.error(error);
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async () => {
        if (!vehicle?. id) return;

        if (!  rejectionReason.  trim()) {
            message.error('Por favor, informe o motivo da rejeição');
            return;
        }

        setRejecting(true);
        try {
            const response = await driverVehicleService.rejectVehicle(
                vehicle.id,
                rejectionReason
            );
            if (response.success) {
                message.success('Veículo rejeitado com sucesso!  ');
                onSuccess();
                onClose();
            } else {
                message.error(response.error || 'Erro ao rejeitar veículo');
            }
        } catch (error: any) {
            message.error('Erro ao rejeitar veículo');
            console.error(error);
        } finally {
            setRejecting(false);
        }
    };

    // ✅ CORRIGIDO: Adicionado suporte para PENDING_DOCS
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

    return (
        // ✅ CORRIGIDO: Alterado de Modal para Drawer (aba lateral)
        <Drawer
            title={`Detalhes do Veículo - ${vehicle?.licensePlate || '-'}`}
            placement="right"
            onClose={onClose}
            open={visible}
            width={600}
            destroyOnHidden
        >
            <Spin spinning={loading}>
                {vehicle ? (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {vehicle.status === 'REJECTED' && vehicle.rejectionReason && (
                            <>
                                <Alert
                                    message="Veículo Rejeitado"
                                    description={`Motivo: ${vehicle.rejectionReason}`}
                                    type="error"
                                    showIcon
                                />
                                <Divider style={{ margin: '12px 0' }} />
                            </>
                        )}

                        <div>
                            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                                Informações do Veículo
                            </h3>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="ID">{vehicle.id}</Descriptions.Item>
                                <Descriptions.Item label="Placa">
                                    <strong>{vehicle.licensePlate}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label="Marca">{vehicle.brand}</Descriptions.Item>
                                <Descriptions.Item label="Modelo">{vehicle.model}</Descriptions.Item>
                                <Descriptions.Item label="Ano">{vehicle.year}</Descriptions.Item>
                                <Descriptions.Item label="Cor">{vehicle.color}</Descriptions.Item>
                                <Descriptions.Item label="Chassis">
                                    {vehicle.chassis || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    {getStatusTag(vehicle.status)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Data de Criação">
                                    {new Date(vehicle.createdAt).toLocaleString('pt-BR')}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        <Divider style={{ margin: '12px 0' }} />

                        <div>
                            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                                Informações do Motorista
                            </h3>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="ID do Motorista">
                                    {vehicle.driverProfileId || vehicle.driverId || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Nome">
                                    {vehicle.driverName || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {vehicle.driverEmail || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Telefone">
                                    {vehicle.driverPhone || 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        {/* ✅ CORRIGIDO: Permite aprovar também em status PENDING_DOCS */}
                        {(vehicle.status === 'PENDING' || vehicle.status === 'PENDING_DOCS') && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Space style={{ width: '100%', justifyContent: 'flex-end' }} size="middle">
                                    <Button
                                        danger
                                        size="large"
                                        onClick={() => setShowRejectForm(true)}
                                        disabled={showRejectForm}
                                    >
                                        Rejeitar Veículo
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<CheckOutlined />}
                                        onClick={handleApprove}
                                        loading={approving}
                                    >
                                        Aprovar Veículo
                                    </Button>
                                </Space>

                                {showRejectForm && (
                                    <>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <Form layout="vertical">
                                            <Form.Item
                                                label="Motivo da Rejeição"
                                                required
                                            >
                                                <Input.TextArea
                                                    rows={4}
                                                    placeholder="Informe o motivo da rejeição (ex: Documentação incompleta, Placa ilegível, etc.)"
                                                    value={rejectionReason}
                                                    onChange={(e) =>
                                                        setRejectionReason(e.target.value)
                                                    }
                                                        disabled={rejecting}
                                                />
                                            </Form.Item>
                                        </Form>

                                        <Row gutter={[16, 0]}>
                                            <Col span={12}>
                                                <Button
                                                    block
                                                    onClick={() => {
                                                        setShowRejectForm(false);
                                                        setRejectionReason('');
                                                    }}
                                                    disabled={rejecting}
                                                >
                                                    Cancelar
                                                </Button>
                                            </Col>
                                            <Col span={12}>
                                                <Button
                                                    type="primary"
                                                    danger
                                                    block
                                                    loading={rejecting}
                                                    onClick={handleReject}
                                                >
                                                    Confirmar Rejeição
                                                </Button>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </>
                        )}

                        {vehicle.status !== 'PENDING' && vehicle.status !== 'PENDING_DOCS' && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Alert
                                    message={
                                        vehicle.status === 'APPROVED'
                                            ? 'Este veículo já foi aprovado'
                                            : 'Este veículo já foi rejeitado'
                                    }
                                    type={vehicle.status === 'APPROVED' ? 'success' : 'error'}
                                    showIcon
                                />
                            </>
                        )}
                    </Space>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Nenhum veículo selecionado</p>
                    </div>
                )}
            </Spin>
        </Drawer>
    );
};

export default VehicleDetailsModal;