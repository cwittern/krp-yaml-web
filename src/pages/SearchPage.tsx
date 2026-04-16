import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTextStore } from '../stores/textStore'
import { PassagePanel } from '../components/PassagePanel'
import type { SortOrder } from '../api/types'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('radical')
  const { search, searchLoading, searchError, fetchSearch } = useTextStore()
  const { section } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      void fetchSearch({ q: query, sort })
    }
  }

  function openPassage(sectionStem: string) {
    void navigate({ search: { section: sectionStem } })
  }

  return (
    <div className={`search-layout ${section ? 'search-layout--split' : ''}`}>

      {/* Left panel: search form + KWIC results */}
      <div className="search-panel">
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
                <li key={i} className={`kwic-item ${section === result.location.section_stem ? 'kwic-item--active' : ''}`}>
                  <span className="kwic-left">{result.left_context}</span>
                  <span className="kwic-match">{result.match}</span>
                  <span className="kwic-right">{result.right_context}</span>
                  <button
                    className="kwic-title"
                    onClick={() => openPassage(result.location.section_stem)}
                  >
                    {result.metadata?.title ?? result.location.text_id}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Right panel: passage viewer, shown when a result is selected */}
      {section && (
        <div className="viewer-panel">
          <button
            className="passage-panel-close"
            onClick={() => void navigate({ search: {} })}
            aria-label="Close passage"
          >
            ✕
          </button>
          <PassagePanel sectionStem={section} />
        </div>
      )}

    </div>
  )
}
