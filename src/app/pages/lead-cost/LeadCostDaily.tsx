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
import { Plus } from 'lucide-react';
import {
  DailyCostRecord,
  calculateActualCost,
  calculateNominalCost,
  calculateValidRate,
  channelOptions,
  formatCurrency,
  initialDailyCostRecords,
  optimizers,
  platforms,
} from './mockData';

const initialFormValues = {
  date: '',
  platform: '',
  channel: '',
  optimizer: '张优化',
  spend: '',
  refund: '0',
  validLeads: '',
  invalidLeads: '',
  highQualityLeads: '0',
};

export function LeadCostDaily() {
  const [records, setRecords] = useState<DailyCostRecord[]>(initialDailyCostRecords);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(initialFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!form.date) newErrors.date = '请选择日期';
    if (!form.platform) newErrors.platform = '请选择平台';
    if (!form.channel) newErrors.channel = '请选择渠道';
    if (!form.spend) newErrors.spend = '请输入消耗金额';
    if (!form.validLeads) newErrors.validLeads = '请输入有效线索数';
    if (!form.invalidLeads) newErrors.invalidLeads = '请输入无效线索数';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const nextRecord: DailyCostRecord = {
      key: `daily-${Date.now()}`,
      date: form.date,
      platform: form.platform,
      channel: form.channel,
      optimizer: form.optimizer,
      spend: Number(form.spend),
      refund: Number(form.refund) || 0,
      validLeads: Number(form.validLeads),
      invalidLeads: Number(form.invalidLeads),
      highQualityLeads: Number(form.highQualityLeads) || 0,
    };

    setRecords([nextRecord, ...records]);
    setVisible(false);
    setForm(initialFormValues);
    setErrors({});
    toast.success('投放日报已新增');
  };

  const handleCancel = () => {
    setVisible(false);
    setForm(initialFormValues);
    setErrors({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">投放日报</h4>
        <Button onClick={() => setVisible(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增日报
        </Button>
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
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="渠道" />
              </SelectTrigger>
              <SelectContent>
                {channelOptions.map((item) => (
                  <SelectItem key={item.channel} value={item.channel}>{item.channel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="录入人" />
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">日期</TableHead>
                  <TableHead className="w-24">平台</TableHead>
                  <TableHead className="w-48">渠道/账户</TableHead>
                  <TableHead className="w-24">录入人</TableHead>
                  <TableHead className="w-28">消耗金额</TableHead>
                  <TableHead className="w-28">退款金额</TableHead>
                  <TableHead className="w-24">有效线索</TableHead>
                  <TableHead className="w-24">无效线索</TableHead>
                  <TableHead className="w-24">有效率</TableHead>
                  <TableHead className="w-28">名义成本</TableHead>
                  <TableHead className="w-28">实际成本</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.key}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell><Badge variant="default">{record.platform}</Badge></TableCell>
                    <TableCell>{record.channel}</TableCell>
                    <TableCell>{record.optimizer}</TableCell>
                    <TableCell>{formatCurrency(record.spend)}</TableCell>
                    <TableCell>{formatCurrency(record.refund)}</TableCell>
                    <TableCell>{record.validLeads}</TableCell>
                    <TableCell>{record.invalidLeads}</TableCell>
                    <TableCell>{calculateValidRate(record).toFixed(1)}%</TableCell>
                    <TableCell>{formatCurrency(calculateNominalCost(record))}</TableCell>
                    <TableCell>{formatCurrency(calculateActualCost(record))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>新增投放日报</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>日期 <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.date} onChange={(e) => setFieldValue('date', e.target.value)} />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label>平台 <span className="text-destructive">*</span></Label>
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
            <div className="space-y-2">
              <Label>渠道/账户 <span className="text-destructive">*</span></Label>
              <Select value={form.channel} onValueChange={(v) => setFieldValue('channel', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择渠道" />
                </SelectTrigger>
                <SelectContent>
                  {channelOptions.map((item) => (
                    <SelectItem key={item.channel} value={item.channel}>{item.channel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.channel && <p className="text-sm text-destructive">{errors.channel}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>消耗金额 <span className="text-destructive">*</span></Label>
              <Input type="number" min={0} step={0.01} value={form.spend} onChange={(e) => setFieldValue('spend', e.target.value)} />
              {errors.spend && <p className="text-sm text-destructive">{errors.spend}</p>}
            </div>
            <div className="space-y-2">
              <Label>退款金额</Label>
              <Input type="number" min={0} step={0.01} value={form.refund} onChange={(e) => setFieldValue('refund', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>录入人 <span className="text-destructive">*</span></Label>
              <Select value={form.optimizer} onValueChange={(v) => setFieldValue('optimizer', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {optimizers.map((optimizer) => (
                    <SelectItem key={optimizer} value={optimizer}>{optimizer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>有效线索数 <span className="text-destructive">*</span></Label>
              <Input type="number" min={0} step={1} value={form.validLeads} onChange={(e) => setFieldValue('validLeads', e.target.value)} />
              {errors.validLeads && <p className="text-sm text-destructive">{errors.validLeads}</p>}
            </div>
            <div className="space-y-2">
              <Label>无效线索数 <span className="text-destructive">*</span></Label>
              <Input type="number" min={0} step={1} value={form.invalidLeads} onChange={(e) => setFieldValue('invalidLeads', e.target.value)} />
              {errors.invalidLeads && <p className="text-sm text-destructive">{errors.invalidLeads}</p>}
            </div>
            <div className="space-y-2">
              <Label>高意向线索数</Label>
              <Input type="number" min={0} step={1} value={form.highQualityLeads} onChange={(e) => setFieldValue('highQualityLeads', e.target.value)} />
            </div>
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
