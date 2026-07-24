import { useMemo } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';

import { useReminders } from '../ReminderContext';
import type { ReminderItem } from '../types';
import { ReminderSnoozeMenu } from './ReminderSnoozeMenu';

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
    <Card className="w-[360px] overflow-hidden">
      <CardHeader className="border-b px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-bold">待我处理</CardTitle>
          <span className="text-sm text-muted-foreground">
            {pendingCount} 项未处理
          </span>
        </div>
      </CardHeader>

      <CardContent className="max-h-[420px] overflow-y-auto p-4">
        {reminders.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            暂无待处理提醒
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reminders.map((reminder) => (
              <Card
                key={reminder.id}
                className="rounded-[10px] border bg-muted/50"
              >
                <CardContent className="flex flex-col gap-2 p-3">
                  <span className="text-sm font-bold">{reminder.title}</span>
                  {reminder.content ? (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-0">
                      {reminder.content}
                    </p>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onOpenReminder(reminder)}
                    >
                      {reminder.actionLabel}
                    </Button>
                    <ReminderSnoozeMenu reminderId={reminder.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <div className="border-t p-4">
        <Button variant="ghost" className="w-full" onClick={onViewAll}>
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative inline-flex items-center justify-center">
          {pendingCount > 0 ? (
            <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 rounded-full px-1 text-xs">
              {pendingCount > 99 ? '99+' : pendingCount}
            </Badge>
          ) : null}
          <Bell className="h-5 w-5 cursor-pointer" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <ReminderBellDropdownContent
          reminders={previewItems}
          pendingCount={pendingCount}
          onOpenReminder={openReminder}
          onViewAll={() => navigate('/')}
        />
      </PopoverContent>
    </Popover>
  );
}
