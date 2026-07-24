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
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  Headphones,
} from 'lucide-react';

// ---------- 类型 ----------

type MaintenanceStatus = 'active' | 'expiring' | 'expired' | 'renewed';
type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
type TicketStatus = 'open' | 'assigned' | 'processing' | 'resolved' | 'closed';

interface MaintenanceRecord {
  id: string;
  projectName: string;
  customerName: string;
  contractNo: string;
  deliveryDate: string;
  freeMaintenanceEnd: string;
  status: MaintenanceStatus;
  hasPaidContract: boolean;
  paidContractEnd?: string;
  salesOwner: string;
  notes?: string;
}

interface Ticket {
  id: string;
  title: string;
  customerName: string;
  projectName: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
  createdAt: string;
  slaDeadline: string;
  resolvedAt?: string;
  description: string;
}

interface RenewalContract {
  id: string;
  projectName: string;
  customerName: string;
  contractNo: string;
  signDate: string;
  endDate: string;
  amount: number;
  salesOwner: string;
}

// ---------- 工具 ----------

function getDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - new Date('2026-07-02').getTime()) / (1000 * 60 * 60 * 24));
}

const MAINTENANCE_STATUS_LABELS: Record<MaintenanceStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active:   { label: '维护期中', variant: 'default' },
  expiring: { label: '即将到期', variant: 'secondary' },
  expired:  { label: '已到期',   variant: 'destructive' },
  renewed:  { label: '已续签',   variant: 'outline' },
};

const TICKET_PRIORITY_LABELS: Record<TicketPriority, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  critical: { label: '紧急', variant: 'destructive' },
  high:     { label: '高',   variant: 'secondary' },
  medium:   { label: '中',   variant: 'default' },
  low:      { label: '低',   variant: 'outline' },
};

const TICKET_STATUS_LABELS: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  open:       { label: '待分配', variant: 'outline' },
  assigned:   { label: '已分配', variant: 'default' },
  processing: { label: '处理中', variant: 'secondary' },
  resolved:   { label: '已解决', variant: 'default' },
  closed:     { label: '已关闭', variant: 'outline' },
};

// ---------- 模拟数据 ----------

const mockMaintenance: MaintenanceRecord[] = [
  { id: 'mnt-1', projectName: '企业管理系统开发', customerName: '北京科技有限公司', contractNo: 'HT202601001', deliveryDate: '2026-03-20', freeMaintenanceEnd: '2026-09-20', status: 'active',   hasPaidContract: false, salesOwner: '张三' },
  { id: 'mnt-2', projectName: '云服务平台项目',   customerName: '创新科技有限公司', contractNo: 'HT202601002', deliveryDate: '2026-04-01', freeMaintenanceEnd: '2026-07-15', status: 'expiring', hasPaidContract: false, salesOwner: '张三', notes: '即将到期，需跟进续费' },
  { id: 'mnt-3', projectName: '电商平台小程序',   customerName: '东方电子商务有限公司', contractNo: 'HT202601003', deliveryDate: '2026-02-15', freeMaintenanceEnd: '2026-07-01', status: 'expired',  hasPaidContract: true,  paidContractEnd: '2027-07-01', salesOwner: '李四' },
  { id: 'mnt-4', projectName: '智能制造 MES',    customerName: '华夏制造集团',     contractNo: 'HT202601004', deliveryDate: '2026-01-10', freeMaintenanceEnd: '2026-07-10', status: 'expiring', hasPaidContract: false, salesOwner: '王五', notes: '客户有续签意向' },
  { id: 'mnt-5', projectName: '医疗健康 APP',    customerName: '康健医疗科技',     contractNo: 'HT202601005', deliveryDate: '2026-05-10', freeMaintenanceEnd: '2026-11-10', status: 'active',   hasPaidContract: false, salesOwner: '赵六' },
];

