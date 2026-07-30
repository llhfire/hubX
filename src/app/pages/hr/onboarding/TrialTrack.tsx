import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Progress } from '@/app/components/ui/progress'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Separator } from '@/app/components/ui/separator'
import {
  Timer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarDays,
  User,
  Building2,
  Sparkles,
  Star,
} from 'lucide-react'
import { ONBOARDING_RECORDS } from '../mockData'

function getDaysBetween(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
}

function getDaysPassed(start: string): number {
  const s = new Date(start)
  const now = new Date()
  return Math.max(0, Math.ceil((now.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)))
}

export function TrialTrack() {
  const trialRecords = useMemo(
    () => ONBOARDING_RECORDS.filter((r) => r.status === '试岗中'),
    []
  )

  const totalInTrial = trialRecords.length
  const passedCount = ONBOARDING_RECORDS.filter(
    (r) => r.trialEvaluation?.result === '通过'
  ).length
  const totalEvaluated = ONBOARDING_RECORDS.filter(
    (r) => r.trialEvaluation !== null
  ).length
  const passingRate =
    totalEvaluated > 0 ? Math.round((passedCount / totalEvaluated) * 100) : 0

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">试岗期跟踪</h1>
          <Badge variant="secondary">{trialRecords.length} 人试岗中</Badge>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalInTrial}</div>
                <div className="text-sm text-muted-foreground">当前试岗人数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalEvaluated}</div>
                <div className="text-sm text-muted-foreground">已评估人数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{passingRate}%</div>
                <div className="text-sm text-muted-foreground">试岗通过率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {trialRecords.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            当前没有处于试岗期的员工
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trialRecords.map((record) => {
            const totalDays = getDaysBetween(record.trialStartDate, record.trialEndDate)
            const daysPassed = getDaysPassed(record.trialStartDate)
            const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100))
            const isAlmostDone = daysPassed >= totalDays - 2
            const canEvaluate = daysPassed >= 5
            const hasEvaluation = record.trialEvaluation !== null

            return (
              <Card
                key={record.id}
                className={isAlmostDone ? 'border-amber-200 bg-amber-50/30' : ''}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg bg-indigo-100 text-indigo-700">
                        {record.employeeName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">{record.employeeName}</span>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          试岗中
                        </Badge>
                        {isAlmostDone && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            即将到期
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {record.position}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {record.departmentName}
                        </span>
                      </div>

                      {/* 试岗进度条 */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500">试岗进度</span>
                          <span className="font-medium">
                            第 {Math.min(daysPassed, totalDays)} / {totalDays} 天
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className={`h-2.5 ${
                            isAlmostDone
                              ? '[&>div]:bg-amber-500'
                              : '[&>div]:bg-indigo-500'
                          }`}
                        />
                      </div>

                      {/* 试岗信息 */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="p-2 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {record.trialStartDate}
                          </div>
                          <div className="text-[10px] text-slate-400">开始日期</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {record.trialEndDate}
                          </div>
                          <div className="text-[10px] text-slate-400">结束日期</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="text-sm font-bold text-slate-700">{daysPassed}天</div>
                          <div className="text-[10px] text-slate-400">已进行</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <Timer className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {Math.max(0, totalDays - daysPassed)}天
                          </div>
                          <div className="text-[10px] text-slate-400">剩余</div>
                        </div>
                      </div>

                      {/* 试岗评估 */}
                      {hasEvaluation && (
                        <Card className="bg-indigo-50/50 border-indigo-200 mb-4">
                          <CardContent className="pt-3 pb-3">
                            <div className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-indigo-500 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-indigo-700">
                                    试岗评估结果
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      record.trialEvaluation!.result === '通过'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-red-50 text-red-600 border-red-200'
                                    }`}
                                  >
                                    {record.trialEvaluation!.result === '通过' ? (
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                    ) : (
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                    )}
                                    {record.trialEvaluation!.result}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                                  <div>
                                    <span className="text-slate-400">出勤情况</span>
                                    <p className="font-medium text-slate-700">
                                      {record.trialEvaluation!.attendance}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">完成任务</span>
                                    <p className="font-medium text-slate-700">
                                      {record.trialEvaluation!.tasksCompleted} 项
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">综合评分</span>
                                    <p className="font-bold text-indigo-600">
                                      {record.trialEvaluation!.overallScore}
                                    </p>
                                  </div>
                                </div>
                                <Separator className="my-2" />
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {record.trialEvaluation!.comment}
                                </p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                  <Star className="h-3 w-3" />
                                  评估人: {record.trialEvaluation!.evaluator}
                                  <span className="mx-1">|</span>
                                  {record.trialEvaluation!.evaluatedAt}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        {canEvaluate ? (
                          <Button className="gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            发起评估
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="gap-2">
                            <Clock className="h-4 w-4" />
                            第5天后可发起评估
                          </Button>
                        )}
                        <Button variant="outline" className="gap-2">
                          <Timer className="h-4 w-4" />
                          查看详细记录
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
