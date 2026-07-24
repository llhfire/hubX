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
import { Search, Plus, Check, X, DollarSign, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { Loan, LoanStatus } from '../types';
import { getLoanList, approveLoan, payLoan } from '../travel-api';

const statusConfig: Record<LoanStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; text: string }> = {
  draft: { variant: 'outline', text: '草稿' },
  pending: { variant: 'secondary', text: '待审批' },
  approved: { variant: 'default', text: '已通过' },
  paid: { variant: 'default', text: '已打款' },
  offset: { variant: 'default', text: '已冲抵' },
  settled: { variant: 'outline', text: '已结清' },
  rejected: { variant: 'destructive', text: '已拒绝' },
  cancelled: { variant: 'outline', text: '已取消' },
};

export function LoanList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loanList, setLoanList] = useState<Loan[]>([]);
  const [total, setTotal] = useState(0);
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    status: '' as LoanStatus | '',
    startDate: '',
    endDate: '',
  });

  // 审批弹窗
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalComment, setApprovalComment] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // 详情弹窗
  const [detailVisible, setDetailVisible] = useState(false);

  // 加载数据
  const loadLoans = async () => {
    setLoading(true);
    try {
      const result = await getLoanList({
        keyword: searchForm.keyword || undefined,
        status: (searchForm.status as LoanStatus) || undefined,
        startDate: searchForm.startDate || undefined,
        endDate: searchForm.endDate || undefined,
      });
      setLoanList(result.list);
      setTotal(result.total);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  // 搜索
  const handleSearch = () => {
    loadLoans();
  };

  // 重置
  const handleReset = () => {
    setSearchForm({ keyword: '', status: '', startDate: '', endDate: '' });
    loadLoans();
  };

  // 查看详情
  const handleViewDetail = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailVisible(true);
  };

  // 审批
  const handleApprove = async () => {
    if (!approvalComment.trim()) {
      toast.error('请填写审批意见');
      return;
    }
    try {
      await approveLoan(selectedLoan!.id, approvalAction, approvalComment);
      toast.success(`审批${approvalAction === 'approve' ? '通过' : '不通过'}成功`);
      setApprovalVisible(false);
      setApprovalComment('');
      loadLoans();
    } catch (error) {
      toast.error('审批失败');
    }
  };

  // 打款
  const handlePay = async (loan: Loan) => {
    try {
      await payLoan(loan.id);
      toast.success('打款成功');
      loadLoans();
    } catch (error) {
      toast.error('打款失败');
    }
  };

  // 渲染操作按钮
  const renderActions = (loan: Loan) => {
    const actions = [];

    actions.push(
      <Button key="view" variant="link" size="sm" onClick={() => handleViewDetail(loan)}>
        <Eye className="h-4 w-4 mr-1" />
        查看
      </Button>
    );

    // 待审批状态
    if (loan.status === 'pending') {
      actions.push(
        <Button
          key="approve"
          variant="link"
          size="sm"
          onClick={() => {
            setSelectedLoan(loan);
            setApprovalAction('approve');
            setApprovalVisible(true);
          }}
        >
          审批
        </Button>
      );
    }

    // 已通过状态
    if (loan.status === 'approved') {
      actions.push(
        <Button key="pay" variant="link" size="sm" onClick={() => handlePay(loan)}>
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
              placeholder="搜索借款单号/申请人"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.status}
              onValueChange={(value) => setSearchForm({ ...searchForm, status: value as LoanStatus | '' })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="pending">待审批</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="paid">已打款</SelectItem>
                <SelectItem value="offset">已冲抵</SelectItem>
                <SelectItem value="settled">已结清</SelectItem>
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
          <CardTitle>借款申请列表</CardTitle>
          <Button onClick={() => navigate('/travel/loans/new')}>
            <Plus className="mr-2 h-4 w-4" />
            新增借款
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">借款单号</TableHead>
                  <TableHead className="whitespace-nowrap">申请人</TableHead>
                  <TableHead className="whitespace-nowrap">部门</TableHead>
                  <TableHead className="whitespace-nowrap">借款类型</TableHead>
                  <TableHead className="whitespace-nowrap">借款金额</TableHead>
                  <TableHead className="whitespace-nowrap">已冲抵</TableHead>
                  <TableHead className="whitespace-nowrap">剩余金额</TableHead>
                  <TableHead className="whitespace-nowrap">关联出差单</TableHead>
                  <TableHead className="whitespace-nowrap">状态</TableHead>
                  <TableHead className="whitespace-nowrap">创建日期</TableHead>
                  <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : loanList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  loanList.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="whitespace-nowrap font-medium">{loan.loanNo}</TableCell>
                      <TableCell className="whitespace-nowrap">{loan.applicantName}</TableCell>
                      <TableCell className="whitespace-nowrap">{loan.department}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">
                          {loan.type === 'travel' ? '差旅借款' : loan.type === 'petty_cash' ? '备用金' : '其他'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          ¥{loan.amount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {loan.offsetAmount > 0 ? (
                          <span className="text-green-600">¥{loan.offsetAmount.toLocaleString()}</span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        ¥{loan.remainingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{loan.tripNo || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={statusConfig[loan.status].variant}>
                          {statusConfig[loan.status].text}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{loan.createDate}</TableCell>
                      <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                        <div className="flex items-center gap-1">
                          {renderActions(loan)}
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
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>借款申请详情</DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">借款单号</span>
                  <div className="font-medium">{selectedLoan.loanNo}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">申请人</span>
                  <div className="font-medium">{selectedLoan.applicantName}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">部门</span>
                  <div className="font-medium">{selectedLoan.department}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">借款类型</span>
                  <div className="font-medium">
                    {selectedLoan.type === 'travel' ? '差旅借款' : selectedLoan.type === 'petty_cash' ? '备用金' : '其他'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">借款金额</span>
                  <div className="font-medium text-primary">¥{selectedLoan.amount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">已冲抵</span>
                  <div className="font-medium">
                    {selectedLoan.offsetAmount > 0 ? (
                      <span className="text-green-600">¥{selectedLoan.offsetAmount.toLocaleString()}</span>
                    ) : '¥0'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">剩余金额</span>
                  <div className="font-medium text-orange-600">¥{selectedLoan.remainingAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">关联出差单</span>
                  <div className="font-medium">{selectedLoan.tripNo || '-'}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">借款理由</span>
                  <div className="font-medium">{selectedLoan.reason}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">打款方式</span>
                  <div className="font-medium">
                    {selectedLoan.payMethod === 'bank' ? '银行转账' : selectedLoan.payMethod === 'cash' ? '现金' : '其他'}
                  </div>
                </div>
              </div>

              {/* 审批按钮 */}
              {selectedLoan.status === 'pending' && (
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
                    ? '请填写审批意见（如：同意借款）'
                    : '请填写不通过的理由（如：借款金额过大，请重新评估）'
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
