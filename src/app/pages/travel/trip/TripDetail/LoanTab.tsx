import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/table';
import { Plus, Eye, DollarSign, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, Loan, LoanStatus } from '../../types';
import { getLoanList } from '../../travel-api';

interface LoanTabProps {
  trip: Trip;
  onUpdate: () => void;
}

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

export function LoanTab({ trip, onUpdate }: LoanTabProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    loadLoans();
  }, [trip.id]);

  const loadLoans = async () => {
    setLoading(true);
    try {
      const result = await getLoanList({ tripId: trip.id });
      setLoans(result.list);
    } catch (error) {
      toast.error('加载借款数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 新建借款
  const handleCreate = () => {
    navigate(`/travel/loans/new?tripId=${trip.id}`);
  };

  // 查看详情
  const handleViewDetail = (loan: Loan) => {
    toast.info(`查看借款详情: ${loan.loanNo}`);
  };

  // 计算汇总
  const totalLoanAmount = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalOffsetAmount = loans.reduce((sum, l) => sum + l.offsetAmount, 0);
  const totalRemaining = loans.reduce((sum, l) => sum + l.remainingAmount, 0);

  return (
    <div className="space-y-4">
      {/* 汇总信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">借款总额</div>
            <div className="text-2xl font-bold">¥{totalLoanAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">已冲抵金额</div>
            <div className="text-2xl font-bold text-green-600">¥{totalOffsetAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">剩余未冲抵</div>
            <div className="text-2xl font-bold text-orange-600">¥{totalRemaining.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* 借款列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>借款记录</CardTitle>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新增借款
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">借款单号</TableHead>
                <TableHead className="whitespace-nowrap">借款类型</TableHead>
                <TableHead className="whitespace-nowrap">借款金额</TableHead>
                <TableHead className="whitespace-nowrap">已冲抵</TableHead>
                <TableHead className="whitespace-nowrap">剩余金额</TableHead>
                <TableHead className="whitespace-nowrap">状态</TableHead>
                <TableHead className="whitespace-nowrap">创建日期</TableHead>
                <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无借款记录
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="whitespace-nowrap font-medium">{loan.loanNo}</TableCell>
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
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={statusConfig[loan.status].variant}>
                        {statusConfig[loan.status].text}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{loan.createDate}</TableCell>
                    <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                      <Button variant="link" size="sm" onClick={() => handleViewDetail(loan)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* 冲抵记录 */}
          {loans.some(l => l.offsets && l.offsets.length > 0) && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">冲抵记录</h4>
              <div className="space-y-2">
                {loans.map(loan =>
                  loan.offsets?.map(offset => (
                    <div key={offset.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{offset.loanNo}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{offset.reimbursementId}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{offset.offsetDate}</span>
                        <span className="font-medium text-green-600">¥{offset.offsetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
