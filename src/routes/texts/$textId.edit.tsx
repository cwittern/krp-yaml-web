import { createFileRoute } from '@tanstack/react-router'
import { TextEditorPage } from '../../pages/TextEditorPage'

export const Route = createFileRoute('/texts/$textId/edit')({
  component: TextEditorPage,
})
