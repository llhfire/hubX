import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import type { DeliveryType, DeliveryConfig } from './types';
import { DELIVERY_TYPES } from './types';
import { SOP_PHASES, DELIVERY_TYPE_PHASE4_STEPS } from './constants';
import { SOP_STEP_TEMPLATES } from './sopTemplate';

/** 中文数字映射，用于板块显示 */
const PHASE_NO_CN: Record<number, string> = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
};

interface DeliveryConfigModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (config: DeliveryConfig) => void;
  contractId?: string;
  deliveryType?: DeliveryType;
  projectStartDate?: string;
}

export function DeliveryConfigModal({
  visible,
  onCancel,
  onConfirm,
  contractId,
  deliveryType,
  projectStartDate,
}: DeliveryConfigModalProps) {
  const hasContract = !!contractId;

  // 交付类型：有合同时从 props 取，无合同时由用户选择
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<DeliveryType | undefined>(
    deliveryType,
  );

  // 板块勾选：默认全选
  const [selectedPhases, setSelectedPhases] = useState<number[]>(
    SOP_PHASES.map((p) => p.phaseNo),
  );

  // 打开时重置状态
  useEffect(() => {
    if (!visible) return;
    setSelectedDeliveryType(deliveryType);
    if (hasContract) {
      // 有合同：默认全选
      setSelectedPhases(SOP_PHASES.map((p) => p.phaseNo));
    } else {
      // 无合同：板块一禁用且不选中
      setSelectedPhases(SOP_PHASES.filter((p) => p.phaseNo !== 1).map((p) => p.phaseNo));
    }
  }, [visible, hasContract, deliveryType]);

  // 当前生效的交付类型
  const effectiveDeliveryType = hasContract ? deliveryType : selectedDeliveryType;

  // 板块四预览步骤
  const phase4PreviewSteps = useMemo(() => {
    if (!effectiveDeliveryType) return [];
    const stepNos = DELIVERY_TYPE_PHASE4_STEPS[effectiveDeliveryType] ?? [];
    return stepNos
      .map((stepNo) => {
        const tpl = SOP_STEP_TEMPLATES.find((t) => t.stepNo === stepNo);
        return tpl ? { stepNo, stepName: tpl.stepName } : null;
      })
      .filter(Boolean) as Array<{ stepNo: string; stepName: string }>;
  }, [effectiveDeliveryType]);

  const startDateMissing = !projectStartDate;

  const handleConfirm = () => {
    if (!effectiveDeliveryType) return;
    onConfirm({
      selectedPhases,
      deliveryType: effectiveDeliveryType,
      contractId,
    });
  };

  const handlePhaseToggle = (phaseNo: number) => {
    setSelectedPhases((prev) =>
      prev.includes(phaseNo) ? prev.filter((p) => p !== phaseNo) : [...prev, phaseNo],
    );
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>生成交付计划</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* 项目开始日期缺失警告 */}
          {startDateMissing && (
            <Alert variant="destructive">
              <AlertDescription>请先在项目基础信息中填写开始日期</AlertDescription>
            </Alert>
          )}

          {/* 合同信息（有合同时展示） */}
          {hasContract && (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">合同编号</span>
                <span className="text-sm">{contractId}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">交付类型</span>
                <span className="text-sm">{deliveryType}</span>
              </div>
            </>
          )}

          {/* 交付类型选择（无合同时） */}
          {!hasContract && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                交付类型 <span className="text-destructive">*</span>
              </span>
              <Select
                value={selectedDeliveryType}
                onValueChange={(val: DeliveryType) => setSelectedDeliveryType(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择交付类型" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_TYPES.map((dt) => (
                    <SelectItem key={dt} value={dt}>
                      {dt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* 板块选择 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">选择交付板块</span>
            <div className="flex flex-col gap-2">
              {SOP_PHASES.map((phase) => {
                const disabled = !hasContract && phase.phaseNo === 1;
                return (
                  <label key={phase.phaseNo} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedPhases.includes(phase.phaseNo)}
                      onCheckedChange={() => handlePhaseToggle(phase.phaseNo)}
                      disabled={disabled}
                    />
                    <span className="text-sm">
                      {PHASE_NO_CN[phase.phaseNo]}、{phase.phaseName}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 板块四步骤预览 */}
          {effectiveDeliveryType && (
            <>
              <Separator />
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">
                  板块四预览（{effectiveDeliveryType}）
                </span>
                <div className="rounded bg-muted p-3">
                  {phase4PreviewSteps.length === 0 ? (
                    <span className="text-sm text-muted-foreground">无匹配步骤</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {phase4PreviewSteps.map((step) => (
                        <span key={step.stepNo} className="text-sm">
                          {step.stepNo} {step.stepName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>取消</Button>
          <Button
            onClick={handleConfirm}
            disabled={startDateMissing || !effectiveDeliveryType || selectedPhases.length === 0}
          >
            确认生成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
