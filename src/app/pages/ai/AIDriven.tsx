import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import {
  LayoutGrid,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  FlaskConical,
  ArrowRight,
  Send,
  Folder,
} from 'lucide-react';

// ---------- 类型 ----------

interface AutoTask {
  id: string;
  title: string;
  phase: string;
  estimatedDays: number;
  requiredSkills: string[];
  suggestedAssignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'assigned' | 'in_progress';
}

interface PersonnelMatch {
  taskTitle: string;
  candidates: {
    name: string;
    matchScore: number;
    skills: string[];
    currentLoad: number;  // 0-100
    availability: 'available' | 'busy' | 'full';
  }[];
}

interface MilestoneReminder {
  id: string;
  projectName: string;
  milestone: string;
  dueDate: string;
  daysUntil: number;
  risk: 'high' | 'medium' | 'low';
  suggestion: string;
}

interface AutoMeeting {
  id: string;
  projectName: string;
  phase: string;
  suggestedType: string;
  suggestedDate: string;
  attendees: string[];
  agenda: string;
  status: 'suggested' | 'confirmed' | 'dismissed';
}

// ---------- 模拟数据 ----------

const mockAutoTasks: AutoTask[] = [
  { id: 'at-1', title: '需求调研与客户沟通',     phase: '需求分析', estimatedDays: 5,  requiredSkills: ['需求分析', '客户沟通'],    suggestedAssignee: '林小红', priority: 'high',   status: 'assigned' },
  { id: 'at-2', title: '系统架构设计',           phase: '方案设计', estimatedDays: 7,  requiredSkills: ['系统设计', '架构'],        suggestedAssignee: '李四',   priority: 'high',   status: 'pending' },
  { id: 'at-3', title: 'UI 界面设计',            phase: '方案设计', estimatedDays: 10, requiredSkills: ['Figma', 'UI设计'],          suggestedAssignee: '陈明',   priority: 'medium', status: 'pending' },
  { id: 'at-4', title: '前端页面开发',           phase: '开发',     estimatedDays: 15, requiredSkills: ['React', '前端开发'],        suggestedAssignee: '黄丽',   priority: 'high',   status: 'pending' },
  { id: 'at-5', title: '后端 API 开发',          phase: '开发',     estimatedDays: 15, requiredSkills: ['Java', '后端开发'],         suggestedAssignee: '李四',   priority: 'high',   status: 'pending' },
  { id: 'at-6', title: '数据库设计与实现',       phase: '开发',     estimatedDays: 5,  requiredSkills: ['数据库', '后端开发'],       suggestedAssignee: '李四',   priority: 'medium', status: 'pending' },
  { id: 'at-7', title: '系统集成测试',           phase: '测试',     estimatedDays: 7,  requiredSkills: ['测试验收'],               suggestedAssignee: '赵六',   priority: 'medium', status: 'pending' },
  { id: 'at-8', title: '用户验收测试（UAT）',    phase: '验收',     estimatedDays: 5,  requiredSkills: ['客户沟通', '测试验收'],     suggestedAssignee: '张三',   priority: 'high',   status: 'pending' },
];

const mockPersonnelMatches: PersonnelMatch[] = [
  {
    taskTitle: '前端页面开发',
    candidates: [
      { name: '黄丽', matchScore: 95, skills: ['React', 'TypeScript', '前端开发'], currentLoad: 60, availability: 'available' },
      { name: '王五', matchScore: 78, skills: ['React', '前端开发'],                currentLoad: 85, availability: 'busy' },
    ],
  },
  {
    taskTitle: '后端 API 开发',
    candidates: [
      { name: '李四', matchScore: 92, skills: ['Java', 'Spring Boot', '后端开发'], currentLoad: 70, availability: 'available' },
      { name: '赵六', matchScore: 65, skills: ['Python', '后端开发'],               currentLoad: 45, availability: 'available' },
    ],
  },
  {
    taskTitle: 'UI 界面设计',
    candidates: [
      { name: '陈明', matchScore: 98, skills: ['Figma', 'UI设计', '原型设计'],      currentLoad: 50, availability: 'available' },
      { name: '杨帆', matchScore: 40, skills: ['UI设计'],                           currentLoad: 30, availability: 'available' },
    ],
  },
];

