import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  initialExpenseRecords,
  defaultCategories,
  getSubCategories,
  projectOptions,
  departmentOptions,
  sourceTypeMap,
  type OwnerType,
} from '../mockData';

export default function RecordForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const existingRecord = isEdit ? initialExpenseRecords.find(r => r.id === id) : null;

  // 表单状态
  const [expenseDate, setExpenseDate] = useState(existingRecord?.expenseDate ?? new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(existingRecord?.categoryId ?? '');
  const [subCategoryId, setSubCategoryId] = useState(existingRecord?.subCategoryId ?? '');
  const [amount, setAmount] = useState(existingRecord?.amount.toString() ?? '');
  const [ownerType, setOwnerType] = useState<OwnerType>(
    existingRecord?.projectId ? 'project' : existingRecord?.departmentId ? 'department' : 'company'
  );
  const [projectId, setProjectId] = useState(existingRecord?.projectId ?? '');
  const [departmentId, setDepartmentId] = useState(existingRecord?.departmentId ?? '');
  const [sourceType, setSourceType] = useState(existingRecord?.sourceType ?? 'manual');
  const [description, setDescription] = useState(existingRecord?.description ?? '');

  const subCategories = useMemo(() => {
    if (!categoryId) return [];
    return getSubCategories(categoryId);
  }, [categoryId]);

  useEffect(() => {
    if (categoryId && subCategoryId) {
      const exists = subCategories.some(c => c.id === subCategoryId);
      if (!exists) setSubCategoryId('');
    }
  }, [categoryId, subCategories, subCategoryId]);

  const handleSave = () => {
    if (!expenseDate) { toast.error('请选择费用日期'); return; }
    if (!categoryId) { toast.error('请选择费用分类'); return; }
    if (!subCategoryId) { toast.error('请选择二级分类'); return; }
    if (!amount || Number(amount) <= 0) { toast.error('请输入有效金额'); return; }

    toast.success(isEdit ? '费用记录已更新' : '费用记录已创建');
    navigate('/financial-cost/records');
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/financial-cost/records')}>
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <h2 className="text-lg font-semibold">{isEdit ? '编辑费用记录' : '新增费用记录'}</h2>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>费用日期 <span className="text-destructive">*</span></Label>
              <Input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>数据来源</Label>
              <Select value={sourceType} onValueChange={(v: any) => setSourceType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sourceTypeMap).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2">
            <Label>金额（元）<span className="text-destructive">*</span></Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">费用归属</CardTitle>
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
              <Label>选择项目 <span className="text-destructive">*</span></Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择项目" />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {ownerType === 'department' && (
            <div className="space-y-2">
              <Label>选择部门 <span className="text-destructive">*</span></Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">备注信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>描述说明</Label>
            <Textarea
              rows={3}
              placeholder="请输入费用描述..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/financial-cost/records')}>取消</Button>
        <Button onClick={handleSave}>{isEdit ? '保存修改' : '创建记录'}</Button>
      </div>
    </div>
  );
}
