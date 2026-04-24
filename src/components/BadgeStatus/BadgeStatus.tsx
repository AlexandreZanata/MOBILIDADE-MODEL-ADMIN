/**
 * BadgeStatus - Componente reutilizável para exibir status com cores consistentes
 * ✅ CORRIGIDO: Adicionados status conforme API spec
 */

import React from 'react';
import { Badge, Tag } from 'antd';
import { RideStatus } from '@/types';

interface BadgeStatusProps {
    status: RideStatus | string;
    text?: string;
    variant?: 'badge' | 'tag';
}

const statusConfig: Record<string, { color: string; label: string }> = {
    // ========== RIDE STATUS (Inglês) ==========
    REQUESTED: { color: 'default', label: 'Solicitada' },
    DRIVER_ASSIGNED: { color: 'processing', label: 'Motorista Atribuído' },
    DRIVER_ARRIVING: { color: 'warning', label: 'Motorista Chegando' },
    DRIVER_ARRIVED: { color: 'processing', label: 'Motorista Chegou' },
    IN_PROGRESS: { color: 'processing', label: 'Em Andamento' },
    WAITING_AT_DESTINATION: { color: 'warning', label: 'Aguardando Destino' },
    COMPLETED: { color: 'success', label: 'Concluída' },
    CANCELED_BY_RIDER: { color: 'error', label: 'CANCELADA' },
    CANCELED_BY_DRIVER: { color: 'error', label: 'CANCELADA' },
    NO_SHOW: { color: 'error', label: 'Não Compareceu' },
    EXPIRED: { color: 'error', label: 'Expirada' },

    // ========== RIDE STATUS (Português - conforme API) ==========
    CANCELADA_MOTORISTA: { color: 'error', label: 'CANCELADA' },
    CANCELADA_PASSAGEIRO: { color: 'error', label: 'CANCELADA' },

    // ========== DRIVER STATUS ==========
    online: { color: 'success', label: 'Online' },
    offline: { color: 'default', label: 'Offline' },
    busy: { color: 'warning', label: 'Ocupado' },
    unavailable: { color: 'error', label: 'Indisponível' },

    // ========== ORDER STATUS ==========
    pending: { color: 'default', label: 'Pendente' },
    accepted: { color: 'processing', label: 'Aceito' },
    preparing: { color: 'warning', label: 'Preparando' },
    ready: { color: 'processing', label: 'Pronto' },
    picked_up: { color: 'warning', label: 'Retirado' },
    in_transit: { color: 'processing', label: 'Em Trânsito' },
    delivered: { color: 'success', label: 'Entregue' },
    cancelled: { color: 'error', label: 'Cancelado' },
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
                                                            status,
                                                            text,
                                                            variant = 'tag'
                                                        }) => {
    const config = statusConfig[status] || { color: 'default', label: status };
    const displayText = text || config.label;

    if (variant === 'badge') {
        return (
            <Badge
                status={config.color as any}
                text={displayText}
                aria-label={`Status: ${displayText}`}
            />
        );
    }

    return (
        <Tag color={config.color} aria-label={`Status: ${displayText}`}>
            {displayText}
        </Tag>
    );
};