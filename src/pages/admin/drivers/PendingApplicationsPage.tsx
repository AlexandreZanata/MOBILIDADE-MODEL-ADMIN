import React, { useState, useEffect } from 'react';
import {
    Card,
    Drawer,
    Descriptions,
    Button,
    Space,
    Spin,
    Modal,
    Form,
    Input,
    Tag,
    Row,
    Col,
    Empty,
    Select,
    Divider,
    Alert,
    Tooltip,
    Table,
    App,
    Avatar,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    ReloadOutlined,
    DownloadOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { HighlightText } from '@/components/HighlightText';
import { BookIcon } from '@/components/BookIcon';
import dayjs from 'dayjs';
import { escapeHtml, formatPhone } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';
import adminDriversService, { AdminDriver } from '@/services/adminDriversService';
import driverDocumentService from '@/services/driverDocumentService';
import RegisterDriverModal from './RegisterDriverModal';
import api from '@/services/api';
import adminVehiclesService from '@/services/adminVehiclesService';

const statusColorMap:  Record<string, string> = {
    AWAITING_CNH: 'warning',
    AWAITING_VEHICLE: 'processing',
    ACTIVE: 'success',
    INACTIVE: 'default',
    REJECTED: 'error',
};

const statusLabelMap: Record<string, string> = {
    AWAITING_CNH: 'Aguardando CNH',
    AWAITING_VEHICLE: 'Aguardando Veículo',
    ACTIVE:  'Ativo',
    INACTIVE: 'Inativo',
    REJECTED: 'Rejeitado',
    VEHICLE_REVIEW: 'Revisando Veículo'
};

const documentTypeMap: Record<string, string> = {
    CNH: 'Carteira Nacional de Habilitação',
    CRLV: 'Certificado de Registro e Licenciamento do Veículo',
};

const documentStatusColorMap: Record<string, string> = {
    PENDING: 'processing',
    APPROVED: 'success',
    REJECTED: 'error',
};

const documentStatusLabelMap: Record<string, string> = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    REJECTED:  'Rejeitado',
};

interface PendingApplicationsPageProps {
    onNeedRefresh?: () => void;
}

