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
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import type { SopStep } from './types';

interface CustomStepModalProps {
  visible: boolean;
  phaseId: string;
  phaseNo: number;
  projectId: string;
  existingCustomStepCount: number;
  onCancel: () => void;
  onSave: (newStep: SopStep) => void;
  projectMembers: Record<string, string[]>;
}

interface FormValues {
  stepName: string;
  assignee: string;
  department: string;
  startDate: string;
  dueDate: string;
  deliverables: string;
  userNotes: string;
}

const initialFormValues: FormValues = {
  stepName: '',
  assignee: '',
  department: '',
  startDate: '',
  dueDate: '',
  deliverables: '',
  userNotes: '',
};

const CustomStepModal: React.FC<CustomStepModalProps> = ({
  visible,
  phaseId,
  phaseNo,
  projectId,
  existingCustomStepCount,
  onCancel,
  onSave,
  projectMembers,
}) => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  /** 将 projectMembers 扁平化并去重 */
  const memberOptions = useMemo(() => {
    const all = Object.values(projectMembers).flat();
    return [...new Set(all)];
  }, [projectMembers]);

  /** 弹窗打开时重置表单 */
  useEffect(() => {
    if (visible) {
      setFormValues(initialFormValues);
      setErrors({});
    }
  }, [visible]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!formValues.stepName.trim()) {
      newErrors.stepName = '请输入步骤名称';
    }
    if (!formValues.assignee) {
      newErrors.assignee = '请选择执行人';
    }
    if (!formValues.startDate) {
      newErrors.startDate = '请选择开始日期';
    }
    if (!formValues.dueDate) {
      newErrors.dueDate = '请选择截止日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOk = () => {
    if (!validate()) return;

    const newStep: SopStep = {
      id: `step-custom-${Date.now()}`,
      phaseId,
      projectId,
      stepNo: `${phaseNo}-C${existingCustomStepCount + 1}`,
      stepName: formValues.stepName,
      department: formValues.department || '',
      assignee: formValues.assignee,
      status: 'pending',
      startDate: formValues.startDate || '',
      dueDate: formValues.dueDate || '',
      deliverables: formValues.deliverables || '',
      description: '',
      notes: '',
      tools: '',
      isCustom: true,
      isEvergreen: false,
      userNotes: formValues.userNotes || '',
    };

    onSave(newStep);
    setFormValues(initialFormValues);
    setErrors({});
  };

  const handleCancel = () => {
    setFormValues(initialFormValues);
    setErrors({});
    onCancel();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>添加自定义步骤</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          {/* 步骤名称 */}
          <div className="space-y-2">
            <Label htmlFor="stepName">步骤名称</Label>
            <Input
              id="stepName"
              placeholder="请输入步骤名称"
              value={formValues.stepName}
              onChange={(e) => handleChange('stepName', e.target.value)}
              aria-invalid={!!errors.stepName}
            />
            {errors.stepName && (
              <p className="text-sm text-destructive">{errors.stepName}</p>
            )}
          </div>

          {/* 执行人 & 所属部门 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>执行人</Label>
              <Select
                value={formValues.assignee}
                onValueChange={(value) => handleChange('assignee', value)}
              >
                <SelectTrigger aria-invalid={!!errors.assignee}>
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
              {errors.assignee && (
                <p className="text-sm text-destructive">{errors.assignee}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">所属部门</Label>
              <Input
                id="department"
                placeholder="请输入所属部门"
                value={formValues.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>
          </div>

          {/* 开始日期 & 截止日期 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={formValues.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                aria-invalid={!!errors.startDate}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">截止日期</Label>
              <Input
                id="dueDate"
                type="date"
                value={formValues.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                aria-invalid={!!errors.dueDate}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* 执行产物 */}
          <div className="space-y-2">
            <Label htmlFor="deliverables">执行产物</Label>
            <Textarea
              id="deliverables"
              placeholder="请输入执行产物"
              rows={2}
              value={formValues.deliverables}
              onChange={(e) => handleChange('deliverables', e.target.value)}
            />
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="userNotes">备注</Label>
            <Textarea
              id="userNotes"
              placeholder="请输入备注"
              rows={2}
              value={formValues.userNotes}
              onChange={(e) => handleChange('userNotes', e.target.value)}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleOk}>添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomStepModal;
