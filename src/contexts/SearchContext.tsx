/**
 * SearchContext - Contexto global para busca inteligente
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockDrivers, mockRides, mockOrders } from '@/mocks/data';
import { Driver, Ride, Order } from '@/types';

interface SearchResult {
  type: 'driver' | 'ride' | 'order';
  route: string;
  item: Driver | Ride | Order | any; // Permite tipos mock também
  matchedFields: string[];
  matchedText: string;
}

interface SearchContextType {
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  highlightText: (text: string) => ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQueryState] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Função para normalizar texto para busca
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Função para verificar se o texto contém a query
  const matchesQuery = (text: string, query: string): boolean => {
    if (!query) return false;
    return normalizeText(text).includes(normalizeText(query));
  };

  // Função para buscar em todos os dados
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];

    // Buscar motoristas
    mockDrivers.forEach((driver) => {
      const matchedFields: string[] = [];
      let matchedText = '';

      if (matchesQuery(driver.name, query)) {
        matchedFields.push('name');
        matchedText = driver.name;
      }
      if (matchesQuery(driver.email, query)) {
        matchedFields.push('email');
        if (!matchedText) matchedText = driver.email;
      }
      if (matchesQuery(driver.phone, query)) {
        matchedFields.push('phone');
        if (!matchedText) matchedText = driver.phone;
      }
      if (driver.vehicle && matchesQuery(`${driver.vehicle.brand} ${driver.vehicle.model}`, query)) {
        matchedFields.push('vehicle');
        if (!matchedText) matchedText = `${driver.vehicle.brand} ${driver.vehicle.model}`;
      }
      if (driver.vehicle && matchesQuery(driver.vehicle.plate, query)) {
        matchedFields.push('plate');
        if (!matchedText) matchedText = driver.vehicle.plate;
      }

      if (matchedFields.length > 0) {
        results.push({
          type: 'driver',
          route: '/drivers',
          item: driver,
          matchedFields,
          matchedText,
        });
      }
    });

    // Buscar corridas
    mockRides.forEach((ride) => {
      const matchedFields: string[] = [];
      let matchedText = '';

      if (ride.rideNumber && matchesQuery(ride.rideNumber, query)) {
        matchedFields.push('rideNumber');
        matchedText = ride.rideNumber;
      }
      if (ride.customer && ride.customer.name && matchesQuery(ride.customer.name, query)) {
        matchedFields.push('customer');
        if (!matchedText) matchedText = ride.customer.name;
      }
      if (ride.driver && ride.driver.name && matchesQuery(ride.driver.name, query)) {
        matchedFields.push('driver');
        if (!matchedText) matchedText = ride.driver.name;
      }
      if (ride.origin && ride.origin.street && matchesQuery(ride.origin.street, query)) {
        matchedFields.push('origin');
        if (!matchedText) matchedText = ride.origin.street;
      }
      if (ride.destination && ride.destination.street && matchesQuery(ride.destination.street, query)) {
        matchedFields.push('destination');
        if (!matchedText) matchedText = ride.destination.street;
      }

      if (matchedFields.length > 0) {
        results.push({
          type: 'ride',
          route: '/rides',
          item: ride,
          matchedFields,
          matchedText,
        });
      }
    });

    // Buscar pedidos/entregas
    mockOrders.forEach((order) => {
      const matchedFields: string[] = [];
      let matchedText = '';

      if (order.orderNumber && matchesQuery(order.orderNumber, query)) {
        matchedFields.push('orderNumber');
        matchedText = order.orderNumber;
      }
      if (order.customer && order.customer.name && matchesQuery(order.customer.name, query)) {
        matchedFields.push('customer');
        if (!matchedText) matchedText = order.customer.name;
      }
      if (order.driver && order.driver.name && matchesQuery(order.driver.name, query)) {
        matchedFields.push('driver');
        if (!matchedText) matchedText = order.driver.name;
      }
      if (order.destination && order.destination.street && matchesQuery(order.destination.street, query)) {
        matchedFields.push('destination');
        if (!matchedText) matchedText = order.destination.street;
      }
      if (order.origin && order.origin.street && matchesQuery(order.origin.street, query)) {
        matchedFields.push('origin');
        if (!matchedText) matchedText = order.origin.street;
      }

      if (matchedFields.length > 0) {
        results.push({
          type: 'order',
          route: '/orders',
          item: order,
          matchedFields,
          matchedText,
        });
      }
    });

    setSearchResults(results);
    setIsSearching(false);

    // Navegar para a primeira página com resultados apenas se não estiver na página correta
    if (results.length > 0) {
      const firstResultRoute = results[0].route;
      // Só navega se não estiver na página correta
      if (location.pathname !== firstResultRoute) {
        navigate(firstResultRoute);
      }
    }
  }, [navigate, location.pathname]);

  // Debounce para busca
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);

    // Limpar timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Criar novo timer
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms de debounce

    setDebounceTimer(timer);
  }, [debounceTimer, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQueryState('');
    setSearchResults([]);
    setIsSearching(false);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  }, [debounceTimer]);

  // Função para destacar texto (otimizada)
  const highlightText = useCallback((text: string): ReactNode => {
    if (!searchQuery || !text) return text;

    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(searchQuery);

    if (!normalizedText.includes(normalizedQuery)) {
      return text;
    }

    // Usar regex para encontrar todas as ocorrências (case-insensitive)
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      // Adicionar texto antes do match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Adicionar texto destacado
      parts.push(
        <mark
          key={`highlight-${keyIndex++}`}
          style={{
            backgroundColor: '#FF6B35',
            color: '#FFFFFF',
            padding: '2px 4px',
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          {match[0]}
        </mark>
      );

      lastIndex = match.index + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  }, [searchQuery]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        setSearchQuery,
        clearSearch,
        highlightText,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

