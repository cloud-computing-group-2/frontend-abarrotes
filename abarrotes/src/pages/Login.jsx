import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

export default function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ user_id: '', password: '', tenant_id: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
   e.preventDefault();

    // Simula login OK si coinciden con tu db.json
    if (
        form.user_id === "test@correo.com" &&
        form.password === "123456" &&
        form.tenant_id === "tenant1"
    ) {
        // Fake token
        const token = "fake-token";
        localStorage.setItem('token', token);
        localStorage.setItem('tenant_id', form.tenant_id);
        setIsLoggedIn(true);
        navigate('/catalogo');
    } else {
        setMsg("Credenciales incorrectas (simulado)");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Login</h2>
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
        <button className="btn btn-success w-100" type="submit">Login</button>
      </form>
      {msg && <div className="alert alert-danger mt-3">{msg}</div>}
    </div>
  );
}
