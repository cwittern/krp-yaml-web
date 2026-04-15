import { useCallback } from 'react'
import { buildGitHubAuthorizeUrl, generateState } from '../lib/github-oauth'

const STATE_KEY = 'github_oauth_state'

export function useGitHubLogin() {
  const login = useCallback(() => {
    const state = generateState()
    sessionStorage.setItem(STATE_KEY, state)
    window.location.href = buildGitHubAuthorizeUrl(state)
  }, [])

  return { login }
}

export function getStoredState(): string | null {
  return sessionStorage.getItem(STATE_KEY)
}

export function clearStoredState(): void {
  sessionStorage.removeItem(STATE_KEY)
}
