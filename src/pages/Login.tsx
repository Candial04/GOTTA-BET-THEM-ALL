// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulación simple de login con dos usuarios
    setTimeout(() => {
      if (email.trim() === 'admin' && password === 'root') {
        login('fake-jwt-token-admin', 'admin', email)
        navigate('/admin')
      } else if (email.trim() === 'user' && password === 'root') {
        login('fake-jwt-token-user', 'user', email)
        navigate('/games/slots')  // ← DIRECTO a tragaperras
      } else {
        setError('Usuario o contraseña incorrectos')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="login-page">
      <div className="background-wrapper"></div>

      <div className="bottom-login-overlay">
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Usuario"
              className="input"
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-btn"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Conectando...' : 'Entrar al Casino'}
          </button>
        </form>
      </div>
    </div>
  )
}