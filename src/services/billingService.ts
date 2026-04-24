import api from './api';

/**
 * ✅ BILLING SERVICE
 * Gerencia ciclos de cobrança de motoristas
 * API: /v1/admin/billing
 */

export type BillingCycleStatus =
    | 'PENDING'
    | 'PROCESSING'
    | 'AWAITING_PAYMENT'
    | 'PAID'
    | 'PARTIALLY_PAID'
    | 'OVERDUE'
    | 'GRACE_PERIOD'
    | 'BLOCKED'
    | 'CANCELLED';

export interface BillingCycle {
    id: string;
    driverId: string;
    driverName: string;
    periodStart: string;
    periodEnd: string;
    rideCount: number;
    pricePerRide: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    status: BillingCycleStatus;
    pixGeneratedAt: string | null;
    pixExpiresAt: string | null;
    gracePeriodEndsAt: string | null;
    paidAt: string | null;
    blockedAt: string | null;
    createdAt: string;
}

export interface BillingConfig {
    cycleDays: number;
    executionTime: string;
    executionTimezone: string;
    pricePerRide: number;
    minimumCharge: number;
    pixExpirationDays: number;
    gracePeriodHours: number;
    autoBlockEnabled: boolean;
    blockAfterCycles: number;
    isActive: boolean;
}

export interface DriverBillingStatus {
    driverId: string;
    driverName: string;
    totalPending: number;
    totalPendingRides: number;
    blocked: boolean;
    blockedAt: string | null;
    blockedReason: string | null;
    cycles: BillingCycle[];
}

export interface PixQrCodeResponse {
    billingCycleId: string;
    paymentId: string;
    amount: number;
    qrCode: string;
    qrCodeBase64: string;
    copyPaste: string;
    expiresAt: string;
    externalReference: string;
    generatedAt: string;
}

export interface CreateTestDebtRequest {
    driverId: string;
    rideCount: number;
    pricePerRide: number;
    generatePixImmediately?: boolean;
}

export interface CreateTestDebtResponse {
    cycleId: string;
    driverId: string;
    rideCount: number;
    pricePerRide: number;
    totalAmount: number;
    status: BillingCycleStatus;
    periodStart: string;
    periodEnd: string;
    createdAt: string;
    pix?: PixQrCodeResponse;
    message?: string;
}

export interface JobHistory {
    id: string;
    jobType: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
    errorMessage: string | null;
    cyclesGenerated: number | null;
    driversBlocked: number | null;
}

export interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number;
}

