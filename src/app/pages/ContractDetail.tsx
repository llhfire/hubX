import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  FileText,
  History,
  Pencil,
  Check,
  CreditCard,
  Pin,
  Calendar,
} from 'lucide-react';
import { useContracts } from './contracts/ContractsContext';
import { ContractStatusBadge } from './contracts/components/ContractStatusBadge';
import { ContractActionBar } from './contracts/components/ContractActionBar';
import { VersionTimeline } from './contracts/components/VersionTimeline';
import { ScanFileList } from './contracts/components/ScanFileList';
import { ContractFlowProgress } from './contracts/components/ContractFlowProgress';
import { CONTRACT_STATUS_LABEL } from './contracts/utils';
import type { Contract, ContractStatus } from './contracts/types';

interface FollowUpRecord {
  id: string;
  type: 'requirement_change' | 'ui_confirm' | 'dunning' | 'other';
  title: string;
  content: string;
  author: string;
  date: string;
}

const FOLLOW_UP_TYPES: Record<FollowUpRecord['type'], { label: string; color: string; icon: React.ReactNode }> = {
  requirement_change: { label: '需求变更', color: 'orange', icon: <Pencil size={12} /> },
  ui_confirm:         { label: 'UI/原型确认', color: 'cyan', icon: <Check size={12} /> },
  dunning:            { label: '催款记录', color: 'red', icon: <CreditCard size={12} /> },
  other:              { label: '其他', color: 'gray', icon: <Pin size={12} /> },
};

const mockFollowUps: FollowUpRecord[] = [
  { id: 'fu-1', type: 'requirement_change', title: '新增报表功能需求', content: '客户希望增加月度统计报表功能，预计增加工作量 3 人天，费用增加 ¥15,000。', author: '张三', date: '2026-06-28' },
  { id: 'fu-2', type: 'ui_confirm', title: 'CRM 首页设计确认', content: '客户已确认 CRM 首页设计稿 V2，无修改意见，可以进入开发阶段。', author: '陈明', date: '2026-06-25' },
  { id: 'fu-3', type: 'dunning', title: '第二期款项催款', content: '已电话联系联系客户财务，对方确认本周内支付第二期款项 ¥360,000。', author: '张三', date: '2026-06-22' },
  { id: 'fu-4', type: 'requirement_change', title: '登录方式调整', content: '客户要求增加微信扫码登录，原有手机验证码登录保留。已评估技术可行性，无额外成本。', author: '李四', date: '2026-06-18' },
  { id: 'fu-5', type: 'ui_confirm', title: '移动端原型确认', content: '客户已签字确认移动端 APP 原型设计，包含 12 个核心页面流程图。', author: '陈明', date: '2026-06-15' },
  { id: 'fu-6', type: 'dunning', title: '首期款项到账确认', content: '已收到客户首期款项 ¥480,000，银行回单已归档。', author: '张三', date: '2026-06-10' },
];

function BadgeForColor({ color, children }: { color: string; children: React.ReactNode }) {
  const className =
    color === 'purple' ? 'bg-purple-500 text-white' :
    color === 'orange' ? 'bg-orange-500 text-white' :
    color === 'cyan'   ? 'bg-cyan-500 text-white' :
    color === 'red'    ? '' : // use variant="destructive"
    color === 'gray'   ? '' : // use variant="secondary"
    '';
  const variant = color === 'red' ? 'destructive' : color === 'gray' ? 'secondary' : undefined;
  return <Badge className={className || undefined} variant={variant}>{children}</Badge>;
}

