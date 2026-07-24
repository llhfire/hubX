import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import type { SnoozeOptionId } from '../types';
import { useReminders } from '../ReminderContext';

export interface ReminderSnoozeOption {
  id: SnoozeOptionId;
  label: string;
}

const SNOOZE_OPTIONS: ReminderSnoozeOption[] = [
  { id: 'one_hour', label: '1小时后提醒' },
  { id: 'today_eod', label: '今天下班前提醒' },
  { id: 'tomorrow_morning', label: '明天上午提醒' },
];

export function getReminderSnoozeOptions(): ReminderSnoozeOption[] {
  return SNOOZE_OPTIONS;
}

interface ReminderSnoozeMenuProps {
  reminderId: string;
  buttonText?: string;
  buttonSize?: 'mini' | 'small' | 'default' | 'large';
}

function mapButtonSize(size: 'mini' | 'small' | 'default' | 'large'): 'sm' | 'default' | 'lg' {
  switch (size) {
    case 'mini':
    case 'small':
      return 'sm';
    case 'large':
      return 'lg';
    default:
      return 'default';
  }
}

export function ReminderSnoozeMenu({
  reminderId,
  buttonText = '稍后处理',
  buttonSize = 'mini',
}: ReminderSnoozeMenuProps) {
  const { snoozeReminder } = useReminders();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={mapButtonSize(buttonSize)} variant="secondary">
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {SNOOZE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => snoozeReminder(reminderId, option.id as SnoozeOptionId)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
