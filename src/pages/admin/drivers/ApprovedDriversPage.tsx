import React, { useState, useEffect } from 'react';
import {
    Card,
    Drawer,
    Descriptions,
    Button,
    Space,
    Spin,
    Modal,
    Tag,
    Empty,
    Select,
    Input,
    Row,
    Col,
    App,
    Avatar,
} from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { HighlightText } from '@/components/HighlightText';
import { BookIcon } from '@/components/BookIcon';
import dayjs from 'dayjs';
import { escapeHtml, formatPhone } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';
import adminDriversService, { AdminDriver } from '@/services/adminDriversService';
import api from '@/services/api';

const statusColorMap: Record<string, string> = {
    AWAITING_CNH: 'warning',
    AWAITING_VEHICLE: 'processing',
    ACTIVE: 'success',
    INACTIVE: 'default',
    REJECTED: 'error',
};

const statusLabelMap: Record<string, string> = {
    AWAITING_CNH: 'Aguardando CNH',
    AWAITING_VEHICLE: 'Aguardando Veículo',
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    REJECTED: 'Rejeitado',
};

export const ApprovedDriversPage: React.FC = () => {
    const { message } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { searchQuery } = useSearch();

    const [drivers, setDrivers] = useState<AdminDriver[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<AdminDriver | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });
    const [cursor, setCursor] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | 'AWAITING_CNH' | 'AWAITING_VEHICLE' | 'REJECTED' | undefined>('ACTIVE');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchApprovedDrivers();
    }, [statusFilter, searchText]);

    const fetchApprovedDrivers = async () => {
        setLoading(true);
        try {
            console.log('Carregando motoristas aprovados.. .');

            const response = await adminDriversService.listDrivers({
                limit: pagination.pageSize,
                cursor: cursor,
                sort: '-createdAt',
                status: statusFilter || 'ACTIVE',
                q: searchText || undefined,
            } as any);

            console. log('Motoristas aprovados carregados:', response?. items?.length || 0);

            setDrivers(response?.items || []);
            setPagination((prev) => ({
                ...prev,
                total: response?.totalCount || 0,
            }));
            setCursor(response?.nextCursor || null);
        } catch (error: any) {
            console.error('Erro ao carregar motoristas aprovados:', error);
            message.error(error?.message || 'Erro ao carregar motoristas aprovados');
            setDrivers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDriver = async (driverId: string) => {
        Modal.confirm({
            title: 'Deletar Motorista',
            content: 'Tem certeza que deseja deletar este motorista?  Esta ação pode ser revertida.',
            okText: 'Deletar',
            cancelText: 'Cancelar',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    setLoading(true);
                    console.log('Deletando motorista:', driverId);

                    await adminDriversService.deleteDriver(driverId);

                    message.success('Motorista deletado com sucesso! ');
                    setDrawerVisible(false);
                    await fetchApprovedDrivers();
                } catch (error: any) {
                    console.error('Erro ao deletar motorista:', error);
                    message.error(error?.message || 'Erro ao deletar motorista');
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const filteredDrivers = drivers.filter(
        (driver) =>
            !searchQuery ||
            driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.cpf.includes(searchQuery) ||
            driver.cnhNumber.includes(searchQuery)
    );

    const getProfilePhotoUrl = (userId: string) => {
        const token = localStorage.getItem('access_token');
        const base = api.defaults.baseURL || '';
        const query = token ? `?token=${encodeURIComponent(token)}` : '';
        return `${base}/v1/profile-photos/${userId}${query}`;
    };

    const columns = [
        {
            title: 'Motorista',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: AdminDriver) => (
                <Space size="small">
                    <Avatar
                        size={40}
                        src={getProfilePhotoUrl(record.userId)}
                        alt={record.name}
                        style={{ backgroundColor: '#F7B733', color: '#111827', fontWeight: 700 }}
                    >
                        {record.name?.[0]}
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <HighlightText text={escapeHtml(record.name)} />
                        <span style={{ color: '#6B7280', fontSize: 12 }}>{record.email}</span>
                    </div>
                </Space>
            ),
            sorter: (a: AdminDriver, b: AdminDriver) => a.name.localeCompare(b.name),
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
            render: (text: string) => <HighlightText text={text} />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={statusColorMap[status] || 'default'}>
                    {statusLabelMap[status] || status}
                </Tag>
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 80,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: AdminDriver) => (
                <Button
                    type="text"
                    size="small"
                    icon={<BookIcon style={{ color: '#0374C8' }} />}
                    onClick={() => {
                        setSelectedDriver(record);
                        setDrawerVisible(true);
                    }}
                    title="Ver detalhes"
                />
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
                }}
                styles={{ body: { padding: '16px' } }}
            >
                <Row gutter={[12, 12]} style={{ marginBottom: '16px' }} align="middle">
                    <Col flex="auto">
                        <Input.Search
                            placeholder="Buscar por nome, CPF ou CNH..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col flex="120px">
                        <Select
                            allowClear
                            placeholder="Filtro"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            options={[
                                { label: 'Ativo', value: 'ACTIVE' },
                                { label: 'Inativo', value: 'INACTIVE' },
                                { label: 'Aguardando CNH', value: 'AWAITING_CNH' },
                                { label: 'Aguardando Veículo', value: 'AWAITING_VEHICLE' },
                                { label: 'Rejeitado', value: 'REJECTED' },
                            ]}
                        />
                    </Col>
                    <Col flex="100px">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => fetchApprovedDrivers()}
                            loading={loading}
                            style={{ width: '100%' }}
                        >
                            Atualizar
                        </Button>
                    </Col>
                </Row>

                <Spin spinning={loading}>
                    {filteredDrivers.length > 0 ? (
                        <div style={{ marginRight: '-16px', marginBottom: '-16px', marginLeft: '-16px' }}>
                            <ProfessionalTable
                                columns={columns}
                                dataSource={filteredDrivers}
                                rowKey="userId"
                                pagination={{
                                    pageSize: pagination.pageSize,
                                    current: pagination.current,
                                    total: pagination.total,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    showTotal: (total) => `Total: ${total} motoristas`,
                                    onChange: (page, pageSize) =>
                                        setPagination({ current: page, pageSize, total: pagination.total }),
                                }}
                                scroll={{ x: 'max-content' }}
                            />
                        </div>
                    ) : (
                        <Empty description="Nenhum motorista encontrado" />
                    )}
                </Spin>
            </Card>

            <Drawer
                title={`Detalhes do Motorista - ${selectedDriver?.name || '-'}`}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={750}
            >
                {selectedDriver && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <Space size={12}>
                                <Avatar
                                    size={80}
                                    src={getProfilePhotoUrl(selectedDriver.userId)}
                                    alt={selectedDriver.name}
                                    style={{ backgroundColor: '#F7B733', color: '#111827', fontWeight: 700 }}
                                >
                                    {selectedDriver.name?.[0]}
                                </Avatar>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 18 }}>{escapeHtml(selectedDriver.name)}</h3>
                                    <div style={{ color: '#6B7280', fontSize: 13 }}>{selectedDriver.email}</div>
                                </div>
                            </Space>

                            <Space>
                                <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteDriver(selectedDriver.userId)}
                                    title="Deletar"
                                />
                            </Space>
                        </div>

                        <div>
                            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                                Informações Básicas
                            </h3>
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="ID">{selectedDriver.userId}</Descriptions.Item>
                                <Descriptions.Item label="Nome">
                                    {escapeHtml(selectedDriver.name)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {escapeHtml(selectedDriver.email)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Telefone">
                                    {formatPhone(selectedDriver.phone)}
                                </Descriptions.Item>
                                <Descriptions.Item label="CNH">{selectedDriver.cnhNumber}</Descriptions.Item>
                                <Descriptions.Item label="Validade da CNH">
                                    {dayjs(selectedDriver.cnhExpirationDate).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email Verificado">
                                    {selectedDriver.emailVerified ? (
                                        <Tag color="success">Sim</Tag>
                                    ) : (
                                        <Tag color="error">Não</Tag>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Última Atualização">
                                    {dayjs(selectedDriver.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                                </Descriptions.Item>
                                <Descriptions.Item label="CPF">{selectedDriver.cpf}</Descriptions.Item>
                                <Descriptions.Item label="Categoria CNH">
                                    {selectedDriver.cnhCategory}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Tag color={statusColorMap[selectedDriver.status]}>
                                        {statusLabelMap[selectedDriver.status]}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Data de Registro">
                                    {dayjs(selectedDriver.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Space>
                )}
            </Drawer>

            <style>{`
                .ant-table-wrapper {
                    margin: 0 !important;
                }
                .ant-table {
                    margin: 0 !important;
                }
                .ant-pagination {
                    margin-top: 16px ! important;
                    margin-right: 16px ! important;
                    margin-left: 16px ! important;
                    margin-bottom: 16px ! important;
                }
            `}</style>
        </>
    );
};

export default ApprovedDriversPage;