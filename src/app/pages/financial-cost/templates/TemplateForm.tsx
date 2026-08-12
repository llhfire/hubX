import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  initialExpenseTemplates,
  defaultCategories,
  getSubCategories,
  projectOptions,
  departmentOptions,
  cycleTypeMap,
  type CycleType,
  type OwnerType,
} from '../mockData';

export default function TemplateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const existingTemplate = isEdit ? initialExpenseTemplates.find(t => t.id === id) : null;

  // 表单状态
  const [templateName, setTemplateName] = useState(existingTemplate?.templateName ?? '');
  const [categoryId, setCategoryId] = useState(existingTemplate?.categoryId ?? '');
  const [subCategoryId, setSubCategoryId] = useState(existingTemplate?.subCategoryId ?? '');
  const [amount, setAmount] = useState(existingTemplate?.amount.toString() ?? '');
  const [cycleType, setCycleType] = useState<CycleType>(existingTemplate?.cycleType ?? 'monthly');
  const [startDate, setStartDate] = useState(existingTemplate?.startDate ?? new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(existingTemplate?.endDate ?? '');
  const [ownerType, setOwnerType] = useState<OwnerType>(
    existingTemplate?.projectId ? 'project' : existingTemplate?.departmentId ? 'department' : 'company'
  );
  const [projectId, setProjectId] = useState(existingTemplate?.projectId ?? '');
  const [departmentId, setDepartmentId] = useState(existingTemplate?.departmentId ?? '');

  // 金额调整弹窗
  const [adjustVisible, setAdjustVisible] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustDate, setAdjustDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountHistory, setAmountHistory] = useState(existingTemplate?.amountHistory ?? []);

  const subCategories = useMemo(() => {
    if (!categoryId) return [];
    return getSubCategories(categoryId);
  }, [categoryId]);

  const handleSave = () => {
    if (!templateName.trim()) { toast.error('请输入模板名称'); return; }
    if (!categoryId) { toast.error('请选择费用分类'); return; }
    if (!subCategoryId) { toast.error('请选择二级分类'); return; }
    if (!amount || Number(amount) <= 0) { toast.error('请输入有效金额'); return; }

    toast.success(isEdit ? '费用模板已更新' : '费用模板已创建');
    navigate('/financial-cost/templates');
  };

  const handleAdjust = () => {
    if (!adjustAmount || Number(adjustAmount) <= 0) { toast.error('请输入有效金额'); return; }

    const newHistory = {
      id: `tah-${Date.now()}`,
      templateId: id ?? '',
      oldAmount: Number(amount),
      newAmount: Number(adjustAmount),
      effectiveDate: adjustDate,
      createdBy: '当前用户',
      createdAt: new Date().toISOString(),
    };
    setAmountHistory(prev => [newHistory, ...prev]);
    setAmount(adjustAmount);
    setAdjustVisible(false);
    setAdjustAmount('');
    toast.success('金额已调整，新金额从指定日期生效');
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/financial-cost/templates')}>
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <h2 className="text-lg font-semibold">{isEdit ? '编辑费用模板' : '新增费用模板'}</h2>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>模板名称 <span className="text-destructive">*</span></Label>
            <Input placeholder="如：办公室月租、全员社保公积金" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>一级分类 <span className="text-destructive">*</span></Label>
              <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubCategoryId(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {defaultCategories.filter(c => c.isActive).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>二级分类 <span className="text-destructive">*</span></Label>
              <Select value={subCategoryId} onValueChange={setSubCategoryId} disabled={!categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.filter(c => c.isActive).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>金额（元）<span className="text-destructive">*</span></Label>
              <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>周期 <span className="text-destructive">*</span></Label>
              <Select value={cycleType} onValueChange={(v: any) => setCycleType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(cycleTypeMap).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>生效日期 <span className="text-destructive">*</span></Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="留空表示长期有效" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">归属设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>归属类型</Label>
            <Select value={ownerType} onValueChange={(v: any) => { setOwnerType(v); setProjectId(''); setDepartmentId(''); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">公司整体</SelectItem>
                <SelectItem value="project">项目</SelectItem>
                <SelectItem value="department">部门</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ownerType === 'project' && (
            <div className="space-y-2">
              <Label>选择项目</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue placeholder="请选择项目" /></SelectTrigger>
                <SelectContent>
                  {projectOptions.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          )}

          {ownerType === 'department' && (
            <div className="space-y-2">
              <Label>选择部门</Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger><SelectValue placeholder="请选择部门" /></SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 金额调整历史 */}
      {isEdit && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">金额调整历史</CardTitle>
              <Button size="sm" variant="outline" onClick={() => { setAdjustAmount(amount); setAdjustVisible(true); }}>
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                调整金额
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {amountHistory.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">暂无调整记录</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>调整日期</TableHead>
                    <TableHead className="text-right">原金额</TableHead>
                    <TableHead className="text-right">新金额</TableHead>
                    <TableHead>生效日期</TableHead>
                    <TableHead>操作人</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amountHistory.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-sm">{h.createdAt.split('T')[0]}</TableCell>
                      <TableCell className="text-sm text-right">¥{h.oldAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-right font-medium">¥{h.newAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{h.effectiveDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{h.createdBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/financial-cost/templates')}>取消</Button>
        <Button onClick={handleSave}>{isEdit ? '保存修改' : '创建模板'}</Button>
      </div>

      {/* 金额调整弹窗 */}
      <Dialog open={adjustVisible} onOpenChange={setAdjustVisible}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>调整模板金额</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              当前金额：<span className="font-medium text-foreground">¥{Number(amount).toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <Label>新金额（元）</Label>
              <Input type="number" min="0" step="0.01" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>生效日期</Label>
              <Input type="date" value={adjustDate} onChange={(e) => setAdjustDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustVisible(false)}>取消</Button>
            <Button onClick={handleAdjust}>确认调整</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
