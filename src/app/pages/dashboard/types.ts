// 工作台主页占位类型与派生纯函数。
//
// 本文件集中定义「工作台重做（2026-07）」引入占位业务概念的字段与逻辑：
//   - SABC 线索分级（对象 = 线索，详见 CONTEXT.md「SABC 分级」）
//   - 线索推进漏斗字段 leadStage（独立于现有 status，见 ADR-0003）
//   - 效率健康度衍生指标、团队动态 Feed
//
// 这些字段是档位 2「结构化占位」：未接入全系统业务规则、仅用于工作台可视化。
// 未来选 B 路线接真实数据时，替换 mentalModel.mock 与下列派生函数即可。

/** 线索意向等级（扩展现有「高/中」两档到四档）。 */
export type IntentLevel = 'high' | 'mid' | 'low' | 'none';

/** 预算档（与左下角预算区间柱状图同源，二者共用一套档边界）。 */
export type BudgetTier = 'under5w' | '5to10w' | '10to20w' | '20wplus';

/** SABC 分级结果。 */
export type SabcGrade = 'S' | 'A' | 'B' | 'C';

/**
 * 线索推进漏斗阶段。
 *
 * TODO: 接入真实业务数据时，需评估与现有线索 `status` 字段的映射/合并策略
 *       （见 docs/adr/0003-漏斗阶段独立字段而非复用status.md）。
 *       工作台漏斗区块只读此字段，绝不读现有 `status`。
 */
export type LeadStage = 'unreached' | 'contacted' | 'following' | 'closing' | 'lost';

/** 预算档阈值边界（¥）。与左下角预算区间柱状图的档位一致。 */
export const BUDGET_TIERS: { tier: BudgetTier; min: number; max: number; label: string }[] = [
  { tier: 'under5w', min: 0, max: 50_000, label: '5万以下' },
  { tier: '5to10w', min: 50_000, max: 100_000, label: '5-10万' },
  { tier: '10to20w', min: 100_000, max: 200_000, label: '10-20万' },
  { tier: '20wplus', min: 200_000, max: Number.POSITIVE_INFINITY, label: '20万以上' },
];

/** 预算金额（¥）→ 预算档。 */
export function classifyBudget(amount: number): BudgetTier {
  for (const { tier, min, max } of BUDGET_TIERS) {
    if (amount >= min && amount < max) return tier;
  }
  return 'under5w';
}

/**
 * 工作台线索占位实体。
 *
 * 复用既有线索字段（name / status / owner / entity），新增 5 个占位字段——
 * intentLevel / budgetEstimated / leadStage / proposalVersions / latestProgress。
 */
export interface DashboardLead {
  id: string;
  /** 线索展示名（如「企业管理系统定制」）。 */
  name: string;
  /** 关联客户主体名（用于 S/A 追踪栏展示，复用现有 entity 链路）。 */
  entity?: string;
  /** 负责人。 */
  owner: string;
  /** 现有线索状态字段的占位镜像，非现有页面读的 status 真值。 */
  status: '需求调研' | '方案报价' | '合同洽谈' | '初步沟通';
  intentLevel: IntentLevel;
  /** 预估预算（¥），占位新字段。 */
  budgetEstimated: number;
  /** 漏斗阶段，独立占位字段（ADR-0003）。 */
  leadStage: LeadStage;
  /** 跟进频次（次/周），占位新字段。 */
  followFreqPerWeek: number;
  /** 创建以来已跟踪天数，占位派生字段。 */
  trackedDays: number;
  /** 已推方案版本数，占位新字段。TODO 未来连到合同 Wizard。 */
  proposalVersions: number;
  /** 最新一句话进展，占位新字段。TODO 未来接 LeadDetail 跟进记录最新一条。 */
  latestProgress: string;
  /** 最后跟进时间戳（用于派生「平均跟进间隔」），占位新字段。 */
  lastFollowedAt?: string;
}

/**
 * SABC 分级规则：意向 × 预算 二维矩阵（CONTEXT.md「SABC 分级」已落档）。
 *
 *   S = 高意向 + ≥20万预算
 *   A = (高意向 + 10-20万) 或 (中意向 + ≥20万)
 *   B = 中意向 + 5-20万
 *   C = 其余（低/无意向 或 预算低于 5万）
 */
export function computeGrade(intentLevel: IntentLevel, budgetEstimated: number): SabcGrade {
  const tier = classifyBudget(budgetEstimated);

  if (intentLevel === 'high' && tier === '20wplus') return 'S';
  if (
    (intentLevel === 'high' && tier === '10to20w') ||
    (intentLevel === 'mid' && tier === '20wplus')
  ) {
    return 'A';
  }
  if (intentLevel === 'mid' && (tier === '5to10w' || tier === '10to20w')) return 'B';
  return 'C';
}

/** 漏斗阶段标签 + 顺序（与 LeadStage 取值一一对应）。 */
export const LEAD_STAGE_LABELS: { stage: LeadStage; label: string; highlight?: 'blue' | 'orange' }[] = [
  { stage: 'unreached', label: '未触达' },
  { stage: 'contacted', label: '初步沟通' },
  { stage: 'following', label: '跟进中', highlight: 'blue' },
  { stage: 'closing', label: '促成阶段', highlight: 'orange' },
  { stage: 'lost', label: '已流失' },
];

/** 团队动态 Feed 占位实体。TODO 未来需补团队事件流系统（CONTEXT 第四阶段「AI 驱动」子集）。 */
export interface TeamActivity {
  id: string;
  time: string; // 形如「08:39」
  actor: string; // 姓名
  action: string; // 已分词的动态文案片段
}

/** 效率健康度指标（工作台区块 ④ 衍生）。 */
export interface EfficiencyMetric {
  key: string;
  label: string;
  value: string; // 例如「1.2h」「4.5d」「24%」
  delta?: string; // 占位环比
}

/** S/A 级线索中超期未触达的预警明细项（与区块 ② 流失预警共用同一组数据，不重复建模）。 */
export interface OverdueWarning {
  leadId: string;
  entity: string;
  grade: SabcGrade;
  daysUnreached: number;
  suggestion: string; // 建议式提醒文案
}

/** 按字段聚合的计数助手（用于左下角分类分析）。 */
export function countBy<T, K extends string | number>(
  items: T[],
  keyOf: (item: T) => K,
): Record<K, number> {
  const result = {} as Record<K, number>;
  for (const item of items) {
    const k = keyOf(item);
    result[k] = (result[k] ?? 0) + 1;
  }
  return result;
}

/**
 * 跟进过程漏斗展示数据（区块 ③）。
 *
 * 这 5 段是漏斗区块的独立展示值，不要求与 dashboardLeads(158 条) 的 leadStage 聚合
 * 1:1 自洽——参考图漏斗是「阶段切片含 TrashLeads 历史沉淀」，与单事实源线索池
 * 是不同的集合口径（详见 plan 验证清单 + ADR-0003 + CONTEXT.md「线索推进漏斗」边界）。
 * 已流失段对应 CONTEXT 第 58 行的「垃圾线索」独立池累计。
 */
export const FUNNEL_STAGES: { stage: LeadStage; label: string; count: number; highlight?: 'blue' | 'orange' }[] = [
  { stage: 'unreached', label: '未触达', count: 88 },
  { stage: 'contacted', label: '初步沟通', count: 67 },
  { stage: 'following', label: '跟进中', count: 32, highlight: 'blue' },
  { stage: 'closing', label: '促成阶段', count: 12, highlight: 'orange' },
  { stage: 'lost', label: '已流失', count: 102 },
];
