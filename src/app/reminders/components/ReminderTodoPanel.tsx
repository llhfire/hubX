import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useReminders } from '../ReminderContext';
import type { ReminderItem, ReminderPriority } from '../types';
import { ReminderSnoozeMenu } from './ReminderSnoozeMenu';

const PRIORITY_LABEL_MAP: Record<ReminderPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

const PRIORITY_BADGE_VARIANT: Record<ReminderPriority, 'destructive' | 'default' | 'secondary'> = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
};

export function getReminderPriorityLabel(priority: ReminderPriority): string {
  return PRIORITY_LABEL_MAP[priority];
}

interface ReminderTodoPanelProps {
  onOpenDailyReport: () => void;
  /** 透传外层 Card 样式（如工作台场景需要 height:100% 与相邻卡片等高） */
  style?: React.CSSProperties;
}

export function ReminderTodoPanel({ onOpenDailyReport, style }: ReminderTodoPanelProps) {
  const navigate = useNavigate();
  const { reminders } = useReminders();

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

  return (
    <Card style={{ marginBottom: 24, ...style, display: 'flex', flexDirection: 'column' }}>
      <CardHeader>
        <CardTitle>待我处理</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            暂无待处理提醒
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {reminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-sm">{reminder.title}</span>
                    <Badge variant={PRIORITY_BADGE_VARIANT[reminder.priority]}>
                      {getReminderPriorityLabel(reminder.priority)}
                    </Badge>
                  </div>
                  {reminder.content ? (
                    <p className="text-sm text-muted-foreground m-0">
                      {reminder.content}
                    </p>
                  ) : null}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openReminder(reminder)}>
                      {reminder.actionLabel}
                    </Button>
                    <ReminderSnoozeMenu reminderId={reminder.id} buttonSize="small" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
