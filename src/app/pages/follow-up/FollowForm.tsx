// ============================================================
// HubX 统一跟进记录 — 跟进表单组件
// ============================================================

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Paperclip, X } from 'lucide-react';
import type {
  FollowRecord, FollowType, FollowMethod, EntityType,
  LeadStage, IntentLevel, CustomerStatus, ProjectStatus, Attachment
} from './types';
import {
  followTypeConfig, followMethodConfig,
  leadStageConfig, projectStatusConfig
} from './types';

interface FollowFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  entityNo: string;
  entityName: string;
  initialData?: FollowRecord;
  onSubmit: (data: Omit<FollowRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function FollowForm({
  open,
  onOpenChange,
  entityType,
  entityId,
  entityNo,
  entityName,
  initialData,
  onSubmit
}: FollowFormProps) {
  const isEdit = !!initialData;

  const [type, setType] = useState<FollowType>(initialData?.type || '普通跟进');
  const [method, setMethod] = useState<FollowMethod>(initialData?.method || '电话沟通');
  const [content, setContent] = useState(initialData?.content || '');
  const [duration, setDuration] = useState(initialData?.duration?.toString() || '');
  const [nextFollowTime, setNextFollowTime] = useState(initialData?.nextFollowTime || '');
  const [attachments, setAttachments] = useState<Attachment[]>(initialData?.attachments || []);

  const [leadStage, setLeadStage] = useState<LeadStage | ''>(initialData?.leadStage || '');
  const [intentLevel, setIntentLevel] = useState<IntentLevel | ''>(initialData?.intentLevel || '');
  const [customerStatus, setCustomerStatus] = useState<CustomerStatus | ''>(initialData?.customerStatus || '');

  const [projectStatus, setProjectStatus] = useState<ProjectStatus | ''>(initialData?.projectStatus || '');
  const [progress, setProgress] = useState(initialData?.progress?.toString() || '');

  const availableTypes = Object.entries(followTypeConfig)
    .filter(([_, config]) => config.availableFor.includes(entityType))
    .map(([type]) => type as FollowType);

  const handleFileUpload = () => {
    const mockAttachment: Attachment = {
      id: `att_${Date.now()}`,
      name: `附件_${attachments.length + 1}.pdf`,
      size: 1024 * 100,
      url: '#',
      type: 'application/pdf',
    };
    setAttachments([...attachments, mockAttachment]);
    toast.success('附件已添加');
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('请输入跟进内容');
      return;
    }

    const submitData: Omit<FollowRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      entityType,
      entityId,
      entityNo,
      entityName,
      type,
      method,
      content: content.trim(),
      duration: duration ? parseInt(duration) : undefined,
      nextFollowTime: nextFollowTime || undefined,
      attachments,
      operatorId: 'emp-001',
      operatorName: '张三',
      leadStage: entityType === 'lead' && leadStage ? leadStage as LeadStage : undefined,
      intentLevel: entityType === 'lead' && intentLevel ? intentLevel as IntentLevel : undefined,
      customerStatus: entityType === 'lead' && customerStatus ? customerStatus as CustomerStatus : undefined,
      projectStatus: entityType === 'project' && projectStatus ? projectStatus as ProjectStatus : undefined,
      progress: entityType === 'project' && progress ? parseInt(progress) : undefined,
    };

    onSubmit(submitData);
    onOpenChange(false);
    resetForm();
    toast.success(isEdit ? '跟进记录已更新' : '跟进记录已添加');
  };

  const resetForm = () => {
    setType('普通跟进');
    setMethod('电话沟通');
    setContent('');
    setDuration('');
    setNextFollowTime('');
    setAttachments([]);
    setLeadStage('');
    setIntentLevel('');
    setCustomerStatus('');
    setProjectStatus('');
    setProgress('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-lg">{isEdit ? '编辑跟进记录' : '添加跟进记录'}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* 第一行：跟进类型 + 跟进方式 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">跟进类型</Label>
              <Select value={type} onValueChange={(v) => setType(v as FollowType)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map(t => (
                    <SelectItem key={t} value={t}>{followTypeConfig[t].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">跟进方式</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as FollowMethod)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(followMethodConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 跟进内容 */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">跟进内容 <span className="text-red-500">*</span></Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入跟进内容..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* 第二行：跟进时长 + 下次跟进时间 */}
          <div className="grid grid-cols-2 gap-4">
            {type === '普通跟进' && (
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">跟进时长（分钟）</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="如：30"
                  min="0"
                  className="h-9"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">下次跟进时间</Label>
              <Input
                type="datetime-local"
                value={nextFollowTime}
                onChange={(e) => setNextFollowTime(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* 线索专属字段 */}
          {entityType === 'lead' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">线索阶段</Label>
                <Select value={leadStage} onValueChange={(v) => setLeadStage(v as LeadStage | '')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(leadStageConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">意向等级</Label>
                <Select value={intentLevel} onValueChange={(v) => setIntentLevel(v as IntentLevel | '')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="意向高">意向高</SelectItem>
                    <SelectItem value="意向中">意向中</SelectItem>
                    <SelectItem value="意向低">意向低</SelectItem>
                    <SelectItem value="无意向">无意向</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">客户状态</Label>
                <Select value={customerStatus} onValueChange={(v) => setCustomerStatus(v as CustomerStatus | '')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="有预算">有预算</SelectItem>
                    <SelectItem value="需汇报领导">需汇报领导</SelectItem>
                    <SelectItem value="竞品对比中">竞品对比中</SelectItem>
                    <SelectItem value="价格敏感">价格敏感</SelectItem>
                    <SelectItem value="决策周期长">决策周期长</SelectItem>
                    <SelectItem value="已流失">已流失</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 项目专属字段 */}
          {entityType === 'project' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">项目阶段</Label>
                <Select value={projectStatus} onValueChange={(v) => setProjectStatus(v as ProjectStatus | '')}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(projectStatusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">完成进度（%）</Label>
                <Input
                  type="number"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="h-9"
                />
              </div>
            </div>
          )}

          {/* 附件 */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">附件</Label>
            <div className="flex flex-wrap gap-2">
              {attachments.map(att => (
                <div
                  key={att.id}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                >
                  <span className="truncate max-w-[100px]">{att.name}</span>
                  <button
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleFileUpload}
              >
                <Paperclip className="h-3 w-3 mr-1" />
                添加
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>取消</Button>
          <Button size="sm" onClick={handleSubmit}>{isEdit ? '保存' : '添加'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