const mockTickets: Ticket[] = [
  { id: 'tk-1', title: '登录页面加载缓慢', customerName: '北京科技有限公司', projectName: '企业管理系统开发', priority: 'high',     status: 'processing', assignee: '李四', createdAt: '2026-07-01 09:30', slaDeadline: '2026-07-01 17:00', description: '用户反馈登录页面加载超过 10 秒' },
  { id: 'tk-2', title: '数据导出功能报错', customerName: '创新科技有限公司', projectName: '云服务平台项目',   priority: 'critical', status: 'assigned',   assignee: '王五', createdAt: '2026-07-02 08:00', slaDeadline: '2026-07-02 12:00', description: '导出 Excel 时报 500 错误' },
  { id: 'tk-3', title: '移动端适配问题',  customerName: '东方电子商务有限公司', projectName: '电商平台小程序', priority: 'medium',  status: 'open',       assignee: '',     createdAt: '2026-07-02 10:15', slaDeadline: '2026-07-04 10:15', description: 'iPhone SE 上页面显示异常' },
  { id: 'tk-4', title: '新增数据报表需求', customerName: '华夏制造集团', projectName: '智能制造 MES', priority: 'low',     status: 'resolved',   assignee: '赵六', createdAt: '2026-06-28 14:00', slaDeadline: '2026-07-05 14:00', resolvedAt: '2026-06-30 16:00', description: '客户希望增加生产统计报表' },
  { id: 'tk-5', title: '系统偶尔卡顿',   customerName: '康健医疗科技', projectName: '医疗健康 APP', priority: 'medium',  status: 'closed',     assignee: '李四', createdAt: '2026-06-25 11:00', slaDeadline: '2026-07-02 11:00', resolvedAt: '2026-06-27 09:00', description: '使用高峰期系统响应慢' },
];

const mockRenewalContracts: RenewalContract[] = [
  { id: 'rc-1', projectName: '电商平台小程序', customerName: '东方电子商务有限公司', contractNo: 'WH-2026-001', signDate: '2026-06-25', endDate: '2027-07-01', amount: 36000, salesOwner: '李四' },
];

// ---------- 主组件 ----------

