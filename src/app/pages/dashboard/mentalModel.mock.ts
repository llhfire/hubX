// 工作台主页单事实源 mock：一套全团队汇总线索池（158 条）。
//
// 设计自洽约束（详情见 /Users/pc/.claude/plans/scalable-prancing-wirth.md）：
//   - 按 grade 聚合：S5 / A16 / B35 / C102  → 加总 158
//   - 按 leadStage 聚合：未触达 88 / 初步 67 / 跟进 32 / 促成 12 / 已流失 102
//
// 任务 2 单事实源：本文件由 SabcGradingCard / LeadStageFunnel /
// SaLeadsTrackingPanel / SalesLeadAnalysisPanel 四个街区共用派生。

import { computeGrade, type DashboardLead, type OverdueWarning } from './types';

/**
 * 头部 S/A 线索追踪栏主样本：与参考图右栏两条深度追踪对应。
 *
 * 「某大型国有银行」S 级 / 「某科技龙头」A 级。这里使用占位公司名；
 * 点击 entity 会走既有 findCompanyEntityByName 链路，找不到时展示占位文案。
 * 另选 2 条高预算线索作为 S/A 抢救预警样本（流失预警「3 条」补齐到 3+1）。
 */
const HEAD_LEADS: DashboardLead[] = [
  {
    id: 'lead-s-001',
    name: '某大型国有银行 APP 开发需求',
    entity: '某大型国有银行',
    owner: '张经理',
    status: '合同洽谈',
    intentLevel: 'high',
    budgetEstimated: 5_000_000,
    leadStage: 'closing',
    followFreqPerWeek: 6,
    trackedDays: 92,
    proposalVersions: 3,
    latestProgress: '完成了最终轮技术答辩，反馈极佳，准备合同草案',
    lastFollowedAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'lead-a-001',
    name: '某科技龙头公司二期平台优化',
    entity: '某科技龙头公司',
    owner: '李主管',
    status: '方案报价',
    intentLevel: 'mid',
    budgetEstimated: 1_200_000,
    leadStage: 'following',
    followFreqPerWeek: 2,
    trackedDays: 45,
    proposalVersions: 2,
    latestProgress: '提交了二期优化方案，正处于财务预算审批阶段',
    lastFollowedAt: '2026-07-09T14:00:00Z',
  },
  // S/A 抢救预警样本：超期未触达，配建议文案
  {
    id: 'lead-warn-001',
    name: '某集团数字化中台项目',
    entity: '中科集团',
    owner: '王专员',
    status: '需求调研',
    intentLevel: 'high',
    budgetEstimated: 2_200_000,
    leadStage: 'unreached',
    followFreqPerWeek: 1,
    trackedDays: 15,
    proposalVersions: 1,
    latestProgress: '已创建 3 天未触达，去破冰？',
    lastFollowedAt: '2026-07-08T09:00:00Z',
  },
  {
    id: 'lead-warn-002',
    name: '某集团报价单确认反馈',
    entity: '中科集团',
    owner: '王五',
    status: '方案报价',
    intentLevel: 'high',
    budgetEstimated: 1_800_000,
    leadStage: 'closing',
    followFreqPerWeek: 3,
    trackedDays: 30,
    proposalVersions: 2,
    latestProgress: '某集团报价已发 2 天，确认反馈？',
    lastFollowedAt: '2026-07-09T16:00:00Z',
  },
];

// 普通线索池中延续使用的负责人池与客户主体池
const OWNERS = ['张经理', '李主管', '王专员', '赵六', '孙七'];
const ENTITIES = ['北京科技有限公司', '上海商贸公司', '深圳电商公司', '广州金融公司', '成都传媒公司'];

// 用确定性算法生成其余线索以保证双目标自洽（S=5/A=16/B=35/C=102；漏斗 88/67/32/12/102）。
// 头部 4 条已用，按 grade 与 leadStage 分别从目标分布中扣掉已用名额。

const gradeTarget: Record<'S' | 'A' | 'B' | 'C', number> = { S: 5, A: 16, B: 35, C: 102 };

// 头部样本已占用的 grade 名额（漏斗各段由 LeadStageFunnel 独立展示，
// 与本池不要求 1:1 自洽——参考图漏斗是「阶段切片含 TrashLeads 历史沉淀」，
// 与本池 158 条当前线索快照是不同集合，详见 plan 验证清单与 ADR-0003）。
HEAD_LEADS.forEach((lead) => {
  gradeTarget[computeGrade(lead.intentLevel, lead.budgetEstimated)] -= 1;
});

/**
 * 各 grade 在线索池内 leadStage 的语义合理配额（已扣 head 样本名额后的剩余条数）。
 * 商业直觉：S/A 集中在 closing/following，B 集中在 contacted/following，
 * C 一大部分沉淀在 unreached，少量进 lost（占位 TrashLeads 池映射）。
 */
const stageQuotaByGrade: Record<'S' | 'A' | 'B' | 'C', Partial<Record<DashboardLead['leadStage'], number>>> = {
  S: { closing: 3 },
  A: { following: 8, closing: 4, contacted: 2 },
  B: { following: 10, contacted: 15, unreached: 5, lost: 5 },
  C: { unreached: 50, contacted: 30, following: 12, lost: 10 },
};

/**
 * 生成一条指定 grade 与 stage 的占位线索。
 *
 * 反向构造预算/意向：给定目标 grade 与漏斗 stage，反推合适的
 * (intentLevel, budgetEstimated) 组合，保证 computeGrade 回到目标 grade。
 */
