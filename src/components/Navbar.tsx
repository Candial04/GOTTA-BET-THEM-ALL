import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.ts'

export default function Navbar() {
  const { user, role, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-black/60 backdrop-blur-md border-b border-purple-500/30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
          PokéCasino
        </Link>

        {user ? (
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-gray-300">Hola, <strong>{user.name}</strong></span>
              <span className="text-xs px-2 py-0.5 bg-purple-600/50 rounded-full">
                {role === 'admin' ? 'ADMIN' : 'JUGADOR'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  )
}