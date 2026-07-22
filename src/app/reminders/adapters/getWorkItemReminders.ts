import type { ReminderItem } from '../types';
import type { ReminderData } from '../mockData';
import type { WorkItemStore } from '../../pages/issues/hooks/useWorkItems';

/**
 * 工作项提醒适配器
 * 将工作项事件转换为统一的 ReminderItem 格式
 *
 * 注意：此适配器接收 WorkItemStore 作为额外参数，
 * 因为工作项数据独立于 ReminderData。
 * 在 buildReminders 中需要特殊处理。
 */
export function getWorkItemReminders(
  store: WorkItemStore,
  assignedToUserId: string,
  now: Date = new Date()
): ReminderItem[] {
  const reminders: ReminderItem[] = [];
  const nowMs = now.getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  // 收集所有工作项
  const allItems = [
    ...store.requirements.map(r => ({ ...r, _type: 'requirement' as const })),
    ...store.tasks.map(t => ({ ...t, _type: 'task' as const })),
    ...store.defects.map(d => ({ ...d, _type: 'defect' as const })),
  ];

  for (const item of allItems) {
    // 1. 分配给我的待处理工作项
    if (item.assigneeId === assignedToUserId && item.status === '待处理') {
      reminders.push({
        id: `workitem_assigned_${item.id}`,
        type: 'workitem_assigned',
        title: `新的待处理${getTypeLabel(item._type)}`,
        content: `${item.projectNo} ${item.title}`,
        sourceId: item.id,
        sourceType: 'workitem',
        priority: getPriorityValue(item.priority),
        createdAt: item.createdAt,
        actionLabel: '查看',
        actionTarget: {
          kind: 'route',
          path: `/projects/${item.projectId}`,
          params: { tab: 'issues', type: item._type },
        },
      });
    }

    // 2. 即将到期（1 天内）
    if (item.dueDate && item.status !== '已完成' && item.status !== '已关闭') {
      const dueMs = new Date(item.dueDate).getTime();
      const diff = dueMs - nowMs;
      if (diff > 0 && diff <= dayMs && item.assigneeId === assignedToUserId) {
        reminders.push({
          id: `workitem_due_${item.id}`,
          type: 'workitem_due_soon',
          title: `${getTypeLabel(item._type)}即将到期`,
          content: `${item.projectNo} ${item.title} 将在 1 天内到期`,
          sourceId: item.id,
          sourceType: 'workitem',
          priority: 'high',
          createdAt: item.createdAt,
          deadline: item.dueDate,
          actionLabel: '查看',
          actionTarget: {
            kind: 'route',
            path: `/projects/${item.projectId}`,
            params: { tab: 'issues', type: item._type },
          },
        });
      }
    }

    // 3. 已逾期
    if (item.dueDate && item.status !== '已完成' && item.status !== '已关闭') {
      const dueMs = new Date(item.dueDate).getTime();
      if (dueMs < nowMs && item.assigneeId === assignedToUserId) {
        const daysOverdue = Math.floor((nowMs - dueMs) / dayMs);
        reminders.push({
          id: `workitem_overdue_${item.id}`,
          type: 'workitem_overdue',
          title: `${getTypeLabel(item._type)}已逾期`,
          content: `${item.projectNo} ${item.title} 已逾期 ${daysOverdue} 天`,
          sourceId: item.id,
          sourceType: 'workitem',
          priority: 'high',
          createdAt: item.createdAt,
          deadline: item.dueDate,
          actionLabel: '查看',
          actionTarget: {
            kind: 'route',
            path: `/projects/${item.projectId}`,
            params: { tab: 'issues', type: item._type },
          },
        });
      }
    }
  }

  return reminders;
}

function getTypeLabel(type: 'requirement' | 'task' | 'defect'): string {
  switch (type) {
    case 'requirement': return '需求';
    case 'task': return '任务';
    case 'defect': return '缺陷';
  }
}

function getPriorityValue(p: string): 'high' | 'medium' | 'low' {
  switch (p) {
    case '高': return 'high';
    case '中': return 'medium';
    case '低': return 'low';
    default: return 'medium';
  }
}
