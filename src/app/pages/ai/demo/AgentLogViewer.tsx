import { useState, useEffect, useRef } from 'react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { AGENT_LOGS, type AgentLogEntry } from '@/app/components/agent/mockData'
import { Terminal, X, Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface AgentLogViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPlaying?: boolean
}

const sourceColors: Record<string, string> = {
  'Context Engine': 'text-blue-400',
  'LLM Reasoning': 'text-purple-400',
  Pipeline: 'text-green-400',
  'Zod Validator': 'text-amber-400',
}

export function AgentLogViewer({ open, onOpenChange, isPlaying = false }: AgentLogViewerProps) {
  const [logs, setLogs] = useState<AgentLogEntry[]>([])
  const [autoPlay, setAutoPlay] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 自动播放日志
  useEffect(() => {
    if (!autoPlay || !open) return

    let index = 0
    setLogs([])

    const playNext = () => {
      if (index < AGENT_LOGS.length) {
        setLogs((prev) => [...prev, AGENT_LOGS[index]])
        index++
        timerRef.current = setTimeout(playNext, 300 + Math.random() * 200)
      } else {
        setAutoPlay(false)
      }
    }

    playNext()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [autoPlay, open])

  // 外部触发播放
  useEffect(() => {
    if (isPlaying && open) {
      setAutoPlay(true)
    }
  }, [isPlaying, open])

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const showAll = () => {
    setLogs([...AGENT_LOGS])
    setAutoPlay(false)
  }

  const clearLogs = () => {
    setLogs([])
    setAutoPlay(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 w-[520px] bg-slate-900 rounded-lg shadow-2xl border border-slate-700 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-green-400" />
              <span className="text-sm font-mono text-slate-300">Agent 思考日志</span>
              <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                {logs.length}/{AGENT_LOGS.length}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-slate-400 hover:text-slate-200"
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {autoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-slate-400 hover:text-slate-200"
                onClick={showAll}
              >
                全部
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-slate-400 hover:text-slate-200"
                onClick={clearLogs}
              >
                清空
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-slate-400 hover:text-red-400"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Log Content */}
          <div ref={scrollRef} className="h-[280px] overflow-y-auto p-3 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-8">
                点击播放按钮或提交表单后自动开始...
              </div>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2 py-1"
                >
                  <span className="text-slate-500 w-16 shrink-0">{log.timestamp}</span>
                  <span className={`w-28 shrink-0 ${sourceColors[log.source] || 'text-slate-400'}`}>
                    [{log.source}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
