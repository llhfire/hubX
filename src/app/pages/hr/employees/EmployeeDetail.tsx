import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
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
  Download,
  Eye,
  Sparkles,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Mic,
  Video,
  MessageSquare,
  Brain,
  Target,
  AlertTriangle,
  Play,
  Pause,
  ScanLine,
} from 'lucide-react'
import { RegistrationFormOCR } from '../components/RegistrationFormOCR'
import { toast } from 'sonner'

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

// ==================== 面试记录数据 ====================

const interviewSessions = [
  {
    id: 'iv-1',
    round: '一面（技术面）',
    date: '2024-03-08',
    interviewer: '王建国（技术总监）',
    duration: '45 分钟',
    type: '现场面试',
    status: '已完成',
    overallScore: 88,
    aiScore: 85,
    subjectiveScore: 90,
    recommendation: '推荐入职',
    questions: [
      {
        id: 'q-1',
        question: '请介绍一下你过去做过的最复杂的后端项目，遇到的技术难点是什么？',
        transcript: '我之前在某教育公司负责 K12 在线教育平台的后端架构。最大的难点是高并发场景下的选课系统，开学季会有上万学生同时选课。我采用了 Redis 预减库存 + 消息队列削峰的方案，最终支撑住了 QPS 5000+ 的峰值流量。这个项目让我对分布式系统有了更深的理解。',
        aiAnalysis: { score: 92, strengths: ['问题描述清晰，有具体数据支撑', '技术方案合理，体现了架构思维'], weaknesses: ['未提及团队协作和沟通方面'], sentiment: '积极自信' },
        interviewerScore: 90,
        interviewerComment: '回答很好，技术深度足够，有实际数据佐证',
      },
      {
        id: 'q-2',
        question: '你简历中提到做过微服务架构，请描述一下你的服务拆分策略和通信方式？',
        transcript: '我们当时把单体应用拆成了 6 个微服务：用户服务、课程服务、订单服务、支付服务、通知服务、数据分析服务。拆分的依据是业务边界和数据独立性。服务间通信用的是 RESTful API 做同步调用，RabbitMQ 做异步消息。服务发现用的 Nacos，网关用的 Spring Cloud Gateway。',
        aiAnalysis: { score: 85, strengths: ['拆分策略合理，有具体实例', '技术选型主流'], weaknesses: ['未提及服务治理、熔断降级等高阶内容'], sentiment: '专业扎实' },
        interviewerScore: 85,
        interviewerComment: '回答全面，但可以再深入一些',
      },
      {
        id: 'q-3',
        question: '如果让你设计一个日均 10 万订单的电商系统，你会怎么设计数据库和缓存方案？',
        transcript: '首先数据库层面，订单表我会按用户 ID 做分库分表，用 ShardingSphere。热数据放 MySQL，冷数据归档到 ES。缓存方面，商品详情用 Redis 做多级缓存，本地缓存 + Redis 集群。订单状态变更走 Canal 监听 binlog 同步到 ES 供查询。支付用异步回调 + 定时对账保证一致性。',
        aiAnalysis: { score: 88, strengths: ['方案完整，考虑了读写分离和数据归档', '提到了数据一致性保障'], weaknesses: ['未讨论具体的分片键选择和扩容方案'], sentiment: '思路清晰' },
        interviewerScore: 88,
        interviewerComment: '方案完整度不错，实际落地经验还需要验证',
      },
      {
        id: 'q-4',
        question: '你对 React 前端了解多少？有没有实际项目经验？',
        transcript: 'React 我有了解，做过一些简单的页面，但不是我的主要技术方向。我后端用的多，前端主要是配合完成一些管理后台的页面。TypeScript 用的比较多，React 的 Hooks 和组件化思想我理解。',
        aiAnalysis: { score: 55, strengths: ['诚实说明了自己的短板', '有基本了解'], weaknesses: ['React 经验明显不足', '无实际项目产出'], sentiment: '坦诚但薄弱' },
        interviewerScore: 50,
        interviewerComment: '前端确实是短板，但后端岗位可以接受',
      },
    ],
  },
  {
    id: 'iv-2',
    round: '二面（综合面）',
    date: '2024-03-12',
    interviewer: '李明（总经理）',
    duration: '30 分钟',
    type: '视频面试',
    status: '已完成',
    overallScore: 82,
    aiScore: 80,
    subjectiveScore: 85,
    recommendation: '推荐入职',
    questions: [
      {
        id: 'q-5',
        question: '你为什么从上一家公司离职？对我们的公司有什么了解？',
        transcript: '上一家公司业务比较单一，主要是教育行业的项目，我想拓展更多的行业经验。了解到贵公司业务线比较丰富，有电商、移民、IP 打造等，这对我来说很有吸引力。而且贵公司在深圳的技术口碑不错，团队氛围看起来也很好。',
        aiAnalysis: { score: 78, strengths: ['离职原因合理', '对公司有基本了解'], weaknesses: ['回答略显模板化', '可以更具体说明对哪个业务线感兴趣'], sentiment: '积极正面' },
        interviewerScore: 80,
        interviewerComment: '态度积极，动机合理',
      },
      {
        id: 'q-6',
        question: '你的职业规划是什么？未来 3-5 年想达到什么水平？',
        transcript: '短期我希望在贵公司深耕后端技术，成为某个业务线的技术负责人。中期我想往架构师方向发展，能够独立设计复杂系统。长期来看，如果有机会，我也想尝试技术管理，带更大的团队。',
        aiAnalysis: { score: 85, strengths: ['规划清晰，有阶段性目标', '技术+管理双通道发展'], weaknesses: ['可以更具体说明如何实现这些目标'], sentiment: '目标明确' },
        interviewerScore: 85,
        interviewerComment: '规划合理，与公司发展方向契合',
      },
    ],
  },
]

