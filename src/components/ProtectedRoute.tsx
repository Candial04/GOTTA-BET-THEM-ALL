import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.ts'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, role } = useAuthStore()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}