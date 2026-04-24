import {
    Modal,
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    message,
    Spin,
} from 'antd';
import dayjs from 'dayjs';
import { useState, useCallback } from 'react';
import driversService from '@/services/driversService';

interface RegisterDriverModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cleanCPF)) {
        return false;
    }

    let sum = 0;
    let multiplier = 10;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF[i]) * multiplier;
        multiplier--;
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;

    sum = 0;
    multiplier = 11;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF[i]) * multiplier;
        multiplier--;
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;

    return (
        parseInt(cleanCPF[9]) === firstDigit &&
        parseInt(cleanCPF[10]) === secondDigit
    );
};

const formatCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        . slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{2})$/, '$1-$2');
};

const formatPhone = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\s)(\d{5})(\d)/, '$1$2-$3');
};

const formatCNH = (value: string) => {
    return value. replace(/\D/g, ''). slice(0, 11);
};

const formatName = (value: string) => {
    return value
        .replace(/[^a-záàâãéèêíïóôõöúçñA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '')
        . replace(/\s+/g, ' ')
        .trimStart();
};

export const RegisterDriverModal: React.FC<RegisterDriverModalProps> = ({
                                                                            visible,
                                                                            onClose,
                                                                            onSuccess,
                                                                        }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatName(e.target. value);
        form.setFieldValue('name', formatted);
    }, [form]);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        form.setFieldValue('email', e.target.value. toLowerCase(). trim());
    }, [form]);

    const handlePhoneChange = useCallback((e: React. ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target. value);
        form.setFieldValue('phone', formatted);
    }, [form]);

    const handleCPFChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e. target.value);
        form. setFieldValue('cpf', formatted);
    }, [form]);

    const handleCNHChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCNH(e.target.value);
        form.setFieldValue('cnhNumber', formatted);
    }, [form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            console.log('Registrando novo motorista:', values);

            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                cpf: values.cpf.replace(/\D/g, ''),
                cnhNumber: values.cnhNumber.replace(/\D/g, ''),
                cnhCategory: values.cnhCategory || 'B',
                cnhExpirationDate: values.cnhExpirationDate
                    ? dayjs(values.cnhExpirationDate).format('YYYY-MM-DD')
                    : dayjs().add(5, 'years').format('YYYY-MM-DD'), // Valor padrão se não fornecido
                phone: values.phone.replace(/\D/g, ''),
            };

            console.log('Payload:', payload);

            const response = await driversService.registerDriver(payload);

            console.log('Motorista registrado:', response);
            message.success('Motorista registrado com sucesso!  Ele poderá enviar documentos após verificar o email.');
            form.resetFields();
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Erro ao registrar motorista:', error);
            const errorMessage = error.message || 'Erro ao registrar motorista';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Registrar Novo Motorista"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Nome Completo"
                        name="name"
                        rules={[
                            { required: true, message: 'Nome é obrigatório' },
                            { min: 3, message: 'Nome deve ter no mínimo 3 caracteres' },
                        ]}
                    >
                        <Input
                            placeholder="Digite o nome completo"
                            onChange={handleNameChange}
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email é obrigatório' },
                            { type: 'email', message: 'Email inválido' },
                        ]}
                    >
                        <Input
                            placeholder="usuario@dominio.com"
                            onChange={handleEmailChange}
                            type="email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="password"
                        rules={[
                            { required: true, message: 'Senha é obrigatória' },
                            { min: 8, message: 'Senha deve ter no mínimo 8 caracteres' },
                        ]}
                    >
                        <Input. Password placeholder="Digite uma senha segura" />
                    </Form.Item>

                    <Form.Item
                        label="Telefone"
                        name="phone"
                        rules={[
                            { required: true, message: 'Telefone é obrigatório' },
                            {
                                pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                                message: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
                            },
                        ]}
                    >
                        <Input
                            placeholder="(XX) XXXXX-XXXX"
                            onChange={handlePhoneChange}
                            maxLength={15}
                        />
                    </Form.Item>

                    <Form.Item
                        label="CPF"
                        name="cpf"
                        rules={[
                            { required: true, message: 'CPF é obrigatório' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    if (isValidCPF(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('CPF inválido'));
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="XXX.XXX.XXX-XX"
                            onChange={handleCPFChange}
                            maxLength={14}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Número da CNH"
                        name="cnhNumber"
                        rules={[
                            { required: true, message: 'CNH é obrigatória' },
                            {
                                pattern: /^\d{11}$/,
                                message: 'CNH deve ter 11 dígitos',
                            },
                        ]}
                    >
                        <Input
                            placeholder="11 dígitos"
                            onChange={handleCNHChange}
                            maxLength={11}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Categoria da CNH"
                           name="cnhCategory"
                           rules={[
                               { required: true, message: 'Categoria é obrigatória' },
                           ]}
                    >
                        <Select placeholder="Selecione a categoria">
                            <Select.Option value="A">A</Select.Option>
                            <Select.Option value="B">B</Select.Option>
                            <Select.Option value="C">C</Select.Option>
                            <Select.Option value="D">D</Select.Option>
                            <Select.Option value="E">E</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Data de Expiração da CNH"
                        name="cnhExpirationDate"
                        rules={[
                            { required: true, message: 'Data de expiração é obrigatória' },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="YYYY-MM-DD"
                            disabledDate={(current) => current && current < dayjs().endOf('day')}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Registrar Motorista
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default RegisterDriverModal;