import { useParams, useNavigate } from 'react-router'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { Separator } from '@/app/components/ui/separator'
import {
  ArrowLeft,
  Check,
  X,
  FileText,
  User,
  Briefcase,
  Building2,
  Calendar,
} from 'lucide-react'
import { ONBOARDING_RECORDS } from '../mockData'
import type { OnboardingStatus } from '../types'

const statusColorMap: Record<OnboardingStatus, string> = {
  '待入职': 'bg-slate-100 text-slate-700 border-slate-200',
  '资料收集中': 'bg-blue-100 text-blue-700 border-blue-200',
  '试岗中': 'bg-amber-100 text-amber-700 border-amber-200',
  '试用期': 'bg-purple-100 text-purple-700 border-purple-200',
  '已转正': 'bg-green-100 text-green-700 border-green-200',
  '已淘汰': 'bg-red-100 text-red-700 border-red-200',
}

export function OnboardingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const record = ONBOARDING_RECORDS.find((r) => r.id === id)

  if (!record) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/onboarding')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">入职详情</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            未找到该入职记录
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalDocs = record.documents.length
  const submittedDocs = record.documents.filter((d) => d.submitted).length
  const docProgress = totalDocs > 0 ? Math.round((submittedDocs / totalDocs) * 100) : 0

  const totalItems = totalDocs + 2
  const completedItems =
    submittedDocs +
    (record.trialAgreementSigned ? 1 : 0) +
    (record.laborContractSigned ? 1 : 0)
  const overallProgress = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/onboarding')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">入职详情</h1>
        <Badge variant="outline" className={statusColorMap[record.status]}>
          {record.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">入职完成进度</span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            资料 {submittedDocs}/{totalDocs} 已提交 |{' '}
            试岗协议 {record.trialAgreementSigned ? '已签' : '未签'} |{' '}
            劳动合同 {record.laborContractSigned ? '已签' : '未签'}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左列 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                  {record.employeeName[0]}
                </div>
                <div>
                  <div className="text-lg font-medium">{record.employeeName}</div>
                  <div className="text-sm text-muted-foreground">{record.departmentName}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">姓名：</span>
                  <span>{record.employeeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">岗位：</span>
                  <span>{record.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">部门：</span>
                  <span>{record.departmentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">入职日期：</span>
                  <span>{record.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">试岗起止：</span>
                  <span>{record.trialStartDate} ~ {record.trialEndDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">试用期截止：</span>
                  <span>{record.probationEndDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">入职资料清单</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {record.documents.map((doc) => (
                  <div
                    key={doc.type}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc.type}</span>
                    </div>
                    {doc.submitted ? (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 border-green-200"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          已提交
                        </Badge>
                        {doc.submittedAt && (
                          <span className="text-xs text-muted-foreground">
                            {doc.submittedAt}
                          </span>
                        )}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-700 border-red-200"
                      >
                        <X className="mr-1 h-3 w-3" />
                        未提交
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>资料完成度</span>
                  <span>{docProgress}%</span>
                </div>
                <Progress value={docProgress} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">协议签署状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">试岗协议</span>
                  {record.trialAgreementSigned ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      <Check className="mr-1 h-3 w-3" /> 已签署
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                      <X className="mr-1 h-3 w-3" /> 未签署
                    </Badge>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">劳动合同</span>
                  {record.laborContractSigned ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      <Check className="mr-1 h-3 w-3" /> 已签署
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                      <X className="mr-1 h-3 w-3" /> 未签署
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右列 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">试岗评估</CardTitle>
            </CardHeader>
            <CardContent>
              {record.trialEvaluation ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.trialEvaluation.overallScore}
                      </div>
                      <div className="text-xs text-slate-400">综合评分</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.trialEvaluation.communicationScore}
                      </div>
                      <div className="text-xs text-slate-400">沟通能力</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.trialEvaluation.tasksCompleted}
                      </div>
                      <div className="text-xs text-slate-400">完成任务数</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.trialEvaluation.totalHours}h
                      </div>
                      <div className="text-xs text-slate-400">工时消耗</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">出勤情况</span>
                    <span>{record.trialEvaluation.attendance}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">评估结果</span>
                    <Badge
                      variant="outline"
                      className={
                        record.trialEvaluation.result === '通过'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }
                    >
                      {record.trialEvaluation.result}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">评估意见</div>
                    <p className="text-sm">{record.trialEvaluation.comment}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>评估人：{record.trialEvaluation.evaluator}</span>
                    <span>{record.trialEvaluation.evaluatedAt}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  暂无试岗评估记录
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">试用期评估</CardTitle>
            </CardHeader>
            <CardContent>
              {record.probationEvaluation ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.probationEvaluation.overallScore}
                      </div>
                      <div className="text-xs text-slate-400">综合评分</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.probationEvaluation.kpiScore}
                      </div>
                      <div className="text-xs text-slate-400">KPI 得分</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.probationEvaluation.managerScore}
                      </div>
                      <div className="text-xs text-slate-400">主管评分</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {record.probationEvaluation.peerScore}
                      </div>
                      <div className="text-xs text-slate-400">同事互评</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">评估结果</span>
                    <Badge
                      variant="outline"
                      className={
                        record.probationEvaluation.result === '转正'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : record.probationEvaluation.result === '延长试用'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }
                    >
                      {record.probationEvaluation.result}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">评估意见</div>
                    <p className="text-sm">{record.probationEvaluation.comment}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>评估人：{record.probationEvaluation.evaluator}</span>
                    <span>{record.probationEvaluation.evaluatedAt}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  暂无试用期评估记录
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">面试记录快照</CardTitle>
            </CardHeader>
            <CardContent>
              {record.interviewSnapshot.length > 0 ? (
                <div className="space-y-4">
                  {record.interviewSnapshot.map((interview) => (
                    <div
                      key={interview.id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            第 {interview.round} 轮面试
                          </span>
                          <Badge variant="outline">{interview.channel}</Badge>
                          <Badge
                            variant="outline"
                            className={
                              interview.result === '通过'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : interview.result === '待定'
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-red-100 text-red-700 border-red-200'
                            }
                          >
                            {interview.result}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {interview.interviewTime}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        面试官：{interview.interviewer} | 时长：{interview.duration}分钟
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center p-1.5 bg-slate-50 rounded">
                          <div className="text-sm font-semibold">{interview.technicalScore}</div>
                          <div className="text-[10px] text-muted-foreground">技术能力</div>
                        </div>
                        <div className="text-center p-1.5 bg-slate-50 rounded">
                          <div className="text-sm font-semibold">{interview.communicationScore}</div>
                          <div className="text-[10px] text-muted-foreground">沟通能力</div>
                        </div>
                        <div className="text-center p-1.5 bg-slate-50 rounded">
                          <div className="text-sm font-semibold">{interview.cultureScore}</div>
                          <div className="text-[10px] text-muted-foreground">文化匹配</div>
                        </div>
                        <div className="text-center p-1.5 bg-slate-50 rounded">
                          <div className="text-sm font-semibold">{interview.overallScore}</div>
                          <div className="text-[10px] text-muted-foreground">综合评分</div>
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">优势：</span>
                        <span>{interview.strengths}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">不足：</span>
                        <span>{interview.weaknesses}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">评语：</span>
                        <span>{interview.comment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  暂无面试记录
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
