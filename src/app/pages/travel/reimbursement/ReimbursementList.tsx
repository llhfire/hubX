import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Search, Plus, Check, X, DollarSign, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { Reimbursement, ReimbursementStatus } from '../types';
import { getReimbursementList, approveReimbursement, payReimbursement } from '../travel-api';

const statusConfig: Record<ReimbursementStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; text: string }> = {
  draft: { variant: 'outline', text: '草稿' },
  pending: { variant: 'secondary', text: '待审批' },
  dept_approved: { variant: 'default', text: '部门已审' },
  finance_approved: { variant: 'default', text: '财务已审' },
  paid: { variant: 'default', text: '已打款' },
  completed: { variant: 'outline', text: '已完成' },
  rejected: { variant: 'destructive', text: '已拒绝' },
};

export function ReimbursementList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reimbursementList, setReimbursementList] = useState<Reimbursement[]>([]);
  const [total, setTotal] = useState(0);
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    status: '' as ReimbursementStatus | '',
    startDate: '',
    endDate: '',
  });

  // 审批弹窗
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalComment, setApprovalComment] = useState('');
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);

  // 详情弹窗
  const [detailVisible, setDetailVisible] = useState(false);

  // 加载数据
  const loadReimbursements = async () => {
    setLoading(true);
    try {
      const result = await getReimbursementList({
        keyword: searchForm.keyword || undefined,
        status: (searchForm.status as ReimbursementStatus) || undefined,
        startDate: searchForm.startDate || undefined,
        endDate: searchForm.endDate || undefined,
      });
      setReimbursementList(result.list);
      setTotal(result.total);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReimbursements();
  }, []);

  // 搜索
  const handleSearch = () => {
    loadReimbursements();
  };

  // 重置
  const handleReset = () => {
    setSearchForm({ keyword: '', status: '', startDate: '', endDate: '' });
    loadReimbursements();
  };

  // 查看详情
  const handleViewDetail = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setDetailVisible(true);
  };

  // 审批
  const handleApprove = async () => {
    if (!approvalComment.trim()) {
      toast.error('请填写审批意见');
      return;
    }
    try {
      await approveReimbursement(selectedReimbursement!.id, approvalAction, approvalComment);
      toast.success(`审批${approvalAction === 'approve' ? '通过' : '不通过'}成功`);
      setApprovalVisible(false);
      setApprovalComment('');
      loadReimbursements();
    } catch (error) {
      toast.error('审批失败');
    }
  };

  // 打款
  const handlePay = async (reimbursement: Reimbursement) => {
    try {
      await payReimbursement(reimbursement.id);
      toast.success('打款成功');
      loadReimbursements();
    } catch (error) {
      toast.error('打款失败');
    }
  };

  // 渲染操作按钮
  const renderActions = (reimbursement: Reimbursement) => {
    const actions = [];

    actions.push(
      <Button key="view" variant="link" size="sm" onClick={() => handleViewDetail(reimbursement)}>
        <Eye className="h-4 w-4 mr-1" />
        查看
      </Button>
    );

    // 待审批状态
    if (reimbursement.status === 'pending') {
      actions.push(
        <Button
          key="approve"
          variant="link"
          size="sm"
          onClick={() => {
            setSelectedReimbursement(reimbursement);
            setApprovalAction('approve');
            setApprovalVisible(true);
          }}
        >
          审批
        </Button>
      );
    }

    // 财务已审状态
    if (reimbursement.status === 'finance_approved') {
      actions.push(
        <Button key="pay" variant="link" size="sm" onClick={() => handlePay(reimbursement)}>
          打款
        </Button>
      );
    }

    return actions;
  };

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              className="w-[200px]"
              placeholder="搜索报销单号/申请人"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.status}
              onValueChange={(value) => setSearchForm({ ...searchForm, status: value as ReimbursementStatus | '' })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="pending">待审批</SelectItem>
                <SelectItem value="dept_approved">部门已审</SelectItem>
                <SelectItem value="finance_approved">财务已审</SelectItem>
                <SelectItem value="paid">已打款</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-[140px]"
              value={searchForm.startDate}
              onChange={(e) => setSearchForm({ ...searchForm, startDate: e.target.value })}
            />
            <Input
              type="date"
              className="w-[140px]"
              value={searchForm.endDate}
              onChange={(e) => setSearchForm({ ...searchForm, endDate: e.target.value })}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>报销申请列表</CardTitle>
          <Button onClick={() => navigate('/travel/reimbursements/new')}>
            <Plus className="mr-2 h-4 w-4" />
            新增报销
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">报销单号</TableHead>
                  <TableHead className="whitespace-nowrap">关联出差单</TableHead>
                  <TableHead className="whitespace-nowrap">申请人</TableHead>
                  <TableHead className="whitespace-nowrap">部门</TableHead>
                  <TableHead className="whitespace-nowrap">报销金额</TableHead>
                  <TableHead className="whitespace-nowrap">冲抵借款</TableHead>
                  <TableHead className="whitespace-nowrap">实付金额</TableHead>
                  <TableHead className="whitespace-nowrap">状态</TableHead>
                  <TableHead className="whitespace-nowrap">创建日期</TableHead>
                  <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : reimbursementList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  reimbursementList.map((reb) => (
                    <TableRow key={reb.id}>
                      <TableCell className="whitespace-nowrap font-medium">{reb.reimbursementNo}</TableCell>
                      <TableCell className="whitespace-nowrap">{reb.tripNo}</TableCell>
                      <TableCell className="whitespace-nowrap">{reb.applicantName}</TableCell>
                      <TableCell className="whitespace-nowrap">{reb.department}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          ¥{reb.totalAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {reb.offsetAmount > 0 ? (
                          <span className="text-orange-600">-¥{reb.offsetAmount.toLocaleString()}</span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        ¥{reb.netAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={statusConfig[reb.status].variant}>
                          {statusConfig[reb.status].text}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{reb.createDate}</TableCell>
                      <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                        <div className="flex items-center gap-1">
                          {renderActions(reb)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
            共 {total} 条记录
          </div>
        </CardContent>
      </Card>

      {/* 详情弹窗 */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>报销申请详情</DialogTitle>
          </DialogHeader>
          {selectedReimbursement && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">报销单号</span>
                  <div className="font-medium">{selectedReimbursement.reimbursementNo}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">关联出差单</span>
                  <div className="font-medium">{selectedReimbursement.tripNo}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">申请人</span>
                  <div className="font-medium">{selectedReimbursement.applicantName}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">部门</span>
                  <div className="font-medium">{selectedReimbursement.department}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">报销金额</span>
                  <div className="font-medium">¥{selectedReimbursement.totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">冲抵借款</span>
                  <div className="font-medium">
                    {selectedReimbursement.offsetAmount > 0 ? (
                      <span className="text-orange-600">-¥{selectedReimbursement.offsetAmount.toLocaleString()}</span>
                    ) : '¥0'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">实付金额</span>
                  <div className="font-medium text-primary">¥{selectedReimbursement.netAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">状态</span>
                  <div>
                    <Badge variant={statusConfig[selectedReimbursement.status].variant}>
                      {statusConfig[selectedReimbursement.status].text}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 费用明细 */}
              <div>
                <div className="font-semibold mb-3">费用明细</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">费用类型</TableHead>
                      <TableHead className="whitespace-nowrap">说明</TableHead>
                      <TableHead className="whitespace-nowrap">关联旅程段</TableHead>
                      <TableHead className="whitespace-nowrap text-right">金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReimbursement.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline">{item.expenseType}</Badge>
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.itinerarySegmentDesc}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          ¥{item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">合计</TableCell>
                      <TableCell className="text-right font-semibold">
                        ¥{selectedReimbursement.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 附件 */}
              {selectedReimbursement.attachments && selectedReimbursement.attachments.length > 0 && (
                <div>
                  <div className="font-semibold mb-3">附件列表</div>
                  <div className="space-y-2">
                    {selectedReimbursement.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({file.size})</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 审批按钮 */}
              {selectedReimbursement.status === 'pending' && (
                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setApprovalAction('approve');
                      setApprovalVisible(true);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    通过
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setApprovalAction('reject');
                      setApprovalVisible(true);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    不通过
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 审批弹窗 */}
      <Dialog open={approvalVisible} onOpenChange={setApprovalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? '审批通过' : '审批不通过'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>审批意见</Label>
              <Textarea
                placeholder={
                  approvalAction === 'approve'
                    ? '请填写审批意见（如：费用合理，同意报销）'
                    : '请填写不通过的理由（如：费用超标，请重新核算）'
                }
                rows={4}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setApprovalVisible(false);
              setApprovalComment('');
            }}>
              取消
            </Button>
            <Button onClick={handleApprove}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
