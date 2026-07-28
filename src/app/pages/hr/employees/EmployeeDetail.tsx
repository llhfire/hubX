import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { Progress } from '@/app/components/ui/progress'
import { Separator } from '@/app/components/ui/separator'
import {
  User,
  FileText,
  Clock,
  TrendingUp,
  Wallet,
  CalendarDays,
  Building2,
  Briefcase,
  ChevronRight,
  FlaskConical,
  Trophy,
  Star,
  Zap,
  Lock,
  CheckCircle2,
} from 'lucide-react'

const employee = {
  id: 'e-1',
  employeeNo: 'HX-2025-001',
  name: '张伟',
  gender: '男',
  phone: '138****1234',
  idCard: '44030119920315****',
  bankAccount: '622588201234****',
  bankName: '招商银行深圳分行',
  legalEntity: '深圳XX软件科技有限公司',
  department: '技术部',
  bizLine: '软件定制开发',
  position: '后端开发工程师',
  level: 'L8',
  directLeader: '王建国',
  joinDate: '2024-03-15',
  trialStatus: '已通过',
  status: '在职',
  avatar: '张',
}

const contracts = [
  {
    id: 'doc-1',
    name: '试岗协议',
    signDate: '2024-03-15',
    status: '已签署',
    legalEntity: '深圳XX软件科技有限公司',
  },
  {
    id: 'doc-2',
    name: '劳动合同',
    signDate: '2024-03-21',
    status: '已签署',
    legalEntity: '深圳XX软件科技有限公司',
  },
]

const attendanceRecords = [
  { date: '2026-07-28', clockIn: '08:50', clockOut: '18:35', status: '正常', remark: '' },
  { date: '2026-07-25', clockIn: '08:55', clockOut: '19:00', status: '正常', remark: '' },
  { date: '2026-07-24', clockIn: '09:10', clockOut: '18:30', status: '迟到', remark: '迟到10分钟' },
  { date: '2026-07-23', clockIn: '08:45', clockOut: '18:40', status: '正常', remark: '' },
  { date: '2026-07-22', clockIn: '09:00', clockOut: '18:30', status: '正常', remark: '' },
  { date: '2026-07-21', clockIn: '08:55', clockOut: '20:30', status: '正常', remark: '加班2小时' },
  { date: '2026-07-18', clockIn: '09:00', clockOut: '18:30', status: '正常', remark: '' },
  { date: '2026-07-17', clockIn: null, clockOut: null, status: '请假', remark: '年假1天' },
  { date: '2026-07-16', clockIn: '08:50', clockOut: '18:35', status: '正常', remark: '' },
  { date: '2026-07-15', clockIn: '09:00', clockOut: '18:30', status: '正常', remark: '' },
]

const performanceHistory = [
  { period: '2026-06', totalScore: 88, grade: 'A', coefficient: 1.2, manager: '王建国' },
  { period: '2026-03', totalScore: 91, grade: 'S', coefficient: 1.5, manager: '王建国' },
  { period: '2025-12', totalScore: 85, grade: 'A', coefficient: 1.2, manager: '王建国' },
  { period: '2025-09', totalScore: 82, grade: 'B', coefficient: 1.0, manager: '王建国' },
  { period: '2025-06', totalScore: 79, grade: 'B', coefficient: 1.0, manager: '王建国' },
]

const payrollRecords = [
  { period: '2026-07', baseSalary: 22000, performancePay: 6600, deduction: 3200, netSalary: 25400, status: '已发放' },
  { period: '2026-06', baseSalary: 22000, performancePay: 7920, deduction: 3350, netSalary: 26570, status: '已发放' },
  { period: '2026-05', baseSalary: 22000, performancePay: 6600, deduction: 3200, netSalary: 25400, status: '已发放' },
  { period: '2026-04', baseSalary: 22000, performancePay: 5500, deduction: 3100, netSalary: 24400, status: '已发放' },
  { period: '2026-03', baseSalary: 22000, performancePay: 8250, deduction: 3400, netSalary: 26850, status: '已发放' },
]

const statusColor: Record<string, string> = {
  '在职': 'bg-green-100 text-green-700',
  '试岗中': 'bg-amber-100 text-amber-700',
  '试用期': 'bg-blue-100 text-blue-700',
  '已离职': 'bg-slate-100 text-slate-500',
}