const billingService = {
    /**
     * ✅ GET /v1/admin/billing/config
     * Retorna a configuração global do sistema de cobrança
     */
    getConfig: async (): Promise<BillingConfig> => {
        try {
            const response = await api.get<BillingConfig>('/api/v1/admin/billing/config');
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao buscar configuração:', errorMsg);
            throw new Error(errorMsg || 'Erro ao buscar configuração');
        }
    },

    /**
     * ✅ PUT /v1/admin/billing/config
     * Atualiza a configuração global
     */
    updateConfig: async (config: Partial<BillingConfig>): Promise<BillingConfig> => {
        try {
            const response = await api.put<BillingConfig>('/api/v1/admin/billing/config', config);
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao atualizar configuração:', errorMsg);
            throw new Error(errorMsg || 'Erro ao atualizar configuração');
        }
    },

    /**
     * ✅ POST /v1/admin/billing/jobs/billing-cycle/run
     * Executa o job de geração de ciclos manualmente
     */
    runBillingCycleJob: async (): Promise<void> => {
        try {
            await api.post('/api/v1/admin/billing/jobs/billing-cycle/run');
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao executar job de ciclos:', errorMsg);
            throw new Error(errorMsg || 'Erro ao executar job de ciclos');
        }
    },

    /**
     * ✅ POST /v1/admin/billing/jobs/expiration-check/run
     * Verifica ciclos vencidos e aplica bloqueios
     */
    runExpirationCheckJob: async (): Promise<void> => {
        try {
            await api.post('/api/v1/admin/billing/jobs/expiration-check/run');
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao executar job de expiração:', errorMsg);
            throw new Error(errorMsg || 'Erro ao executar job de expiração');
        }
    },

    /**
     * ✅ GET /v1/admin/billing/jobs/history
     * Lista histórico de execuções dos jobs
     */
    getJobHistory: async (params?: {
        limit?: number;
        cursor?: string;
    }): Promise<PaginatedResponse<JobHistory>> => {
        try {
            const queryParams: Record<string, any> = {};
            if (params?.limit) queryParams.limit = params.limit;
            if (params?.cursor) queryParams.cursor = params.cursor;

            const response = await api.get<PaginatedResponse<JobHistory>>(
                '/api/v1/admin/billing/jobs/history',
                { params: queryParams }
            );
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao buscar histórico de jobs:', errorMsg);
            return {
                items: [],
                nextCursor: null,
                prevCursor: null,
                hasMore: false,
                totalCount: 0,
            };
        }
    },

    /**
     * ✅ GET /v1/admin/billing/drivers/{driverId}/status
     * Retorna status completo de cobrança de um motorista
     */
    getDriverStatus: async (driverId: string): Promise<DriverBillingStatus> => {
        try {
            const response = await api.get<DriverBillingStatus>(
                `/api/v1/admin/billing/drivers/${driverId}/status`
            );
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao buscar status do motorista:', errorMsg);
            throw new Error(errorMsg || 'Erro ao buscar status do motorista');
        }
    },

    /**
     * ✅ GET /v1/admin/billing/drivers/{driverId}/cycles
     * Lista ciclos de cobrança do motorista
     */
    getDriverCycles: async (
        driverId: string,
        params?: {
            status?: BillingCycleStatus;
            cursor?: string;
            limit?: number;
        }
    ): Promise<PaginatedResponse<BillingCycle>> => {
        try {
            const queryParams: Record<string, any> = {};
            if (params?.status) queryParams.status = params.status;
            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.limit) queryParams.limit = params.limit;

            const response = await api.get<PaginatedResponse<BillingCycle>>(
                `/api/v1/admin/billing/drivers/${driverId}/cycles`,
                { params: queryParams }
            );
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao buscar ciclos do motorista:', errorMsg);
            return {
                items: [],
                nextCursor: null,
                prevCursor: null,
                hasMore: false,
                totalCount: 0,
            };
        }
    },

    /**
     * ✅ POST /v1/admin/billing/drivers/{driverId}/unblock
     * Desbloqueia um motorista manualmente
     */
    unblockDriver: async (driverId: string): Promise<void> => {
        try {
            await api.post(`/api/v1/admin/billing/drivers/${driverId}/unblock`);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao desbloquear motorista:', errorMsg);
            throw new Error(errorMsg || 'Erro ao desbloquear motorista');
        }
    },

    /**
     * ✅ GET /v1/admin/billing/cycles/{cycleId}
     * Detalhes de um ciclo específico
     */
    getCycle: async (cycleId: string): Promise<BillingCycle> => {
        try {
            const response = await api.get<BillingCycle>(`/api/v1/admin/billing/cycles/${cycleId}`);
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao buscar ciclo:', errorMsg);
            throw new Error(errorMsg || 'Erro ao buscar ciclo');
        }
    },

    /**
     * ✅ GET /v1/admin/billing/cycles
     * Lista todos os ciclos (com filtros opcionais)
     */
    listCycles: async (params?: {
        status?: BillingCycleStatus;
        driverId?: string;
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<BillingCycle>> => {
        try {
            const queryParams: Record<string, any> = {};
            if (params?.status) queryParams.status = params.status;
            if (params?.driverId) queryParams.driverId = params.driverId;
            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.limit) queryParams.limit = params.limit || 20;
            if (params?.sort) queryParams.sort = params.sort;

            const response = await api.get<PaginatedResponse<BillingCycle>>(
                '/api/v1/admin/billing/cycles',
                { params: queryParams }
            );
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao listar ciclos:', errorMsg);
            return {
                items: [],
                nextCursor: null,
                prevCursor: null,
                hasMore: false,
                totalCount: 0,
            };
        }
    },

    /**
     * ⚠️ POST /v1/admin/billing/test/create-debt
     * Criar débito de teste
     * APENAS PARA DESENVOLVIMENTO/HOMOLOGAÇÃO
     * Cria um débito de cobrança instantaneamente para um motorista, sem depender do ciclo automático de cobrança.
     */
    createTestDebt: async (
        request: CreateTestDebtRequest
    ): Promise<CreateTestDebtResponse> => {
        try {
            const response = await api.post<CreateTestDebtResponse>(
                '/api/v1/admin/billing/test/create-debt',
                {
                    driverId: request.driverId,
                    rideCount: request.rideCount,
                    pricePerRide: request.pricePerRide,
                    generatePixImmediately:
                        request.generatePixImmediately !== undefined
                            ? request.generatePixImmediately
                            : true,
                }
            );
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao criar débito de teste:', errorMsg);
            throw new Error(errorMsg || 'Erro ao criar débito de teste');
        }
    },
};

export default billingService;

