import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/table';
import { Plus, Eye, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, Reimbursement, ReimbursementStatus } from '../../types';
import { getReimbursementList } from '../../travel-api';

interface ReimbursementTabProps {
  trip: Trip;
  onUpdate: () => void;
}

const statusConfig: Record<ReimbursementStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; text: string }> = {
  draft: { variant: 'outline', text: '草稿' },
  pending: { variant: 'secondary', text: '待审批' },
  dept_approved: { variant: 'default', text: '部门已审' },
  finance_approved: { variant: 'default', text: '财务已审' },
  paid: { variant: 'default', text: '已打款' },
  completed: { variant: 'outline', text: '已完成' },
  rejected: { variant: 'destructive', text: '已拒绝' },
};

export function ReimbursementTab({ trip, onUpdate }: ReimbursementTabProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

  useEffect(() => {
    loadReimbursements();
  }, [trip.id]);

  const loadReimbursements = async () => {
    setLoading(true);
    try {
      const result = await getReimbursementList({ tripId: trip.id });
      setReimbursements(result.list);
    } catch (error) {
      toast.error('加载报销数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 新建报销
  const handleCreate = () => {
    navigate(`/travel/reimbursements/new?tripId=${trip.id}`);
  };

  // 查看详情
  const handleViewDetail = (reimbursement: Reimbursement) => {
    // 打开详情弹窗或跳转
    toast.info(`查看报销详情: ${reimbursement.reimbursementNo}`);
  };

  // 计算汇总
  const totalReimbursed = reimbursements
    .filter(r => r.status === 'completed' || r.status === 'paid')
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const pendingAmount = reimbursements
    .filter(r => r.status === 'pending' || r.status === 'dept_approved' || r.status === 'finance_approved')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="space-y-4">
      {/* 汇总信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">报销总额</div>
            <div className="text-2xl font-bold">¥{totalReimbursed.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">待审批金额</div>
            <div className="text-2xl font-bold text-orange-600">¥{pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">报销单数</div>
            <div className="text-2xl font-bold">{reimbursements.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* 报销列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>报销记录</CardTitle>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新增报销
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">报销单号</TableHead>
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
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : reimbursements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    暂无报销记录
                  </TableCell>
                </TableRow>
              ) : (
                reimbursements.map((reb) => (
                  <TableRow key={reb.id}>
                    <TableCell className="whitespace-nowrap font-medium">{reb.reimbursementNo}</TableCell>
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
                      <Button variant="link" size="sm" onClick={() => handleViewDetail(reb)}>
                        <Eye className="h-4 w-4 mr-1" />
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
