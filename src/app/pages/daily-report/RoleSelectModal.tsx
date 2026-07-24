// src/app/pages/daily-report/RoleSelectModal.tsx

import { Headphones, FlaskConical, PenLine, LayoutGrid } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSelect: (role: 'sales' | 'general' | 'ad-delivery' | 'dev') => void;
}

const REPORT_TYPES = [
  { key: 'sales' as const,        label: '销售日报',  desc: '线索跟进、客户沟通',     icon: Headphones, color: 'text-blue-500' },
  { key: 'ad-delivery' as const,  label: '投放日报',  desc: '平台投放数据、优化动作',  icon: FlaskConical, color: 'text-orange-500' },
  { key: 'dev' as const,          label: '开发日报',  desc: '工种/项目/工时/代码进展', icon: PenLine, color: 'text-green-500' },
  { key: 'general' as const,      label: '通用日报',  desc: '项目任务、总结、计划',     icon: LayoutGrid, color: 'text-purple-500' },
];

export function RoleSelectModal({ visible, onCancel, onSelect }: Props) {
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>选择日报类型</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-center text-muted-foreground mb-4">
            请选择您当前要填写的日报类型：
          </p>
          <div className="flex flex-col gap-3">
            {REPORT_TYPES.map(rt => {
              const Icon = rt.icon;
              return (
                <Button
                  key={rt.key}
                  variant="outline"
                  className="w-full h-16 justify-start px-5"
                  onClick={() => onSelect(rt.key)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${rt.color}`} />
                    <div className="text-left">
                      <div className="font-semibold text-sm">{rt.label}</div>
                      <div className="text-xs text-muted-foreground">{rt.desc}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
