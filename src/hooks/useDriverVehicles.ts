import { useState, useCallback } from 'react';
import { driverService } from '@/services/api/driverService.ts';
import driverVehicleService from '@/services/driverVehicleService';
import driversService from '@/services/driversService';
import { Vehicle } from '@/types/driver';
import { App } from 'antd';

interface UseDriverVehiclesReturn {
    vehicles: Vehicle[];
    loading: boolean;
    error: string | null;
    fetchVehicles: () => Promise<void>;
    fetchPendingVehicles: () => Promise<void>;
    registerVehicle: (vehicle: {
        brand_id: string;
        model_id: string;
        year: number;
        plate: string;
        chassis: string;
        color: string;
        metadata?: Record<string, any>;
    }) => Promise<boolean>;
    uploadDocument: (vehicleId: string, file: File) => Promise<boolean>;
}

export const useDriverVehicles = (): UseDriverVehiclesReturn => {
    const { message } = App.useApp();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Para motoristas: buscar seus próprios veículos
    const fetchVehicles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await driverVehicleService.listVehicles();
            setVehicles((response.data?.items as unknown as Vehicle[]) || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar veículos';
            console.error('Erro ao buscar veículos do motorista:', errorMessage);
            setError(errorMessage);
            message?.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [message]);

    // Para admin: buscar veículos pendentes de aprovação
    const fetchPendingVehicles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await driverVehicleService.listVehicles({ status: 'PENDING' });
            setVehicles((response.data?.items as unknown as Vehicle[]) || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err. message : 'Erro ao carregar veículos pendentes';
            console.error('Erro ao buscar veículos pendentes:', errorMessage);
            setError(errorMessage);
            message?.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [message]);

    const registerVehicle = useCallback(async (vehicle: {
        brand_id: string;
        model_id: string;
        year: number;
        plate: string;
        chassis: string;
        color: string;
        metadata?: Record<string, any>;
    }) => {
        try {
            setLoading(true);
            const response = await driverService.registerVehicle(vehicle);

            if (response.success) {
                setVehicles((prev) => [...prev, response.data]);
                message?.success('Veículo registrado com sucesso! ');
                return true;
            } else {
                message?.error(response.message || 'Erro ao registrar veículo');
                return false;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar veículo';
            setError(errorMessage);
            message?.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [message]);

    const uploadDocument = useCallback(async (vehicleId: string, file: File) => {
        try {
            setLoading(true);
            await driversService.uploadDocument(file, 'VEHICLE_DOC', vehicleId);
                message?.success('Documento enviado com sucesso!');
                return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar documento';
            setError(errorMessage);
            message?.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [message]);

    return {
        vehicles,
        loading,
        error,
        fetchVehicles,
        fetchPendingVehicles,
        registerVehicle,
        uploadDocument,
    };
};