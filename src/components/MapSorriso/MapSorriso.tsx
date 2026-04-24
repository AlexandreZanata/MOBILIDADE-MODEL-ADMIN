/**
 * MapSorriso - Componente de mapa OSM para Sorriso-MT com cache e interação de scroll
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Card, Typography } from 'antd';
import { useTheme } from '@/themes/ThemeProvider';

const { Text } = Typography;

// Coordenadas de Sorriso-MT
const SORRISO_COORDS = {
  lat: -12.5428,
  lng: -55.7211,
};

const MAP_CACHE_KEY = 'vamu_map_sorriso_url';
const MAP_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

export const MapSorriso: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMapActive, setIsMapActive] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Gerar URL do mapa com zoom
  const generateMapUrl = useMemo(() => {
    const bbox = `${SORRISO_COORDS.lng - 0.05},${SORRISO_COORDS.lat - 0.05},${SORRISO_COORDS.lng + 0.05},${SORRISO_COORDS.lat + 0.05}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${SORRISO_COORDS.lat},${SORRISO_COORDS.lng}`;
  }, []);

  useEffect(() => {
    // Verificar cache
    const cached = localStorage.getItem(MAP_CACHE_KEY);
    if (cached) {
      try {
        const { url, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < MAP_CACHE_DURATION && url) {
          setMapUrl(url);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Erro ao ler cache do mapa:', e);
      }
    }

    // Salvar no cache
    try {
      localStorage.setItem(
        MAP_CACHE_KEY,
        JSON.stringify({
          url: generateMapUrl,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('Erro ao salvar cache do mapa:', e);
    }

    setMapUrl(generateMapUrl);
    setLoading(false);
  }, [generateMapUrl]);

  // Permitir scroll no mapa quando ativo
  useEffect(() => {
    if (!isMapActive) return;

    const handleWheel = (e: WheelEvent) => {
      // Permitir scroll apenas dentro do iframe quando o mapa está ativo
      const target = e.target as HTMLElement;
      if (target.closest('iframe')) {
        // Scroll permitido no iframe
        return;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isMapActive]);

  // Desabilitar mapa ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mapContainerRef.current && !mapContainerRef.current.contains(e.target as Node)) {
        setIsMapActive(false);
      }
    };

    if (isMapActive) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMapActive]);

  const handleMapClick = () => {
    setIsMapActive(true);
  };

  return (
    <Card
      title={
        <span style={{ 
          fontSize: 16, 
          fontWeight: 600,
          color: isDark ? '#F9FAFB' : '#111827',
        }}>
          Mapa de Operações
        </span>
      }
      style={{ 
        marginBottom: 24,
        borderRadius: 16,
        border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
        background: isDark ? '#1F2937' : '#FFFFFF',
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        ref={mapContainerRef}
        style={{
          height: 500,
          width: '100%',
          borderRadius: '0 0 16px 16px',
          overflow: 'hidden',
          position: 'relative',
          background: isDark ? '#111827' : '#F3F4F6',
          cursor: isMapActive ? 'default' : 'pointer',
        }}
        onClick={handleMapClick}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: isDark ? '#9CA3AF' : '#6B7280',
            }}
          >
            Carregando mapa...
          </div>
        ) : mapUrl ? (
          <>
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling={isMapActive ? 'yes' : 'no'}
              marginHeight={0}
              marginWidth={0}
              src={mapUrl}
              style={{ 
                border: 0,
                pointerEvents: isMapActive ? 'auto' : 'none',
                filter: isMapActive ? 'none' : 'brightness(0.3)',
                transition: 'filter 0.3s ease',
              }}
              title="Mapa de Sorriso-MT"
              aria-label="Mapa de Sorriso-MT"
              loading="lazy"
            />
            {!isMapActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 10,
                  cursor: 'pointer',
                }}
                onClick={handleMapClick}
              >
                <div
                  style={{
                    background: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    padding: '24px 32px',
                    borderRadius: 12,
                    border: `2px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      color: isDark ? '#F9FAFB' : '#111827',
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Clique para ver o mapa
                  </Text>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
      <div style={{ padding: 16, borderTop: isDark ? '1px solid #374151' : '1px solid #E5E7EB' }}>
        <Text strong style={{ fontSize: 14, color: isDark ? '#F9FAFB' : '#111827' }}>
          Sorriso - MT
        </Text>
        <br />
        <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280' }}>
          Visualização da área de operação
        </Text>
      </div>
    </Card>
  );
};
