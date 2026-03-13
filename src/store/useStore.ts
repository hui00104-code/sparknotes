import { create } from 'zustand'
import { Note, Folder } from '@/types'
import { storage } from '@/lib/storage'
import { generateId } from '@/lib/utils'

interface AppStore {
  // State
  notes: Note[]
  folders: Folder[]
  activeNoteId: string | null
  activeFolderId: string | null
  searchQuery: string
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean

  // Actions - Notes
  createNote: (folderId?: string) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setActiveNote: (id: string | null) => void

  // Actions - Folders
  createFolder: (name: string, parentId?: string) => void
  updateFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void
  setActiveFolder: (id: string | null) => void

  // Actions - UI
  setSearchQuery: (query: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void

  // Computed
  getFilteredNotes: () => Note[]
}

const initialState = {
  notes: storage.getNotes(),
  folders: storage.getFolders(),
  activeNoteId: null,
  activeFolderId: null,
  searchQuery: '',
  theme: storage.getTheme(),
  sidebarCollapsed: storage.getSidebarCollapsed()
}

export const useStore = create<AppStore>((set, get) => ({
  ...initialState,

  // Note Actions
  createNote: (folderId) => {
    const newNote: Note = {
      id: generateId(),
      title: '新笔记',
      content: '',
      folderId: folderId || get().activeFolderId,
      tags: [],
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const notes = [newNote, ...get().notes]
    set({ notes, activeNoteId: newNote.id })
    storage.saveNotes(notes)
  },

  updateNote: (id, updates) => {
    const notes = get().notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: Date.now() }
        : note
    )
    set({ notes })
    storage.saveNotes(notes)
  },

  deleteNote: (id) => {
    const notes = get().notes.filter(note => note.id !== id)
    set({ notes, activeNoteId: get().activeNoteId === id ? null : get().activeNoteId })
    storage.saveNotes(notes)
  },

  setActiveNote: (id) => set({ activeNoteId: id }),

  // Folder Actions
  createFolder: (name, parentId) => {
    const newFolder: Folder = {
      id: generateId(),
      name,
      parentId: parentId || null,
      createdAt: Date.now()
    }
    const folders = [...get().folders, newFolder]
    set({ folders })
    storage.saveFolders(folders)
  },

  updateFolder: (id, name) => {
    const folders = get().folders.map(folder =>
      folder.id === id ? { ...folder, name } : folder
    )
    set({ folders })
    storage.saveFolders(folders)
  },

  deleteFolder: (id) => {
    const folders = get().folders.filter(folder => folder.id !== id)
    // Unassign notes from deleted folder
    const notes = get().notes.map(note =>
      note.folderId === id ? { ...note, folderId: null } : note
    )
    set({ folders, notes, activeFolderId: get().activeFolderId === id ? null : get().activeFolderId })
    storage.saveFolders(folders)
    storage.saveNotes(notes)
  },

  setActiveFolder: (id) => set({ activeFolderId: id }),

  // UI Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setTheme: (theme) => {
    set({ theme })
    storage.setTheme(theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },

  toggleSidebar: () => {
    const collapsed = !get().sidebarCollapsed
    set({ sidebarCollapsed: collapsed })
    storage.setSidebarCollapsed(collapsed)
  },

  // Computed
  getFilteredNotes: () => {
    const { notes, activeFolderId, searchQuery } = get()
    return notes.filter(note => {
      const matchesFolder = !activeFolderId || note.folderId === activeFolderId
      const matchesSearch = !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFolder && matchesSearch
    })
  }
}))

// Initialize theme on load
const theme = storage.getTheme()
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
}
