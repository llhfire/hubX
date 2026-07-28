import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { AlertTriangle, Bot } from 'lucide-react'

interface PerformanceRow {
  id: string
  name: string
  department: string
  period: string
  kpiCompleted: number
  kpiTotal: number
  totalScore: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  coefficient: number
  confirmStatus: '待确认' | '已确认' | '已申诉'
  bossReview: '待复核' | '已复核'
  aiBiasWarning: string | null
}

const gradeColor: Record<string, string> = {
  'S': 'bg-amber-50 text-amber-700 border-amber-200',
  'A': 'bg-green-50 text-green-700 border-green-200',
  'B': 'bg-blue-50 text-blue-700 border-blue-200',
  'C': 'bg-orange-50 text-orange-700 border-orange-200',
  'D': 'bg-red-50 text-red-700 border-red-200',
}

const confirmColor: Record<string, string> = {
  '待确认': 'bg-slate-100 text-slate-500',
  '已确认': 'bg-green-50 text-green-600',
  '已申诉': 'bg-amber-50 text-amber-600',
}

const reviewColor: Record<string, string> = {
  '待复核': 'bg-slate-100 text-slate-500',
  '已复核': 'bg-green-50 text-green-600',
}

const MONTHLY_DATA: PerformanceRow[] = [
  { id: '1', name: '王建国', department: '技术部', period: '2026-06', kpiCompleted: 6, kpiTotal: 6, totalScore: 95, grade: 'S', coefficient: 1.5, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '2', name: '周海涛', department: '销售部', period: '2026-06', kpiCompleted: 5, kpiTotal: 5, totalScore: 92, grade: 'S', coefficient: 1.5, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '3', name: '陈志远', department: '前端组', period: '2026-06', kpiCompleted: 6, kpiTotal: 6, totalScore: 85, grade: 'A', coefficient: 1.2, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '4', name: '赵雅琴', department: '产品部', period: '2026-06', kpiCompleted: 5, kpiTotal: 5, totalScore: 80, grade: 'A', coefficient: 1.2, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '5', name: '林美玲', department: '运营部', period: '2026-06', kpiCompleted: 5, kpiTotal: 5, totalScore: 78, grade: 'B', coefficient: 1.0, confirmStatus: '待确认', bossReview: '待复核', aiBiasWarning: null },
  { id: '6', name: '孙小明', department: '设计部', period: '2026-06', kpiCompleted: 4, kpiTotal: 4, totalScore: 72, grade: 'C', coefficient: 0.8, confirmStatus: '已确认', bossReview: '待复核', aiBiasWarning: null },
  { id: '7', name: '刘思琪', department: '后端组', period: '2026-06', kpiCompleted: 6, kpiTotal: 6, totalScore: 68, grade: 'C', coefficient: 0.8, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: '该员工入职不满1年，建议结合成长曲线综合评估，避免新员工绩效偏低的系统性偏差' },
  { id: '8', name: '吴静怡', department: '行政财务部', period: '2026-06', kpiCompleted: 4, kpiTotal: 4, totalScore: 62, grade: 'D', coefficient: 0.6, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
]

const QUARTERLY_DATA: PerformanceRow[] = [
  { id: '1', name: '王建国', department: '技术部', period: '2026-Q2', kpiCompleted: 6, kpiTotal: 6, totalScore: 93, grade: 'S', coefficient: 1.5, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '2', name: '周海涛', department: '销售部', period: '2026-Q2', kpiCompleted: 5, kpiTotal: 5, totalScore: 90, grade: 'S', coefficient: 1.5, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '3', name: '陈志远', department: '前端组', period: '2026-Q2', kpiCompleted: 6, kpiTotal: 6, totalScore: 84, grade: 'A', coefficient: 1.2, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '4', name: '赵雅琴', department: '产品部', period: '2026-Q2', kpiCompleted: 5, kpiTotal: 5, totalScore: 82, grade: 'A', coefficient: 1.2, confirmStatus: '待确认', bossReview: '待复核', aiBiasWarning: null },
  { id: '5', name: '林美玲', department: '运营部', period: '2026-Q2', kpiCompleted: 5, kpiTotal: 5, totalScore: 76, grade: 'B', coefficient: 1.0, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '6', name: '孙小明', department: '设计部', period: '2026-Q2', kpiCompleted: 4, kpiTotal: 4, totalScore: 70, grade: 'C', coefficient: 0.8, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '7', name: '刘思琪', department: '后端组', period: '2026-Q2', kpiCompleted: 6, kpiTotal: 6, totalScore: 71, grade: 'C', coefficient: 0.8, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '8', name: '吴静怡', department: '行政财务部', period: '2026-Q2', kpiCompleted: 4, kpiTotal: 4, totalScore: 65, grade: 'D', coefficient: 0.6, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
]

const YEARLY_DATA: PerformanceRow[] = [
  { id: '1', name: '王建国', department: '技术部', period: '2025', kpiCompleted: 6, kpiTotal: 6, totalScore: 91, grade: 'S', coefficient: 1.5, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '2', name: '周海涛', department: '销售部', period: '2025', kpiCompleted: 5, kpiTotal: 5, totalScore: 88, grade: 'A', coefficient: 1.2, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '3', name: '陈志远', department: '前端组', period: '2025', kpiCompleted: 6, kpiTotal: 6, totalScore: 83, grade: 'A', coefficient: 1.2, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '4', name: '赵雅琴', department: '产品部', period: '2025', kpiCompleted: 5, kpiTotal: 5, totalScore: 79, grade: 'B', coefficient: 1.0, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '5', name: '林美玲', department: '运营部', period: '2025', kpiCompleted: 5, kpiTotal: 5, totalScore: 75, grade: 'B', coefficient: 1.0, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '6', name: '孙小明', department: '设计部', period: '2025', kpiCompleted: 4, kpiTotal: 4, totalScore: 69, grade: 'C', coefficient: 0.8, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '7', name: '刘思琪', department: '后端组', period: '2025', kpiCompleted: 6, kpiTotal: 6, totalScore: 73, grade: 'B', coefficient: 1.0, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
  { id: '8', name: '吴静怡', department: '行政财务部', period: '2025', kpiCompleted: 4, kpiTotal: 4, totalScore: 60, grade: 'D', coefficient: 0.6, confirmStatus: '已确认', bossReview: '已复核', aiBiasWarning: null },
]

function PerformanceTable({ data }: { data: PerformanceRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>员工</TableHead>
          <TableHead>部门</TableHead>
          <TableHead>考核周期</TableHead>
          <TableHead className="text-center">KPI完成</TableHead>
          <TableHead className="text-center">加权总分</TableHead>
          <TableHead className="text-center">绩效等级</TableHead>
          <TableHead className="text-center">绩效系数</TableHead>
          <TableHead>确认状态</TableHead>
          <TableHead>老板复核</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-medium">{row.name}</span>
                {row.aiBiasWarning && (
                  <div className="group relative">
                    <Bot className="h-3.5 w-3.5 text-amber-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 rounded-md bg-slate-800 text-white text-xs leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      <div className="flex items-start gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                        <span>{row.aiBiasWarning}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm text-slate-500">{row.department}</TableCell>
            <TableCell className="text-sm">{row.period}</TableCell>
            <TableCell className="text-center text-sm">{row.kpiCompleted}/{row.kpiTotal}</TableCell>
            <TableCell className="text-center font-medium">{row.totalScore}</TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className={`text-xs font-bold ${gradeColor[row.grade]}`}>{row.grade}</Badge>
            </TableCell>
            <TableCell className="text-center font-mono text-sm">{row.coefficient.toFixed(1)}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`text-xs ${confirmColor[row.confirmStatus]}`}>{row.confirmStatus}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={`text-xs ${reviewColor[row.bossReview]}`}>{row.bossReview}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function PerformanceList() {
  const [tab, setTab] = useState('monthly')

  const data = useMemo(() => {
    if (tab === 'monthly') return MONTHLY_DATA
    if (tab === 'quarterly') return QUARTERLY_DATA
    return YEARLY_DATA
  }, [tab])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">绩效管理</h1>
        <Badge variant="secondary">共 {data.length} 人</Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="monthly">月度</TabsTrigger>
          <TabsTrigger value="quarterly">季度</TabsTrigger>
          <TabsTrigger value="yearly">年度</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <Card>
            <CardContent className="pt-4">
              <PerformanceTable data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
