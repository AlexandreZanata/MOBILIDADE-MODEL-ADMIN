/**
 * Orders - Página de gestão de entregas/pedidos
 */

import React, { useState, useMemo } from 'react';
import { Card, Drawer, Descriptions, Typography, Button, Table } from 'antd';
import { BadgeStatus } from '@/components/BadgeStatus';
import { ProfessionalTable } from '@/components/ProfessionalTable';
import { BookIcon } from '@/components/BookIcon';
import { HighlightText } from '@/components/HighlightText';
import { mockOrders } from '@/mocks/data';
import { Order } from '@/types';
import dayjs from 'dayjs';
import { formatCurrency, formatPhone, escapeHtml } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';
import { useSearch } from '@/contexts/SearchContext';

const { Text } = Typography;

export const Orders: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { searchQuery, searchResults } = useSearch();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Filtrar pedidos baseado na busca
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return mockOrders;

    const orderResults = searchResults
      .filter(result => result.type === 'order')
      .map(result => result.item.id);

    return mockOrders.filter(order => orderResults.includes(order.id));
  }, [searchQuery, searchResults]);

  const columns = [
    {
      title: 'Número',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 120,
      render: (text: string) => <HighlightText text={text} />,
      sorter: (a: Order, b: Order) => a.orderNumber.localeCompare(b.orderNumber),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => <BadgeStatus status={status as any} />,
      filters: [
        { text: 'Pendente', value: 'pending' },
        { text: 'Aceito', value: 'accepted' },
        { text: 'Preparando', value: 'preparing' },
        { text: 'Pronto', value: 'ready' },
        { text: 'Retirado', value: 'picked_up' },
        { text: 'Em Trânsito', value: 'in_transit' },
        { text: 'Entregue', value: 'delivered' },
        { text: 'Cancelado', value: 'cancelled' },
      ],
      onFilter: (value: any, record: Order) => record.status === value,
    },
    {
      title: 'Valor',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Data/Hora',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Order, b: Order) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      fixed: 'right' as const,
      align: 'right' as const,
      render: (_: any, record: Order) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(record);
              setDrawerVisible(true);
            }}
            aria-label={`Ver detalhes do pedido ${record.orderNumber}`}
            style={{ 
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookIcon style={{ color: '#FF6B35' }} />
          </Button>
        </div>
      ),
    },
  ];

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
        <ProfessionalTable
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* Drawer de Detalhes */}
      <Drawer
        title={`Detalhes do Pedido ${selectedOrder?.orderNumber}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        {selectedOrder && (
          <>
            <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Número">
                {escapeHtml(selectedOrder.orderNumber)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <BadgeStatus status={selectedOrder.status} />
              </Descriptions.Item>
              <Descriptions.Item label="Cliente">
                {escapeHtml(selectedOrder.customer.name)}
              </Descriptions.Item>
              <Descriptions.Item label="Telefone">
                {formatPhone(selectedOrder.customer.phone)}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {escapeHtml(selectedOrder.customer.email)}
              </Descriptions.Item>
              {selectedOrder.driver ? (
                <>
                  <Descriptions.Item label="Entregador">
                    {escapeHtml(selectedOrder.driver.name)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Telefone do Entregador">
                    {formatPhone(selectedOrder.driver.phone)}
                  </Descriptions.Item>
                </>
              ) : (
                <Descriptions.Item label="Entregador">
                  <Text type="secondary">Não atribuído</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Typography.Title level={4}>Itens do Pedido</Typography.Title>
            <Table
              columns={[
                { title: 'Item', dataIndex: 'name', key: 'name', render: (text: string) => escapeHtml(text) },
                { title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
                { title: 'Preço Unit.', dataIndex: 'price', key: 'price', render: (price: number) => formatCurrency(price) },
                {
                  title: 'Subtotal',
                  key: 'subtotal',
                  render: (_: any, record: any) => formatCurrency(record.price * record.quantity),
                },
              ]}
              dataSource={selectedOrder.items}
              rowKey="id"
              pagination={false}
              size="small"
            />

            <Descriptions column={1} bordered style={{ marginTop: 24 }}>
              <Descriptions.Item label="Subtotal">
                {formatCurrency(selectedOrder.totalAmount - selectedOrder.deliveryFee)}
              </Descriptions.Item>
              <Descriptions.Item label="Taxa de Entrega">
                {formatCurrency(selectedOrder.deliveryFee)}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
              </Descriptions.Item>
            </Descriptions>

            <Typography.Title level={4} style={{ marginTop: 24 }}>Endereços</Typography.Title>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Origem">
                {escapeHtml(
                  `${selectedOrder.origin.street}, ${selectedOrder.origin.number}${selectedOrder.origin.complement ? ' - ' + selectedOrder.origin.complement : ''} - ${selectedOrder.origin.neighborhood}, ${selectedOrder.origin.city} - ${selectedOrder.origin.state}`
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Destino">
                {escapeHtml(
                  `${selectedOrder.destination.street}, ${selectedOrder.destination.number}${selectedOrder.destination.complement ? ' - ' + selectedOrder.destination.complement : ''} - ${selectedOrder.destination.neighborhood}, ${selectedOrder.destination.city} - ${selectedOrder.destination.state}`
                )}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

