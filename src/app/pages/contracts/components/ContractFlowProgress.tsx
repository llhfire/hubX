import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CONTRACT_STATUS_LABEL } from '../utils';
import { CheckCircle, Circle } from 'lucide-react';
import type { ContractStatus } from '../types';

const FLOW_ORDER: ContractStatus[] = [
  'draft',
  'approving',
  'pending_mail',
  'pending_return',
  'archived',
];

const STEP_DESCRIPTIONS: Record<ContractStatus, string> = {
  draft: '销售拟稿，可反复修改',
  approving: '商务/财务/法务依次审核',
  pending_mail: '审批通过，行政打印盖章并寄出',
  pending_return: '客户签字盖章后回寄',
  archived: '收到回寄件并扫描存档',
  voided: '合同已作废',
};

interface Props {
  status: ContractStatus;
}

export function ContractFlowProgress({ status }: Props) {
  if (status === 'voided') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>流转进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-destructive text-center">
            本合同已作废
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentIdx = FLOW_ORDER.indexOf(status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>流转进度</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {FLOW_ORDER.map((s, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={s} className="relative pb-8 last:pb-0">
                {/* 连接线 */}
                {idx < FLOW_ORDER.length - 1 && (
                  <div
                    className={`absolute left-[7px] top-5 h-full w-0.5 ${
                      isCompleted ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
                {/* 节点图标 */}
                <div className="absolute left-0 top-0.5">
                  {isCompleted || isCurrent ? (
                    <CheckCircle className={`size-4 ${isCompleted ? 'text-primary' : 'text-primary animate-pulse'}`} />
                  ) : (
                    <Circle className="size-4 text-muted-foreground" />
                  )}
                </div>
                {/* 内容 */}
                <div className="ml-2">
                  <div className={`text-sm font-medium ${isCurrent ? 'text-primary' : ''}`}>
                    {CONTRACT_STATUS_LABEL[s]}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {STEP_DESCRIPTIONS[s]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
