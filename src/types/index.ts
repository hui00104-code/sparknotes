export interface Note {
  id: string
  title: string
  content: string
  folderId: string | null
  tags: string[]
  isFavorite: boolean
  createdAt: number
  updatedAt: number
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  createdAt: number
}

export interface AppState {
  notes: Note[]
  folders: Folder[]
  activeNoteId: string | null
  activeFolderId: string | null
  searchQuery: string
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
}

export type NoteFilter = 'all' | 'favorites' | 'trash'
