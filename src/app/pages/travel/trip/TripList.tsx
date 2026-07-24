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
import { Search, Plus, Check, X, MapPin, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, TripStatus } from '../types';
import { getTripList, submitTrip, approveTrip, startTrip, endTrip, deleteTrip } from '../travel-api';

const statusConfig: Record<TripStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; text: string }> = {
  draft: { variant: 'outline', text: '草稿' },
  pending: { variant: 'secondary', text: '待审批' },
  approved: { variant: 'default', text: '已通过' },
  in_progress: { variant: 'default', text: '进行中' },
  to_reimburse: { variant: 'secondary', text: '待报销' },
  closed: { variant: 'outline', text: '已关闭' },
  rejected: { variant: 'destructive', text: '已拒绝' },
  cancelled: { variant: 'outline', text: '已取消' },
};

export function TripList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tripList, setTripList] = useState<Trip[]>([]);
  const [total, setTotal] = useState(0);
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    status: '' as TripStatus | '',
    startDate: '',
    endDate: '',
  });

  // 审批弹窗
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalComment, setApprovalComment] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // 加载数据
  const loadTrips = async () => {
    setLoading(true);
    try {
      const result = await getTripList({
        keyword: searchForm.keyword || undefined,
        status: (searchForm.status as TripStatus) || undefined,
        startDate: searchForm.startDate || undefined,
        endDate: searchForm.endDate || undefined,
      });
      setTripList(result.list);
      setTotal(result.total);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // 搜索
  const handleSearch = () => {
    loadTrips();
  };

  // 重置
  const handleReset = () => {
    setSearchForm({ keyword: '', status: '', startDate: '', endDate: '' });
    loadTrips();
  };

  // 新建出差申请
  const handleCreate = () => {
    navigate('/travel/trips/new');
  };

  // 查看详情
  const handleViewDetail = (trip: Trip) => {
    navigate(`/travel/trips/${trip.id}`);
  };

  // 提交申请
  const handleSubmit = async (trip: Trip) => {
    try {
      await submitTrip(trip.id);
      toast.success('出差申请已提交');
      loadTrips();
    } catch (error) {
      toast.error('提交失败');
    }
  };

  // 审批
  const handleApprove = async () => {
    if (!approvalComment.trim()) {
      toast.error('请填写审批意见');
      return;
    }
    try {
      await approveTrip(selectedTrip!.id, approvalAction, approvalComment);
      toast.success(`审批${approvalAction === 'approve' ? '通过' : '不通过'}成功`);
      setApprovalVisible(false);
      setApprovalComment('');
      loadTrips();
    } catch (error) {
      toast.error('审批失败');
    }
  };

  // 开始出差
  const handleStartTrip = async (trip: Trip) => {
    try {
      await startTrip(trip.id);
      toast.success('已标记为进行中');
      loadTrips();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // 结束出差
  const handleEndTrip = async (trip: Trip) => {
    try {
      await endTrip(trip.id);
      toast.success('已标记为待报销');
      loadTrips();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // 删除
  const handleDelete = async (trip: Trip) => {
    try {
      await deleteTrip(trip.id);
      toast.success('删除成功');
      loadTrips();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  // 渲染操作按钮
  const renderActions = (trip: Trip) => {
    const actions = [];

    // 查看详情（始终显示）
    actions.push(
      <Button key="view" variant="link" size="sm" onClick={() => handleViewDetail(trip)}>
        查看详情
      </Button>
    );

    // 草稿状态
    if (trip.status === 'draft') {
      actions.push(
        <Button key="submit" variant="link" size="sm" onClick={() => handleSubmit(trip)}>
          提交
        </Button>
      );
      actions.push(
        <Button key="delete" variant="link" size="sm" className="text-destructive" onClick={() => handleDelete(trip)}>
          删除
        </Button>
      );
    }

    // 待审批状态（管理员/审批人视角）
    if (trip.status === 'pending') {
      actions.push(
        <Button
          key="approve"
          variant="link"
          size="sm"
          onClick={() => {
            setSelectedTrip(trip);
            setApprovalAction('approve');
            setApprovalVisible(true);
          }}
        >
          审批
        </Button>
      );
    }

    // 已通过状态
    if (trip.status === 'approved') {
      actions.push(
        <Button key="start" variant="link" size="sm" onClick={() => handleStartTrip(trip)}>
          开始出差
        </Button>
      );
    }

    // 进行中状态
    if (trip.status === 'in_progress') {
      actions.push(
        <Button key="end" variant="link" size="sm" onClick={() => handleEndTrip(trip)}>
          结束出差
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
              placeholder="搜索出差单号/申请人/目的地"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.status}
              onValueChange={(value) => setSearchForm({ ...searchForm, status: value as TripStatus | '' })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="pending">待审批</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="in_progress">进行中</SelectItem>
                <SelectItem value="to_reimburse">待报销</SelectItem>
                <SelectItem value="closed">已关闭</SelectItem>
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
          <CardTitle>出差申请列表</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新建出差申请
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">出差单号</TableHead>
                  <TableHead className="whitespace-nowrap">申请人</TableHead>
                  <TableHead className="whitespace-nowrap">部门</TableHead>
                  <TableHead className="whitespace-nowrap">目的地</TableHead>
                  <TableHead className="whitespace-nowrap">出发日期</TableHead>
                  <TableHead className="whitespace-nowrap">返回日期</TableHead>
                  <TableHead className="whitespace-nowrap">天数</TableHead>
                  <TableHead className="whitespace-nowrap">关联客户</TableHead>
                  <TableHead className="whitespace-nowrap">关联项目</TableHead>
                  <TableHead className="whitespace-nowrap">预计费用</TableHead>
                  <TableHead className="whitespace-nowrap">状态</TableHead>
                  <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : tripList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  tripList.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="whitespace-nowrap font-medium">{trip.tripNo}</TableCell>
                      <TableCell className="whitespace-nowrap">{trip.applicantName}</TableCell>
                      <TableCell className="whitespace-nowrap">{trip.department}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {trip.destinations.join('、')}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {trip.startDate}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{trip.endDate}</TableCell>
                      <TableCell className="whitespace-nowrap">{trip.days}天</TableCell>
                      <TableCell className="whitespace-nowrap">{trip.customerName || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{trip.projectName || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          ¥{trip.estimatedTotalCost.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={statusConfig[trip.status].variant}>
                          {statusConfig[trip.status].text}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                        <div className="flex items-center gap-1">
                          {renderActions(trip)}
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

      {/* 审批弹窗 */}
      <Dialog open={approvalVisible} onOpenChange={setApprovalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? '审批通过' : '审批不通过'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTrip && (
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm">
                  <span className="font-medium">{selectedTrip.applicantName}</span> 的出差申请
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  目的地：{selectedTrip.destinations.join('、')} | 日期：{selectedTrip.startDate} ~ {selectedTrip.endDate}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>审批意见</Label>
              <Textarea
                placeholder={
                  approvalAction === 'approve'
                    ? '请填写审批意见（如：同意出差申请）'
                    : '请填写不通过的理由（如：出差计划不合理，请重新调整）'
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
