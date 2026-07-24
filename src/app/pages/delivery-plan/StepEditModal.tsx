import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import type { SopStep, SopStepStatus } from './types';

interface StepEditModalProps {
  visible: boolean;
  step: SopStep | null;
  onCancel: () => void;
  onSave: (stepId: string, updates: Partial<SopStep>) => void;
  projectMembers: Record<string, string[]>;
}

/** 允许的状态转移表 */
const VALID_TRANSITIONS: Record<SopStepStatus, SopStepStatus[]> = {
  pending: ['in_progress', 'skipped'],
  in_progress: ['completed', 'skipped'],
  completed: ['in_progress'],
  skipped: [],
};

const STATUS_OPTIONS: { value: SopStepStatus; label: string }[] = [
  { value: 'pending', label: '待开始' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'skipped', label: '已跳过' },
];

const StepEditModal: React.FC<StepEditModalProps> = ({
  visible,
  step,
  onCancel,
  onSave,
  projectMembers,
}) => {
  const [stepName, setStepName] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState<SopStepStatus>('pending');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [userNotes, setUserNotes] = useState('');

  /** 将 projectMembers 扁平化并去重 */
  const memberOptions = useMemo(() => {
    const all = Object.values(projectMembers).flat();
    return [...new Set(all)];
  }, [projectMembers]);

  const resetForm = () => {
    setStepName('');
    setAssignee('');
    setStatus('pending');
    setStartDate('');
    setDueDate('');
    setDeliverables('');
    setUserNotes('');
  };

  /** 步骤切换时重置表单 */
  useEffect(() => {
    if (visible && step) {
      setStepName(step.stepName);
      setAssignee(step.assignee);
      setStatus(step.status);
      setStartDate(step.startDate || '');
      setDueDate(step.dueDate || '');
      setDeliverables(step.deliverables || '');
      setUserNotes(step.userNotes || '');
    }
  }, [visible, step]);

  const handleSave = () => {
    if (!stepName.trim()) {
      toast.warning('请输入步骤名称');
      return;
    }

    // 校验状态转移合法性
    if (step && status !== step.status) {
      const allowed = VALID_TRANSITIONS[step.status];
      if (!allowed.includes(status)) {
        toast.warning(
          `不允许从"${STATUS_OPTIONS.find((o) => o.value === step.status)?.label}"切换到"${
            STATUS_OPTIONS.find((o) => o.value === status)?.label
          }"`
        );
        return;
      }
    }

    const updates: Partial<SopStep> = {
      stepName,
      assignee,
      status,
      startDate: startDate || '',
      dueDate: dueDate || '',
      deliverables: deliverables || '',
      userNotes: userNotes || '',
    };

    onSave(step!.id, updates);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>编辑步骤</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 步骤名称 */}
          <div className="grid gap-2">
            <Label htmlFor="stepName">步骤名称</Label>
            <Input
              id="stepName"
              placeholder="请输入步骤名称"
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              disabled={!(step?.isCustom)}
            />
          </div>

          {/* 执行人 + 状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="assignee">执行人</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="请选择执行人" />
                </SelectTrigger>
                <SelectContent>
                  {memberOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">状态</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as SopStepStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 开始日期 + 截止日期 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">截止日期</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* 执行产物 */}
          <div className="grid gap-2">
            <Label htmlFor="deliverables">执行产物</Label>
            <Textarea
              id="deliverables"
              placeholder="请输入执行产物"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              rows={3}
            />
          </div>

          {/* 用户备注 */}
          <div className="grid gap-2">
            <Label htmlFor="userNotes">用户备注</Label>
            <Textarea
              id="userNotes"
              placeholder="请输入用户备注"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StepEditModal;
