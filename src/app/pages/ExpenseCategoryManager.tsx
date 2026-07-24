import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseCategory {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  level: 1 | 2;
  accountCode: string;
  accountName: string;
  status: boolean;
  bizScopes: string[];
  remark: string;
  order: number;
}

const BIZ_SCOPES = ['出差', '报销', '报价', '合同'];

const ACCOUNT_OPTIONS = [
  { value: '6601', label: '6601 — 销售费用' },
  { value: '6602', label: '6602 — 管理费用' },
  { value: '6603', label: '6603 — 研发费用' },
  { value: '6611', label: '6611 — 差旅费' },
  { value: '6612', label: '6612 — 业务招待费' },
  { value: '6621', label: '6621 — 办公费' },
  { value: '6631', label: '6631 — 薪酬费用' },
  { value: '6641', label: '6641 — 折旧费' },
];

const initialCategories: ExpenseCategory[] = [
  { id: 'B', name: '商务费用', code: 'B00', parentId: null, level: 1, accountCode: '6601', accountName: '销售费用', status: true, bizScopes: ['出差', '报销', '报价'], remark: '一切对外商务活动产生的费用', order: 1 },
  { id: 'B01', name: '差旅费', code: 'B01', parentId: 'B', level: 2, accountCode: '6611', accountName: '差旅费', status: true, bizScopes: ['出差', '报销'], remark: '因公出行产生的交通、住宿等', order: 1 },
  { id: 'B02', name: '业务招待费', code: 'B02', parentId: 'B', level: 2, accountCode: '6612', accountName: '业务招待费', status: true, bizScopes: ['报销'], remark: '客户宴请、礼品等', order: 2 },
  { id: 'B03', name: '市场推广费', code: 'B03', parentId: 'B', level: 2, accountCode: '6601', accountName: '销售费用', status: true, bizScopes: ['报销', '报价'], remark: '展会、广告投放等', order: 3 },
  { id: 'R', name: '研发费用', code: 'R00', parentId: null, level: 1, accountCode: '6603', accountName: '研发费用', status: true, bizScopes: ['报销'], remark: '研发项目相关支出', order: 2 },
  { id: 'R01', name: '研发差旅费', code: 'R01', parentId: 'R', level: 2, accountCode: '6611', accountName: '差旅费', status: true, bizScopes: ['出差', '报销'], remark: '研发人员因公出行', order: 1 },
  { id: 'R02', name: '软件工具费', code: 'R02', parentId: 'R', level: 2, accountCode: '6621', accountName: '办公费', status: true, bizScopes: ['报销'], remark: 'IDE、SaaS工具订阅等', order: 2 },
  { id: 'O', name: '运营费用', code: 'O00', parentId: null, level: 1, accountCode: '6602', accountName: '管理费用', status: true, bizScopes: ['报销'], remark: '日常运营及行政支出', order: 3 },
  { id: 'O01', name: '办公用品费', code: 'O01', parentId: 'O', level: 2, accountCode: '6621', accountName: '办公费', status: true, bizScopes: ['报销'], remark: '文具、耗材等', order: 1 },
  { id: 'O02', name: '通讯费', code: 'O02', parentId: 'O', level: 2, accountCode: '6621', accountName: '办公费', status: false, bizScopes: ['报销'], remark: '手机话费、宽带等', order: 2 },
  { id: 'X', name: '其他费用', code: 'X00', parentId: null, level: 1, accountCode: '6602', accountName: '管理费用', status: true, bizScopes: ['报销'], remark: '不属于以上分类的杂项费用', order: 4 },
];

function buildTree(categories: ExpenseCategory[]) {
  const parents = categories.filter((c) => c.level === 1).sort((a, b) => a.order - b.order);
  return parents.map((p) => ({
    ...p,
    children: categories.filter((c) => c.parentId === p.id).sort((a, b) => a.order - b.order),
  }));
}

