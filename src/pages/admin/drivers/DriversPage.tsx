import React, { useState } from 'react';
import { Tabs } from 'antd';
import { PendingApplicationsPage } from './PendingApplicationsPage';
import { ApprovedDriversPage } from './ApprovedDriversPage';
import RegisterDriverModal from './RegisterDriverModal';

/**
 * ✅ Página principal de gerenciamento de motoristas
 * Container com abas para:
 * - Aplicações Pendentes
 * - Motoristas Aprovados
 * - Cadastrar Motorista
 */
export const DriversPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [registerModalVisible, setRegisterModalVisible] = useState(false);

    const items = [
        {
            key: 'pending',
            label: 'Aplicações Pendentes',
            children: <PendingApplicationsPage onNeedRefresh={() => setActiveTab('pending')} />,
        },
        {
            key: 'approved',
            label: 'Motoristas Aprovados',
            children: <ApprovedDriversPage />,
        },
        {
            key: 'register',
            label: '+ Cadastrar Motorista',
            children: null, // Sem conteúdo direto na aba
        },
    ];

    // Abrir modal quando clicar na aba de cadastro
    const handleTabChange = (key: string) => {
        if (key === 'register') {
            setRegisterModalVisible(true);
            // Volta para a aba anterior automaticamente
            setActiveTab('pending');
        } else {
            setActiveTab(key);
        }
    };

    return (
        <>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={items}
                type="card"
            />

            {/* Modal de Cadastro */}
            <RegisterDriverModal
                visible={registerModalVisible}
                onClose={() => setRegisterModalVisible(false)}
                onSuccess={() => {
                    setRegisterModalVisible(false);
                    setActiveTab('pending'); // Volta para abas Pendentes após sucesso
                }}
            />
        </>
    );
};

export default DriversPage;