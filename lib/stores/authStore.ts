import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthResponse } from "@/types/api"

interface AuthState {
  user: AuthResponse | null
  isAuthenticated: boolean
  setUser: (user: AuthResponse | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        localStorage.removeItem("accessToken")
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    }
  )
)