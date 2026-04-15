import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTextStore } from '../stores/textStore'
import type { SortOrder } from '../api/types'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('radical')
  const { search, searchLoading, searchError, fetchSearch } = useTextStore()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      void fetchSearch({ q: query, sort })
    }
  }

  return (
    <div className="search-page">
      <h1>Search Kanripo Corpus</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search text…"
          aria-label="Search query"
          className="search-input"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          aria-label="Sort order"
        >
          <option value="radical">By radical</option>
          <option value="preceding">By preceding context</option>
          <option value="date">By date</option>
          <option value="text_id">By text ID</option>
        </select>
        <button type="submit" disabled={searchLoading}>
          {searchLoading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {searchError && <p className="error">{searchError}</p>}

      {search && (
        <div className="search-results">
          <p className="result-count">
            {search.total} result{search.total !== 1 ? 's' : ''} for &ldquo;{search.query}&rdquo;
          </p>
          <ol className="kwic-list">
            {search.results.map((result, i) => (
              <li key={i} className="kwic-item">
                <span className="kwic-left">{result.left_context}</span>
                <Link
                  to="/texts/$textId"
                  params={{ textId: result.location.text_id }}
                  className="kwic-match"
                >
                  {result.match}
                </Link>
                <span className="kwic-right">{result.right_context}</span>
                <span className="kwic-meta">
                  {result.metadata?.title ?? result.location.text_id}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
