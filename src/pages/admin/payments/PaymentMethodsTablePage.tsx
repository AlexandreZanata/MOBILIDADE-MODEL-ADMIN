import React, { useEffect } from 'react';
import { Table, Tag, Card, Spin } from 'antd';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useTheme } from '@/themes/ThemeProvider';

export const PaymentMethodsTablePage:  React.FC = () => {
    const { methods, loading, fetchMethods } = usePaymentMethods();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    useEffect(() => {
        void fetchMethods();
    }, [fetchMethods]);

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '20%',
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            ellipsis: true,
        },
        {
            title: 'Ativo',
            dataIndex: 'enabled',
            key: 'enabled',
            width: '15%',
            render: (value:  boolean) => (value ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>),
        },
    ];

    return (
        <Card
            style={{
                borderRadius: 16,
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                background: isDark ?  '#1F2937' : '#FFFFFF',
                marginTop: 0,
                marginBottom: 0,
            }}
            styles={{ body: { padding: '16px' } }}
        >
            <Spin spinning={loading}>
                <div style={{ marginLeft: -16, marginRight: -16, marginBottom: -16 }}>
                    <Table
                        columns={columns}
                        dataSource={Array.isArray(methods) ? methods : []}
                        loading={loading}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </Spin>
        </Card>
    );
};