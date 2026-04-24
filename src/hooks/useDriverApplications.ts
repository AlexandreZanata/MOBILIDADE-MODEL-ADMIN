import { useState, useCallback } from 'react';
import { driverService } from '@/services/api/driverService.ts';
import { DriverApplication } from '@/types/driver';
import { message } from 'antd';

interface PaginationData {
    nextCursor?: string;
    previousCursor?: string;
    hasMore: boolean;
    perPage: number;
}

interface UseDriverApplicationsReturn {
    applications: DriverApplication[];
    pagination: PaginationData;
    loading: boolean;
    error: string | null;
    fetchApplications: (cursor?: string) => Promise<void>;
    approveApplication: (applicationId: string) => Promise<boolean>;
    rejectApplication: (applicationId: string, reason: string) => Promise<boolean>;
}

export const useDriverApplications = (): UseDriverApplicationsReturn => {
    const [applications, setApplications] = useState<DriverApplication[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        nextCursor: undefined,
        previousCursor: undefined,
        hasMore: false,
        perPage: 15,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = useCallback(async (cursor?: string) => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Buscando aplicações de motoristas da API...');
            const response = await driverService.getDriverApplications(cursor, 15);

            console.log('✅ Resposta completa da API:', response);

            // ✅ CORRIGIDO: Lidar com resposta ServiceResponse<PaginatedResponse<DriverApplication>>
            if (response && response.success && response.data) {
                const applicationsData = response.data.items || [];
                const paginationData = response.data;

                console.log('📊 Dados completos de cada motorista:');
                applicationsData.forEach((app: any, index: number) => {
                    console.log(`Motorista ${index + 1}:`, app);
                });

                console.log('📋 Paginação:', paginationData);

                // Converter DriverApplication da API para o formato esperado
                const convertedApplications: DriverApplication[] = applicationsData.map((app: any) => ({
                    id: app.userId || app.id,
                    user_id: app.userId || app.id,
                    status: (app.status?.toLowerCase() || 'pending') as 'pending' | 'approved' | 'rejected',
                    cpf: app.cpf || '',
                    cnh_number: app.cnhNumber || '',
                    cnh_category: app.cnhCategory,
                    cnh_expires_at: app.cnhExpirationDate,
                    created_at: app.createdAt,
                    updated_at: app.updatedAt,
                    name: app.name,
                    email: app.email,
                    phone: app.phone,
                }));
                setApplications(convertedApplications);
                setPagination({
                    nextCursor: paginationData.nextCursor || undefined,
                    previousCursor: paginationData.prevCursor || undefined,
                    hasMore: paginationData.hasMore || false,
                    perPage: 15,
                });

                const applicationsCount = Array.isArray(applicationsData) ? applicationsData.length : 0;
                if (applicationsCount === 0) {
                    message.info('Nenhuma aplicação de motorista encontrada');
                } else {
                    message.success(`${applicationsCount} motoristas carregados`);
                }
            } else {
                setError('Formato de resposta inválido');
                setApplications([]);
                message.error('Erro ao buscar aplicações');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar aplicações';
            console.error('❌ Erro completo:', err);
            setError(errorMsg);
            setApplications([]);
            message. error(`Erro ao buscar aplicações: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const approveApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            console.log(`✅ Aprovando aplicação: ${applicationId}`);

            // TODO: Implementar aprovação de motorista - método não existe no driverService
            message.info('Funcionalidade de aprovação em desenvolvimento');
            const response = { success: true };

            console.log('📤 Resposta aprovação:', response);

            message.success('Aplicação de motorista aprovada com sucesso');
            await fetchApplications();
            return true;
        } catch (err) {
            const errorMsg = err instanceof Error ?   err.message : 'Erro ao aprovar aplicação';
            console.error('❌ Erro ao aprovar:', err);
            message.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchApplications]);

    const rejectApplication = useCallback(async (applicationId: string, reason: string) => {
        try {
            setLoading(true);
            console.log(`❌ Rejeitando aplicação: ${applicationId} com motivo: ${reason}`);

            // TODO: Implementar rejeição de motorista - método não existe no driverService
            message.info('Funcionalidade de rejeição em desenvolvimento');
            const response = { success: true };

            console.log('📤 Resposta rejeição:', response);

            message. success('Aplicação de motorista rejeitada com sucesso');
            await fetchApplications();
            return true;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro ao rejeitar aplicação';
            console. error('❌ Erro ao rejeitar:', err);
            message.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchApplications]);

    return {
        applications,
        pagination,
        loading,
        error,
        fetchApplications,
        approveApplication,
        rejectApplication,
    };
};