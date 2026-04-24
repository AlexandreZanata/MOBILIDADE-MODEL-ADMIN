import React, { useState, useEffect } from 'react';
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
import { VehicleBrand } from '@/types/vehicle-reference';
import vehicleReferenceService from '@/services/vehicleReferenceService';
import { BrandForm } from './BrandForm';
import { useTheme } from '@/themes/ThemeProvider';

interface BrandsListProps {
    refreshTrigger?: number;
}

export const BrandsList: React.FC<BrandsListProps> = ({ refreshTrigger = 0 }) => {
    const { message: msgApi } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | undefined>();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });

    const loadBrands = async () => {
        setLoading(true);
        try {
            console.log('📦 Carregando marcas com filtros:', { search: searchText });
            const response = await vehicleReferenceService.listBrands({
                limit: pagination.pageSize,
                sort: '-createdAt,name',
                q: searchText || undefined,
            });

            if (response.success && response.data) {
                console.log('✅ Marcas carregadas:', response.data. items?. length || 0);
                setBrands(response.data.items || []);
                setPagination((prev) => ({
                    ... prev,
                    total: response.data?. totalCount || 0,
                }));
            } else {
                msgApi.error(response. error || 'Erro ao carregar marcas');
                setBrands([]);
            }
        } catch (error: any) {
            msgApi. error('Erro ao carregar marcas');
            console.error(error);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPagination((prev) => ({ ...prev, current: 1 }));
        loadBrands();
    }, [searchText, refreshTrigger]);

    const handleDelete = async (id: string) => {
        try {
            const response = await vehicleReferenceService.deleteBrand(id);
            if (response.success) {
                msgApi.success('Marca deletada com sucesso! ');
                loadBrands();
            } else {
                msgApi.error(response.error || 'Erro ao deletar marca');
            }
        } catch (error: any) {
            msgApi.error('Erro ao deletar marca');
        }
    };

    const handleEdit = (brand: VehicleBrand) => {
        setSelectedBrand(brand);
        setFormVisible(true);
    };

    const handleCreate = () => {
        setSelectedBrand(undefined);
        setFormVisible(true);
    };

    const handleRefresh = () => {
        loadBrands();
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '30%',
            render: (text: string) => <Tag>{text}</Tag>,
        },
        {
            title: 'Data de Criação',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: '',
            key: 'actions',
            width: '10%',
            fixed: 'right' as const,
            align: 'right' as const,
            render: (_: any, record: VehicleBrand) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Deletar marca"
                        description="Tem certeza que deseja deletar esta marca?"
                        onConfirm={() => handleDelete(record. id)}
                        okText="Sim"
                        cancelText="Não"
                        okButtonProps={{ danger: true }}
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
        <>
            {/* Card Unificado - Filtros + Tabela */}
            <Card
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
                styles={{ body: { padding: '16px' } }}
            >
                {/* Linha de Filtros */}
                <Row gutter={[12, 12]} style={{ marginBottom: '16px' }} align="middle">
                    <Col flex="auto">
                        <Input.  Search
                                 placeholder="Buscar por nome..."
                                 value={searchText}
                                 onChange={(e) => setSearchText(e.target. value)}
                                 allowClear
                                 size="large"
                                 prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col flex="120px">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreate}
                            style={{ width: '100%' }}
                        >
                            Nova
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={loading}
                            style={{ width: '100%' }}
                        >
                            Atualizar
                        </Button>
                    </Col>
                </Row>

                {/* Tabela */}
                <Spin spinning={loading}>
                    {brands.length > 0 ? (
                        <div style={{ marginRight: '-16px', marginBottom: '-16px', marginLeft: '-16px' }}>
                            <ProfessionalTable
                                columns={columns}
                                dataSource={brands}
                                rowKey="id"
                                pagination={{
                                    pageSize: pagination.pageSize,
                                    current: pagination.current,
                                    total: pagination.total,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    showTotal: (total) => `Total: ${total} marca(s)`,
                                    onChange: (page, pageSize) => {
                                        setPagination({ current: page, pageSize, total: pagination.total });
                                    },
                                }}
                                scroll={{ x: 'max-content' }}
                            />
                        </div>
                    ) : (
                        <Empty
                            description="Nenhuma marca encontrada"
                            style={{ padding: '50px 0' }}
                        />
                    )}
                </Spin>
            </Card>

            {/* Form Modal */}
            <BrandForm
                visible={formVisible}
                brand={selectedBrand}
                onClose={() => {
                    setFormVisible(false);
                    setSelectedBrand(undefined);
                }}
                onSuccess={() => loadBrands()}
            />
        </>
    );
};