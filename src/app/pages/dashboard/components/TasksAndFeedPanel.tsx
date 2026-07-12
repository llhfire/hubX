import { Card, Button, Empty, Tag } from '@arco-design/web-react';
import { useMemo } from 'react';
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
    <Card
      title={
        <span style={{ fontSize: 14, fontWeight: 600, color: 'hsl(220, 15%, 25%)' }}>
          日常协同与智能提醒
        </span>
      }
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        border: '1px solid hsl(220, 12%, 88%)',
        height: '100%',
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* 今日任务完成态 / 待跟进任务 */}
      {allDone ? (
        <div
          style={{
            padding: '12px 14px',
            background: 'hsl(142 76% 36% / 0.08)',
            border: `1px solid hsl(142 76% 36% / 0.22)`,
            borderRadius: 'var(--radius-md)',
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: brandColors.green }}>
            今日任务已全部完成 🎉
          </span>
        </div>
      ) : (
        <div
          style={{
            padding: '12px 14px',
            background: 'hsl(30 90% 44% / 0.08)',
            border: `1px solid hsl(30 90% 44% / 0.22)`,
            borderRadius: 'var(--radius-md)',
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: brandColors.amber }}>
            待跟进任务 {pendingCount} 件
          </span>
        </div>
      )}

      {/* 个人待办徽章计数 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220, 12%, 30%)', marginBottom: 8 }}>
          个人待办数量
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(badgeCounts) as ReminderSourceType[]).map((key) => (
            <div
              key={key}
              style={{
                padding: '8px 12px',
                background: 'hsl(220, 14%, 96%)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)' }}>
                {BADGE_LABEL[key]}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: badgeCounts[key] > 0 ? brandColors.blue : 'hsl(220, 14%, 55%)',
                }}
              >
                {badgeCounts[key]}
              </span>
            </div>
          ))}
        </div>
        {/* 日报入口 */}
        <div style={{ marginTop: 10 }}>
          <Button
            type="primary"
            size="small"
            style={{ width: '100%' }}
            onClick={onOpenDailyReport}
          >
            立即填写今日日报
          </Button>
        </div>
      </div>

      {/* 智能进度提醒（复用 S/A 超期未触达抢救名单） */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220, 12%, 30%)', marginBottom: 8 }}>
          智能进度提醒
        </div>
        {warnings.length === 0 ? (
          <Empty description="暂无紧急触达提醒" />
        ) : (
          <div className="flex flex-col gap-2">
            {warnings.map((w) => (
              <div
                key={w.leadId}
                style={{
                  padding: '8px 10px',
                  background: 'hsl(0 78% 50% / 0.04)',
                  border: `1px solid hsl(0 78% 50% / 0.14)`,
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{ fontSize: 12, color: 'hsl(220, 12%, 30%)' }}>{w.suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 团队实时动态 Feed */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220, 12%, 30%)', marginBottom: 8 }}>
          团队实时动态
        </div>
        <div className="flex flex-col gap-2">
          {teamActivityFeed.map((feed) => (
            <div
              key={feed.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 12,
                color: 'hsl(220, 12%, 30%)',
              }}
            >
              <span style={{ color: 'hsl(220, 8%, 55%)', flexShrink: 0 }}>{feed.time}</span>
              <span style={{ fontWeight: 600 }}>{feed.actor}</span>
              <span style={{ color: 'hsl(220, 12%, 30%)' }}>{feed.action}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
