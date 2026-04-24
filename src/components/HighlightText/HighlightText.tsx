/**
 * HighlightText - Componente para destacar texto em resultados de busca
 */

import React from 'react';
import { useSearch } from '@/contexts/SearchContext';

interface HighlightTextProps {
  text: string;
  children?: React.ReactNode;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, children }) => {
  const { highlightText } = useSearch();
  const content = children || text;
  
  if (typeof content === 'string') {
    return <>{highlightText(content)}</>;
  }
  
  return <>{content}</>;
};

