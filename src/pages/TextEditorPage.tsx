import { useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useTextStore } from '../stores/textStore'
import { useAuthStore } from '../stores/authStore'
import { YamlEditor } from '../components/editor/YamlEditor'

export function TextEditorPage() {
  const { textId } = useParams({ from: '/texts/$textId/edit' })
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { editorContent, editorDirty, setEditorContent, resetEditorDirty } = useTextStore()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      void navigate({ to: '/texts/$textId', params: { textId } })
    }
  }, [user, navigate, textId])

  function handleSave() {
    // TODO: commit to user's GitHub fork via Octokit
    resetEditorDirty()
    alert('Save to GitHub not yet implemented')
  }

  if (!user) return null

  return (
    <div className="text-editor-page">
      <div className="editor-toolbar">
        <h2>Editing: {textId}</h2>
        <div className="editor-actions">
          <button
            onClick={handleSave}
            disabled={!editorDirty}
            className="btn-save"
          >
            {editorDirty ? 'Save to GitHub' : 'No changes'}
          </button>
          <button
            onClick={() => void navigate({ to: '/texts/$textId', params: { textId } })}
          >
            Cancel
          </button>
        </div>
      </div>

      <YamlEditor
        value={editorContent ?? ''}
        onChange={setEditorContent}
        className="yaml-editor"
      />
    </div>
  )
}
