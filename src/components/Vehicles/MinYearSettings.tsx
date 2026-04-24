import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Row, Col, Spin, Statistic, App } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { VehicleMinYear } from '@/types/vehicle-reference';
import vehicleReferenceService from '@/services/vehicleReferenceService';
import { useTheme } from '@/themes/ThemeProvider';

interface MinYearSettingsProps {
    refreshTrigger?: number;
}

export const MinYearSettings: React.FC<MinYearSettingsProps> = ({ refreshTrigger = 0 }) => {
    const { message } = App.useApp();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const [minYear, setMinYear] = useState<VehicleMinYear | null>(null);
    const [editingMinYear, setEditingMinYear] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const loadMinYear = async () => {
        setLoading(true);
        try {
            console.log('⚙️ Carregando configuração de ano mínimo...');
            const response = await vehicleReferenceService.getMinYear();
            if (response.success && response.data) {
                setMinYear(response.data);
                setEditingMinYear(response.data.minYear. toString());
                console.log('✅ Configuração carregada:', response.data. minYear);
            } else {
                message.error(response.error || 'Erro ao carregar configuração');
            }
        } catch (error: any) {
            message.error('Erro ao carregar configuração');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMinYear();
    }, [refreshTrigger]);

    const handleSave = async () => {
        const year = parseInt(editingMinYear);

        if (isNaN(year)) {
            message.error('Ano deve ser um número válido');
            return;
        }

        if (year < 1900 || year > new Date().getFullYear()) {
            message.error(
                `Ano deve estar entre 1900 e ${new Date().getFullYear()}`
            );
            return;
        }

        setIsSaving(true);
        try {
            console.log('💾 Salvando novo ano mínimo:', year);
            const response = await vehicleReferenceService.updateMinYear(year);
            if (response. success) {
                message.success('Ano mínimo atualizado com sucesso!');
                setMinYear(response.data || null);
                console.log('✅ Configuração atualizada');
            } else {
                message.error(response.error || 'Erro ao atualizar configuração');
            }
        } catch (error: any) {
            message.error('Erro ao atualizar configuração');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card
            style={{
                borderRadius: 16,
                border: isDark ?  '1px solid #374151' : '1px solid #E5E7EB',
                background: isDark ? '#1F2937' : '#FFFFFF',
            }}
            styles={{ body: { padding: '24px' } }}
            extra={
                <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={loadMinYear}
                    loading={loading}
                >
                    Recarregar
                </Button>
            }
        >
            <Spin spinning={loading}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={12}>
                        <Statistic
                            title="Ano Mínimo Atual"
                            value={minYear?.minYear || '-'}
                            valueStyle={{
                                color: '#0374C8',
                                fontSize: 28,
                                fontWeight: 600,
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: 8,
                                    fontWeight: 600,
                                    color: isDark ? '#F3F4F6' : '#111827',
                                }}
                            >
                                Novo Ano Mínimo
                            </label>
                            <Row gutter={[8, 0]}>
                                <Col flex="auto">
                                    <Input
                                        type="number"
                                        placeholder="Ex: 2010"
                                        value={editingMinYear}
                                        onChange={(e) => setEditingMinYear(e.target.value)}
                                        disabled={isSaving}
                                        min={1900}
                                        max={new Date().getFullYear()}
                                        size="large"
                                    />
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                        loading={isSaving}
                                        disabled={editingMinYear === minYear?.minYear. toString()}
                                        size="large"
                                    >
                                        Salvar
                                    </Button>
                                </Col>
                            </Row>
                            <p
                                style={{
                                    marginTop: 12,
                                    fontSize: 12,
                                    color: isDark ? '#9CA3AF' : '#999',
                                }}
                            >
                                Defina o ano mínimo para veículos que podem ser registrados no sistema.
                            </p>
                        </div>
                    </Col>
                </Row>

                {minYear && (
                    <Row style={{
                        marginTop: 24,
                        paddingTop: 16,
                        borderTop: isDark ? '1px solid #374151' : '1px solid #f0f0f0',
                    }}>
                        <Col span={24}>
                            <small style={{ color: isDark ? '#9CA3AF' : '#999' }}>
                                Última atualização: {new Date(minYear.updatedAt).toLocaleString('pt-BR')}
                            </small>
                        </Col>
                    </Row>
                )}
            </Spin>
        </Card>
    );
};