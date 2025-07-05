import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, Building, Eye, EyeOff, ArrowLeft, ChevronDown } from 'lucide-react'

// Opciones de tienda preferida
const STORES = [
  { label: 'Tottus', value: 'tottus' },
  { label: 'Plaza Vea', value: 'plazavea' },
  { label: 'Wong', value: 'wong' },
]

const Register = () => {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [userId, setUserId] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validación básica
    if (!userId.trim() || !tenantId || !password.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    
    setIsLoading(true)

    try {
      const ok = await register(userId.trim(), tenantId, password)
      if (ok) {
        navigate('/login')
      } else {
        setError('El registro falló. Verifica que el correo y contraseña sean válidos.')
      }
    } catch (err: any) {
      console.error('Register error:', err)
      setError('Error de conexión. Verifica tu conexión a internet e intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <Link to="/" className="flex items-center text-blue-600 mb-6">
          <ArrowLeft className="mr-2" /> Volver al Inicio
        </Link>
        <h2 className="text-3xl font-bold mb-2">Crear Cuenta</h2>
        <p className="text-gray-600 mb-6">Únete a nosotros para comenzar a comprar en tus tiendas favoritas</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className="input-field pl-10 w-full"
                placeholder="tu.correo@ejemplo.com"
                disabled={isLoading || loading}
              />
            </div>
          </div>

          {/* Tienda Preferida */}
          <div>
            <label className="block text-sm font-medium mb-1">Tienda Preferida</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="w-5 h-5 text-gray-400" />
              </div>
              <select
                required
                value={tenantId}
                onChange={e => setTenantId(e.target.value)}
                className="input-field appearance-none pl-10 w-full"
                disabled={isLoading || loading}
              >
                <option value="" disabled>Selecciona una tienda</option>
                {STORES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-10 pr-10 w-full"
                placeholder="••••••••"
                disabled={isLoading || loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(v => !v)}
                disabled={isLoading || loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
