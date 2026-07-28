import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Progress } from '@/app/components/ui/progress'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Timer, AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react'

const PROBATION_EMPLOYEES = [
  { id: 'e-9', name: '黄丽', position: '前端开发工程师', department: '技术部', bizLine: '电商业务', joinDate: '2026-07-01', dayInTrial: 15, totalDays: 15, status: '试岗中', attendance: '13/15', tasksCompleted: 2, totalHours: 24, avatar: '黄' },
  { id: 'e-10', name: '吴强', position: '销售经理', department: '销售部', bizLine: '电商业务', joinDate: '2026-07-10', dayInTrial: 6, totalDays: 15, status: '试岗中', attendance: '5/6', tasksCompleted: 1, totalHours: 16, avatar: '吴' },
]

export function ProbationTrack() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">试岗期跟踪</h1>
          <Badge variant="secondary">{PROBATION_EMPLOYEES.length} 人试岗中</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PROBATION_EMPLOYEES.map((emp) => {
          const progress = (emp.dayInTrial / emp.totalDays) * 100
          const isAlmostDone = emp.dayInTrial >= 12

          return (
            <Card key={emp.id} className={isAlmostDone ? 'border-amber-200 bg-amber-50/30' : ''}>
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg bg-indigo-100 text-indigo-700">{emp.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">{emp.name}</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{emp.status}</Badge>
                      {isAlmostDone && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />即将到期</Badge>}
                    </div>
                    <div className="text-sm text-slate-500 mb-3">{emp.position} · {emp.department} · {emp.bizLine}</div>

                    {/* 试岗进度条 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-500">试岗进度</span>
                        <span className="font-medium">第 {emp.dayInTrial} / {emp.totalDays} 工作日</span>
                      </div>
                      <Progress value={progress} className={`h-2.5 ${isAlmostDone ? '[&>div]:bg-amber-500' : '[&>div]:bg-indigo-500'}`} />
                    </div>

                    {/* 行为数据 */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="p-2 bg-slate-50 rounded text-center">
                        <div className="text-lg font-bold text-slate-700">{emp.attendance}</div>
                        <div className="text-[10px] text-slate-400">出勤/应出勤</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded text-center">
                        <div className="text-lg font-bold text-slate-700">{emp.tasksCompleted}</div>
                        <div className="text-[10px] text-slate-400">完成派单</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded text-center">
                        <div className="text-lg font-bold text-slate-700">{emp.totalHours}h</div>
                        <div className="text-[10px] text-slate-400">消耗工时</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded text-center">
                        <div className="text-lg font-bold text-slate-700">{emp.joinDate}</div>
                        <div className="text-[10px] text-slate-400">入职日期</div>
                      </div>
                    </div>

                    {/* AI 试岗小结 */}
                    <Card className="bg-indigo-50/50 border-indigo-200">
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-500 mt-0.5" />
                          <div>
                            <span className="text-xs font-medium text-indigo-700">AI 试岗表现小结</span>
                            <p className="text-sm text-slate-600 mt-1">
                              {emp.name}在试岗期间出勤正常（{emp.attendance}），完成 {emp.tasksCompleted} 项派单任务，
                              累计消耗 {emp.totalHours} 工时。整体表现{emp.dayInTrial >= 12 ? '良好，建议按期评估' : '正在观察中'}。
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 mt-3">
                      {emp.dayInTrial >= 12 ? (
                        <Button className="gap-2"><CheckCircle2 className="h-4 w-4" />发起试岗评估</Button>
                      ) : (
                        <Button variant="outline" disabled className="gap-2"><Clock className="h-4 w-4" />评估日未到</Button>
                      )}
                      <Button variant="outline" className="gap-2"><Timer className="h-4 w-4" />查看详细记录</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
