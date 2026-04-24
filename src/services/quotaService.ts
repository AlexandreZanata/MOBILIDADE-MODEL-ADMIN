/**
 * ✅ QUOTA SERVICE
 * Serviço para gerenciar estatísticas de quota da API
 * Endpoint: GET /v1/places/quota
 */

import api from './api';
import { QuotaStatistics } from '@/types/quota';

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

const quotaService = {
    /**
     * ✅ Obter estatísticas de quota
     * GET /v1/places/quota
     *
     * Response:
     * {
     *   "date": "2025-12-09",
     *   "currentCost": 1.25,
     *   "dailyBudget": 5,
     *   "budgetUsedPercent": 25,
     *   "totalRequests": 150,
     *   "totalCacheHits": 120,
     *   "cacheHitRatePercent": 80,
     *   "autocompleteRequests": 100,
     *   "geocodingRequests": 30,
     *   "reverseGeocodingRequests":  15,
     *   "placeDetailsRequests": 5
     * }
     */
    getQuotaStatistics:  async (): Promise<ServiceResponse<QuotaStatistics>> => {
        try {
            console.log('📊 Obtendo estatísticas de quota...');

            // ✅ CORRIGIDO: api.get() retorna a resposta completa do axios
            const response = await api. get<QuotaStatistics>('/v1/places/quota');

            console.log('✅ Resposta bruta do axios:', response);

            // ✅ IMPORTANTE: Extrair response.data que contém os dados reais
            const quotaData = response.data;

            console.log('✅ Dados extraídos (response.data):', quotaData);

            // ✅ Validar se temos dados
            if (!quotaData || ! quotaData.date) {
                console.error('❌ Resposta não contém os campos esperados:', quotaData);
                throw new Error('Resposta inválida: dados de quota não encontrados');
            }

            console.log('✅ Quota obtida com sucesso:', quotaData);

            return {
                success: true,
                data: quotaData,
            };
        } catch (error:  any) {
            const errorMsg =
                error.response?.data?.error?. message ||
                error.message ||
                'Erro ao obter estatísticas de quota';

            console.error('❌ Erro ao obter quota:', errorMsg);
            console.error('❌ Detalhes do erro:', error);

            return {
                success: false,
                error: errorMsg,
                message: 'Falha ao carregar dados de quota',
            };
        }
    },

    /**
     * ✅ Calcular percentual de alerta (80% do orçamento)
     */
    isAlertThreshold: (budgetUsedPercent: number): boolean => {
        return budgetUsedPercent >= 80;
    },

    /**
     * ✅ Calcular se atingiu limite (100% do orçamento)
     */
    isLimitReached: (budgetUsedPercent: number): boolean => {
        return budgetUsedPercent >= 100;
    },

    /**
     * ✅ Calcular saldo restante do dia
     */
    getRemainingBudget: (currentCost: number, dailyBudget: number): number => {
        return Math.max(0, dailyBudget - currentCost);
    },

    /**
     * ✅ Obter status de saúde da quota
     */
    getQuotaHealth: (budgetUsedPercent: number): 'healthy' | 'warning' | 'critical' => {
        if (budgetUsedPercent >= 100) return 'critical';
        if (budgetUsedPercent >= 80) return 'warning';
        return 'healthy';
    },
};

export default quotaService;