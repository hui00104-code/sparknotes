import { useEffect } from 'react'
import { Editor } from './components/Editor'
import { Sidebar } from './components/Sidebar'
import { useStore } from './store/useStore'
import { Save } from 'lucide-react'

function App() {
  const { notes, activeNoteId, updateNote } = useStore()

  const activeNote = notes.find(n => n.id === activeNoteId)

  useEffect(() => {
    // Auto-save handler could be added here
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        // Already auto-saving
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="h-screen flex overflow-hidden bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-xl font-semibold bg-transparent focus:outline-none flex-1"
                placeholder="笔记标题..."
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Save size={14} />
                <span>已保存</span>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-auto">
              <Editor
                content={activeNote.content}
                onChange={(content) => updateNote(activeNote.id, { content })}
                placeholder="开始写笔记... 支持 Markdown 语法"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">选择或创建一个笔记</p>
              <p className="text-sm">按 Ctrl+N 快速创建新笔记</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