export function ExpenseCategoryManager() {
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialCategories);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<ExpenseCategory | null>(null);
  const [defaultLevel, setDefaultLevel] = useState<1 | 2>(1);
  const [formLevel, setFormLevel] = useState<1 | 2>(1);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formParentId, setFormParentId] = useState('');
  const [formAccountCode, setFormAccountCode] = useState('');
  const [formBizScopes, setFormBizScopes] = useState<string[]>([]);
  const [formRemark, setFormRemark] = useState('');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExpenseCategory | null>(null);

  const tree = buildTree(categories);

  const parents = categories.filter((c) => c.level === 1 && c.status);

  const displayList = selectedParentId
    ? categories.filter((c) => c.parentId === selectedParentId || c.id === selectedParentId)
    : categories.filter((c) => c.level === 1);

  const openCreate = (level: 1 | 2, parentId?: string) => {
    setEditing(null);
    setDefaultLevel(level);
    setFormLevel(level);
    setFormName('');
    setFormCode('');
    setFormParentId(parentId || '');
    setFormAccountCode('');
    setFormBizScopes([]);
    setFormRemark('');
    setModalVisible(true);
  };

  const openEdit = (record: ExpenseCategory) => {
    setEditing(record);
    setFormLevel(record.level);
    setFormName(record.name);
    setFormCode(record.code);
    setFormParentId(record.parentId || '');
    setFormAccountCode(record.accountCode);
    setFormBizScopes(record.bizScopes);
    setFormRemark(record.remark);
    setModalVisible(true);
  };

  const handleToggleStatus = (id: string, val: boolean) => {
    setCategories((prev) => prev.map((c) => {
      if (c.id === id) return { ...c, status: val };
      if (!val && c.parentId === id) return { ...c, status: false };
      return c;
    }));
  };

  const confirmDelete = (record: ExpenseCategory) => {
    setDeleteTarget(record);
    setDeleteAlertOpen(true);
  };

  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.level === 1) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id && c.parentId !== deleteTarget.id));
      if (selectedParentId === deleteTarget.id) setSelectedParentId(null);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    }

    toast.success('已删除');
    setDeleteAlertOpen(false);
    setDeleteTarget(null);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('请输入分类名称');
      return;
    }
    if (!formCode.trim()) {
      toast.error('请输入分类编码');
      return;
    }
    if (formLevel === 2 && !formParentId) {
      toast.error('请选择父级分类');
      return;
    }
    if (!formAccountCode) {
      toast.error('请选择会计科目');
      return;
    }

    const codeExists = categories.some(
      (c) => c.code === formCode && (!editing || c.id !== editing.id)
    );
    if (codeExists) {
      toast.error('分类编码已存在，请修改');
      return;
    }

    const acct = ACCOUNT_OPTIONS.find((a) => a.value === formAccountCode);

    if (editing) {
      setCategories((prev) => prev.map((c) =>
        c.id === editing.id
          ? {
              ...c,
              name: formName,
              code: formCode,
              level: formLevel,
              parentId: formLevel === 2 ? formParentId : null,
              accountCode: formAccountCode,
              accountName: acct?.label.split(' — ')[1] || '',
              bizScopes: formBizScopes,
              remark: formRemark,
            }
          : c
      ));
      toast.success('已更新');
    } else {
      const newCat: ExpenseCategory = {
        id: formCode,
        name: formName,
        code: formCode,
        parentId: formLevel === 2 ? formParentId : null,
        level: formLevel,
        accountCode: formAccountCode,
        accountName: acct?.label.split(' — ')[1] || '',
        status: true,
        bizScopes: formBizScopes,
        remark: formRemark,
        order: categories.filter((c) => formLevel === 1 ? c.level === 1 : c.parentId === formParentId).length + 1,
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success('已创建');
    }
    setModalVisible(false);
  };

  const deleteChildCount = deleteTarget ? categories.filter((c) => c.parentId === deleteTarget.id).length : 0;
  const deleteMessage = deleteTarget?.level === 1 && deleteChildCount > 0
    ? `该分类下包含 ${deleteChildCount} 个二级分类，删除将导致关联业务报错，是否确认？`
    : '确认删除该分类？';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">费用分类管理</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openCreate(2)}>新增二级分类</Button>
          <Button variant="default" onClick={() => openCreate(1)}>
            <Plus className="mr-2 h-4 w-4" />新增一级分类
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-4">
        {/* Left: tree */}
        <Card>
          <CardHeader>
            <CardTitle>分类结构</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div
              className={`px-4 py-2 cursor-pointer text-[13px] ${
                selectedParentId === null
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'font-normal'
              }`}
              onClick={() => setSelectedParentId(null)}
            >
              全部一级分类
            </div>
            {tree.map((parent) => (
              <div key={parent.id}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all ${
                    selectedParentId === parent.id
                      ? 'bg-primary/10 text-primary border-l-3 border-primary'
                      : 'border-l-3 border-transparent'
                  }`}
                  onClick={() => setSelectedParentId(parent.id === selectedParentId ? null : parent.id)}
                >
                  <span className="text-[13px] font-medium flex-1">{parent.name}</span>
                  {!parent.status && <Badge variant="secondary" className="text-xs">停用</Badge>}
                  <span className="text-muted-foreground text-xs">{parent.children.length}</span>
                </div>
                {selectedParentId === parent.id && parent.children.map((child) => (
                  <div
                    key={child.id}
                    className={`py-1.5 px-4 pl-8 text-xs ${
                      child.status ? 'text-muted-foreground' : 'text-gray-400'
                    }`}
                  >
                    {child.name}
                    {!child.status && <span className="ml-1.5 text-gray-400">（停用）</span>}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right: table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedParentId
                  ? `${categories.find((c) => c.id === selectedParentId)?.name || ''} — 详细配置`
                  : '一级分类列表'
                }
              </CardTitle>
              {selectedParentId && (
                <Button size="sm" onClick={() => openCreate(2, selectedParentId)}>
                  <Plus className="mr-2 h-4 w-4" />新增子分类
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-muted border-b border-border">
                  {['分类名称', '编码', '会计科目', '适用场景', '状态', '操作'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayList.map((item) => {
                  const isParent = item.level === 1;
                  const childCount = categories.filter((c) => c.parentId === item.id).length;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-border ${isParent ? 'bg-muted/50' : 'bg-background'}`}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {isParent
                            ? <Badge variant="default" className="text-xs">一级</Badge>
                            : <span className="pl-3 text-muted-foreground">└</span>
                          }
                          <span className={isParent ? 'font-medium' : 'font-normal'}>{item.name}</span>
                          {isParent && childCount > 0 && (
                            <span className="text-muted-foreground text-[11px]">({childCount})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-muted-foreground">
                        {item.code}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-muted-foreground">{item.accountCode}</span>
                        <span className="text-muted-foreground/70 ml-1.5">— {item.accountName}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          {item.bizScopes.map((s) => (
                            <Badge key={s} className="bg-cyan-500 text-white text-xs">{s}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Switch
                          checked={item.status}
                          onCheckedChange={(v) => handleToggleStatus(item.id, v)}
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            <Pencil className="mr-1 h-3.5 w-3.5" />编辑
                          </Button>
                          {isParent && (
                            <Button variant="ghost" size="sm" onClick={() => openCreate(2, item.id)}>
                              <Plus className="mr-1 h-3.5 w-3.5" />子类
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => confirmDelete(item)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {displayList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-8 text-center text-muted-foreground">
                      暂无数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalVisible} onOpenChange={(open) => !open && setModalVisible(false)}>
        <DialogContent className="max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editing ? '编辑费用分类' : '新增费用分类'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>分类级别</Label>
              <RadioGroup value={formLevel.toString()} onValueChange={(v) => setFormLevel(Number(v) as 1 | 2)} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="1" id="level-1" />
                  <Label htmlFor="level-1">一级分类</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="2" id="level-2" />
                  <Label htmlFor="level-2">二级分类</Label>
                </div>
              </RadioGroup>
            </div>

            {formLevel === 2 && (
              <div className="space-y-2">
                <Label>所属父级</Label>
                <Select value={formParentId} onValueChange={setFormParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择一级分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {parents.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>分类名称</Label>
                <Input placeholder="如：差旅费" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>分类编码</Label>
                <Input placeholder="如：B01（全局唯一）" value={formCode} onChange={(e) => setFormCode(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>关联会计科目</Label>
              <Select value={formAccountCode} onValueChange={setFormAccountCode}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择会计科目" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_OPTIONS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>适用业务场景</Label>
              <div className="flex gap-4">
                {BIZ_SCOPES.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <Checkbox
                      checked={formBizScopes.includes(s)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormBizScopes([...formBizScopes, s]);
                        } else {
                          setFormBizScopes(formBizScopes.filter((b) => b !== s));
                        }
                      }}
                    />
                    <Label>{s}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>备注</Label>
              <Textarea placeholder="分类说明或用途备注" rows={2} value={formRemark} onChange={(e) => setFormRemark(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalVisible(false)}>取消</Button>
            <Button variant="default" onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>{deleteMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
