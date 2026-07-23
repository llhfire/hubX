import type { WorkItemStats as StatsType } from '../types';
import { SPACING } from '../constants';

interface StatsProps {
  stats: StatsType;
}

export function WorkItemStats({ stats }: StatsProps) {
  // TAPD 风格不使用独立的统计卡片，统计集成在 Tab 标签中
  // 此组件保留为空，由 WorkItemsPage 的 Tab 标签展示统计
  return null;
}
