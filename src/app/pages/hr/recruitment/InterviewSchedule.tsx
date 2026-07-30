import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  MessageSquare,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import {
  CANDIDATES,
  CANDIDATE_DEMAND_RELATIONS,
  RECRUITMENT_NEEDS,
  INTERVIEW_RECORDS,
} from '../mockData'

const channelIcon: Record<string, typeof Video> = {
  '视频': Video,
  '电话': Phone,
  '现场': MapPin,
  '微信': MessageSquare,
}

const resultBadgeClass: Record<string, string> = {
  '通过': 'bg-green-100 text-green-700 border-green-200',
  '待定': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '未通过': 'bg-red-100 text-red-700 border-red-200',
}

function getCandidateName(candidateId: string): string {
  return CANDIDATES.find((c) => c.id === candidateId)?.name ?? '未知'
}

function getDemandPosition(demandId: string): string {
  return RECRUITMENT_NEEDS.find((r) => r.id === demandId)?.position ?? '未知'
}

function getDemandDepartment(demandId: string): string {
  return RECRUITMENT_NEEDS.find((r) => r.id === demandId)?.departmentName ?? ''
}

export function InterviewSchedule() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upcoming')

  // 待面试：筛选 stage === '面试中' 的候选人关联
  const upcomingInterviews = useMemo(() => {
    return CANDIDATE_DEMAND_RELATIONS.filter((rel) => rel.stage === '面试中').map((rel) => {
      const candidate = CANDIDATES.find((c) => c.id === rel.candidateId)
      const demand = RECRUITMENT_NEEDS.find((r) => r.id === rel.demandId)
      // 获取该候选人最新的面试记录
      const latestRecord = [...INTERVIEW_RECORDS]
        .filter((ir) => ir.candidateId === rel.candidateId && ir.demandId === rel.demandId)
        .sort((a, b) => b.round - a.round)[0]
      return { relation: rel, candidate, demand, latestRecord }
    })
  }, [])

  // 已完成：所有面试记录
  const completedInterviews = useMemo(() => {
    return [...INTERVIEW_RECORDS].sort((a, b) => {
      // 按时间倒序
      if (a.interviewTime > b.interviewTime) return -1
      if (a.interviewTime < b.interviewTime) return 1
      return 0
    })
  }, [])

  const handleArrangeInterview = () => {
    toast.success('已打开面试安排表单', {
      description: '请选择候选人、面试官和时间',
      position: 'top-right',
    })
  }

  return (
    <div className="space-y-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1)
              } else {
                navigate('/hr/candidates')
              }
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800">面试管理</h1>
        </div>
        <Button className="gap-2" onClick={handleArrangeInterview}>
          <Plus className="h-4 w-4" />
          安排面试
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{upcomingInterviews.length}</p>
              <p className="text-xs text-muted-foreground">待面试</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {completedInterviews.filter((r) => r.result === '通过').length}
              </p>
              <p className="text-xs text-muted-foreground">已通过</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {completedInterviews.filter((r) => r.result === '待定').length}
              </p>
              <p className="text-xs text-muted-foreground">待定</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <User className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {completedInterviews.filter((r) => r.result === '未通过').length}
              </p>
              <p className="text-xs text-muted-foreground">未通过</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">待面试</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList>

        {/* 待面试 */}
        <TabsContent value="upcoming" className="space-y-3 mt-3">
          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                暂无待面试候选人
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcomingInterviews.map(({ relation, candidate, demand, latestRecord }) => (
                <Card
                  key={relation.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/hr/candidates/${relation.candidateId}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                          {candidate?.name?.[0] ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-base">
                            {candidate?.name ?? '未知'}
                          </span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            面试中
                          </Badge>
                        </div>

                        <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {demand?.position ?? '未知'} · {demand?.departmentName ?? ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {latestRecord
                                ? `第${latestRecord.round}轮 · ${latestRecord.interviewTime}`
                                : '暂无面试安排'}
                            </span>
                          </div>
                          {candidate?.parsedResume && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                {candidate.parsedResume.lastCompany} ·{' '}
                                {candidate.parsedResume.workYears}年经验 ·{' '}
                                {candidate.parsedResume.education}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="outline" className="text-xs">
                            匹配度 {relation.matchScore}%
                          </Badge>
                          {latestRecord && (
                            <Badge variant="outline" className={resultBadgeClass[latestRecord.result]}>
                              {latestRecord.result}
                            </Badge>
                          )}
                          {candidate?.source && (
                            <Badge variant="secondary" className="text-xs">
                              {candidate.source}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 已完成 */}
        <TabsContent value="completed" className="mt-3">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>候选人</TableHead>
                    <TableHead>应聘岗位</TableHead>
                    <TableHead>轮次</TableHead>
                    <TableHead>面试官</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>面试渠道</TableHead>
                    <TableHead>综合评分</TableHead>
                    <TableHead>结果</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedInterviews.map((record) => {
                    const ChannelIcon = channelIcon[record.channel] ?? Video
                    return (
                      <TableRow
                        key={record.id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => navigate(`/hr/candidates/${record.candidateId}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs bg-slate-100">
                                {getCandidateName(record.candidateId)[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {getCandidateName(record.candidateId)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">
                              {getDemandPosition(record.demandId)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1.5">
                              {getDemandDepartment(record.demandId)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">第{record.round}轮</Badge>
                        </TableCell>
                        <TableCell>{record.interviewer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.interviewTime}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{record.channel}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-semibold ${
                                record.overallScore >= 8
                                  ? 'text-green-600'
                                  : record.overallScore >= 6
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {record.overallScore}
                            </span>
                            <span className="text-xs text-muted-foreground">/10</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={resultBadgeClass[record.result]}
                          >
                            {record.result}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {completedInterviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        暂无面试记录
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
