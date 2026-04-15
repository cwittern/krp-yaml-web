import { createFileRoute } from '@tanstack/react-router'
import { TextViewerPage } from '../../pages/TextViewerPage'

export const Route = createFileRoute('/texts/$textId')({
  component: TextViewerPage,
})
