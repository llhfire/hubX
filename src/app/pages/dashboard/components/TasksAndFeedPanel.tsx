import { useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useReminders } from '../../../reminders/ReminderContext';
import { getOverdueSaWarnings } from '../mentalModel.mock';
import { teamActivityFeed } from '../teamActivity.mock';
import type { ReminderSourceType } from '../../../reminders/types';

const brandColors = {
  blue: 'hsl(221, 83%, 53%)',
  green: 'hsl(142, 76%, 36%)',
  amber: 'hsl(30, 90%, 44%)',
  red: 'hsl(0, 78%, 50%)',
};

// reminders sourceType → 待办徽章文案
const BADGE_LABEL: Record<ReminderSourceType, string> = {
  daily_report: '日报待填写',
  approval: '审批待处理',
  contract: '合同待处理',
  lead: '线索待跟进',
};

/**
 * 日常协同与智能提醒（区块 ⑤，右下角）。
 *
 * 由 reminders 上下文派生「待办徽章 + 日报入口」，复用 S/A 超期未触达抢救名单
 * 作「智能进度提醒」，加上团队动态 Feed（见 plan §5 + 访谈问题 10 决策）。
 *
 * KPI #4 与右下角待办联动：pendingCount = 0 时本组件显示「今日任务已全部完成 🎉」。
 */
export function TasksAndFeedPanel({ onOpenDailyReport }: { onOpenDailyReport?: () => void }) {
  const { pendingCount, reminders } = useReminders();

  // 按 sourceType 分桶 → 待办徽章计数
  const badgeCounts = useMemo(() => {
    const counts: Record<ReminderSourceType, number> = {
      daily_report: 0,
      approval: 0,
      contract: 0,
      lead: 0,
    };
    for (const r of reminders) {
      counts[r.sourceType] += 1;
    }
    return counts;
  }, [reminders]);

  const warnings = useMemo(() => getOverdueSaWarnings(), []);

  const allDone = pendingCount === 0;

  return (
    <Card className="h-full flex-1 w-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">日常协同与智能提醒</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* 今日任务完成态 / 待跟进任务 */}
        {allDone ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3.5 text-center">
            <span className="text-sm font-medium text-green-600">
              今日任务已全部完成 🎉
            </span>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3.5">
            <span className="text-[13px] font-semibold text-amber-600">
              待跟进任务 {pendingCount} 件
            </span>
          </div>
        )}

        {/* 个人待办徽章计数 */}
        <div className="mb-4">
          <div className="text-[13px] font-medium text-foreground mb-2">
            个人待办数量
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(badgeCounts) as ReminderSourceType[]).map((key) => (
              <div
                key={key}
                className="px-3 py-2 bg-muted/50 rounded-lg flex items-center justify-between"
              >
                <span className="text-xs text-muted-foreground">
                  {BADGE_LABEL[key]}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    badgeCounts[key] > 0 ? 'text-blue-600' : 'text-muted-foreground'
                  }`}
                >
                  {badgeCounts[key]}
                </span>
              </div>
            ))}
          </div>
          {/* 日报入口 */}
          <div className="mt-2.5">
            <Button
              className="w-full"
              size="sm"
              onClick={onOpenDailyReport}
            >
              立即填写今日日报
            </Button>
          </div>
        </div>

        {/* 智能进度提醒（复用 S/A 超期未触达抢救名单） */}
        <div className="mb-4">
          <div className="text-[13px] font-medium text-foreground mb-2">
            智能进度提醒
          </div>
          {warnings.length === 0 ? (
            <div className="text-xs text-muted-foreground">暂无紧急触达提醒</div>
          ) : (
            <div className="flex flex-col gap-2">
              {warnings.map((w) => (
                <div
                  key={w.leadId}
                  className="px-2.5 py-2 bg-red-50 border border-red-200 rounded-lg"
                >
                  <span className="text-xs text-foreground">{w.suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 团队实时动态 Feed */}
        <div>
          <div className="text-[13px] font-medium text-foreground mb-2">
            团队实时动态
          </div>
          <div className="flex flex-col gap-2">
            {teamActivityFeed.map((feed) => (
              <div
                key={feed.id}
                className="flex items-start gap-2 text-xs text-foreground"
              >
                <span className="text-muted-foreground flex-shrink-0">{feed.time}</span>
                <span className="font-semibold">{feed.actor}</span>
                <span>{feed.action}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
