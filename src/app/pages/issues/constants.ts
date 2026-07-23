// ============================================================
// 工作项模块 — 共享常量
// ============================================================

import type { WorkItemType, RequirementStatus, TaskStatus, DefectStatus, WorkItemPriority, DefectSeverity } from './types';

// ── 状态颜色映射 ──────────────────────────────────────────────
export const STATUS_COLOR_MAP: Record<string, string> = {
  // 需求
  '待处理': 'arcoblue',
  '进行中': 'orange',
  '已完成': 'green',
  '已搁置': 'gray',
  // 任务
  '已阻塞': 'red',
  // 缺陷
  '处理中': 'orange',
  '待验证': 'purple',
  '已关闭': 'green',
  '已拒绝': 'gray',
  '已重开': 'red',
};

// ── 优先级颜色映射 ────────────────────────────────────────────
export const PRIORITY_COLOR_MAP: Record<WorkItemPriority, string> = {
  '高': 'red',
  '中': 'orange',
  '低': 'blue',
};

// ── 严重程度颜色映射 ──────────────────────────────────────────
export const SEVERITY_COLOR_MAP: Record<DefectSeverity, string> = {
  '致命': 'red',
  '严重': 'orange',
  '一般': 'blue',
  '轻微': 'gray',
};

// ── 类型标签映射 ──────────────────────────────────────────────
export const TYPE_LABEL_MAP: Record<WorkItemType, string> = {
  requirement: '需求',
  task: '任务',
  defect: '缺陷',
};

// ── 类型徽章颜色 ──────────────────────────────────────────────
export const TYPE_BADGE_COLOR: Record<WorkItemType, string> = {
  requirement: '#165dff',
  task: '#00b42a',
  defect: '#f53f3f',
};

// ── 各类型的状态选项 ──────────────────────────────────────────
export const STATUS_OPTIONS: Record<WorkItemType, string[]> = {
  requirement: ['待处理', '进行中', '已完成', '已搁置'],
  task: ['待处理', '进行中', '已完成', '已阻塞'],
  defect: ['待处理', '处理中', '待验证', '已关闭', '已拒绝', '已重开'],
};

// ── 优先级选项 ────────────────────────────────────────────────
export const PRIORITY_OPTIONS: WorkItemPriority[] = ['高', '中', '低'];

// ── 严重程度选项 ──────────────────────────────────────────────
export const SEVERITY_OPTIONS: DefectSeverity[] = ['致命', '严重', '一般', '轻微'];

// ── 统计卡片颜色 ─────────────────────────────────────────────
export const STATS_COLORS = {
  requirement: '#165dff',
  task: '#00b42a',
  defect: '#f53f3f',
} as const;

// ── 间距系统 ──────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;
