/**
 * Customers - Página de gestão de clientes/passageiros com integração de API
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Drawer, Descriptions, Button, Space, Spin, message, Tag, Modal, Tooltip, Empty } from 'antd';
import { DeleteOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { HighlightText } from '@/components/HighlightText';
import dayjs from 'dayjs';
import { escapeHtml } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';
import adminPassengersService, { Passenger } from '@/services/adminPassengersService';

interface Customer extends Passenger {}

export const Customers: React.FC = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { searchQuery } = useSearch();

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [reactivating, setReactivating] = useState<string | null>(null);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });

    const [cursor] = useState<string | null>(null);
    const [, setNextCursor] = useState<string | null>(null);
    const [sortBy] = useState('-createdAt');
    const [searchText] = useState('');

    // Carregar clientes da API
    useEffect(() => {
        void loadCustomers(cursor);
    }, [cursor, sortBy, searchText]);

    const loadCustomers = async (currentCursor?: string | null) => {
        setLoading(true);
        try {
            console.log('📋 Carregando passageiros...');

            const response = await adminPassengersService.listPassengers({
                cursor: currentCursor || undefined,
                limit: pagination.pageSize,
                sort: sortBy,
                q: searchText || undefined,
            });

            if (response && response.items) {
                setCustomers(response.items);
                setNextCursor(response.nextCursor);
                setPagination(prev => ({
                    ...prev,
                    total: response.totalCount || response.items.length,
                }));
                console.log('✅ Passageiros carregados:', response.items. length);
            }
        } catch (error: any) {
            console.error('❌ Erro ao carregar passageiros:', error);
            message.error('Erro ao carregar clientes');
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar clientes baseado na busca local
    const filteredCustomers = useMemo(() => {
        if (!searchQuery) return customers;

        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.cpf.includes(searchQuery) ||
            customer.phone.includes(searchQuery)
        );
    }, [searchQuery, customers]);

    // Ação: Deletar passageiro
    const handleDeletePassenger = (customer: Customer) => {
        Modal.confirm({
            title: 'Deletar Passageiro',
            content: `Tem certeza que deseja deletar o passageiro "${escapeHtml(customer.name)}"?  Esta ação é reversível.`,
            okText: 'Deletar',
            cancelText: 'Cancelar',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    setDeleting(customer.userId);
                    await adminPassengersService.deletePassenger(customer.userId);
                    message.success('Passageiro deletado com sucesso! ');
                    setDrawerVisible(false);
                    await loadCustomers(cursor);
                } catch (error: any) {
                    console.error('❌ Erro:', error);
                    message.error(error.response?.data?.error?. message || 'Erro ao deletar passageiro');
                } finally {
                    setDeleting(null);
                }
            },
        });
    };

    // Ação: Reativar passageiro
    const handleReactivatePassenger = (customer: Customer) => {
        Modal.confirm({
            title: 'Reativar Passageiro',
            content: `Tem certeza que deseja reativar o passageiro "${escapeHtml(customer.name)}"? `,
            okText: 'Reativar',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    setReactivating(customer.userId);
                    await adminPassengersService.reactivatePassenger(customer.userId);
                    message. success('Passageiro reativado com sucesso!');
                    setDrawerVisible(false);
                    await loadCustomers(cursor);
                } catch (error: any) {
                    console.error('❌ Erro:', error);
                    message. error(error.response?.data?. error?.message || 'Erro ao reativar passageiro');
                } finally {
                    setReactivating(null);
                }
            },
        });
    };

    // Colunas da tabela
    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            render: (text: string) => <HighlightText text={text} />,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (text: string) => <HighlightText text={text} />,
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
            width: 130,
            render: (text: string) => <HighlightText text={text} />,
        },
        {
            title: 'Telefone',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
            render: (text: string) => <HighlightText text={text} />,
        },
        {
            title: 'Data de Nascimento',
            dataIndex: 'birthDate',
            key: 'birthDate',
            width: 130,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Email Verificado',
            dataIndex: 'emailVerified',
            key: 'emailVerified',
            width: 120,
            render: (verified: boolean) => (
                <Tag color={verified ? 'green' : 'red'}>
                    {verified ?  'Verificado' : 'Não Verificado'}
                </Tag>
            ),
            filters: [
                { text: 'Verificado', value: true },
                { text: 'Não Verificado', value: false },
            ],
            onFilter: (value: any, record: Customer) => record.emailVerified === value,
        },
        {
            title: 'Data de Registro',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            render: (date: string) => dayjs(date). format('DD/MM/YYYY HH:mm'),
            sorter: (a: Customer, b: Customer) =>
                dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 140,
            fixed: 'right' as const,
            align: 'center' as const,
            render: (_: any, record: Customer) => (
                <Space size="small">
                    <Tooltip title="Visualizar Detalhes">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedCustomer(record);
                                setDrawerVisible(true);
                            }}
                            aria-label={`Ver detalhes do cliente ${record.name}`}
                        />
                    </Tooltip>
                    <Tooltip title="Deletar">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleting === record.userId}
                            onClick={() => handleDeletePassenger(record)}
                            aria-label={`Deletar cliente ${record.name}`}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Renderizar tabela ou vazio
    const tableContent = filteredCustomers.length > 0 ? (
        <ProfessionalTable
            columns={columns}
            dataSource={filteredCustomers}
            rowKey="userId"
            pagination={false}
        />
    ) : (
        <Empty description="Nenhum cliente encontrado" style={{ marginTop: 48 }} />
    );

    return (
        <div>
            <Card
                style={{
                    borderRadius: 16,
                    border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    background: isDark ? '#1F2937' : '#FFFFFF',
                }}
                styles={{ body: { padding: 0 } }}
            >
                <Spin spinning={loading}>
                    {tableContent}
                </Spin>
            </Card>

            {/* Drawer de Detalhes */}
            <Drawer
                title={`Detalhes do Cliente - ${selectedCustomer?.name}`}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={600}
            >
                {selectedCustomer && (
                    <>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="ID">
                                {selectedCustomer.userId}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nome">
                                {escapeHtml(selectedCustomer.name)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {escapeHtml(selectedCustomer.email)}
                            </Descriptions.Item>
                            <Descriptions.Item label="CPF">
                                {escapeHtml(selectedCustomer.cpf)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Telefone">
                                {escapeHtml(selectedCustomer.phone)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Data de Nascimento">
                                {dayjs(selectedCustomer.birthDate).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email Verificado">
                                <Tag color={selectedCustomer.emailVerified ? 'green' : 'red'}>
                                    {selectedCustomer.emailVerified ? 'Sim' : 'Não'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Data de Verificação do Email">
                                {dayjs(selectedCustomer.emailVerifiedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Data de Registro">
                                {dayjs(selectedCustomer.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Última Atualização">
                                {dayjs(selectedCustomer.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Ações */}
                        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                loading={deleting === selectedCustomer.userId}
                                onClick={() => handleDeletePassenger(selectedCustomer)}
                            >
                                Deletar Passageiro
                            </Button>
                            <Button
                                type="default"
                                icon={<ReloadOutlined />}
                                loading={reactivating === selectedCustomer.userId}
                                onClick={() => handleReactivatePassenger(selectedCustomer)}
                            >
                                Reativar
                            </Button>
                        </div>
                    </>
                )}
            </Drawer>
        </div>
    );
};