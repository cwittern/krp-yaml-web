import { create } from 'zustand'
import { api } from '../api/client'
import type { PassageResponse, SearchResponse, SearchParams } from '../api/types'

interface TextState {
  // Current passage being viewed
  passage: PassageResponse | null
  passageLoading: boolean
  passageError: string | null

  // Search state
  search: SearchResponse | null
  searchLoading: boolean
  searchError: string | null
  lastSearchParams: SearchParams | null

  // Editor state (unsaved YAML content for current text)
  editorContent: string | null
  editorDirty: boolean

  // Actions
  fetchPassage: (sectionStem: string) => Promise<void>
  fetchSearch: (params: SearchParams) => Promise<void>
  setEditorContent: (content: string) => void
  resetEditorDirty: () => void
}

export const useTextStore = create<TextState>((set) => ({
  passage: null,
  passageLoading: false,
  passageError: null,

  search: null,
  searchLoading: false,
  searchError: null,
  lastSearchParams: null,

  editorContent: null,
  editorDirty: false,

  async fetchPassage(sectionStem) {
    set({ passageLoading: true, passageError: null })
    try {
      const passage = await api.passage({ section_stem: sectionStem })
      set({ passage, passageLoading: false })
    } catch (err) {
      set({
        passageLoading: false,
        passageError: err instanceof Error ? err.message : 'Failed to load passage',
      })
    }
  },

  async fetchSearch(params) {
    set({ searchLoading: true, searchError: null, lastSearchParams: params })
    try {
      const search = await api.search(params)
      set({ search, searchLoading: false })
    } catch (err) {
      set({
        searchLoading: false,
        searchError: err instanceof Error ? err.message : 'Search failed',
      })
    }
  },

  setEditorContent(content) {
    set({ editorContent: content, editorDirty: true })
  },

  resetEditorDirty() {
    set({ editorDirty: false })
  },
}))
