import { useState } from 'react'
import {
  FileText,
  Folder,
  FolderOpen,
  Plus,
  Search,
  Trash2,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export function Sidebar() {
  const {
    folders,
    getFilteredNotes,
    activeNoteId,
    activeFolderId,
    searchQuery,
    sidebarCollapsed,
    setActiveNote,
    setActiveFolder,
    setSearchQuery,
    createFolder,
    createNote,
    deleteNote,
    setTheme,
    theme,
    toggleSidebar
  } = useStore()

  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim())
      setNewFolderName('')
      setShowNewFolder(false)
    }
  }

  const filteredNotes = getFilteredNotes()
  const activeNotes = activeFolderId
    ? filteredNotes.filter(n => n.folderId === activeFolderId)
    : filteredNotes

  return (
    <div
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-12' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        {!sidebarCollapsed && (
          <>
            <h1 className="font-bold text-lg flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              SparkNotes
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-muted rounded"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-muted rounded mx-auto"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {!sidebarCollapsed && (
        <>
          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索笔记..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-3 pb-3">
            <button
              onClick={() => createNote()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              新建笔记
            </button>
          </div>

          {/* Folders */}
          <div className="flex-1 overflow-auto px-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">文件夹</span>
              <button
                onClick={() => setShowNewFolder(!showNewFolder)}
                className="p-1 hover:bg-muted rounded"
              >
                <Plus size={14} />
              </button>
            </div>

            {showNewFolder && (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="文件夹名称"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  className="flex-1 px-2 py-1 text-sm bg-muted rounded focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button
                  onClick={handleCreateFolder}
                  className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded"
                >
                  添加
                </button>
              </div>
            )}

            <div className="space-y-1">
              <button
                onClick={() => setActiveFolder(null)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors',
                  !activeFolderId && 'bg-muted'
                )}
              >
                <FolderOpen size={16} />
                全部笔记
              </button>

              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors',
                    activeFolderId === folder.id && 'bg-muted'
                  )}
                >
                  <Folder size={16} />
                  {folder.name}
                </button>
              ))}
            </div>

            {/* Notes List */}
            <div className="mt-4">
              <span className="text-xs font-medium text-muted-foreground uppercase">笔记</span>
              <div className="mt-2 space-y-1">
                {activeNotes.map(note => (
                  <div
                    key={note.id}
                    className={cn(
                      'group flex items-start gap-2 p-2 rounded hover:bg-muted cursor-pointer transition-colors',
                      activeNoteId === note.id && 'bg-muted'
                    )}
                  >
                    <button
                      onClick={() => setActiveNote(note.id)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="text-sm font-medium truncate">{note.title || '无标题'}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(note.updatedAt)}
                      </div>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {activeNotes.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    {searchQuery ? '没有找到匹配的笔记' : '点击"新建笔记"开始'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? '深色模式' : '浅色模式'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