const mockMilestones: MilestoneReminder[] = [
  { id: 'ms-1', projectName: '云服务平台项目', milestone: '需求评审',     dueDate: '2026-07-05', daysUntil: 3,  risk: 'medium', suggestion: '建议提前准备需求文档，预约会议室 A' },
  { id: 'ms-2', projectName: '医疗健康 APP',  milestone: 'UI设计评审',  dueDate: '2026-07-08', daysUntil: 6,  risk: 'low',    suggestion: '陈明已完成初稿，建议安排评审' },
  { id: 'ms-3', projectName: '云服务平台项目', milestone: '第一阶段交付', dueDate: '2026-07-10', daysUntil: 8,  risk: 'high',   suggestion: '后端开发进度滞后 2 天，建议增加人手或调整排期' },
  { id: 'ms-4', projectName: '电商平台小程序', milestone: '验收测试',     dueDate: '2026-07-12', daysUntil: 10, risk: 'medium', suggestion: '建议提前准备验收清单，通知客户参与' },
  { id: 'ms-5', projectName: '智能制造 MES',  milestone: '合同回款节点', dueDate: '2026-07-15', daysUntil: 13, risk: 'high',   suggestion: '第三期回款节点临近，建议提前联系客户确认付款' },
];

const mockAutoMeetings: AutoMeeting[] = [
  { id: 'am-1', projectName: '云服务平台项目', phase: '需求分析', suggestedType: '需求评审会',     suggestedDate: '2026-07-03 14:00', attendees: ['徐强', '李四', '林小红', '张三'], agenda: '需求文档评审、技术方案讨论', status: 'suggested' },
  { id: 'am-2', projectName: '医疗健康 APP',  phase: '方案设计', suggestedType: '设计评审会',     suggestedDate: '2026-07-05 10:00', attendees: ['陈明', '徐强', '林小红'],           agenda: 'UI设计稿评审、交互确认',   status: 'suggested' },
  { id: 'am-3', projectName: '电商平台小程序', phase: '开发',     suggestedType: 'Sprint 计划会',  suggestedDate: '2026-07-04 09:30', attendees: ['李四', '赵六', '陈明'],               agenda: 'Sprint 2 任务分配',        status: 'confirmed' },
  { id: 'am-4', projectName: '云服务平台项目', phase: '开发',     suggestedType: '中期检查会',     suggestedDate: '2026-07-08 10:00', attendees: ['徐强', '李四', '黄丽'],               agenda: '开发进度检查、问题协调',   status: 'suggested' },
];

// ---------- 主组件 ----------