const interviewAIInsights = {
  overallAssessment: '候选人技术基础扎实，后端架构能力突出，项目经验丰富。主要短板在前端深度不足，但作为后端岗位可接受。沟通表达清晰，职业规划合理。建议入职后安排导师带教，重点培养微服务治理和团队协作能力。',
  riskFlags: [
    { flag: '前端能力不足', severity: 'medium', note: 'React 仅了解级别，需评估是否影响岗位要求' },
    { flag: '第一份工作仅 1.8 年', severity: 'low', note: '需了解离职原因，评估稳定性' },
  ],
  recommendedQuestions: [
    '如果入职后需要你带新人，你会怎么安排？',
    '遇到技术方案与上级意见不一致时，你怎么处理？',
    '你对加班怎么看？能否接受项目紧急时的高强度工作？',
  ],
}

// ==================== 简历数据 ====================

const resumeData = {
  name: '张伟',
  gender: '男',
  birthDate: '1992-03-15',
  phone: '138-0000-1234',
  email: 'zhangwei@example.com',
  education: '本科 · 深圳大学 · 计算机科学与技术 · 2014届',
  workYears: '8年',
  expectedSalary: '25k-30k',
  selfIntro: '8年 Java 后端开发经验，精通 Spring Boot 微服务架构，有完整的电商、教育、金融行业项目交付经验。熟悉高并发系统设计，具备团队管理能力。',
  skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'React', 'TypeScript', 'PostgreSQL', 'RabbitMQ'],
  certificates: ['PMP 项目管理专业人士', 'AWS Solutions Architect'],
  languages: ['中文（母语）', '英语（CET-6）'],
}

