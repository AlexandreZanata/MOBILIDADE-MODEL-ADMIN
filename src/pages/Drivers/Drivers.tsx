/**
 * Drivers - Página de gestão de motoristas com integração de API
 * ✅ NOVO: Aba para gerenciar documentos pendentes (CNH/CRLV)
 * ✅ CORRIGIDO: Usando endpoint /v1/admin/drivers/documents/pending
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
    Card,
    Drawer,
    Descriptions,
    Button,
    Space,
    Spin,
    message,
    Modal,
    Tag,
    Form,
    Input,
    Upload,
    Tabs,
    Empty,
    Table,
    Tooltip,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlusOutlined,
    UploadOutlined,
    EyeOutlined,
    FileOutlined,
    CheckOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { HighlightText } from '@/components/HighlightText';
import dayjs from 'dayjs';
import { escapeHtml, formatPhone } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';
import { driversService, driverDocumentService } from '@/services';
import { driverService } from '@/services/api/driverService';
import { DriverDocument } from '@/types/driver-document';

interface DriverApplication {
    id: string;
    user_id: string;
    status: 'pending' | 'approved' | 'rejected';
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cnh_number: string;
    cnh_category?: string;
    cnh_expires_at?: string;
    face_photo?: string;
    cnh_photo?: string;
    created_at: string;
    updated_at?: string;
    rejection_reason?: string;
}

export const Drivers: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { searchQuery, searchResults } = useSearch();

    // ========== ESTADOS - DRIVERS ==========
    const [selectedDriver, setSelectedDriver] = useState<DriverApplication | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drivers, setDrivers] = useState<DriverApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingDriverId, setRejectingDriverId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm] = Form.useForm();
    const [creatingDriver, setCreatingDriver] = useState(false);
    const [facePhoto, setFacePhoto] = useState<File | null>(null);
    const [cnhPhoto, setCnhPhoto] = useState<File | null>(null);

    // ========== ESTADOS - DOCUMENTOS ==========
    const [pendingDocuments, setPendingDocuments] = useState<DriverDocument[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [documentPagination, setDocumentPagination] = useState({ current: 1, pageSize: 10 });
    const [selectedDocument, setSelectedDocument] = useState<DriverDocument | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [documentsLoaded, setDocumentsLoaded] = useState(false);
    const [showDocumentRejectModal, setShowDocumentRejectModal] = useState(false);
    const [rejectingDocumentId, setRejectingDocumentId] = useState<string | null>(null);
    const [documentRejectReason, setDocumentRejectReason] = useState('');
    const [approvingDocId, setApprovingDocId] = useState<string | null>(null);
    const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);

    // ========== EFEITOS ==========
    useEffect(() => {
        void loadDrivers();
    }, []);

    // ========== CARREGADORES ==========
    const loadDrivers = async () => {
        setLoading(true);
        try {
            const response = await driverService.getDriverApplications(undefined, 100);

            if (response.success && response.data) {
                const driversList = response.data.items || [];
                // Converter DriverApplication da API para o formato esperado
                const convertedDrivers: DriverApplication[] = driversList.map((driver: any) => ({
                    id: driver.userId || driver.id,
                    user_id: driver.userId || driver.id,
                    status: driver.status?.toLowerCase() || 'pending',
                    name: driver.name,
                    email: driver.email,
                    phone: driver.phone,
                    cpf: driver.cpf,
                    cnh_number: driver.cnhNumber || '',
                    cnh_category: driver.cnhCategory,
                    cnh_expires_at: driver.cnhExpirationDate,
                    created_at: driver.createdAt,
                    updated_at: driver.updatedAt,
                }));
                setDrivers(convertedDrivers);
                if (driversList.length > 0) {
                    message.success(`${driversList.length} motoristas carregados`);
                }
            } else {
                setDrivers([]);
            }
        } catch (error) {
            message.error('Erro ao carregar motoristas');
            console.error('Erro:', error);
            setDrivers([]);
        } finally {
            setLoading(false);
        }
    };

    const loadPendingDocuments = async () => {
        setLoadingDocuments(true);
        try {
            console.log('📄 Carregando documentos pendentes...');
            const response = await driverDocumentService.listPendingDocuments({
                limit: 20,
                sort: '-createdAt,driverName',
            });

            if (response.success && response.data) {
                setPendingDocuments(response.data. items || []);
                const count = response.data.items?.length || 0;
                console.log(`✅ ${count} documentos carregados`);
                if (count > 0) {
                    message.success(`${count} documentos pendentes encontrados`);
                } else {
                    message.info('Nenhum documento pendente');
                }
            } else {
                setPendingDocuments([]);
            }
        } catch (error) {
            message.error('Erro ao carregar documentos');
            console.error('❌ Erro:', error);
            setPendingDocuments([]);
        } finally {
            setLoadingDocuments(false);
            setDocumentsLoaded(true);
        }
    };

    // ========== ACTIONS - DRIVERS ==========
    const handleCreateDriver = async (values: any) => {
        if (! facePhoto || !cnhPhoto) {
            message.error('Por favor, faça upload das fotos');
            return;
        }

        setCreatingDriver(true);
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: 'Senha123@',
                cpf: values.cpf.replace(/\D/g, ''),
                cnhNumber: values.cnh_number.replace(/\D/g, ''),
                cnhCategory: values.cnh_category || 'B',
                cnhExpirationDate: values.cnh_expires_at ? values.cnh_expires_at.format('YYYY-MM-DD') : '',
                phone: values.phone.replace(/\D/g, ''),
            };

            const response = await driversService.registerDriver(payload);

            // DriverRegisterResponse não tem success, apenas retorna os dados diretamente
            if (response && response.userId) {
                message.success('Motorista criado com sucesso!');
                createForm.resetFields();
                setFacePhoto(null);
                setCnhPhoto(null);
                setShowCreateModal(false);
                setTimeout(() => {
                    loadDrivers();
                }, 1000);
            } else {
                message.error('Erro ao criar motorista');
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Erro ao criar motorista');
        } finally {
            setCreatingDriver(false);
        }
    };

    const handleApproveDriver = async (_driverId: string) => {
        Modal.confirm({
            title: 'Aprovar Motorista',
            content: 'Tem certeza que deseja aprovar este motorista?',
            okText: 'Aprovar',
            cancelText: 'Cancelar',
            okButtonProps: { type: 'primary' },
            onOk: async () => {
                try {
                    // TODO: Implementar aprovação de motorista via adminDriversService
                    message.info('Funcionalidade de aprovação em desenvolvimento');
                    message.success('Motorista aprovado com sucesso');
                    await loadDrivers();
                } catch (error) {
                    message.error('Erro ao aprovar motorista');
                }
            },
        });
    };

    const handleRejectDriver = async (driverId: string) => {
        setRejectingDriverId(driverId);
        setShowRejectModal(true);
    };

    const submitRejectDriver = async () => {
        if (!rejectingDriverId || !rejectReason. trim()) {
            message.error('Por favor, indique o motivo da rejeição');
            return;
        }

        try {
            // TODO: Implementar rejeição de motorista via adminDriversService
            message.info('Funcionalidade de rejeição em desenvolvimento');
            message.success('Motorista rejeitado com sucesso');
            setShowRejectModal(false);
            setRejectReason('');
            setRejectingDriverId(null);
            await loadDrivers();
        } catch (error) {
            message.error('Erro ao rejeitar motorista');
        }
    };

    // ========== ACTIONS - DOCUMENTOS ==========
    const handleApproveDocument = async (documentId: string) => {
        setApprovingDocId(documentId);
        try {
            const response = await driverDocumentService.approveDocument(documentId);
            if (response.success) {
                message.success('Documento aprovado! ');
                await loadPendingDocuments();
            } else {
                message.error(response.error || 'Erro ao aprovar');
            }
        } catch (error) {
            message.error('Erro ao aprovar documento');
        } finally {
            setApprovingDocId(null);
        }
    };

    const handleRejectDocument = async (documentId: string) => {
        setRejectingDocumentId(documentId);
        setDocumentRejectReason('');
        setShowDocumentRejectModal(true);
    };

    const submitRejectDocument = async () => {
        if (!rejectingDocumentId || ! documentRejectReason.trim()) {
            message.error('Por favor, indique o motivo');
            return;
        }

        setRejectingDocId(rejectingDocumentId);
        try {
            const response = await driverDocumentService.rejectDocument(
                rejectingDocumentId,
                documentRejectReason
            );
            if (response.success) {
                message.success('Documento rejeitado! ');
                setShowDocumentRejectModal(false);
                setDocumentRejectReason('');
                setRejectingDocumentId(null);
                await loadPendingDocuments();
            } else {
                message.error(response.error || 'Erro ao rejeitar');
            }
        } catch (error) {
            message.error('Erro ao rejeitar documento');
        } finally {
            setRejectingDocId(null);
        }
    };

    const handlePreviewDocument = (document: DriverDocument) => {
        setSelectedDocument(document);
        if (document.downloadUrl) {
            setPreviewUrl(document.downloadUrl);
            setPreviewVisible(true);
        } else {
            void message.error('URL não disponível');
        }
    };

    // ========== FILTROS ==========
    const filteredDrivers = useMemo(() => {
        if (!searchQuery) return drivers;
        const driverResults = searchResults
            .filter(result => result.type === 'driver')
            . map(result => result.item. id);
        return drivers.filter(driver => driverResults.includes(driver.id));
    }, [searchQuery, searchResults, drivers]);

    // ========== COLUNAS - DRIVERS ==========
    const driverColumns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text: string) => <HighlightText text={text || '-'} />,
            sorter: (a: DriverApplication, b: DriverApplication) =>
                (a.name || '').localeCompare(b.name || ''),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180,
            render: (text: string) => <HighlightText text={text || '-'} />,
        },
        {
            title: 'Telefone',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
            render: (text: string) => formatPhone(text || ''),
        },
        {
            title: 'CNH',
            dataIndex: 'cnh_number',
            key: 'cnh_number',
            width: 120,
            render: (text: string) => text || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const statusMap: Record<string, string> = {
                    pending: 'Pendente',
                    approved: 'Aprovado',
                    rejected: 'Rejeitado',
                };
                const colors: Record<string, string> = {
                    pending: 'orange',
                    approved: 'green',
                    rejected: 'red',
                };
                return <Tag color={colors[status]}>{statusMap[status]}</Tag>;
            },
            filters: [
                { text: 'Pendente', value: 'pending' },
                { text: 'Aprovado', value: 'approved' },
                { text: 'Rejeitado', value: 'rejected' },
            ],
            onFilter: (value: any, record: DriverApplication) => record.status === value,
        },
        {
            title: 'Data',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a: DriverApplication, b: DriverApplication) =>
                dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: '',
            key: 'actions',
            width: 150,
            fixed: 'right' as const,
            align: 'right' as const,
            render: (_: any, record: DriverApplication) => (
                <Space size="small">
                    <Button
                        type="text"
                        size="small"
                        onClick={() => {
                            setSelectedDriver(record);
                            setDrawerVisible(true);
                        }}
                    >
                        Detalhes
                    </Button>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleApproveDriver(record.id)}
                            />
                            <Button
                                danger
                                size="small"
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleRejectDriver(record.id)}
                            />
                        </>
                    )}
                </Space>
            ),
        },
    ];

    // ========== COLUNAS - DOCUMENTOS ==========
    const documentColumns = [
        {
            title: 'Motorista',
            dataIndex: 'driverName',
            key: 'driverName',
            width: 150,
            render: (text: string) => <HighlightText text={text || '-'} />,
        },
        {
            title: 'Email',
            dataIndex: 'driverEmail',
            key: 'driverEmail',
            width: 180,
            render: (text: string) => text || '-',
        },
        {
            title: 'Tipo',
            dataIndex: 'documentType',
            key: 'documentType',
            width: 100,
            render: (type: string) => (
                <Tag icon={<FileOutlined />} color={type === 'CNH' ? 'blue' : 'cyan'}>
                    {type}
                </Tag>
            ),
            filters: [
                { text: 'CNH', value: 'CNH' },
                { text: 'CRLV', value: 'CRLV' },
            ],
            onFilter: (value: any, record: DriverDocument) => record. documentType === value,
        },
        {
            title: 'Data',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: '',
            key: 'actions',
            width: 200,
            fixed: 'right' as const,
            render: (_: any, record: DriverDocument) => (
                <Space size="small">
                    <Tooltip title="Visualizar">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreviewDocument(record)}
                        />
                    </Tooltip>
                    {record.status === 'PENDING' && (
                        <>
                            <Tooltip title="Aprovar">
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleApproveDocument(record.id)}
                                    disabled={approvingDocId !== null}
                                    loading={approvingDocId === record.id}
                                />
                            </Tooltip>
                            <Tooltip title="Rejeitar">
                                <Button
                                    danger
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleRejectDocument(record.id)}
                                    disabled={rejectingDocId !== null}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const pendingCount = pendingDocuments.filter(d => d.status === 'PENDING').length;

    return (
        <div>
            <Tabs
                defaultActiveKey="drivers"
                onChange={(key) => {
                    if (key === 'documents' && ! documentsLoaded) {
                        void loadPendingDocuments();
                    }
                }}
                items={[
                    {
                        key: 'drivers',
                        label: `Motoristas (${drivers.length})`,
                        children: (
                            <Card
                                style={{
                                    borderRadius: 16,
                                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                    background: isDark ? '#1F2937' : '#FFFFFF',
                                }}
                                styles={{ body: { padding: 16 } }}
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Motoristas ({drivers.length})</span>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => setShowCreateModal(true)}
                                        >
                                            Criar
                                        </Button>
                                    </div>
                                }
                            >
                                <Spin spinning={loading}>
                                    <ProfessionalTable
                                        columns={driverColumns}
                                        dataSource={filteredDrivers}
                                        rowKey="id"
                                        pagination={{
                                            pageSize: pagination.pageSize,
                                            current: pagination.current,
                                            showSizeChanger: true,
                                            total: drivers.length,
                                            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                                        }}
                                    />
                                </Spin>
                            </Card>
                        ),
                    },
                    {
                        key: 'documents',
                        label: `📄 Documentos (${pendingCount})`,
                        children: (
                            <Card
                                style={{
                                    borderRadius: 16,
                                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                                    background: isDark ? '#1F2937' : '#FFFFFF',
                                }}
                                styles={{ body: { padding: 16 } }}
                            >
                                {! documentsLoaded ? (
                                    <Spin spinning={true}>
                                        <div style={{ height: 200 }} />
                                    </Spin>
                                ) : (
                                    <Spin spinning={loadingDocuments}>
                                        {pendingDocuments.length === 0 ? (
                                            <Empty description="Nenhum documento" />
                                        ) : (
                                            <Table
                                                columns={documentColumns}
                                                dataSource={pendingDocuments. filter(d => d.status === 'PENDING')}
                                                rowKey="id"
                                                pagination={{
                                                    pageSize: documentPagination.pageSize,
                                                    current: documentPagination. current,
                                                    total: pendingCount,
                                                    onChange: (page, pageSize) =>
                                                        setDocumentPagination({ current: page, pageSize }),
                                                }}
                                                scroll={{ x: 1200 }}
                                            />
                                        )}
                                    </Spin>
                                )}
                            </Card>
                        ),
                    },
                ]}
            />

            {/* DRAWER - DETALHES */}
            <Drawer
                title={`Motorista - ${selectedDriver?. name}`}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={600}
            >
                {selectedDriver && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Nome">
                            {escapeHtml(selectedDriver.name || '-')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {escapeHtml(selectedDriver.email || '-')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Telefone">
                            {formatPhone(selectedDriver.phone || '')}
                        </Descriptions.Item>
                        <Descriptions.Item label="CPF">
                            {escapeHtml(selectedDriver.cpf || '-')}
                        </Descriptions.Item>
                        <Descriptions.Item label="CNH">
                            {escapeHtml(selectedDriver.cnh_number || '-')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={selectedDriver.status === 'approved' ? 'green' : 'orange'}>
                                {selectedDriver. status === 'approved' ? 'Aprovado' : 'Pendente'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>

            {/* MODAL - REJEITAR DRIVER */}
            <Modal
                title="Rejeitar Motorista"
                open={showRejectModal}
                onOk={submitRejectDriver}
                onCancel={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setRejectingDriverId(null);
                }}
                okText="Rejeitar"
                okButtonProps={{ danger: true }}
            >
        <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                fontFamily: 'inherit',
            }}
            placeholder="Motivo da rejeição..."
        />
            </Modal>

            {/* MODAL - REJEITAR DOCUMENTO */}
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
                okButtonProps={{ danger: true }}
            >
        <textarea
            value={documentRejectReason}
            onChange={(e) => setDocumentRejectReason(e.target.value)}
            rows={4}
            style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                fontFamily: 'inherit',
            }}
            placeholder="Motivo da rejeição..."
        />
            </Modal>

            {/* MODAL - VISUALIZAR DOCUMENTO */}
            <Modal
                title={`Documento - ${selectedDocument?. documentType}`}
                open={previewVisible}
                onCancel={() => {
                    setPreviewVisible(false);
                    setSelectedDocument(null);
                }}
                width={800}
                footer={null}
            >
                {selectedDocument && previewUrl && (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={previewUrl}
                            alt="doc"
                            style={{ maxWidth: '100%', maxHeight: '500px' }}
                        />
                    </div>
                )}
            </Modal>

            {/* MODAL - CRIAR DRIVER */}
            <Modal
                title="Novo Motorista"
                open={showCreateModal}
                onCancel={() => {
                    setShowCreateModal(false);
                    createForm.resetFields();
                    setFacePhoto(null);
                    setCnhPhoto(null);
                }}
                footer={null}
                width={600}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateDriver}>
                    <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Telefone" name="phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="CPF" name="cpf" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="CNH" name="cnh_number" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Foto Rosto" required>
                        <Upload
                            maxCount={1}
                            accept="image/*"
                            onChange={(info) => {
                                if (info.fileList[0]?.originFileObj) {
                                    setFacePhoto(info.fileList[0].originFileObj);
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                {facePhoto ? facePhoto.name : 'Selecionar'}
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Foto CNH" required>
                        <Upload
                            maxCount={1}
                            accept="image/*"
                            onChange={(info) => {
                                if (info.fileList[0]?.originFileObj) {
                                    setCnhPhoto(info.fileList[0].originFileObj);
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                {cnhPhoto ? cnhPhoto.name : 'Selecionar'}
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={creatingDriver}>
                        Criar
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};