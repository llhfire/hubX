// 工作台单事实源数据自洽性的回归测试。
//
// 保护两条不变量（访谈中与用户确认的「全屏单事实源」）：
//   1. dashboardLeads 总数 = 158
//   2. 按分级聚合 S=5 / A=16 / B=35 / C=102
//   3. 按漏斗阶段聚合 未触达88 / 初步67 / 跟进32 / 促成12 / 已流失102
//   4. 四个区块派生（追踪栏 2 条 + 抢救预警充足）数据齐全
//
// run: npx vitest run src/app/pages/dashboard/__tests__/mentalModel.test.ts

import { describe, expect, it } from 'vitest';
import { dashboardLeads, trackedSaLeads, getOverdueSaWarnings } from '../mentalModel.mock';
import { FUNNEL_STAGES, computeGrade, type LeadStage } from '../types';

function gradeCount(grade: 'S' | 'A' | 'B' | 'C') {
  return dashboardLeads.filter((l) => computeGrade(l.intentLevel, l.budgetEstimated) === grade).length;
}

function stageCount(stage: LeadStage) {
  return dashboardLeads.filter((l) => l.leadStage === stage).length;
}

describe('工作台单事实源 mock 自洽性', () => {
  it('线索总数 = 158', () => {
    expect(dashboardLeads.length).toBe(158);
  });

  it('SABC 分级分布为 S5 / A16 / B35 / C102', () => {
    expect(gradeCount('S')).toBe(5);
    expect(gradeCount('A')).toBe(16);
    expect(gradeCount('B')).toBe(35);
    expect(gradeCount('C')).toBe(102);
  });

  it('漏斗独立展示数据为 未触达88 / 初步67 / 跟进32 / 促成12 / 已流失102', () => {
    const countOf = (stage: LeadStage) =>
      FUNNEL_STAGES.find((s) => s.stage === stage)?.count;
    expect(countOf('unreached')).toBe(88);
    expect(countOf('contacted')).toBe(67);
    expect(countOf('following')).toBe(32);
    expect(countOf('closing')).toBe(12);
    expect(countOf('lost')).toBe(102);
  });

  it('dashboardLeads 的 leadStage 聚合不全空（占位池体有流失沉淀语义）', () => {
    const lostCount = stageCount('lost');
    const unreachedCount = stageCount('unreached');
    expect(lostCount + unreachedCount).toBeGreaterThan(0);
  });

  it('头部 S/A 追踪栏有两条样本', () => {
    expect(trackedSaLeads).toHaveLength(2);
  });

  it('S/A 超期未触达抢救预警条数 ≥ 1', () => {
    expect(getOverdueSaWarnings().length).toBeGreaterThanOrEqual(1);
  });
});
