import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Pencil, Plus } from 'lucide-react';

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

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [formData, setFormData] = useState({
    invoiceTitle: '北京科技有限公司',
    taxNumber: '91110000XXXXXXXXXX',
    bank: '中国工商银行XX支行',
    bankAccount: '6222 **** **** 1234',
    invoiceAddress: '北京市朝阳区XX路XX号',
    invoicePhone: '010-12345678',
  });

  const customerInfo = {
    name: '北京科技有限公司',
    type: '企业',
    industry: '互联网',
    scale: '100-500人',
    registeredCapital: '1000万',
    creditCode: '91110000XXXXXXXXXX',
    address: '北京市朝阳区XX路XX号',
    level: 'A级',
    status: '合作中',
    source: '百度推广',
    createTime: '2025-06-15',
    owner: '张三',
  };

  const contacts = [
    {
      key: '1',
      name: '张经理',
      position: '技术总监',
      phone: '13800138000',
      wechat: 'zhang_manager',
      email: 'zhang@example.com',
      isDefault: true,
    },
    {
      key: '2',
      name: '李助理',
      position: '项目助理',
      phone: '13900139000',
      wechat: 'li_assistant',
      email: 'li@example.com',
      isDefault: false,
    },
  ];

  const leads = [
    {
      key: '1',
      name: 'APP开发需求',
      status: '已签单',
      createTime: '2025-06-20',
      signTime: '2025-07-15',
      amount: '80万',
    },
    {
      key: '2',
      name: '管理系统升级',
      status: '已签单',
      createTime: '2025-09-10',
      signTime: '2025-10-05',
      amount: '50万',
    },
    {
      key: '3',
      name: '小程序开发',
      status: '已签单',
      createTime: '2026-01-20',
      signTime: '2026-02-10',
      amount: '35万',
    },
    {
      key: '4',
      name: '数据分析平台',
      status: '跟进中',
      createTime: '2026-03-15',
      signTime: '-',
      amount: '-',
    },
  ];

  const contracts = [
    {
      key: '1',
      contractNo: 'HT202507001',
      name: 'APP开发项目合同',
      amount: '80万',
      signDate: '2025-07-15',
      status: '履行中',
      received: '60万',
      receivable: '20万',
    },
    {
      key: '2',
      contractNo: 'HT202510001',
      name: '管理系统升级合同',
      amount: '50万',
      signDate: '2025-10-05',
      status: '履行中',
      received: '40万',
      receivable: '10万',
    },
    {
      key: '3',
      contractNo: 'HT202602001',
      name: '小程序开发合同',
      amount: '35万',
      signDate: '2026-02-10',
      status: '履行中',
      received: '35万',
      receivable: '0',
    },
  ];

  const handleInvoiceSave = () => {
    if (!formData.invoiceTitle || !formData.taxNumber || !formData.bank || !formData.bankAccount || !formData.invoiceAddress || !formData.invoicePhone) {
      toast.error('请填写所有必填字段');
      return;
    }
    toast.success('开票信息更新成功');
    setInvoiceVisible(false);
  };

  const resetInvoiceForm = () => {
    setFormData({
      invoiceTitle: customerInfo.name,
      taxNumber: customerInfo.creditCode,
      bank: '中国工商银行XX支行',
      bankAccount: '6222 **** **** 1234',
      invoiceAddress: customerInfo.address,
      invoicePhone: '010-12345678',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/customers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <h2 className="text-lg font-semibold m-0">{customerInfo.name}</h2>
          <StatusDot
            status={customerInfo.level === 'A级' ? 'warning' : 'success'}
            text={customerInfo.level}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            编辑客户
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建线索
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">客户信息</TabsTrigger>
          <TabsTrigger value="leads">线索记录 ({leads.length})</TabsTrigger>
          <TabsTrigger value="contracts">合同记录 ({contracts.length})</TabsTrigger>
          <TabsTrigger value="finance">财务信息</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">客户名称</div>
                  <div className="text-sm font-medium">{customerInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">客户类型</div>
                  <div className="text-sm font-medium">{customerInfo.type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">所属行业</div>
                  <div className="text-sm font-medium">{customerInfo.industry}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">企业规模</div>
                  <div className="text-sm font-medium">{customerInfo.scale}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">注册资本</div>
                  <div className="text-sm font-medium">{customerInfo.registeredCapital}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">统一社会信用代码</div>
                  <div className="text-sm font-medium">{customerInfo.creditCode}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-sm text-muted-foreground">客户地址</div>
                  <div className="text-sm font-medium">{customerInfo.address}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">客户等级</div>
                  <div className="text-sm font-medium">
                    <StatusDot
                      status={customerInfo.level === 'A级' ? 'warning' : 'success'}
                      text={customerInfo.level}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">客户状态</div>
                  <div className="text-sm font-medium">
                    <StatusDot status="success" text={customerInfo.status} />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">创建时间</div>
                  <div className="text-sm font-medium">{customerInfo.createTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">负责人</div>
                  <div className="text-sm font-medium">{customerInfo.owner}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>联系人信息</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                添加联系人
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>微信</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>默认联系人</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((record) => (
                    <TableRow key={record.key}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>{record.phone}</TableCell>
                      <TableCell>{record.wechat}</TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>
                        {record.isDefault ? (
                          <StatusDot status="success" text="是" />
                        ) : (
                          <span>否</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0">
                          <Button variant="ghost" size="sm">编辑</Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">删除</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>线索名称</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>签约时间</TableHead>
                    <TableHead>签约金额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((record) => (
                    <TableRow key={record.key}>
                      <TableCell>
                        <a className="text-primary cursor-pointer">{record.name}</a>
                      </TableCell>
                      <TableCell>
                        <StatusDot
                          status={record.status === '已签单' ? 'success' : 'processing'}
                          text={record.status}
                        />
                      </TableCell>
                      <TableCell>{record.createTime}</TableCell>
                      <TableCell>{record.signTime}</TableCell>
                      <TableCell>{record.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>合同编号</TableHead>
                    <TableHead>合同名称</TableHead>
                    <TableHead>合同金额</TableHead>
                    <TableHead>签订日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>已收款</TableHead>
                    <TableHead>待收款</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((record) => (
                    <TableRow key={record.key}>
                      <TableCell>{record.contractNo}</TableCell>
                      <TableCell>
                        <a className="text-primary cursor-pointer">{record.name}</a>
                      </TableCell>
                      <TableCell>{record.amount}</TableCell>
                      <TableCell>{record.signDate}</TableCell>
                      <TableCell>
                        <StatusDot status="processing" text={record.status} />
                      </TableCell>
                      <TableCell>{record.received}</TableCell>
                      <TableCell>{record.receivable}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>开票信息</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInvoiceVisible(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                编辑
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">开票抬头</div>
                  <div className="text-sm font-medium">{customerInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">纳税人识别号</div>
                  <div className="text-sm font-medium">{customerInfo.creditCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">开户银行</div>
                  <div className="text-sm font-medium">中国工商银行XX支行</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">银行账号</div>
                  <div className="text-sm font-medium">6222 **** **** 1234</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">开票地址</div>
                  <div className="text-sm font-medium">{customerInfo.address}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">开票电话</div>
                  <div className="text-sm font-medium">010-12345678</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>收款信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 leading-relaxed">
                <div>累计合同金额：165万</div>
                <div>已收款金额：135万</div>
                <div>待收款金额：30万</div>
                <div>回款率：81.8%</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Edit Dialog */}
      <Dialog open={invoiceVisible} onOpenChange={(open) => {
        if (!open) {
          setInvoiceVisible(false);
          resetInvoiceForm();
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑开票信息</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>开票抬头 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入开票抬头"
                value={formData.invoiceTitle}
                onChange={(e) => setFormData((p) => ({ ...p, invoiceTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>纳税人识别号 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入纳税人识别号"
                value={formData.taxNumber}
                onChange={(e) => setFormData((p) => ({ ...p, taxNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>开户银行 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入开户银行"
                value={formData.bank}
                onChange={(e) => setFormData((p) => ({ ...p, bank: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>银行账号 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入银行账号"
                value={formData.bankAccount}
                onChange={(e) => setFormData((p) => ({ ...p, bankAccount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>开票地址 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入开票地址"
                value={formData.invoiceAddress}
                onChange={(e) => setFormData((p) => ({ ...p, invoiceAddress: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>开票电话 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入开票电话"
                value={formData.invoicePhone}
                onChange={(e) => setFormData((p) => ({ ...p, invoicePhone: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setInvoiceVisible(false); resetInvoiceForm(); }}>取消</Button>
            <Button onClick={handleInvoiceSave}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
