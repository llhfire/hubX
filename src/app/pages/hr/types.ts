// ==================== 组织管理 ====================

export interface LegalEntity {
  id: string
  name: string
  creditCode: string
  address: string
  contact: string
}

export interface Department {
  id: string
  name: string
  parentId: string | null
  leaderId: string | null
  children?: Department[]
}

export interface BizLine {
  id: string
  name: string
  leaderId: string | null
  description: string
}

export interface Position {
  id: string
  name: string
  level: string
  description: string
}

// ==================== 员工 ====================

export type TrialStatus = '试岗中' | '已通过' | '未通过'
export type EmployeeStatus = '在职' | '试岗中' | '试用期' | '已离职'
export type Gender = '男' | '女'

export interface Employee {
  id: string
  employeeNo: string
  name: string
  gender: Gender
  phone: string
  idCard: string
  bankAccount: string
  bankName: string
  avatar: string
  legalEntityId: string
  departmentId: string
  departmentName: string
  directLeaderId: string
  directLeaderName: string
  bizLineId: string
  bizLineName: string
  position: string
  level: string
  joinDate: string
  trialStatus: TrialStatus
  probationEndDate: string | null
  baseSalary: number
  performanceBase: number
  status: EmployeeStatus
  education: string
  email: string
  emergencyContact: string
  emergencyPhone: string
}

// ==================== 招聘 ====================

export type RecruitmentNeedStatus = '待审批' | '招聘中' | '已暂停' | '已关闭' | '已到岗'
export type CandidateStage = '简历筛选' | '面试中' | '待定薪' | '已发Offer' | '已接受' | '已拒绝' | '已淘汰'
export type ApprovalStatus = '待审批' | '已通过' | '已拒绝' | '已撤回'
export type OfferStatus = '待生成' | '已生成' | '已发送' | '已查看' | '已接受' | '已拒绝' | '已过期'
export type ResumeSource = 'Boss直聘' | '猎聘' | '拉勾' | '内部推荐' | '主动投递' | '猎头' | '其他'
export type InterviewChannel = '现场' | '电话' | '视频' | '微信'

// 招聘需求
export interface RecruitmentNeed {
  id: string
  position: string
  departmentId: string
  departmentName: string
  bizLineId: string
  bizLineName: string
  headcount: number           // 需招人数
  hiredCount: number          // 已到岗人数
  status: RecruitmentNeedStatus
  urgentLevel: '高' | '中' | '低'
  requestDate: string
  expectedDate: string
  description: string
  requirements: string        // 岗位要求
  approver: string            // 审批人
  approvalStatus: ApprovalStatus
  createdAt: string
  updatedAt: string
}

// 候选人（独立实体）
export interface Candidate {
  id: string
  name: string
  gender: '男' | '女' | '未知'
  phone: string
  email: string
  resumeUrl: string
  parsedResume: ParsedResume
  source: ResumeSource
  isFavorited: boolean        // 是否收藏
  createdAt: string
  updatedAt: string
}

// 简历解析结果
export interface ParsedResume {
  name: string
  phone: string
  email: string
  education: string
  workYears: number
  skills: string[]
  lastCompany: string
  lastPosition: string
  expectedSalary: string
  selfIntro: string
}

// 候选人与需求的关联
export interface CandidateDemandRelation {
  id: string
  candidateId: string
  demandId: string
  stage: CandidateStage
  matchScore: number          // AI 匹配度
  rejectReason?: string       // 淘汰原因
  createdAt: string
  updatedAt: string
}

// 面试记录
export interface InterviewRecord {
  id: string
  candidateId: string
  demandId: string
  round: number               // 面试轮次（1, 2, 3...）
  interviewer: string         // 面试官
  interviewTime: string
  channel: InterviewChannel
  duration: number            // 面试时长（分钟）
  // 评价
  technicalScore: number      // 技术能力 1-10
  communicationScore: number  // 沟通能力 1-10
  cultureScore: number        // 文化匹配 1-10
  overallScore: number        // 综合评分 1-10
  strengths: string           // 优势
  weaknesses: string          // 不足
  comment: string             // 面试评价
  result: '通过' | '待定' | '未通过'
  createdAt: string
}

