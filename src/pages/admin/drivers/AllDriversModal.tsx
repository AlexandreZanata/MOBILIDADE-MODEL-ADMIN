import {
    Modal,
    Table,
    Button,
    Space,
    Tag,
    Input,
    Select,
    Row,
    Col,
    Card,
    Spin,
    Empty,
    Drawer,
    Descriptions,
    Avatar,
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { driverService } from '@/services/api/driverService.ts';

// Tipo compatível com a resposta da API
interface DriverApplication {
    userId: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cnhNumber: string;
    cnhExpirationDate: string;
    cnhCategory: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any; // Para campos adicionais que possam vir da API
}

interface AllDriversModalProps {
    visible: boolean;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'approved':
            return 'success';
        case 'rejected':
            return 'error';
        case 'pending':
            return 'processing';
        default:
            return 'default';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'approved':
            return 'Aprovado';
        case 'rejected':
            return 'Rejeitado';
        case 'pending':
            return 'Pendente';
        default:
            return status;
    }
};

export const AllDriversModal: React.FC<AllDriversModalProps> = ({ visible, onClose }) => {
    const [drivers, setDrivers] = useState<DriverApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [selectedDriver, setSelectedDriver] = useState<DriverApplication | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });

    useEffect(() => {
        if (visible) {
            loadAllDrivers();
        }
    }, [visible]);

    const loadAllDrivers = async () => {
        setLoading(true);
        try {
            const response = await driverService.getDriverApplications(undefined, 100);

            if (response.success && response.data) {
                const driversList = response.data.items || [];
                setDrivers(driversList);
            } else {
                setDrivers([]);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar motoristas:', error);
            setDrivers([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar e buscar motoristas
    const filteredDrivers = useMemo(() => {
        let filtered = drivers;

        // Filtro por status
        if (statusFilter) {
            filtered = filtered.filter((driver) => driver.status === statusFilter);
        }

        // Busca por texto
        if (searchText) {
            const query = searchText.toLowerCase();
            filtered = filtered.filter(
                (driver) =>
                    driver.name.toLowerCase().includes(query) ||
                    driver.email.toLowerCase().includes(query) ||
                    driver.cpf.includes(query) ||
                    driver.cnhNumber.includes(query) ||
                    driver.phone.includes(query)
            );
        }

        return filtered;
    }, [drivers, searchText, statusFilter]);

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '18%',
            render: (text: string, record: DriverApplication) => (
                <span
                    style={{ cursor: 'pointer', color: '#1890ff' }}
                    onClick={() => {
                        setSelectedDriver(record);
                        setDrawerVisible(true);
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '18%',
            render: (text: string) => <a href={`mailto:${text}`}>{text}</a>,
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
            width: '13%',
            render: (text: string) => (
                <span>{text.slice(0, 3)}. {text.slice(3, 6)}.{text.slice(6, 9)}-{text.slice(9)}</span>
            ),
        },
        {
            title: 'CNH',
            dataIndex: 'cnhNumber',
            key: 'cnhNumber',
            width: '13%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '12%',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
            ),
        },
        {
            title: 'Data Cadastro',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '14%',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: '12%',
            render: (_: any, record: DriverApplication) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedDriver(record);
                        setDrawerVisible(true);
                    }}
                    title="Visualizar detalhes"
                >
                    Detalhes
                </Button>
            ),
        },
    ];

    // Estatísticas
    const stats = {
        total: drivers.length,
        approved: drivers.filter((d) => d.status === 'approved').length,
        pending: drivers.filter((d) => d.status === 'pending').length,
        rejected: drivers.filter((d) => d.status === 'rejected').length,
    };

    return (
        <>
            <Modal
                title="Todos os Motoristas"
                open={visible}
                onCancel={onClose}
                width="95%"
                style={{ maxHeight: '95vh' }}
                styles={{
                    body: { maxHeight: '80vh', overflow: 'auto' },
                }}
                footer={null}
            >
                <Spin spinning={loading}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {/* Filtros */}
                        <Row gutter={16}>
                            <Col xs={24} sm={16} md={16} lg={16}>
                                <Input
                                    placeholder="Buscar por nome, email, CPF ou CNH..."
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    allowClear
                                    size="large"
                                />
                            </Col>
                            <Col xs={24} sm={8} md={8} lg={8}>
                                <Select
                                    placeholder="Filtrar por status"
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    allowClear
                                    style={{ width: '100%' }}
                                    size="large"
                                    options={[
                                        { label: 'Pendente', value: 'pending' },
                                        { label: 'Aprovado', value: 'approved' },
                                        { label: 'Rejeitado', value: 'rejected' },
                                    ]}
                                />
                            </Col>
                        </Row>

                        {/* Estatísticas */}
                        <Row gutter={16}>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <Card size="small" style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                        {stats.total}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Total</div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <Card size="small" style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                        {stats.approved}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Aprovados</div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <Card size="small" style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                        {stats.pending}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Pendentes</div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={6} md={6} lg={6}>
                                <Card size="small" style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                                        {stats.rejected}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Rejeitados</div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Tabela */}
                        {filteredDrivers.length > 0 ? (
                            <Table
                                columns={columns}
                                dataSource={filteredDrivers}
                                rowKey="userId"
                                pagination={{
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    total: filteredDrivers.length,
                                    onChange: (page, pageSize) => {
                                        setPagination({ current: page, pageSize });
                                    },
                                    showSizeChanger: true,
                                    pageSizeOptions: ['15', '25', '50'],
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} de ${total} motoristas`,
                                }}
                                size="middle"
                                scroll={{ x: 1000 }}
                                style={{ marginTop: '16px' }}
                            />
                        ) : (
                            <Empty description="Nenhum motorista encontrado" />
                        )}
                    </Space>
                </Spin>
            </Modal>

            {/* Drawer de Detalhes */}
            <Drawer
                title="Detalhes do Motorista"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={500}
                styles={{
                    body: { paddingBottom: '80px' },
                }}
            >
                {selectedDriver && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {/* Avatar e Nome */}
                        <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                            <Avatar
                                size={100}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#1890ff' }}
                            />
                            <h2 style={{ marginTop: '12px', marginBottom: '8px' }}>{selectedDriver.name}</h2>
                            <Tag color={getStatusColor(selectedDriver.status)} style={{ fontSize: '12px' }}>
                                {getStatusLabel(selectedDriver.status)}
                            </Tag>
                        </div>

                        {/* Informações Pessoais */}
                        <div>
                            <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>Informações Pessoais</h3>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Nome">{selectedDriver.name}</Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    <a href={`mailto:${selectedDriver.email}`}>{selectedDriver.email}</a>
                                </Descriptions.Item>
                                <Descriptions.Item label="Telefone">{selectedDriver.phone}</Descriptions.Item>
                                <Descriptions.Item label="CPF">
                                    {selectedDriver.cpf.slice(0, 3)}. {selectedDriver.cpf.slice(3, 6)}.{selectedDriver.cpf.slice(6, 9)}-{selectedDriver.cpf.slice(9)}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        {/* Informações CNH */}
                        <div>
                            <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>Informações de Habilitação</h3>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Número da CNH">
                                    {selectedDriver.cnhNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label="Categoria">
                                    <Tag>{selectedDriver.cnhCategory || 'N/A'}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Válida até">
                                    {selectedDriver.cnhExpirationDate
                                        ? dayjs(selectedDriver.cnhExpirationDate).format('DD/MM/YYYY')
                                        : 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        {/* Informações de Cadastro */}
                        <div>
                            <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>Informações de Cadastro</h3>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Data de Cadastro">
                                    {dayjs(selectedDriver.createdAt).format('DD/MM/YYYY HH:mm')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Última Atualização">
                                    {selectedDriver.updatedAt ? dayjs(selectedDriver.updatedAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                </Descriptions.Item>
                                {selectedDriver.rejectionReason && (
                                    <Descriptions.Item label="Motivo da Rejeição">
                                        <span style={{ color: '#f5222d' }}>{selectedDriver.rejectionReason}</span>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </div>

                        {/* Fotos */}
                        {(selectedDriver.facePhoto || selectedDriver.cnhPhoto) && (
                            <div>
                                <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>Documentos</h3>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {selectedDriver.facePhoto && (
                                        <div>
                                            <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Foto do Rosto</p>
                                            <img
                                                src={selectedDriver.facePhoto}
                                                alt="Face Photo"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '200px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #f0f0f0',
                                                }}
                                            />
                                        </div>
                                    )}
                                    {selectedDriver.cnhPhoto && (
                                        <div>
                                            <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Foto da CNH</p>
                                            <img
                                                src={selectedDriver.cnhPhoto}
                                                alt="CNH Photo"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '200px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #f0f0f0',
                                                }}
                                            />
                                        </div>
                                    )}
                                </Space>
                            </div>
                        )}

                        {/* Botões de Ação */}
                        <Space style={{ marginTop: '16px', width: '100%' }}>
                            <Button onClick={() => setDrawerVisible(false)} block>
                                Fechar
                            </Button>
                        </Space>
                    </Space>
                )}
            </Drawer>
        </>
    );
};

export default AllDriversModal;