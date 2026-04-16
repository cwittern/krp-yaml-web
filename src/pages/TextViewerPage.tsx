import { useEffect } from 'react'
import { useParams, useSearch, Link } from '@tanstack/react-router'
import { useTextStore } from '../stores/textStore'
import { useAuthStore } from '../stores/authStore'

export function TextViewerPage() {
  const { textId } = useParams({ from: '/texts/$textId' })
  const { section } = useSearch({ from: '/texts/$textId' })
  const { passage, passageLoading, passageError, fetchPassage } = useTextStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const sectionStem = section ?? `${textId}_001_000`
    void fetchPassage(sectionStem)
  }, [textId, section, fetchPassage])

  return (
    <div className="text-viewer-page">
      <div className="text-viewer-toolbar">
        <h2>{passage?.text_id ?? textId}</h2>
        {user && (
          <Link to="/texts/$textId/edit" params={{ textId }} className="btn-edit">
            Edit
          </Link>
        )}
      </div>

      {passageLoading && <p>Loading passage…</p>}
      {passageError && <p className="error">{passageError}</p>}

      {passage && (
        <div
          className="passage-content"
          // The API returns a server-controlled HTML fragment
          dangerouslySetInnerHTML={{ __html: passage.html }}
        />
      )}
    </div>
  )
}
