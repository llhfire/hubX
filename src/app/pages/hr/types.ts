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

export type RecruitmentStatus = '招聘中' | '已暂停' | '已关闭' | '已到岗'
export type CandidateStage = '简历筛选' | '面试中' | '待定薪' | '已发Offer' | '已入职' | '已淘汰'
export type ApprovalStatus = '待审批' | '已通过' | '已拒绝' | '已撤回'

export interface RecruitmentNeed {
  id: string
  position: string
  departmentId: string
  departmentName: string
  bizLineId: string
  bizLineName: string
  headcount: number
  status: RecruitmentStatus
  urgentLevel: '高' | '中' | '低'
  requestDate: string
  expectedDate: string
  description: string
  candidates: Candidate[]
}

export interface Candidate {
  id: string
  name: string
  phone: string
  email: string
  resumeUrl: string
  parsedResume: ParsedResume
  stage: CandidateStage
  matchScore: number
  interviewNotes: string
  interviewScore: number
  recruitmentId: string
}

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

// ==================== 定薪 ====================

export interface SalaryApproval {
  id: string
  candidateId: string
  candidateName: string
  position: string
  departmentName: string
  bizLineName: string
  proposedBaseSalary: number
  proposedPerformanceBase: number
  proposedProbationSalary: number
  trialPeriodDays: number
  probationMonths: number
  approvalStatus: ApprovalStatus
  hrComment: string
  bossComment: string
  aiSuggestion: string
  createdAt: string
}

// ==================== 入职 ====================

export type OnboardingStatus = '待入职' | '资料收集中' | '试岗中' | '已转正' | '已淘汰'

export interface OnboardingRecord {
  id: string
  employeeId: string
  employeeName: string
  position: string
  departmentName: string
  joinDate: string
  trialStartDate: string
  trialEndDate: string
  status: OnboardingStatus
  documentsSubmitted: boolean
  trialAgreementSigned: boolean
  laborContractSigned: boolean
  trialEvaluation: TrialEvaluation | null
}

export interface TrialEvaluation {
  attendance: string
  tasksCompleted: number
  totalHours: number
  communicationScore: number
  overallScore: number
  result: '通过' | '未通过'
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
