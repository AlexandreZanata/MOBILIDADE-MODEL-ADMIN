// Cole todo o conteúdo de tipos que mostrei anteriormente aqui
export interface User {
    id: string;
    name: string;
    email: string;
    type: 'admin' | 'funcionario' | 'motorista' | 'passageiro';
    type_label: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// ... e todos os outros tipos