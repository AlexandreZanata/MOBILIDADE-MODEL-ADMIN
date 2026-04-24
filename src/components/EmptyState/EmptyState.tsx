/**
 * EmptyState - Componente para exibir estado vazio
 */

import React from 'react';
import { Empty } from 'antd';

interface EmptyStateProps {
  description?: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  description = 'Nenhum dado disponível',
  image,
  children,
}) => {
  return (
    <Empty
      image={image || Empty.PRESENTED_IMAGE_SIMPLE}
      description={description}
      aria-label={description}
    >
      {children}
    </Empty>
  );
};

