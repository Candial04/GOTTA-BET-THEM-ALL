// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import SlotMachine from './components/SlotMachine' // ← tragaperras ahora es la página principal para users
import ProtectedRoute from './components/ProtectedRoute'

// Componentes placeholders para los otros juegos (puedes quitarlos si no los vas a usar)
const RouletteGame = () => <h1>Ruleta - En desarrollo</h1>
const BlackjackGame = () => <h1>Blackjack - En desarrollo</h1>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas para usuarios y admin */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          {/* Usuarios van directo a tragaperras */}
          <Route path="/games/slots" element={<SlotMachine />} />
          <Route path="/games/roulette" element={<RouletteGame />} />
          <Route path="/games/blackjack" element={<BlackjackGame />} />
        </Route>

        {/* Ruta exclusiva para admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={
          <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#000', 
            color: '#fff', 
            fontSize: '3rem' 
          }}>
            404 - Página no encontrada
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App