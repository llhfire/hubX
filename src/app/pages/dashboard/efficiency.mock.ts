// 工作台中部区块 ④ 效率健康度 + 折线趋势占位数据。
//
// 4 个诊断指标与「平均跟进间隔/平均阶段推进/平均成单周期/整体流失率」对齐
// （详见 plan §2 区块 ④）。智能建议 = 单段静态字符串，TODO 接规则引擎。

import type { EfficiencyMetric } from './types';

/** 效率健康度看板 4 项指标。 */
export const efficiencyMetrics: EfficiencyMetric[] = [
  { key: 'follow-interval', label: '平均跟进间隔', value: '1.2h' },
  { key: 'stage-progress', label: '平均阶段推进周期', value: '4.5d' },
  { key: 'closing-cycle', label: '平均成单周期', value: '12d' },
  { key: 'churn-rate', label: '整体流失率', value: '24%', delta: '+2.3%' },
];

/**
 * 系统智能建议（单段静态字符串占位）。
 *
 * TODO：未来接入规则引擎——根据漏斗「促成阶段积压」「平均成单周期偏长」
 * 等条件动态生成建议文案。当前为占位文字。
 */
export const efficiencySuggestion: string =
  '促成阶段生命机会积压过多（平均 12 天），建议管理层介入协同报价谈判。';

/**
 * 跟进客户趋势折线数据（区块 ①）。
 *
 * 本周 vs 上周每日跟进次数对比，10-20 次区间波动；
 * 7/11 当天环比 +0.0%（持平）。单位与 KPI #1「今日跟进次数」对齐 = 跟进次数。
 *
 * 注：本周最后一个点（today）会由 FollowTrendChart 组件复用 ReminderContext
 * 每分钟 tick 微调，营造 LIVE 动态感。
 */
export interface FollowTrendPoint {
  day: string; // '周一' ... '周日'
  thisWeek: number; // 本周该日跟进次数
  lastWeek: number; // 上周该日跟进次数
}

export const followTrend: FollowTrendPoint[] = [
  { day: '周一', thisWeek: 12, lastWeek: 11 },
  { day: '周二', thisWeek: 15, lastWeek: 13 },
  { day: '周三', thisWeek: 18, lastWeek: 16 },
  { day: '周四', thisWeek: 14, lastWeek: 17 },
  { day: '周五', thisWeek: 19, lastWeek: 18 },
  { day: '周六', thisWeek: 10, lastWeek: 9 },
  { day: '周日', thisWeek: 16, lastWeek: 16 }, // 7/11 当天环比持平 +0.0%
];

/** 今日环比（参考图所示 +0.0%）。 */
export const todayTrendDelta: string = '+0.0%';