// ==================== 定薪 ====================

export interface SalaryApproval {
  id: string
  candidateId: string
  candidateName: string
  demandId: string
  position: string
  departmentName: string
  bizLineName: string
  proposedBaseSalary: number
  proposedPerformanceBase: number
  proposedProbationSalary: number
  proposedTrialSalary: number // 试岗期薪资
  trialPeriodDays: number    // 试岗期天数
  probationMonths: number    // 试用期月数
  approvalStatus: ApprovalStatus
  hrComment: string
  bossComment: string
  aiSuggestion: string
  createdAt: string
}

// 薪资沟通日志
export interface SalaryCommunication {
  id: string
  candidateId: string
  salaryApprovalId: string
  channel: InterviewChannel
  content: string             // 沟通内容摘要
  result: string              // 沟通结果
  operator: string            // 操作人
  createdAt: string
}

// ==================== Offer ====================

export interface OfferRecord {
  id: string
  candidateId: string
  candidateName: string
  demandId: string
  position: string
  departmentName: string
  baseSalary: number
  performanceBase: number
  trialSalary: number
  trialPeriodDays: number
  probationMonths: number
  benefits: string            // 福利说明
  status: OfferStatus
  validUntil: string          // 有效期
  sentAt: string | null
  viewedAt: string | null
  respondedAt: string | null
  rejectReason?: string
  createdAt: string
}

// ==================== 入职 ====================

export type OnboardingStatus = '待入职' | '资料收集中' | '试岗中' | '试用期' | '已转正' | '已淘汰'
export type OnboardingDocument = '身份证' | '学历证明' | '离职证明' | '体检报告' | '银行卡' | '照片' | '试岗协议' | '劳动合同'

export interface OnboardingRecord {
  id: string
  candidateId: string
  employeeId: string
  employeeName: string
  position: string
  departmentName: string
  joinDate: string
  trialStartDate: string
  trialEndDate: string
  probationEndDate: string
  status: OnboardingStatus
  documents: { type: OnboardingDocument; submitted: boolean; submittedAt?: string }[]
  trialAgreementSigned: boolean
  laborContractSigned: boolean
  // 入职时写入的面试记录快照（只读）
  interviewSnapshot: InterviewRecord[]
  trialEvaluation: TrialEvaluation | null
  probationEvaluation: ProbationEvaluation | null
}

// 试岗评估
export interface TrialEvaluation {
  attendance: string          // 出勤情况
  tasksCompleted: number      // 完成任务数
  totalHours: number          // 工时消耗
  communicationScore: number  // 沟通能力 1-10
  overallScore: number        // 综合评分 1-10
  result: '通过' | '未通过'
  comment: string
  evaluator: string
  evaluatedAt: string
}

// 试用期评估
export interface ProbationEvaluation {
  kpiScore: number            // KPI 得分
  managerScore: number        // 主管评分
  peerScore: number           // 同事互评
  overallScore: number        // 综合评分
  result: '转正' | '延长试用' | '辞退'
  comment: string
  evaluator: string
  evaluatedAt: string
}

// ==================== 考勤 ====================

export type AttendanceType = '正常' | '迟到' | '早退' | '缺勤' | '请假' | '出差' | '外勤'
export type LeaveType = '事假' | '病假' | '年假' | '调休' | '婚假' | '产假' | '其他'
export type ExceptionStatus = '待审批' | '已通过' | '已拒绝'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  clockIn: string | null
  clockOut: string | null
  status: AttendanceType
  remark: string
}

export interface AttendanceSummary {
  employeeId: string
  employeeName: string
  departmentName: string
  year: number
  month: number
  workDays: number
  actualDays: number
  lateCount: number
  earlyLeaveCount: number
  absentDays: number
  leaveDays: number
  leaveDetails: { type: LeaveType; days: number }[]
  overtimeHours: number
  deduction: number
}

