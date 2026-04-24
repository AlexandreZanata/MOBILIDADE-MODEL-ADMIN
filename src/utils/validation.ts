/**
 * Utilitários de validação
 * Validações visuais para formulários (usando validators fictícios)
 * Em produção, integrar com biblioteca de validação (Yup, Zod, etc.)
 */

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: any) => boolean | string;
}

/**
 * Validação de email
 */
export const validateEmail = (email: string): boolean => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Validação de telefone brasileiro
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Validação de CEP brasileiro
 */
export const validateZipCode = (zipCode: string): boolean => {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.length === 8;
};

/**
 * Validação de CPF (básica)
 */
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validação dos dígitos verificadores (simplificada)
  // Em produção, implementar algoritmo completo
  return true;
};

/**
 * Validação de CNPJ (básica)
 */
export const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
};

/**
 * Cria regra de validação para Ant Design Form
 */
export const createValidationRule = (rule: ValidationRule) => {
  const antRule: any = {};
  
  if (rule.required) {
    antRule.required = true;
    antRule.message = rule.message || 'Este campo é obrigatório';
  }
  
  if (rule.min !== undefined) {
    antRule.min = rule.min;
    antRule.message = rule.message || `Valor mínimo: ${rule.min}`;
  }
  
  if (rule.max !== undefined) {
    antRule.max = rule.max;
    antRule.message = rule.message || `Valor máximo: ${rule.max}`;
  }
  
  if (rule.pattern) {
    antRule.pattern = rule.pattern;
    antRule.message = rule.message || 'Formato inválido';
  }
  
  if (rule.validator) {
    antRule.validator = (_: any, value: any) => {
      const result = rule.validator!(value);
      if (result === true) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(typeof result === 'string' ? result : 'Validação falhou'));
    };
  }
  
  return antRule;
};

