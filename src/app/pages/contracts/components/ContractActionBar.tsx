// 顶部操作按钮组：按当前合同状态动态切换。
//
// 状态 → 主操作映射（详见 plan Q13 分叉 4）：
//   draft         → 编辑 / 提交审批 / 作废
//   approving     → 撤回审批 / [演示] 通过当前节点 / [演示] 驳回
//   pending_mail  → 标记已寄出 / 撤回到草稿 / 作废
//   pending_return→ 上传回寄件（在扫描归档 Tab 上传）/ 重做
//   archived      → 关联项目 / 补充扫描件（在归档 Tab 上传）
//   voided        → 无操作

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Send, Check, X, Link } from 'lucide-react';
import { useContracts } from '../ContractsContext';
import type { Contract } from '../types';

interface Props {
  contract: Contract;
}

export function ContractActionBar({ contract }: Props) {
  const navigate = useNavigate();
  const {
    submitForApproval,
    withdrawApproval,
    markMailed,
    voidContract,
    approveStep,
    rejectStep,
  } = useContracts();

  const [voidModalVisible, setVoidModalVisible] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const onEdit = () => navigate(`/contracts/${contract.id}/edit`);
  const onSubmit = () => {
    submitForApproval(contract.id, contract.current);
    toast.success('已提交审批');
  };
  const onWithdraw = () => {
    withdrawApproval(contract.id);
    toast.success('已撤回审批');
  };
  const onMailed = () => {
    markMailed(contract.id);
    toast.success('已标记寄出，进入「待回寄」状态');
  };
  const onVoid = () => {
    if (!voidReason.trim()) {
      toast.error('请填写作废原因');
      return;
    }
    voidContract(contract.id, voidReason.trim());
    toast.success('合同已作废');
    setVoidModalVisible(false);
  };

  // 演示用：找到第一个 pending 节点，把它置为 approved
  const onApproveDemoNext = () => {
    const idx = contract.approvalFlow.findIndex((n) => n.status === 'pending');
    if (idx < 0) {
      toast.warning('没有待审批节点');
      return;
    }
    approveStep(contract.id, idx, '同意（演示）');
    toast.success(`已通过节点：${contract.approvalFlow[idx].step}`);
  };

  const onRejectDemo = () => {
    if (!rejectReason.trim()) {
      toast.error('请填写驳回原因');
      return;
    }
    const idx = contract.approvalFlow.findIndex((n) => n.status === 'pending');
    if (idx < 0) {
      toast.warning('没有待审批节点');
      return;
    }
    rejectStep(contract.id, idx, rejectReason.trim());
    toast.warning('合同已驳回，回到「草稿」');
    setRejectModalVisible(false);
  };

  const buttons: React.ReactNode[] = [];

  switch (contract.status) {
    case 'draft':
      buttons.push(
        <Button key="edit" onClick={onEdit}>
          <Pencil className="size-4" />
          编辑
        </Button>,
        <Button key="submit" onClick={onSubmit}>
          <Send className="size-4" />
          提交审批
        </Button>,
        <Button key="void" variant="destructive" onClick={() => setVoidModalVisible(true)}>
          作废
        </Button>,
      );
      break;
    case 'approving':
      buttons.push(
        <Button key="approve" onClick={onApproveDemoNext}>
          <Check className="size-4" />
          [演示] 通过下一节点
        </Button>,
        <Button key="reject" variant="destructive" onClick={() => setRejectModalVisible(true)}>
          <X className="size-4" />
          [演示] 驳回
        </Button>,
        <Button key="withdraw" variant="outline" onClick={onWithdraw}>
          撤回审批
        </Button>,
      );
      break;
    case 'pending_mail':
      buttons.push(
        <Button key="mailed" onClick={onMailed}>
          <Send className="size-4" />
          标记已寄出
        </Button>,
        <Button key="void" variant="destructive" onClick={() => setVoidModalVisible(true)}>
          作废
        </Button>,
      );
      break;
    case 'pending_return':
      buttons.push(
        <span key="hint" className="text-muted-foreground text-[13px]">
          请在下方「扫描件归档」Tab 上传客户回寄件
        </span>,
        <Button key="void" variant="destructive" onClick={() => setVoidModalVisible(true)}>
          作废
        </Button>,
      );
      break;
    case 'archived':
      buttons.push(
        <Button key="link">
          <Link className="size-4" />
          关联项目
        </Button>,
        <span key="hint" className="text-muted-foreground text-[13px]">
          可在「扫描件归档」Tab 补充上传
        </span>,
      );
      break;
    case 'voided':
      buttons.push(
        <span key="hint" className="text-destructive text-[13px]">
          合同已作废
        </span>,
      );
      break;
  }

  return (
    <>
      <div className="flex gap-2">{buttons}</div>

      <Dialog open={voidModalVisible} onOpenChange={setVoidModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>作废合同</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>作废原因 <span className="text-destructive">*</span></Label>
            <Textarea
              rows={3}
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="作废后无法恢复，请填写原因"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoidModalVisible(false)}>取消</Button>
            <Button variant="destructive" onClick={onVoid}>确认作废</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalVisible} onOpenChange={setRejectModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回审批</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>驳回原因 <span className="text-destructive">*</span></Label>
            <Textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="例如：金额超出审批权限，请下调或申请特批"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalVisible(false)}>取消</Button>
            <Button variant="destructive" onClick={onRejectDemo}>确认驳回</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
