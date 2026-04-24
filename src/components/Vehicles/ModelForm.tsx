import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Form, Input, message, Select, InputNumber, Divider, Alert } from 'antd';
import { VehicleModel, VehicleBrand } from '@/types/vehicle-reference';
import vehicleReferenceService from '@/services/vehicleReferenceService';
import vehicleCategoryRequirementsService, { VehicleCategoryRequirement } from '@/services/vehicleCategoryRequirementsService';

interface ModelFormProps {
    visible: boolean;
    model?: VehicleModel;
    brandId?: string;
    brands?: VehicleBrand[];
    onClose: () => void;
    onSuccess: () => void;
}

export const ModelForm: React.FC<ModelFormProps> = ({
    visible,
    model,
    brandId,
    brands: externalBrands,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryRequirements, setCategoryRequirements] = useState<VehicleCategoryRequirement[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [minYearRequirement, setMinYearRequirement] = useState<number | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const loadBrands = useCallback(async () => {
        setLoadingBrands(true);
        try {
            const response = await vehicleReferenceService.listBrands({ limit: 200 });
            if (response.success && response.data?.items) {
                setBrands(response.data.items);
            } else {
                setBrands([]);
            }
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
            setBrands([]);
        } finally {
            setLoadingBrands(false);
        }
    }, []);

    const loadCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const [responseCats, responseReqs] = await Promise.all([
                vehicleReferenceService.listServiceCategories(),
                vehicleCategoryRequirementsService.listRequirements(),
            ]);

            if (responseCats.success && responseCats.data) {
                const parsedCategories = Array.isArray(responseCats.data)
                    ? responseCats.data
                    : Array.isArray((responseCats.data as any)?.items)
                        ? (responseCats.data as any).items
                        : [];
                setCategories(parsedCategories);
            } else {
                setCategories([]);
            }

            if (responseReqs.success && responseReqs.data) {
                setCategoryRequirements(responseReqs.data || []);
            } else {
                setCategoryRequirements([]);
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            setCategories([]);
            setCategoryRequirements([]);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            if (externalBrands && externalBrands.length > 0) {
                setBrands(externalBrands);
            } else {
                loadBrands();
            }
            loadCategories();

            if (model) {
                form.setFieldsValue({
                    name: model.name,
                    slug: model.slug,
                    brandId: model.brandId,
                });
            } else {
                form.resetFields();
                if (brandId) {
                    form.setFieldsValue({ brandId });
                }
            }

            setSelectedCategory(undefined);
            setMinYearRequirement(null);
        } else {
            form.resetFields();
            setSelectedCategory(undefined);
            setMinYearRequirement(null);
            setBrands([]);
        }
    }, [visible, model, brandId, externalBrands, form, loadBrands, loadCategories]);

    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (!model && name) {
            const slug = generateSlug(name);
            form.setFieldsValue({ slug });
        }
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        const requirement = categoryRequirements.find(r => r.serviceCategoryId === value);
        if (requirement) {
            setMinYearRequirement(requirement.minYear);
        } else {
            setMinYearRequirement(null);
        }
    };

    const handleSubmit = async (values: {
        name: string;
        slug: string;
        brandId?: string;
        serviceCategory?: string;
        minYear?: number;
    }) => {
        const finalBrandId = values.brandId || brandId || model?.brandId;

        if (!finalBrandId) {
            message.error('ID da marca é obrigatório');
            return;
        }

        setLoading(true);
        try {
            if (model) {
                const response = await vehicleReferenceService.updateModel(model.id, {
                    name: values.name,
                    slug: values.slug,
                    brandId: finalBrandId,
                });

                if (response.success) {
                    message.success('Modelo atualizado com sucesso!');
                    onSuccess();
                    onClose();
                } else {
                    message.error(response.error || 'Erro ao atualizar modelo');
                }
            } else {
                const response = await vehicleReferenceService.createModel({
                    name: values.name,
                    slug: values.slug,
                    brandId: finalBrandId,
                });

                if (response.success) {
                    message.success('Modelo criado com sucesso!');

                    if (values.serviceCategory && values.minYear) {
                        const reqResponse = await vehicleCategoryRequirementsService.createOrUpdateRequirement(
                            values.serviceCategory,
                            values.minYear
                        );
                        if (reqResponse.success) {
                            message.success('Requisito de categoria criado!');
                        }
                    }

                    onSuccess();
                    onClose();
                } else {
                    message.error(response.error || 'Erro ao criar modelo');
                }
            }
        } catch (error: any) {
            console.error('Erro ao processar requisição:', error);
            message.error('Erro ao processar requisição');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={model ? 'Editar Modelo' : 'Criar Novo Modelo'}
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar"
            cancelText="Cancelar"
            width={600}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {!model && (
                    <Form.Item
                        label="Marca"
                        name="brandId"
                        rules={[{ required: true, message: 'Marca é obrigatória' }]}
                    >
                        <Select
                            placeholder="Digite para filtrar ou selecione uma marca"
                            showSearch
                            allowClear
                            disabled={loading}
                            loading={loadingBrands}
                            filterOption={(input, option) =>
                                (option?.label as string || '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            dropdownMatchSelectWidth
                            getPopupContainer={(trigger) => trigger.parentElement || document.body}
                            notFoundContent={loadingBrands ? 'Carregando...' : 'Nenhuma marca encontrada'}
                            options={brands.map((brand) => ({
                                label: brand.name || 'Sem nome',
                                value: brand.id,
                            }))}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                )}

                <Form.Item
                    label="Nome do Modelo"
                    name="name"
                    rules={[
                        { required: true, message: 'Nome é obrigatório' },
                        { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
                    ]}
                >
                    <Input
                        placeholder="Ex: Corolla"
                        disabled={loading}
                        onChange={handleNameChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Slug (URL)"
                    name="slug"
                    rules={[
                        { required: true, message: 'Slug é obrigatório' },
                        {
                            pattern: /^[a-z0-9-]+$/,
                            message: 'Slug deve conter apenas letras minúsculas, números e hífen',
                        },
                    ]}
                >
                    <Input
                        placeholder="Ex: corolla (gerado automaticamente)"
                        disabled={loading || !!model}
                    />
                </Form.Item>

                {!model && (
                    <>
                        <Divider orientation="left" style={{ margin: '24px 0' }}>
                            Requisitos de Categoria (Opcional)
                        </Divider>

                        <Alert
                            message="Configure requisitos por categoria de serviço"
                            description="Defina o ano mínimo do veículo para cada categoria de serviço"
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />

                        <Form.Item
                            label="Categoria de Serviço"
                            name="serviceCategory"
                        >
                            <Select
                                placeholder="Selecione uma categoria"
                                onChange={handleCategoryChange}
                                disabled={loading || loadingCategories}
                                allowClear
                                loading={loadingCategories}
                                options={categories.map((cat) => ({
                                    label: cat.name,
                                    value: cat.id,
                                }))}
                            />
                        </Form.Item>

                        {selectedCategory && (
                            <Form.Item
                                label="Ano Mínimo Necessário"
                                name="minYear"
                                rules={[
                                    { required: true, message: 'Ano mínimo é obrigatório' },
                                    {
                                        validator: (_, value) => {
                                            if (!value) return Promise.resolve();
                                            const currentYear = new Date().getFullYear();
                                            if (value < 1900 || value > currentYear) {
                                                return Promise.reject(
                                                    new Error(`Ano deve estar entre 1900 e ${currentYear}`)
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="Ex: 2015"
                                    disabled={loading}
                                    min={1900}
                                    max={new Date().getFullYear()}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        )}

                        {minYearRequirement && (
                            <Alert
                                message={`Requisito Atual: Ano mínimo = ${minYearRequirement}`}
                                type="warning"
                                showIcon
                                style={{ marginTop: 16 }}
                            />
                        )}
                    </>
                )}
            </Form>
        </Modal>
    );
};