export const PendingApplicationsPage: React.FC<PendingApplicationsPageProps> = ({ onNeedRefresh: _onNeedRefresh }) => {
    const { message } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { searchQuery } = useSearch();

    // ========== STATES - DRIVERS ==========
    const [drivers, setDrivers] = useState<AdminDriver[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<AdminDriver | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectingDriverId, setRejectingDriverId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });
    const [cursor, setCursor] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_DOCS' | undefined>(undefined);
    const [searchText, setSearchText] = useState('');

    // ========== STATES - DOCUMENTS ==========
    const [driverDocuments, setDriverDocuments] = useState<any[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
    const [approvingDocId, setApprovingDocId] = useState<string | null>(null);
    const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
    const [showDocumentRejectModal, setShowDocumentRejectModal] = useState(false);
    const [documentRejectReason, setDocumentRejectReason] = useState('');
    const [rejectingDocumentId, setRejectingDocumentId] = useState<string | null>(null);
    const [rejectingVehicleId, setRejectingVehicleId] = useState<string | null>(null);

    // ========== EFFECTS ==========
    useEffect(() => {
        fetchApplications();
    }, [statusFilter, searchText]);

    // ========== LOADERS ==========
    const fetchApplications = async () => {
        setLoading(true);
        try {
            console.log('📋 Carregando motoristas...');

            const response = await adminDriversService.listDrivers({
                limit: pagination.pageSize,
                cursor:  cursor,
                sort: '-createdAt',
                status: statusFilter as any,
                q: searchText || undefined,
            });

            console.log('✅ Motoristas carregados:', response?. items?.length || 0);

            setDrivers(response?.items || []);
            setPagination((prev) => ({
                ...prev,
                total: response?.totalCount || 0,
            }));
            setCursor(response?. nextCursor || null);
        } catch (error:  any) {
            console.error('❌ Erro ao carregar motoristas:', error);
            message.error(error?.message || 'Erro ao carregar motoristas');
            setDrivers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingDocuments = async () => {
        if (!selectedDriver) {
            console.warn('⚠️ Nenhum motorista selecionado');
            return;
        }

        setLoadingDocuments(true);
        try {
            console.log('📄 Carregando documentos pendentes...');
            console.log('🔍 Motorista selecionado:', selectedDriver.userId, '-', selectedDriver.name);

            const response = await driverDocumentService.listPendingDocuments({
                limit: 100,
                sort: '-createdAt,driverName',
            });

            console.log('✅ Total de documentos na API:', response. data?.items?.length || 0);

            if (response.success && response.data?.items) {
                // Filtrar apenas documentos do motorista selecionado
                const filtered = response.data.items.filter((doc: any) => {
                    const match = doc.driverId === selectedDriver.userId;
                    console.log(`🔍 Verificando doc ${doc.id}:  driverId=${doc.driverId}, motorista=${selectedDriver.userId} => ${match ?  '✅' : '❌'}`);
                    return match;
                });

                console.log(`✅ Documentos filtrados:  ${filtered.length}`);
                filtered.forEach((doc: any) => {
                    console.log(`  - ${doc. documentType} (${doc.status}) - ID: ${doc.id}`);
                });

                setDriverDocuments(filtered);
            } else {
                console.warn('⚠️ Resposta sem documentos');
                setDriverDocuments([]);
            }
        } catch (error:  any) {
            console.error('❌ Erro ao carregar documentos:', error);
            message.error('Erro ao carregar documentos');
            setDriverDocuments([]);
        } finally {
            setLoadingDocuments(false);
        }
    };

    // ========== DOCUMENT ACTIONS ==========
    const handleApproveDocument = async (doc: any) => {
        const documentId = doc.id;
        const vehicleId = doc.vehicleId;
        setApprovingDocId(documentId);
        try {
            console.log('✅ Aprovando documento:', documentId, 'veículo:', vehicleId);

            let ok = true;

            // Se for CRLV e tiver vehicleId, aprovar veículo também
            if (doc.documentType === 'CRLV' && vehicleId) {
                const respVehicle = await adminVehiclesService.approveVehicle(vehicleId);
                ok = ok && respVehicle.success;
                if (!respVehicle.success) {
                    message.error(respVehicle.message || 'Erro ao aprovar veículo');
                }
            }

            const response = await driverDocumentService.approveDocument(documentId);
            ok = ok && response.success;

            if (ok) {
                message.success('Documento aprovado com sucesso!');
                await fetchPendingDocuments();
            } else {
                message.error(response.error || 'Erro ao aprovar');
            }
        } catch (error: any) {
            console.error('❌ Erro:', error);
            message.error('Erro ao aprovar documento');
        } finally {
            setApprovingDocId(null);
        }
    };

    const handleRejectDocument = (documentId: string, vehicleId?: string) => {
        setRejectingDocumentId(documentId);
        setRejectingVehicleId(vehicleId || null);
        setDocumentRejectReason('');
        setShowDocumentRejectModal(true);
    };

    const submitRejectDocument = async () => {
        if (!rejectingDocumentId || !documentRejectReason.trim()) {
            message.error('Por favor, indique o motivo da rejeição');
            return;
        }

        setRejectingDocId(rejectingDocumentId);
        try {
            console.log('❌ Rejeitando documento:', rejectingDocumentId, 'veículo:', rejectingVehicleId);
            console.log('📝 Motivo:', documentRejectReason);

            let ok = true;

            if (rejectingVehicleId) {
                const respVehicle = await adminVehiclesService.rejectVehicle(
                    rejectingVehicleId,
                    documentRejectReason
                );
                ok = ok && respVehicle.success;
                if (!respVehicle.success) {
                    message.error(respVehicle.message || 'Erro ao rejeitar veículo');
                }
            }

            const response = await driverDocumentService.rejectDocument(
                rejectingDocumentId,
                documentRejectReason
            );

            ok = ok && response.success;

            if (ok) {
                message.success('Documento rejeitado com sucesso!');
                setShowDocumentRejectModal(false);
                setDocumentRejectReason('');
                setRejectingDocumentId(null);
                setRejectingVehicleId(null);
                await fetchPendingDocuments();
            } else {
                message.error(response.error || 'Erro ao rejeitar');
            }
        } catch (error: any) {
            console.error('❌ Erro:', error);
            message.error('Erro ao rejeitar documento');
        } finally {
            setRejectingDocId(null);
        }
    };

    const handleDownloadDocument = async (documentId: string, documentType: string) => {
        try {
            setDownloadingDocId(documentId);
            console.log('⬇️ Baixando documento:', documentId);

            const response = await driverDocumentService.downloadDocumentFile(documentId);

            if (response.success && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${documentType}_${documentId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                message.success('Download iniciado! ');
            }
        } catch (error: any) {
            console.error('❌ Erro ao baixar:', error);
            message.error(error?.message || 'Erro ao baixar documento');
        } finally {
            setDownloadingDocId(null);
        }
    };

    // ========== DRIVER ACTIONS ==========
    const handleApproveDriver = async (driverId: string) => {
        Modal.confirm({
            title: 'Aprovar Motorista',
            content: 'Tem certeza que deseja aprovar este motorista? ',
            okText: 'Aprovar',
            cancelText: 'Cancelar',
            okButtonProps: { danger: false },
            onOk: async () => {
                try {
                    setLoading(true);
                    console.log('✅ Aprovando motorista:', driverId);
                    message.success('Motorista aprovado com sucesso!');
                    await fetchApplications();
                    setDrawerVisible(false);
                } catch (error: any) {
                    console.error('❌ Erro:', error);
                    message.error(error?.message || 'Erro ao aprovar motorista');
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleRejectDriver = async (driverId: string) => {
        setRejectingDriverId(driverId);
        setRejectModalVisible(true);
    };

    const confirmRejectDriver = async () => {
        if (! rejectingDriverId) return;

        if (! rejectReason.trim()) {
            message.error('Por favor, forneça um motivo para a rejeição');
            return;
        }

        try {
            setLoading(true);
            console.log('❌ Rejeitando motorista:', rejectingDriverId);
            message.success('Motorista rejeitado com sucesso!');
            setRejectModalVisible(false);
            setRejectReason('');
            setRejectingDriverId(null);
            await fetchApplications();
            setDrawerVisible(false);
        } catch (error: any) {
            console.error('❌ Erro:', error);
            message.error(error?.message || 'Erro ao rejeitar motorista');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDriver = async (driverId:  string) => {
        Modal. confirm({
            title: 'Deletar Motorista',
            content: 'Tem certeza que deseja deletar este motorista?  Esta ação pode ser revertida.',
            okText: 'Deletar',
            cancelText: 'Cancelar',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    setLoading(true);
                    console. log('🗑️ Deletando motorista:', driverId);

                    await adminDriversService.deleteDriver(driverId);

                    message.success('Motorista deletado com sucesso!');
                    await fetchApplications();
                    setDrawerVisible(false);
                } catch (error: any) {
                    console.error('❌ Erro:', error);
                    message.error(error?.message || 'Erro ao deletar motorista');
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    // ========== FILTERS ==========
    const filteredDrivers = drivers.filter(
        (driver) =>
            !searchQuery ||
            driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.cpf.includes(searchQuery) ||
            driver.cnhNumber.includes(searchQuery)
    );

    // ========== COLUMNS - DRIVERS ==========
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
                        setTimeout(() => fetchPendingDocuments(), 200);
                    }}
                    title="Ver detalhes"
                />
            ),
        },
    ];

    // ========== COLUMNS - DOCUMENTS ==========
    const documentColumns = [
        {
            title: 'Tipo',
            dataIndex: 'documentType',
            key: 'documentType',
            width: 100,
            render:  (type: string) => (
                <Tag color={type === 'CNH' ? 'blue' : 'cyan'}>
                    {documentTypeMap[type] || type}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status:  string) => (
                <Tag color={documentStatusColorMap[status]}>
                    {documentStatusLabelMap[status]}
                </Tag>
            ),
        },
        {
            title: 'Data de Envio',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 130,
            render: (date:  string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 150,
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title="Baixar">
                        <Button
                            type="text"
                            size="small"
                            icon={<DownloadOutlined />}
                            loading={downloadingDocId === record. id}
                            onClick={() => handleDownloadDocument(record.id, record.documentType)}
                        />
                    </Tooltip>
                    {record.status === 'PENDING' && (
                        <>
                            <Tooltip title="Aprovar">
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<CheckOutlined />}
                                    loading={approvingDocId === record.id}
                                    onClick={() => handleApproveDocument(record)}
                                    disabled={approvingDocId !== null || rejectingDocId !== null}
                                />
                            </Tooltip>
                            <Tooltip title="Rejeitar">
                                <Button
                                    danger
                                    size="small"
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => handleRejectDocument(record.id, record.vehicleId)}
                                    disabled={approvingDocId !== null || rejectingDocId !== null}
                                />
                            </Tooltip>
                        </>
                    )}
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
                }}
                styles={{ body: { padding: '16px' } }}
            >
                <Row gutter={[12, 12]} style={{ marginBottom: '16px' }} align="middle">
                    <Col flex="auto">
                        <Input. Search
                                placeholder="Buscar por nome, email, CPF ou CNH..."
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
                                { label: 'Aguardando CNH', value: 'AWAITING_CNH' },
                                { label: 'Aguardando Veículo', value: 'AWAITING_VEHICLE' },
                                { label: 'Ativo', value: 'ACTIVE' },
                                { label:  'Inativo', value:  'INACTIVE' },
                                { label: 'Rejeitado', value: 'REJECTED' },
                                { label: 'Revisando Veículo', value: 'VEHICLE_REVIEW'}
                            ]}
                        />
                    </Col>
                    <Col flex="100px">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => fetchApplications()}
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

            {/* ========== DRAWER - DETALHES ========== */}
            <Drawer
                title={`Detalhes do Motorista - ${selectedDriver?.name || '-'}`}
                placement="right"
                onClose={() => {
                    setDrawerVisible(false);
                    setDriverDocuments([]);
                }}
                open={drawerVisible}
                width={750}
                styles={{ body: { paddingBottom: '20px' } }}
            >
                <Spin spinning={loadingDocuments}>
                    {selectedDriver && (
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {/* Cabeçalho com foto e ações */}
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
                                    {(selectedDriver.status === 'AWAITING_CNH' || selectedDriver.status === 'AWAITING_VEHICLE') && (
                                        <>
                                            <Button
                                                type="primary"
                                                icon={<CheckCircleOutlined />}
                                                onClick={() => handleApproveDriver(selectedDriver.userId)}
                                            >
                                                Aprovar
                                            </Button>
                                            <Button
                                                danger
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => handleRejectDriver(selectedDriver.userId)}
                                            >
                                                Rejeitar
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        danger
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteDriver(selectedDriver.userId)}
                                    />
                                </Space>
                            </div>

                            {/* Informações Básicas */}
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
                                    <Descriptions.Item label="CPF">{selectedDriver.cpf}</Descriptions.Item>
                                    <Descriptions.Item label="CNH">{selectedDriver.cnhNumber}</Descriptions.Item>
                                    <Descriptions.Item label="Categoria CNH">
                                        {selectedDriver.cnhCategory}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        <Tag color={statusColorMap[selectedDriver.status]}>
                                            {statusLabelMap[selectedDriver.status]}
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>

                            <Divider style={{ margin: '12px 0' }} />

                            {/* Documentação - SEM BARRA DE PROGRESSO */}
                            <div>
                                <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                                    Documentação
                                </h3>

                                {driverDocuments.length > 0 ? (
                                    <Table
                                        columns={documentColumns}
                                        dataSource={driverDocuments}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                    />
                                ) : (
                                    <Alert
                                        message="Nenhum documento encontrado"
                                        type="info"
                                        showIcon
                                    />
                                )}
                            </div>
                        </Space>
                    )}
                </Spin>
            </Drawer>

            {/* ========== MODAL - REJEITAR MOTORISTA ========== */}
            <Modal
                title="Rejeitar Motorista"
                open={rejectModalVisible}
                onOk={confirmRejectDriver}
                onCancel={() => {
                    setRejectModalVisible(false);
                    setRejectReason('');
                    setRejectingDriverId(null);
                }}
                okText="Rejeitar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
            >
                <Form layout="vertical">
                    <Form.Item label="Motivo da Rejeição" required>
                        <Input. TextArea
                                rows={4}
                                placeholder="Descreva o motivo da rejeição..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ========== MODAL - REJEITAR DOCUMENTO ========== */}
            <Modal
                title="Rejeitar Documento"
                open={showDocumentRejectModal}
                onOk={submitRejectDocument}
                onCancel={() => {
                    setShowDocumentRejectModal(false);
                    setDocumentRejectReason('');
                    setRejectingDocumentId(null);
                }}
                okText="Rejeitar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
                confirmLoading={rejectingDocId !== null}
            >
                <Form layout="vertical">
                    <Form.Item label="Motivo da Rejeição" required>
                        <Input.TextArea
                            rows={4}
                            placeholder="Ex: Documento ilegível, expirado ou inválido..."
                            value={documentRejectReason}
                            onChange={(e) => setDocumentRejectReason(e. target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ========== MODAL - REGISTRAR DRIVER ========== */}
            <RegisterDriverModal
                visible={registerModalVisible}
                onClose={() => setRegisterModalVisible(false)}
                onSuccess={() => {
                    setRegisterModalVisible(false);
                    fetchApplications();
                }}
            />

            <style>{`
                .row-rejected {
                    background-color: #fef2f2 !important;
                }
                .row-rejected-dark {
                    background-color:  #7f1d1d !important;
                }
            `}</style>
        </>
    );
};

export default PendingApplicationsPage;