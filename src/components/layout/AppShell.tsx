import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/authStore'
import { useGitHubLogin } from '../../hooks/useGitHubLogin'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuthStore()
  const { login } = useGitHubLogin()

  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="nav-primary">
          <Link to="/" className="nav-logo">
            KRP-YAML
          </Link>
          <div className="nav-links">
            <Link to="/">Search</Link>
          </div>
        </nav>
        <div className="nav-auth">
          {user ? (
            <div className="user-menu">
              <img src={user.avatar_url} alt={user.login} className="avatar" />
              <span>{user.login}</span>
              <button onClick={logout}>Sign out</button>
            </div>
          ) : (
            <button onClick={login} className="btn-github">
              Sign in with GitHub
            </button>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
