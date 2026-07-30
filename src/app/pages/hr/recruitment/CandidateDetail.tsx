import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  ArrowLeft,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  DollarSign,
  Building2,
  Star,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Separator } from '@/app/components/ui/separator'
import {
  CANDIDATES,
  CANDIDATE_DEMAND_RELATIONS,
  INTERVIEW_RECORDS,
  SALARY_APPROVALS,
  SALARY_COMMUNICATIONS,
  RECRUITMENT_NEEDS,
} from '../mockData'
import type { CandidateStage, ApprovalStatus } from '../types'

const sourceColor: Record<string, string> = {
  'Boss直聘': 'bg-blue-100 text-blue-700 border-blue-200',
  '猎聘': 'bg-purple-100 text-purple-700 border-purple-200',
  '拉勾': 'bg-green-100 text-green-700 border-green-200',
  '内部推荐': 'bg-amber-100 text-amber-700 border-amber-200',
  '主动投递': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  '猎头': 'bg-rose-100 text-rose-700 border-rose-200',
  '其他': 'bg-slate-100 text-slate-500 border-slate-200',
}

const stageColor: Record<CandidateStage, string> = {
  '简历筛选': 'bg-slate-100 text-slate-600 border-slate-200',
  '面试中': 'bg-blue-100 text-blue-700 border-blue-200',
  '待定薪': 'bg-amber-100 text-amber-700 border-amber-200',
  '已发Offer': 'bg-purple-100 text-purple-700 border-purple-200',
  '已接受': 'bg-green-100 text-green-700 border-green-200',
  '已拒绝': 'bg-red-100 text-red-600 border-red-200',
  '已淘汰': 'bg-gray-100 text-gray-500 border-gray-200',
}

const approvalColor: Record<ApprovalStatus, string> = {
  '待审批': 'bg-amber-100 text-amber-700 border-amber-200',
  '已通过': 'bg-green-100 text-green-700 border-green-200',
  '已拒绝': 'bg-red-100 text-red-600 border-red-200',
  '已撤回': 'bg-gray-100 text-gray-500 border-gray-200',
}

const resultIcon: Record<string, React.ReactNode> = {
  '通过': <CheckCircle2 className="h-4 w-4 text-green-500" />,
  '待定': <AlertCircle className="h-4 w-4 text-amber-500" />,
  '未通过': <XCircle className="h-4 w-4 text-red-500" />,
}

const resultColor: Record<string, string> = {
  '通过': 'bg-green-100 text-green-700 border-green-200',
  '待定': 'bg-amber-100 text-amber-700 border-amber-200',
  '未通过': 'bg-red-100 text-red-600 border-red-200',
}

