import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, TransportMode, AccommodationType } from '../types';
import { createTrip } from '../travel-api';

export function TripForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // 基本信息
    customerId: '',
    customerName: '',
    projectId: '',
    projectName: '',
    purpose: '',
    // 行程信息
    destinations: [] as string[],
    destinationInput: '',
    startDate: '',
    endDate: '',
    transportModes: [] as TransportMode[],
    // 住宿信息
    accommodationIntent: 'hotel' as AccommodationType,
    // 费用预估
    estimatedTransportCost: 0,
    estimatedAccommodationCost: 0,
    estimatedMealCost: 0,
    estimatedOtherCost: 0,
    // 借款
    needLoan: false,
    loanAmount: 0,
    loanReason: '',
  });

  // 计算天数
  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  // 计算预计总费用
  const calculateTotal = () => {
    return form.estimatedTransportCost + form.estimatedAccommodationCost + form.estimatedMealCost + form.estimatedOtherCost;
  };

  // 添加目的地
  const handleAddDestination = () => {
    if (form.destinationInput.trim() && !form.destinations.includes(form.destinationInput.trim())) {
      setForm({
        ...form,
        destinations: [...form.destinations, form.destinationInput.trim()],
        destinationInput: '',
      });
    }
  };

  // 删除目的地
  const handleRemoveDestination = (index: number) => {
    setForm({
      ...form,
      destinations: form.destinations.filter((_, i) => i !== index),
    });
  };

  // 切换交通方式
  const handleToggleTransport = (mode: TransportMode) => {
    setForm({
      ...form,
      transportModes: form.transportModes.includes(mode)
        ? form.transportModes.filter(m => m !== mode)
        : [...form.transportModes, mode],
    });
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    if (!form.destinations.length || !form.startDate || !form.endDate) {
      toast.error('请填写目的地和日期');
      return;
    }
    setLoading(true);
    try {
      await createTrip({
        ...form,
        days: calculateDays(),
        estimatedTotalCost: calculateTotal(),
        status: 'draft',
      });
      toast.success('草稿已保存');
      navigate('/travel/trips');
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交申请
  const handleSubmit = async () => {
    if (!form.purpose.trim()) {
      toast.error('请填写出差目的');
      return;
    }
    if (!form.destinations.length) {
      toast.error('请添加目的地');
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error('请选择出差日期');
      return;
    }
    if (form.needLoan && form.loanAmount <= 0) {
      toast.error('请填写借款金额');
      return;
    }
    setLoading(true);
    try {
      await createTrip({
        ...form,
        days: calculateDays(),
        estimatedTotalCost: calculateTotal(),
        status: 'pending',
      });
      toast.success('出差申请已提交');
      navigate('/travel/trips');
    } catch (error) {
      toast.error('提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/travel/trips')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
        <h2 className="text-lg font-semibold">新建出差申请</h2>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>关联客户</Label>
              <Input
                placeholder="选择客户（可选）"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>关联项目</Label>
              <Input
                placeholder="选择项目（可选）"
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>出差目的 <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="请填写出差目的"
              rows={3}
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 行程信息 */}
      <Card>
        <CardHeader>
          <CardTitle>行程信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>目的地 <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Input
                placeholder="输入目的地"
                value={form.destinationInput}
                onChange={(e) => setForm({ ...form, destinationInput: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDestination()}
              />
              <Button variant="outline" onClick={handleAddDestination}>
                添加
              </Button>
            </div>
            {form.destinations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.destinations.map((dest, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-md">
                    <span className="text-sm">{dest}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveDestination(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>出发日期 <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>返回日期 <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>出差天数</Label>
              <Input
                value={calculateDays() ? `${calculateDays()}天` : ''}
                disabled
                placeholder="自动计算"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>交通方式</Label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'high_speed_rail', label: '高铁' },
                { value: 'bullet_train', label: '动车' },
                { value: 'airplane', label: '飞机' },
                { value: 'self_drive', label: '自驾' },
                { value: 'bus', label: '大巴' },
                { value: 'ferry', label: '轮船' },
                { value: 'other', label: '其他' },
              ].map((mode) => (
                <div key={mode.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`transport-${mode.value}`}
                    checked={form.transportModes.includes(mode.value as TransportMode)}
                    onCheckedChange={() => handleToggleTransport(mode.value as TransportMode)}
                  />
                  <Label htmlFor={`transport-${mode.value}`} className="font-normal">
                    {mode.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 住宿信息 */}
      <Card>
        <CardHeader>
          <CardTitle>住宿信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>住宿方式意向</Label>
            <Select
              value={form.accommodationIntent}
              onValueChange={(value) => setForm({ ...form, accommodationIntent: value as AccommodationType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">酒店</SelectItem>
                <SelectItem value="dormitory">公司宿舍</SelectItem>
                <SelectItem value="none">无住宿</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 费用预估 */}
      <Card>
        <CardHeader>
          <CardTitle>费用预估</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>预计交通费</Label>
              <Input
                type="number"
                placeholder="¥0"
                value={form.estimatedTransportCost || ''}
                onChange={(e) => setForm({ ...form, estimatedTransportCost: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>预计住宿费</Label>
              <Input
                type="number"
                placeholder="¥0"
                value={form.estimatedAccommodationCost || ''}
                onChange={(e) => setForm({ ...form, estimatedAccommodationCost: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>预计餐饮费</Label>
              <Input
                type="number"
                placeholder="¥0"
                value={form.estimatedMealCost || ''}
                onChange={(e) => setForm({ ...form, estimatedMealCost: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>预计其他费用</Label>
              <Input
                type="number"
                placeholder="¥0"
                value={form.estimatedOtherCost || ''}
                onChange={(e) => setForm({ ...form, estimatedOtherCost: Number(e.target.value) })}
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">预计总费用</div>
              <div className="text-2xl font-bold">¥{calculateTotal().toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 借款申请 */}
      <Card>
        <CardHeader>
          <CardTitle>借款申请</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="needLoan"
              checked={form.needLoan}
              onCheckedChange={(checked) => setForm({ ...form, needLoan: checked as boolean })}
            />
            <Label htmlFor="needLoan">需要借款</Label>
          </div>
          {form.needLoan && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>借款金额 <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="¥0"
                  value={form.loanAmount || ''}
                  onChange={(e) => setForm({ ...form, loanAmount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>借款理由</Label>
                <Input
                  placeholder="请填写借款理由"
                  value={form.loanReason}
                  onChange={(e) => setForm({ ...form, loanReason: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/travel/trips')}>
          取消
        </Button>
        <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          保存草稿
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          <Send className="mr-2 h-4 w-4" />
          提交申请
        </Button>
      </div>
    </div>
  );
}
