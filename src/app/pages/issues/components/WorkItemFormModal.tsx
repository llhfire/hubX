import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { WorkItemActions, WorkItemType } from '../types';
import { TYPE_LABEL_MAP, PRIORITY_OPTIONS, SEVERITY_OPTIONS } from '../constants';
import { initialEmployees } from '../../employee/mockData';

interface WorkItemFormModalProps {
  type: WorkItemType;
  projectId: string;
  workItems: WorkItemActions;
  onClose: () => void;
}

interface FormValues {
  title: string;
  priority: string;
  assigneeId: string;
  contractId: string;
  acceptanceCriteria: string;
  requirementId: string;
  estimatedHours: string;
  dueDate: string;
  severity: string;
  taskId: string;
  reproductionSteps: string;
}

export function WorkItemFormModal({ type, projectId, workItems, onClose }: WorkItemFormModalProps) {
  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    priority: '',
    assigneeId: '',
    contractId: '',
    acceptanceCriteria: '',
    requirementId: '',
    estimatedHours: '',
    dueDate: '',
    severity: '',
    taskId: '',
    reproductionSteps: '',
  });
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const updateField = (field: keyof FormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!formValues.title.trim()) {
      newErrors.title = '请输入标题';
    }
    if (!formValues.priority) {
      newErrors.priority = '请选择优先级';
    }
    if (!formValues.assigneeId) {
      newErrors.assigneeId = '请选择负责人';
    }
    if (type === 'defect' && !formValues.severity) {
      newErrors.severity = '请选择严重程度';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    try {
      const baseData = {
        projectId,
        title: formValues.title,
        description,
        priority: formValues.priority as '高' | '中' | '低',
        assigneeId: formValues.assigneeId,
        creatorId: '1',  // 当前用户
        contractId: formValues.contractId || undefined,
      };

      if (type === 'requirement') {
        workItems.createRequirement({
          ...baseData,
          acceptanceCriteria: formValues.acceptanceCriteria || undefined,
        });
      } else if (type === 'task') {
        workItems.createTask({
          ...baseData,
          requirementId: formValues.requirementId || undefined,
          estimatedHours: formValues.estimatedHours ? Number(formValues.estimatedHours) : undefined,
          actualHours: 0,
          checklist: [],
          dueDate: formValues.dueDate || undefined,
        });
      } else {
        workItems.createDefect({
          ...baseData,
          severity: formValues.severity as '致命' | '严重' | '一般' | '轻微',
          requirementId: formValues.requirementId || undefined,
          taskId: formValues.taskId || undefined,
          reproductionSteps: formValues.reproductionSteps || undefined,
          dueDate: formValues.dueDate || undefined,
        });
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[640px]">
        <DialogHeader>
          <DialogTitle>新建{TYPE_LABEL_MAP[type]}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          {/* 标题 */}
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              placeholder="请输入标题"
              maxLength={100}
              value={formValues.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label>描述</Label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              style={{ height: 180, marginBottom: 40 }}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />
          </div>

          {/* 优先级 + 负责人 */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>优先级</Label>
              <Select value={formValues.priority} onValueChange={(v) => updateField('priority', v)}>
                <SelectTrigger className={errors.priority ? 'border-destructive' : ''}>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
            </div>

            <div className="flex-1 space-y-2">
              <Label>负责人</Label>
              <Select value={formValues.assigneeId} onValueChange={(v) => updateField('assigneeId', v)}>
                <SelectTrigger className={errors.assigneeId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {initialEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigneeId && <p className="text-sm text-destructive">{errors.assigneeId}</p>}
            </div>
          </div>

          {/* 需求特有字段 */}
          {type === 'requirement' && (
            <div className="space-y-2">
              <Label>验收标准</Label>
              <Textarea
                placeholder="请输入验收标准"
                rows={3}
                value={formValues.acceptanceCriteria}
                onChange={(e) => updateField('acceptanceCriteria', e.target.value)}
              />
            </div>
          )}

          {/* 任务特有字段 */}
          {type === 'task' && (
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label>预计工时(h)</Label>
                <Input
                  type="number"
                  min={0}
                  max={999}
                  placeholder="0"
                  value={formValues.estimatedHours}
                  onChange={(e) => updateField('estimatedHours', e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>截止日期</Label>
                <Input
                  type="date"
                  value={formValues.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 缺陷特有字段 */}
          {type === 'defect' && (
            <>
              <div className="space-y-2">
                <Label>严重程度</Label>
                <Select value={formValues.severity} onValueChange={(v) => updateField('severity', v)}>
                  <SelectTrigger className={errors.severity ? 'border-destructive' : ''}>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_OPTIONS.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.severity && <p className="text-sm text-destructive">{errors.severity}</p>}
              </div>
              <div className="space-y-2">
                <Label>复现步骤</Label>
                <Textarea
                  placeholder="请输入复现步骤"
                  rows={3}
                  value={formValues.reproductionSteps}
                  onChange={(e) => updateField('reproductionSteps', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>截止日期</Label>
                <Input
                  type="date"
                  value={formValues.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                />
              </div>
            </>
          )}

          {/* 关联合同 */}
          <div className="space-y-2">
            <Label>关联合同</Label>
            <Input
              placeholder="请输入合同编号（可选）"
              value={formValues.contractId}
              onChange={(e) => updateField('contractId', e.target.value)}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit" disabled={submitting} onClick={handleSubmit}>
            {submitting ? '提交中...' : '确定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
