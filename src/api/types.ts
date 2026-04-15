// Types derived from openapi.yaml

export interface Location {
  text_id: string
  section_stem: string
  line_id: string
}

export interface TextMeta {
  text_id: string
  title?: string | null
  dynasty?: string | null
  author?: string | null
  date_sort?: number | null
}

export interface KwicResult {
  location: Location
  left_context: string
  match: string
  right_context: string
  metadata?: TextMeta | null
}

export interface SearchResponse {
  query: string
  total: number
  sort: string
  offset: number
  limit: number
  results: KwicResult[]
}

export interface PassageResponse {
  section_stem: string
  text_id: string
  juan: string
  scope: string
  format: string
  punctuation_source?: string | null
  html: string
}

export interface ApiError {
  detail?: string
  status?: number
  title?: string
}

// Request param types

export type SortOrder = 'radical' | 'preceding' | 'date' | 'text_id'
export type PassageScope = 'section' | 'juan' | 'sections' | 'chars' | 'phrases'
export type PassageFormat = 'paragraph' | 'fixed' | 'source' | 'phrase'

export interface SearchParams {
  q: string
  sort?: SortOrder
  left_context?: number
  right_context?: number
  limit?: number
  offset?: number
}

export interface PassageParams {
  section_stem: string
  match_offset?: number
  match_length?: number
  scope?: PassageScope
  left?: number
  right?: number
  format?: PassageFormat
  line_length?: number
  punctuation?: string
}
