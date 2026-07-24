import { useState } from 'react';
import { KpiCards } from './components/KpiCards';
import { FollowTrendChart } from './components/FollowTrendChart';
import { SabcGradingCard } from './components/SabcGradingCard';
import { LeadStageFunnel } from './components/LeadStageFunnel';
import { EfficiencyBoard } from './components/EfficiencyBoard';
import { SaLeadsTrackingPanel } from './components/SaLeadsTrackingPanel';
import { SalesLeadAnalysisPanel } from './components/SalesLeadAnalysisPanel';
import { TasksAndFeedPanel } from './components/TasksAndFeedPanel';
import { ReminderTodoPanel } from '../../reminders/components/ReminderTodoPanel';
import { DailyReportModal } from '../daily-report/DailyReportModal';
import type { DailyReport } from '../daily-report/types';
import { useReminders } from '../../reminders/ReminderContext';

/**
 * 工作台主页（重新策划 2026-07）。
 *
 * 按「指标看板 → 业务漏斗与分级 → 深度追踪与线索分析 → 个人待办与动态」
 * 的顶层逻辑排布 5 大区块，占位概念诚实标 TODO 不扩张业务语义
 * （详见 plan、CONTEXT.md 领域边界、ADR-0003）。
 */
export default function Dashboard() {
  const [dailyReportVisible, setDailyReportVisible] = useState(false);
  const { submitDailyReport } = useReminders();
  const currentUserId = 'user-sales-zhangsan';

  return (
    <div className="pb-8">
      {/* Page label — subtle, not a giant heading（沿用现有 Dashboard 约定） */}
      <div
        className="text-[13px] font-medium text-muted-foreground mb-6 tracking-wide uppercase"
      >
        工作台
      </div>

      {/* §1 顶部 KPI 卡（5 张横卡，混合口径） */}
      <KpiCards />

      {/* §2 中部核心业务流与效能（4 块） */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* 左：跟进趋势折线（LIVE） */}
        <div className="flex">
          <FollowTrendChart />
        </div>
        {/* 中：SABC 线索分级 + 流失预警 */}
        <div className="flex">
          <SabcGradingCard />
        </div>
        {/* 右：S/A 级线索深度追踪 */}
        <div className="flex">
          <SaLeadsTrackingPanel />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 左：跟进过程漏斗 */}
        <div className="flex">
          <LeadStageFunnel />
        </div>
        {/* 右：效率健康度看板 */}
        <div className="flex">
          <EfficiencyBoard />
        </div>
      </div>

      {/* §4 左下：销售人员线索分类分析 */}
      <SalesLeadAnalysisPanel />

      {/* 右下：日常协同与智能提醒 + 复用现有 ReminderTodoPanel */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex">
          <ReminderTodoPanel
            onOpenDailyReport={() => setDailyReportVisible(true)}
            style={{ height: '100%', marginBottom: 0, flex: 1 }}
          />
        </div>
        <div className="flex">
          <TasksAndFeedPanel onOpenDailyReport={() => setDailyReportVisible(true)} />
        </div>
      </div>

      <DailyReportModal
        visible={dailyReportVisible}
        onCancel={() => setDailyReportVisible(false)}
        onSubmit={(report: DailyReport) => submitDailyReport(report)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
