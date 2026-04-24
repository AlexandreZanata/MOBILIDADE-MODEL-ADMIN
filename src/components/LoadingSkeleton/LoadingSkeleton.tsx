/**
 * LoadingSkeleton - Componente de loading com skeleton
 */

import React from 'react';
import { Skeleton } from 'antd';

interface LoadingSkeletonProps {
  rows?: number;
  avatar?: boolean;
  active?: boolean;
  paragraph?: boolean | { rows?: number };
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 3,
  avatar = false,
  active = true,
  paragraph = true,
}) => {
  return (
    <Skeleton
      avatar={avatar}
      active={active}
      paragraph={paragraph ? { rows } : false}
      aria-label="Carregando conteúdo"
    />
  );
};

