import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Checkbox, Space, Card, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTripCategories } from '@/hooks/useTripCategories';
import { TripCategory, TripCategoryFormData } from '@/types/payment';

export const TripCategoriesPage: React.FC = () => {
    const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useTripCategories();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        void fetchCategories();
    }, [fetchCategories]);

    const handleOpenModal = (category?: TripCategory) => {
        if (category) {
            setEditingId(category.id);
            form.setFieldsValue(category);
        } else {
            setEditingId(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingId(null);
        form.resetFields();
    };

    const handleSubmit = async (values: TripCategoryFormData) => {
        if (editingId) {
            const result = await updateCategory(editingId, values);
            if (result) {
                await fetchCategories();
                handleCloseModal();
            }
        } else {
            const result = await createCategory(values);
            if (result) {
                await fetchCategories();
                handleCloseModal();
            }
        }
    };

    const handleDelete = async (id: string) => {
        const success = await deleteCategory(id);
        if (success) {
            await fetchCategories();
        }
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            ellipsis: true,
        },
        {
            title: 'Multiplicador de Preço',
            dataIndex: 'price_multiplier',
            key: 'price_multiplier',
            width: '18%',
            render: (value: number) => `${value.toFixed(2)}x`,
        },
        {
            title: 'Ativo',
            dataIndex: 'active',
            key: 'active',
            width: '12%',
            render: (value: boolean) => (value ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: '15%',
            render: (_: any, record: TripCategory) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title="Deletar categoria"
                        description="Tem certeza que deseja deletar esta categoria?"
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

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Categorias de Corrida</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenModal()}
                    >
                        Nova Categoria
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={Array.isArray(categories) ? categories : []}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingId ? 'Editar Categoria de Corrida' : 'Nova Categoria de Corrida'}
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
                        label="Nome"
                        name="name"
                        rules={[{ required: true, message: 'Nome é obrigatório' }]}
                    >
                        <Input placeholder="Ex: Comfort" />
                    </Form.Item>

                    <Form.Item
                        label="Descrição"
                        name="description"
                    >
                        <Input.TextArea placeholder="Descrição da categoria" rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Multiplicador de Preço"
                        name="price_multiplier"
                        rules={[{ required: true, message: 'Multiplicador é obrigatório' }]}
                    >
                        <InputNumber
                            min={0.1}
                            step={0.1}
                            placeholder="Ex: 1.5"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ativo"
                        name="active"
                        valuePropName="checked"
                    >
                        <Checkbox>Categoria ativa</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TripCategoriesPage;