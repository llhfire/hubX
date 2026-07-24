import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  User,
  FileText,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Plus,
  Headphones,
} from 'lucide-react';
import { useEmployee } from '../employee/EmployeeContext';
import {
  ABILITY_DIMENSION_LABELS,
  ABILITY_DIMENSION_COLORS,
  calcPromotionProgress,
  getLevelColor,
  formatCurrency,
  AbilityDimension,
} from '../employee/mockData';

// 小型雷达图（工作台用，更紧凑）
function MiniRadar({ scores, size = 160 }: { scores: { tech: number; biz: number; mgmt: number; tool: number; domain: number }; size?: number }) {
  const dims: AbilityDimension[] = ['tech', 'biz', 'mgmt', 'tool', 'domain'];
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;
  const angleFor = (i: number) => (Math.PI * 2 * i) / 5 - Math.PI / 2;

  const gridPolygons = Array.from({ length: 4 }, (_, lv) => {
    const r = (radius * (lv + 1)) / 4;
    return dims.map((_, i) => { const a = angleFor(i); return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(' ');
  });

  const dataPts = dims.map((d, i) => {
    const a = angleFor(i);
    const r = (radius * scores[d]) / 100;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridPolygons.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke="hsl(var(--border))" strokeOpacity={0.3} />)}
      {dims.map((_, i) => { const a = angleFor(i); return <line key={i} x1={cx} y1={cy} x2={cx + radius * Math.cos(a)} y2={cy + radius * Math.sin(a)} stroke="hsl(var(--border))" strokeOpacity={0.2} />; })}
      <polygon points={dataPts} fill="hsl(var(--primary))" fillOpacity={0.15} stroke="hsl(var(--primary))" strokeWidth={1.5} />
      {dims.map((d, i) => {
        const a = angleFor(i);
        const r = (radius * scores[d]) / 100;
        return <circle key={d} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={2.5} fill="hsl(var(--primary))" />;
      })}
    </svg>
  );
}

// 模拟任务数据
interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  type: 'personal' | 'team';
  done: boolean;
}

const mockTasks: Task[] = [
  { id: 't1', title: '完成 CRM 看板前端开发', priority: 'high',   dueDate: '2026-07-05', type: 'team',     done: false },
  { id: 't2', title: 'Q2 绩效自评报告',       priority: 'high',   dueDate: '2026-07-03', type: 'personal', done: false },
  { id: 't3', title: '客户 A 项目需求评审',    priority: 'medium', dueDate: '2026-07-06', type: 'team',     done: false },
  { id: 't4', title: '更新技术文档',           priority: 'low',    dueDate: '2026-07-08', type: 'personal', done: true  },
  { id: 't5', title: '新人带教：代码规范培训',  priority: 'medium', dueDate: '2026-07-07', type: 'team',     done: false },
  { id: 't6', title: '填写本周日报',           priority: 'high',   dueDate: '2026-07-02', type: 'personal', done: false },
];

// 模拟项目数据
const mockProjects = [
  { id: 'proj-1', name: 'CRM 系统升级', role: '项目经理', progress: 65, status: '进行中' },
  { id: 'proj-2', name: '客户 A 小程序', role: '技术负责人', progress: 80, status: '验收中' },
  { id: 'proj-3', name: '投放数据看板', role: '核心开发', progress: 30, status: '进行中' },
];

// 模拟日报提醒
const mockDailyReportReminder = {
  submitted: false,
  date: '2026-07-02',
  streakDays: 5,
};

// 优先级 Badge 样式
function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  if (priority === 'high') return <Badge variant="destructive">高</Badge>;
  if (priority === 'medium') return <Badge className="bg-orange-500 text-white hover:bg-orange-600">中</Badge>;
  return <Badge variant="secondary">低</Badge>;
}

// 状态 Badge 样式
function StatusBadge({ done }: { done: boolean }) {
  return done
    ? <Badge className="bg-green-500 text-white hover:bg-green-600">已完成</Badge>
    : <Badge className="bg-orange-500 text-white hover:bg-orange-600">待办</Badge>;
}

