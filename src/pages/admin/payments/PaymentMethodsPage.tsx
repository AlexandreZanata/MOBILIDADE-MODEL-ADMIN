import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, Tag, Divider, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethod, ServiceCategory, ServiceCategoryFormData, PaymentBrand } from '@/types/payment';
import serviceCategoryService from '@/services/serviceCategoryService';
import { paymentService } from '@/services/api/paymentService';

export const PaymentMethodsPage: React.FC = () => {
    const { methods, loading, fetchMethods, deleteMethod } = usePaymentMethods();
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [brands, setBrands] = useState<PaymentBrand[]>([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [categoryForm] = Form.useForm<ServiceCategoryFormData>();

    useEffect(() => {
        fetchMethods();
        loadCategories();
        loadBrands();
    }, [fetchMethods]);

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

    const loadBrands = async () => {
        setBrandsLoading(true);
        try {
            const response = await paymentService.getCardBrands();
            setBrands(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar bandeiras', error);
            message.error('Erro ao carregar bandeiras de cartão');
            setBrands([]);
        } finally {
            setBrandsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const success = await deleteMethod(id);
        if (success) {
            await fetchMethods();
        }
    };

    const handleOpenCategoryModal = (category?: ServiceCategory) => {
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
        categoryForm.resetFields();
    };

    const handleSubmitCategory = async (values: ServiceCategoryFormData) => {
        if (editingCategoryId) {
            await serviceCategoryService.update(editingCategoryId, values);
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

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '15%',
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            width: '20%',
            ellipsis: true,
        },
        {
            title: 'Requer Bandeira',
            dataIndex: 'requires_card_brand',
            key: 'requires_card_brand',
            width: '12%',
            render: (value: boolean) => (value ? <Tag color="blue">Sim</Tag> : <Tag>Não</Tag>),
        },
        {
            title: 'Ativo',
            dataIndex: 'active',
            key: 'active',
            width: '10%',
            render: (value: boolean) => (value ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: '8%',
            render: (_: any, record: PaymentMethod) => (
                <Popconfirm
                    title="Deletar método de pagamento"
                    description="Tem certeza que deseja deletar este método?"
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
            ),
        },
    ];

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
            title: 'Tarifa Base',
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

    const brandColumns = [
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
            width: '30%',
        },
        {
            title: 'Ativo',
            dataIndex: 'enabled',
            key: 'enabled',
            width: '15%',
            render: (value: boolean) => (value ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0 }}>Métodos de Pagamento</h2>
            </div>
            <Table
                columns={columns}
                dataSource={Array.isArray(methods) ? methods : []}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ margin: 0 }}>Bandeiras de Cartão</h2>
            </div>
            <Table
                columns={brandColumns}
                dataSource={Array.isArray(brands) ? brands : []}
                loading={brandsLoading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
                <h2 style={{ margin: 0 }}>Categorias de Serviço</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenCategoryModal()}>
                    Nova Categoria
                </Button>
            </div>
            <Table
                columns={categoryColumns}
                dataSource={Array.isArray(categories) ? categories : []}
                loading={categoriesLoading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />


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
                        rules={[{ required: true, message: 'Nome é obrigatório' }]}
                    >
                        <Input placeholder="Ex: Econômico" />
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
        </div>
    );
};

export default PaymentMethodsPage;