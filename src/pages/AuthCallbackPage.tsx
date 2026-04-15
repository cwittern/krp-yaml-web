import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'
import { exchangeCodeForToken } from '../lib/github-oauth'
import { getStoredState, clearStoredState } from '../hooks/useGitHubLogin'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { setToken, fetchUser } = useAuthStore()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const storedState = getStoredState()

    if (!code || !state || state !== storedState) {
      void navigate({ to: '/' })
      return
    }

    clearStoredState()

    exchangeCodeForToken(code)
      .then((token) => {
        setToken(token)
        return fetchUser()
      })
      .then(() => navigate({ to: '/' }))
      .catch((err: unknown) => {
        console.error('OAuth error', err)
        void navigate({ to: '/' })
      })
  }, [navigate, setToken, fetchUser])

  return <p>Signing in…</p>
}
