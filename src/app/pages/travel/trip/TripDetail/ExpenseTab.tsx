import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/table';
import { Plus, Edit, Trash2, AlertTriangle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, Expense, TripExpenseType } from '../../types';

interface ExpenseTabProps {
  trip: Trip;
  onUpdate: () => void;
}

const expenseTypeLabels: Record<TripExpenseType, string> = {
  transport: '交通费',
  accommodation: '住宿费',
  meal: '餐饮费',
  communication: '通讯费',
  local_transport: '市内交通',
  entertainment: '招待费',
  office: '办公用品',
  other: '其他',
};

export function ExpenseTab({ trip, onUpdate }: ExpenseTabProps) {
  const [formVisible, setFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [form, setForm] = useState({
    itinerarySegmentId: '',
    type: 'meal' as TripExpenseType,
    amount: 0,
    date: '',
    invoiceNo: '',
    remark: '',
    isOverStandard: false,
    overStandardReason: '',
  });

  // 收集所有费用记录
  const allExpenses: (Expense & { segmentDesc: string })[] = [];
  trip.itinerarySegments?.forEach(seg => {
    seg.expenses?.forEach(exp => {
      allExpenses.push({
        ...exp,
        segmentDesc: `${seg.departure}→${seg.destination}`,
      });
    });
  });

  // 费用汇总
  const expenseSummary = allExpenses.reduce((acc, exp) => {
    acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpense = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 打开新建表单
  const handleCreate = () => {
    setEditingExpense(null);
    setForm({
      itinerarySegmentId: trip.itinerarySegments?.[0]?.id || '',
      type: 'meal',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      invoiceNo: '',
      remark: '',
      isOverStandard: false,
      overStandardReason: '',
    });
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (expense: Expense & { segmentDesc: string }) => {
    setEditingExpense(expense);
    setForm({
      itinerarySegmentId: expense.itinerarySegmentId,
      type: expense.type,
      amount: expense.amount,
      date: expense.date,
      invoiceNo: expense.invoiceNo || '',
      remark: expense.remark || '',
      isOverStandard: expense.isOverStandard,
      overStandardReason: expense.overStandardReason || '',
    });
    setFormVisible(true);
  };

  // 删除费用
  const handleDelete = (expense: Expense) => {
    toast.success('删除成功');
    onUpdate();
  };

  // 保存
  const handleSave = () => {
    if (!form.amount || !form.date) {
      toast.error('请填写完整信息');
      return;
    }
    if (form.isOverStandard && !form.overStandardReason) {
      toast.error('超标费用请填写原因');
      return;
    }
    toast.success(editingExpense ? '更新成功' : '创建成功');
    setFormVisible(false);
    onUpdate();
  };

  return (
    <div className="space-y-4">
      {/* 费用汇总 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(expenseSummary).map(([type, amount]) => (
          <Card key={type}>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">{expenseTypeLabels[type as TripExpenseType] || type}</div>
              <div className="text-xl font-bold">¥{amount.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">总费用</div>
            <div className="text-xl font-bold text-primary">¥{totalExpense.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* 费用列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>费用记录</CardTitle>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新增费用
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">日期</TableHead>
                <TableHead className="whitespace-nowrap">类型</TableHead>
                <TableHead className="whitespace-nowrap">金额</TableHead>
                <TableHead className="whitespace-nowrap">关联旅程段</TableHead>
                <TableHead className="whitespace-nowrap">发票号</TableHead>
                <TableHead className="whitespace-nowrap">状态</TableHead>
                <TableHead className="whitespace-nowrap">备注</TableHead>
                <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无费用记录
                  </TableCell>
                </TableRow>
              ) : (
                allExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="whitespace-nowrap">{expense.date}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline">{expenseTypeLabels[expense.type]}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      ¥{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{expense.segmentDesc}</TableCell>
                    <TableCell className="whitespace-nowrap">{expense.invoiceNo || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {expense.isOverStandard ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          超标
                        </Badge>
                      ) : (
                        <Badge variant="default">正常</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{expense.remark || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(expense)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新建/编辑表单弹窗 */}
      <Dialog open={formVisible} onOpenChange={setFormVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExpense ? '编辑费用' : '新增费用'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>关联旅程段</Label>
              <Select
                value={form.itinerarySegmentId}
                onValueChange={(value) => setForm({ ...form, itinerarySegmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择旅程段" />
                </SelectTrigger>
                <SelectContent>
                  {trip.itinerarySegments?.map((seg) => (
                    <SelectItem key={seg.id} value={seg.id}>
                      {seg.departure}→{seg.destination} ({seg.departureDate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>费用类型</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value as TripExpenseType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meal">餐饮费</SelectItem>
                    <SelectItem value="communication">通讯费</SelectItem>
                    <SelectItem value="local_transport">市内交通</SelectItem>
                    <SelectItem value="entertainment">招待费</SelectItem>
                    <SelectItem value="office">办公用品</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>金额 <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="¥0"
                  value={form.amount || ''}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>发生日期 <span className="text-destructive">*</span></Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>发票号</Label>
                <Input
                  placeholder="选填"
                  value={form.invoiceNo}
                  onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
                />
              </div>
            </div>
            {form.isOverStandard && (
              <div className="space-y-2">
                <Label>超标原因 <span className="text-destructive">*</span></Label>
                <Textarea
                  placeholder="请说明超标原因"
                  value={form.overStandardReason}
                  onChange={(e) => setForm({ ...form, overStandardReason: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>备注</Label>
              <Textarea
                placeholder="选填"
                value={form.remark}
                onChange={(e) => setForm({ ...form, remark: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormVisible(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
