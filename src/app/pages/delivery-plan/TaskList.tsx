import React, { useCallback } from 'react';
import { Plus, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import type { DeliveryPlan, SopStep, SopStepStatus, SopMilestone } from './types';

/* ---------- Props ---------- */

export interface TaskListProps {
  plan: DeliveryPlan;
  project: Record<string, any>;
  onStepEdit: (step: SopStep) => void;
  onAddCustomStep: (phaseId: string, phaseNo: number) => void;
  expandedPhaseIds: string[];
  onExpandedPhaseIdsChange: (ids: string[]) => void;
  expandedStepIds: string[];
  onExpandedStepIdsChange: (ids: string[]) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

/* ---------- Status badge helper ---------- */

const STATUS_MAP: Record<SopStepStatus, { color: string; text: string }> = {
  pending: { color: 'bg-gray-400', text: '待开始' },
  in_progress: { color: 'bg-blue-500', text: '进行中' },
  completed: { color: 'bg-green-500', text: '已完成' },
  skipped: { color: 'bg-amber-500', text: '已跳过' },
};

function statusBadge(status: SopStepStatus) {
  const { color, text } = STATUS_MAP[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{text}</span>
    </span>
  );
}

/* ---------- Phase progress ---------- */

function phaseProgress(steps: SopStep[]) {
  const completed = steps.filter((s) => s.status === 'completed').length;
  return `${completed}/${steps.length}`;
}

/* ---------- Chinese ordinal for phase number ---------- */

const CN_ORDINALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function cnOrdinal(n: number): string {
  if (n >= 1 && n <= 10) return CN_ORDINALS[n - 1];
  return String(n);
}

/* ---------- Milestones within a phase date range ---------- */

function milestonesInPhase(
  milestones: SopMilestone[],
  phaseStart: string,
  phaseEnd: string,
): SopMilestone[] {
  const start = new Date(phaseStart).getTime();
  const end = new Date(phaseEnd).getTime();
  return milestones.filter((m) => {
    const t = new Date(m.date).getTime();
    return t >= start && t <= end;
  });
}

/* ---------- Step detail panel ---------- */

function StepDetailPanel({ step }: { step: SopStep }) {
  const sections: { label: string; value: string }[] = [
    { label: '描述', value: step.description },
    { label: '注意事项', value: step.notes },
    { label: '执行工具', value: step.tools },
    { label: '执行产物', value: step.deliverables },
  ];
  if (step.userNotes) {
    sections.push({ label: '用户备注', value: step.userNotes });
  }

  return (
    <div className="border-t border-border bg-muted/50 px-4 py-2.5 pl-14 text-[13px] text-muted-foreground">
      {sections.map(
        (sec) =>
          sec.value && (
            <div key={sec.label} className="mb-1">
              <span className="mr-2 text-xs font-semibold text-muted-foreground">
                {sec.label}:
              </span>
              <span>{sec.value}</span>
            </div>
          ),
      )}
    </div>
  );
}

/* ---------- Main component ---------- */

const TaskList: React.FC<TaskListProps> = ({
  plan,
  project,
  onStepEdit,
  onAddCustomStep,
  expandedPhaseIds,
  onExpandedPhaseIdsChange,
  expandedStepIds,
  onExpandedStepIdsChange,
  scrollRef,
}) => {
  const { phases, steps, milestones } = plan;

  /* Sorted phases */
  const sortedPhases = [...phases].sort((a, b) => a.phaseNo - b.phaseNo);

  /* Toggle helpers */
  const togglePhase = useCallback(
    (phaseId: string) => {
      const next = expandedPhaseIds.includes(phaseId)
        ? expandedPhaseIds.filter((id) => id !== phaseId)
        : [...expandedPhaseIds, phaseId];
      onExpandedPhaseIdsChange(next);
    },
    [expandedPhaseIds, onExpandedPhaseIdsChange],
  );

  const toggleStep = useCallback(
    (stepId: string) => {
      const next = expandedStepIds.includes(stepId)
        ? expandedStepIds.filter((id) => id !== stepId)
        : [...expandedStepIds, stepId];
      onExpandedStepIdsChange(next);
    },
    [expandedStepIds, onExpandedStepIdsChange],
  );

  const handleStepDoubleClick = useCallback(
    (step: SopStep) => {
      onStepEdit(step);
    },
    [onStepEdit],
  );

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto border-r border-border bg-background"
    >
      {sortedPhases.map((phase) => {
        const isPhaseExpanded = expandedPhaseIds.includes(phase.id);
        const phaseSteps = steps
          .filter((s) => s.phaseId === phase.id)
          .sort((a, b) => a.stepNo.localeCompare(b.stepNo, undefined, { numeric: true }));
        const phaseMilestones = milestonesInPhase(milestones, phase.startDate, phase.dueDate);

        return (
          <div key={phase.id}>
            {/* ---- Phase row ---- */}
            <div
              onClick={() => togglePhase(phase.id)}
              className="flex cursor-pointer select-none items-center gap-2 border-b border-border bg-muted/50 px-3 py-2.5"
            >
              {/* Collapse arrow */}
              <span className="w-4 shrink-0 text-center text-muted-foreground">
                {isPhaseExpanded ? (
                  <ChevronDown className="inline-block h-4 w-4" />
                ) : (
                  <ChevronRight className="inline-block h-4 w-4" />
                )}
              </span>

              {/* Phase name */}
              <span className="shrink-0 text-sm font-semibold">
                {cnOrdinal(phase.phaseNo)}、{phase.phaseName}
              </span>

              {/* Spacer */}
              <span className="flex-1" />

              {/* Manager */}
              <span className="shrink-0 text-xs text-muted-foreground">
                {phase.manager}
              </span>

              {/* Status badge */}
              <span className="shrink-0">{statusBadge(phase.status)}</span>

              {/* Progress */}
              <span className="shrink-0 text-xs text-muted-foreground">
                {phaseProgress(phaseSteps)}
              </span>

              {/* Add custom step button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddCustomStep(phase.id, phase.phaseNo);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* ---- Expanded content: steps + milestones ---- */}
            {isPhaseExpanded && (
              <div>
                {phaseSteps.map((step) => {
                  const isStepExpanded = expandedStepIds.includes(step.id);

                  return (
                    <div key={step.id}>
                      {/* Step row */}
                      <div
                        onClick={() => toggleStep(step.id)}
                        onDoubleClick={() => handleStepDoubleClick(step)}
                        className="flex min-h-[40px] cursor-pointer select-none items-center gap-2 border-b border-border/50 bg-background px-3 py-2 pl-9"
                      >
                        {/* Step number + name */}
                        <span className="flex-1 overflow-hidden text-[13px]">
                          <span className="mr-1">{step.stepNo}</span>
                          <span>{step.stepName}</span>
                          {step.isCustom && (
                            <Badge variant="outline" className="ml-1.5 border-orange-300 bg-orange-50 text-orange-600">
                              自
                            </Badge>
                          )}
                        </span>

                        {/* Assignee */}
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {step.assignee}
                        </span>

                        {/* Status badge */}
                        <span className="shrink-0">{statusBadge(step.status)}</span>

                        {/* Edit icon */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStepEdit(step);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Step detail panel */}
                      {isStepExpanded && <StepDetailPanel step={step} />}
                    </div>
                  );
                })}

                {/* Milestones */}
                {phaseMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center gap-2 border-b border-border bg-blue-50/50 px-3 py-2 pl-9 text-[13px]"
                  >
                    <span className="shrink-0">💎</span>
                    <span className="flex-1">{milestone.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {format(new Date(milestone.date), 'yyyy-MM-dd')}
                    </span>
                    <span className="shrink-0">{milestone.completed ? '✅' : '⏳'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
