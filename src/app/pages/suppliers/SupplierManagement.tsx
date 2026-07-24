import { useState, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import {
  User,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Star,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

// ---------- 类型 ----------

type SupplierType = 'company' | 'individual';
type PaymentStatus = 'paid' | 'partial' | 'unpaid';

interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  contactPerson: string;
  phone: string;
  email: string;
  skills: string[];
  rating: number;          // 1-5
  totalContracts: number;
  totalAmount: number;
  notes?: string;
}

interface Subcontract {
  id: string;
  supplierName: string;
  projectName: string;
  contractNo: string;
  signDate: string;
  amount: number;
  status: 'active' | 'completed' | 'terminated';
  description: string;
}

interface SupplierPayment {
  id: string;
  supplierName: string;
  projectName: string;
  contractNo: string;
  period: number;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
}

// ---------- 模拟数据 ----------

const mockSuppliers: Supplier[] = [
  { id: 'sup-1', name: '蓝鸟科技有限公司', type: 'company', contactPerson: '王经理', phone: '13800138011', email: 'wang@bluebird.com', skills: ['UI设计', '前端开发', '切图'], rating: 4.5, totalContracts: 3, totalAmount: 156000, notes: '核心设计合作伙伴' },
  { id: 'sup-2', name: '星辰软件工作室',   type: 'company', contactPerson: '李工',   phone: '13800138012', email: 'li@starsoft.com',   skills: ['后端开发', 'API开发', '数据库'], rating: 4.0, totalContracts: 2, totalAmount: 98000 },
  { id: 'sup-3', name: '张明',             type: 'individual', contactPerson: '张明', phone: '13800138013', email: 'zhangming@freelancer.com', skills: ['iOS开发', 'Swift', 'Flutter'], rating: 4.8, totalContracts: 1, totalAmount: 45000, notes: '资深iOS独立开发者' },
  { id: 'sup-4', name: '云端智联科技',     type: 'company', contactPerson: '赵总',   phone: '13800138014', email: 'zhao-cloud@cloudlink.com', skills: ['DevOps', '服务器运维', 'CI/CD'], rating: 3.5, totalContracts: 2, totalAmount: 72000 },
  { id: 'sup-5', name: '陈小红',           type: 'individual', contactPerson: '陈小红', phone: '13800138015', email: 'chenxiaohong@design.com', skills: ['UI/UX设计', 'Figma', '原型设计'], rating: 5.0, totalContracts: 4, totalAmount: 120000, notes: '顶级设计师，质量极高' },
];

const mockSubcontracts: Subcontract[] = [
  { id: 'sc-1', supplierName: '蓝鸟科技有限公司', projectName: '企业管理系统开发', contractNo: 'SC-2026-001', signDate: '2026-02-01', amount: 56000, status: 'active',     description: 'UI设计与前端切图' },
  { id: 'sc-2', supplierName: '星辰软件工作室',   projectName: '云服务平台项目',   contractNo: 'SC-2026-002', signDate: '2026-03-15', amount: 48000, status: 'active',     description: '支付模块后端联调' },
  { id: 'sc-3', supplierName: '蓝鸟科技有限公司', projectName: '电商平台小程序',   contractNo: 'SC-2026-003', signDate: '2026-04-01', amount: 50000, status: 'completed',  description: '小程序UI设计' },
  { id: 'sc-4', supplierName: '张明',            projectName: '医疗健康 APP',    contractNo: 'SC-2026-004', signDate: '2026-05-01', amount: 45000, status: 'active',     description: 'iOS端开发' },
  { id: 'sc-5', supplierName: '云端智联科技',     projectName: '智能制造 MES',    contractNo: 'SC-2026-005', signDate: '2026-03-01', amount: 36000, status: 'completed',  description: '测试服务器运维' },
  { id: 'sc-6', supplierName: '陈小红',          projectName: '企业管理系统开发', contractNo: 'SC-2026-006', signDate: '2026-01-15', amount: 40000, status: 'completed',  description: '产品原型设计' },
];

const mockPayments: SupplierPayment[] = [
  { id: 'sp-1', supplierName: '蓝鸟科技有限公司', projectName: '企业管理系统开发', contractNo: 'SC-2026-001', period: 1, amount: 22400, status: 'paid',     dueDate: '2026-03-01', paidDate: '2026-03-03' },
  { id: 'sp-2', supplierName: '蓝鸟科技有限公司', projectName: '企业管理系统开发', contractNo: 'SC-2026-001', period: 2, amount: 16800, status: 'paid',     dueDate: '2026-05-01', paidDate: '2026-05-02' },
  { id: 'sp-3', supplierName: '蓝鸟科技有限公司', projectName: '企业管理系统开发', contractNo: 'SC-2026-001', period: 3, amount: 16800, status: 'unpaid',   dueDate: '2026-07-01' },
  { id: 'sp-4', supplierName: '星辰软件工作室',   projectName: '云服务平台项目',   contractNo: 'SC-2026-002', period: 1, amount: 24000, status: 'paid',     dueDate: '2026-04-15', paidDate: '2026-04-16' },
  { id: 'sp-5', supplierName: '星辰软件工作室',   projectName: '云服务平台项目',   contractNo: 'SC-2026-002', period: 2, amount: 24000, status: 'partial',  dueDate: '2026-06-15', paidDate: '2026-06-20' },
  { id: 'sp-6', supplierName: '张明',            projectName: '医疗健康 APP',    contractNo: 'SC-2026-004', period: 1, amount: 22500, status: 'unpaid',   dueDate: '2026-07-01' },
  { id: 'sp-7', supplierName: '陈小红',          projectName: '企业管理系统开发', contractNo: 'SC-2026-006', period: 1, amount: 20000, status: 'paid',     dueDate: '2026-02-15', paidDate: '2026-02-14' },
  { id: 'sp-8', supplierName: '陈小红',          projectName: '企业管理系统开发', contractNo: 'SC-2026-006', period: 2, amount: 20000, status: 'paid',     dueDate: '2026-04-15', paidDate: '2026-04-15' },
];

// ---------- 状态标签映射 ----------

const CONTRACT_STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active:    { label: '执行中', variant: 'default' },
  completed: { label: '已完成', variant: 'default' },
  terminated: { label: '已终止', variant: 'destructive' },
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  paid:    { label: '已付', variant: 'default' },
  partial: { label: '部分', variant: 'secondary' },
  unpaid:  { label: '未付', variant: 'destructive' },
};

