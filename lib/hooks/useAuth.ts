import { useAuthStore } from "@/lib/stores/authStore"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import type { LoginRequest } from "@/types/api"

export function useAuth() {
  const { user, isAuthenticated, setUser, logout: storeLogout } = useAuthStore()
  const router = useRouter()

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials)
      setUser(response)
      router.push("/dashboard")
      return response
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      storeLogout()
      router.push("/login")
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}