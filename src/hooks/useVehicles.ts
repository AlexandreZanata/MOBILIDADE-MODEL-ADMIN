import { useState, useCallback } from 'react';
import driverVehicleService from '@/services/driverVehicleService';
import { DriverVehicle } from '@/types/driver-vehicle';
import { message } from 'antd';

export interface UseVehiclesReturn {
    vehicles: DriverVehicle[];
    loading: boolean;
    fetchPendingVehicles: () => Promise<void>;
    approveVehicle: (vehicleId: string) => Promise<void>;
    rejectVehicle: (vehicleId: string, rejectionReason:  string) => Promise<void>;
}

export const useVehicles = (): UseVehiclesReturn => {
    const [vehicles, setVehicles] = useState<DriverVehicle[]>([]);
    const [loading, setLoading] = useState(false);

    // ========== CARREGADOR ==========
    const fetchPendingVehicles = useCallback(async () => {
        setLoading(true);
        try {
            console.log('🚗 Carregando veículos pendentes...');

            // ✅ CORRETO: Usa driverVehicleService com filtro de status
            const response = await driverVehicleService.listVehicles({
                limit: 100,
                sort: '-createdAt,licensePlate',
                status: 'PENDING',
            });

            console.log('✅ Resposta da API:', response);

            if (response.success && response.data?. items) {
                const vehiclesList = response.data.items;
                console.log('✅ Veículos carregados:', vehiclesList.length);
                setVehicles(vehiclesList);
            } else {
                console.warn('⚠️ Resposta sem veículos');
                setVehicles([]);
            }
        } catch (error:  any) {
            console.error('❌ Erro ao carregar veículos:', error);
            message.error('Erro ao carregar veículos pendentes');
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ========== APROVAR VEÍCULO ==========
    const approveVehicle = useCallback(async (vehicleId: string) => {
        try {
            console.log('✅ Aprovando veículo:', vehicleId);

            // ✅ CORRETO: Usa driverVehicleService
            const response = await driverVehicleService.approveVehicle(vehicleId);

            if (response.success) {
                console.log('✅ Veículo aprovado com sucesso');
                message.success('Veículo aprovado com sucesso! ');
            } else {
                throw new Error(response.error || 'Erro ao aprovar veículo');
            }
        } catch (error: any) {
            console.error('❌ Erro ao aprovar veículo:', error);
            throw new Error(error.message || 'Erro ao aprovar veículo');
        }
    }, []);

    // ========== REJEITAR VEÍCULO ==========
    const rejectVehicle = useCallback(async (vehicleId: string, rejectionReason:  string) => {
        try {
            console.log('❌ Rejeitando veículo:', vehicleId);
            console.log('📝 Motivo:', rejectionReason);

            // ✅ CORRETO: Usa driverVehicleService com rejectionReason
            const response = await driverVehicleService.rejectVehicle(vehicleId, rejectionReason);

            if (response.success) {
                console.log('✅ Veículo rejeitado com sucesso');
                message.success('Veículo rejeitado com sucesso!');
            } else {
                throw new Error(response.error || 'Erro ao rejeitar veículo');
            }
        } catch (error: any) {
            console.error('❌ Erro ao rejeitar veículo:', error);
            throw new Error(error.message || 'Erro ao rejeitar veículo');
        }
    }, []);

    return {
        vehicles,
        loading,
        fetchPendingVehicles,
        approveVehicle,
        rejectVehicle,
    };
};