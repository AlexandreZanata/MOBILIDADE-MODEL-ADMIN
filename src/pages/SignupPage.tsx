import { useState } from 'react';
import {
    Form,
    Input,
    Button,
    message,
    Spin,
    Row,
    Col,
    Checkbox,
    Space,
    Progress,
    Empty,
    Tooltip,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    ArrowRightOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { passengersService } from '@/services';
import vamuLogo from '@/img/vamu.png';

export const SignupPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [emailVerificationSent, setEmailVerificationSent] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 20;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
        return Math.min(strength, 100);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 20) return '#ff4d4f';
        if (passwordStrength < 40) return '#ff7a45';
        if (passwordStrength < 60) return '#F7B733';
        if (passwordStrength < 80) return '#0374C8';
        return '#52c41a';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 20) return 'Muito fraca';
        if (passwordStrength < 40) return 'Fraca';
        if (passwordStrength < 60) return 'Média';
        if (passwordStrength < 80) return 'Forte';
        return 'Muito forte';
    };

    const validateEmailFormat = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneBR = (phone: string): boolean => {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    };

    const sanitizeName = (name: string): string => {
        return name
            .replace(/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const validateForm = (values: any): boolean => {
        if (!values.name || values.name.trim().length < 3) {
           void message.error('Nome mínimo 3 caracteres');
            return false;
        }

        if (!values.email || !validateEmailFormat(values.email)) {
            void message.error('Email inválido');
            return false;
        }

        if (!values.phone || !validatePhoneBR(values.phone)) {
            void message.error('Telefone inválido');
            return false;
        }

        if (!values.password || values.password.length < 8) {
            void message.error('Senha mínimo 8 caracteres');
            return false;
        }

        if (passwordStrength < 40) {
            void message.error('Senha muito fraca');
            return false;
        }

        if (values.password !== values.confirmPassword) {
            void message.error('Senhas não conferem');
            return false;
        }

        if (!agreedTerms) {
            void message.error('Aceite os termos');
            return false;
        }

        return true;
    };

    const onFinish = async (values: any) => {
        if (!validateForm(values)) return;

        try {
            setIsLoading(true);
            const sanitizedData = {
                name: sanitizeName(values.name),
                email: values.email.toLowerCase().trim(),
                password: values.password,
                phone: values.phone.replace(/\D/g, ''),
            };

            await passengersService.register(sanitizedData);

            setVerificationEmail(sanitizedData.email);
            setEmailVerificationSent(true);
            message.success('Verifique seu email!');

            setTimeout(() => navigate('/login'), 3000);
        } catch (error: any) {
            message.error(error.response?.data?.error?.message || 'Erro ao cadastrar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Row style={{ minHeight: '100vh', margin: 0 }} wrap={false}>
            {/* Left Side - Branding */}
            <Col
                xs={0}
                sm={0}
                md={12}
                style={{
                    background: 'linear-gradient(135deg, #0374C8 0%, #025BA0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(247, 183, 51, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        top: '-100px',
                        right: '-100px',
                    }}
                />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', maxWidth: '400px' }}>
                    <img
                        src={vamuLogo}
                        alt="VAMU"
                        style={{
                            maxWidth: '140px',
                            height: 'auto',
                            marginBottom: '40px',
                            display: 'block',
                            margin: '0 auto 40px',
                        }}
                    />
                    <h1 style={{ fontSize: '42px', fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-1px' }}>
                        Junte-se à VAMU
                    </h1>
                    <p style={{ fontSize: '16px', fontWeight: 300, margin: 0, opacity: 0.9, lineHeight: 1.5 }}>
                        Comece sua jornada na mobilidade urbana
                    </p>
                </div>
            </Col>

            {/* Right Side - Signup Form */}
            <Col
                xs={24}
                sm={24}
                md={12}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    background: '#ffffff',
                    overflowY: 'auto',
                }}
            >
                <Spin spinning={isLoading} indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}>
                    <div style={{ width: '100%', maxWidth: '380px' }}>
                        {emailVerificationSent ? (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px 0', color: '#1a1a1a' }}>
                                        Confira seu Email
                                    </h2>
                                </div>

                                <Empty
                                    image={<CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />}
                                    description="Cadastro realizado!"
                                >
                                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                                        <div style={{ textAlign: 'center', color: '#666' }}>
                                            <p>Email enviado para:</p>
                                            <p style={{ fontWeight: 'bold' }}>{verificationEmail}</p>
                                        </div>
                                        <Button
                                            type="primary"
                                            block
                                            size="large"
                                            onClick={() => navigate('/login')}
                                            style={{
                                                background: '#0374C8',
                                                border: 'none',
                                                height: '40px',
                                            }}
                                        >
                                            Ir para Login
                                        </Button>
                                    </Space>
                                </Empty>
                            </>
                        ) : (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px 0', color: '#1a1a1a' }}>
                                        Criar Conta
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#8c8c8c', margin: 0 }}>
                                        Junte-se à VAMU agora
                                    </p>
                                </div>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    autoComplete="off"
                                    size="large"
                                    style={{ marginBottom: '24px' }}
                                    requiredMark={false}
                                >
                                    <Form.Item
                                        name="name"
                                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Nome Completo</span>}
                                        rules={[
                                            { required: true, message: 'Nome obrigatório' },
                                            { min: 3, message: 'Mínimo 3 caracteres' },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Seu nome"
                                            prefix={<UserOutlined />}
                                            onChange={(e) => form.setFieldValue('name', sanitizeName(e.target.value))}
                                            style={{ height: '40px', borderRadius: '6px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Email</span>}
                                        rules={[
                                            { required: true, message: 'Email obrigatório' },
                                            { type: 'email', message: 'Email inválido' },
                                        ]}
                                    >
                                        <Input
                                            placeholder="seu@email.com"
                                            prefix={<MailOutlined />}
                                            type="email"
                                            style={{ height: '40px', borderRadius: '6px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="phone"
                                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Telefone</span>}
                                        rules={[
                                            { required: true, message: 'Telefone obrigatório' },
                                            {
                                                validator(_, value) {
                                                    if (!value || validatePhoneBR(value)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Inválido'));
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="(11) 99999-9999"
                                            prefix={<PhoneOutlined />}
                                            style={{ height: '40px', borderRadius: '6px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Senha</span>}
                                        rules={[
                                            { required: true, message: 'Senha obrigatória' },
                                            { min: 8, message: 'Mínimo 8 caracteres' },
                                        ]}
                                    >
                                        <Tooltip title="Use maiúsculas, números e símbolos">
                                            <Input.Password
                                                placeholder="Senha"
                                                prefix={<LockOutlined />}
                                                onChange={(e) => setPasswordStrength(calculatePasswordStrength(e.target.value))}
                                                iconRender={(visible) =>
                                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                                }
                                                style={{ height: '40px', borderRadius: '6px' }}
                                            />
                                        </Tooltip>
                                    </Form.Item>

                                    {passwordStrength > 0 && (
                                        <div style={{
                                            marginBottom: '16px',
                                            padding: '12px',
                                            background: '#fafafa',
                                            borderRadius: '6px',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                                marginBottom: '8px',
                                                color: '#8c8c8c',
                                                fontWeight: 500,
                                            }}>
                                                <span>Força:</span>
                                                <span style={{ color: getPasswordStrengthColor() }}>
                                                    {getPasswordStrengthText()}
                                                </span>
                                            </div>
                                            <Progress
                                                percent={passwordStrength}
                                                strokeColor={getPasswordStrengthColor()}
                                                showInfo={false}
                                                size="small"
                                            />
                                        </div>
                                    )}

                                    <Form.Item
                                        name="confirmPassword"
                                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Confirmar Senha</span>}
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: 'Confirme a senha' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Não conferem'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Confirmar senha"
                                            prefix={<LockOutlined />}
                                            iconRender={(visible) =>
                                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                            }
                                            style={{ height: '40px', borderRadius: '6px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item style={{ marginBottom: '16px' }}>
                                        <Checkbox
                                            checked={agreedTerms}
                                            onChange={(e) => setAgreedTerms(e.target.checked)}
                                        >
                                            <span style={{ fontSize: '12px', color: '#595959' }}>
                                                Concordo com{' '}
                                                <Link to="/termos" style={{ color: '#0374C8', textDecoration: 'none' }}>Termos</Link>
                                                {' '}e{' '}
                                                <Link to="/privacidade" style={{ color: '#0374C8', textDecoration: 'none' }}>Privacidade</Link>
                                            </span>
                                        </Checkbox>
                                    </Form.Item>

                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            block
                                            size="large"
                                            loading={isLoading}
                                            disabled={!agreedTerms}
                                            icon={<ArrowRightOutlined />}
                                            style={{
                                                height: '40px',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                background: '#0374C8',
                                                border: 'none',
                                            }}
                                        >
                                            Criar Conta
                                        </Button>
                                    </Form.Item>
                                </Form>

                                <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '12px', color: '#595959' }}>
                                    Já tem conta?{' '}
                                    <Link to="/login" style={{ color: '#0374C8', fontWeight: 600, textDecoration: 'none' }}>
                                        Fazer login
                                    </Link>
                                </div>

                                <div style={{
                                    textAlign: 'center',
                                    fontSize: '11px',
                                    color: '#8c8c8c',
                                    borderTop: '1px solid #f0f0f0',
                                    paddingTop: '16px',
                                }}>
                                    <p style={{ margin: 0 }}>
                                        Protegido por segurança de nível empresarial.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </Spin>
            </Col>
        </Row>
    );
};