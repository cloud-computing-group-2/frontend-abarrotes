import { useState } from 'react';
import { API_BASE } from '../utils/api';

export default function Register() {
  const [form, setForm] = useState({ user_id: '', password: '', tenant_id: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Usuario registrado exitosamente.');
    } else {
      setMsg('Error al registrar usuario.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Correo</label>
          <input type="email" className="form-control" name="user_id" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" name="password" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Tenant ID</label>
          <input type="text" className="form-control" name="tenant_id" onChange={handleChange} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Registrar</button>
      </form>
      {msg && <div className="alert alert-info mt-3">{msg}</div>}
    </div>
  );
}
