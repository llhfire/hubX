import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Textarea } from '../../components/ui/textarea';
import { FileText, Gift, Plus } from 'lucide-react';
import { RechargeRecord, formatCurrency, initialRechargeRecords, optimizers, platforms } from './mockData';

const initialFormValues = {
  date: '',
  platform: '',
  amount: '',
  bonusAmount: '0',
  operator: '张优化',
  remark: '',
};

export function LeadCostRecharge() {
  const [records, setRecords] = useState<RechargeRecord[]>(initialRechargeRecords);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(initialFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = records.reduce((sum, item) => sum + item.amount, 0);
  const totalBonus = records.reduce((sum, item) => sum + item.bonusAmount, 0);

  const setFieldValue = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.date) newErrors.date = '请选择充值日期';
    if (!form.platform) newErrors.platform = '请选择平台';
    if (!form.amount) newErrors.amount = '请输入充值金额';
    if (!form.operator) newErrors.operator = '请选择充值人';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const nextRecord: RechargeRecord = {
      key: `recharge-${Date.now()}`,
      date: form.date,
      platform: form.platform,
      amount: Number(form.amount),
      bonusAmount: Number(form.bonusAmount) || 0,
      operator: form.operator,
      remark: form.remark,
    };

    setRecords([nextRecord, ...records]);
    setVisible(false);
    setForm(initialFormValues);
    setErrors({});
    toast.success('充值记录已新增');
  };

  const handleCancel = () => {
    setVisible(false);
    setForm(initialFormValues);
    setErrors({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">充值记录</h4>
        <Button onClick={() => setVisible(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增充值
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">本月充值总额</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {formatCurrency(totalAmount)}元
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">本月赠送总额</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Gift className="h-5 w-5" />
              {formatCurrency(totalBonus)}元
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">账户总入账</div>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount + totalBonus)}元</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Input type="date" className="w-[130px]" />
            <Input type="date" className="w-[130px]" />
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="平台" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="充值人" />
              </SelectTrigger>
              <SelectContent>
                {optimizers.map((optimizer) => (
                  <SelectItem key={optimizer} value={optimizer}>{optimizer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>搜索</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">充值日期</TableHead>
                <TableHead className="w-24">平台</TableHead>
                <TableHead className="w-32">充值金额</TableHead>
                <TableHead className="w-32">赠送金额</TableHead>
                <TableHead className="w-28">充值人</TableHead>
                <TableHead>备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.key}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell><Badge variant="default">{record.platform}</Badge></TableCell>
                  <TableCell>{formatCurrency(record.amount)}</TableCell>
                  <TableCell>{formatCurrency(record.bonusAmount)}</TableCell>
                  <TableCell>{record.operator}</TableCell>
                  <TableCell>{record.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>新增充值记录</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>充值日期 <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.date} onChange={(e) => setFieldValue('date', e.target.value)} />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label>充值平台 <span className="text-destructive">*</span></Label>
              <Select value={form.platform} onValueChange={(v) => setFieldValue('platform', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择平台" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.platform && <p className="text-sm text-destructive">{errors.platform}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>充值金额 <span className="text-destructive">*</span></Label>
              <Input type="number" min={0} step={0.01} value={form.amount} onChange={(e) => setFieldValue('amount', e.target.value)} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label>赠送金额</Label>
              <Input type="number" min={0} step={0.01} value={form.bonusAmount} onChange={(e) => setFieldValue('bonusAmount', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>充值人 <span className="text-destructive">*</span></Label>
            <Select value={form.operator} onValueChange={(v) => setFieldValue('operator', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {optimizers.map((optimizer) => (
                  <SelectItem key={optimizer} value={optimizer}>{optimizer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.operator && <p className="text-sm text-destructive">{errors.operator}</p>}
          </div>

          <div className="space-y-2">
            <Label>备注</Label>
            <Textarea placeholder="请输入充值备注" rows={3} value={form.remark} onChange={(e) => setFieldValue('remark', e.target.value)} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>取消</Button>
            <Button onClick={handleCreate}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
