import {
  ArrowUp,
  ArrowDown,
  Headphones,
  User,
  CheckCircle,
  LayoutGrid,
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
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
      icon: <Headphones className="h-6 w-6" />,
      color: brandColors.blue,
    },
    {
      title: '待跟进线索',
      value: 42,
      comparison: '-8.3%',
      trend: 'down',
      badge: { text: '4 紧急', tone: 'warning' },
      icon: <User className="h-6 w-6" />,
      color: brandColors.green,
    },
    {
      title: '本月合同金额',
      value: '¥852,000',
      comparison: '+8%',
      trend: 'up',
      icon: <Headphones className="h-6 w-6" />,
      color: brandColors.amber,
    },
    {
      title: '待处理任务',
      value: pendingCount,
      badge: taskDone
        ? { text: '全部完成 🎉', tone: 'success' }
        : undefined,
      icon: <CheckCircle className="h-6 w-6" />,
      color: taskDone ? brandColors.green : brandColors.blue,
    },
    {
      title: '进行中项目',
      value: 35,
      comparison: '+5.7%',
      trend: 'up',
      icon: <LayoutGrid className="h-6 w-6" />,
      color: brandColors.red,
    },
  ];

  // 顶部 5 张 KPI 卡 — flex 均分 + 等高 + flex-column 内部对齐
  return (
    <div className="flex gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="flex-1 min-w-0 flex">
          <Card className="h-full w-full flex flex-col">
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between min-h-[68px]">
                <div className="flex-1">
                  <div className="text-[13px] text-muted-foreground mb-2">
                    {kpi.title}
                  </div>
                  <div className="text-[28px] font-bold text-foreground mb-2 leading-tight">
                    {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                  </div>
                  <div className="flex items-center gap-1">
                    {kpi.comparison && (
                      <>
                        {kpi.trend === 'up' ? (
                          <ArrowUp className="h-3.5 w-3.5 text-green-600" />
                        ) : kpi.trend === 'down' ? (
                          <ArrowDown className="h-3.5 w-3.5 text-red-500" />
                        ) : null}
                        <span
                          className={`text-[13px] font-semibold ${
                            kpi.trend === 'up'
                              ? 'text-green-600'
                              : kpi.trend === 'down'
                                ? 'text-red-500'
                                : 'text-muted-foreground'
                          }`}
                        >
                          {kpi.comparison}
                        </span>
                        <span className="text-xs text-muted-foreground ml-0.5">
                          环比
                        </span>
                      </>
                    )}
                    {kpi.badge && (
                      <span
                        className={`text-xs font-medium ${kpi.comparison ? 'ml-2' : ''} ${
                          kpi.badge.tone === 'warning' ? 'text-amber-600' : 'text-green-600'
                        }`}
                      >
                        {kpi.badge.text}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${kpi.color}14`, color: kpi.color }}
                >
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
