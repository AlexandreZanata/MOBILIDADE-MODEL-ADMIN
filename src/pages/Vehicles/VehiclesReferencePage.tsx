import React, { useState, useCallback } from 'react';
import { Tabs, message, Spin } from 'antd';
import { VehicleBrand } from '@/types/vehicle-reference';
import vehicleReferenceService from '@/services/vehicleReferenceService';
import { BrandsList } from '@/components/Vehicles/BrandsList';
import { ModelsList } from '@/components/Vehicles/ModelsList';
import { MinYearSettings } from '@/components/Vehicles/MinYearSettings';
import { DriverVehiclesList } from '@/components/Vehicles/DriverVehiclesList';

const TAB_KEYS = {
    driverVehicles: '0',
    brands: '1',
    models: '2',
    settings: '3',
};

export const VehiclesReferencePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(TAB_KEYS.driverVehicles);
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [refreshTrigger] = useState(0);

    const loadBrands = useCallback(async () => {
        setBrandsLoading(true);
        try {
            console.log('Carregando todas as marcas.. .');
            const response = await vehicleReferenceService.listBrands({
                limit: 100,
            });

            if (response. success && response.data) {
                console.log('Marcas carregadas:', response.data. items. length);
                setBrands(response.data.items);
            } else {
                message.error('Erro ao carregar marcas');
                setBrands([]);
            }
        } catch (error: any) {
            message.error('Erro ao carregar marcas');
            console.error(error);
            setBrands([]);
        } finally {
            setBrandsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const items = [
        {
            key: TAB_KEYS. driverVehicles,
            label: 'Veículos de Motoristas',
            children: <DriverVehiclesList refreshTrigger={refreshTrigger} />,
        },
        {
            key: TAB_KEYS.brands,
            label: 'Marcas de Veículos',
            children: <BrandsList refreshTrigger={refreshTrigger} />,
        },
        {
            key: TAB_KEYS.models,
            label: 'Modelos de Veículos',
            children: (
                <Spin spinning={brandsLoading}>
                    {brands.length === 0 ? (
                        <div style={{ padding: '50px', textAlign: 'center', color: '#999' }}>
                            <p>Carregando marcas... </p>
                        </div>
                    ) : (
                        <ModelsList brands={brands} refreshTrigger={refreshTrigger} />
                    )}
                </Spin>
            ),
        },
        {
            key: TAB_KEYS.settings,
            label: 'Configurações',
            children: <MinYearSettings refreshTrigger={refreshTrigger} />,
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

export default VehiclesReferencePage;