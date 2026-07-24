import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router';

const statusColorMap: Record<string, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-orange-500',
  processing: 'bg-blue-500',
  default: 'bg-gray-500',
};

function StatusDot({ status, text }: { status: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${statusColorMap[status] || 'bg-gray-500'}`} />
      <span>{text}</span>
    </span>
  );
}

export function Customers() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    industry: '',
    scale: '',
    owner: '',
    registeredCapital: '',
    level: 'B',
    address: '',
    remark: '',
  });

  const customers = [
    {
      key: '1',
      name: '北京科技有限公司',
      type: '企业',
      industry: '互联网',
      scale: '100-500人',
      contact: '张经理',
      phone: '138****1111',
      level: 'A级',
      status: '合作中',
      contractCount: 3,
      contractAmount: '180万',
      receivable: '30万',
      createTime: '2025-06-15',
    },
    {
      key: '2',
      name: '上海商贸公司',
      type: '企业',
      industry: '零售',
      scale: '50-100人',
      contact: '李总',
      phone: '139****2222',
      level: 'B级',
      status: '跟进中',
      contractCount: 1,
      contractAmount: '45万',
      receivable: '15万',
      createTime: '2025-08-20',
    },
    {
      key: '3',
      name: '深圳电商公司',
      type: '企业',
      industry: '电商',
      scale: '500-1000人',
      contact: '王总',
      phone: '136****3333',
      level: 'A级',
      status: '合作中',
      contractCount: 5,
      contractAmount: '320万',
      receivable: '80万',
      createTime: '2025-03-10',
    },
    {
      key: '4',
      name: '广州金融公司',
      type: '企业',
      industry: '金融',
      scale: '1000人以上',
      contact: '赵经理',
      phone: '137****4444',
      level: 'S级',
      status: '合作中',
      contractCount: 8,
      contractAmount: '680万',
      receivable: '120万',
      createTime: '2024-11-05',
    },
    {
      key: '5',
      name: '成都教育机构',
      type: '机构',
      industry: '教育',
      scale: '100-500人',
      contact: '周主任',
      phone: '135****5555',
      level: 'B级',
      status: '跟进中',
      contractCount: 0,
      contractAmount: '0',
      receivable: '0',
      createTime: '2026-02-12',
    },
  ];

  const levelMap: Record<string, string> = {
    'S级': 'error',
    'A级': 'warning',
    'B级': 'success',
    'C级': 'default',
  };

  const statusMap: Record<string, string> = {
    合作中: 'success',
    跟进中: 'processing',
    已流失: 'default',
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      industry: '',
      scale: '',
      owner: '',
      registeredCapital: '',
      level: 'B',
      address: '',
      remark: '',
    });
  };

  const handleCreate = () => {
    if (!formData.name) {
      toast.error('请输入客户名称');
      return;
    }
    console.log(formData);
    toast.success('客户创建成功');
    setVisible(false);
    resetForm();
  };

  return (
    <div>
      {/* Page label */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-[13px] font-medium text-muted-foreground tracking-wide uppercase">
          客户管理
        </div>
        <Button onClick={() => setVisible(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建客户
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Search & Filter Bar */}
          <div className="flex gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 w-[240px]" placeholder="搜索客户名称、联系人" />
            </div>
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="客户类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enterprise">企业</SelectItem>
                <SelectItem value="institution">机构</SelectItem>
                <SelectItem value="individual">个人</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="客户等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">S级</SelectItem>
                <SelectItem value="A">A级</SelectItem>
                <SelectItem value="B">B级</SelectItem>
                <SelectItem value="C">C级</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="客户状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">合作中</SelectItem>
                <SelectItem value="following">跟进中</SelectItem>
                <SelectItem value="lost">已流失</SelectItem>
              </SelectContent>
            </Select>
            <Button>搜索</Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>客户名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>所属行业</TableHead>
                  <TableHead>企业规模</TableHead>
                  <TableHead>主要联系人</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>客户等级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>合同数</TableHead>
                  <TableHead>合同金额</TableHead>
                  <TableHead>待收款</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((record) => (
                  <TableRow key={record.key}>
                    <TableCell>
                      <a
                        onClick={() => navigate(`/customers/${record.key}`)}
                        className="font-medium text-primary cursor-pointer px-1 py-0.5 rounded hover:bg-accent"
                      >
                        {record.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <StatusDot status="default" text={record.type} />
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{record.industry}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{record.scale}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground/80">{record.contact}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-[13px]">{record.phone}</span>
                    </TableCell>
                    <TableCell>
                      <StatusDot
                        status={levelMap[record.level] || 'default'}
                        text={record.level}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusDot
                        status={statusMap[record.status] || 'default'}
                        text={record.status}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{record.contractCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{record.contractAmount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-orange-600">{record.receivable}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-[13px]">{record.createTime}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/customers/${record.key}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVisible(true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">共 68 条记录</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>上一页</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">7</Button>
              <Button variant="outline" size="sm">下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Customer Dialog */}
      <Dialog open={visible} onOpenChange={(open) => {
        if (!open) {
          setVisible(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle>新建客户</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>客户名称 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入客户名称"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>客户类型</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData((p) => ({ ...p, type: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">企业</SelectItem>
                    <SelectItem value="institution">机构</SelectItem>
                    <SelectItem value="individual">个人</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>所属行业</Label>
                <Select value={formData.industry} onValueChange={(v) => setFormData((p) => ({ ...p, industry: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internet">互联网</SelectItem>
                    <SelectItem value="finance">金融</SelectItem>
                    <SelectItem value="education">教育</SelectItem>
                    <SelectItem value="retail">零售</SelectItem>
                    <SelectItem value="ecommerce">电商</SelectItem>
                    <SelectItem value="manufacturing">制造业</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>企业规模</Label>
                <Select value={formData.scale} onValueChange={(v) => setFormData((p) => ({ ...p, scale: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1-50人</SelectItem>
                    <SelectItem value="50-100">50-100人</SelectItem>
                    <SelectItem value="100-500">100-500人</SelectItem>
                    <SelectItem value="500-1000">500-1000人</SelectItem>
                    <SelectItem value="1000+">1000人以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>负责人</Label>
                <Select value={formData.owner} onValueChange={(v) => setFormData((p) => ({ ...p, owner: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择负责人" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zhang">张三</SelectItem>
                    <SelectItem value="li">李四</SelectItem>
                    <SelectItem value="wang">王五</SelectItem>
                    <SelectItem value="zhao">赵六</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>注册资本</Label>
                <Input
                  placeholder="请输入注册资本，例如：1000万"
                  value={formData.registeredCapital}
                  onChange={(e) => setFormData((p) => ({ ...p, registeredCapital: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>客户等级</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData((p) => ({ ...p, level: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S级（战略客户）</SelectItem>
                    <SelectItem value="A">A级（重要客户）</SelectItem>
                    <SelectItem value="B">B级（普通客户）</SelectItem>
                    <SelectItem value="C">C级（潜在客户）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>客户地址</Label>
              <Input
                placeholder="请输入客户地址"
                value={formData.address}
                onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>备注</Label>
              <Textarea
                placeholder="请输入备注信息"
                rows={3}
                value={formData.remark}
                onChange={(e) => setFormData((p) => ({ ...p, remark: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setVisible(false); resetForm(); }}>取消</Button>
            <Button onClick={handleCreate}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