const gradeColor: Record<string, string> = {
  S: 'bg-amber-100 text-amber-700',
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-orange-100 text-orange-700',
  D: 'bg-red-100 text-red-700',
}

const attStatusColor: Record<string, string> = {
  '正常': 'text-green-600',
  '迟到': 'text-amber-600',
  '早退': 'text-amber-600',
  '缺勤': 'text-red-600',
  '请假': 'text-blue-600',
  '出差': 'text-indigo-600',
}

// ==================== RPG 能力模型数据 ====================

const DIM_LABELS: Record<string, string> = { tech: '技术能力', biz: '业务能力', mgmt: '管理能力', tool: '工具熟练', domain: '领域知识' }
const DIM_COLORS: Record<string, string> = { tech: '#6366f1', biz: '#10b981', mgmt: '#f59e0b', tool: '#8b5cf6', domain: '#ec4899' }

const capability = {
  scores: { tech: 82, biz: 65, mgmt: 45, tool: 70, domain: 55 },
  weightedScore: 72,
  level: 'L8',
  nextLevel: 'L9 架构师',
  promotionProgress: 80,
  promotionEligible: true,
  totalXP: 2850,
}

const SKILL_TREE = [
  { id: 'java-core', name: 'Java 核心', domain: 'tech', layer: 1, requiredScore: 15, unlocked: true, mastery: '精通' },
  { id: 'spring-boot', name: 'Spring Boot', domain: 'tech', layer: 2, requiredScore: 40, unlocked: true, mastery: '精通' },
  { id: 'microservices', name: '微服务架构', domain: 'tech', layer: 3, requiredScore: 65, unlocked: true, mastery: '入门' },
  { id: 'system-design', name: '系统设计', domain: 'tech', layer: 3, requiredScore: 75, unlocked: true, mastery: '入门' },
  { id: 'react-core', name: 'React 核心', domain: 'tech', layer: 2, requiredScore: 35, unlocked: true, mastery: '入门' },
  { id: 'docker', name: 'Docker 容器化', domain: 'tool', layer: 2, requiredScore: 40, unlocked: true, mastery: '入门' },
  { id: 'ci-cd', name: 'CI/CD', domain: 'tool', layer: 2, requiredScore: 35, unlocked: true, mastery: '精通' },
  { id: 'requirements', name: '需求分析', domain: 'biz', layer: 1, requiredScore: 10, unlocked: true, mastery: '入门' },
  { id: 'client-comm', name: '客户沟通', domain: 'biz', layer: 1, requiredScore: 10, unlocked: true, mastery: '入门' },
  { id: 'task-mgmt', name: '任务管理', domain: 'mgmt', layer: 1, requiredScore: 10, unlocked: true, mastery: '入门' },
  { id: 'code-review', name: 'Code Review', domain: 'tech', layer: 2, requiredScore: 30, unlocked: true, mastery: '精通' },
  { id: 'monitoring', name: '监控告警', domain: 'tool', layer: 3, requiredScore: 60, unlocked: false, mastery: '未解锁' },
  { id: 'coaching', name: '辅导带教', domain: 'mgmt', layer: 3, requiredScore: 65, unlocked: false, mastery: '未解锁' },
  { id: 'perf-review', name: '绩效面谈', domain: 'mgmt', layer: 2, requiredScore: 50, unlocked: false, mastery: '未解锁' },
]

const LEVEL_SYSTEM = [
  { level: 'L1', title: '实习生', range: '0-10', color: '#94a3b8' },
  { level: 'L2', title: '初级', range: '10-25', color: '#60a5fa' },
  { level: 'L3', title: '中级', range: '25-35', color: '#34d399' },
  { level: 'L4', title: '高级', range: '35-50', color: '#fbbf24' },
  { level: 'L5', title: '资深', range: '50-58', color: '#f97316' },
  { level: 'L6', title: '专家', range: '58-65', color: '#ef4444' },
  { level: 'L7', title: '高级专家', range: '65-72', color: '#a855f7' },
  { level: 'L8', title: '架构师', range: '72-80', color: '#6366f1', current: true },
  { level: 'L9', title: '总监', range: '80-90', color: '#ec4899' },
  { level: 'L10', title: '高级总监', range: '90+', color: '#f59e0b' },
]

