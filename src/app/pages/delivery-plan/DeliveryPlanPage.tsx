// src/app/pages/delivery-plan/DeliveryPlanPage.tsx

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../components/ui/alert-dialog';
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group';
import { Progress } from '../../components/ui/progress';
import { initialProjects } from '../project-management/mockData';
import type { DeliveryPlan, SopStep, GanttZoomLevel, DeliveryType } from './types';
import { SOP_PHASES } from './constants';
import {
  calcOverallCompletion,
  derivePhaseStatus,
  generateDeliveryPlan,
  getDefaultZoomLevel,
  isStepOverdue,
} from './utils';
import { initialDeliveryPlans } from './mockData';
import { DeliveryConfigModal } from './DeliveryConfigModal';
import StepEditModal from './StepEditModal';
import CustomStepModal from './CustomStepModal';
import TaskList from './TaskList';
import GanttChart from './GanttChart';
import { format, differenceInDays } from 'date-fns';

/* ---------- Status badge ---------- */

type ProjectStatus = '未开始' | '进行中' | '已完成' | '验收中' | '搁置' | '延迟' | '催款中';

function statusBadge(status: ProjectStatus) {
  const variantMap: Record<ProjectStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    未开始: 'secondary',
    进行中: 'default',
    已完成: 'default',
    验收中: 'default',
    搁置: 'outline',
    延迟: 'destructive',
    催款中: 'outline',
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

/* ---------- Contract lookup helper ---------- */

const CONTRACT_DELIVERY_TYPES: Record<string, DeliveryType> = {
  '1': '全平台',
  '2': '小程序',
  '3': '网站',
  '4': '网站+小程序',
  '5': 'APP',
};

const CONTRACT_SIGN_DATES: Record<string, string> = {
  '1': '2026-03-15',
  '2': '2026-03-20',
  '3': '2026-04-01',
  '4': '2026-02-10',
  '5': '2026-03-01',
};

/* ---------- Zoom options ---------- */

const ZOOM_OPTIONS: { label: string; value: GanttZoomLevel }[] = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];

/* ---------- Main component ---------- */

