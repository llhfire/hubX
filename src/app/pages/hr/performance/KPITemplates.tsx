import { useState } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { ChevronDown, ChevronUp, CheckCircle, FileText, Sparkles, Loader2 } from 'lucide-react'

interface KPIItem {
  name: string
  weight: number
  target: string
}

interface Template {
  id: string
  name: string
  position: string
  items: KPIItem[]
}

const TEMPLATES: Template[] = [
  {
    id: 'kpi-001',
    name: '前端开发绩效考核模板',
    position: '前端开发',
    items: [
      { name: '需求交付及时率', weight: 30, target: '≥95%' },
      { name: '代码质量', weight: 25, target: 'CR通过率≥90%' },
      { name: '页面性能优化', weight: 15, target: 'LCP<2s' },
      { name: '技术分享与沉淀', weight: 10, target: '月度≥1次' },
      { name: '团队协作', weight: 10, target: '360评分≥80' },
      { name: '自驱学习', weight: 10, target: '季度≥1项新技术' },
    ],
  },
  {
    id: 'kpi-002',
    name: '后端开发绩效考核模板',
    position: '后端开发',
    items: [
      { name: '需求交付及时率', weight: 25, target: '≥95%' },
      { name: '系统稳定性', weight: 25, target: '可用性≥99.9%' },
      { name: '代码质量', weight: 20, target: 'CR通过率≥90%' },
      { name: '接口性能', weight: 15, target: 'P99<200ms' },
      { name: '技术沉淀', weight: 10, target: '月度≥1篇' },
      { name: '安全隐患排查', weight: 5, target: '季度0高危' },
    ],
  },
  {
    id: 'kpi-003',
    name: '销售绩效考核模板',
    position: '销售经理',
    items: [
      { name: '签单金额', weight: 40, target: '月度≥30万' },
      { name: '新客户开发', weight: 20, target: '月度≥5个' },
      { name: '客户转化率', weight: 15, target: '≥20%' },
      { name: '回款率', weight: 15, target: '≥85%' },
      { name: '客户满意度', weight: 10, target: 'NPS≥8' },
    ],
  },
]

const AI_GENERATED_ITEMS: KPIItem[] = [
  { name: '核心业务指标达成率', weight: 35, target: '≥90%' },
  { name: '项目交付准时率', weight: 25, target: '≥95%' },
  { name: '跨部门协作满意度', weight: 20, target: '评分≥85' },
  { name: '创新提案落地数', weight: 12, target: '季度≥2项' },
  { name: '知识沉淀与分享', weight: 8, target: '月度≥1篇' },
]

const barColors = ['#6366f1', '#3b82f6', '#14b8a6', '#10b981', '#06b6d4', '#8b5cf6']

export function KPITemplates() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id))
  }

  const handleAiGenerate = () => {
    setAiGenerating(true)
    setTimeout(() => {
      setAiGenerating(false)
      setAiGenerated(true)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">KPI 模板管理</h1>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
            onClick={handleAiGenerate}
            disabled={aiGenerating}
          >
            {aiGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {aiGenerating ? 'AI 生成中...' : 'AI 一键生成 KPI'}
          </Button>
          <Badge variant="secondary">{TEMPLATES.length} 个模板</Badge>
        </div>
      </div>

      {aiGenerated && (
        <Card className="border-violet-200 bg-violet-50/50">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-700">AI 智能生成 KPI 方案</span>
            </div>
            {AI_GENERATED_ITEMS.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700">{item.name}</span>
                    <Badge variant="outline" className="bg-violet-100 text-violet-600 border-violet-200 text-xs gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" />
                      AI 辅助生成
                    </Badge>
                  </div>
                  <span className="text-slate-500">{item.target}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.weight}%`, backgroundColor: barColors[idx % barColors.length] }} />
                  </div>
                  <span className="text-sm font-mono font-medium text-slate-600 w-12 text-right">{item.weight}%</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t text-sm font-medium">
              <span className="text-slate-600">合计权重</span>
              <span className="text-green-600">100%</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {TEMPLATES.map((tpl) => {
          const totalWeight = tpl.items.reduce((sum, item) => sum + item.weight, 0)
          const isValid = totalWeight === 100
          const isExpanded = expanded === tpl.id

          return (
            <Card key={tpl.id} className="overflow-hidden">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{tpl.name}</div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        岗位: {tpl.position} · KPI 项数: {tpl.items.length} 项
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={isValid ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}>
                      {isValid && <CheckCircle className="h-3 w-3 mr-1" />}
                      Σ权重 = {totalWeight}%
                    </Badge>
                    <button
                      className="p-1 rounded-md hover:bg-slate-100 transition-colors"
                      onClick={() => toggle(tpl.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {tpl.items.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="text-slate-500">{item.target}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${item.weight}%`, backgroundColor: barColors[idx % barColors.length] }} />
                          </div>
                          <span className="text-sm font-mono font-medium text-slate-600 w-12 text-right">{item.weight}%</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t text-sm font-medium">
                      <span className="text-slate-600">合计权重</span>
                      <span className={isValid ? 'text-green-600' : 'text-red-600'}>{totalWeight}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
