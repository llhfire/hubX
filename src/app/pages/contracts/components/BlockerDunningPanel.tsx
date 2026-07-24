import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useContracts } from '../ContractsContext';
import type { Contract, BlockerType } from '../types';
import { BLOCKER_TYPE_LABELS } from '../types';

interface Props {
  contract: Contract;
}

export function BlockerDunningPanel({ contract }: Props) {
  const { addBlocker, resolveBlocker, addDunning } = useContracts();
  const [blockerVisible, setBlockerVisible] = useState(false);
  const [dunningVisible, setDunningVisible] = useState(false);

  // Blocker form state
  const [blockerType, setBlockerType] = useState('');
  const [blockerTitle, setBlockerTitle] = useState('');
  const [blockerDesc, setBlockerDesc] = useState('');
  const [blockerAmount, setBlockerAmount] = useState('');

  // Dunning form state
  const [dunningDate, setDunningDate] = useState('');
  const [dunningMethod, setDunningMethod] = useState('');
  const [dunningPerson, setDunningPerson] = useState('');
  const [dunningResult, setDunningResult] = useState('');
  const [dunningNextPlan, setDunningNextPlan] = useState('');

  const activeBlockers = (contract.paymentBlockers ?? []).filter(b => !b.resolvedAt);
  const resolvedBlockers = (contract.paymentBlockers ?? []).filter(b => b.resolvedAt);
  const dunningRecords = contract.dunningRecords ?? [];

  const handleAddBlocker = () => {
    if (!blockerType) {
      toast.error('请选择卡点类型');
      return;
    }
    if (!blockerTitle.trim()) {
      toast.error('请输入标题');
      return;
    }
    addBlocker(contract.id, {
      type: blockerType as BlockerType,
      title: blockerTitle.trim(),
      description: blockerDesc.trim(),
      amountBlocked: Number(blockerAmount) || 0,
    });
    setBlockerVisible(false);
    setBlockerType('');
    setBlockerTitle('');
    setBlockerDesc('');
    setBlockerAmount('');
    toast.success('卡点已添加');
  };

  const handleAddDunning = () => {
    if (!dunningDate.trim()) {
      toast.error('请输入日期');
      return;
    }
    if (!dunningMethod) {
      toast.error('请选择方式');
      return;
    }
    if (!dunningPerson.trim()) {
      toast.error('请输入联系人');
      return;
    }
    addDunning(contract.id, {
      date: dunningDate.trim(),
      method: dunningMethod,
      contactPerson: dunningPerson.trim(),
      result: dunningResult.trim(),
      nextPlan: dunningNextPlan.trim(),
    });
    setDunningVisible(false);
    setDunningDate('');
    setDunningMethod('');
    setDunningPerson('');
    setDunningResult('');
    setDunningNextPlan('');
    toast.success('催款记录已添加');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 卡点管理 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-[13px]">卡点管理</span>
          <Button size="sm" onClick={() => setBlockerVisible(true)}>
            <Plus className="size-3" />
            添加卡点
          </Button>
        </div>
        {activeBlockers.length === 0 && resolvedBlockers.length === 0 && (
          <div className="text-muted-foreground text-xs text-center py-4">暂无卡点</div>
        )}
        {activeBlockers.map(b => (
          <div key={b.id} className="bg-red-50 dark:bg-red-950/20 rounded-md p-2 mb-1.5 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <Badge variant="destructive" className="text-[10px] mr-1">{BLOCKER_TYPE_LABELS[b.type]}</Badge>
                <span className="font-semibold">{b.title}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                onClick={() => {
                  resolveBlocker(contract.id, b.id);
                  toast.success('卡点已解决');
                }}
              >
                解决
              </Button>
            </div>
            <div className="text-muted-foreground mt-1">卡住金额：&yen;{(b.amountBlocked / 10000).toFixed(1)}万</div>
          </div>
        ))}
        {resolvedBlockers.length > 0 && (
          <div className="mt-2 text-[11px] text-muted-foreground">
            已解决 {resolvedBlockers.length} 个卡点
          </div>
        )}
      </div>

      <div className="border-t" />

      {/* 催款记录 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-[13px]">催款记录</span>
          <Button size="sm" onClick={() => setDunningVisible(true)}>
            <Plus className="size-3" />
            添加催款
          </Button>
        </div>
        {dunningRecords.length > 0 ? (
          <div className="relative pl-6 space-y-0">
            {dunningRecords.map((d, idx) => (
              <div key={d.id} className="relative pb-4 last:pb-0">
                {/* 连接线 */}
                {idx < dunningRecords.length - 1 && (
                  <div className="absolute left-[5px] top-4 h-full w-0.5 bg-border" />
                )}
                {/* 圆点 */}
                <div className="absolute left-0 top-1.5 size-2.5 rounded-full bg-muted-foreground" />
                {/* 内容 */}
                <div className="ml-2">
                  <div className="text-xs text-muted-foreground">{d.date}</div>
                  <div className="text-xs mt-0.5">
                    <span className="font-semibold">{d.method}</span> &middot; 联系人：{d.contactPerson}
                  </div>
                  <div className="text-[11px] text-muted-foreground">结果：{d.result}</div>
                  <div className="text-[11px] text-muted-foreground">下一步：{d.nextPlan}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-xs text-center py-4">暂无催款记录</div>
        )}
      </div>

      {/* 添加卡点 Dialog */}
      <Dialog open={blockerVisible} onOpenChange={setBlockerVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加卡点</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>卡点类型 <span className="text-destructive">*</span></Label>
              <Select value={blockerType} onValueChange={setBlockerType}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BLOCKER_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>标题 <span className="text-destructive">*</span></Label>
              <Input placeholder="如：客户验收迟迟不签字" value={blockerTitle} onChange={(e) => setBlockerTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>描述</Label>
              <Textarea placeholder="卡点详细描述" value={blockerDesc} onChange={(e) => setBlockerDesc(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>卡住金额（元）</Label>
              <Input type="number" placeholder="0" value={blockerAmount} onChange={(e) => setBlockerAmount(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockerVisible(false)}>取消</Button>
            <Button onClick={handleAddBlocker}>确认添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加催款 Dialog */}
      <Dialog open={dunningVisible} onOpenChange={setDunningVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加催款记录</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>日期 <span className="text-destructive">*</span></Label>
              <Input placeholder="2026-07-01" value={dunningDate} onChange={(e) => setDunningDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>方式 <span className="text-destructive">*</span></Label>
              <Select value={dunningMethod} onValueChange={setDunningMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="电话">电话</SelectItem>
                  <SelectItem value="微信">微信</SelectItem>
                  <SelectItem value="邮件">邮件</SelectItem>
                  <SelectItem value="当面">当面</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>联系人 <span className="text-destructive">*</span></Label>
              <Input placeholder="对方联系人" value={dunningPerson} onChange={(e) => setDunningPerson(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>结果</Label>
              <Textarea placeholder="催款结果" value={dunningResult} onChange={(e) => setDunningResult(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>下一步计划</Label>
              <Input placeholder="下一步计划" value={dunningNextPlan} onChange={(e) => setDunningNextPlan(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDunningVisible(false)}>取消</Button>
            <Button onClick={handleAddDunning}>确认添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
