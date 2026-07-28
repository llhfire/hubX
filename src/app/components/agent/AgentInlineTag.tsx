import { useState } from 'react'
import { Badge } from '@/app/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Button } from '@/app/components/ui/button'
import { Sparkles, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export interface AgentInlineTagProps {
  /** 提示文本 */
  text: string
  /** 详细说明（hover 展示） */
  detail: string
  /** 风险等级 */
  level?: 'info' | 'warning' | 'danger'
  /** 可选的操作按钮文案 */
  actionLabel?: string
  /** 操作按钮点击回调 */
  onAction?: () => void
  /** 是否显示（用于控制淡入动画） */
  visible?: boolean
}

const levelConfig = {
  info: {
    variant: 'secondary' as const,
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500',
  },
  warning: {
    variant: 'secondary' as const,
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-500',
  },
  danger: {
    variant: 'destructive' as const,
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    iconColor: 'text-red-500',
  },
}

export function AgentInlineTag({
  text,
  detail,
  level = 'warning',
  actionLabel,
  onAction,
  visible = true,
}: AgentInlineTagProps) {
  const [open, setOpen] = useState(false)
  const config = levelConfig[level]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-flex items-center"
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Badge
                variant={config.variant}
                className={`cursor-pointer gap-1 ${config.bgColor} ${config.textColor} ${config.borderColor} border hover:shadow-md transition-shadow`}
              >
                <Sparkles className="h-3 w-3 animate-pulse" />
                <Icon className={`h-3 w-3 ${config.iconColor}`} />
                <span className="text-xs font-medium">AI: {text}</span>
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="bottom" align="start">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">Agent 智能提示</p>
                    <p className="text-xs text-slate-500 mt-1">基于跨域 Context 分析</p>
                  </div>
                </div>
                <div className={`p-3 rounded-md ${config.bgColor} border ${config.borderColor}`}>
                  <p className={`text-sm ${config.textColor}`}>{detail}</p>
                </div>
                {actionLabel && onAction && (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onAction()
                      setOpen(false)
                    }}
                  >
                    {actionLabel}
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
