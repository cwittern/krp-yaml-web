/**
 * GitHub OAuth — device flow (no server redirect needed).
 *
 * GitHub's Web Application Flow requires a server-side redirect URI to
 * exchange the code for a token (because the client_secret must stay secret).
 * The backend at /api/auth/github/callback handles that exchange.
 *
 * Flow:
 *   1. Frontend redirects to GitHub authorize URL
 *   2. GitHub redirects to <origin>/auth/callback?code=xxx
 *   3. Frontend POSTs the code to /api/auth/github/token
 *   4. Backend exchanges code for token and returns it
 *   5. Frontend stores token in authStore
 */

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string

export function buildGitHubAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    scope: 'read:user repo',
    state,
  })
  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export function generateState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const res = await fetch('/api/auth/github/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`)
  }
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}
