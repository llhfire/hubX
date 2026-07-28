import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/app/components/ui/drawer'
import { Badge } from '@/app/components/ui/badge'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Sparkles, Shield, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'

export interface AgentContextDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | null
  contextSummary?: string
  isAnalyzing?: boolean
  children: React.ReactNode
}

const riskConfig = {
  LOW: { label: '低风险', color: 'bg-green-100 text-green-700 border-green-200', icon: ShieldCheck },
  MEDIUM: { label: '中风险', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Shield },
  HIGH: { label: '高风险', color: 'bg-red-100 text-red-700 border-red-200', icon: ShieldAlert },
}

export function AgentContextDrawer({
  open,
  onOpenChange,
  title = 'Agent 智能洞察看板',
  description = '基于跨域 Context 的深度分析',
  riskLevel,
  contextSummary,
  isAnalyzing = false,
  children,
}: AgentContextDrawerProps) {
  const risk = riskLevel ? riskConfig[riskLevel] : null
  const RiskIcon = risk?.icon

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-[440px] right-0 left-auto fixed">
        <DrawerHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-50">
              <Sparkles className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <DrawerTitle className="text-base">{title}</DrawerTitle>
              <DrawerDescription className="text-xs">{description}</DrawerDescription>
            </div>
          </div>

          {/* Agent 状态指示 */}
          <div className="mt-3 flex items-center gap-2">
            {isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Agent 正在穿透上下文分析中...</span>
              </motion.div>
            ) : riskLevel ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <Badge variant="outline" className={`${risk.color} border gap-1`}>
                  {RiskIcon && <RiskIcon className="h-3 w-3" />}
                  {risk.label}
                </Badge>
                <span className="text-xs text-slate-400">分析完成</span>
              </motion.div>
            ) : null}
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
          <div className="p-4 space-y-4">
            {/* Context 摘要 */}
            {contextSummary && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  深层风险评估
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">{contextSummary}</p>
              </motion.div>
            )}

            {/* 主内容区 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
