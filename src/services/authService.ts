// src/services/authService.ts
export interface RegisterData {
  user_id: string;
  tenant_id: string;
  password: string;
}

export interface LoginData {
  user_id: string;
  tenant_id: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  body: any;
}

const API_BASE = 'https://r4o40joe79.execute-api.us-east-1.amazonaws.com/dev';

async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    console.log('Sending register request:', data);
    const res = await fetch(`${API_BASE}/usuarios/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = await res.json();
    console.log('Register API response:', { status: res.status, payload });
    return { statusCode: res.status, body: payload };
  } catch (error) {
    console.error('Register API error:', error);
    throw error;
  }
}

async function login(data: LoginData): Promise<{ statusCode: number; token?: string; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = await res.json();
    console.log('Login API response:', { status: res.status, payload });

    // 🔧 Manejo flexible del token
    const token = payload.token || (payload.body && payload.body.token);
    const expires = payload.expires_at || (payload.body && payload.body.expires_at);

    if (res.ok && token) {
      return { statusCode: res.status, token };
    }

    const message = payload.error || payload.message || payload.body?.error || 'Error desconocido';
    return { statusCode: res.status, message };
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
}


async function validateUser(token: string, tenant_id: string): Promise<{ valid: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/usuarios/validar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, tenant_id }),
  });
  const payload = await res.json();
  if (res.ok) {
    return { valid: true };
  }
  return { valid: false, message: typeof payload === 'string' ? payload : payload.body };
}

export default {
  register,
  login,
  validateUser,
};
