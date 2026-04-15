import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Octokit } from '@octokit/rest'

export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
}

interface AuthState {
  token: string | null
  user: GitHubUser | null
  octokit: Octokit | null

  setToken: (token: string) => void
  fetchUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      octokit: null,

      setToken(token) {
        const octokit = new Octokit({ auth: token })
        set({ token, octokit })
      },

      async fetchUser() {
        const { octokit } = get()
        if (!octokit) return
        const { data } = await octokit.rest.users.getAuthenticated()
        set({
          user: {
            login: data.login,
            name: data.name ?? null,
            avatar_url: data.avatar_url,
          },
        })
      },

      logout() {
        set({ token: null, user: null, octokit: null })
      },
    }),
    {
      name: 'krp-auth',
      // Only persist the token, not the Octokit instance
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        // Reconstruct Octokit after rehydration
        if (state?.token) {
          state.setToken(state.token)
        }
      },
    },
  ),
)