const EXPERIENCE_LOG = [
  { date: '2026-07-15', source: '日报驱动', description: '完成 XX 教育平台支付模块开发', gains: { tech: +3, domain: +2 } },
  { date: '2026-07-01', source: '项目结算', description: 'CRM 系统项目结项，技术难点攻克', gains: { tech: +5, biz: +3 } },
  { date: '2026-06-15', source: '主管评定', description: '代码审查能力突出，带教新人表现优秀', gains: { tech: +2, mgmt: +4 } },
  { date: '2026-06-01', source: '日报驱动', description: '参与微服务架构设计讨论', gains: { tech: +2, mgmt: +1 } },
  { date: '2026-05-15', source: '项目结算', description: '电商平台项目后端开发完成', gains: { tech: +4, domain: +3 } },
]

// 雷达图组件
function RadarChart({ scores, size = 220 }: { scores: Record<string, number>; size?: number }) {
  const dims = Object.keys(scores) as string[]
  const cx = size / 2, cy = size / 2, radius = size / 2 - 30
  const angleFor = (i: number) => (Math.PI * 2 * i) / 5 - Math.PI / 2
  const levels = 5

  const gridPolygons = Array.from({ length: levels }, (_, lv) => {
    const r = (radius * (lv + 1)) / levels
    return dims.map((_, i) => { const a = angleFor(i); return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}` }).join(' ')
  })

  const dataPts = dims.map((d, i) => {
    const a = angleFor(i), r = (radius * scores[d]) / 100
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridPolygons.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke="#e2e8f0" strokeWidth={1} />)}
      {dims.map((_, i) => { const a = angleFor(i); return <line key={i} x1={cx} y1={cy} x2={cx + radius * Math.cos(a)} y2={cy + radius * Math.sin(a)} stroke="#e2e8f0" strokeOpacity={0.5} /> })}
      <polygon points={dataPts} fill="#6366f1" fillOpacity={0.2} stroke="#6366f1" strokeWidth={2} />
      {dims.map((d, i) => {
        const a = angleFor(i), r = (radius * scores[d]) / 100
        return <circle key={d} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={4} fill="#6366f1" />
      })}
      {dims.map((d, i) => {
        const a = angleFor(i)
        return <text key={d} x={cx + (radius + 18) * Math.cos(a)} y={cy + (radius + 18) * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={DIM_COLORS[d]} fontWeight={600}>{DIM_LABELS[d]}</text>
      })}
    </svg>
  )
}

const fields = [
  { label: '姓名', value: employee.name },
  { label: '性别', value: employee.gender },
  { label: '手机', value: employee.phone },
  { label: '身份证', value: employee.idCard },
  { label: '银行卡', value: `${employee.bankAccount}（${employee.bankName}）` },
  { label: '签约法人', value: employee.legalEntity },
  { label: '行政部门', value: employee.department },
  { label: '业务线', value: employee.bizLine },
  { label: '岗位', value: employee.position },
  { label: '职级', value: employee.level },
  { label: '直属上级', value: employee.directLeader },
  { label: '入职日期', value: employee.joinDate },
  { label: '试岗状态', value: employee.trialStatus },
]

export function EmployeeDetail() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-indigo-100 text-indigo-700">
                {employee.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">{employee.name}</h1>
                <Badge variant="outline" className={`text-xs ${statusColor[employee.status]}`}>
                  {employee.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                <span className="font-mono">{employee.employeeNo}</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employee.position} · {employee.level}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {employee.department} · {employee.bizLine}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  入职 {employee.joinDate}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic" className="gap-1.5">
            <User className="h-3.5 w-3.5" />基本信息
          </TabsTrigger>
          <TabsTrigger value="contracts" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />合同签署
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />考勤记录
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />绩效历史
          </TabsTrigger>
          <TabsTrigger value="payroll" className="gap-1.5">
            <Wallet className="h-3.5 w-3.5" />薪资记录
          </TabsTrigger>
          <TabsTrigger value="capability" className="gap-1.5">
            <FlaskConical className="h-3.5 w-3.5" />能力模型
          </TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="basic">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">员工基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {fields.map((f) => (
                  <div key={f.label} className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400 w-16 shrink-0">{f.label}</span>
                    <span className="text-sm text-slate-700">{f.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 合同签署 */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">签署文件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contracts.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                        <FileText className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{doc.name}</div>
                        <div className="text-xs text-slate-400">{doc.legalEntity}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">签署日期</div>
                        <div className="text-sm">{doc.signDate}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {doc.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 考勤记录 */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">近期考勤</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>上班打卡</TableHead>
                    <TableHead>下班打卡</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>备注</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{r.date}</TableCell>
                      <TableCell className="text-sm font-mono">{r.clockIn ?? '--'}</TableCell>
                      <TableCell className="text-sm font-mono">{r.clockOut ?? '--'}</TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${attStatusColor[r.status]}`}>
                          {r.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">{r.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 绩效历史 */}
        <TabsContent value="performance">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">绩效考核记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceHistory.map((p) => (
                  <div
                    key={p.period}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{p.period} 月度考核</div>
                        <div className="text-xs text-slate-400">评定人：{p.manager}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">总分</div>
                        <div className="text-sm font-bold">{p.totalScore}</div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${gradeColor[p.grade]}`}>
                        {p.grade}
                      </Badge>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">系数</div>
                        <div className="text-sm font-medium">{p.coefficient}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 薪资记录 */}
        <TabsContent value="payroll">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">薪资发放记录</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>月份</TableHead>
                    <TableHead>底薪</TableHead>
                    <TableHead>绩效工资</TableHead>
                    <TableHead>扣款</TableHead>
                    <TableHead>实发</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((p) => (
                    <TableRow key={p.period}>
                      <TableCell className="text-sm font-medium">{p.period}</TableCell>
                      <TableCell className="text-sm">¥{p.baseSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">¥{p.performancePay.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-red-500">
                        -¥{p.deduction.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm font-bold">
                        ¥{p.netSalary.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 text-xs">{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 能力模型 */}
        <TabsContent value="capability">
          <div className="grid grid-cols-3 gap-4">
            {/* 左侧：雷达图 + 等级 */}
            <div className="col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />五维能力雷达
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <RadarChart scores={capability.scores} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-indigo-500" />等级体系
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {LEVEL_SYSTEM.map((l) => (
                      <div key={l.level} className={`flex items-center gap-2 px-2 py-1 rounded ${l.current ? 'bg-indigo-50 border border-indigo-200' : ''}`}>
                        <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: l.color }}>{l.level.replace('L', '')}</div>
                        <span className="text-xs flex-1">{l.title}</span>
                        <span className="text-[10px] text-slate-400">{l.range}</span>
                        {l.current && <Badge className="text-[10px] bg-indigo-100 text-indigo-700 border-indigo-200" variant="outline">当前</Badge>}
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="text-center">
                    <div className="text-xs text-slate-500">晋级进度</div>
                    <Progress value={capability.promotionProgress} className="h-2 mt-1" />
                    <div className="text-xs text-slate-400 mt-1">{capability.weightedScore} / 80 → {capability.nextLevel}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：技能树 + 经验日志 */}
            <div className="col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-purple-500" />技能树
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {SKILL_TREE.filter((s) => s.unlocked).length}/{SKILL_TREE.length} 已解锁
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {SKILL_TREE.map((skill) => (
                      <div
                        key={skill.id}
                        className={`p-2.5 rounded-lg border-l-3 transition-all ${
                          skill.unlocked
                            ? 'bg-white border-l-4'
                            : 'bg-slate-50 border-l-slate-200 opacity-50'
                        }`}
                        style={{ borderLeftColor: skill.unlocked ? DIM_COLORS[skill.domain] : '#cbd5e1' }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          {skill.unlocked ? (
                            <Badge className="text-[10px] px-1.5 py-0" style={{ backgroundColor: DIM_COLORS[skill.domain] + '20', color: DIM_COLORS[skill.domain], border: `1px solid ${DIM_COLORS[skill.domain]}40` }}>
                              {skill.mastery}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                              <Lock className="h-2.5 w-2.5" />{skill.requiredScore}+
                            </Badge>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">L{skill.layer} · {DIM_LABELS[skill.domain]}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />经验日志
                    <Badge variant="secondary" className="ml-auto text-xs">总 XP: {capability.totalXP}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {EXPERIENCE_LOG.map((exp, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{exp.date}</span>
                            <Badge variant="outline" className="text-[10px] px-1 py-0">{exp.source}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-0.5">{exp.description}</p>
                          <div className="flex gap-2 mt-1">
                            {Object.entries(exp.gains).map(([dim, val]) => (
                              <span key={dim} className="text-[10px] font-medium" style={{ color: DIM_COLORS[dim] }}>
                                +{val} {DIM_LABELS[dim]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
