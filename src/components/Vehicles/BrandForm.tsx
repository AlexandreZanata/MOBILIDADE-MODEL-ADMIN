import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Spin } from 'antd';
import { VehicleBrand } from '@/types/vehicle-reference';
import vehicleReferenceService from '@/services/vehicleReferenceService';

interface BrandFormProps {
    visible: boolean;
    brand?: VehicleBrand;
    onClose: () => void;
    onSuccess: () => void;
}

export const BrandForm: React.FC<BrandFormProps> = ({
                                                        visible,
                                                        brand,
                                                        onClose,
                                                        onSuccess,
                                                    }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (brand) {
                form. setFieldsValue({
                    name: brand.name,
                    slug: brand. slug,
                });
            } else {
                form.resetFields();
            }
        }
    }, [brand, form, visible]);

    const handleSubmit = async (values: { name: string; slug: string }) => {
        setLoading(true);
        try {
            if (brand) {
                const response = await vehicleReferenceService.updateBrand(brand. id, values);
                if (response.success) {
                    message.success('Marca atualizada com sucesso!');
                    onSuccess();
                    onClose();
                } else {
                    message.error(response. error || 'Erro ao atualizar marca');
                }
            } else {
                const response = await vehicleReferenceService.createBrand(values);
                if (response.success) {
                    message.success('Marca criada com sucesso!');
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.error || 'Erro ao criar marca');
                }
            }
        } catch (error: any) {
            message. error('Erro ao processar requisição');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={brand ? 'Editar Marca' : 'Criar Nova Marca'}
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar"
            cancelText="Cancelar"
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Nome da Marca"
                        name="name"
                        rules={[
                            { required: true, message: 'Nome é obrigatório' },
                            { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
                        ]}
                    >
                        <Input
                            placeholder="Ex: Toyota"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Slug (URL)"
                        name="slug"
                        rules={[
                            { required: true, message: 'Slug é obrigatório' },
                            {
                                pattern: /^[a-z0-9-]+$/,
                                message: 'Slug deve conter apenas letras minúsculas, números e hífen',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Ex: toyota"
                            disabled={loading}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};