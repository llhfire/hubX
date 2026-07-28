import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import {
  AgentContextDrawer,
  useAgentPipeline,
} from '@/app/components/agent'
import {
  CONTRACT_FULL_TEXT,
  CONTRACT_REVIEW_RESULT,
  CONTRACT_REVIEW_LOGS,
  type RiskCheckItem,
  type RiskCheckStatus,
} from '@/app/components/agent/mockData'
import {
  FileText,
  Send,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  Eye,
  Briefcase,
  Scale,
  Building2,
  Landmark,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

// ==================== 风险状态配置 ====================

const statusConfig: Record<RiskCheckStatus, { icon: typeof CheckCircle2; color: string; bg: string; border: string; label: string }> = {
  pass: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: '通过' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: '注意' },
  danger: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: '高风险' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: '提示' },
}

const categoryIcons: Record<string, typeof FileText> = {
  '内容审查': FileText,
  '法律审查': Scale,
  '商务审查': Briefcase,
  '行业审查': Building2,
}

// ==================== 风险检查项卡片 ====================

function RiskCheckCard({ item, index }: { item: RiskCheckItem; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const config = statusConfig[item.status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-lg overflow-hidden ${config.border} ${config.bg}/30`}
    >
      {/* 头部行 */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <Icon className={`h-4 w-4 ${config.color} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{item.name}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config.bg} ${config.color} ${config.border}`}>
              {config.label}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{item.summary}</p>
        </div>
        <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>

      {/* 展开详情 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0 space-y-2">
              <div className="p-2.5 bg-white rounded-md border border-slate-200">
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{item.detail}</p>
              </div>
              {item.suggestion && (
                <div className="p-2.5 bg-indigo-50 rounded-md border border-indigo-200">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="h-3 w-3 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-medium text-indigo-700">Agent 建议</span>
                      <p className="text-xs text-indigo-600 mt-0.5 leading-relaxed">{item.suggestion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ==================== 主组件 ====================

export function ContractRiskDemo() {
  const { status, result, submitAction, reset } = useAgentPipeline(CONTRACT_REVIEW_RESULT, 5500)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showLogs, setShowLogs] = useState(false)

  const handleSubmit = () => {
    submitAction()
    setTimeout(() => setDrawerOpen(true), 5700)
  }

  const handleReset = () => {
    setDrawerOpen(false)
    reset()
  }

  // 按类别分组
  const checks = result?.checks ?? []
  const categories = ['内容审查', '法律审查', '商务审查', '行业审查']
  const filteredChecks = activeCategory === 'all'
    ? checks
    : checks.filter((c) => c.category === activeCategory)

  // 统计
  const stats = {
    pass: checks.filter((c) => c.status === 'pass').length,
    warning: checks.filter((c) => c.status === 'warning').length,
    danger: checks.filter((c) => c.status === 'danger').length,
    info: checks.filter((c) => c.status === 'info').length,
  }

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">场景 A</Badge>
          <span className="text-sm text-slate-500">合同全维度风险审查</span>
        </div>
        <div className="flex gap-2">
          {status === 'idle' ? (
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              提交合同审查
            </Button>
          ) : (
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          )}
          {status === 'completed' && (
            <>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)} className="gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                查看完整报告
              </Button>
              <Button variant="outline" onClick={() => setShowLogs(!showLogs)} className="gap-2">
                <Eye className="h-4 w-4" />
                {showLogs ? '隐藏' : '查看'} Agent 日志
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 左侧：合同文本 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              合同全文
              <Badge variant="secondary" className="text-xs font-mono">HT-2026-0718-001</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <pre className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                {CONTRACT_FULL_TEXT}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 右侧：审查结果 */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Agent 风险审查报告
              </CardTitle>
              {status === 'completed' && result && (
                <Badge
                  variant="outline"
                  className={`gap-1 ${
                    result.overallRisk === 'HIGH' ? 'bg-red-100 text-red-700 border-red-200' :
                    result.overallRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-green-100 text-green-700 border-green-200'
                  }`}
                >
                  {result.overallRisk === 'HIGH' ? <ShieldAlert className="h-3.5 w-3.5" /> :
                   result.overallRisk === 'MEDIUM' ? <Shield className="h-3.5 w-3.5" /> :
                   <ShieldCheck className="h-3.5 w-3.5" />}
                  整体风险: {result.overallRisk}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {status === 'idle' && (
              <div className="text-center py-20 text-slate-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">点击"提交合同审查"按钮</p>
                <p className="text-xs mt-1">Agent 将穿透客户、财务、HR、行业知识库进行全维度风险分析</p>
              </div>
            )}

            {status === 'submitting' && (
              <div className="text-center py-20">
                <Badge variant="secondary">合同已提交</Badge>
              </div>
            )}

            {status === 'analyzing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-sm text-indigo-700">Agent 正在穿透 6 个业务域进行全量审查...</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>客户数据库</span>
                    <span>·</span>
                    <span>财务模块</span>
                    <span>·</span>
                    <span>HR 模块</span>
                    <span>·</span>
                    <span>合同模板库</span>
                    <span>·</span>
                    <span>项目历史</span>
                    <span>·</span>
                    <span>行业知识库</span>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'completed' && result && (
              <div className="space-y-4">
                {/* 总结 */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed">{result.overallSummary}</p>
                </div>

                {/* 统计条 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md border border-green-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs font-medium text-green-700">{stats.pass} 项通过</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-md border border-amber-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">{stats.warning} 项注意</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-md border border-red-200">
                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-xs font-medium text-red-700">{stats.danger} 项高风险</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-md border border-blue-200">
                    <Info className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-blue-700">{stats.info} 项提示</span>
                  </div>
                </div>

                {/* 类别 Tab */}
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="all" className="text-xs">全部 ({checks.length})</TabsTrigger>
                    {categories.map((cat) => {
                      const CatIcon = categoryIcons[cat]
                      const count = checks.filter((c) => c.category === cat).length
                      return (
                        <TabsTrigger key={cat} value={cat} className="text-xs gap-1">
                          <CatIcon className="h-3 w-3" />
                          {cat.replace('审查', '')} ({count})
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>

                  <TabsContent value={activeCategory}>
                    <ScrollArea className="h-[380px]">
                      <div className="space-y-2 pr-2">
                        {filteredChecks.map((item, index) => (
                          <RiskCheckCard key={item.id} item={item} index={index} />
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent 思考日志（内联） */}
      <AnimatePresence>
        {showLogs && status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Agent 思考日志
                  <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                    {CONTRACT_REVIEW_LOGS.length} 条
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="font-mono text-xs space-y-0.5">
                    {CONTRACT_REVIEW_LOGS.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 py-0.5">
                        <span className="text-slate-500 w-14 shrink-0">{log.timestamp}</span>
                        <span className={`w-24 shrink-0 ${
                          log.source === 'Context Engine' ? 'text-blue-400' :
                          log.source === 'LLM Reasoning' ? 'text-purple-400' :
                          log.source === 'Pipeline' ? 'text-green-400' :
                          'text-amber-400'
                        }`}>[{log.source}]</span>
                        <span className="text-slate-300">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent 洞察抽屉 */}
      <AgentContextDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="合同风险审查报告"
        description="基于 6 个业务域的跨域 Context 全量审查"
        riskLevel={result?.overallRisk ?? null}
        contextSummary={result?.overallSummary}
        isAnalyzing={status === 'analyzing'}
      >
        {result && (
          <div className="space-y-4">
            {/* 统计概览 */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 bg-green-50 rounded-md text-center border border-green-200">
                <div className="text-lg font-bold text-green-700">{stats.pass}</div>
                <div className="text-[10px] text-green-500">通过</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-md text-center border border-amber-200">
                <div className="text-lg font-bold text-amber-700">{stats.warning}</div>
                <div className="text-[10px] text-amber-500">注意</div>
              </div>
              <div className="p-2 bg-red-50 rounded-md text-center border border-red-200">
                <div className="text-lg font-bold text-red-700">{stats.danger}</div>
                <div className="text-[10px] text-red-500">高风险</div>
              </div>
              <div className="p-2 bg-blue-50 rounded-md text-center border border-blue-200">
                <div className="text-lg font-bold text-blue-700">{stats.info}</div>
                <div className="text-[10px] text-blue-500">提示</div>
              </div>
            </div>

            {/* 全部检查项 */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">全量审查明细</h4>
              {result.checks.map((item, index) => (
                <RiskCheckCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}
      </AgentContextDrawer>
    </div>
  )
}