const workExperience = [
  {
    company: 'XX 软件科技有限公司',
    period: '2024.03 - 至今',
    position: '高级后端工程师 / L8',
    projects: [
      { name: '智慧校园小程序', industry: '教育', type: '小程序+管理后台', duration: '3个月', role: '技术负责人', techStack: 'Java, Spring Boot, MySQL, 微信小程序', description: '负责整体架构设计与核心模块开发，带领 3 人团队完成从 0 到 1 交付' },
      { name: 'CRM 客户管理系统', industry: '企业服务', type: 'Web 应用', duration: '2个月', role: '后端开发', techStack: 'Java, Spring Boot, PostgreSQL, Redis', description: '负责客户管理、合同管理、审批流等核心模块开发' },
      { name: 'XX 电商平台', industry: '电商', type: '小程序+APP+后台', duration: '4个月', role: '技术负责人', techStack: 'Java, Spring Boot, MySQL, Redis, RabbitMQ', description: '负责商品、订单、支付模块设计，处理日均 10 万+订单' },
    ],
  },
  {
    company: '某在线教育公司',
    period: '2020.06 - 2024.02',
    position: '后端开发工程师 / L6→L7',
    projects: [
      { name: 'K12 在线教育平台', industry: '教育', type: 'Web 应用', duration: '6个月', role: '核心开发', techStack: 'Java, Spring Cloud, MySQL, MongoDB', description: '负责课程管理、在线直播、考试系统模块' },
      { name: '教育数据中台', industry: '教育', type: '数据平台', duration: '4个月', role: '后端开发', techStack: 'Java, Spark, Hadoop, MySQL', description: '负责学生学习行为数据采集与分析' },
    ],
  },
  {
    company: '某金融科技公司',
    period: '2018.07 - 2020.05',
    position: '初级→中级开发 / L4→L5',
    projects: [
      { name: '互联网贷款系统', industry: '金融', type: 'Web 应用', duration: '8个月', role: '开发工程师', techStack: 'Java, Spring, MyBatis, Oracle', description: '负责贷款申请、风控审核、放款模块' },
    ],
  },
]

