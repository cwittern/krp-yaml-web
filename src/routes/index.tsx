import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SearchPage } from '../pages/SearchPage'

const searchSchema = z.object({
  section: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: SearchPage,
})
