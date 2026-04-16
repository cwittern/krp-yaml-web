import { useEffect } from 'react'
import { useTextStore } from '../stores/textStore'

interface PassagePanelProps {
  sectionStem: string
}

export function PassagePanel({ sectionStem }: PassagePanelProps) {
  const { passage, passageLoading, passageError, fetchPassage } = useTextStore()

  useEffect(() => {
    void fetchPassage(sectionStem)
  }, [sectionStem, fetchPassage])

  return (
    <div className="passage-panel">
      {passageLoading && <p className="passage-loading">Loading…</p>}
      {passageError && <p className="error">{passageError}</p>}
      {passage && !passageLoading && (
        <>
          <div className="passage-panel-header">
            <span className="passage-panel-title">
              {passage.text_id} — juan {passage.juan}
            </span>
            <span className="passage-panel-section">{passage.section_stem}</span>
          </div>
          <div
            className="passage-content"
            dangerouslySetInnerHTML={{ __html: passage.html }}
          />
        </>
      )}
    </div>
  )
}
