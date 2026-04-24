import { useState, useCallback } from 'react';
import { message } from 'antd';
import adminVehiclesService from '@/services/adminVehiclesService';
import driverDocumentService from '@/services/driverDocumentService';
import { DriverVehicle } from '@/types/driver-vehicle';
import { DriverDocument } from '@/types/driver-document';
import vehicleReferenceService, { VehicleBrand, VehicleModel } from '@/services/vehicleReferenceService';

export const useVehicleManagement = () => {
    // ============ STATES ============
    const [vehicles, setVehicles] = useState<DriverVehicle[]>([]);
    const [documents, setDocuments] = useState<DriverDocument[]>([]);
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [minYear, setMinYear] = useState<number>(2000);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    // ============ VEHICLES ============

    const fetchVehicles = useCallback(async (cursor?: string) => {
        setLoading(true);
        try {
            console.log('🚗 Carregando veículos...');
            const response = await adminVehiclesService.listPendingVehicles({
                cursor,
                limit: 20,
                sort: '-createdAt',
            });

            if (response.success && response.data) {
                // Converter Vehicle[] para DriverVehicle[]
                const driverVehicles: DriverVehicle[] = response.data.map((v: any) => ({
                    id: v.id,
                    driverProfileId: v.driverId,
                    licensePlate: v.plate,
                    brand: v.metadata?.motoristName || '',
                    model: '',
                    year: v.year,
                    color: v.color,
                    status: v.status === 'pending' ? 'PENDING' : v.status === 'approved' ? 'APPROVED' : 'REJECTED',
                    createdAt: v.createdAt,
                    updatedAt: v.updatedAt,
                }));
                setVehicles(driverVehicles);
            }
            console.log('✅ Veículos carregados:', response.data?.length || 0);
        } catch (error) {
            console.error('❌ Erro ao carregar veículos:', error);
            message.error('Erro ao carregar veículos');
        } finally {
            setLoading(false);
        }
    }, []);

    const approveVehicle = useCallback(async (vehicleId: string) => {
        try {
            console.log('✅ Aprovando veículo...');
            const response = await adminVehiclesService.approveVehicle(vehicleId);
            if (response.success) {
                message.success('Veículo aprovado com sucesso!');
                await fetchVehicles();
            } else {
                message.error(response.message || 'Erro ao aprovar veículo');
            }
        } catch (error) {
            console.error('❌ Erro ao aprovar veículo:', error);
            message.error('Erro ao aprovar veículo');
        }
    }, [fetchVehicles]);

    const rejectVehicle = useCallback(async (vehicleId: string, reason: string) => {
        try {
            console.log('❌ Rejeitando veículo...');
            const response = await adminVehiclesService.rejectVehicle(vehicleId, reason);
            if (response.success) {
                message.success('Veículo rejeitado com sucesso!');
                await fetchVehicles();
            } else {
                message.error(response.message || 'Erro ao rejeitar veículo');
            }
        } catch (error) {
            console.error('❌ Erro ao rejeitar veículo:', error);
            message.error('Erro ao rejeitar veículo');
        }
    }, [fetchVehicles]);

    // ============ DOCUMENTS ============

    const fetchPendingDocuments = useCallback(async (cursor?: string) => {
        setLoading(true);
        try {
            console.log('📄 Carregando documentos pendentes...');
            const response = await driverDocumentService.listPendingDocuments({
                cursor,
                limit: 20,
                sort: '-createdAt',
            });

            if (response.success && response.data) {
                setDocuments(response.data.items);
                setHasMore(response.data.hasMore);
                setNextCursor(response.data.nextCursor);
                console.log('✅ Documentos carregados:', response.data.items.length);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar documentos:', error);
            message.error('Erro ao carregar documentos');
        } finally {
            setLoading(false);
        }
    }, []);

    const approveDocument = useCallback(async (documentId: string) => {
        try {
            console.log('✅ Aprovando documento...');
            const response = await driverDocumentService.approveDocument(documentId);
            if (response.success) {
                message.success('Documento aprovado com sucesso!');
                await fetchPendingDocuments();
            } else {
                message.error(response.error || 'Erro ao aprovar documento');
            }
        } catch (error) {
            console.error('❌ Erro ao aprovar documento:', error);
            message.error('Erro ao aprovar documento');
        }
    }, [fetchPendingDocuments]);

    const rejectDocument = useCallback(async (documentId: string, reason: string) => {
        try {
            console.log('❌ Rejeitando documento...');
            const response = await driverDocumentService.rejectDocument(documentId, reason);
            if (response.success) {
                message.success('Documento rejeitado com sucesso!');
                await fetchPendingDocuments();
            } else {
                message.error(response.error || 'Erro ao rejeitar documento');
            }
        } catch (error) {
            console.error('❌ Erro ao rejeitar documento:', error);
            message.error('Erro ao rejeitar documento');
        }
    }, [fetchPendingDocuments]);

    // ============ BRANDS ============

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            console.log('🏷️ Carregando marcas.. .');
            const response = await vehicleReferenceService.listBrands({
                limit: 100,
                sort: 'name',
            });

            if (response.success && response.data) {
                setBrands(response.data.items);
                console.log('✅ Marcas carregadas:', response.data.items.length);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar marcas:', error);
            message.error('Erro ao carregar marcas');
        } finally {
            setLoading(false);
        }
    }, []);

    const createBrand = useCallback(async (name: string, slug: string) => {
        try {
            console.log('➕ Criando marca.. .');
            await vehicleReferenceService.createBrand({ name, slug });
            message.success('Marca criada com sucesso!');
            await fetchBrands();
        } catch (error) {
            console.error('❌ Erro ao criar marca:', error);
            message.error('Erro ao criar marca');
        }
    }, [fetchBrands]);

    const deleteBrand = useCallback(async (id: string) => {
        try {
            console.log('🗑️ Deletando marca...');
            await vehicleReferenceService.deleteBrand(id);
            message.success('Marca deletada com sucesso! ');
            await fetchBrands();
        } catch (error) {
            console.error('❌ Erro ao deletar marca:', error);
            message.error('Erro ao deletar marca');
        }
    }, [fetchBrands]);

    // ============ MODELS ============

    const fetchModels = useCallback(async (brandId?: string) => {
        setLoading(true);
        try {
            console.log('📋 Carregando modelos.. .');
            let response;

            if (brandId) {
                response = await vehicleReferenceService.getModelsByBrand(brandId, {
                    limit: 100,
                    sort: 'name',
                });
            } else {
                response = await vehicleReferenceService.listModels({
                    limit: 100,
                    sort: 'name',
                });
            }

            if (response.success && response.data) {
                setModels(response.data.items);
                console.log('✅ Modelos carregados:', response.data.items.length);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar modelos:', error);
            message. error('Erro ao carregar modelos');
        } finally {
            setLoading(false);
        }
    }, []);

    const createModel = useCallback(async (brandId: string, name: string, slug: string) => {
        try {
            console.log('➕ Criando modelo...');
            await vehicleReferenceService.createModel({ brandId, name, slug });
            message.success('Modelo criado com sucesso!');
            await fetchModels(brandId);
        } catch (error) {
            console.error('❌ Erro ao criar modelo:', error);
            message.error('Erro ao criar modelo');
        }
    }, [fetchModels]);

    const deleteModel = useCallback(async (id: string) => {
        try {
            console.log('🗑️ Deletando modelo...');
            await vehicleReferenceService.deleteModel(id);
            message.success('Modelo deletado com sucesso!');
            await fetchModels();
        } catch (error) {
            console. error('❌ Erro ao deletar modelo:', error);
            message.error('Erro ao deletar modelo');
        }
    }, [fetchModels]);

    // ============ SETTINGS ============

    const fetchMinYear = useCallback(async () => {
        setLoading(true);
        try {
            console.log('📋 Carregando ano mínimo...');
            const response = await vehicleReferenceService.getMinYear();
            if (response.success && response.data) {
                setMinYear(response.data.minYear);
                console.log('✅ Ano mínimo carregado:', response.data.minYear);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar ano mínimo:', error);
            message.error('Erro ao carregar configurações');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMinYear = useCallback(async (year: number) => {
        try {
            console.log('✏️ Atualizando ano mínimo.. .');
            await vehicleReferenceService.updateMinYear(year);
            setMinYear(year);
            message.success('Ano mínimo atualizado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao atualizar ano mínimo:', error);
            message. error('Erro ao atualizar ano mínimo');
        }
    }, []);

    return {
        // States
        vehicles,
        documents,
        brands,
        models,
        minYear,
        loading,
        hasMore,
        nextCursor,

        // Vehicle methods
        fetchVehicles,
        approveVehicle,
        rejectVehicle,

        // Document methods
        fetchPendingDocuments,
        approveDocument,
        rejectDocument,

        // Brand methods
        fetchBrands,
        createBrand,
        deleteBrand,

        // Model methods
        fetchModels,
        createModel,
        deleteModel,

        // Settings methods
        fetchMinYear,
        updateMinYear,
    };
};