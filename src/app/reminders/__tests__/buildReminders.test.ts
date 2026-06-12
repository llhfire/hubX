import { describe, expect, test } from 'vitest'
import { buildReminders } from '../buildReminders'
import { mockReminderData } from '../mockData'
import type { ReminderData } from '../mockData'
import type { DailyReport } from '@/app/pages/daily-report/types'

describe('buildReminders', () => {
  test('builds first-phase reminders in the expected sorted type order', () => {
    const now = new Date('2026-05-22T18:30:00')

    const reminderTypes = buildReminders(mockReminderData, now).map((item) => item.type)

    expect(reminderTypes).toEqual([
      'approval_pending',
      'daily_report_unsubmitted',
      'lead_followup_overdue',
      'contract_expiring',
      'approval_result',
      'daily_report_comment',
      'daily_report_mention',
    ])
  })

  test('does not create daily_report_unsubmitted before 18:00 local time', () => {
    const now = new Date('2026-05-22T17:59:00')

    const reminderTypes = buildReminders(mockReminderData, now).map((item) => item.type)

    expect(reminderTypes).not.toContain('daily_report_unsubmitted')
  })

  test('creates daily_report_unsubmitted at or after 18:00 local time', () => {
    const now = new Date('2026-05-22T18:00:00')

    const reminderTypes = buildReminders(mockReminderData, now).map((item) => item.type)

    expect(reminderTypes).toContain('daily_report_unsubmitted')
  })

  test('filters out a reminder when snoozed into the future', () => {
    const now = new Date('2026-05-22T18:30:00')
    const data: ReminderData = {
      ...mockReminderData,
      snoozedReminders: {
        'approval-pending-1-pending': '2026-05-23T09:00:00.000Z',
      },
    }

    const reminders = buildReminders(data, now)

    expect(reminders.map((item) => item.id)).not.toContain('approval-pending-1-pending')
    expect(reminders.map((item) => item.type)).toEqual([
      'daily_report_unsubmitted',
      'lead_followup_overdue',
      'contract_expiring',
      'approval_result',
      'daily_report_comment',
      'daily_report_mention',
    ])
  })

  test('does not generate daily_report_unsubmitted after a submitted report exists for today', () => {
    const now = new Date('2026-05-22T18:30:00')
    const submittedReport: DailyReport = {
      id: 'report-today-submitted',
      userId: mockReminderData.currentUserId,
      userName: '张三',
      department: '销售部',
      reportDate: '2026-05-22',
      templateId: 'template-sales-default',
      templateType: 'sales',
      content: {
        'tomorrow-plan': '继续跟进重点客户',
      },
      status: 'submitted',
      createdAt: '2026-05-22T09:00:00.000Z',
      updatedAt: '2026-05-22T09:00:00.000Z',
    }
    const data: ReminderData = {
      ...mockReminderData,
      dailyReports: [...mockReminderData.dailyReports, submittedReport],
    }

    const reminderTypes = buildReminders(data, now).map((item) => item.type)

    expect(reminderTypes).not.toContain('daily_report_unsubmitted')
    expect(reminderTypes).toEqual([
      'approval_pending',
      'lead_followup_overdue',
      'contract_expiring',
      'approval_result',
      'daily_report_comment',
      'daily_report_mention',
    ])
  })

  test('includes contracts expiring today but excludes contracts beyond the seven-day window', () => {
    const now = new Date('2026-05-22T18:30:00')
    const data: ReminderData = {
      ...mockReminderData,
      contracts: [
        {
          id: 'contract-today',
          name: '今天到期合同',
          customerName: 'A客户',
          amount: 100000,
          signingDate: '2026-01-01',
          expireDate: '2026-05-22',
          status: 'active',
        },
        {
          id: 'contract-eight-days',
          name: '八天后到期合同',
          customerName: 'B客户',
          amount: 200000,
          signingDate: '2026-01-01',
          expireDate: '2026-05-30',
          status: 'active',
        },
      ],
    }

    const contractReminderIds = buildReminders(data, now)
      .filter((item) => item.type === 'contract_expiring')
      .map((item) => item.id)

    expect(contractReminderIds).toContain('contract-today')
    expect(contractReminderIds).not.toContain('contract-eight-days')
  })

  test('does not generate approval reminders for other users', () => {
    const now = new Date('2026-05-22T18:30:00')
    const data: ReminderData = {
      ...mockReminderData,
      approvals: [
        ...mockReminderData.approvals,
        {
          id: 'approval-other-user',
          userId: 'user-other-lisi',
          userName: '李四',
          type: 'contract',
          title: '其他人的合同审批',
          status: 'pending',
          createdAt: '2026-05-22T12:00:00.000Z',
          route: '/contracts/other',
        },
      ],
    }

    const approvalReminderIds = buildReminders(data, now)
      .filter((item) => item.sourceType === 'approval')
      .map((item) => item.id)

    expect(approvalReminderIds).not.toContain('approval-other-user')
  })

  test('does not generate daily_report_comment for comments on other users reports', () => {
    const now = new Date('2026-05-22T18:30:00')
    const otherUsersReport: DailyReport = {
      id: 'report-other-user',
      userId: 'user-general-lisi',
      userName: '李四',
      department: '销售部',
      reportDate: '2026-05-22',
      templateId: 'template-general-default',
      templateType: 'general',
      content: {
        'tomorrow-plan': '跟进另一个项目',
      },
      status: 'submitted',
      createdAt: '2026-05-22T08:30:00.000Z',
      updatedAt: '2026-05-22T08:30:00.000Z',
    }

    const data: ReminderData = {
      ...mockReminderData,
      dailyReports: [...mockReminderData.dailyReports, otherUsersReport],
      dailyComments: [
        {
          id: 'comment-other-report',
          reportId: 'report-other-user',
          userId: 'user-manager-lisi',
          userName: '李四',
          content: '这条不是当前用户的日报',
          mentionedUsers: [],
          createdAt: '2026-05-22T10:00:00.000Z',
          readBy: [],
        },
      ],
    }

    const commentReminderIds = buildReminders(data, now)
      .filter((item) => item.type === 'daily_report_comment')
      .map((item) => item.id)

    expect(commentReminderIds).not.toContain('comment-other-report')
  })
})
