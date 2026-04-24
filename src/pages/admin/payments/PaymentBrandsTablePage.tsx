import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Spin } from 'antd';
import { paymentService } from '@/services/api/paymentService';
import { PaymentBrand } from '@/types/payment';
import { message } from 'antd';
import { useTheme } from '@/themes/ThemeProvider';

export const PaymentBrandsTablePage:  React.FC = () => {
    const [brands, setBrands] = useState<PaymentBrand[]>([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    useEffect(() => {
        void loadBrands();
    }, []);

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

    const brandColumns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '40%',
        },
        {
            title: 'Ativo',
            dataIndex: 'enabled',
            key: 'enabled',
            width: '20%',
            render: (value:  boolean) => (value ? <Tag color="green">Sim</Tag> : <Tag color="red">Não</Tag>),
        },
    ];

    return (
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
            <Spin spinning={brandsLoading}>
                <div style={{ marginLeft: -16, marginRight: -16, marginBottom: -16 }}>
                    <Table
                        columns={brandColumns}
                        dataSource={Array.isArray(brands) ? brands : []}
                        loading={brandsLoading}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </Spin>
        </Card>
    );
};