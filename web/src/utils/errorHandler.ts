// Sistema centralizado de tratamento de erros
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class ErrorHandler {
  private static errorMessages: Record<string, string> = {
    // Erros de autenticação
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Conta desabilitada',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    
    // Erros de Firestore
    'permission-denied': 'Você não tem permissão para esta ação',
    'not-found': 'Recurso não encontrado',
    'already-exists': 'Recurso já existe',
    'failed-precondition': 'Condição necessária não foi atendida',
    'aborted': 'Operação foi cancelada',
    'out-of-range': 'Valor fora do intervalo permitido',
    'unimplemented': 'Funcionalidade não implementada',
    'internal': 'Erro interno do servidor',
    'unavailable': 'Serviço temporariamente indisponível',
    'data-loss': 'Dados corrompidos',
    'unauthenticated': 'Usuário não autenticado',
    
    // Erros customizados
    'INVALID_EVENT_DATA': 'Dados do evento inválidos',
    'INSUFFICIENT_TICKETS': 'Ingressos insuficientes',
    'EVENT_NOT_ACTIVE': 'Evento não está ativo',
    'INVALID_TICKET_CODE': 'Código de ingresso inválido',
    'TICKET_ALREADY_USED': 'Ingresso já foi utilizado',
    'SESSION_EXPIRED': 'Sessão expirada',
    'NETWORK_ERROR': 'Erro de conexão',
  };

  static getErrorMessage(error: any): string {
    if (!error) return 'Erro desconhecido';
    
    // Se já é uma string, retorna
    if (typeof error === 'string') return error;
    
    // Se tem código conhecido, retorna mensagem traduzida
    if (error.code && this.errorMessages[error.code]) {
      return this.errorMessages[error.code];
    }
    
    // Se tem message, retorna
    if (error.message) return error.message;
    
    // Fallback
    return 'Ocorreu um erro inesperado';
  }

  static createError(code: string, message?: string, details?: any): AppError {
    return {
      code,
      message: message || this.errorMessages[code] || 'Erro desconhecido',
      details
    };
  }

  static handleFirebaseError(error: any): AppError {
    const code = error?.code || 'UNKNOWN_ERROR';
    const message = this.getErrorMessage(error);
    
    return {
      code,
      message,
      details: error
    };
  }

  static logError(error: any, context?: string): void {
    console.error(`[${context || 'App'}] Error:`, {
      code: error?.code,
      message: error?.message,
      details: error,
      timestamp: new Date().toISOString()
    });
  }
}

// Hook para tratamento de erros em componentes React
export function useErrorHandler() {
  const handleError = (error: any, context?: string) => {
    ErrorHandler.logError(error, context);
    return ErrorHandler.getErrorMessage(error);
  };

  return { handleError };
}

