/**
 * KPIBox - Componente para exibir KPIs com ícone, valor e variação percentual
 * Cores: Azul #0374C8 e Amarelo #F7B733
 */

import React from 'react';
import { Card, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';

const { Text } = Typography;

interface KPIBoxProps {
    title: string;
    value: number | string;
    prefix?: React.ReactNode;
    suffix?: string;
    change?: number; // percentual
    format?: 'number' | 'currency' | 'percent';
    icon?: React.ReactNode;
    loading?: boolean;
}

export const KPIBox: React.FC<KPIBoxProps> = ({
                                                  title,
                                                  value,
                                                  prefix,
                                                  suffix,
                                                  change,
                                                  format = 'number',
                                                  icon,
                                                  loading = false,
                                              }) => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const formatValue = () => {
        if (typeof value === 'string') return value;

        switch (format) {
            case 'currency':
                return formatCurrency(value);
            case 'percent':
                return `${value.toFixed(1)}%`;
            default:
                return value.toLocaleString('pt-BR');
        }
    };

    const changeColor = change !== undefined
        ? (change >= 0 ? '#10B981' : '#EF4444')
        : undefined;

    const changeIcon = change !== undefined && change !== 0
        ? (change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />)
        : null;

    return (
        <Card
            loading={loading}
            style={{
                height: '100%',
                borderRadius: '16px',
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                boxShadow: isDark
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(3, 116, 200, 0.08)',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                background: isDark ? '#1F2937' : '#FFFFFF',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = isDark
                    ? '0 8px 12px rgba(3, 116, 200, 0.2)'
                    : '0 8px 16px rgba(3, 116, 200, 0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isDark
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(3, 116, 200, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <Statistic
                title={
                    <span style={{
                        color: isDark ? '#9CA3AF' : '#6B7280',
                        fontSize: 13,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
            {title}
          </span>
                }
                value={formatValue()}
                prefix={prefix || (icon && <span style={{ color: '#0374C8', fontSize: 24 }}>{icon}</span>)}
                suffix={suffix}
                valueStyle={{
                    color: isDark ? '#F9FAFB' : '#111827',
                    fontSize: 24,
                    fontWeight: 700,
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            />
            {change !== undefined && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Text
                        strong
                        style={{
                            color: changeColor,
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                        aria-label={`Variação: ${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
                    >
                        {changeIcon} {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: isDark ? '#6B7280' : '#9CA3AF',
                        }}
                    >
                        vs. período anterior
                    </Text>
                </div>
            )}
        </Card>
    );
};