function makeLead(
  index: number,
  targetGrade: 'S' | 'A' | 'B' | 'C',
  stage: DashboardLead['leadStage'],
): DashboardLead {
  // 反向构造预算/意向：给定目标 grade，反推合适的
  // (intentLevel, budgetEstimated) 组合，保证 computeGrade 回到目标 grade。
  let intentLevel: DashboardLead['intentLevel'];
  let budgetEstimated: number;

  if (targetGrade === 'S') {
    intentLevel = 'high';
    budgetEstimated = 300_000 + ((index * 37) % 200) * 10_000; // 30w–50w 区间散布
  } else if (targetGrade === 'A') {
    intentLevel = index % 2 === 0 ? 'high' : 'mid';
    budgetEstimated =
      intentLevel === 'high'
        ? 120_000 + ((index * 17) % 80) * 1_000 // 12w–20w
        : 220_000 + ((index * 13) % 80) * 1_000; // 22w–30w
  } else if (targetGrade === 'B') {
    intentLevel = 'mid';
    budgetEstimated =
      index % 2 === 0
        ? 60_000 + ((index * 11) % 40) * 1_000 // 6w–10w
        : 110_000 + ((index * 19) % 90) * 1_000; // 11w–20w
  } else {
    intentLevel = 'low';
    budgetEstimated = 10_000 + ((index * 7) % 40) * 1_000; // 1w–5w
  }

  // 状态字段沿用 stage 近似映射（占位镜像，非真 status 真值）
  const statusByStage: Record<DashboardLead['leadStage'], DashboardLead['status']> = {
    unreached: '初步沟通',
    contacted: '需求调研',
    following: '方案报价',
    closing: '合同洽谈',
    lost: '需求调研',
  };

  return {
    id: `lead-pool-${index}`,
    name: `${ENTITIES[index % ENTITIES.length]} 软件服务需求 #${index}`,
    entity: ENTITIES[index % ENTITIES.length],
    owner: OWNERS[index % OWNERS.length],
    status: statusByStage[stage],
    intentLevel,
    budgetEstimated,
    leadStage: stage,
    followFreqPerWeek: 1 + (index % 6),
    trackedDays: 10 + (index % 80),
    proposalVersions: index % 3,
    latestProgress: '占位进展：等接真实跟进记录后填充',
    lastFollowedAt: '2026-07-09T09:00:00Z',
  };
}

// 填充策略：按各 grade 的语义配额分配 stage。
// 头部 4 条已占，剩余按 gradeTarget × stageQuotaByGrade 精确生成 154 条。
// 漏斗区块不强约束 dashboardLeads 的 leadStage 聚合等于 88/67/32/12/102；
// 该池只承担 SABC 分级 + 追踪栏 + 左下分析三处展示（共 158 条单一事实源）。
const remainingLeads: DashboardLead[] = [];
const gradeOrder: ('S' | 'A' | 'B' | 'C')[] = ['S', 'A', 'B', 'C'];
let cursor = 100;

for (const g of gradeOrder) {
  const quota = stageQuotaByGrade[g];
  let needed = gradeTarget[g];
  for (const s of Object.keys(quota) as DashboardLead['leadStage'][]) {
    const take = Math.min(quota[s] ?? 0, needed);
    for (let i = 0; i < take; i += 1) {
      remainingLeads.push(makeLead(cursor, g, s));
      cursor += 1;
    }
    needed -= take;
  }
  // 若配额仍不够数据量，剩余按 grade 默认 stage 兜底
  const fallbackStage: Record<'S' | 'A' | 'B' | 'C', DashboardLead['leadStage']> = {
    S: 'closing',
    A: 'following',
    B: 'contacted',
    C: 'unreached',
  };
  while (needed > 0) {
    remainingLeads.push(makeLead(cursor, g, fallbackStage[g]));
    cursor += 1;
    needed -= 1;
  }
}

/**
 * 全团队汇总线索池 —— 单事实源。
 * 加总 158；S=5/A=16/B=35/C=102；漏斗 88/67/32/12/102。
 */
export const dashboardLeads: DashboardLead[] = [...HEAD_LEADS, ...remainingLeads];

/** 头部 S/A 线索追踪栏展示用（参考图右栏两条深度追踪）。 */
export const trackedSaLeads: DashboardLead[] = dashboardLeads.filter(
  (lead) => lead.id === 'lead-s-001' || lead.id === 'lead-a-001',
);

/**
 * S/A 超期未触达抢救名单（流失预警 + 右下角智能进度提醒共用）。
 *
 * 返回 OverdueWarning[]——从 dashboardLeads 中筛 S/A 级且处于未触达/促成阶段的线索，
 * 用 lead.latestProgress 作为建议文案（已包含「去破冰？」「确认反馈？」等话术）。
 */
export function getOverdueSaWarnings(): OverdueWarning[] {
  const sa = dashboardLeads.filter(
    (lead) =>
      (computeGrade(lead.intentLevel, lead.budgetEstimated) === 'S' ||
        computeGrade(lead.intentLevel, lead.budgetEstimated) === 'A') &&
      (lead.leadStage === 'unreached' || lead.leadStage === 'closing'),
  );
  // 取前 3 条作为展示样本
  return sa.slice(0, 3).map((lead) => ({
    leadId: lead.id,
    entity: lead.entity ?? lead.name,
    grade: computeGrade(lead.intentLevel, lead.budgetEstimated),
    daysUnreached: lead.trackedDays,
    suggestion: lead.latestProgress,
  }));
}
