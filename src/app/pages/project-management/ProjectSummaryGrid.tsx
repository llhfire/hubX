// 共享的项目摘要卡片网格组件
// 被线索详情页和项目详情页共用
import { useMemo } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { initialProjects, initialDailyReports, buildProjectMemberHours, calculateProjectHours } from './mockData';
import { initialRequirements, initialTasks, initialDefects } from '../issues/mockData';
import { initialDeliveryPlans } from '../delivery-plan/mockData';
import { buildProjectSummaryCards, type SummaryRiskLevel } from '../projectDetailSummary';

const SUMMARY_LEVEL_STYLE: Record<SummaryRiskLevel, string> = {
  正常: 'bg-green-100 text-green-700',
  注意: 'bg-blue-100 text-blue-700',
  预警: 'bg-orange-100 text-orange-700',
  严重: 'bg-red-100 text-red-700',
};

// 卡片点击跳转映射
const CARD_HREF_MAP: Record<string, (projectId: string) => string> = {
  delivery: (id) => `/projects/${id}/delivery`,
  workItems: (id) => `/projects/${id}/issues`,
  hours: (id) => `/projects/${id}/dailyreports`,
};

interface ProjectSummaryGridProps {
  projectId: string;
  /** 来源上下文，用于返回按钮 */
  from?: 'lead' | 'project';
  leadId?: string;
  leadName?: string;
}

export function ProjectSummaryGrid({ projectId, from, leadId, leadName }: ProjectSummaryGridProps) {
  const project = initialProjects.find(p => p.id === projectId);

  const summaryCards = useMemo(() => {
    if (!project) return [];
    const today = new Date().toISOString().split('T')[0];
    const deliveryPlan = initialDeliveryPlans[project.id];
    const memberHours = buildProjectMemberHours(project.id, initialDailyReports);
    const totalHours = calculateProjectHours(project.id, initialDailyReports);
    const workItemCounts = {
      requirements: initialRequirements.filter(r => r.projectId === project.id).length,
      tasks: initialTasks.filter(t => t.projectId === project.id).length,
      defects: initialDefects.filter(d => d.projectId === project.id).length,
    };

    return buildProjectSummaryCards({
      project,
      allProjects: initialProjects,
      deliveryPlan,
      memberHours,
      totalHours,
      today,
      workItemCounts,
    });
  }, [project]);

  if (!project || summaryCards.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">项目概览</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((card) => {
          const href = CARD_HREF_MAP[card.key]?.(project.id);
          const state = from === 'lead' && leadId
            ? { from: 'lead' as const, leadId, leadName }
            : undefined;

          const cardContent = (
            <Card key={card.key} className="h-full cursor-pointer transition-all hover:shadow-md">
              <CardContent className="p-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{card.title}</span>
                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${SUMMARY_LEVEL_STYLE[card.level]}`}>
                      {card.level}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-foreground leading-tight">{card.value}</div>
                  <div className="text-xs font-medium text-foreground">{card.alert}</div>
                  <span className="text-[10px] text-muted-foreground">{card.detail}</span>
                </div>
              </CardContent>
            </Card>
          );

          return href ? (
            <Link key={card.key} to={href} state={state} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
              {cardContent}
            </Link>
          ) : cardContent;
        })}
      </div>
    </div>
  );
}