export interface AttendanceException {
  id: string
  employeeId: string
  employeeName: string
  type: '补卡' | '请假' | '出差'
  bizLineName: string
  startDate: string
  endDate: string
  location: string
  reason: string
  status: ExceptionStatus
  approver: string
  approvedAt: string | null
}

// ==================== 绩效 ====================

export type PerformanceGrade = 'S' | 'A' | 'B' | 'C' | 'D'
export type PerformancePeriod = '月度' | '季度' | '年度'

export interface KPITemplate {
  id: string
  name: string
  position: string
  items: KPIItem[]
  createdAt: string
}

export interface KPIItem {
  id: string
  name: string
  weight: number
  targetValue: string
  description: string
}

export interface PerformanceRecord {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string
  period: string
  periodType: PerformancePeriod
  kpiItems: PerformanceKPIItem[]
  totalScore: number
  grade: PerformanceGrade
  coefficient: number
  managerComment: string
  employeeConfirmStatus: '待确认' | '已确认' | '已申诉'
  bossReviewStatus: '待复核' | '已复核'
  aiBiasWarning: string | null
}

export interface PerformanceKPIItem extends KPIItem {
  actualValue: string
  score: number
}

// ==================== 薪资 ====================

export type PayrollStatus = '计算中' | '待复核' | '待老板审批' | '已审批' | '已发放'
export type PayslipConfirmStatus = '待确认' | '已确认' | '有异议' | '逾期自动确认'

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string
  year: number
  month: number
  workDays: number
  actualWorkDays: number
  baseSalary: number
  dailySalary: number
  probationSalary: number
  isProbation: boolean
  trialResult: '已通过' | '未通过' | '不适用'
  performanceBase: number
  performanceCoefficient: number
  performancePay: number
  attendanceDeduction: number
  socialInsurance: number
  tax: number
  totalDeduction: number
  netSalary: number
  status: PayrollStatus
  confirmStatus: PayslipConfirmStatus
  confirmedAt: string | null
  confirmedIp: string | null
  aiAnomalyNote: string | null
}

// ==================== 离职 ====================

export type ResignationStatus = '待审批' | '交接中' | '待老板审批' | '已完成' | '已驳回'

export interface ResignationRecord {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string
  position: string
  resignationDate: string
  lastWorkDate: string
  reason: string
  status: ResignationStatus
  projectHandovers: ProjectHandover[]
  customerHandovers: CustomerHandover[]
  assetReturns: AssetReturn[]
  salarySettlement: string
  hookStatus: HookStatus
}

export interface ProjectHandover {
  projectName: string
  handoverTo: string
  handoverToName: string
  status: '待交接' | '已交接'
}

export interface CustomerHandover {
  customerName: string
  handoverTo: string
  handoverToName: string
  status: '待交接' | '已交接'
}

export interface AssetReturn {
  assetName: string
  assetNo: string
  returned: boolean
  returnedAt: string | null
}

export interface HookStatus {
  wecomDisabled: boolean
  oaDisabled: boolean
  systemDisabled: boolean
  hookLog: { action: string; timestamp: string; result: string }[]
}

// ==================== 派单 ====================

export type DispatchType = '行政' | '项目'
export type DispatchStatus = '待接单' | '进行中' | '待验收' | '已验收' | '超时自动结单'

export interface Dispatch {
  id: string
  title: string
  type: DispatchType
  bizLineName: string
  projectName: string
  description: string
  deadline: string
  assignerId: string
  assignerName: string
  assigneeId: string
  assigneeName: string
  actualHours: number
  feedback: string
  status: DispatchStatus
  createdAt: string
  completedAt: string | null
  autoCompleted: boolean
}

// ==================== 看板 ====================

export interface DashboardStats {
  totalEmployees: number
  onTrial: number
  probation: number
  resignedThisMonth: number
  totalSalaryCost: number
  avgPerformanceScore: number
  attendanceRate: number
  dispatchCompletionRate: number
}
