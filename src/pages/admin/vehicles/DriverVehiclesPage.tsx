import React, { useState } from 'react';
import { Tabs } from 'antd';
import { DriverVehiclesList } from '@/components/Vehicles/DriverVehiclesList';

const TAB_KEYS = {
    pending: '1',
    approved: '2',
    rejected: '3',
};

export const DriverVehiclesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(TAB_KEYS.pending);
    const [refreshTrigger] = useState(0);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const items = [
        {
            key: TAB_KEYS.pending,
            label: 'Pendentes',
            children: <DriverVehiclesList refreshTrigger={refreshTrigger} />,
        },
        {
            key: TAB_KEYS.approved,
            label: 'Aprovados',
            children: <DriverVehiclesList refreshTrigger={refreshTrigger} />,
        },
        {
            key: TAB_KEYS.rejected,
            label: 'Rejeitados',
            children: <DriverVehiclesList refreshTrigger={refreshTrigger} />,
        },
    ];

    return (
        <div>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={items}
                type="card"
            />
        </div>
    );
};

export default DriverVehiclesPage;