import { Note, Folder } from '@/types'

const STORAGE_KEYS = {
  NOTES: 'sparknotes_notes',
  FOLDERS: 'sparknotes_folders',
  THEME: 'sparknotes_theme',
  SIDEBAR: 'sparknotes_sidebar'
}

export const storage = {
  // Notes
  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveNotes(notes: Note[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
  },

  // Folders
  getFolders(): Folder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLDERS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveFolders(folders: Folder[]): void {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders))
  },

  // Theme
  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light'
  },

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  },

  // Sidebar
  getSidebarCollapsed(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR) === 'true'
  },

  setSidebarCollapsed(collapsed: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(collapsed))
  }
}
