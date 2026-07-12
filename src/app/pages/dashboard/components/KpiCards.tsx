import { Card } from '@arco-design/web-react';
import {
  IconArrowRise,
  IconArrowFall,
  IconCustomerService,
  IconUser,
  IconCheckCircle,
  IconApps,
} from '@arco-design/web-react/icon';
import { useReminders } from '../../../reminders/ReminderContext';

// 5 张 KPI 卡混合口径配置（详见 plan §1）。
// 砍掉参考图「团队活跃度 Top 5%」「今日跟进客户数」——前者无团队行为埋点、后者混淆线索/客户。
interface KpiConfig {
  title: string;
  // 动态值（KPI #4 待处理任务与 reminders 联动）
  value: number | string;
  comparison?: string;
  trend?: 'up' | 'down' | 'flat';
  // 趋势/状态附属文案（如「4 紧急」「活跃」）
  badge?: { text: string; tone: 'warning' | 'success' };
  unit?: string; // 金额单位 ¥ 与万 位
  icon: React.ReactNode;
  color: string;
}

const brandColors = {
  blue: 'hsl(221, 83%, 53%)',
  green: 'hsl(142, 76%, 36%)',
  amber: 'hsl(30, 90%, 44%)',
  red: 'hsl(0, 78%, 50%)',
};

export function KpiCards() {
  const { pendingCount } = useReminders();

  // KPI #4 待处理任务 = reminders 真实计数（与右下角待办联动）。
  // 当 reminders=0 时全屏联动显示「今日任务已完成」态由 TasksAndFeedPanel 承担，
  // KPI #4 自身仅显示 0 与「全部完成 🎉」附属文案。
  const taskDone = pendingCount === 0;

  const kpis: KpiConfig[] = [
    {
      title: '今日跟进次数',
      value: 16,
      comparison: '+12%',
      trend: 'up',
      icon: <IconCustomerService style={{ fontSize: 24 }} />,
      color: brandColors.blue,
    },
    {
      title: '待跟进线索',
      value: 42,
      comparison: '-8.3%',
      trend: 'down',
      badge: { text: '4 紧急', tone: 'warning' },
      icon: <IconUser style={{ fontSize: 24 }} />,
      color: brandColors.green,
    },
    {
      title: '本月合同金额',
      value: '¥852,000',
      comparison: '+8%',
      trend: 'up',
      icon: <IconCustomerService style={{ fontSize: 24 }} />,
      color: brandColors.amber,
    },
    {
      title: '待处理任务',
      value: pendingCount,
      badge: taskDone
        ? { text: '全部完成 🎉', tone: 'success' }
        : undefined,
      icon: <IconCheckCircle style={{ fontSize: 24 }} />,
      color: taskDone ? brandColors.green : brandColors.blue,
    },
    {
      title: '进行中项目',
      value: 35,
      comparison: '+5.7%',
      trend: 'up',
      icon: <IconApps style={{ fontSize: 24 }} />,
      color: brandColors.red,
    },
  ];

  // 顶部 5 张 KPI 卡 — flex 均分 + 等高 + flex-column 内部对齐
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      {kpis.map((kpi, index) => (
        <div key={index} style={{ flex: '1 1 0%', minWidth: 0, display: 'flex' }}>
          <Card
            style={{
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xs)',
              border: '1px solid hsl(220, 12%, 88%)',
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            bodyStyle={{ padding: '20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div className="flex items-center justify-between" style={{ minHeight: 68 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'hsl(220, 8%, 55%)', marginBottom: 8 }}>
                  {kpi.title}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'hsl(220, 20%, 10%)',
                    marginBottom: 8,
                    lineHeight: 1.2,
                  }}
                >
                  {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                </div>
                <div className="flex items-center gap-1">
                  {kpi.comparison && (
                    <>
                      {kpi.trend === 'up' ? (
                        <IconArrowRise style={{ fontSize: 14, color: brandColors.green }} />
                      ) : kpi.trend === 'down' ? (
                        <IconArrowFall style={{ fontSize: 14, color: brandColors.red }} />
                      ) : null}
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color:
                            kpi.trend === 'up'
                              ? brandColors.green
                              : kpi.trend === 'down'
                                ? brandColors.red
                                : 'hsl(220, 8%, 55%)',
                        }}
                      >
                        {kpi.comparison}
                      </span>
                      <span style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)', marginLeft: 2 }}>
                        环比
                      </span>
                    </>
                  )}
                  {kpi.badge && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        marginLeft: kpi.comparison ? 8 : 0,
                        color: kpi.badge.tone === 'warning' ? brandColors.amber : brandColors.green,
                      }}
                    >
                      {kpi.badge.text}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: `${kpi.color}14`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: kpi.color,
                  flexShrink: 0,
                }}
              >
                {kpi.icon}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
