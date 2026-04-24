import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, Space, Spin, Divider, Row, Col, Statistic } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTripPricing } from '@/hooks/useTripPricing';
import { TripPricingFormData } from '@/types/payment';

export const TripPricingPage: React.FC = () => {
    const { pricing, loading, fetchPricing, updatePricing } = useTripPricing();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        void fetchPricing();
    }, [fetchPricing]);

    useEffect(() => {
        if (pricing) {
            form.setFieldsValue(pricing);
        }
    }, [pricing, form]);

    const handleSubmit = async (values: TripPricingFormData) => {
        setIsSubmitting(true);
        try {
            await updatePricing(values);
            await fetchPricing();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Spin spinning={loading && !pricing}>
                <Card>
                    <h2 style={{ marginBottom: '24px' }}>Configuração de Tarifas de Corrida</h2>

                    {pricing && (
                        <>
                            <Row gutter={16} style={{ marginBottom: '32px' }}>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic
                                        title="Tarifa Mínima"
                                        value={pricing.minimum_fare}
                                        prefix="R$ "
                                        precision={2}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic
                                        title="Preço por KM"
                                        value={pricing.price_per_km}
                                        prefix="R$ "
                                        precision={2}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic
                                        title="Taxa Base"
                                        value={pricing.base_fee}
                                        prefix="R$ "
                                        precision={2}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic
                                        title="Multiplicador de Surge"
                                        value={pricing.surge_multiplier}
                                        precision={2}
                                        suffix="x"
                                    />
                                </Col>
                            </Row>

                            <Divider />

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                <Form.Item
                                    label="Tarifa Mínima (R$)"
                                    name="minimum_fare"
                                    rules={[
                                        { required: true, message: 'Tarifa mínima é obrigatória' },
                                        { type: 'number', min: 0, message: 'Deve ser um valor positivo' },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        step={0.5}
                                        precision={2}
                                        style={{ width: '100%' }}
                                        placeholder="Ex: 5.00"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Preço por KM (R$)"
                                    name="price_per_km"
                                    rules={[
                                        { required: true, message: 'Preço por km é obrigatório' },
                                        { type: 'number', min: 0, message: 'Deve ser um valor positivo' },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        step={0.1}
                                        precision={2}
                                        style={{ width: '100%' }}
                                        placeholder="Ex: 2.50"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Taxa Base (R$)"
                                    name="base_fee"
                                    rules={[
                                        { required: true, message: 'Taxa base é obrigatória' },
                                        { type: 'number', min: 0, message: 'Deve ser um valor positivo' },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        step={0.5}
                                        precision={2}
                                        style={{ width: '100%' }}
                                        placeholder="Ex: 2.00"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Multiplicador de Surge Pricing"
                                    name="surge_multiplier"
                                    rules={[
                                        { required: true, message: 'Multiplicador é obrigatório' },
                                        { type: 'number', min: 1, message: 'Deve ser maior ou igual a 1' },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        step={0.1}
                                        precision={2}
                                        style={{ width: '100%' }}
                                        placeholder="Ex: 1.50"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            loading={isSubmitting}
                                        >
                                            Salvar Configurações
                                        </Button>
                                        <Button
                                            icon={<ReloadOutlined />}
                                            onClick={() => fetchPricing()}
                                        >
                                            Recarregar
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default TripPricingPage;