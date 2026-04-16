import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TextViewerPage } from '../../pages/TextViewerPage'

const searchSchema = z.object({
  section: z.string().optional(),
})

export const Route = createFileRoute('/texts/$textId')({
  validateSearch: searchSchema,
  component: TextViewerPage,
})