export function MaintenanceManagement() {
  const [activeTab, setActiveTab] = useState('maintenance');
  const [tickets, setTickets] = useState(mockTickets);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);

  // 工单表单状态
  const [ticketForm, setTicketForm] = useState({
    title: '',
    customerName: '',
    projectName: '',
    priority: 'medium' as TicketPriority,
    assignee: '',
    description: '',
  });

  const summary = useMemo(() => {
    const active = mockMaintenance.filter(m => m.status === 'active').length;
    const expiring = mockMaintenance.filter(m => m.status === 'expiring').length;
    const expired = mockMaintenance.filter(m => m.status === 'expired').length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'assigned' || t.status === 'processing').length;
    const criticalTickets = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved').length;
    return { active, expiring, expired, openTickets, criticalTickets, totalProjects: mockMaintenance.length };
  }, [tickets]);

  const resetTicketForm = () => {
    setTicketForm({
      title: '',
      customerName: '',
      projectName: '',
      priority: 'medium',
      assignee: '',
      description: '',
    });
  };

  const handleAddTicket = () => {
    resetTicketForm();
    setTicketModalVisible(true);
  };

  const updateTicketForm = (field: string, value: string) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.customerName || !ticketForm.projectName) {
      return;
    }
    const newTicket: Ticket = {
      id: `tk-${Date.now()}`,
      title: ticketForm.title,
      customerName: ticketForm.customerName,
      projectName: ticketForm.projectName,
      priority: ticketForm.priority,
      status: 'open',
      assignee: ticketForm.assignee || '',
      createdAt: '2026-07-02 12:00',
      slaDeadline: ticketForm.priority === 'critical' ? '2026-07-02 16:00' : ticketForm.priority === 'high' ? '2026-07-03 12:00' : '2026-07-05 12:00',
      description: ticketForm.description,
    };
    setTickets(prev => [newTicket, ...prev]);
    setTicketModalVisible(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              维护期项目
            </div>
            <div className="text-2xl font-bold mt-1">{summary.active} <span className="text-sm font-normal text-muted-foreground">个</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <AlertCircle className="size-4 text-yellow-500" />
              即将到期
            </div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">{summary.expiring} <span className="text-sm font-normal text-muted-foreground">个</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <AlertCircle className="size-4 text-destructive" />
              已到期
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{summary.expired} <span className="text-sm font-normal text-muted-foreground">个</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Headphones className="size-4 text-primary" />
              待处理工单
            </div>
            <div className="text-2xl font-bold mt-1">{summary.openTickets} <span className="text-sm font-normal text-muted-foreground">个</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <AlertCircle className="size-4 text-destructive" />
              紧急工单
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{summary.criticalTickets} <span className="text-sm font-normal text-muted-foreground">个</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              续签合同
            </div>
            <div className="text-2xl font-bold mt-1">{mockRenewalContracts.length} <span className="text-sm font-normal text-muted-foreground">个</span></div>
          </CardContent>
        </Card>
      </div>

      {/* 到期预警 */}
      {(summary.expiring > 0 || summary.expired > 0) && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {summary.expiring > 0 && <strong className="text-yellow-600">{summary.expiring} 个</strong>}
            {summary.expiring > 0 && ' 项目维护期即将到期，请跟进续费。'}
            {summary.expiring > 0 && summary.expired > 0 && ' '}
            {summary.expired > 0 && <strong className="text-destructive">{summary.expired} 个</strong>}
            {summary.expired > 0 && ' 项目维护期已到期。'}
          </AlertDescription>
        </Alert>
      )}

      {/* 主体 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="maintenance"><Calendar className="size-4" /> 维护期跟踪</TabsTrigger>
              <TabsTrigger value="tickets">
                <Headphones className="size-4" /> 客户工单
                {summary.openTickets > 0 && (
                  <Badge variant="default" className="ml-1 h-5 min-w-5 px-1">{summary.openTickets}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="renewal"><FileText className="size-4" /> 续费合同</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="pt-4">
              {/* 维护期跟踪 Tab */}
              {activeTab === 'maintenance' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">项目名称</TableHead>
                      <TableHead className="w-[130px]">客户</TableHead>
                      <TableHead className="w-[130px]">合同编号</TableHead>
                      <TableHead className="w-[100px]">交付日期</TableHead>
                      <TableHead className="w-[120px]">免费维护截止</TableHead>
                      <TableHead className="w-[90px]">状态</TableHead>
                      <TableHead className="w-[120px]">维护进度</TableHead>
                      <TableHead className="w-[80px]">付费合同</TableHead>
                      <TableHead className="w-[90px]">销售负责人</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMaintenance.map(row => {
                      const total = Math.ceil((new Date(row.freeMaintenanceEnd).getTime() - new Date(row.deliveryDate).getTime()) / (1000 * 60 * 60 * 24));
                      const elapsed = total - getDaysUntil(row.freeMaintenanceEnd);
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="font-semibold">{row.projectName}</TableCell>
                          <TableCell>{row.customerName}</TableCell>
                          <TableCell>{row.contractNo}</TableCell>
                          <TableCell>{row.deliveryDate}</TableCell>
                          <TableCell>
                            {(() => {
                              const days = getDaysUntil(row.freeMaintenanceEnd);
                              if (days < 0) return <span className="text-destructive">{row.freeMaintenanceEnd} (已到期)</span>;
                              if (days <= 30) return <span className="text-yellow-600">{row.freeMaintenanceEnd} ({days}天)</span>;
                              return row.freeMaintenanceEnd;
                            })()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={MAINTENANCE_STATUS_LABELS[row.status].variant}>{MAINTENANCE_STATUS_LABELS[row.status].label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={Math.min(100, Math.round((elapsed / total) * 100))} className="w-16" />
                              <span className="text-xs text-muted-foreground">{Math.min(100, Math.round((elapsed / total) * 100))}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {row.hasPaidContract ? <Badge variant="default">有</Badge> : <Badge variant="outline">无</Badge>}
                          </TableCell>
                          <TableCell>{row.salesOwner}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {/* 客户工单 Tab */}
              {activeTab === 'tickets' && (
                <div>
                  <div className="mb-4 flex justify-end">
                    <Button onClick={handleAddTicket}>
                      <Plus className="size-4" /> 新建工单
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70px]">优先级</TableHead>
                        <TableHead className="w-[160px]">标题</TableHead>
                        <TableHead className="w-[130px]">客户</TableHead>
                        <TableHead className="w-[130px]">项目</TableHead>
                        <TableHead className="w-[80px]">状态</TableHead>
                        <TableHead className="w-[70px]">处理人</TableHead>
                        <TableHead className="w-[130px]">创建时间</TableHead>
                        <TableHead className="w-[130px]">SLA 截止</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map(row => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <Badge variant={TICKET_PRIORITY_LABELS[row.priority].variant}>{TICKET_PRIORITY_LABELS[row.priority].label}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{row.title}</TableCell>
                          <TableCell>{row.customerName}</TableCell>
                          <TableCell>{row.projectName}</TableCell>
                          <TableCell>
                            <Badge variant={TICKET_STATUS_LABELS[row.status].variant}>{TICKET_STATUS_LABELS[row.status].label}</Badge>
                          </TableCell>
                          <TableCell>{row.assignee || <span className="text-muted-foreground">待分配</span>}</TableCell>
                          <TableCell>{row.createdAt}</TableCell>
                          <TableCell>
                            {(() => {
                              if (row.status === 'closed' || row.status === 'resolved') return <span className="text-muted-foreground">—</span>;
                              const days = getDaysUntil(row.slaDeadline);
                              if (days < 0) return <span className="text-destructive font-semibold">超时 {Math.abs(days)} 天</span>;
                              if (days === 0) return <span className="text-yellow-600 font-semibold">今日到期</span>;
                              return row.slaDeadline;
                            })()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* 续费合同 Tab */}
              {activeTab === 'renewal' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">项目</TableHead>
                      <TableHead className="w-[130px]">客户</TableHead>
                      <TableHead className="w-[130px]">合同编号</TableHead>
                      <TableHead className="w-[100px]">签订日期</TableHead>
                      <TableHead className="w-[100px]">到期日期</TableHead>
                      <TableHead className="w-[100px]">合同金额</TableHead>
                      <TableHead className="w-[90px]">销售负责人</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRenewalContracts.map(row => (
                      <TableRow key={row.id}>
                        <TableCell className="font-semibold">{row.projectName}</TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell>{row.contractNo}</TableCell>
                        <TableCell>{row.signDate}</TableCell>
                        <TableCell>{row.endDate}</TableCell>
                        <TableCell>&yen;{row.amount.toLocaleString()}</TableCell>
                        <TableCell>{row.salesOwner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 新建工单弹窗 */}
      <Dialog open={ticketModalVisible} onOpenChange={setTicketModalVisible}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>新建客户工单</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitTicket}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ticket-title">工单标题 <span className="text-destructive">*</span></Label>
                <Input id="ticket-title" placeholder="简要描述问题" value={ticketForm.title} onChange={e => updateTicketForm('title', e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ticket-customer">客户 <span className="text-destructive">*</span></Label>
                  <Input id="ticket-customer" placeholder="客户名称" value={ticketForm.customerName} onChange={e => updateTicketForm('customerName', e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ticket-project">项目 <span className="text-destructive">*</span></Label>
                  <Input id="ticket-project" placeholder="项目名称" value={ticketForm.projectName} onChange={e => updateTicketForm('projectName', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ticket-priority">优先级 <span className="text-destructive">*</span></Label>
                  <Select value={ticketForm.priority} onValueChange={v => updateTicketForm('priority', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TICKET_PRIORITY_LABELS).map(([k, m]) => (
                        <SelectItem key={k} value={k}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ticket-assignee">处理人</Label>
                  <Input id="ticket-assignee" placeholder="指定处理人（可选）" value={ticketForm.assignee} onChange={e => updateTicketForm('assignee', e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ticket-desc">问题描述</Label>
                <Textarea id="ticket-desc" placeholder="详细描述问题" rows={4} value={ticketForm.description} onChange={e => updateTicketForm('description', e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTicketModalVisible(false)}>取消</Button>
              <Button type="submit">确定</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
