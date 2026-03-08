// src/store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Role = 'user' | 'admin' | null

interface AuthState {
  token: string | null
  role: Role
  user: { email: string; name?: string } | null  // ← name opcional
  login: (token: string, role: Role, email: string, name?: string) => void  // ← name opcional
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      login: (token, role, email, name) =>
        set({
          token,
          role,
          user: { email, name },
        }),
      logout: () => set({ token: null, role: null, user: null }),
    }),
    {
      name: 'auth-storage', // clave en localStorage
    }
  )
)