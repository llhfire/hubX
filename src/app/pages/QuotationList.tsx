import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';
import {
  Search,
  Plus,
  Download,
  Check,
  X,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

const statusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case '已通过':
      return 'default';
    case '待审批':
      return 'secondary';
    case '已拒绝':
      return 'destructive';
    default:
      return 'outline';
  }
};

export function QuotationList() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [workflowExpanded, setWorkflowExpanded] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [commentError, setCommentError] = useState('');

  // 模拟数据
  const mockData = [
    {
      id: '1',
      quotationNo: 'QT20260425001',
      leadName: '阿里巴巴-企业管理系统',
      customerEntity: '阿里巴巴（中国）有限公司',
      ourEntity: '北京科技有限公司',
      amount: 500000,
      estimatedCost: 320000,
      estimatedProfit: 180000,
      validUntil: '2026-05-25',
      status: '待审批',
      createDate: '2026-04-25',
      creator: '张三',
      attachments: [
        { id: 'att-1-1', name: '报价单.pdf', size: '1.2MB' },
        { id: 'att-1-2', name: '技术方案.docx', size: '856KB' },
      ],
      approvalFlow: [
        { step: '发起申请', approver: '张三 - 销售', status: 'approved', time: '2026-04-25 14:30', comment: '提交报价审批' },
        { step: '商务审核', approver: '王经理 - 商务主管', status: 'approved', time: '2026-04-25 16:20', comment: '报价合理，同意' },
        { step: '财务审核', approver: '陈财务 - 财务总监', status: 'pending', time: '', comment: '' },
      ],
    },
    {
      id: '2',
      quotationNo: 'QT20260424001',
      leadName: '腾讯-云服务平台',
      customerEntity: '腾讯科技（深圳）有限公司',
      ourEntity: '北京科技有限公司',
      amount: 800000,
      estimatedCost: 520000,
      estimatedProfit: 280000,
      validUntil: '2026-05-24',
      status: '已通过',
      createDate: '2026-04-24',
      creator: '李四',
      attachments: [
        { id: 'att-2-1', name: '云平台报价方案.pdf', size: '2.1MB' },
      ],
      approvalFlow: [
        { step: '发起申请', approver: '李四 - 销售', status: 'approved', time: '2026-04-24 10:30', comment: '提交报价审批' },
        { step: '商务审核', approver: '王经理 - 商务主管', status: 'approved', time: '2026-04-24 14:15', comment: '通过审核' },
        { step: '财务审核', approver: '陈财务 - 财务总监', status: 'approved', time: '2026-04-24 16:45', comment: '批准' },
      ],
    },
    {
      id: '3',
      quotationNo: 'QT20260423001',
      leadName: '字节跳动-协作工具',
      customerEntity: '北京字节跳动科技有限公司',
      ourEntity: '上海分公司',
      amount: 350000,
      estimatedCost: 230000,
      estimatedProfit: 120000,
      validUntil: '2026-05-23',
      status: '已拒绝',
      createDate: '2026-04-23',
      creator: '王五',
      attachments: [
        { id: 'att-3-1', name: '协作工具报价.pdf', size: '652KB' },
      ],
      approvalFlow: [
        { step: '发起申请', approver: '王五 - 销售', status: 'approved', time: '2026-04-23 09:00', comment: '提交报价审批' },
        { step: '商务审核', approver: '王经理 - 商务主管', status: 'rejected', time: '2026-04-23 11:30', comment: '报价过高，与市场价格不符，请重新核算成本后调整报价' },
      ],
    },
  ];

  const handleSearch = () => {
    console.log('搜索条件：', searchForm);
  };

  const handleReset = () => {
    setSearchForm({
      keyword: '',
      status: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleViewDetail = (record: any) => {
    setSelectedQuotation(record);
    setDetailVisible(true);
  };

  const handleApprovalSubmit = () => {
    if (!approvalComment.trim()) {
      setCommentError('请填写审批意见');
      return;
    }
    setCommentError('');
    toast.success(
      `审批${approvalAction === 'approve' ? '通过' : '不通过'}成功，审批意见：${approvalComment}`
    );
    setApprovalVisible(false);
    setDetailVisible(false);
    setApprovalComment('');
  };

  const openApprovalDialog = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setApprovalComment('');
    setCommentError('');
    setApprovalVisible(true);
  };

  return (
    <div>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              className="w-[200px]"
              placeholder="搜索报价单号/线索名称"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.status}
              onValueChange={(value) => setSearchForm({ ...searchForm, status: value === '__all__' ? '' : value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部</SelectItem>
                <SelectItem value="待审批">待审批</SelectItem>
                <SelectItem value="已通过">已通过</SelectItem>
                <SelectItem value="已拒绝">已拒绝</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="w-[150px]"
                value={searchForm.startDate}
                onChange={(e) => setSearchForm({ ...searchForm, startDate: e.target.value })}
              />
              <span className="text-muted-foreground text-sm">至</span>
              <Input
                type="date"
                className="w-[150px]"
                value={searchForm.endDate}
                onChange={(e) => setSearchForm({ ...searchForm, endDate: e.target.value })}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="size-4" />
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>报价列表</CardTitle>
          <CardAction>
            <Button>
              <Plus className="size-4" />
              新增报价
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">报价单号</TableHead>
                  <TableHead className="min-w-[200px]">线索名称</TableHead>
                  <TableHead className="min-w-[200px]">客户主体</TableHead>
                  <TableHead className="min-w-[150px]">对接主体</TableHead>
                  <TableHead className="min-w-[120px]">报价金额</TableHead>
                  <TableHead className="min-w-[120px]">有效期至</TableHead>
                  <TableHead className="min-w-[100px]">状态</TableHead>
                  <TableHead className="min-w-[120px]">创建日期</TableHead>
                  <TableHead className="min-w-[100px]">创建人</TableHead>
                  <TableHead className="min-w-[100px] sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.quotationNo}</TableCell>
                    <TableCell>{record.leadName}</TableCell>
                    <TableCell>{record.customerEntity}</TableCell>
                    <TableCell>{record.ourEntity}</TableCell>
                    <TableCell>{`¥${record.amount.toLocaleString()}`}</TableCell>
                    <TableCell>{record.validUntil}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.createDate}</TableCell>
                    <TableCell>{record.creator}</TableCell>
                    <TableCell className="sticky right-0 bg-background">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(record)}>
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* 分页 */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-muted-foreground text-sm">
              共 {mockData.length} 条
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详情 Dialog */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-[900px]">
          <DialogHeader>
            <DialogTitle>报价详情</DialogTitle>
          </DialogHeader>
          {selectedQuotation && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">报价单号：</span>
                  <span className="text-sm font-medium">{selectedQuotation.quotationNo}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">线索名称：</span>
                  <span className="text-sm font-medium">{selectedQuotation.leadName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">客户主体：</span>
                  <span className="text-sm font-medium">{selectedQuotation.customerEntity}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">对接主体：</span>
                  <span className="text-sm font-medium">{selectedQuotation.ourEntity}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">报价金额：</span>
                  <span className="text-sm font-medium">{`¥${selectedQuotation.amount.toLocaleString()}`}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">预计成本：</span>
                  <span className="text-sm font-medium">{`¥${selectedQuotation.estimatedCost.toLocaleString()}`}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">预计利润：</span>
                  <span className="text-sm font-medium">{`¥${selectedQuotation.estimatedProfit.toLocaleString()}`}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">创建日期：</span>
                  <span className="text-sm font-medium">{selectedQuotation.createDate}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">创建人：</span>
                  <span className="text-sm font-medium">{selectedQuotation.creator}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">状态：</span>
                  <Badge variant={statusBadgeVariant(selectedQuotation.status)}>
                    {selectedQuotation.status}
                  </Badge>
                </div>
              </div>

              {/* 审批流程 */}
              {selectedQuotation.approvalFlow && selectedQuotation.approvalFlow.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">审批流程</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setWorkflowExpanded(!workflowExpanded)}
                    >
                      {workflowExpanded ? (
                        <>
                          <ChevronDown className="size-4" />
                          收起完整流程
                        </>
                      ) : (
                        <>
                          <ChevronRight className="size-4" />
                          查看完整流程
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="rounded-md border bg-muted/30 p-4 space-y-3">
                    {selectedQuotation.approvalFlow.map((node: any, index: number) => {
                      const isCurrentNode = node.status === 'pending';
                      const isRejectedNode = node.status === 'rejected';
                      const isFirstNode = index === 0;

                      // 默认只显示：发起节点、当前节点、驳回节点
                      const shouldShowByDefault = isFirstNode || isCurrentNode || isRejectedNode;
                      const shouldShow = workflowExpanded || shouldShowByDefault;

                      if (!shouldShow) return null;

                      return (
                        <div
                          key={index}
                          className={`rounded-md p-3 border ${
                            isCurrentNode
                              ? 'bg-yellow-50 border-yellow-400 border-2 dark:bg-yellow-950/30 dark:border-yellow-600'
                              : isRejectedNode
                                ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
                                : 'bg-background border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {node.status === 'approved' && (
                              <CheckCircle className="size-[18px] text-green-600 shrink-0" />
                            )}
                            {node.status === 'rejected' && (
                              <XCircle className="size-[18px] text-red-600 shrink-0" />
                            )}
                            {node.status === 'pending' && (
                              <Clock className="size-[18px] text-orange-600 shrink-0" />
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{node.step}</span>
                                {isCurrentNode && (
                                  <Badge variant="secondary">当前环节</Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                审批人：{node.approver}
                              </div>
                              {node.time && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {node.time}
                                </div>
                              )}
                            </div>

                            <div>
                              {node.status === 'approved' && <Badge variant="default">已通过</Badge>}
                              {node.status === 'rejected' && <Badge variant="destructive">已驳回</Badge>}
                              {node.status === 'pending' && <Badge variant="secondary">待审批</Badge>}
                            </div>
                          </div>

                          {/* 驳回理由高亮显示 */}
                          {isRejectedNode && node.comment && (
                            <div className="mt-2 p-2.5 rounded bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-800">
                              <div className="text-xs font-semibold text-red-600 mb-1">
                                驳回理由
                              </div>
                              <div className="text-xs text-red-700 dark:text-red-400">
                                {node.comment}
                              </div>
                            </div>
                          )}

                          {/* 普通审批意见 */}
                          {!isRejectedNode && node.comment && (
                            <div className="mt-2 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
                              {node.comment}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 附件列表 */}
              {selectedQuotation.attachments && selectedQuotation.attachments.length > 0 && (
                <div>
                  <span className="font-semibold text-sm">附件列表</span>
                  <div className="mt-3 rounded-md border bg-muted/30 p-4 space-y-2">
                    {selectedQuotation.attachments.map((file: any) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded border bg-background px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({file.size})</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`下载附件: ${file.name}`)}
                        >
                          <Download className="size-4" />
                          下载
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 审批按钮栏 */}
              {selectedQuotation.status === '待审批' && (
                <div>
                  <Separator />
                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      size="lg"
                      onClick={() => openApprovalDialog('approve')}
                    >
                      <Check className="size-4" />
                      通过
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => openApprovalDialog('reject')}
                    >
                      <X className="size-4" />
                      不通过
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 审批意见 Dialog */}
      <Dialog open={approvalVisible} onOpenChange={(open) => {
        if (!open) {
          setApprovalVisible(false);
          setApprovalComment('');
          setCommentError('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? '审批通过' : '审批不通过'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="approval-comment">审批意见</Label>
            <Textarea
              id="approval-comment"
              placeholder={
                approvalAction === 'approve'
                  ? '请填写审批意见（如：报价合理，同意报价）'
                  : '请填写不通过的理由（如：报价过高，请重新核算）'
              }
              rows={4}
              value={approvalComment}
              onChange={(e) => {
                setApprovalComment(e.target.value);
                if (commentError) setCommentError('');
              }}
            />
            {commentError && (
              <p className="text-sm text-destructive">{commentError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setApprovalVisible(false);
              setApprovalComment('');
              setCommentError('');
            }}>
              取消
            </Button>
            <Button onClick={handleApprovalSubmit}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
