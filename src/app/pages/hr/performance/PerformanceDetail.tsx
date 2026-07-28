import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Textarea } from '@/app/components/ui/textarea'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import {
  TrendingUp,
  ShieldAlert,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react'
import { useState } from 'react'

const record = {
  id: 'perf-001',
  employeeName: '王建国',
  departmentName: '技术部',
  position: '后端开发',
  period: '2026-06',
  periodType: '月度',
  totalScore: 95,
  grade: 'S' as const,
  coefficient: 1.5,
  managerComment: '技术能力突出，主导完成系统架构升级，线上零故障，表现优异',
  employeeConfirmStatus: '待确认' as const,
  aiBiasWarning: null,
}

const kpiItems = [
  { id: '1', name: '需求交付及时率', weight: 25, targetValue: '≥95%', actualValue: '98%', score: 95 },
  { id: '2', name: '系统稳定性', weight: 25, targetValue: '可用性≥99.9%', actualValue: '99.95%', score: 96 },
  { id: '3', name: '代码质量', weight: 20, targetValue: 'CR通过率≥90%', actualValue: '95%', score: 92 },
  { id: '4', name: '接口性能', weight: 15, targetValue: 'P99<200ms', actualValue: '150ms', score: 90 },
  { id: '5', name: '技术沉淀', weight: 10, targetValue: '月度≥1篇', actualValue: '2篇', score: 95 },
  { id: '6', name: '安全隐患排查', weight: 5, targetValue: '季度0高危', actualValue: '0高危', score: 100 },
]

const gradeMapping = [
  { grade: 'S', range: '≥95', coefficient: 1.2, color: 'bg-amber-100 text-amber-700' },
  { grade: 'A', range: '85-94', coefficient: 1.0, color: 'bg-green-100 text-green-700' },
  { grade: 'B', range: '75-84', coefficient: 0.8, color: 'bg-blue-100 text-blue-700' },
  { grade: 'C', range: '<75', coefficient: 0, color: 'bg-orange-100 text-orange-700' },
]

const gradeColor: Record<string, string> = {
  S: 'bg-amber-100 text-amber-700',
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-orange-100 text-orange-700',
  D: 'bg-red-100 text-red-700',
}

export function PerformanceDetail() {
  const [comment, setComment] = useState(record.managerComment)
  const [confirmStatus, setConfirmStatus] = useState(record.employeeConfirmStatus)

  const totalWeight = kpiItems.reduce((sum, item) => sum + item.weight, 0)
  const calculatedScore = Math.round(
    kpiItems.reduce((sum, item) => sum + (item.score * item.weight) / 100, 0)
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <TrendingUp className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-800">{record.employeeName}</h1>
                  <Badge variant="outline" className={`text-xs ${gradeColor[record.grade]}`}>
                    {record.grade}
                  </Badge>
                </div>
                <div className="text-sm text-slate-500 mt-0.5">
                  {record.departmentName} · {record.position}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-slate-400">考核周期</div>
                <div className="text-sm font-medium">{record.period}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">总分</div>
                <div className="text-2xl font-bold text-indigo-600">{record.totalScore}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">绩效系数</div>
                <div className="text-2xl font-bold text-amber-600">{record.coefficient}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Items Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">KPI 指标明细</CardTitle>
            <Badge
              variant="outline"
              className={`text-xs ${
                totalWeight === 100
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}
            >
              sum权重 = {totalWeight}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>指标名称</TableHead>
                <TableHead className="text-center">权重(%)</TableHead>
                <TableHead>目标值</TableHead>
                <TableHead>实际完成</TableHead>
                <TableHead className="text-center">得分</TableHead>
                <TableHead className="text-center">加权分</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpiItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      {item.weight}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{item.targetValue}</TableCell>
                  <TableCell className="text-sm">{item.actualValue}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-sm font-bold ${
                        item.score >= 90
                          ? 'text-green-600'
                          : item.score >= 75
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {item.score}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm text-slate-500">
                    {((item.score * item.weight) / 100).toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-slate-50">
                <TableCell colSpan={5} className="text-sm font-bold">
                  加权总分
                </TableCell>
                <TableCell className="text-center text-sm font-bold text-indigo-600">
                  {calculatedScore}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grade Mapping */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">等级映射规则</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {gradeMapping.map((g) => {
              const isActive = g.grade === record.grade
              return (
                <div
                  key={g.grade}
                  className={`rounded-lg border p-3 text-center ${
                    isActive ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-100'
                  }`}
                >
                  <Badge variant="outline" className={`text-xs ${g.color}`}>
                    {g.grade}
                  </Badge>
                  <div className="text-xs text-slate-400 mt-1">{g.range}分</div>
                  <div className="text-sm font-bold mt-0.5">{g.coefficient}</div>
                  {isActive && (
                    <div className="text-xs text-indigo-500 mt-1 font-medium">当前</div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Bias Warning */}
      {record.aiBiasWarning ? (
        <Alert className="border-amber-200 bg-amber-50/50">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm text-amber-700">
            {record.aiBiasWarning}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-green-200 bg-green-50/50">
          <Info className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm text-green-700">
            AI 偏差检测：本轮评分分布正常，未发现异常偏差
          </AlertDescription>
        </Alert>
      )}

      {/* Manager Comment */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-sm">主管评语</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="text-sm"
            placeholder="请输入绩效评语..."
          />
        </CardContent>
      </Card>

      {/* Employee Confirm */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">员工确认状态：</span>
              <Badge
                variant="outline"
                className={`text-xs ${
                  confirmStatus === '已确认'
                    ? 'bg-green-50 text-green-600 border-green-200'
                    : confirmStatus === '已申诉'
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}
              >
                {confirmStatus}
              </Badge>
            </div>
            {confirmStatus === '待确认' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setConfirmStatus('已申诉')}
                >
                  <XCircle className="h-4 w-4" />
                  申诉
                </Button>
                <Button
                  className="gap-1.5"
                  onClick={() => setConfirmStatus('已确认')}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  确认
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
