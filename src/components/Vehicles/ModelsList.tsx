import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Space,
    Input,
    Popconfirm,
    Card,
    Row,
    Col,
    Spin,
    Empty,
    Tag,
    App,
    Drawer,
    Descriptions,
    Divider,
    Alert,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { VehicleModel, VehicleBrand } from '@/types/vehicle-reference';
import vehicleReferenceService from '@/services/vehicleReferenceService';
import vehicleCategoryRequirementsService, { VehicleCategoryRequirement } from '@/services/vehicleCategoryRequirementsService';
import { ModelForm } from './ModelForm';
import { useTheme } from '@/themes/ThemeProvider';
import { BookIcon } from '@/components/BookIcon';
import serviceCategoryService from '@/services/serviceCategoryService';

interface ModelsListProps {
    refreshTrigger?:  number;
    brandId?: string;
    brands?: VehicleBrand[];
}

export const ModelsList: React.FC<ModelsListProps> = ({
    refreshTrigger = 0,
    brandId,
    brands:  externalBrands,
}) => {
    const { message:  msgApi } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const [models, setModels] = useState<VehicleModel[]>([]);
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [categoryRequirements, setCategoryRequirements] = useState<VehicleCategoryRequirement[]>([]);
    const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [selectedModel, setSelectedModel] = useState<VehicleModel | undefined>();
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedModelForDetails, setSelectedModelForDetails] = useState<VehicleModel | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });

    const loadModels = useCallback(async () => {
        setLoading(true);
        try {
            console.log('📦 Carregando modelos com filtros:', { search: searchText });
            const response = await vehicleReferenceService.listModels({
                // traz mais itens para permitir filtro local responsivo
                limit: 200,
                sort: '-createdAt,name',
                q: searchText || undefined,
                brandId:   brandId || undefined,
            });

            const reqResponse = await vehicleCategoryRequirementsService. listRequirements();
            const categoriesResponse = await serviceCategoryService.list({ limit: 200 });

            if (response.success && response.data) {
                console.log('✅ Modelos carregados:', response.data.items?. length || 0);
                const items = response.data.items || [];
                // aplica filtro local para garantir busca mesmo se o backend não filtrar
                const term = (searchText || '').toLowerCase();
                const filtered = term
                    ? items.filter((m) =>
                        m.name.toLowerCase().includes(term) ||
                        m. slug.toLowerCase().includes(term)
                    )
                    : items;
                setModels(filtered);
                setPagination((prev) => ({
                    ... prev,
                    total: filtered.length || response.data?. totalCount || 0,
                }));
            } else {
                msgApi. error(response.error || 'Erro ao carregar modelos');
                setModels([]);
            }

            if (reqResponse.success && reqResponse.data) {
                setCategoryRequirements(reqResponse.data);
                console.log('✅ Requisitos carregados:', reqResponse.data. length);
            }

            if (categoriesResponse?. items) {
                const map = categoriesResponse.items.reduce<Record<string, string>>((acc, cat) => {
                    acc[cat.id] = cat.name;
                    return acc;
                }, {});
                setCategoryNames(map);
            } else {
                setCategoryNames({});
            }
        } catch (error:   any) {
            msgApi.error('Erro ao carregar modelos');
            console.error(error);
            setModels([]);
        } finally {
            setLoading(false);
        }
    }, [searchText, brandId, msgApi]);

    const loadBrands = async () => {
        if (externalBrands && externalBrands.length) {
            setBrands(externalBrands);
            return;
        }
        try {
            const response = await vehicleReferenceService.listBrands({
                limit: 100,
            });
            if (response.success && response.data) {
                setBrands(response.data.items || []);
            }
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        }
    };

    // carrega dados quando abre ou quando filtros externos mudam
    useEffect(() => {
        setPagination((prev) => ({ ...prev, current: 1 }));
        void loadModels();
        void loadBrands();
    }, [refreshTrigger, brandId, externalBrands, loadModels]);

    // quando searchText mudar, buscar no servidor com debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPagination((prev) => ({ ...prev, current: 1 }));
            void loadModels();
        }, 500); // debounce de 500ms

        return () => clearTimeout(timeoutId);
    }, [searchText, loadModels]);

    const handleDelete = async (id: string) => {
        try {
            const response = await vehicleReferenceService.deleteModel(id);
            if (response.success) {
                msgApi.success('Modelo deletado com sucesso!  ');
                void loadModels();
            } else {
                msgApi. error(response.error || 'Erro ao deletar modelo');
            }
        } catch (error:  any) {
            msgApi. error('Erro ao deletar modelo');
        }
    };

    const handleEdit = (model: VehicleModel) => {
        setSelectedModel(model);
        setFormVisible(true);
    };

    const handleCreate = () => {
        setSelectedModel(undefined);
        setFormVisible(true);
    };

    const handleViewDetails = (model: VehicleModel) => {
        setSelectedModelForDetails(model);
        setDetailsVisible(true);
    };

    const handleRefresh = () => {
        void loadModels();
    };

    const getBrandName = (brandId: string) => {
        const brand = brands. find(b => b.id === brandId);
        return brand?. name || 'Desconhecida';
    };


    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            sorter: (a: VehicleModel, b: VehicleModel) => a.name.localeCompare(b.name),
        },
        {
            title:   'Marca',
            dataIndex: 'brandId',
            key: 'brand',
            width: '20%',
            render: (brandId: string) => (
                <Tag color="blue">{getBrandName(brandId)}</Tag>
            ),
        },
        {
            title:   'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '20%',
        },
        {
            title:   'Criado em',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width:  '15%',
            render:  (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title:  'Ações',
            key: 'actions',
            width: 140,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: VehicleModel) => (
                <Space size="small">
                    <Button
                        type="text"
                        size="small"
                        icon={<BookIcon style={{ color: '#0374C8' }} />}
                        onClick={() => handleViewDetails(record)}
                        title="Ver detalhes"
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        style={{ color: '#B8860B' }}
                        onClick={() => handleEdit(record)}
                        title="Editar"
                    />
                    <Popconfirm
                        title="Deletar modelo"
                        description="Tem certeza que deseja deletar este modelo?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
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
                    marginBottom: 0,
                }}
                styles={{ body: { padding: '16px' } }}
            >
                <Spin spinning={loading}>
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
                        <Col xs={24} sm={12}>
                            <Input
                                placeholder="Buscar por nome ou slug..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <Button
                                type="text"
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                loading={loading}
                            >
                                Recarregar
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleCreate}
                            >
                                Novo Modelo
                            </Button>
                        </Col>
                    </Row>

                    {models.length > 0 ?   (
                        <div style={{ marginLeft: -16, marginRight: -16, marginBottom: -16 }}>
                            <ProfessionalTable
                                columns={columns}
                                dataSource={models. map((model) => ({
                                    ...model,
                                    key: model.id,
                                }))}
                                pagination={{
                                    current: pagination. current,
                                    pageSize: pagination.pageSize,
                                    total: pagination.total,
                                    onChange: (page, pageSize) => {
                                        setPagination((prev) => ({
                                            ...prev,
                                            current: page,
                                            pageSize,
                                        }));
                                    },
                                }}
                            />
                        </div>
                    ) : (
                        <Empty description="Nenhum modelo encontrado" />
                    )}
                </Spin>
            </Card>

            {/* Modal de Criação/Edição */}
            <ModelForm
                visible={formVisible}
                model={selectedModel}
                brandId={brandId}
                brands={brands}
                onClose={() => setFormVisible(false)}
                onSuccess={() => {
                    void loadModels();
                }}
            />

            {/* Drawer de Informações Completas */}
            <Drawer
                title="Informações Completas do Modelo"
                placement="right"
                onClose={() => setDetailsVisible(false)}
                open={detailsVisible}
                width={600}
            >
                {selectedModelForDetails && (
                    <>
                        <Descriptions
                            bordered
                            column={1}
                            style={{ marginBottom: 24 }}
                        >
                            <Descriptions.Item label="ID do Modelo">
                                <code>{selectedModelForDetails.id}</code>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nome">
                                {selectedModelForDetails.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Slug">
                                {selectedModelForDetails.slug}
                            </Descriptions.Item>
                            <Descriptions.Item label="ID da Marca">
                                <code>{selectedModelForDetails.brandId}</code>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nome da Marca">
                                {getBrandName(selectedModelForDetails.brandId)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Criado em">
                                {dayjs(selectedModelForDetails. createdAt).format(
                                    'DD/MM/YYYY HH:mm:ss'
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Atualizado em">
                                {dayjs(selectedModelForDetails.updatedAt).format(
                                    'DD/MM/YYYY HH:mm:ss'
                                )}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider>Requisitos de Categoria</Divider>

                        {categoryRequirements.length > 0 ? (
                            <Descriptions bordered column={1}>
                                {categoryRequirements.map((req) => (
                                    <Descriptions.Item
                                        key={req.id}
                                        label={`Categoria`}
                                    >
                                        <Tag color="cyan">
                                            {categoryNames[req.serviceCategoryId] || req.serviceCategoryId}
                                        </Tag>
                                        <span style={{ marginLeft: 8 }}>Ano Mínimo: {req.minYear}</span>
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        ) : (
                            <Alert
                                message="Nenhum requisito de categoria configurado"
                                type="info"
                                showIcon
                            />
                        )}

                        <Divider />

                        <Alert
                            message="Informação do Sistema"
                            description="Use os IDs acima para referência em integrações com a API"
                            type="info"
                            showIcon
                        />
                    </>
                )}
            </Drawer>
        </>
    );
};