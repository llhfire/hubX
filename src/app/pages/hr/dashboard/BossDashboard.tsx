import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, DollarSign, TrendingUp, UserCheck, AlertTriangle, Search, Bot } from 'lucide-react'
import { useState } from 'react'

const salaryTrend = [
  { month: '1月', total: 420000, base: 350000, performance: 70000 },
  { month: '2月', total: 435000, base: 355000, performance: 80000 },
  { month: '3月', total: 450000, base: 360000, performance: 90000 },
  { month: '4月', total: 465000, base: 370000, performance: 95000 },
  { month: '5月', total: 480000, base: 375000, performance: 105000 },
  { month: '6月', total: 495000, base: 380000, performance: 115000 },
  { month: '7月', total: 510000, base: 385000, performance: 125000 },
]

const bizLineROI = [
  { name: '软件定制开发', cost: 280000, revenue: 850000, roi: 204 },
  { name: 'IP打造', cost: 85000, revenue: 320000, roi: 276 },
  { name: '移民业务', cost: 120000, revenue: 480000, roi: 300 },
  { name: '电商业务', cost: 65000, revenue: 180000, roi: 177 },
]

const staffStructure = [
  { name: '技术部', value: 18, color: '#6366f1' },
  { name: '销售部', value: 12, color: '#f59e0b' },
  { name: '运营部', value: 8, color: '#10b981' },
  { name: '设计部', value: 4, color: '#ec4899' },
  { name: '产品部', value: 5, color: '#3b82f6' },
  { name: '行政财务', value: 6, color: '#8b5cf6' },
]

const performanceDistribution = [
  { grade: 'S', count: 3, color: '#f59e0b' },
  { grade: 'A', count: 8, color: '#10b981' },
  { grade: 'B', count: 15, color: '#3b82f6' },
  { grade: 'C', count: 4, color: '#f97316' },
  { grade: 'D', count: 1, color: '#ef4444' },
]

export function BossDashboard() {
  const [nlQuery, setNlQuery] = useState('')
  const [nlResult, setNlResult] = useState<string | null>(null)

  const handleNLSearch = () => {
    if (!nlQuery) return
    setNlResult(`📊 根据自然语言查询「${nlQuery}」的分析结果：\n\n• 电商业务线 2026 年 1-7 月人工成本 ¥65,000，派单工时产出 ¥180,000，ROI 为 177%\n• 建议优化电商业务线人力配置，当前投入产出比在 4 条业务线中最低`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">老板看板</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="自然语言查报表..."
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNLSearch()}
              className="pl-8 w-72"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleNLSearch} className="gap-1">
            <Bot className="h-4 w-4" />AI 查询
          </Button>
        </div>
      </div>

      {/* AI 查询结果 */}
      {nlResult && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Bot className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div className="text-sm text-slate-700 whitespace-pre-line">{nlResult}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">在职人数</div>
                <div className="text-2xl font-bold mt-1">53</div>
                <div className="text-xs text-green-500 mt-1">↑ 较上月 +2</div>
              </div>
              <Users className="h-8 w-8 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">本月薪资成本</div>
                <div className="text-2xl font-bold mt-1">¥51万</div>
                <div className="text-xs text-amber-500 mt-1">↑ 较上月 +3%</div>
              </div>
              <DollarSign className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">试岗期员工</div>
                <div className="text-2xl font-bold mt-1">2</div>
                <div className="text-xs text-amber-500 mt-1">⚠️ 黄丽试岗第 15 天</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">出勤率</div>
                <div className="text-2xl font-bold mt-1">96.8%</div>
                <div className="text-xs text-green-500 mt-1">正常范围</div>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 薪资成本趋势 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">全员薪资成本趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salaryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `¥${(v / 10000).toFixed(1)}万`} />
                <Bar dataKey="base" stackId="a" fill="#6366f1" name="底薪" radius={[0, 0, 0, 0]} />
                <Bar dataKey="performance" stackId="a" fill="#a5b4fc" name="绩效" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 业务线 ROI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">业务线 ROI 与人效</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bizLineROI}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `¥${(v / 10000).toFixed(1)}万`} />
                <Bar dataKey="cost" fill="#f87171" name="人力成本" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#34d399" name="产出" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 人员结构 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">人员结构分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={staffStructure} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {staffStructure.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {staffStructure.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600 flex-1">{s.name}</span>
                    <span className="font-medium">{s.value}人</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 绩效分布 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">绩效等级分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="人数" radius={[4, 4, 0, 0]}>
                  {performanceDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
