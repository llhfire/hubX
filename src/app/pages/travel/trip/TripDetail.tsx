import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, DollarSign, Building2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, TripStatus } from '../types';
import { getTripDetail, startTrip, endTrip, closeTrip } from '../travel-api';
import { BasicInfoTab } from './TripDetail/BasicInfoTab';
import { ItineraryTab } from './TripDetail/ItineraryTab';
import { ExpenseTab } from './TripDetail/ExpenseTab';
import { ReimbursementTab } from './TripDetail/ReimbursementTab';
import { LoanTab } from './TripDetail/LoanTab';
import { SubsidyTab } from './TripDetail/SubsidyTab';

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

export function TripDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getTripDetail(id);
      setTrip(data);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 开始出差
  const handleStartTrip = async () => {
    if (!id) return;
    try {
      await startTrip(id);
      toast.success('已标记为进行中');
      loadTrip();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // 结束出差
  const handleEndTrip = async () => {
    if (!id) return;
    try {
      await endTrip(id);
      toast.success('已标记为待报销');
      loadTrip();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // 关闭出差
  const handleCloseTrip = async () => {
    if (!id) return;
    try {
      await closeTrip(id);
      toast.success('差旅已关闭');
      loadTrip();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-muted-foreground">出差单不存在</div>
        <Button variant="outline" onClick={() => navigate('/travel/trips')}>
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/travel/trips')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              出差详情
              <Badge variant={statusConfig[trip.status].variant}>
                {statusConfig[trip.status].text}
              </Badge>
            </h2>
            <div className="text-sm text-muted-foreground">{trip.tripNo}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {trip.status === 'approved' && (
            <Button onClick={handleStartTrip}>开始出差</Button>
          )}
          {trip.status === 'in_progress' && (
            <Button onClick={handleEndTrip}>结束出差</Button>
          )}
          {trip.status === 'to_reimburse' && (
            <Button onClick={handleCloseTrip}>关闭差旅</Button>
          )}
        </div>
      </div>

      {/* 概览信息 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">目的地</div>
                <div className="font-medium">{trip.destinations.join('、')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">出差日期</div>
                <div className="font-medium">{trip.startDate} ~ {trip.endDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">预计费用</div>
                <div className="font-medium">¥{trip.estimatedTotalCost.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">关联客户</div>
                <div className="font-medium">{trip.customerName || '-'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab 内容 */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="itinerary">旅程管理</TabsTrigger>
          <TabsTrigger value="expense">费用管理</TabsTrigger>
          <TabsTrigger value="reimbursement">报销管理</TabsTrigger>
          <TabsTrigger value="loan">借款管理</TabsTrigger>
          <TabsTrigger value="subsidy">差旅补贴</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoTab trip={trip} />
        </TabsContent>

        <TabsContent value="itinerary">
          <ItineraryTab trip={trip} onUpdate={loadTrip} />
        </TabsContent>

        <TabsContent value="expense">
          <ExpenseTab trip={trip} onUpdate={loadTrip} />
        </TabsContent>

        <TabsContent value="reimbursement">
          <ReimbursementTab trip={trip} onUpdate={loadTrip} />
        </TabsContent>

        <TabsContent value="loan">
          <LoanTab trip={trip} onUpdate={loadTrip} />
        </TabsContent>

        <TabsContent value="subsidy">
          <SubsidyTab trip={trip} onUpdate={loadTrip} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