export function CandidateDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const candidate = useMemo(() => CANDIDATES.find((c) => c.id === id), [id])

  const demandRelations = useMemo(
    () => CANDIDATE_DEMAND_RELATIONS.filter((r) => r.candidateId === id),
    [id]
  )

  const interviews = useMemo(
    () =>
      INTERVIEW_RECORDS.filter((r) => r.candidateId === id).sort(
        (a, b) => a.round - b.round
      ),
    [id]
  )

  const salaryApproval = useMemo(
    () => SALARY_APPROVALS.find((sa) => sa.candidateId === id),
    [id]
  )

  const salaryComms = useMemo(
    () => SALARY_COMMUNICATIONS.filter((sc) => sc.candidateId === id),
    [id]
  )

  if (!candidate) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/candidates')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">候选人未找到</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            未找到 ID 为 {id} 的候选人信息
          </CardContent>
        </Card>
      </div>
    )
  }

  const { parsedResume } = candidate

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/candidates')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-indigo-100 text-indigo-700">
                {candidate.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">{candidate.name}</h1>
                <Badge variant="outline" className={sourceColor[candidate.source] ?? 'bg-slate-100 text-slate-500'}>
                  {candidate.source}
                </Badge>
                {candidate.isFavorited && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                    <Star className="h-3 w-3 mr-1 fill-amber-400" />已收藏
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                <span>{candidate.gender}</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {candidate.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {candidate.email}
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground space-y-1">
              <div>创建时间: {candidate.createdAt}</div>
              <div>更新时间: {candidate.updatedAt}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content: 2-column layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left column: col-span-3 */}
        <div className="col-span-3 space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <span className="text-xs text-slate-400">学历</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {parsedResume.education}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">工作年限</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {parsedResume.workYears} 年
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">期望薪资</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {parsedResume.expectedSalary}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">最近公司</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {parsedResume.lastCompany}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">最近职位</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {parsedResume.lastPosition}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <span className="text-xs text-slate-400">自我介绍</span>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {parsedResume.selfIntro}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 技能 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                技能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parsedResume.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 工作经历 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-500" />
                工作经历
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {parsedResume.lastCompany}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {parsedResume.lastPosition}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: col-span-2 */}
        <div className="col-span-2 space-y-6">
          {/* 关联需求 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                关联需求
                <Badge variant="secondary" className="ml-auto text-xs">
                  {demandRelations.length} 个
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {demandRelations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暂无关联需求
                </p>
              ) : (
                <div className="space-y-3">
                  {demandRelations.map((rel) => {
                    const need = RECRUITMENT_NEEDS.find((n) => n.id === rel.demandId)
                    return (
                      <div
                        key={rel.id}
                        className="p-3 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-800">
                            {need?.position ?? '未知岗位'}
                          </span>
                          <Badge variant="outline" className={`text-xs ${stageColor[rel.stage]}`}>
                            {rel.stage}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{need?.departmentName}</span>
                          <span className="text-slate-300">|</span>
                          <span>{need?.bizLineName}</span>
                          <span className="text-slate-300">|</span>
                          <span>匹配度 {rel.matchScore}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 面试记录 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                面试记录
                <Badge variant="secondary" className="ml-auto text-xs">
                  {interviews.length} 轮
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暂无面试记录
                </p>
              ) : (
                <div className="space-y-3">
                  {interviews.map((iv) => (
                    <div
                      key={iv.id}
                      className="p-3 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200">
                            第{iv.round}轮
                          </Badge>
                          <span className="text-sm font-medium text-slate-700">
                            {iv.interviewer}
                          </span>
                          <Badge variant="outline" className={`text-xs ${resultColor[iv.result]}`}>
                            {resultIcon[iv.result]}
                            <span className="ml-1">{iv.result}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {iv.interviewTime}
                        </span>
                        <span>{iv.channel}</span>
                        <span>{iv.duration}分钟</span>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div className="text-center">
                          <span className="text-slate-400 block">技术</span>
                          <span className="font-bold text-indigo-600">{iv.technicalScore}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block">沟通</span>
                          <span className="font-bold text-indigo-600">{iv.communicationScore}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block">文化</span>
                          <span className="font-bold text-indigo-600">{iv.cultureScore}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block">综合</span>
                          <span className="font-bold text-amber-600">{iv.overallScore}</span>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {iv.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 薪资沟通 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                薪资沟通
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!salaryApproval ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暂无薪资审批记录
                </p>
              ) : (
                <div className="space-y-4">
                  {/* 薪资审批信息 */}
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {salaryApproval.position} - {salaryApproval.departmentName}
                      </span>
                      <Badge variant="outline" className={`text-xs ${approvalColor[salaryApproval.approvalStatus]}`}>
                        {salaryApproval.approvalStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">基本工资</span>
                        <p className="font-medium text-slate-700">
                          ¥{salaryApproval.proposedBaseSalary.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">绩效基数</span>
                        <p className="font-medium text-slate-700">
                          ¥{salaryApproval.proposedPerformanceBase.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">试用期工资</span>
                        <p className="font-medium text-slate-700">
                          ¥{salaryApproval.proposedProbationSalary.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">试岗天数</span>
                        <p className="font-medium text-slate-700">
                          {salaryApproval.trialPeriodDays}天
                        </p>
                      </div>
                    </div>
                    {salaryApproval.hrComment && (
                      <>
                        <Separator className="my-2" />
                        <div>
                          <span className="text-xs text-slate-400">HR 评语</span>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {salaryApproval.hrComment}
                          </p>
                        </div>
                      </>
                    )}
                    {salaryApproval.bossComment && (
                      <div className="mt-2">
                        <span className="text-xs text-slate-400">Boss 评语</span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {salaryApproval.bossComment}
                        </p>
                      </div>
                    )}
                    {salaryApproval.aiSuggestion && (
                      <>
                        <Separator className="my-2" />
                        <div className="p-2 rounded bg-indigo-50/80 border border-indigo-100">
                          <span className="text-xs font-semibold text-indigo-600">
                            AI 建议
                          </span>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {salaryApproval.aiSuggestion}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 沟通记录 */}
                  {salaryComms.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 mb-2">
                        沟通记录
                      </h4>
                      <div className="space-y-2">
                        {salaryComms.map((sc) => (
                          <div
                            key={sc.id}
                            className="p-2.5 rounded-lg border border-slate-100"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {sc.channel}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {sc.createdAt}
                              </span>
                              <span className="text-xs text-slate-400 ml-auto">
                                {sc.operator}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{sc.content}</p>
                            <p className="text-xs text-slate-500 mt-1 italic">
                              结果: {sc.result}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
