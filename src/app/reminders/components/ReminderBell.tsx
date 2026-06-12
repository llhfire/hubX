import { useMemo } from 'react';
import { Badge, Button, Card, Dropdown, Empty, Space, Typography } from '@arco-design/web-react';
import { IconNotification } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router';
import { useReminders } from '../ReminderContext';
import type { ReminderItem } from '../types';
import { ReminderSnoozeMenu } from './ReminderSnoozeMenu';

const Text = Typography.Text;
const Paragraph = Typography.Paragraph;

const dropdownShellStyle = {
  width: 360,
  border: '1px solid var(--color-border-2)',
  borderRadius: 12,
  background: 'var(--color-bg-2)',
  boxShadow: '0 8px 24px rgba(15, 35, 95, 0.12)',
  overflow: 'hidden' as const,
};

const dropdownHeaderStyle = {
  padding: '16px 16px 12px',
  borderBottom: '1px solid var(--color-border-2)',
  background: 'var(--color-bg-2)',
};

const dropdownListStyle = {
  maxHeight: 420,
  overflowY: 'auto' as const,
  padding: 16,
  background: 'var(--color-bg-2)',
};

const dropdownFooterStyle = {
  padding: 16,
  borderTop: '1px solid var(--color-border-2)',
  background: 'var(--color-bg-2)',
};

const reminderItemCardStyle = {
  background: 'var(--color-fill-1)',
  border: '1px solid var(--color-border-2)',
  borderRadius: 10,
};

export function buildReminderBellPreviewItems(reminders: ReminderItem[]): ReminderItem[] {
  return reminders.slice(0, 5);
}

export function hasDailyReportUnsubmittedReminder(reminders: ReminderItem[]): boolean {
  return reminders.some((reminder) => reminder.type === 'daily_report_unsubmitted');
}

interface ReminderBellProps {
  onOpenDailyReport: () => void;
}

interface ReminderBellDropdownContentProps {
  reminders: ReminderItem[];
  pendingCount: number;
  onOpenReminder: (reminder: ReminderItem) => void;
  onViewAll: () => void;
}

export function ReminderBellDropdownContent({
  reminders,
  pendingCount,
  onOpenReminder,
  onViewAll,
}: ReminderBellDropdownContentProps) {
  return (
    <Card style={dropdownShellStyle} bodyStyle={{ padding: 0 }}>
      <div style={dropdownHeaderStyle}>
        <Text bold>待我处理</Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>
          {pendingCount} 项未处理
        </Text>
      </div>

      <div style={dropdownListStyle}>
        {reminders.length === 0 ? (
          <Empty description="暂无待处理提醒" />
        ) : (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {reminders.map((reminder) => (
              <Card key={reminder.id} size="small" style={reminderItemCardStyle}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Text bold>{reminder.title}</Text>
                  {reminder.content ? (
                    <Paragraph type="secondary" style={{ marginBottom: 0 }} ellipsis={{ rows: 2 }}>
                      {reminder.content}
                    </Paragraph>
                  ) : null}
                  <Space>
                    <Button size="mini" type="primary" onClick={() => onOpenReminder(reminder)}>
                      {reminder.actionLabel}
                    </Button>
                    <ReminderSnoozeMenu reminderId={reminder.id} />
                  </Space>
                </Space>
              </Card>
            ))}
          </Space>
        )}
      </div>

      <div style={dropdownFooterStyle}>
        <Button type="text" onClick={onViewAll}>
          查看全部待我处理
        </Button>
      </div>
    </Card>
  );
}

export function ReminderBell({ onOpenDailyReport }: ReminderBellProps) {
  const navigate = useNavigate();
  const { reminders, pendingCount } = useReminders();

  const previewItems = useMemo(() => buildReminderBellPreviewItems(reminders), [reminders]);

  const openReminder = (reminder: ReminderItem) => {
    if (reminder.actionTarget.kind === 'modal') {
      onOpenDailyReport();
      return;
    }

    const search = reminder.actionTarget.params
      ? new URLSearchParams(reminder.actionTarget.params).toString()
      : '';

    navigate({
      pathname: reminder.actionTarget.path,
      search,
    });
  };

  const dropContent = (
    <ReminderBellDropdownContent
      reminders={previewItems}
      pendingCount={pendingCount}
      onOpenReminder={openReminder}
      onViewAll={() => navigate('/')}
    />
  );

  return (
    <Dropdown position="br" trigger="click" droplist={dropContent}>
      <Badge count={pendingCount} maxCount={99}>
        <IconNotification style={{ fontSize: 20, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
}
