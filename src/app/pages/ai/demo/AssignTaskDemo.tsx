import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Separator } from '@/app/components/ui/separator'
import {
  Users,
  Send,
  RotateCcw,
  Star,
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  GripVertical,
  ChevronDown,
  FolderKanban,
  Briefcase,
} from 'lucide-react'
import { useAgentPipeline } from '@/app/components/agent'
import { CONTRACT_ANALYSIS, type AssigneeRecommendation, type WBSTask } from '@/app/components/agent/mockData'
import { motion, AnimatePresence } from 'motion/react'

function bandwidthColor(label: string) {
  switch (label) {
    case '充裕': return 'bg-green-100 text-green-700'
    case '适中': return 'bg-blue-100 text-blue-700'
    case '偏紧': return 'bg-amber-100 text-amber-700'
    case '饱和': return 'bg-red-100 text-red-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

function skillMatchColor(match: number) {
  if (match >= 90) return 'text-green-600'
  if (match >= 80) return 'text-blue-600'
  return 'text-amber-600'
}

interface TaskAssignment {
  taskId: string
  assigneeId: string | null
}

export function AssignTaskDemo() {
  const { status, result, submitAction, reset } = useAgentPipeline(CONTRACT_ANALYSIS, 2000)
  const [assignments, setAssignments] = useState<TaskAssignment[]>([])
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [assignedTaskIds, setAssignedTaskIds] = useState<Set<string>>(new Set())

  const wbsTasks = result?.suggestedWBS ?? []
  const assignees = result?.recommendedAssignees ?? []

  const handleSubmit = () => {
    submitAction()
    setTimeout(() => {
      const initialAssignments = (CONTRACT_ANALYSIS.suggestedWBS ?? []).map((task) => ({
        taskId: task.id,
        assigneeId: task.assignee === '张伟' ? 'user-1'
          : task.assignee === '李娜' ? 'user-2'
          : task.assignee === '王磊' ? 'user-3'
          : task.assignee === '赵敏' ? 'user-4'
          : 'user-5',
      }))
      setAssignments(initialAssignments)
    }, 2200)
  }

  const handleReset = () => {
    setAssignments([])
    setExpandedTaskId(null)
    setAssignedTaskIds(new Set())
    reset()
  }

  const handleAssign = (taskId: string, assigneeId: string) => {
    setAssignments((prev) => prev.map((a) => (a.taskId === taskId ? { ...a, assigneeId } : a)))
    setAssignedTaskIds((prev) => new Set(prev).add(taskId))
    setExpandedTaskId(null)
  }

  const getAssigneeForTask = (taskId: string) => {
    const assignment = assignments.find((a) => a.taskId === taskId)
    if (!assignment?.assigneeId) return undefined
    return assignees.find((a) => a.id === assignment.assigneeId)
  }

  const getRecommendedAssignee = (task: WBSTask) => assignees.find((a) => a.name === task.assignee)

  const totalAssigned = assignedTaskIds.size
  const totalTasks = wbsTasks.length

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">场景 C</Badge>
          <span className="text-sm text-slate-500">派工与员工 RPG 画像穿透</span>
        </div>
        <div className="flex gap-2">
          {status === 'idle' ? (
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              生成项目并派工
            </Button>
          ) : (
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          )}
        </div>
      </div>

      {/* 任务列表 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              项目任务派工面板
              {status === 'completed' && (
                <Badge className="bg-green-100 text-green-700 border-green-200 gap-1" variant="outline">
                  <CheckCircle2 className="h-3 w-3" />
                  Agent 已推荐人员
                </Badge>
              )}
            </CardTitle>
            {status === 'completed' && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">已指派</span>
                <Badge variant="secondary">{totalAssigned}/{totalTasks}</Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {status === 'idle' && (
            <div className="text-center py-16 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">点击"生成项目并派工"按钮</p>
              <p className="text-xs mt-1">Agent 将穿透员工 RPG 能力模型和工时负载，为每个任务智能推荐最匹配的工程师</p>
            </div>
          )}

          {status === 'analyzing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm text-indigo-700">Agent 正在穿透员工能力模型与工时数据...</span>
              </div>
            </motion.div>
          )}

          {status === 'completed' && wbsTasks.length > 0 && (
            <div className="space-y-2">
              {wbsTasks.map((task, index) => {
                const assigned = getAssigneeForTask(task.id)
                const recommended = getRecommendedAssignee(task)
                const isExpanded = expandedTaskId === task.id
                const isAssigned = assignedTaskIds.has(task.id)

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`border rounded-lg transition-all ${
                      isAssigned ? 'border-green-200 bg-green-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* 任务行 */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5">
                      <GripVertical className="h-4 w-4 text-slate-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-400">TSK-{String(index + 1).padStart(3, '0')}</span>
                          <span className="text-sm font-medium text-slate-700">{task.title}</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0 gap-1">
                            <Clock className="h-3 w-3" />{task.hours}h
                          </Badge>
                          {recommended && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0 bg-indigo-50 text-indigo-600 border-indigo-200">
                              <Sparkles className="h-3 w-3 mr-0.5" />推荐: {recommended.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {assigned && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border shrink-0">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">{assigned.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-slate-700">{assigned.name}</span>
                          <span className="text-xs text-slate-400">{assigned.level}</span>
                          {isAssigned && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 gap-1 px-2"
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      >
                        <span className="text-sm">指派</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>

                    {/* 展开区域 */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <Separator />
                          <div className="p-2.5 bg-slate-50">
                            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                              Agent 推荐（基于 RPG 技能匹配 + 工时饱和度 + 相似项目经验）
                            </p>

                            {/* 双列布局 */}
                            <div className="grid grid-cols-2 gap-2">
                              {assignees.map((person, pIdx) => {
                                const isRecommended = person.id === recommended?.id
                                const isCurrentAssignee = person.id === assigned?.id

                                return (
                                  <div
                                    key={person.id}
                                    className={`flex gap-2.5 p-2.5 rounded-md border cursor-pointer transition-all hover:shadow-sm ${
                                      isCurrentAssignee
                                        ? 'border-indigo-300 bg-indigo-50'
                                        : 'border-slate-200 bg-white hover:border-indigo-200'
                                    }`}
                                    onClick={() => handleAssign(task.id, person.id)}
                                  >
                                    {/* 左列：头像+排名 */}
                                    <div className="flex flex-col items-center shrink-0">
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                                        pIdx === 0 ? 'bg-amber-100 text-amber-700' :
                                        pIdx === 1 ? 'bg-slate-100 text-slate-500' :
                                        'bg-slate-50 text-slate-400'
                                      }`}>
                                        {pIdx + 1}
                                      </div>
                                      <Avatar className="h-9 w-9">
                                        <AvatarFallback className="text-sm bg-slate-100">{person.avatar}</AvatarFallback>
                                      </Avatar>
                                    </div>

                                    {/* 右列：信息 */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-semibold">{person.name}</span>
                                        <span className="text-xs text-slate-400">{person.level} {person.title}</span>
                                        {isRecommended && (
                                          <Badge className="text-[10px] px-1 py-0 bg-indigo-100 text-indigo-700 border-indigo-200" variant="outline">
                                            推荐
                                          </Badge>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2.5 mt-1">
                                        <div className="flex items-center gap-1">
                                          <Star className="h-3.5 w-3.5 text-amber-500" />
                                          <span className={`text-sm font-semibold ${skillMatchColor(person.skillMatch)}`}>
                                            {person.skillMatch}%
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Zap className="h-3.5 w-3.5 text-blue-500" />
                                          <span className="text-sm text-slate-500">{person.bandwidth}%</span>
                                          <Badge variant="outline" className={`text-xs px-1.5 py-0 ${bandwidthColor(person.bandwidthLabel)}`}>
                                            {person.bandwidthLabel}
                                          </Badge>
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {person.skills.slice(0, 4).map((skill) => (
                                          <Badge key={skill} variant="secondary" className="text-xs px-1.5 py-0">{skill}</Badge>
                                        ))}
                                      </div>

                                      {/* 相似项目 - 紧凑排列 */}
                                      {person.similarProjects && person.similarProjects.length > 0 && (
                                        <div className="mt-1.5 pt-1.5 border-t border-slate-100 space-y-0.5">
                                          {person.similarProjects.slice(0, 2).map((proj, pi) => (
                                            <div key={pi} className="flex items-center gap-1.5 text-xs">
                                              {proj.source === '公司项目' ? (
                                                <FolderKanban className="h-3 w-3 text-blue-400 shrink-0" />
                                              ) : (
                                                <Briefcase className="h-3 w-3 text-amber-400 shrink-0" />
                                              )}
                                              <span className="text-slate-600 truncate flex-1">{proj.name}</span>
                                              <Badge variant="outline" className={`text-[10px] px-1 py-0 shrink-0 ${
                                                proj.source === '公司项目'
                                                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                                                  : 'bg-amber-50 text-amber-600 border-amber-200'
                                              }`}>
                                                {proj.source === '公司项目' ? '公司' : '简历'}
                                              </Badge>
                                              <span className={`text-xs font-medium shrink-0 ${
                                                proj.similarity >= 80 ? 'text-green-600' :
                                                proj.similarity >= 60 ? 'text-blue-600' : 'text-slate-500'
                                              }`}>
                                                {proj.similarity}%
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {isCurrentAssignee && (
                                      <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 self-center" />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 底部统计 */}
      {status === 'completed' && wbsTasks.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-slate-800">{totalTasks}</div><div className="text-xs text-slate-500">总任务数</div></CardContent></Card>
          <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-indigo-600">{totalAssigned}</div><div className="text-xs text-slate-500">已指派</div></CardContent></Card>
          <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-slate-800">{wbsTasks.reduce((s, t) => s + t.hours, 0)}h</div><div className="text-xs text-slate-500">总工时</div></CardContent></Card>
          <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-green-600">{assignees.length > 0 ? Math.round(assignees.reduce((s, a) => s + a.skillMatch, 0) / assignees.length) : 0}%</div><div className="text-xs text-slate-500">平均匹配度</div></CardContent></Card>
        </div>
      )}
    </div>
  )
}
