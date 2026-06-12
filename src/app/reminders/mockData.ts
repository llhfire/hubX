import type { DailyReport } from '@/app/pages/daily-report/types'
import type { DailyReportComment } from '@/app/pages/daily-report/types'

export interface Approval {
  id: string
  userId: string
  userName: string
  type: 'leave' | 'reimbursement' | 'contract' | 'quotation'
  title: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt?: string
  route: `/${string}`
}

export interface Contract {
  id: string
  name: string
  customerName: string
  amount: number
  signingDate: string
  expireDate: string
  status: 'draft' | 'active' | 'expired'
}

export interface Lead {
  id: string
  name: string
  nextFollowupTime?: string
  lastFollowupAt?: string
  assignedAt?: string
}

export interface ReminderData {
  currentUserId: string
  dailyReports: DailyReport[]
  dailyComments: DailyReportComment[]
  approvals: Approval[]
  contracts: Contract[]
  leads: Lead[]
  snoozedReminders: Record<string, string>
}

export const mockReminderData: ReminderData = {
  currentUserId: 'user-sales-zhangsan',

  dailyReports: [
    {
      id: 'report-100',
      userId: 'user-sales-zhangsan',
      userName: '张三',
      department: '销售部',
      reportDate: '2026-05-21',
      templateId: 'template-sales-default',
      templateType: 'sales',
      content: {
        'tomorrow-plan': '继续推进重点客户',
      },
      status: 'submitted',
      createdAt: '2026-05-21T19:00:00.000Z',
      updatedAt: '2026-05-21T19:00:00.000Z',
    },
    {
      id: 'report-101',
      userId: 'user-sales-zhangsan',
      userName: '张三',
      department: '销售部',
      reportDate: '2026-05-20',
      templateId: 'template-sales-default',
      templateType: 'sales',
      content: {
        'tomorrow-plan': '继续跟进存量客户',
      },
      status: 'submitted',
      createdAt: '2026-05-20T18:00:00.000Z',
      updatedAt: '2026-05-20T18:00:00.000Z',
    },
  ],

  // 一条触发 daily_report_comment，一条触发 daily_report_mention
  dailyComments: [
    {
      id: 'comment-1',
      reportId: 'report-100',
      userId: 'user-manager-lisi',
      userName: '李四',
      content: '这条进展很不错！',
      mentionedUsers: [],
      createdAt: '2026-05-22T09:00:00.000Z',
      readBy: [],
    },
    {
      id: 'comment-mention-1',
      reportId: 'report-101',
      userId: 'user-manager-lisi',
      userName: '李四',
      content: '@张三 这个客户情况如何？',
      mentionedUsers: ['user-sales-zhangsan'],
      createdAt: '2026-05-22T09:30:00.000Z',
      readBy: [],
    },
  ],

  // 一条 approval_pending，一条 approval_result
  approvals: [
    {
      id: 'approval-pending-1',
      userId: 'user-sales-zhangsan',
      userName: '张三',
      type: 'leave',
      title: '请假申请 - 5月25日',
      status: 'pending',
      createdAt: '2026-05-21T10:00:00.000Z',
      route: '/businesstrip',
    },
    {
      id: 'approval-result-1',
      userId: 'user-sales-zhangsan',
      userName: '张三',
      type: 'reimbursement',
      title: '差旅报销申请',
      status: 'approved',
      createdAt: '2026-05-20T10:00:00.000Z',
      updatedAt: '2026-05-21T15:00:00.000Z',
      route: '/reimbursement',
    },
  ],

  // 一条可触发 contract_expiring（7天内到期）
  contracts: [
    {
      id: 'contract-1',
      name: 'XX公司服务合同',
      customerName: 'XX公司',
      amount: 500000,
      signingDate: '2025-06-01',
      expireDate: '2026-05-27',
      status: 'active',
    },
  ],

  // 一条可触发 lead_followup_overdue
  leads: [
    {
      id: 'lead-3',
      name: 'ABC贸易公司',
      nextFollowupTime: '2026-05-21T10:00:00.000Z',
      lastFollowupAt: '2026-05-19T14:00:00.000Z',
      assignedAt: '2026-05-10T09:00:00.000Z',
    },
  ],

  snoozedReminders: {},
}
