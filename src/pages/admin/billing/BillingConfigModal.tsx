/**
 * BillingConfigModal - Modal para editar configuração de billing
 */

import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    InputNumber,
    Input,
    Switch,
    Select,
    Space,
    message,
    Spin,
    Row,
    Col,
} from 'antd';
import billingService, { BillingConfig } from '@/services/billingService';

interface BillingConfigModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const BillingConfigModal: React.FC<BillingConfigModalProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingConfig, setLoadingConfig] = useState(false);

    // Carregar configuração quando abrir o modal
    useEffect(() => {
        if (visible) {
            loadConfig();
        } else {
            form.resetFields();
        }
    }, [visible]);

    const loadConfig = async () => {
        setLoadingConfig(true);
        try {
            const data = await billingService.getConfig();
            form.setFieldsValue({
                cycleDays: data.cycleDays,
                executionTime: data.executionTime,
                executionTimezone: data.executionTimezone,
                pricePerRide: data.pricePerRide,
                minimumCharge: data.minimumCharge,
                pixExpirationDays: data.pixExpirationDays,
                gracePeriodHours: data.gracePeriodHours,
                autoBlockEnabled: data.autoBlockEnabled,
                blockAfterCycles: data.blockAfterCycles,
                isActive: data.isActive,
            });
        } catch (error: any) {
            console.error('Erro ao carregar configuração:', error);
            message.error(error.message || 'Erro ao carregar configuração');
        } finally {
            setLoadingConfig(false);
        }
    };

    const handleSubmit = async (values: Partial<BillingConfig>) => {
        setLoading(true);
        try {
            await billingService.updateConfig(values);
            message.success('Configuração atualizada com sucesso!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Erro ao atualizar configuração:', error);
            message.error(error.message || 'Erro ao atualizar configuração');
        } finally {
            setLoading(false);
        }
    };

    // Timezones comuns
    const timezones = [
        { label: 'America/Sao_Paulo (Brasília)', value: 'America/Sao_Paulo' },
        { label: 'America/Manaus', value: 'America/Manaus' },
        { label: 'America/Rio_Branco', value: 'America/Rio_Branco' },
        { label: 'America/Belem', value: 'America/Belem' },
        { label: 'America/Fortaleza', value: 'America/Fortaleza' },
        { label: 'America/Recife', value: 'America/Recife' },
        { label: 'America/Bahia', value: 'America/Bahia' },
        { label: 'America/Cuiaba', value: 'America/Cuiaba' },
        { label: 'America/Campo_Grande', value: 'America/Campo_Grande' },
        { label: 'America/Araguaina', value: 'America/Araguaina' },
    ];

    return (
        <Modal
            title="Configuração de Cobrança"
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar"
            cancelText="Cancelar"
            width={800}
            destroyOnHidden
        >
            <Spin spinning={loadingConfig}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        cycleDays: 7,
                        executionTime: '06:00',
                        executionTimezone: 'America/Sao_Paulo',
                        pricePerRide: 1.0,
                        minimumCharge: 0,
                        pixExpirationDays: 3,
                        gracePeriodHours: 24,
                        autoBlockEnabled: true,
                        blockAfterCycles: 1,
                        isActive: true,
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Dias do Ciclo"
                                name="cycleDays"
                                tooltip="Intervalo em dias entre cada ciclo de cobrança"
                                rules={[
                                    { required: true, message: 'Campo obrigatório' },
                                    { type: 'number', min: 1, max: 90, message: 'Entre 1 e 90 dias' },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    max={90}
                                    style={{ width: '100%' }}
                                    placeholder="Ex: 7"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Horário de Execução"
                                name="executionTime"
                                tooltip="Horário (HH:mm) para execução do job de cobrança"
                                rules={[
                                    { required: true, message: 'Campo obrigatório' },
                                    {
                                        pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                                        message: 'Formato inválido (use HH:mm)',
                                    },
                                ]}
                            >
                                <Input placeholder="Ex: 06:00" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Timezone"
                        name="executionTimezone"
                        tooltip="Timezone para execução do job"
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                        <Select
                            placeholder="Selecione o timezone"
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={timezones}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Preço por Corrida (R$)"
                                name="pricePerRide"
                                tooltip="Valor cobrado por cada corrida concluída"
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
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Cobrança Mínima (R$)"
                                name="minimumCharge"
                                tooltip="Cobrança mínima por ciclo (0 = sem mínimo)"
                                rules={[
                                    { required: true, message: 'Campo obrigatório' },
                                    {
                                        type: 'number',
                                        min: 0,
                                        message: 'Mínimo 0',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    step={0.01}
                                    precision={2}
                                    style={{ width: '100%' }}
                                    formatter={(value) =>
                                        `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={(value) =>
                                        value!.replace(/R\$\s?|(,*)/g, '') as any
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Dias de Expiração do PIX"
                                name="pixExpirationDays"
                                tooltip="Dias para vencimento do PIX após geração"
                                rules={[
                                    { required: true, message: 'Campo obrigatório' },
                                    {
                                        type: 'number',
                                        min: 1,
                                        max: 30,
                                        message: 'Entre 1 e 30 dias',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    max={30}
                                    style={{ width: '100%' }}
                                    placeholder="Ex: 3"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Horas de Carência"
                                name="gracePeriodHours"
                                tooltip="Horas de tolerância após vencimento antes do bloqueio"
                                rules={[
                                    { required: true, message: 'Campo obrigatório' },
                                    {
                                        type: 'number',
                                        min: 0,
                                        max: 168,
                                        message: 'Entre 0 e 168 horas (7 dias)',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    max={168}
                                    style={{ width: '100%' }}
                                    placeholder="Ex: 24"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Ciclos para Bloqueio"
                                name="blockAfterCycles"
                                tooltip="Número de ciclos não pagos antes de bloquear"
                                rules={[
                                    { required: true, message: 'Campo obrigatório' },
                                    {
                                        type: 'number',
                                        min: 1,
                                        max: 5,
                                        message: 'Entre 1 e 5 ciclos',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    max={5}
                                    style={{ width: '100%' }}
                                    placeholder="Ex: 1"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Form.Item
                            name="autoBlockEnabled"
                            valuePropName="checked"
                            tooltip="Habilitar bloqueio automático de motoristas inadimplentes"
                        >
                            <Switch
                                checkedChildren="Bloqueio Automático Ativado"
                                unCheckedChildren="Bloqueio Automático Desativado"
                            />
                        </Form.Item>

                        <Form.Item
                            name="isActive"
                            valuePropName="checked"
                            tooltip="Ativar/desativar sistema de cobrança"
                        >
                            <Switch
                                checkedChildren="Sistema Ativo"
                                unCheckedChildren="Sistema Inativo"
                            />
                        </Form.Item>
                    </Space>
                </Form>
            </Spin>
        </Modal>
    );
};

export default BillingConfigModal;

