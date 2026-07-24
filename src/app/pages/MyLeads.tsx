import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import {
  Search,
  Eye,
  Pencil,
  ArrowLeftRight,
  Trash2,
  Undo2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CompanyEntityInfoModal } from './company-entity/CompanyEntityInfoModal';
import {
  companyEntityPermissions,
  findCompanyEntityByName,
  type CompanyEntityRecord,
} from './company-entity/companyEntityData';
import { useReminders } from '@/app/reminders/ReminderContext';
import type { ReminderItem } from '@/app/reminders/types';

const statusDotColor: Record<string, string> = {
  default: 'bg-gray-400',
  warning: 'bg-orange-500',
  processing: 'bg-blue-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
};

function StatusBadge({ status, text }: { status: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${statusDotColor[status] || 'bg-gray-400'}`} />
      <span>{text}</span>
    </span>
  );
}

export function getLeadFollowupReminderBanner(reminders: ReminderItem[]) {
  const leadReminders = reminders.filter(
    (reminder) => reminder.type === 'lead_followup_overdue',
  );

  if (leadReminders.length === 0) {
    return null;
  }

  const firstReminder = leadReminders[0];
  const firstTargetPath =
    firstReminder.actionTarget.kind === 'route' ? firstReminder.actionTarget.path : null;

  return {
    count: leadReminders.length,
    firstLeadId: firstReminder.sourceId,
    firstTargetPath,
  };
}

export function MyLeads() {
  const navigate = useNavigate();
  const { reminders } = useReminders();
  const leadReminderBanner = getLeadFollowupReminderBanner(reminders);

  // Dialog visibility
  const [transferVisible, setTransferVisible] = useState(false);
  const [discardVisible, setDiscardVisible] = useState(false);
  const [trashVisible, setTrashVisible] = useState(false);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompanyEntity, setSelectedCompanyEntity] = useState<CompanyEntityRecord | null>(null);

  // Form data
  const [transferData, setTransferData] = useState({ target: '', reason: '' });
  const [discardData, setDiscardData] = useState({ reason: '' });
  const [trashData, setTrashData] = useState({ reason: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = 45;
  const pageSize = 10;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const myLeads = [
    {
      key: '1',
      id: 'LS001',
      entity: '中科软艺',
      name: '某科技公司APP开发需求',
      customer: '北京科技有限公司',
      contact: '张经理',
      phone: '138****1111',
      status: '需求调研',
      level: '高',
      nextFollow: '2026-04-10 14:00',
      lastFollow: '2小时前',
      followCount: 8,
      daysHeld: 15,
    },
    {
      key: '2',
      id: 'LS002',
      entity: '软艺信息',
      name: '企业管理系统定制',
      customer: '上海商贸公司',
      contact: '李总',
      phone: '139****2222',
      status: '方案报价',
      level: '中',
      nextFollow: '2026-04-11 10:00',
      lastFollow: '5小时前',
      followCount: 5,
      daysHeld: 8,
    },
    {
      key: '3',
      id: 'LS003',
      entity: '中科集团',
      name: '小程序开发项目',
      customer: '深圳电商公司',
      contact: '王总',
      phone: '136****3333',
      status: '合同洽谈',
      level: '高',
      nextFollow: '2026-04-09 16:00',
      lastFollow: '1天前',
      followCount: 12,
      daysHeld: 22,
    },
    {
      key: '4',
      id: 'LS004',
      entity: '中科软艺',
      name: '数据分析平台',
      customer: '广州金融公司',
      contact: '赵经理',
      phone: '137****4444',
      status: '初步沟通',
      level: '中',
      nextFollow: '2026-04-12 09:00',
      lastFollow: '2天前',
      followCount: 3,
      daysHeld: 5,
    },
  ];

  const statusMap = {
    未联系: 'default',
    未接通: 'warning',
    初步沟通: 'processing',
    需求调研: 'processing',
    方案报价: 'processing',
    合同洽谈: 'success',
    已签单: 'success',
    已终止: 'error',
  };

  const handleOpenCompanyEntity = (entityName: string) => {
    if (!companyEntityPermissions.view) {
      toast.warning('暂无权限查看公司主体详情');
      return;
    }

    const companyEntity = findCompanyEntityByName(entityName);
    if (!companyEntity) {
      toast.warning('未找到公司主体信息');
      return;
    }

    setSelectedCompanyEntity(companyEntity);
    setCompanyModalVisible(true);
  };

  const handleTransferSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!transferData.target) newErrors.target = '请选择转让对象';
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    toast.success('线索转让成功');
    setTransferVisible(false);
    setTransferData({ target: '', reason: '' });
    setFormErrors({});
  };

  const handleDiscardSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!discardData.reason) newErrors.reason = '请填写丢弃原因';
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    toast.success('线索已丢回公海线索');
    setDiscardVisible(false);
    setDiscardData({ reason: '' });
    setFormErrors({});
  };

  const handleTrashSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!trashData.reason) newErrors.reason = '请填写丢弃原因';
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    toast.success('线索已标记为垃圾');
    setTrashVisible(false);
    setTrashData({ reason: '' });
    setFormErrors({});
  };

  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">我的线索</h2>
        </div>

        {leadReminderBanner ? (
          <Alert
            className="mb-4 cursor-pointer border-orange-200 bg-orange-50"
            style={{ cursor: leadReminderBanner.firstTargetPath ? 'pointer' : 'default' }}
            onClick={() => {
              if (leadReminderBanner.firstTargetPath) {
                navigate(leadReminderBanner.firstTargetPath, { state: { from: 'my' } });
              }
            }}
          >
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-800">
              当前有 {leadReminderBanner.count} 条线索已超时未跟进，请尽快处理。
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 mb-4">
              <div className="relative w-[240px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="搜索线索名称、客户" />
              </div>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="客户状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="未联系">未联系</SelectItem>
                  <SelectItem value="未接通">未接通</SelectItem>
                  <SelectItem value="初步沟通">初步沟通</SelectItem>
                  <SelectItem value="需求调研">需求调研</SelectItem>
                  <SelectItem value="方案报价">方案报价</SelectItem>
                  <SelectItem value="合同洽谈">合同洽谈</SelectItem>
                  <SelectItem value="已签单">已签单</SelectItem>
                  <SelectItem value="已终止">已终止</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="意向等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
              <Button>搜索</Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table style={{ minWidth: 1600 }}>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 100 }}>线索ID</TableHead>
                    <TableHead style={{ width: 200 }}>线索名称</TableHead>
                    <TableHead style={{ width: 120 }}>对接主体</TableHead>
                    <TableHead style={{ width: 150 }}>关联客户</TableHead>
                    <TableHead style={{ width: 100 }}>联系人</TableHead>
                    <TableHead style={{ width: 120 }}>手机号</TableHead>
                    <TableHead style={{ width: 120 }}>客户状态</TableHead>
                    <TableHead style={{ width: 100 }}>意向等级</TableHead>
                    <TableHead style={{ width: 150 }}>下次跟进</TableHead>
                    <TableHead style={{ width: 100 }}>最后跟进</TableHead>
                    <TableHead style={{ width: 100 }}>跟进次数</TableHead>
                    <TableHead style={{ width: 100 }}>持有天数</TableHead>
                    <TableHead style={{ width: 150 }} className="sticky right-0 bg-background">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLeads.map((record) => (
                    <TableRow key={record.key}>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>
                        <a
                          onClick={() => navigate(`/leads/${record.key}`, { state: { from: 'my' } })}
                          className="text-primary cursor-pointer hover:underline"
                        >
                          {record.name}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleOpenCompanyEntity(record.entity)}
                        >
                          {record.entity}
                        </Button>
                      </TableCell>
                      <TableCell>{record.customer}</TableCell>
                      <TableCell>{record.contact}</TableCell>
                      <TableCell>{record.phone}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={statusMap[record.status as keyof typeof statusMap]}
                          text={record.status}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={record.level === '高' ? 'error' : 'warning'}
                          text={record.level}
                        />
                      </TableCell>
                      <TableCell>{record.nextFollow}</TableCell>
                      <TableCell>{record.lastFollow}</TableCell>
                      <TableCell>{record.followCount}</TableCell>
                      <TableCell>{record.daysHeld}</TableCell>
                      <TableCell className="sticky right-0 bg-background">
                        <div className="flex items-center gap-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => navigate(`/leads/${record.key}`, { state: { from: 'my' } })}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>查看详情</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>添加跟进</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => setTransferVisible(true)}
                              >
                                <ArrowLeftRight className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>转让线索</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => setDiscardVisible(true)}
                              >
                                <Undo2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>丢弃线索</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setTrashVisible(true)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>标记为垃圾</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                共 {totalRecords} 条记录，第 {currentPage}/{totalPages} 页
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className="w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Dialog */}
        <Dialog
          open={transferVisible}
          onOpenChange={(open) => {
            if (!open) {
              setTransferVisible(false);
              setTransferData({ target: '', reason: '' });
              setFormErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>转让线索</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  转让给 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={transferData.target}
                  onValueChange={(value) =>
                    setTransferData((prev) => ({ ...prev, target: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择销售人员" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">李四</SelectItem>
                    <SelectItem value="user2">王五</SelectItem>
                    <SelectItem value="user3">赵六</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.target && (
                  <p className="text-sm text-destructive">{formErrors.target}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>转让原因</Label>
                <Textarea
                  placeholder="请输入转让原因（选填）"
                  rows={4}
                  value={transferData.reason}
                  onChange={(e) =>
                    setTransferData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setTransferVisible(false);
                  setTransferData({ target: '', reason: '' });
                  setFormErrors({});
                }}
              >
                取消
              </Button>
              <Button onClick={handleTransferSubmit}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Discard Dialog */}
        <Dialog
          open={discardVisible}
          onOpenChange={(open) => {
            if (!open) {
              setDiscardVisible(false);
              setDiscardData({ reason: '' });
              setFormErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>丢弃线索</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  丢弃原因 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="请详细说明丢弃该线索的原因，以便其他人员参考"
                  rows={4}
                  value={discardData.reason}
                  onChange={(e) =>
                    setDiscardData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                />
                {formErrors.reason && (
                  <p className="text-sm text-destructive">{formErrors.reason}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDiscardVisible(false);
                  setDiscardData({ reason: '' });
                  setFormErrors({});
                }}
              >
                取消
              </Button>
              <Button onClick={handleDiscardSubmit}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Trash Dialog */}
        <Dialog
          open={trashVisible}
          onOpenChange={(open) => {
            if (!open) {
              setTrashVisible(false);
              setTrashData({ reason: '' });
              setFormErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>标记为垃圾</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  丢弃原因 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="请详细说明将该线索标记为垃圾的原因"
                  rows={4}
                  value={trashData.reason}
                  onChange={(e) =>
                    setTrashData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                />
                {formErrors.reason && (
                  <p className="text-sm text-destructive">{formErrors.reason}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setTrashVisible(false);
                  setTrashData({ reason: '' });
                  setFormErrors({});
                }}
              >
                取消
              </Button>
              <Button onClick={handleTrashSubmit}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CompanyEntityInfoModal
          visible={companyModalVisible}
          mode="view"
          defaultTab="files"
          record={selectedCompanyEntity}
          permissions={companyEntityPermissions}
          onCancel={() => setCompanyModalVisible(false)}
          onGoManage={() => navigate('/system/company')}
        />
      </div>
    </TooltipProvider>
  );
}
