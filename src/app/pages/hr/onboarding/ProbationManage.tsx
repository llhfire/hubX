import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Separator } from '@/app/components/ui/separator'
import {
  CalendarDays,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Star,
  TrendingUp,
} from 'lucide-react'
import { ONBOARDING_RECORDS } from '../mockData'

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function ProbationManage() {
  const probationRecords = useMemo(
    () => ONBOARDING_RECORDS.filter((r) => r.status === '试用期'),
    []
  )

  const totalInProbation = probationRecords.length
  const evaluatedCount = ONBOARDING_RECORDS.filter(
    (r) => r.probationEvaluation !== null
  ).length
  const totalRelevant = ONBOARDING_RECORDS.filter(
    (r) => r.status === '试用期' || r.status === '已转正'
  ).length
  const completionRate =
    totalRelevant > 0
      ? Math.round((evaluatedCount / totalRelevant) * 100)
      : 0

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">试用期管理</h1>
          <Badge variant="secondary">{probationRecords.length} 人试用期中</Badge>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalInProbation}</div>
                <div className="text-sm text-muted-foreground">当前试用期人数</div>
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
                <div className="text-2xl font-bold">{evaluatedCount}</div>
                <div className="text-sm text-muted-foreground">已评估人数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <div className="text-sm text-muted-foreground">评估完成率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {probationRecords.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            当前没有处于试用期的员工
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {probationRecords.map((record) => {
            const daysRemaining = record.probationEndDate
              ? getDaysRemaining(record.probationEndDate)
              : null
            const isAlmostDone = daysRemaining !== null && daysRemaining <= 15
            const isOverdue = daysRemaining !== null && daysRemaining <= 0
            const hasEvaluation = record.probationEvaluation !== null

            return (
              <Card
                key={record.id}
                className={
                  isOverdue
                    ? 'border-red-200 bg-red-50/30'
                    : isAlmostDone
                    ? 'border-amber-200 bg-amber-50/30'
                    : ''
                }
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                        {record.employeeName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">{record.employeeName}</span>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          试用期
                        </Badge>
                        {isOverdue && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            已到期
                          </Badge>
                        )}
                        {isAlmostDone && !isOverdue && (
                          <Badge
                            variant="outline"
                            className="gap-1 bg-amber-50 text-amber-700 border-amber-200"
                          >
                            <Clock className="h-3 w-3" />
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

                      {/* 试用期信息 */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="p-3 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {record.joinDate}
                          </div>
                          <div className="text-[10px] text-slate-400">入职日期</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {record.probationEndDate ?? '未设置'}
                          </div>
                          <div className="text-[10px] text-slate-400">转正日期</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <Timer className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div
                            className={`text-sm font-bold ${
                              isOverdue
                                ? 'text-red-600'
                                : isAlmostDone
                                ? 'text-amber-600'
                                : 'text-slate-700'
                            }`}
                          >
                            {daysRemaining !== null
                              ? isOverdue
                                ? `已超${Math.abs(daysRemaining)}天`
                                : `${daysRemaining}天`
                              : '--'}
                          </div>
                          <div className="text-[10px] text-slate-400">剩余天数</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {record.laborContractSigned ? '已签' : '未签'}
                          </div>
                          <div className="text-[10px] text-slate-400">劳动合同</div>
                        </div>
                      </div>

                      {/* 试用期评估 */}
                      {hasEvaluation && (
                        <Card className="bg-blue-50/50 border-blue-200 mb-4">
                          <CardContent className="pt-3 pb-3">
                            <div className="flex items-start gap-2">
                              <Star className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-blue-700">
                                    试用期评估结果
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      record.probationEvaluation!.result === '转正'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : record.probationEvaluation!.result === '延长试用'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-red-50 text-red-600 border-red-200'
                                    }`}
                                  >
                                    {record.probationEvaluation!.result === '转正' && (
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                    )}
                                    {record.probationEvaluation!.result === '延长试用' && (
                                      <Clock className="h-3 w-3 mr-1" />
                                    )}
                                    {record.probationEvaluation!.result === '辞退' && (
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                    )}
                                    {record.probationEvaluation!.result}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                                  <div>
                                    <span className="text-slate-400">KPI 得分</span>
                                    <p className="font-bold text-blue-600">
                                      {record.probationEvaluation!.kpiScore}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">主管评分</span>
                                    <p className="font-bold text-blue-600">
                                      {record.probationEvaluation!.managerScore}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">同事互评</span>
                                    <p className="font-bold text-blue-600">
                                      {record.probationEvaluation!.peerScore}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-slate-400">综合评分</span>
                                    <p className="font-bold text-indigo-600">
                                      {record.probationEvaluation!.overallScore}
                                    </p>
                                  </div>
                                </div>
                                <Separator className="my-2" />
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {record.probationEvaluation!.comment}
                                </p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                  <Star className="h-3 w-3" />
                                  评估人: {record.probationEvaluation!.evaluator}
                                  <span className="mx-1">|</span>
                                  {record.probationEvaluation!.evaluatedAt}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        {isAlmostDone || isOverdue ? (
                          <Button className="gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            发起转正评估
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="gap-2">
                            <Clock className="h-4 w-4" />
                            评估日未到
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