export function AIDriven() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [autoMeetings, setAutoMeetings] = useState(mockAutoMeetings);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<PersonnelMatch | null>(null);

  const summary = useMemo(() => {
    const totalTasks = mockAutoTasks.length;
    const assigned = mockAutoTasks.filter(t => t.status === 'assigned' || t.status === 'in_progress').length;
    const highRiskMilestones = mockMilestones.filter(m => m.risk === 'high').length;
    const suggestedMeetings = autoMeetings.filter(m => m.status === 'suggested').length;
    return { totalTasks, assigned, highRiskMilestones, suggestedMeetings };
  }, [autoMeetings]);

  const handleConfirmMeeting = (id: string) => {
    setAutoMeetings(prev => prev.map(m => m.id === id ? { ...m, status: 'confirmed' as const } : m));
  };

  const handleDismissMeeting = (id: string) => {
    setAutoMeetings(prev => prev.map(m => m.id === id ? { ...m, status: 'dismissed' as const } : m));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 顶部摘要 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">AI 拆解任务</div>
            <div className="text-2xl font-bold mt-1">{summary.totalTasks}个</div>
            <LayoutGrid className="absolute top-4 right-4 h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">已分配</div>
            <div className="text-2xl font-bold mt-1">{summary.assigned}个</div>
            <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">高风险节点</div>
            <div className="text-2xl font-bold mt-1 text-red-500">{summary.highRiskMilestones}个</div>
            <AlertCircle className="absolute top-4 right-4 h-5 w-5 text-red-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">待确认会议</div>
            <div className="text-2xl font-bold mt-1">{summary.suggestedMeetings}场</div>
            <Calendar className="absolute top-4 right-4 h-5 w-5 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">人员匹配</div>
            <div className="text-2xl font-bold mt-1">{mockPersonnelMatches.length}项</div>
            <User className="absolute top-4 right-4 h-5 w-5 text-violet-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">AI 建议</div>
            <div className="text-2xl font-bold mt-1">{mockMilestones.length}条</div>
            <FlaskConical className="absolute top-4 right-4 h-5 w-5 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* 主体 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="tasks"><LayoutGrid className="mr-1 h-4 w-4 inline" /> 智能任务拆解</TabsTrigger>
              <TabsTrigger value="personnel"><User className="mr-1 h-4 w-4 inline" /> 智能人员分配</TabsTrigger>
              <TabsTrigger value="milestones">
                <Clock className="mr-1 h-4 w-4 inline" /> 智能跟进提醒
                {summary.highRiskMilestones > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white">{summary.highRiskMilestones}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="meetings">
                <Calendar className="mr-1 h-4 w-4 inline" /> 智能会议安排
                {summary.suggestedMeetings > 0 && (
                  <Badge className="ml-1 bg-amber-500 text-white">{summary.suggestedMeetings}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="pt-4">
              {/* 智能任务拆解 Tab */}
              <TabsContent value="tasks">
                <Alert className="mb-4">
                  <FlaskConical className="h-4 w-4" />
                  <AlertDescription>
                    AI 根据合同 SOW 自动拆解项目任务，估算工期，并推荐最佳人员。
                  </AlertDescription>
                </Alert>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>任务</TableHead>
                      <TableHead>阶段</TableHead>
                      <TableHead>预估工期</TableHead>
                      <TableHead>所需技能</TableHead>
                      <TableHead>推荐人员</TableHead>
                      <TableHead>优先级</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAutoTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-semibold">{task.title}</TableCell>
                        <TableCell><Badge variant="secondary">{task.phase}</Badge></TableCell>
                        <TableCell>{task.estimatedDays}天</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.requiredSkills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                          </div>
                        </TableCell>
                        <TableCell><Badge className="bg-purple-500 text-white">{task.suggestedAssignee}</Badge></TableCell>
                        <TableCell>
                          <Badge className={`font-semibold ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-primary' : 'bg-muted-foreground'} text-white`}>
                            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const statusMap: Record<string, { label: string; className: string }> = {
                              pending: { label: '待分配', className: 'bg-muted-foreground' },
                              assigned: { label: '已分配', className: 'bg-primary' },
                              in_progress: { label: '进行中', className: 'bg-green-500' },
                            };
                            const s = statusMap[task.status] || statusMap.pending;
                            return <Badge className={`${s.className} text-white`}>{s.label}</Badge>;
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* 智能人员分配 Tab */}
              <TabsContent value="personnel">
                <Alert className="mb-4">
                  <User className="h-4 w-4" />
                  <AlertDescription>
                    AI 根据员工技能树、能力值和当前负载，为每个任务推荐最佳人选。
                  </AlertDescription>
                </Alert>
                {mockPersonnelMatches.map(match => (
                  <Card key={match.taskTitle} className="mb-3">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-semibold"><Send className="mr-1 h-4 w-4 inline" /> {match.taskTitle}</h3>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedMatch(match); setDetailModalVisible(true); }}>查看详情</Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {match.candidates.map(c => (
                          <Card key={c.name} className={c.matchScore >= 90 ? 'border-2 border-green-500' : ''}>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{c.name.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold">{c.name}</div>
                                  <Badge className={`text-xs ${c.matchScore >= 90 ? 'bg-green-500' : c.matchScore >= 70 ? 'bg-amber-500' : 'bg-muted-foreground'} text-white`}>
                                    匹配度 {c.matchScore}%
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-xs mb-1">
                                <span className="text-muted-foreground">负载：</span>
                                <span className={c.currentLoad > 80 ? 'text-red-500' : c.currentLoad > 60 ? 'text-amber-500' : 'text-green-500'}>{c.currentLoad}%</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                技能：{c.skills.join('、')}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* 智能跟进提醒 Tab */}
              <TabsContent value="milestones">
                {mockMilestones.filter(m => m.risk === 'high').length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      检测到 {mockMilestones.filter(m => m.risk === 'high').length} 个高风险节点，建议立即处理。
                    </AlertDescription>
                  </Alert>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>风险</TableHead>
                      <TableHead>项目</TableHead>
                      <TableHead>里程碑</TableHead>
                      <TableHead>截止日期</TableHead>
                      <TableHead>剩余天数</TableHead>
                      <TableHead>AI 建议</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMilestones.map((ms) => (
                      <TableRow key={ms.id}>
                        <TableCell>
                          <Badge className={`font-semibold ${ms.risk === 'high' ? 'bg-red-500' : ms.risk === 'medium' ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                            {ms.risk === 'high' ? '高' : ms.risk === 'medium' ? '中' : '低'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{ms.projectName}</TableCell>
                        <TableCell>{ms.milestone}</TableCell>
                        <TableCell>{ms.dueDate}</TableCell>
                        <TableCell>
                          <span className={ms.daysUntil <= 5 ? 'text-red-500 font-semibold' : ms.daysUntil <= 10 ? 'text-amber-500' : ''}>{ms.daysUntil} 天</span>
                        </TableCell>
                        <TableCell>{ms.suggestion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* 智能会议安排 Tab */}
              <TabsContent value="meetings">
                <Alert className="mb-4">
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    AI 根据项目阶段自动推荐需要召开的会议，并建议参会人和议程。
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-4">
                  {autoMeetings.map(meeting => (
                    <Card
                      key={meeting.id}
                      className={meeting.status === 'dismissed' ? 'opacity-50' : ''}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm"><Calendar className="mr-1 h-4 w-4 inline" /> {meeting.suggestedType}</CardTitle>
                          {meeting.status === 'confirmed'
                            ? <Badge className="bg-green-500 text-white">已确认</Badge>
                            : meeting.status === 'dismissed'
                              ? <Badge variant="secondary">已忽略</Badge>
                              : <Badge className="bg-amber-500 text-white">AI 建议</Badge>
                          }
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground mb-1">
                          <Folder className="mr-1 h-3 w-3 inline" /> {meeting.projectName} · {meeting.phase}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          <Clock className="mr-1 h-3 w-3 inline" /> {meeting.suggestedDate}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex -space-x-1">
                            {meeting.attendees.slice(0, 5).map(a => (
                              <Avatar key={a} className="h-5 w-5">
                                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">{a.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="ml-1 text-muted-foreground text-[11px]">{meeting.attendees.join('、')}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          <FileText className="mr-1 h-3 w-3 inline" /> {meeting.agenda}
                        </div>
                        {meeting.status === 'suggested' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleConfirmMeeting(meeting.id)}>确认安排</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDismissMeeting(meeting.id)}>忽略</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* 人员匹配详情弹窗 */}
      <Dialog open={detailModalVisible} onOpenChange={setDetailModalVisible}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedMatch ? `「${selectedMatch.taskTitle}」人员匹配详情` : ''}</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <div className="space-y-4 mt-2">
              {selectedMatch.candidates.map((c, idx) => (
                <div key={c.name} className="relative pl-6">
                  {/* Timeline dot and line */}
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-primary bg-background">
                    {idx === 0 && <CheckCircle className="absolute -left-[3px] -top-[3px] h-[18px] w-[18px] text-green-500" />}
                  </div>
                  {idx < selectedMatch.candidates.length - 1 && (
                    <div className="absolute left-[5px] top-4 w-[2px] h-full bg-border" />
                  )}
                  <div className="text-xs text-muted-foreground mb-1">{c.matchScore}% 匹配</div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    技能：{c.skills.join('、')} | 当前负载：{c.currentLoad}%
                  </div>
                  <Progress
                    value={c.matchScore}
                    className={`mt-1 ${c.matchScore >= 90 ? '[&>div]:bg-green-500' : '[&>div]:bg-amber-500'}`}
                  />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
