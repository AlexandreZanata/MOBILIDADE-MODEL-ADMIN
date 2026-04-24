/**
 * DriverCard - Card profissional para exibir informações do motorista
 */

import React from 'react';
import { Card, Avatar, Rate, Button, Space, Typography, Tag, Divider } from 'antd';
import { PhoneOutlined, MessageOutlined, CarOutlined, StarFilled } from '@ant-design/icons';
import { BadgeStatus } from '../BadgeStatus';
import { formatPhone, escapeHtml } from '@/utils/escape';
import { useTheme } from '@/themes/ThemeProvider';

const { Text, Title } = Typography;

// Tipo estendido para Driver com propriedades opcionais adicionais
interface ExtendedDriver {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  cnh_number?: string;
  status?: string;
  vehicle?: {
    type: string;
    brand: string;
    model: string;
    plate: string;
  };
  photo?: string;
  rating?: number;
  totalRides?: number;
  [key: string]: any;
}

interface DriverCardProps {
  driver: ExtendedDriver;
  onContact?: (driver: ExtendedDriver) => void;
  onMessage?: (driver: ExtendedDriver) => void;
  onViewDetails?: (driver: ExtendedDriver) => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onContact,
  onMessage,
  onViewDetails,
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  
  // Garantir que phone existe
  const driverPhone = driver.phone || '';

  const getVehicleIcon = () => {
    if (!driver.vehicle) return null;
    switch (driver.vehicle.type) {
      case 'car':
        return '🚗';
      case 'motorcycle':
        return '🏍️';
      case 'bicycle':
        return '🚲';
      default:
        return '🚕';
    }
  };

  return (
    <Card
      hoverable
      style={{
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
        boxShadow: isDark
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          padding: 20,
          background: isDark ? '#1F2937' : '#FFFFFF',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      onClick={() => onViewDetails?.(driver)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails?.(driver);
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 12px 24px -4px rgba(0, 0, 0, 0.4)'
          : '0 8px 16px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
    >
      {/* Header com Avatar e Status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16, minHeight: 64 }}>
        <Avatar
          src={driver.photo}
          size={64}
          alt={`Foto de ${escapeHtml(driver.name)}`}
          style={{
            border: '3px solid',
            borderColor: (driver.status === 'online' || driver.status === 'active') ? '#10B981' : (driver.status === 'busy' || driver.status === 'pending') ? '#FF6B35' : '#9CA3AF',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            flexShrink: 0,
          }}
        >
          {driver.name.charAt(0).toUpperCase()}
        </Avatar>
        <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
            <Title 
              level={5} 
              style={{ 
                margin: 0, 
                color: isDark ? '#F9FAFB' : '#111827',
                fontSize: 15,
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {escapeHtml(driver.name)}
            </Title>
            <BadgeStatus status={driver.status || 'default'} variant="badge" />
          </div>
          {(driver.rating !== undefined || driver.totalRides !== undefined) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              {driver.rating !== undefined && (
                <>
                  <Rate
                    disabled
                    defaultValue={driver.rating}
                    allowHalf
                    character={<StarFilled />}
                    style={{ fontSize: 12 }}
                  />
                  <Text
                    strong
                    style={{
                      fontSize: 13,
                      color: '#FF6B35',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {driver.rating.toFixed(1)}
                  </Text>
                </>
              )}
              {driver.totalRides !== undefined && (
                <Text
                  style={{
                    fontSize: 11,
                    color: isDark ? '#9CA3AF' : '#6B7280',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ({driver.totalRides})
                </Text>
              )}
            </div>
          )}
        </div>
      </div>

      <Divider style={{ margin: '12px 0', borderColor: isDark ? '#374151' : '#E5E7EB' }} />

      {/* Informações do Veículo */}
      {driver.vehicle && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CarOutlined style={{ color: '#FF6B35', fontSize: 16 }} />
            <Text
              strong
              style={{
                fontSize: 13,
                color: isDark ? '#D1D5DB' : '#374151',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {driver.vehicle.brand} {driver.vehicle.model}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag
              color={isDark ? 'default' : 'blue'}
              style={{
                borderRadius: 6,
                margin: 0,
                fontSize: 11,
                padding: '2px 8px',
              }}
            >
              {driver.vehicle.plate}
            </Tag>
            <Tag
              style={{
                borderRadius: 6,
                margin: 0,
                fontSize: 11,
                padding: '2px 8px',
                background: isDark ? '#374151' : '#F3F4F6',
                color: isDark ? '#D1D5DB' : '#6B7280',
                border: 'none',
              }}
            >
              {getVehicleIcon()} {driver.vehicle.type === 'car' ? 'Carro' : driver.vehicle.type === 'motorcycle' ? 'Moto' : 'Bicicleta'}
            </Tag>
          </div>
        </div>
      )}

      {/* Contato */}
      <div style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            display: 'block',
            marginBottom: 4,
          }}
        >
          Telefone
        </Text>
        <Text
          strong
          style={{
            fontSize: 14,
            color: isDark ? '#F9FAFB' : '#111827',
          }}
        >
          {driverPhone ? formatPhone(driverPhone) : 'N/A'}
        </Text>
      </div>

      {/* Ações */}
      <Space size="small" style={{ width: '100%', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          icon={<PhoneOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onContact?.(driver);
          }}
          style={{
            flex: 1,
            borderRadius: 8,
            height: 36,
            background: '#FF6B35',
            borderColor: '#FF6B35',
          }}
          aria-label={`Ligar para ${escapeHtml(driver.name)}`}
        >
          Ligar
        </Button>
        <Button
          icon={<MessageOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onMessage?.(driver);
          }}
          style={{
            flex: 1,
            borderRadius: 8,
            height: 36,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            color: isDark ? '#F9FAFB' : '#111827',
          }}
          aria-label={`Enviar mensagem para ${escapeHtml(driver.name)}`}
        >
          Mensagem
        </Button>
      </Space>
    </Card>
  );
};
