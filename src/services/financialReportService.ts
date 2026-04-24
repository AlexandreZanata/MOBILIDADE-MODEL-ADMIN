/**
 * ✅ FINANCIAL REPORT SERVICE
 * Serviço para calcular relatórios financeiros de corridas
 * Ganho por corrida: R$ 1,00
 * Gasto: Valor da API de quota
 */

export interface FinancialSummary {
    period: string;
    totalRidesCompleted: number;

    // GANHO
    gainPerRide: number; // R$ 1,00 por corrida
    totalGainBruto: number; // Ganho total (totalRidesCompleted * 1)

    // GASTO
    apiQuotaCost: number; // Custo da API

    // LUCRO
    totalLiquidProfit: number; // Bruto - Gasto

    // ESTATÍSTICAS
    averageRideValue: number;
    profitMargin: number; // percentual

    // ESTIMATIVAS
    estimatedDailyGain: number;
    estimatedMonthlyCost: number;
    estimatedMonthlyProfit: number;
}

export interface RideMetrics {
    id: string;
    status: string;
    fare?: number;
}

const financialReportService = {
    /**
     * Gerar relatório financeiro completo
     * Ganho:  R$ 1,00 por corrida completada
     * Gasto:  Valor da API (quotaCost)
     */
    generateFinancialReport: (
        rides: RideMetrics[],
        apiQuotaCost: number = 0,
        daysInPeriod: number = 1
    ): FinancialSummary => {
        // ===== CALCULAR GANHOS =====

        // Corridas completadas
        const completedRides = rides.filter(r =>
            ['COMPLETED', 'IN_PROGRESS', 'WAITING_AT_DESTINATION'].includes(r.status)
        );

        const totalRidesCompleted = completedRides.length;
        const gainPerRide = 1.00; // R$ 1,00 por corrida
        const totalGainBruto = totalRidesCompleted * gainPerRide;

        // ===== CALCULAR GASTO (API) =====
        const apiCost = apiQuotaCost; // Custo da API

        // ===== LUCRO LÍQUIDO =====
        const totalLiquidProfit = totalGainBruto - apiCost;

        // ===== ESTATÍSTICAS =====
        const averageRideValue = totalRidesCompleted > 0
            ? totalGainBruto / totalRidesCompleted
            : 0;

        const profitMargin = totalGainBruto > 0
            ? ((totalLiquidProfit / totalGainBruto) * 100)
            : 0;

        // ===== ESTIMATIVAS DIÁRIAS/MENSAIS =====
        const estimatedDailyGain = totalGainBruto / daysInPeriod;
        const estimatedMonthlyCost = (apiCost / daysInPeriod) * 30;
        const estimatedMonthlyProfit = (estimatedDailyGain * 30) - estimatedMonthlyCost;

        return {
            period: new Date().toLocaleDateString('pt-BR'),
            totalRidesCompleted,
            gainPerRide,
            totalGainBruto,
            apiQuotaCost: apiCost,
            totalLiquidProfit,
            averageRideValue,
            profitMargin,
            estimatedDailyGain,
            estimatedMonthlyCost,
            estimatedMonthlyProfit,
        };
    },

    /**
     * Calcular percentual de margem de lucro
     */
    getProfitMarginColor: (margin: number): string => {
        if (margin >= 50) return '#10B981'; // Verde - Excelente
        if (margin >= 40) return '#3B82F6'; // Azul - Bom
        if (margin >= 30) return '#F59E0B'; // Amarelo - Aceitável
        return '#EF4444'; // Vermelho - Crítico
    },
};

export default financialReportService;