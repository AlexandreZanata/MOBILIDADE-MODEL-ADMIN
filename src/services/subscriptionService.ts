import apiClient from './apiClient';

export interface SubscriptionPlan {
    id: string;
    name: string;
    amount: number;
    billing_cycle: string;
}

export interface Subscription {
    id: string;
    plan_id: string;
    status: string;
    created_at: string;
}

const subscriptionService = {
    getMe: async () => {
        return apiClient.get<Subscription>('/subscriptions/me');
    },

    getStatus: async () => {
        return apiClient.get('/subscriptions/status');
    },

    getPaymentLink: async () => {
        return apiClient.get('/subscriptions/payment-link');
    },

    listPlans: async () => {
        return apiClient.get<SubscriptionPlan[]>('/subscriptions/plans');
    },

    create: async (planId: string) => {
        return apiClient.post('/subscriptions', { plan_id: planId });
    },
};

export default subscriptionService;