export default function DeliveryPlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ─── Find project ───
  const project = initialProjects.find((p) => p.id === id);

  // ─── Delivery plan state ───
  const [plan, setPlan] = useState<DeliveryPlan | null>(
    initialDeliveryPlans[id!] ? JSON.parse(JSON.stringify(initialDeliveryPlans[id!])) : null,
  );

  // ─── UI state ───
  const [zoomLevel, setZoomLevel] = useState<GanttZoomLevel>(() => {
    if (!plan) return 'week';
    const allDates = plan.steps
      .flatMap((s) => [s.startDate, s.dueDate])
      .filter(Boolean)
      .sort();
    if (allDates.length < 2) return 'week';
    const totalDays = differenceInDays(new Date(allDates[allDates.length - 1]), new Date(allDates[0]));
    return getDefaultZoomLevel(totalDays);
  });

  const [phaseFilter, setPhaseFilter] = useState<number | null>(null);
  const [expandedPhaseIds, setExpandedPhaseIds] = useState<string[]>(
    plan?.phases.map((p) => p.id) ?? [],
  );
  const [expandedStepIds, setExpandedStepIds] = useState<string[]>([]);

  // ─── Modal states ───
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editStep, setEditStep] = useState<SopStep | null>(null);
  const [customStepPhaseId, setCustomStepPhaseId] = useState<string | null>(null);
  const [customStepPhaseNo, setCustomStepPhaseNo] = useState<number>(0);

  // ─── Scroll refs for sync ───
  const listScrollRef = useRef<HTMLDivElement>(null);
  const ganttScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);

  // ─── Scroll sync ───
  useEffect(() => {
    const listEl = listScrollRef.current;
    const ganttEl = ganttScrollRef.current;
    if (!listEl || !ganttEl) return;

    const onListScroll = () => {
      if (isSyncingScroll.current) return;
      isSyncingScroll.current = true;
      ganttEl.scrollTop = listEl.scrollTop;
      requestAnimationFrame(() => { isSyncingScroll.current = false; });
    };

    const onGanttScroll = () => {
      if (isSyncingScroll.current) return;
      isSyncingScroll.current = true;
      listEl.scrollTop = ganttEl.scrollTop;
      requestAnimationFrame(() => { isSyncingScroll.current = false; });
    };

    listEl.addEventListener('scroll', onListScroll);
    ganttEl.addEventListener('scroll', onGanttScroll);

    return () => {
      listEl.removeEventListener('scroll', onListScroll);
      ganttEl.removeEventListener('scroll', onGanttScroll);
    };
  }, [plan]);

  // ─── Project not found ───
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <span className="text-lg text-muted-foreground">项目不存在</span>
        <Button onClick={() => navigate('/projects')}>返回项目列表</Button>
      </div>
    );
  }

  // ─── Contract info ───
  const contractId = project.contractId;
  const contractDeliveryType = contractId ? CONTRACT_DELIVERY_TYPES[contractId] : undefined;
  const contractSignDate = contractId ? CONTRACT_SIGN_DATES[contractId] : undefined;

  // ─── Project members object for modals ───
  const projectMembers = {
    owner: project.owner ? [project.owner] : [],
    productUsers: project.productUsers ?? [],
    salesUsers: project.salesUsers ?? [],
    uiUsers: project.uiUsers ?? [],
    frontendUsers: project.frontendUsers ?? [],
    backendUsers: project.backendUsers ?? [],
    opsUsers: project.opsUsers ?? [],
    testUsers: project.testUsers ?? [],
    legalUsers: project.legalUsers ?? [],
  };

  // ─── Filtered plan ───
  const filteredPlan = useMemo(() => {
    if (!plan) return null;
    if (phaseFilter === null) return plan;

    const filteredPhases = plan.phases.filter((p) => p.phaseNo === phaseFilter);
    const filteredPhaseIds = new Set(filteredPhases.map((p) => p.id));
    const filteredSteps = plan.steps.filter((s) => filteredPhaseIds.has(s.phaseId));

    return { ...plan, phases: filteredPhases, steps: filteredSteps };
  }, [plan, phaseFilter]);

  // ─── Bottom summary calculations ───
  const summary = useMemo(() => {
    if (!plan) return null;

    const today = format(new Date(), 'yyyy-MM-dd');
    const allSteps = plan.steps;
    const filteredSteps = filteredPlan!.steps;

    const totalSteps = allSteps.length;
    const visibleSteps = filteredSteps.length;
    const completion = calcOverallCompletion(plan.phases, allSteps);
    const inProgressCount = filteredSteps.filter((s) => s.status === 'in_progress').length;
    const overdueCount = filteredSteps.filter((s) => isStepOverdue(s, today)).length;

    const allMilestones = plan.milestones;
    const completedMilestones = allMilestones.filter((m) => m.completed).length;
    const totalMilestones = allMilestones.length;

    const dueDates = allSteps.map((s) => s.dueDate).filter(Boolean).sort();
    const expectedEndDate = dueDates.length > 0 ? dueDates[dueDates.length - 1] : '-';

    return {
      totalSteps,
      visibleSteps,
      completion,
      inProgressCount,
      overdueCount,
      completedMilestones,
      totalMilestones,
      expectedEndDate,
    };
  }, [plan, filteredPlan]);

  // ─── Handlers ───

  const handleConfigConfirm = useCallback(
    (config: { selectedPhases: number[]; deliveryType: DeliveryType; contractId?: string }) => {
      const newPlan = generateDeliveryPlan(
        config,
        project as unknown as Record<string, any>,
        contractSignDate,
      );
      setPlan(newPlan);
      if (id) {
        initialDeliveryPlans[id] = newPlan;
      }
      setExpandedPhaseIds(newPlan.phases.map((p) => p.id));
      setExpandedStepIds([]);

      const allDates = newPlan.steps
        .flatMap((s) => [s.startDate, s.dueDate])
        .filter(Boolean)
        .sort();
      if (allDates.length >= 2) {
        const totalDays = differenceInDays(
          new Date(allDates[allDates.length - 1]),
          new Date(allDates[0]),
        );
        setZoomLevel(getDefaultZoomLevel(totalDays));
      }

      setConfigModalVisible(false);
      toast.success('交付计划已生成');
    },
    [project, contractSignDate, id],
  );

  const handleStepEditSave = useCallback(
    (stepId: string, updates: Partial<SopStep>) => {
      if (!plan) return;

      const newSteps = plan.steps.map((s) =>
        s.id === stepId ? { ...s, ...updates } : s,
      );

      const updatedStep = newSteps.find((s) => s.id === stepId);
      if (!updatedStep) return;

      const phaseId = updatedStep.phaseId;
      const phaseSteps = newSteps.filter((s) => s.phaseId === phaseId);
      const newPhaseStatus = derivePhaseStatus(phaseSteps);

      const stepDates = phaseSteps
        .flatMap((s) => [s.startDate, s.dueDate])
        .filter(Boolean)
        .sort();

      const newPhases = plan.phases.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          status: newPhaseStatus,
          startDate: stepDates[0] ?? p.startDate,
          dueDate: stepDates[stepDates.length - 1] ?? p.dueDate,
        };
      });

      setPlan({ ...plan, steps: newSteps, phases: newPhases });
      setEditStep(null);
      toast.success('步骤已更新');
    },
    [plan],
  );

  const handleCustomStepSave = useCallback(
    (newStep: SopStep) => {
      if (!plan) return;

      const newSteps = [...plan.steps, newStep];

      const phaseId = newStep.phaseId;
      const phaseSteps = newSteps.filter((s) => s.phaseId === phaseId);
      const newPhaseStatus = derivePhaseStatus(phaseSteps);

      const stepDates = phaseSteps
        .flatMap((s) => [s.startDate, s.dueDate])
        .filter(Boolean)
        .sort();

      const newPhases = plan.phases.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          status: newPhaseStatus,
          startDate: stepDates[0] ?? p.startDate,
          dueDate: stepDates[stepDates.length - 1] ?? p.dueDate,
        };
      });

      setPlan({ ...plan, steps: newSteps, phases: newPhases });
      setCustomStepPhaseId(null);
      toast.success('自定义步骤已添加');
    },
    [plan],
  );

  const handleDeletePlan = useCallback(() => {
    setPlan(null);
    if (id) {
      delete initialDeliveryPlans[id];
    }
    setExpandedPhaseIds([]);
    setExpandedStepIds([]);
    toast.success('交付计划已删除');
  }, [id]);

  const handleStepEdit = useCallback((step: SopStep) => {
    setEditStep(step);
  }, []);

  const handleAddCustomStep = useCallback((phaseId: string, phaseNo: number) => {
    setCustomStepPhaseId(phaseId);
    setCustomStepPhaseNo(phaseNo);
  }, []);

  const getExistingCustomStepCount = useCallback(
    (phaseId: string) => {
      if (!plan) return 0;
      return plan.steps.filter((s) => s.phaseId === phaseId && s.isCustom).length;
    },
    [plan],
  );

  // ─── Render ───

  // Empty state
  if (!plan || !filteredPlan) {
    return (
      <div className="flex flex-col h-screen">
        {/* Top bar */}
        <div className="flex items-center px-5 py-3 border-b bg-background shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/projects')}
            className="mr-3"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <span className="text-base font-semibold mr-4">{project.name}</span>
          {statusBadge(project.status as ProjectStatus)}
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-muted/30">
          <span className="text-base text-muted-foreground">暂无交付计划</span>
          <Button onClick={() => setConfigModalVisible(true)}>生成交付计划</Button>
        </div>

        {/* Config modal */}
        <DeliveryConfigModal
          visible={configModalVisible}
          onCancel={() => setConfigModalVisible(false)}
          onConfirm={handleConfigConfirm}
          contractId={contractId}
          deliveryType={contractDeliveryType}
          projectStartDate={project.startDate}
        />
      </div>
    );
  }

  // Plan exists: full layout
  return (
    <div className="flex flex-col h-screen">
      {/* ── Top bar ── */}
      <div className="flex items-center px-5 py-3 border-b bg-background shrink-0 gap-3">
        {/* Back button */}
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="size-4" />
        </Button>

        {/* Project name */}
        <span className="text-base font-semibold mr-1">{project.name}</span>

        {/* Status badge */}
        {statusBadge(project.status as ProjectStatus)}

        {/* Spacer */}
        <span className="flex-1" />

        {/* Phase filter */}
        <Select
          value={phaseFilter === null ? '0' : String(phaseFilter)}
          onValueChange={(val) => setPhaseFilter(val === '0' ? null : Number(val))}
        >
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="板块筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">全部</SelectItem>
            {SOP_PHASES.map((p) => (
              <SelectItem key={p.phaseNo} value={String(p.phaseNo)}>
                {['一', '二', '三', '四', '五', '六', '七'][p.phaseNo - 1]}、{p.phaseName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Zoom level */}
        <ToggleGroup
          type="single"
          value={zoomLevel}
          onValueChange={(val) => { if (val) setZoomLevel(val as GanttZoomLevel); }}
          variant="outline"
          size="sm"
        >
          {ZOOM_OPTIONS.map((opt) => (
            <ToggleGroupItem key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {/* Delete plan */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
              <Trash2 className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定删除交付计划？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作不可撤销，删除后需要重新生成交付计划。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePlan}>确定</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* ── Main content: split pane ── */}
      <div className="flex flex-1 min-h-0">
        {/* Left: TaskList (480px fixed) */}
        <div className="w-[480px] shrink-0 h-full overflow-hidden">
          <TaskList
            plan={filteredPlan}
            project={project as unknown as Record<string, any>}
            onStepEdit={handleStepEdit}
            onAddCustomStep={handleAddCustomStep}
            expandedPhaseIds={expandedPhaseIds}
            onExpandedPhaseIdsChange={setExpandedPhaseIds}
            expandedStepIds={expandedStepIds}
            onExpandedStepIdsChange={setExpandedStepIds}
            scrollRef={listScrollRef}
          />
        </div>

        {/* Right: GanttChart (flex-1) */}
        <div className="flex-1 min-w-0 h-full">
          <GanttChart
            plan={filteredPlan}
            zoomLevel={zoomLevel}
            onZoomLevelChange={setZoomLevel}
            scrollRef={ganttScrollRef}
          />
        </div>
      </div>

      {/* ── Bottom summary bar ── */}
      {summary && (
        <div className="flex items-center px-5 py-2 border-t bg-background shrink-0 gap-6 text-[13px]">
          {/* Steps count */}
          <span>
            <span className="text-muted-foreground">步骤</span>{' '}
            <span className="font-semibold">{summary.visibleSteps}</span>
            <span className="text-muted-foreground">/{summary.totalSteps}</span>
          </span>

          {/* Completion */}
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">完成</span>
            <Progress
              value={Math.round(summary.completion * 100)}
              className={`w-20 h-2 ${summary.completion >= 0.8 ? '[&>div]:bg-green-600' : ''}`}
            />
            <span className="font-semibold">{Math.round(summary.completion * 100)}%</span>
          </span>

          {/* In progress */}
          <span>
            <span className="text-muted-foreground">进行中</span>{' '}
            <span className="font-semibold text-blue-600">{summary.inProgressCount}</span>
          </span>

          {/* Overdue */}
          <span>
            <span className="text-muted-foreground">逾期</span>{' '}
            <span className={`font-semibold ${summary.overdueCount > 0 ? 'text-red-600' : ''}`}>
              {summary.overdueCount}
            </span>
          </span>

          {/* Milestones */}
          <span>
            <span className="text-muted-foreground">里程碑</span>{' '}
            <span className="font-semibold">{summary.completedMilestones}</span>
            <span className="text-muted-foreground">/{summary.totalMilestones}</span>
          </span>

          {/* Spacer */}
          <span className="flex-1" />

          {/* Expected end date */}
          <span>
            <span className="text-muted-foreground">预计</span>{' '}
            <span className="font-semibold">{summary.expectedEndDate}</span>
          </span>
        </div>
      )}

      {/* ── Modals ── */}

      <DeliveryConfigModal
        visible={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        onConfirm={handleConfigConfirm}
        contractId={contractId}
        deliveryType={contractDeliveryType}
        projectStartDate={project.startDate}
      />

      <StepEditModal
        visible={!!editStep}
        step={editStep}
        onCancel={() => setEditStep(null)}
        onSave={handleStepEditSave}
        projectMembers={projectMembers}
      />

      {customStepPhaseId && (
        <CustomStepModal
          visible={!!customStepPhaseId}
          phaseId={customStepPhaseId}
          phaseNo={customStepPhaseNo}
          projectId={project.id}
          existingCustomStepCount={getExistingCustomStepCount(customStepPhaseId)}
          onCancel={() => setCustomStepPhaseId(null)}
          onSave={handleCustomStepSave}
          projectMembers={projectMembers}
        />
      )}
    </div>
  );
}