const aiExperienceSummary = {
  industryDistribution: [
    { name: '教育', percentage: 45, projects: 3 },
    { name: '电商', percentage: 25, projects: 2 },
    { name: '金融', percentage: 15, projects: 1 },
    { name: '企业服务', percentage: 15, projects: 1 },
  ],
  skillKeywords: ['微服务架构', '高并发系统', '数据库设计', 'API 设计', '团队管理', '项目交付', '技术方案设计', '代码审查'],
  managementExp: '带领 3-5 人小团队完成项目交付，具备需求分析、任务拆解、进度把控能力',
  careerProgression: 'L4(2018) → L5(2019) → L6(2020) → L7(2022) → L8(2024)，6 年晋升 4 级，平均 1.5 年/级',
  strengthAreas: ['后端架构设计', '数据库优化', '微服务治理', '团队协作'],
  improvementAreas: ['前端深度', '大数据技术', '系统性能调优'],
  resumeRisks: [
    { level: 'warning' as const, title: '工作稳定性', detail: '最近 2 段工作平均任期 2.5 年，第一段仅 1.8 年。建议面试中了解离职原因。', suggestion: '关注职业稳定性' },
    { level: 'warning' as const, title: '行业集中度偏高', detail: '教育行业占比 45%，电商+金融+企业服务仅 55%。若岗位需要跨行业经验，需评估迁移能力。', suggestion: '确认跨行业适应性' },
    { level: 'info' as const, title: '管理经验有限', detail: '简历描述为"带领 3-5 人小团队"，未提及 larger team 或跨部门协作经验。若岗位需要管理 10+ 人团队，需重点考察。', suggestion: '面试验证管理深度' },
    { level: 'info' as const, title: '技术栈偏向传统', detail: '以 Java/Spring Boot 为主，React 经验标注为"入门"。若岗位需要全栈能力，前端深度可能不足。', suggestion: '评估全栈能力' },
    { level: 'danger' as const, title: '期望薪资偏高', detail: '期望 25k-30k，公司同职级 L8 中位数为 22k。溢价约 15-35%，需评估性价比。', suggestion: '薪资谈判空间有限' },
  ],
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
  const [ocrOpen, setOcrOpen] = useState(false)

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
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOcrOpen(true)}>
              <ScanLine className="h-4 w-4" />应聘登记表
            </Button>
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
          <TabsTrigger value="resume" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />简历
          </TabsTrigger>
          <TabsTrigger value="interview" className="gap-1.5">
            <Mic className="h-3.5 w-3.5" />面试记录
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

        {/* 简历 */}
        <TabsContent value="resume">
          <div className="space-y-4">
            {/* 原始简历 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />原始简历
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1"><Eye className="h-3.5 w-3.5" />预览</Button>
                    <Button variant="outline" size="sm" className="gap-1"><Download className="h-3.5 w-3.5" />下载</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{resumeData.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-slate-400">性别:</span> {resumeData.gender}</div>
                      <div><span className="text-slate-400">出生:</span> {resumeData.birthDate}</div>
                      <div><span className="text-slate-400">电话:</span> {resumeData.phone}</div>
                      <div><span className="text-slate-400">邮箱:</span> {resumeData.email}</div>
                      <div className="col-span-2"><span className="text-slate-400">学历:</span> {resumeData.education}</div>
                      <div><span className="text-slate-400">工作年限:</span> {resumeData.workYears}</div>
                      <div><span className="text-slate-400">期望薪资:</span> {resumeData.expectedSalary}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">证书:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resumeData.certificates.map((c) => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 text-sm">自我评价:</span>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{resumeData.selfIntro}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">技能标签:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resumeData.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">语言:</span>
                      <div className="flex gap-2 mt-1">
                        {resumeData.languages.map((l) => <Badge key={l} variant="outline" className="text-xs">{l}</Badge>)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 工作经历 + AI 概要 并排 */}
            <div className="grid grid-cols-5 gap-4">
              {/* 左侧：工作经历（3/5 宽度） */}
              <div className="col-span-3">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BriefcaseIcon className="h-5 w-5 text-slate-500" />工作经历
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {workExperience.map((exp, i) => (
                        <div key={i} className="relative pl-6 border-l-2 border-indigo-300">
                          <div className="absolute -left-2 top-1 w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-white" />
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-base">{exp.company}</span>
                            <Badge variant="outline" className="text-xs">{exp.period}</Badge>
                          </div>
                          <div className="text-sm text-slate-500 mb-3">{exp.position}</div>
                          <div className="space-y-2.5">
                            {exp.projects.map((proj, j) => (
                              <div key={j} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-sm font-semibold text-slate-800">{proj.name}</span>
                                  <Badge variant="outline" className="text-xs px-1.5 py-0 bg-blue-50 text-blue-600 border-blue-200">{proj.industry}</Badge>
                                  <Badge variant="outline" className="text-xs px-1.5 py-0">{proj.type}</Badge>
                                  <span className="text-xs text-slate-400 ml-auto">{proj.duration}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-1.5">{proj.description}</p>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <span className="font-medium text-slate-500">角色:</span> {proj.role}
                                  <span className="mx-1">·</span>
                                  <span className="font-medium text-slate-500">技术栈:</span> {proj.techStack}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 右侧：AI 经历概要（2/5 宽度） */}
              <div className="col-span-2">
                <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-500" />AI 经历概要
                    </CardTitle>
                    <Badge variant="outline" className="text-xs w-fit bg-indigo-100/50 text-indigo-600 border-indigo-200">基于简历智能分析生成</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 行业分布 */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">行业经验分布</h4>
                      <div className="space-y-2">
                        {aiExperienceSummary.industryDistribution.map((ind) => (
                          <div key={ind.name} className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 w-16">{ind.name}</span>
                            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${ind.percentage}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-indigo-600 w-10 text-right">{ind.percentage}%</span>
                            <span className="text-xs text-slate-400 w-12">{ind.projects}个项目</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* 核心能力 */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">核心能力标签</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {aiExperienceSummary.skillKeywords.map((kw) => (
                          <Badge key={kw} variant="outline" className="text-xs bg-white border-indigo-200 text-indigo-700">{kw}</Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* 管理经验 */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-1.5">管理经验</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{aiExperienceSummary.managementExp}</p>
                    </div>

                    {/* 职业发展 */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-1.5">职业发展轨迹</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{aiExperienceSummary.careerProgression}</p>
                    </div>

                    <Separator />

                    {/* 优势与提升 */}
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50/80 rounded-lg border border-green-200">
                        <h4 className="text-sm font-semibold text-green-700 mb-1.5">✨ 优势领域</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {aiExperienceSummary.strengthAreas.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs bg-white text-green-700 border-green-300">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200">
                        <h4 className="text-sm font-semibold text-amber-700 mb-1.5">📈 提升方向</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {aiExperienceSummary.improvementAreas.map((a) => (
                            <Badge key={a} variant="outline" className="text-xs bg-white text-amber-700 border-amber-300">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* 简历风险提示 */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <span className="text-red-500">⚠️</span> 简历风险提示
                        <Badge variant="outline" className="text-[10px] ml-1">{aiExperienceSummary.resumeRisks.length} 项</Badge>
                      </h4>
                      <div className="space-y-2">
                        {aiExperienceSummary.resumeRisks.map((risk, i) => {
                          const riskColor = risk.level === 'danger' ? 'border-red-200 bg-red-50/50' :
                            risk.level === 'warning' ? 'border-amber-200 bg-amber-50/50' :
                            'border-blue-200 bg-blue-50/50'
                          const badgeColor = risk.level === 'danger' ? 'bg-red-100 text-red-700 border-red-200' :
                            risk.level === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-blue-100 text-blue-700 border-blue-200'
                          const textColor = risk.level === 'danger' ? 'text-red-700' :
                            risk.level === 'warning' ? 'text-amber-700' : 'text-blue-700'
                          return (
                            <div key={i} className={`p-2.5 rounded-lg border ${riskColor}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={`text-[10px] ${badgeColor}`}>
                                  {risk.level === 'danger' ? '高' : risk.level === 'warning' ? '中' : '低'}
                                </Badge>
                                <span className={`text-sm font-semibold ${textColor}`}>{risk.title}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed mb-1">{risk.detail}</p>
                              <p className="text-[10px] text-slate-400 italic">💡 {risk.suggestion}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 面试记录 */}
        <TabsContent value="interview">
          <div className="space-y-4">
            {/* 顶部综合评估 */}
            <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/30">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                    <Brain className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">AI 面试综合评估</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{interviewAIInsights.overallAssessment}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">AI 评分</span>
                        <span className="text-lg font-bold text-indigo-600">85</span>
                      </div>
                      <div className="h-5 w-px bg-slate-200" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">面试官评分</span>
                        <span className="text-lg font-bold text-amber-600">88</span>
                      </div>
                      <div className="h-5 w-px bg-slate-200" />
                      <Badge className="bg-green-100 text-green-700 border-green-200">推荐入职</Badge>
                    </div>
                  </div>
                </div>
                {/* 风险标记 */}
                <div className="flex gap-2 mt-3">
                  {interviewAIInsights.riskFlags.map((rf, i) => (
                    <Badge key={i} variant="outline" className={`text-xs ${
                      rf.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      ⚠️ {rf.flag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 面试轮次页签 */}
            <Tabs defaultValue="iv-1">
              <TabsList>
                {interviewSessions.map((s) => (
                  <TabsTrigger key={s.id} value={s.id} className="gap-1.5">
                    <Mic className="h-3.5 w-3.5" />
                    {s.round}
                    <Badge variant="outline" className="text-[10px] ml-1">{s.overallScore}分</Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {interviewSessions.map((session) => (
                <TabsContent key={session.id} value={session.id}>
                  <div className="grid grid-cols-3 gap-4">
                    {/* 左侧：问答详情（2/3） */}
                    <div className="col-span-2 space-y-3">
                      {session.questions.map((qa, idx) => (
                        <Card key={qa.id}>
                          <CardContent className="pt-4 pb-4 space-y-3">
                            {/* 问题编号 + 问题 */}
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-indigo-600">Q{idx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-800 leading-relaxed">{qa.question}</p>
                              </div>
                            </div>

                            {/* 录音转写 */}
                            <div className="ml-10 p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-md">
                                    <Mic className="h-3 w-3 text-green-600" />
                                    <span className="text-green-700 font-medium">录音转写</span>
                                  </div>
                                  <button className="p-1 hover:bg-slate-200 rounded"><Play className="h-3 w-3 text-slate-500" /></button>
                                  <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="w-1/3 h-full bg-indigo-400 rounded-full" />
                                  </div>
                                  <span className="text-slate-400">0:42</span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-700 leading-relaxed">{qa.transcript}</p>
                            </div>

                            {/* AI 分析 */}
                            <div className="ml-10 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs font-semibold text-indigo-700">AI 分析</span>
                                <Badge variant="outline" className="text-[10px] bg-white text-indigo-600 border-indigo-200">{qa.aiAnalysis.score}分</Badge>
                                <Badge variant="outline" className={`text-[10px] ${
                                  ['积极自信','专业扎实','思路清晰','目标明确','积极正面'].includes(qa.aiAnalysis.sentiment)
                                    ? 'bg-green-50 text-green-600 border-green-200'
                                    : 'bg-amber-50 text-amber-600 border-amber-200'
                                }`}>{qa.aiAnalysis.sentiment}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <span className="text-[10px] font-semibold text-green-600">✅ 优势</span>
                                  <ul className="mt-1 space-y-0.5">
                                    {qa.aiAnalysis.strengths.map((s, i) => (
                                      <li key={i} className="text-xs text-slate-600 leading-relaxed">• {s}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <span className="text-[10px] font-semibold text-amber-600">⚠️ 不足</span>
                                  <ul className="mt-1 space-y-0.5">
                                    {qa.aiAnalysis.weaknesses.map((w, i) => (
                                      <li key={i} className="text-xs text-slate-600 leading-relaxed">• {w}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* 面试官评分 */}
                            <div className="ml-10 flex items-center gap-3">
                              <User className="h-4 w-4 text-amber-500" />
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className={`h-4 w-4 ${star <= Math.round(qa.interviewerScore / 20) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                ))}
                              </div>
                              <span className="text-sm font-bold text-amber-600">{qa.interviewerScore}分</span>
                              <span className="text-xs text-slate-300">|</span>
                              <span className="text-xs text-slate-500 italic">{qa.interviewerComment}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* 右侧：评分汇总 + 推荐追问（1/3） */}
                    <div className="space-y-4">
                      {/* 本轮评分 */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">本轮评分</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-indigo-500" />
                              <span className="text-sm text-slate-600">AI 评分</span>
                            </div>
                            <span className="text-lg font-bold text-indigo-600">{session.aiScore}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-slate-600">面试官评分</span>
                            </div>
                            <span className="text-lg font-bold text-amber-600">{session.subjectiveScore}</span>
                          </div>
                          <Separator />
                          <div className="text-center">
                            <div className="text-xs text-slate-400 mb-1">综合评分</div>
                            <div className="text-2xl font-bold text-slate-800">{session.overallScore}</div>
                          </div>
                          <Badge className="w-full justify-center bg-green-100 text-green-700 border-green-200">{session.recommendation}</Badge>
                        </CardContent>
                      </Card>

                      {/* 面试信息 */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">面试信息</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-slate-400">面试官</span><span>{session.interviewer}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">日期</span><span>{session.date}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">时长</span><span>{session.duration}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">方式</span><Badge variant="outline" className="text-xs">{session.type}</Badge></div>
                        </CardContent>
                      </Card>

                      {/* 推荐追问 */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-indigo-500" />推荐追问
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {interviewAIInsights.recommendedQuestions.map((q, i) => (
                              <div key={i} className="p-2 bg-slate-50 rounded border text-xs text-slate-600 leading-relaxed">
                                {i + 1}. {q}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
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
      <RegistrationFormOCR open={ocrOpen} onOpenChange={setOcrOpen} />
    </div>
  )
}
