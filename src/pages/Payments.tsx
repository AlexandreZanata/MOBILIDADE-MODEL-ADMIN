import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { PaymentMethodsTablePage } from './admin/payments/PaymentMethodsTablePage';
import { PaymentBrandsTablePage } from './admin/payments/PaymentBrandsTablePage';
import { ServiceCategoriesTablePage } from './admin/payments/ServiceCategoriesTablePage';
import { CreateTestDebtModal } from './admin/payments/CreateTestDebtModal';

export const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('methods');
  const [testDebtModalVisible, setTestDebtModalVisible] = useState(false);

  const items = [
    {
      key: 'methods',
      label: 'Métodos de Pagamento',
      children: <PaymentMethodsTablePage />,
    },
    {
      key: 'brands',
      label: 'Bandeiras de Cartão',
      children: <PaymentBrandsTablePage />,
    },
    {
      key: 'categories',
      label: 'Categorias de Serviço',
      children: <ServiceCategoriesTablePage />,
    },
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        type="card"
        tabBarExtraContent={
          <Button
            type="primary"
            icon={<ExperimentOutlined />}
            onClick={() => setTestDebtModalVisible(true)}
            style={{ marginRight: 8 }}
          >
            Criar Débito de Teste
          </Button>
        }
      />

      <CreateTestDebtModal
        visible={testDebtModalVisible}
        onClose={() => setTestDebtModalVisible(false)}
        onSuccess={() => {
          setTestDebtModalVisible(false);
        }}
      />
    </div>
  );
};

export default Payments;