// ---------- 主组件 ----------

export function SupplierManagement() {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: 'company' as SupplierType,
    contactPerson: '',
    phone: '',
    email: '',
    rating: '3',
    skillsInput: '',
    notes: '',
  });

  const summary = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const totalContracts = mockSubcontracts.length;
    const totalAmount = mockSubcontracts.reduce((s, c) => s + c.amount, 0);
    const unpaidAmount = mockPayments.filter(p => p.status === 'unpaid').reduce((s, p) => s + p.amount, 0);
    return { totalSuppliers, totalContracts, totalAmount, unpaidAmount, paidAmount: totalAmount - unpaidAmount };
  }, [suppliers]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'company',
      contactPerson: '',
      phone: '',
      email: '',
      rating: '3',
      skillsInput: '',
      notes: '',
    });
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      type: supplier.type,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      rating: String(supplier.rating),
      skillsInput: supplier.skills.join(','),
      notes: supplier.notes || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除?')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson) {
      return;
    }
    const skills = formData.skillsInput
      ? formData.skillsInput.split(/[,，]/).map(s => s.trim()).filter(Boolean)
      : [];
    const values = {
      name: formData.name,
      type: formData.type,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      rating: Number(formData.rating),
      skills,
      notes: formData.notes || undefined,
    };
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...values } : s));
    } else {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...values,
        totalContracts: 0,
        totalAmount: 0,
      };
      setSuppliers(prev => [...prev, newSupplier]);
    }
    setModalVisible(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <User className="size-4 text-primary" />
              供应商数
            </div>
            <div className="text-2xl font-bold mt-1">{summary.totalSuppliers} <span className="text-sm font-normal text-muted-foreground">家</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              分包合同
            </div>
            <div className="text-2xl font-bold mt-1">{summary.totalContracts} <span className="text-sm font-normal text-muted-foreground">个</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">合同总额</div>
            <div className="text-2xl font-bold mt-1">&yen;{summary.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              已付金额
            </div>
            <div className="text-2xl font-bold mt-1">&yen;{summary.paidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Calendar className="size-4 text-destructive" />
              未付金额
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">&yen;{summary.unpaidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Star className="size-4 text-yellow-400 fill-yellow-400" />
              合作评级
            </div>
            <div className="text-2xl font-bold mt-1">
              {(suppliers.reduce((s, sup) => s + sup.rating, 0) / Math.max(suppliers.length, 1)).toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">★</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主体 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="suppliers"><User className="size-4" /> 供应商档案</TabsTrigger>
              <TabsTrigger value="contracts"><FileText className="size-4" /> 分包合同</TabsTrigger>
              <TabsTrigger value="payments"><Calendar className="size-4" /> 付款记录</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="pt-4">
              {/* 供应商档案 Tab */}
              {activeTab === 'suppliers' && (
                <div>
                  <div className="mb-4 flex justify-end">
                    <Button onClick={handleAdd}>
                      <Plus className="size-4" /> 新增供应商
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {suppliers.map(supplier => (
                      <Card key={supplier.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex items-center justify-center size-10 rounded-full text-white font-bold text-lg"
                                style={{ background: supplier.type === 'company' ? 'hsl(var(--primary))' : 'hsl(262, 80%, 50%)' }}
                              >
                                {supplier.name.slice(0, 1)}
                              </div>
                              <div>
                                <div className="font-semibold">{supplier.name}</div>
                                <Badge variant={supplier.type === 'company' ? 'default' : 'secondary'} className="mt-0.5">
                                  {supplier.type === 'company' ? '企业' : '个人'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(supplier)}>
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => handleDelete(supplier.id)}>
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`size-3.5 ${i < Math.floor(supplier.rating) ? 'text-yellow-400 fill-yellow-400' : i < supplier.rating ? 'text-yellow-400 fill-yellow-400 opacity-50' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{supplier.rating}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {supplier.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>

                          <Separator className="my-2" />

                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>联系人：{supplier.contactPerson}</div>
                            <div>合作 {supplier.totalContracts} 次 · 总额 &yen;{supplier.totalAmount.toLocaleString()}</div>
                            {supplier.notes && (
                              <div className="text-muted-foreground/70 mt-1">
                                <Pencil className="inline size-3 mr-1" /> {supplier.notes}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 分包合同 Tab */}
              {activeTab === 'contracts' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[130px]">合同编号</TableHead>
                      <TableHead className="w-[140px]">供应商</TableHead>
                      <TableHead className="w-[140px]">项目</TableHead>
                      <TableHead className="w-[100px]">签订日期</TableHead>
                      <TableHead className="w-[100px]">金额</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead>描述</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubcontracts.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.contractNo}</TableCell>
                        <TableCell className="font-semibold">{row.supplierName}</TableCell>
                        <TableCell>{row.projectName}</TableCell>
                        <TableCell>{row.signDate}</TableCell>
                        <TableCell>&yen;{row.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={CONTRACT_STATUS_LABELS[row.status]?.variant || 'outline'}>
                            {CONTRACT_STATUS_LABELS[row.status]?.label || row.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* 付款记录 Tab */}
              {activeTab === 'payments' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">供应商</TableHead>
                      <TableHead className="w-[140px]">项目</TableHead>
                      <TableHead className="w-[120px]">合同</TableHead>
                      <TableHead className="w-[50px]">期数</TableHead>
                      <TableHead className="w-[100px]">金额</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="w-[100px]">应付日期</TableHead>
                      <TableHead className="w-[100px]">实付日期</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayments.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold">{row.supplierName}</TableCell>
                        <TableCell>{row.projectName}</TableCell>
                        <TableCell>{row.contractNo}</TableCell>
                        <TableCell>P{row.period}</TableCell>
                        <TableCell>&yen;{row.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={PAYMENT_STATUS_LABELS[row.status].variant}>{PAYMENT_STATUS_LABELS[row.status].label}</Badge>
                        </TableCell>
                        <TableCell>{row.dueDate}</TableCell>
                        <TableCell>{row.paidDate || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? '编辑供应商' : '新增供应商'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier-name">名称 <span className="text-destructive">*</span></Label>
                  <Input id="supplier-name" placeholder="公司名或姓名" value={formData.name} onChange={e => updateForm('name', e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-type">类型 <span className="text-destructive">*</span></Label>
                  <Select value={formData.type} onValueChange={v => updateForm('type', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">企业</SelectItem>
                      <SelectItem value="individual">个人</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier-contact">联系人 <span className="text-destructive">*</span></Label>
                  <Input id="supplier-contact" placeholder="联系人姓名" value={formData.contactPerson} onChange={e => updateForm('contactPerson', e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-phone">电话</Label>
                  <Input id="supplier-phone" placeholder="联系电话" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier-email">邮箱</Label>
                  <Input id="supplier-email" placeholder="邮箱地址" value={formData.email} onChange={e => updateForm('email', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-rating">合作评级</Label>
                  <div className="flex items-center gap-2 h-9">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => updateForm('rating', String(val))}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`size-5 cursor-pointer transition-colors ${
                              val <= Number(formData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{formData.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supplier-skills">技能标签</Label>
                <Input id="supplier-skills" placeholder="输入技能标签，用逗号分隔" value={formData.skillsInput} onChange={e => updateForm('skillsInput', e.target.value)} />
                <p className="text-xs text-muted-foreground">多个标签用逗号分隔，如：UI设计,Figma,原型设计</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supplier-notes">备注</Label>
                <Textarea id="supplier-notes" placeholder="备注信息" rows={3} value={formData.notes} onChange={e => updateForm('notes', e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="submit">确定</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
