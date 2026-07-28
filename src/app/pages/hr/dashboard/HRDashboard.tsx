import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Progress } from '@/app/components/ui/progress'
import {
  UserPlus,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  BarChart3,
  Users,
  TrendingUp,
  ArrowRight,
  Bot,
  ShieldAlert,
} from 'lucide-react'

const recruitmentFunnel = [
  { stage: '简历解析', count: 32, color: 'bg-indigo-500' },
  { stage: '面试中', count: 18, color: 'bg-blue-500' },
  { stage: '待定薪', count: 5, color: 'bg-amber-500' },
  { stage: '已发Offer', count: 3, color: 'bg-green-500' },
]

const trialEmployees = [
  { name: '黄伟杰', position: '前端开发', department: '前端组', daysLeft: 2, totalDays: 5 },
  { name: '郑雨萱', position: '运营专员', department: '运营部', daysLeft: 0, totalDays: 5 },
]

const performanceDist = [
  { grade: 'S', count: 3, color: 'bg-amber-500' },
  { grade: 'A', count: 8, color: 'bg-green-500' },
  { grade: 'B', count: 15, color: 'bg-blue-500' },
  { grade: 'C', count: 4, color: 'bg-orange-500' },
  { grade: 'D', count: 1, color: 'bg-red-500' },
]

const anomalies = [
  {
    id: 1,
    title: '郑雨萱 绩效系数异常',
    description:
      '该员工处于试用期(89%薪资)，但绩效系数按1.0计算，与试用期员工不参与绩效考核的规则冲突。建议将绩效基数置零，待转正后恢复。',
    severity: '高' as const,
    period: '2026-07',
  },
  {
    id: 2,
    title: '黄伟杰 社保缴纳缺失',
    description:
      '该员工试岗期间薪资已计算(¥2,610)，但社保缴纳基数为0。根据规定试岗期员工不缴纳社保，但需确认试岗通过后补缴方案是否已规划。',
    severity: '中' as const,
    period: '2026-07',
  },
]

export function HRDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">HR 工作台</h1>
        <Badge variant="secondary" className="text-xs">2026年7月</Badge>
      </div>

      {/* 招聘漏斗 + 试岗跟踪 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-indigo-500" />
              <CardTitle className="text-sm">招聘漏斗</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recruitmentFunnel.map((item) => {
                const pct = Math.round((item.count / 32) * 100)
                return (
                  <div key={item.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{item.stage}</span>
                      <span className="font-medium">{item.count} 人</span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-100">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${item.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <TrendingUp className="h-3 w-3" />
              Offer转化率 9.4%（3/32）
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-sm">试岗跟踪</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trialEmployees.map((emp) => (
                <div
                  key={emp.name}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div>
                    <div className="text-sm font-medium">{emp.name}</div>
                    <div className="text-xs text-slate-400">
                      {emp.department} · {emp.position}
                    </div>
                  </div>
                  <div className="text-right">
                    {emp.daysLeft > 0 ? (
                      <>
                        <div className="text-sm font-bold text-amber-600">
                          剩余 {emp.daysLeft} 天
                        </div>
                        <Progress
                          value={((emp.totalDays - emp.daysLeft) / emp.totalDays) * 100}
                          className="mt-1 h-1.5 w-20"
                        />
                      </>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 text-xs">试岗结束</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-400">
              当前 2 人处于试岗期
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 考勤异常 + 绩效分布 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              <CardTitle className="text-sm">考勤异常</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <span className="text-2xl font-bold text-red-600">5</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-700">本月待处理异常</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  含补卡 2 条、请假 2 条、出差 1 条
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                待审批 2
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                已通过 3
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <CardTitle className="text-sm">绩效分布</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-24">
              {performanceDist.map((item) => (
                <div key={item.grade} className="flex flex-col items-center flex-1">
                  <span className="text-xs font-medium mb-1">{item.count}</span>
                  <div
                    className={`w-full rounded-t ${item.color}`}
                    style={{ height: `${(item.count / 15) * 100}%` }}
                  />
                  <span className="text-xs text-slate-500 mt-1">{item.grade}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-400 text-center">
              本月共 31 人参评
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI 异动审计 */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-sm">AI 算薪异动审计</CardTitle>
            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
              {anomalies.length} 条预警
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {anomalies.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-3"
              >
                <ShieldAlert
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    a.severity === '高' ? 'text-red-500' : 'text-amber-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.title}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        a.severity === '高'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}
                    >
                      {a.severity}风险
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.description}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{a.period}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 快捷操作 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">快捷操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              去招聘管理
              <ArrowRight className="h-3 w-3" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              去考勤管理
              <ArrowRight className="h-3 w-3" />
            </Button>
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              去绩效管理
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