export function PersonalWorkbench() {
  const navigate = useNavigate();
  const { employees, skillTrees } = useEmployee();
  const [activeTab, setActiveTab] = useState('overview');

  // 当前登录员工（模拟为张三 id=1）
  const currentEmployee = employees.find(e => e.id === '1');
  const cap = currentEmployee?.capability;
  const personality = currentEmployee?.personality;

  const stats = useMemo(() => {
    const pendingTasks = mockTasks.filter(t => !t.done).length;
    const todayTasks = mockTasks.filter(t => !t.done && t.dueDate <= '2026-07-03').length;
    const myProjects = mockProjects.length;
    return { pendingTasks, todayTasks, myProjects };
  }, []);

  // 下一个可解锁技能
  const nextSkill = useMemo(() => {
    if (!cap) return null;
    const locked = cap.skills.find(s => s.status === 'locked');
    if (!locked) return null;
    return skillTrees.find(s => s.id === locked.id);
  }, [cap, skillTrees]);

  if (!currentEmployee) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 顶部欢迎栏 */}
      <Card className="border-0" style={{ background: 'linear-gradient(135deg, rgba(22,93,255,0.06), rgba(0,180,42,0.04))' }}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 text-white">
                  {currentEmployee.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold m-0">早上好，{currentEmployee.name}</h2>
                <span className="text-sm text-muted-foreground">
                  {currentEmployee.department} · {currentEmployee.position} · {currentEmployee.level}
                  {personality?.mbti && (
                    <Badge className="ml-2 bg-purple-600 text-white hover:bg-purple-700">
                      {personality.mbti.type}
                    </Badge>
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/dailyreport/list')}>
                <Edit className="mr-2 h-4 w-4" /> 填写日报
              </Button>
              <Button variant="outline" onClick={() => navigate('/leads/public')}>
                <Plus className="mr-2 h-4 w-4" /> 新建线索
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 核心指标 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              待办任务
            </div>
            <div className="text-2xl font-bold mt-1">
              {stats.pendingTasks}
              <span className="text-sm font-normal text-muted-foreground ml-1">项</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              今日到期
            </div>
            <div className="text-2xl font-bold mt-1">
              {stats.todayTasks}
              <span className="text-sm font-normal text-muted-foreground ml-1">项</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              参与项目
            </div>
            <div className="text-2xl font-bold mt-1">
              {stats.myProjects}
              <span className="text-sm font-normal text-muted-foreground ml-1">个</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-orange-500" />
              加权总分
            </div>
            <div className="text-2xl font-bold mt-1">
              {cap?.weightedScore || 0}
              <span className="text-sm font-normal text-muted-foreground ml-1">分</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-600" />
              已解锁技能
            </div>
            <div className="text-2xl font-bold mt-1">
              {cap?.skills.filter(s => s.status === 'unlocked').length || 0}
              <span className="text-sm font-normal text-muted-foreground ml-1">个</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {mockDailyReportReminder.submitted
                ? <CheckCircle className="h-4 w-4 text-green-500" />
                : <AlertCircle className="h-4 w-4 text-red-500" />}
              日报状态
            </div>
            <div className="text-2xl font-bold mt-1">
              {mockDailyReportReminder.submitted ? '已提交' : '未提交'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主体 Tab */}
      <Card className="border-0">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview"><User className="mr-1 h-4 w-4" /> 概览</TabsTrigger>
              <TabsTrigger value="tasks"><CheckCircle className="mr-1 h-4 w-4" /> 任务清单</TabsTrigger>
              <TabsTrigger value="capability"><Trophy className="mr-1 h-4 w-4" /> 能力面板</TabsTrigger>
              <TabsTrigger value="projects"><FileText className="mr-1 h-4 w-4" /> 我的项目</TabsTrigger>
            </TabsList>

            {/* 概览 Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-[10fr_14fr] gap-4 pt-4">
                <div className="flex flex-col gap-3">
                  {/* 能力雷达图 */}
                  {cap && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">能力雷达图</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-center py-4">
                        <MiniRadar scores={cap.scores} size={220} />
                      </CardContent>
                    </Card>
                  )}

                  {/* 晋级进度 */}
                  {cap && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">晋级进度</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{currentEmployee.level}</span>
                          <span className="text-muted-foreground">→ {`L${parseInt(currentEmployee.level.replace('L', '')) + 1}`}</span>
                        </div>
                        <Progress
                          value={calcPromotionProgress(cap.weightedScore, currentEmployee.level)}
                          className={cap.promotionEligible ? '[&>div]:bg-green-500' : ''}
                        />
                        <div className="text-xs text-muted-foreground mt-2">
                          加权总分 {cap.weightedScore} 分
                          {cap.promotionEligible && (
                            <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600">可晋级</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {/* 快捷入口 */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">快捷入口</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { icon: <Edit className="h-5 w-5" />, label: '填写日报', color: 'text-blue-600', borderColor: 'border-blue-600/30', action: () => navigate('/dailyreport/list') },
                          { icon: <Plus className="h-5 w-5" />, label: '新建线索', color: 'text-green-600', borderColor: 'border-green-600/30', action: () => navigate('/leads/public') },
                          { icon: <FileText className="h-5 w-5" />, label: '查看合同', color: 'text-orange-500', borderColor: 'border-orange-500/30', action: () => navigate('/contracts') },
                          { icon: <Headphones className="h-5 w-5" />, label: '我的线索', color: 'text-purple-600', borderColor: 'border-purple-600/30', action: () => navigate('/leads/my') },
                        ].map(btn => (
                          <Button
                            key={btn.label}
                            variant="outline"
                            className={`h-[72px] flex flex-col gap-1 ${btn.color} ${btn.borderColor}`}
                            onClick={btn.action}
                          >
                            {btn.icon}
                            <span className="text-xs">{btn.label}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 待办任务 */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        待办任务
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                          {stats.pendingTasks}
                        </span>
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('tasks')}>
                        查看全部 <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-col">
                        {mockTasks.filter(t => !t.done).slice(0, 4).map((task: Task) => (
                          <div
                            key={task.id}
                            className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                          >
                            <div className="flex items-center gap-2">
                              <PriorityBadge priority={task.priority} />
                              <span className="text-[13px]">{task.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 任务清单 Tab */}
            <TabsContent value="tasks">
              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Badge>全部 {mockTasks.length}</Badge>
                    <Badge variant="secondary">待办 {mockTasks.filter(t => !t.done).length}</Badge>
                    <Badge className="bg-green-500 text-white hover:bg-green-600">已完成 {mockTasks.filter(t => t.done).length}</Badge>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> 新建任务
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[70px]">优先级</TableHead>
                      <TableHead>任务</TableHead>
                      <TableHead className="w-[80px]">类型</TableHead>
                      <TableHead className="w-[110px]">截止日期</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTasks.map((task: Task) => (
                      <TableRow key={task.id}>
                        <TableCell><PriorityBadge priority={task.priority} /></TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.type === 'personal' ? '个人' : '团队'}</Badge>
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell><StatusBadge done={task.done} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 能力面板 Tab */}
            <TabsContent value="capability">
              {cap && (
                <div className="grid grid-cols-[10fr_14fr] gap-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">五维能力</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {(Object.keys(cap.scores) as AbilityDimension[]).map(dim => (
                        <div key={dim} className="mb-3.5 last:mb-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-[13px] font-semibold" style={{ color: ABILITY_DIMENSION_COLORS[dim] }}>
                              {ABILITY_DIMENSION_LABELS[dim]}
                            </span>
                            <span className="text-[13px] font-bold">{cap.scores[dim]}</span>
                          </div>
                          <Progress
                            value={cap.scores[dim]}
                            style={{ '--progress-color': ABILITY_DIMENSION_COLORS[dim] } as React.CSSProperties}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">技能掌握</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex gap-2 mb-4">
                        <Badge className="bg-green-500 text-white hover:bg-green-600">
                          已解锁 {cap.skills.filter(s => s.status === 'unlocked').length}
                        </Badge>
                        <Badge variant="secondary">
                          待解锁 {cap.skills.filter(s => s.status === 'locked').length}
                        </Badge>
                      </div>
                      {nextSkill && (
                        <Card className="bg-muted mb-3">
                          <CardContent className="p-3 px-3.5">
                            <div className="text-xs text-muted-foreground">下一个可解锁技能</div>
                            <div className="font-semibold mt-1">
                              {nextSkill.name}
                              <Badge
                                className="ml-2"
                                style={{ backgroundColor: ABILITY_DIMENSION_COLORS[nextSkill.domain], color: '#fff' }}
                              >
                                {ABILITY_DIMENSION_LABELS[nextSkill.domain]}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{nextSkill.description}</div>
                          </CardContent>
                        </Card>
                      )}
                      <div className="max-h-[240px] overflow-auto">
                        {cap.skills.filter(s => s.status === 'unlocked').slice(0, 8).map(s => {
                          const node = skillTrees.find(n => n.id === s.id);
                          return (
                            <div
                              key={s.id}
                              className="flex justify-between py-1.5 border-b border-border last:border-b-0"
                            >
                              <span className="text-[13px]">{node?.name || s.id}</span>
                              <Badge
                                className={
                                  s.mastery === 'expert'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : s.mastery === 'proficient'
                                      ? ''
                                      : 'bg-gray-400 text-white hover:bg-gray-500'
                                }
                                variant={s.mastery === 'proficient' ? 'default' : undefined}
                              >
                                {s.mastery === 'expert' ? '精通' : s.mastery === 'proficient' ? '熟练' : '入门'}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* 我的项目 Tab */}
            <TabsContent value="projects">
              <div className="grid grid-cols-3 gap-4 pt-4">
                {mockProjects.map(p => (
                  <Card key={p.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{p.name}</span>
                        <Badge className={p.status === '验收中' ? 'bg-green-500 text-white hover:bg-green-600' : ''}>
                          {p.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">角色：{p.role}</div>
                      <Progress value={p.progress} />
                      <div className="text-[11px] text-muted-foreground mt-1">{p.progress}% 完成</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
