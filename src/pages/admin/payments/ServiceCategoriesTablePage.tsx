import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, Divider, Card, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ServiceCategory, ServiceCategoryFormData } from '@/types/payment';
import serviceCategoryService from '@/services/serviceCategoryService';
import { useTheme } from '@/themes/ThemeProvider';

export const ServiceCategoriesTablePage: React.FC = () => {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [categoryForm] = Form.useForm<ServiceCategoryFormData>();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    useEffect(() => {
        void loadCategories();
    }, []);

    const loadCategories = async () => {
        setCategoriesLoading(true);
        try {
            const response = await serviceCategoryService.list({ limit: 100 });
            setCategories(response.items || []);
        } catch (error) {
            console.error('Erro ao carregar categorias de serviço', error);
            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleOpenCategoryModal = (category?:  ServiceCategory) => {
        if (category) {
            setEditingCategoryId(category.id);
            categoryForm.setFieldsValue({
                name: category.name,
                slug: category.slug,
                baseFare: category.baseFare,
                perKmRate: category.perKmRate,
                minFare: category.minFare,
            });
        } else {
            setEditingCategoryId(null);
            categoryForm.resetFields();
        }
        setCategoryModalVisible(true);
    };

    const handleCloseCategoryModal = () => {
        setCategoryModalVisible(false);
        setEditingCategoryId(null);
        categoryForm. resetFields();
    };

    const handleSubmitCategory = async (values: ServiceCategoryFormData) => {
        if (editingCategoryId) {
            await serviceCategoryService. update(editingCategoryId, values);
        } else {
            await serviceCategoryService.create(values);
        }
        await loadCategories();
        handleCloseCategoryModal();
    };

    const handleDeleteCategory = async (id: string) => {
        await serviceCategoryService.delete(id);
        await loadCategories();
    };

    const categoryColumns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '22%',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '18%',
        },
        {
            title:  'Tarifa Base',
            dataIndex: 'baseFare',
            key: 'baseFare',
            width: '12%',
            render: (value: number) => `R$ ${value.toFixed(2)}`,
        },
        {
            title: 'Preço por KM',
            dataIndex: 'perKmRate',
            key: 'perKmRate',
            width: '12%',
            render: (value: number) => `R$ ${value.toFixed(2)}`,
        },
        {
            title: 'Valor Mínimo',
            dataIndex: 'minFare',
            key: 'minFare',
            width: '12%',
            render: (value: number) => `R$ ${value.toFixed(2)}`,
        },
        {
            title: 'Ações',
            key: 'actions',
            width: '12%',
            render: (_: any, record: ServiceCategory) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenCategoryModal(record)}
                    />
                    <Popconfirm
                        title="Deletar categoria"
                        description="Tem certeza que deseja deletar esta categoria?"
                        onConfirm={() => handleDeleteCategory(record.id)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
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
                    marginTop: 0,
                    marginBottom: 16,
                }}
                styles={{ body: { padding: '16px' } }}
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenCategoryModal()}>
                        Nova Categoria
                    </Button>
                </div>

                <Spin spinning={categoriesLoading}>
                    <div style={{ marginLeft: -16, marginRight: -16, marginBottom: -16 }}>
                        <Table
                            columns={categoryColumns}
                            dataSource={Array. isArray(categories) ? categories : []}
                            loading={categoriesLoading}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </Spin>
            </Card>

            <Modal
                title={editingCategoryId ? 'Editar Categoria' : 'Nova Categoria'}
                open={categoryModalVisible}
                onOk={() => categoryForm.submit()}
                onCancel={handleCloseCategoryModal}
                okText={editingCategoryId ? 'Atualizar' : 'Criar'}
                cancelText="Cancelar"
            >
                <Form
                    form={categoryForm}
                    layout="vertical"
                    onFinish={handleSubmitCategory}
                >
                    <Form.Item
                        label="Nome"
                        name="name"
                        rules={[{ required: true, message:  'Nome é obrigatório' }]}
                    >
                        <Input placeholder="Ex:  Econômico" />
                    </Form.Item>

                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[{ required: true, message: 'Slug é obrigatório' }]}
                    >
                        <Input placeholder="ex: economico" />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        label="Tarifa Base"
                        name="baseFare"
                        rules={[{ required: true, message: 'Tarifa base é obrigatória' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            prefix="R$"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Preço por KM"
                        name="perKmRate"
                        rules={[{ required: true, message: 'Preço por km é obrigatório' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            prefix="R$"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Valor Mínimo"
                        name="minFare"
                        rules={[{ required: true, message: 'Valor mínimo é obrigatório' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            prefix="R$"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};