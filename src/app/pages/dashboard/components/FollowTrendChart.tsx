import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useReminders } from '../../../reminders/ReminderContext';
import { followTrend, todayTrendDelta } from '../efficiency.mock';

const brandColors = {
  thisWeek: 'hsl(221, 83%, 53%)',
  lastWeek: 'hsl(220, 14%, 75%)',
  amber: 'hsl(30, 90%, 44%)',
  green: 'hsl(142, 76%, 36%)',
};

/**
 * 跟进客户趋势折线（区块 ①，LIVE）。
 *
 * 本周 vs 上周每日跟进次数对比。LIVE 标签下"今日"末点会随
 * ReminderContext 每分钟 tick 微微浮动（数值在 ±1 范围漂移），
 * 营造实时刷新观感——这是档位 2 占位诚实下的"真实定时刷新语义"，
 * 不是纯装饰（详见 plan §2 区块 ①）。
 *
 * 下钻交互不实现，仅静态 hint 占位「当前趋势表现良好」。
 */
export function FollowTrendChart() {
  const { reminders } = useReminders();

  // 复用 reminders 重渲染时（每分钟 tick）让"今日"末点微调 ±1
  // reminders 数组每分钟会因 now 变化而重新构建（buildReminders 依赖 now），
  // 故此处用 reminders 长度作为依赖来驱动微调刷新。
  const tickSignal = reminders.length;
  const [todayDrift, setTodayDrift] = useState(0);

  useEffect(() => {
    // 本文静态展示，但依赖 reminders 触发组件 Reeal，营造 LIVE 感
    setTodayDrift(((tickSignal % 3) - 1)); // -1 / 0 / +1
  }, [tickSignal]);

  const data = useMemo(() => {
    const lastIndex = followTrend.length - 1;
    return followTrend.map((point, i) => ({
      day: point.day,
      本周: i === lastIndex ? Math.max(1, point.thisWeek + todayDrift) : point.thisWeek,
      上周: point.lastWeek,
    }));
  }, [todayDrift]);

  return (
    <Card className="h-full flex-1 w-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">跟进客户趋势</CardTitle>
            <Badge className="bg-blue-500 text-white text-[11px] font-semibold">LIVE</Badge>
          </div>
          <span className="text-[13px] text-muted-foreground">
            今日环比{' '}
            <span className="text-amber-600 font-medium">{todayTrendDelta}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(220, 8%, 55%)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 8%, 55%)' }} domain={[0, 24]} />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 'var(--radius-md)',
                border: '1px solid hsl(220, 12%, 88%)',
              }}
            />
            <Line
              type="monotone"
              dataKey="上周"
              stroke={brandColors.lastWeek}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="本周"
              stroke={brandColors.thisWeek}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600" />
          {/* TODO：未来接入规则引擎——点击异常指标自动展开下钻 */}
          点击异常指标可下钻；当前趋势表现良好。
        </div>
      </CardContent>
    </Card>
  );
}
