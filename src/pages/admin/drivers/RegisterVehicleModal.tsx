import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    message,
    Spin,
    InputNumber,
    Empty,
} from 'antd';
import { driverService } from '@/services/api/driverService';
import type { VehicleBrand, VehicleModel } from '@/services/api/driverService';

interface RegisterVehicleModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const RegisterVehicleModal: React.FC<RegisterVehicleModalProps> = ({
                                                                                visible,
                                                                                onClose,
                                                                                onSuccess,
                                                                            }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [brandsError, setBrandsError] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            loadBrands();
        }
    }, [visible]);

    const loadBrands = async () => {
        try {
            setLoadingBrands(true);
            setBrandsError(null);
            console.log('Carregando marcas de veículos...');
            const response = await driverService.getPublicVehicleBrands();
            console.log('Resposta marcas:', response);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                console.log('Marcas carregadas:', response.data);
                setBrands(response.data);
            } else if (response.success && Array.isArray(response.data) && response.data.length === 0) {
                console.warn('⚠️ Nenhuma marca disponível no banco de dados');
                setBrandsError('Nenhuma marca de veículo disponível. Contate o administrador.');
                setBrands([]);
            } else {
                console.error('Resposta inválida:', response);
                message.error(response.message || 'Erro ao carregar marcas de veículos');
                setBrands([]);
            }
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
            setBrandsError('Erro ao carregar marcas. Tente novamente.');
            message.error('Erro ao carregar marcas de veículos');
            setBrands([]);
        } finally {
            setLoadingBrands(false);
        }
    };

    const loadModels = async (brandId: string) => {
        try {
            setLoadingModels(true);
            console.log('Carregando modelos para marca:', brandId);
            const response = await driverService.getPublicVehicleModels(brandId);
            console.log('Resposta modelos:', response);

            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                console.log('Modelos carregados:', response.data);
                setModels(response.data);
            } else if (response.success && Array.isArray(response.data) && response.data.length === 0) {
                console.warn('⚠️ Nenhum modelo disponível para esta marca');
                message.info('Nenhum modelo disponível para esta marca');
                setModels([]);
            } else {
                console.error('Resposta inválida:', response);
                message.error(response.message || 'Erro ao carregar modelos de veículos');
                setModels([]);
            }
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
            message.error('Erro ao carregar modelos de veículos');
            setModels([]);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleBrandChange = (brandId: string) => {
        setSelectedBrandId(brandId);
        form.setFieldValue('model_id', undefined);
        setModels([]);
        loadModels(brandId);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            console.log('Registrando veículo...', values);

            const payload = {
                brand_id: values.brand_id,
                model_id: values.model_id,
                year: values.year,
                plate: values.plate.toUpperCase(),
                chassis: values.chassis.toUpperCase(),
                color: values.color,
                metadata: values.renavam ? { renavam: values.renavam } : undefined,
            };

            const response = await driverService. registerVehicle(payload);

            if (response.success) {
                message.success('Veículo cadastrado com sucesso!');
                form.resetFields();
                setSelectedBrandId(null);
                setModels([]);
                onSuccess();
                onClose();
            } else {
                message.error(response.message || 'Erro ao cadastrar veículo');
            }
        } catch (error: any) {
            console.error('Erro ao registrar veículo:', error);
            message.error(
                error.response?.data?.message || 'Erro ao cadastrar veículo'
            );
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <Modal
            title="Cadastrar Novo Veículo"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnHidden
        >
            {brandsError ? (
                <Empty
                    description={brandsError}
                    style={{ marginTop: 48, marginBottom: 48 }}
                >
                    <Button type="primary" onClick={loadBrands} loading={loadingBrands}>
                        Tentar Novamente
                    </Button>
                </Empty>
            ) : (
                <Spin spinning={loading || loadingBrands}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Marca"
                            name="brand_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Marca é obrigatória',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Selecione a marca"
                                loading={loadingBrands}
                                onChange={handleBrandChange}
                                notFoundContent={
                                    loadingBrands ? <Spin size="small" /> : <Empty description="Nenhuma marca disponível" />
                                }
                            >
                                {brands.map((brand) => (
                                    <Select.Option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Modelo"
                            name="model_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Modelo é obrigatório',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Selecione o modelo"
                                loading={loadingModels}
                                disabled={!selectedBrandId}
                                notFoundContent={
                                    loadingModels ? (
                                        <Spin size="small" />
                                    ) : !selectedBrandId ? (
                                        <Empty description="Selecione uma marca" />
                                    ) : (
                                        <Empty description="Nenhum modelo disponível" />
                                    )
                                }
                            >
                                {models.map((model) => (
                                    <Select.Option key={model.id} value={model.id}>
                                        {model.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Ano de Fabricação"
                            name="year"
                            rules={[
                                {
                                    required: true,
                                    message: 'Ano é obrigatório',
                                },
                            ]}
                        >
                            <InputNumber
                                min={1990}
                                max={currentYear}
                                placeholder="2020"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Placa"
                            name="plate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Placa é obrigatória',
                                },
                                {
                                    pattern: /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/,
                                    message: 'Placa inválida (ABC1234 ou ABC1D23)',
                                },
                            ]}
                        >
                            <Input
                                placeholder="ABC1234"
                                maxLength={8}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Chassi"
                            name="chassis"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chassi é obrigatório',
                                },
                                {
                                    min: 17,
                                    message: 'Chassi deve ter 17 caracteres',
                                },
                            ]}
                        >
                            <Input
                                placeholder="9BWZZZ377VT004251"
                                maxLength={17}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Cor"
                            name="color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Cor é obrigatória',
                                },
                            ]}
                        >
                            <Select placeholder="Selecione a cor">
                                <Select.Option value="Preto">Preto</Select.Option>
                                <Select.Option value="Branco">Branco</Select.Option>
                                <Select.Option value="Cinza">Cinza</Select.Option>
                                <Select.Option value="Prata">Prata</Select.Option>
                                <Select.Option value="Vermelho">Vermelho</Select.Option>
                                <Select.Option value="Azul">Azul</Select.Option>
                                <Select.Option value="Verde">Verde</Select.Option>
                                <Select.Option value="Amarelo">Amarelo</Select.Option>
                                <Select.Option value="Laranja">Laranja</Select.Option>
                                <Select.Option value="Marrom">Marrom</Select.Option>
                                <Select.Option value="Bege">Bege</Select.Option>
                                <Select.Option value="Outro">Outro</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="RENAVAM (Opcional)"
                            name="renavam"
                            rules={[
                                {
                                    pattern: /^\d{11}$/,
                                    message: 'RENAVAM deve ter 11 dígitos',
                                },
                            ]}
                        >
                            <Input placeholder="12345678901" maxLength={11} />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                                Cadastrar Veículo
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            )}
        </Modal>
    );
};

export default RegisterVehicleModal;