export function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, uploadScan, setPrimaryScan } = useContracts();

  const contract = getById(id);

  // 版本切换：默认显示审批通过的版本，没有就显示最新一个版本
  const defaultVersionNo = useMemo(() => {
    if (!contract) return null;
    return (
      contract.approvedVersionNo ??
      contract.versionHistory[contract.versionHistory.length - 1]?.versionNo ??
      null
    );
  }, [contract]);

  const [selectedVersionNo, setSelectedVersionNo] = useState<string | null>(defaultVersionNo);
  // 当 contract 变化（创建新版本等）时，自动跟到 default
  if (contract && selectedVersionNo === null && defaultVersionNo) {
    setSelectedVersionNo(defaultVersionNo);
  }

  const [activeTab, setActiveTab] = useState('document');
  const [activeRightTab, setActiveRightTab] = useState('followup');

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
        <h2 className="text-xl font-semibold mb-2">合同不存在</h2>
        <p className="text-muted-foreground mb-6">该合同可能已被删除，或链接有误。</p>
        <Button onClick={() => navigate('/contracts')}>
          返回合同列表
        </Button>
      </div>
    );
  }

  const selectedVersion =
    contract.versionHistory.find((v) => v.versionNo === selectedVersionNo) ??
    contract.versionHistory[contract.versionHistory.length - 1];

  // 是否展示审批 Timeline：仅当所选版本是审批所基于的版本时
  const showApprovalForSelected = selectedVersionNo === contract.approvedVersionNo
    || (contract.status === 'approving' &&
      selectedVersionNo === contract.versionHistory[contract.versionHistory.length - 1]?.versionNo);

  const cd = contract.current;

  const paymentColumns = [
    { title: '期数', dataIndex: 'period', width: 80, render: (n: number) => `第 ${n} 期` },
    { title: '预计回款日期', dataIndex: 'expectedDate', width: 130 },
    {
      title: '比例',
      dataIndex: 'percentage',
      width: 80,
      render: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
  ];

  const totalAmount = cd.totalAmount;
  const receivedAmount = contract.receivedAmount ?? 0;
  const receivableAmount = (contract.receivableAmount ?? totalAmount - receivedAmount);
  const receivedRate = totalAmount > 0 ? Math.round((receivedAmount / totalAmount) * 100) : 0;

  // 上传扫描件回调
  const uploadEnabled = contract.status === 'pending_return' || contract.status === 'archived';
  const uploadIntent: 'first' | 'supplemental' | null = contract.status === 'pending_return'
    ? 'first'
    : contract.status === 'archived'
      ? 'supplemental'
      : null;

  // 跟进记录
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(mockFollowUps);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [followUpType, setFollowUpType] = useState('');
  const [followUpTitle, setFollowUpTitle] = useState('');
  const [followUpContent, setFollowUpContent] = useState('');

  const handleAddFollowUp = () => {
    if (!followUpType || !followUpTitle || !followUpContent) {
      toast.error('请填写完整信息');
      return;
    }
    const newRecord: FollowUpRecord = {
      id: `fu-${Date.now()}`,
      type: followUpType as FollowUpRecord['type'],
      title: followUpTitle,
      content: followUpContent,
      author: '当前用户',
      date: '2026-07-02',
    };
    setFollowUps(prev => [newRecord, ...prev]);
    setFollowUpModalVisible(false);
    setFollowUpType('');
    setFollowUpTitle('');
    setFollowUpContent('');
    toast.success('跟进记录已添加');
  };

  return (
    <div>
      {/* 顶部操作栏 */}
      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 size-4" />
                返回
              </Button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl font-semibold">{cd.contractName}</span>
                  <ContractStatusBadge status={contract.status} />
                  {contract.executionStatus && (
                    <Badge className="bg-purple-500 text-white">履行：{contract.executionStatus}</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  合同编号：{contract.contractNo}
                  <span className="ml-4">
                    当前查看版本：
                    <Select value={selectedVersionNo ?? undefined} onValueChange={setSelectedVersionNo}>
                      <SelectTrigger className="inline-flex w-[200px] ml-1 h-7">
                        <SelectValue placeholder="选择版本" />
                      </SelectTrigger>
                      <SelectContent>
                        {contract.versionHistory.map((v) => (
                          <SelectItem key={v.versionNo} value={v.versionNo}>
                            {v.versionNo} · {v.label}
                            {v.versionNo === contract.approvedVersionNo ? ' ✅' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </span>
                </div>
              </div>
            </div>
            <ContractActionBar contract={contract} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-[17fr_7fr] gap-4">
        {/* 左侧核心区 70% */}
        <div>
          {/* 基础信息卡片 */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><span className="text-sm text-muted-foreground">签约主体</span><div className="font-medium">{cd.signingEntity}</div></div>
                <div><span className="text-sm text-muted-foreground">产品类别</span><div className="font-medium">{cd.productCategory}</div></div>
                <div><span className="text-sm text-muted-foreground">合同总额</span><div className="font-medium">¥{cd.totalAmount.toLocaleString()}</div></div>
                <div><span className="text-sm text-muted-foreground">付款方式</span><div className="font-medium">{cd.paymentMethod}</div></div>
                <div><span className="text-sm text-muted-foreground">签约日期</span><div className="font-medium">{cd.signDate}</div></div>
                <div><span className="text-sm text-muted-foreground">生效日期</span><div className="font-medium">{cd.effectiveDate}</div></div>
                <div><span className="text-sm text-muted-foreground">终止日期</span><div className="font-medium">{cd.endDate}</div></div>
                <div><span className="text-sm text-muted-foreground">创建人</span><div className="font-medium">{contract.createdBy}</div></div>
              </div>

              <Separator className="my-4" />

              <div className="font-semibold mb-3">甲方画像</div>
              <div className="grid grid-cols-4 gap-4">
                <div><span className="text-sm text-muted-foreground">公司名称</span><div className="font-medium">{cd.customerName}</div></div>
                <div><span className="text-sm text-muted-foreground">联系人</span><div className="font-medium">{cd.customerContact}</div></div>
                <div><span className="text-sm text-muted-foreground">联系电话</span><div className="font-medium">{cd.customerPhone}</div></div>
                <div><span className="text-sm text-muted-foreground">税务登记号</span><div className="font-medium">{cd.customerTaxNo || '—'}</div></div>
              </div>
            </CardContent>
          </Card>

          {/* 款项与回款计划 */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>款项与回款计划</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md mb-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">合同总额</div>
                    <div className="text-xl font-bold text-primary">
                      ¥{totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">已回款</div>
                    <div className="text-xl font-bold text-green-600">
                      ¥{receivedAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">待回款</div>
                    <div className="text-xl font-bold text-orange-500">
                      ¥{receivableAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">到账率</div>
                    <Progress value={receivedRate} className="mt-2" />
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {paymentColumns.map((col) => (
                      <TableHead key={col.dataIndex} style={{ width: col.width }}>{col.title}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cd.paymentPlans.map((plan: any) => (
                    <TableRow key={plan.period}>
                      <TableCell>第 {plan.period} 期</TableCell>
                      <TableCell>{plan.expectedDate}</TableCell>
                      <TableCell>{plan.percentage.toFixed(2)}%</TableCell>
                      <TableCell>¥{plan.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 合同正文 / 扫描件归档 */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>合同文件</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="document">合同正文</TabsTrigger>
                  <TabsTrigger value="scan">
                    扫描件归档{contract.archivedScans.length > 0 ? ` (${contract.archivedScans.length})` : ''}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="document">
                  {selectedVersion ? (
                    <div
                      className="bg-muted p-4 rounded-md max-h-[600px] overflow-auto"
                      dangerouslySetInnerHTML={{ __html: selectedVersion.renderedHtml }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <p className="font-medium">该版本无可用预览</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="scan">
                  <ScanFileList
                    entries={contract.archivedScans}
                    uploadEnabled={uploadEnabled}
                    uploadIntent={uploadIntent}
                    onUpload={(files) => uploadScan(contract.id, files)}
                    onSetPrimary={(entryId) => setPrimaryScan(contract.id, entryId)}
                  />
                  {!uploadEnabled && contract.archivedScans.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <p className="font-medium">尚未到归档阶段</p>
                      <p className="text-sm mt-1">合同需进入「待回寄」状态后方可上传扫描件。当前状态：{CONTRACT_STATUS_LABEL[contract.status]}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 右侧动态侧边栏 30% */}
        <div>
          {/* 流转进度（形成期）/ 项目里程碑（履行期，本次只占位） */}
          {contract.status !== 'archived' && (
            <ContractFlowProgress status={contract.status} />
          )}

          {/* 右侧 Tab：跟进记录 / 审批记录 / 版本历史 */}
          <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="mt-4">
            <TabsList>
              <TabsTrigger value="followup"><FileText className="size-3.5 mr-1" /> 跟进</TabsTrigger>
              <TabsTrigger value="approval"><Calendar className="size-3.5 mr-1" /> 审批</TabsTrigger>
              <TabsTrigger value="versions"><History className="size-3.5 mr-1" /> 版本</TabsTrigger>
            </TabsList>
            <TabsContent value="followup">
              <Card className="rounded-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm" />
                    <Button variant="ghost" size="sm" onClick={() => setFollowUpModalVisible(true)}>
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6">
                    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
                    {followUps.map(fu => {
                      const typeMeta = FOLLOW_UP_TYPES[fu.type];
                      return (
                        <div key={fu.id} className="relative pb-6">
                          <div className="absolute left-[-13px] top-1 size-2.5 rounded-full bg-primary" />
                          <div className="mb-1">
                            <BadgeForColor color={typeMeta.color}>{typeMeta.label}</BadgeForColor>
                            <span className="font-semibold text-sm ml-1">{fu.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{fu.date} · {fu.author}</div>
                          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                            {fu.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="approval">
              <Card className="rounded-lg">
                <CardContent className="pt-4">
                  {showApprovalForSelected ? (
                    <div className="relative pl-6">
                      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
                      {contract.approvalFlow.map((node, index) => (
                        <div key={index} className="relative pb-6">
                          <div className="absolute left-[-13px] top-1 size-2.5 rounded-full bg-primary" />
                          {node.status === 'approved' ? (
                            <div className="absolute left-[-17px] top-0.5">
                              <CheckCircle2 className="size-3.5 text-green-600" />
                            </div>
                          ) : node.status === 'rejected' ? (
                            <div className="absolute left-[-17px] top-0.5">
                              <XCircle className="size-3.5 text-destructive" />
                            </div>
                          ) : (
                            <div className="absolute left-[-17px] top-0.5">
                              <Clock className="size-3.5 text-orange-500" />
                            </div>
                          )}
                          <div className="mb-1">
                            <span className="font-semibold text-sm">{node.step}</span>
                            {node.time && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                {node.time}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            审批人：{node.approver}
                          </div>
                          {node.comment && (
                            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                              {node.comment}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <p className="font-medium">该版本未提交审批</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="versions">
              <VersionTimeline
                contract={contract}
                selectedVersionNo={selectedVersionNo}
                onSelectVersion={setSelectedVersionNo}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 添加跟进记录弹窗 */}
      <Dialog open={followUpModalVisible} onOpenChange={setFollowUpModalVisible}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>添加跟进记录</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>跟进类型</Label>
              <Select value={followUpType} onValueChange={setFollowUpType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择跟进类型" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FOLLOW_UP_TYPES).map(([k, m]) => (
                    <SelectItem key={k} value={k}>{m.icon} {m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>标题</Label>
              <Input placeholder="简要描述" value={followUpTitle} onChange={(e) => setFollowUpTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>详细内容</Label>
              <Textarea placeholder="详细描述跟进内容..." rows={4} value={followUpContent} onChange={(e) => setFollowUpContent(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpModalVisible(false)}>取消</Button>
            <Button onClick={handleAddFollowUp}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
