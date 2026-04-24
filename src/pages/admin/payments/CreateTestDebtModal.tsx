/**
 * CreateTestDebtModal - Modal para criar débito de teste
 * ⚠️ APENAS PARA DESENVOLVIMENTO/HOMOLOGAÇÃO ⚠️
 */

import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    InputNumber,
    Switch,
    Select,
    message,
    Spin,
    Row,
    Col,
    Alert,
} from 'antd';
import billingService, { CreateTestDebtRequest, CreateTestDebtResponse } from '@/services/billingService';
import adminDriversService, { AdminDriver } from '@/services/adminDriversService';

interface CreateTestDebtModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateTestDebtModal: React.FC<CreateTestDebtModalProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const [drivers, setDrivers] = useState<AdminDriver[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Carregar motoristas quando abrir o modal
    useEffect(() => {
        if (visible) {
            loadDrivers();
            form.resetFields();
            form.setFieldsValue({
                generatePixImmediately: true,
                rideCount: 10,
                pricePerRide: 2,
            });
            setSearchQuery('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    // Buscar motoristas quando o termo de busca mudar (com debounce)
    useEffect(() => {
        if (visible) {
            const timeoutId = setTimeout(() => {
                loadDrivers(searchQuery);
            }, 300); // Debounce de 300ms

            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, visible]);

    const loadDrivers = async (search?: string) => {
        setLoadingDrivers(true);
        try {
            const response = await adminDriversService.listDrivers({ 
                limit: 100,
                q: search || undefined,
                sort: '-createdAt,name',
            });
            setDrivers(response.items || []);
        } catch (error: any) {
            console.error('Erro ao carregar motoristas:', error);
            message.error('Erro ao carregar lista de motoristas');
        } finally {
            setLoadingDrivers(false);
        }
    };

    const handleSubmit = async (values: CreateTestDebtRequest) => {
        setLoading(true);
        try {
            const response: CreateTestDebtResponse = await billingService.createTestDebt({
                driverId: values.driverId,
                rideCount: values.rideCount,
                pricePerRide: values.pricePerRide,
                generatePixImmediately: values.generatePixImmediately !== undefined 
                    ? values.generatePixImmediately 
                    : true,
            });

            message.success(
                response.message || 
                `Débito de teste criado com sucesso! ${response.pix ? 'PIX gerado automaticamente.' : ''}`
            );
            onSuccess();
            onClose();
            form.resetFields();
        } catch (error: any) {
            console.error('Erro ao criar débito de teste:', error);
            message.error(error.message || 'Erro ao criar débito de teste');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div>
                    <span>Criar Débito de Teste</span>
                    <Alert
                        message="⚠️ APENAS PARA DESENVOLVIMENTO/HOMOLOGAÇÃO"
                        type="warning"
                        showIcon
                        style={{ marginTop: 8, fontSize: '12px' }}
                    />
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Criar Débito"
            cancelText="Cancelar"
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    generatePixImmediately: true,
                    rideCount: 10,
                    pricePerRide: 2,
                }}
            >
                <Form.Item
                    label="Motorista"
                    name="driverId"
                    rules={[{ required: true, message: 'Selecione um motorista' }]}
                >
                    <Select
                        placeholder="Digite para buscar motorista (nome, email, CPF, telefone, CNH)"
                        showSearch
                        onSearch={(value) => setSearchQuery(value)}
                        filterOption={false}
                        loading={loadingDrivers}
                        notFoundContent={loadingDrivers ? <Spin size="small" /> : 'Nenhum motorista encontrado'}
                        options={drivers.map((driver) => ({
                            label: `${driver.name} (${driver.email})`,
                            value: driver.userId,
                        }))}
                        allowClear
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Quantidade de Corridas"
                            name="rideCount"
                            tooltip="Número de corridas para gerar o débito"
                            rules={[
                                { required: true, message: 'Campo obrigatório' },
                                { type: 'number', min: 1, message: 'Mínimo 1 corrida' },
                            ]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                placeholder="Ex: 10"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Preço por Corrida (R$)"
                            name="pricePerRide"
                            tooltip="Valor cobrado por cada corrida"
                            rules={[
                                { required: true, message: 'Campo obrigatório' },
                                {
                                    type: 'number',
                                    min: 0.01,
                                    message: 'Mínimo R$ 0,01',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0.01}
                                step={0.01}
                                precision={2}
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                parser={(value) =>
                                    value!.replace(/R\$\s?|(,*)/g, '') as any
                                }
                                placeholder="Ex: 2.00"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="generatePixImmediately"
                    valuePropName="checked"
                    tooltip="Se ativado, gera o QR Code PIX automaticamente após criar o débito"
                >
                    <Switch
                        checkedChildren="Gerar PIX Automaticamente"
                        unCheckedChildren="Não Gerar PIX"
                    />
                </Form.Item>

                <Alert
                    message="Informações"
                    description="Este débito será criado instantaneamente, sem depender do ciclo automático de cobrança. Útil para testar fluxos de pagamento e integração com Mercado Pago."
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                />
            </Form>
        </Modal>
    );
};

export default CreateTestDebtModal;

