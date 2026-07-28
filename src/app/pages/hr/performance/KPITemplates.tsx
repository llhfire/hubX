import { useState } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { ChevronDown, ChevronUp, CheckCircle, FileText } from 'lucide-react'

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

const barColors = ['#6366f1', '#3b82f6', '#14b8a6', '#10b981', '#06b6d4', '#8b5cf6']

export function KPITemplates() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">KPI 模板管理</h1>
        <Badge variant="secondary">{TEMPLATES.length} 个模板</Badge>
      </div>

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
