import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Checkbox, Space, Card, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { usePaymentBrands } from '@/hooks/usePaymentBrands';
import { PaymentBrand, PaymentBrandFormData } from '@/types/payment';

export const PaymentBrandsPage: React.FC = () => {
    const { methods, fetchMethods } = usePaymentMethods();
    const { brands, loading, fetchBrands, createBrand, updateBrand, deleteBrand } = usePaymentBrands();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedMethodId, setSelectedMethodId] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchMethods();
    }, [fetchMethods]);

    useEffect(() => {
        if (selectedMethodId) {
            fetchBrands(selectedMethodId);
        } else {
            // Reset brands when no method is selected
            // Note: This might need adjustment based on your hook implementation
        }
    }, [selectedMethodId, fetchBrands]);

    const handleOpenModal = (brand?: PaymentBrand) => {
        if (brand) {
            setEditingId(brand.id);
            form.setFieldsValue(brand);
        } else {
            setEditingId(null);
            form.resetFields();
            form.setFieldValue('payment_method_id', selectedMethodId);
        }
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingId(null);
        form.resetFields();
    };

    const handleSubmit = async (values: PaymentBrandFormData) => {
        if (editingId) {
            const result = await updateBrand(editingId, values);
            if (result && selectedMethodId) {
                await fetchBrands(selectedMethodId);
                handleCloseModal();
            }
        } else {
            const result = await createBrand(values);
            if (result && selectedMethodId) {
                await fetchBrands(selectedMethodId);
                handleCloseModal();
            }
        }
    };

    const handleDelete = async (id: string) => {
        const success = await deleteBrand(id);
        if (success && selectedMethodId) {
            await fetchBrands(selectedMethodId);
        }
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '25%',
        },
        {
            title: 'Ativo',
            dataIndex: 'active',
            key: 'active',
            width: '15%',
            render: (value: boolean) => (value ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>),
        },
        {
            title: 'Criado em',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '20%',
            render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: '10%',
            render: (_: any, record: PaymentBrand) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title="Deletar bandeira"
                        description="Tem certeza que deseja deletar esta bandeira?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const methodsArray = Array.isArray(methods) ? methods : [];

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: '24px' }}>
                    <Form layout="vertical">
                        <Form.Item
                            label="Selecione um Método de Pagamento"
                            required
                        >
                            <Select
                                placeholder="Escolha um método para ver suas bandeiras"
                                onChange={setSelectedMethodId}
                                value={selectedMethodId || undefined}
                                options={methodsArray.map(m => ({
                                    label: m.name,
                                    value: m.id,
                                }))}
                            />
                        </Form.Item>
                    </Form>
                </div>

                {selectedMethodId && (
                    <>
                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Bandeiras de Pagamento</h2>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => handleOpenModal()}
                            >
                                Nova Bandeira
                            </Button>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={Array.isArray(brands) ? brands : []}
                            loading={loading}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </>
                )}
            </Card>

            <Modal
                title={editingId ? 'Editar Bandeira de Pagamento' : 'Nova Bandeira de Pagamento'}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCloseModal}
                okText={editingId ? 'Atualizar' : 'Criar'}
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Método de Pagamento"
                        name="payment_method_id"
                        rules={[{ required: true, message: 'Método é obrigatório' }]}
                    >
                        <Select
                            placeholder="Selecione um método"
                            options={methodsArray.map(m => ({
                                label: m.name,
                                value: m.id,
                            }))}
                            disabled={!!editingId}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Nome"
                        name="name"
                        rules={[{ required: true, message: 'Nome é obrigatório' }]}
                    >
                        <Input placeholder="Ex: Visa" />
                    </Form.Item>

                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[{ required: true, message: 'Slug é obrigatório' }]}
                    >
                        <Input placeholder="Ex: visa" />
                    </Form.Item>

                    <Form.Item
                        label="Ativo"
                        name="active"
                        valuePropName="checked"
                    >
                        <Checkbox>Bandeira ativa</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PaymentBrandsPage;