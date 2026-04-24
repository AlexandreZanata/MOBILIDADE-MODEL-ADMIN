import apiClient from './apiClient';

export interface DriverRegistrationData {
    name: string;
    email: string;
    password: string;
    cpf: string;
    cnh_number: string;
    cnh_category?: string;
    cnh_expires_at?: string;
    phone?: string;
    face_photo: File;
    cnh_photo: File;
}

const driverRegistrationService = {
    register: async (data: DriverRegistrationData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('cpf', data.cpf);
        formData.append('cnh_number', data.cnh_number);
        if (data.cnh_category) formData.append('cnh_category', data.cnh_category);
        if (data.cnh_expires_at) formData.append('cnh_expires_at', data.cnh_expires_at);
        if (data.phone) formData.append('phone', data.phone);
        formData.append('face_photo', data.face_photo);
        formData.append('cnh_photo', data.cnh_photo);

        return apiClient.post('/drivers/register', formData);
    },

    resendVerificationEmail: async (email: string) => {
        return apiClient.post('/drivers/email/resend', { email });
    },
};

export default driverRegistrationService;