import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Row, Col, Checkbox, Modal, Empty } from 'antd';
import {
    MailOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    ArrowRightOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import vamuLogo from '@/img/vamu.png';

interface LoginAttempt {
    timestamp: number;
    count: number;
}

export const LoginPage = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [rememberMe, setRememberMe] = useState(false);
    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
    const [, setLoginAttempts] = useState<LoginAttempt>({ timestamp: Date.now(), count: 0 });
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

    const MAX_ATTEMPTS = 5;
    const LOCK_TIME = 15 * 60 * 1000;

    useEffect(() => {
        const storedAttempts = localStorage.getItem('loginAttempts');
        if (storedAttempts) {
            const attempts = JSON.parse(storedAttempts);
            const now = Date.now();

            if (now - attempts.timestamp < LOCK_TIME) {
                if (attempts.count >= MAX_ATTEMPTS) {
                    setIsLocked(true);
                    setLockTimeRemaining(Math.ceil((LOCK_TIME - (now - attempts.timestamp)) / 1000));
                }
                setLoginAttempts(attempts);
            } else {
                localStorage.removeItem('loginAttempts');
            }
        }
    }, []);

    useEffect(() => {
        if (!isLocked) return;

        const interval = setInterval(() => {
            setLockTimeRemaining(prev => {
                if (prev <= 1) {
                    setIsLocked(false);
                    localStorage.removeItem('loginAttempts');
                    clearInterval(interval);
                    void message.success('Sua conta foi desbloqueada.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isLocked]);

    const recordLoginAttempt = () => {
        const now = Date.now();
        let attempts = { timestamp: now, count: 1 };

        const storedAttempts = localStorage.getItem('loginAttempts');
        if (storedAttempts) {
            const parsed = JSON.parse(storedAttempts);
            if (now - parsed.timestamp < LOCK_TIME) {
                attempts.count = parsed.count + 1;
                attempts.timestamp = parsed.timestamp;
            }
        }

        localStorage.setItem('loginAttempts', JSON.stringify(attempts));
        setLoginAttempts(attempts);

        if (attempts.count >= MAX_ATTEMPTS) {
            setIsLocked(true);
            setLockTimeRemaining(Math.ceil((LOCK_TIME - (now - attempts.timestamp)) / 1000));
        }
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const sanitizeInput = (input: string): string => {
        return input.replace(/[<>]/g, '').trim().toLowerCase();
    };

    const onFinish = async (values: { email: string; password: string }) => {
        if (isLocked) {
            message.error(`Conta bloqueada. Tente novamente em ${lockTimeRemaining}s.`);
            return;
        }

        try {
            const sanitizedEmail = sanitizeInput(values.email);

            if (!validateEmail(sanitizedEmail)) {
                message.error('Email inválido');
                recordLoginAttempt();
                return;
            }

            if (!values.password || values.password.length < 6) {
                message.error('Senha inválida');
                recordLoginAttempt();
                return;
            }

            await login(sanitizedEmail, values.password);
            message.success('Bem-vindo!');
            navigate('/dashboard');
        } catch (error: any) {
            recordLoginAttempt();
            const errorMessage = error.response?.data?.error?.message || error.message || 'Credenciais inválidas';
            message.error(errorMessage);
        }
    };

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail.trim()) {
            message.error('Por favor, insira seu email');
            return;
        }

        if (!validateEmail(forgotPasswordEmail)) {
            message.error('Email inválido');
            return;
        }

        try {
            setForgotPasswordLoading(true);
            setForgotPasswordSent(true);
            message.success('Email enviado!');

            setTimeout(() => {
                setForgotPasswordVisible(false);
                setForgotPasswordSent(false);
                setForgotPasswordEmail('');
            }, 3000);
        } catch (error: any) {
            message.error('Erro ao enviar email');
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes loadingPulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.4;
                    }
                }

                @keyframes loadingSlide {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(4px);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                }

                .loading-spinner {
                    width: 60px;
                    height: 60px;
                    position: relative;
                }

                .loading-spinner::before {
                    content: '';
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border: 3px solid #e8e8e8;
                    border-radius: 50%;
                    box-sizing: border-box;
                }

                .loading-spinner::after {
                    content: '';
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border: 3px solid transparent;
                    border-top-color: #0374C8;
                    border-right-color: #0374C8;
                    border-radius: 50%;
                    box-sizing: border-box;
                    animation: spin 1.2s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .loading-text {
                    font-size: 16px;
                    color: #1a1a1a;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .loading-dots {
                    display: inline-flex;
                    gap: 4px;
                }

                .loading-dot {
                    width: 4px;
                    height: 4px;
                    background-color: #0374C8;
                    border-radius: 50%;
                    animation: loadingPulse 1.4s ease-in-out infinite;
                }

                .loading-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .loading-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
            `}</style>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">
                            Autenticando
                            <div className="loading-dots">
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Row style={{ minHeight: '100vh', margin: 0, padding: 0 }} wrap={false}>
                {/* Left Side */}
                <Col
                    xs={0}
                    sm={0}
                    md={12}
                    style={{
                        background: 'linear-gradient(135deg, #0374C8 0%, #025BA0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 40px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(247, 183, 51, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        top: '-150px',
                        right: '-150px',
                    }}/>

                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        color: 'white',
                        maxWidth: '500px',
                    }}>
                        <img
                            src={vamuLogo}
                            alt="VAMU"
                            style={{
                                maxWidth: '180px',
                                height: 'auto',
                                marginBottom: '50px',
                                display: 'block',
                                margin: '0 auto 50px',
                            }}
                        />
                        <h1 style={{
                            fontSize: '56px',
                            fontWeight: 900,
                            margin: '0 0 20px 0',
                            letterSpacing: '-1.5px',
                            color: '#FFFFFF',
                        }}>
                            Mobilidade Urbana
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            fontWeight: 300,
                            margin: 0,
                            opacity: 0.95,
                            lineHeight: 1.6,
                            color: '#FFFFFF',
                        }}>
                            A forma mais inteligente de gerenciar sua plataforma
                        </p>
                    </div>
                </Col>

                {/* Right Side */}
                <Col
                    xs={24}
                    sm={24}
                    md={12}
                    style={{
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 80px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(247, 183, 51, 0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        top: 0,
                        right: 0,
                        pointerEvents: 'none',
                    }}/>

                    <div style={{ width: '100%', maxWidth: '600px', position: 'relative', zIndex: 1 }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h2 style={{
                                fontSize: '42px',
                                fontWeight: 900,
                                margin: '0 0 12px 0',
                                color: '#0374C8',
                                letterSpacing: '-0.8px',
                            }}>
                                Bem-vindo
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                color: '#8c8c8c',
                                margin: 0,
                                fontWeight: 400,
                            }}>
                                Acesse seu painel administrativo
                            </p>
                        </div>

                        {/* Lock Warning */}
                        {isLocked && (
                            <div style={{
                                padding: '20px',
                                marginBottom: '32px',
                                background: 'linear-gradient(135deg, #fff2f0 0%, #fff7f0 100%)',
                                border: '2px solid #ffccc7',
                                borderRadius: '12px',
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start',
                                boxShadow: '0 4px 12px rgba(255, 77, 79, 0.1)',
                            }}>
                                <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px', marginTop: '2px' }} />
                                <div>
                                    <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                                        Conta bloqueada
                                    </strong>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        color: '#8c8c8c',
                                    }}>
                                        Tente novamente em {lockTimeRemaining}s
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        {!isLocked && (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                autoComplete="off"
                                requiredMark={false}
                                style={{ marginBottom: '32px', opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}
                            >
                                <Form.Item
                                    name="email"
                                    label={<span style={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>Email</span>}
                                    rules={[
                                        { required: true, message: 'Email obrigatório' },
                                        { type: 'email', message: 'Email inválido' },
                                    ]}
                                    style={{ marginBottom: '28px' }}
                                >
                                    <Input
                                        placeholder="seu@email.com"
                                        prefix={<MailOutlined style={{ color: '#0374C8', marginRight: '8px' }} />}
                                        disabled={isLoading}
                                        style={{
                                            height: '56px',
                                            fontSize: '15px',
                                            borderRadius: '10px',
                                            border: '2px solid #e8e8e8',
                                            background: '#F8FAFB',
                                            color: '#1a1a1a',
                                            padding: '12px 16px',
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label={<span style={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>Senha</span>}
                                    rules={[{ required: true, message: 'Senha obrigatória' }]}
                                    style={{ marginBottom: '28px' }}
                                >
                                    <Input.Password
                                        placeholder="Sua senha segura"
                                        prefix={<LockOutlined style={{ color: '#0374C8', marginRight: '8px' }} />}
                                        iconRender={(visible) =>
                                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                        }
                                        disabled={isLoading}
                                        style={{
                                            height: '56px',
                                            fontSize: '15px',
                                            borderRadius: '10px',
                                            border: '2px solid #e8e8e8',
                                            background: '#F8FAFB',
                                            color: '#1a1a1a',
                                            padding: '12px 16px',
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                </Form.Item>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '32px',
                                    marginTop: '20px',
                                }}>
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={isLoading}
                                        style={{ fontSize: '13px', fontWeight: 500, color: '#8c8c8c' }}
                                    >
                                        Manter-me conectado
                                    </Checkbox>
                                    <Button
                                        type="text"
                                        style={{
                                            color: '#0374C8',
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            padding: 0,
                                            height: 'auto',
                                        }}
                                        onClick={() => setForgotPasswordVisible(true)}
                                        disabled={isLoading}
                                    >
                                        Esqueceu a senha?
                                    </Button>
                                </div>

                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={isLoading}
                                        disabled={isLoading}
                                        icon={isLoading ? null : <ArrowRightOutlined />}
                                        style={{
                                            height: '56px',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #0374C8 0%, #025BA0 100%)',
                                            border: 'none',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.8px',
                                            boxShadow: '0 8px 24px rgba(3, 116, 200, 0.25)',
                                            transition: 'all 0.3s ease',
                                            color: '#FFFFFF',
                                        }}
                                    >
                                        {isLoading ? 'Autenticando' : 'Acessar Agora'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}

                        {/* Footer */}
                        <div style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#bfbfbf',
                            marginTop: '40px',
                            paddingTop: '24px',
                            borderTop: '2px solid #e8e8e8',
                        }}>
                            <p style={{ margin: '0 0 10px 0' }}>
                                <Link to="/termos" style={{ color: '#0374C8', textDecoration: 'none', fontWeight: 600 }}>Termos de Uso</Link>
                                <span style={{ margin: '0 8px' }}>•</span>
                                <Link to="/privacidade" style={{ color: '#0374C8', textDecoration: 'none', fontWeight: 600 }}>Política de Privacidade</Link>
                            </p>
                        </div>
                    </div>
                </Col>

                {/* Forgot Password Modal */}
                <Modal
                    title="Recuperar Senha"
                    open={forgotPasswordVisible}
                    onCancel={() => {
                        setForgotPasswordVisible(false);
                        setForgotPasswordSent(false);
                        setForgotPasswordEmail('');
                    }}
                    footer={null}
                    centered
                >
                    {forgotPasswordSent ? (
                        <Empty
                            image={<CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />}
                            description="Email enviado com sucesso!"
                        >
                            <p style={{ color: '#666' }}>Verifique sua caixa de entrada para o link de recuperação.</p>
                        </Empty>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{ color: '#666', marginBottom: '8px' }}>Digite seu email para receber um link de recuperação de senha.</p>
                            <Input
                                placeholder="seu@email.com"
                                type="email"
                                prefix={<MailOutlined />}
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                style={{
                                    height: '48px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#1a1a1a',
                                }}
                            />
                            <Button
                                type="primary"
                                block
                                loading={forgotPasswordLoading}
                                onClick={handleForgotPassword}
                                style={{
                                    height: '48px',
                                    background: '#0374C8',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                            >
                                Enviar Link
                            </Button>
                        </div>
                    )}
                </Modal>
            </Row>
        </>
    );
};