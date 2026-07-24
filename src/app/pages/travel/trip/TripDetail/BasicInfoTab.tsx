import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { CheckCircle, XCircle, Clock, User, MapPin, Calendar, DollarSign, Building2, Briefcase } from 'lucide-react';
import type { Trip } from '../../types';

interface BasicInfoTabProps {
  trip: Trip;
}

const approvalStatusConfig = {
  approved: { icon: CheckCircle, color: 'text-green-600', badge: '已通过', badgeVariant: 'default' as const },
  rejected: { icon: XCircle, color: 'text-red-600', badge: '已驳回', badgeVariant: 'destructive' as const },
  pending: { icon: Clock, color: 'text-orange-600', badge: '待审批', badgeVariant: 'secondary' as const },
};

export function BasicInfoTab({ trip }: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>申请信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">出差单号</div>
              <div className="font-medium">{trip.tripNo}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">申请人</div>
              <div className="font-medium flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                {trip.applicantName}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">部门</div>
              <div className="font-medium">{trip.department}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">创建日期</div>
              <div className="font-medium">{trip.createDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">关联客户</div>
              <div className="font-medium flex items-center gap-1">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {trip.customerName || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">关联项目</div>
              <div className="font-medium flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {trip.projectName || '-'}
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <div className="text-sm text-muted-foreground mb-2">出差目的</div>
            <div className="p-3 bg-muted rounded-md">{trip.purpose}</div>
          </div>
        </CardContent>
      </Card>

      {/* 行程信息 */}
      <Card>
        <CardHeader>
          <CardTitle>行程信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">目的地</div>
              <div className="font-medium flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {trip.destinations.join('、')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">出差天数</div>
              <div className="font-medium">{trip.days}天</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">出发日期</div>
              <div className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {trip.startDate}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">返回日期</div>
              <div className="font-medium">{trip.endDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">交通方式</div>
              <div className="font-medium">
                {trip.transportModes.map(mode => {
                  const modeMap: Record<string, string> = {
                    high_speed_rail: '高铁',
                    bullet_train: '动车',
                    airplane: '飞机',
                    self_drive: '自驾',
                    bus: '大巴',
                    ferry: '轮船',
                    other: '其他',
                  };
                  return modeMap[mode] || mode;
                }).join('、') || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">住宿意向</div>
              <div className="font-medium">
                {trip.accommodationIntent === 'hotel' ? '酒店' : trip.accommodationIntent === 'dormitory' ? '公司宿舍' : '无住宿'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 费用预估 */}
      <Card>
        <CardHeader>
          <CardTitle>费用预估</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">预计交通费</div>
              <div className="font-medium">¥{trip.estimatedTransportCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">预计住宿费</div>
              <div className="font-medium">¥{trip.estimatedAccommodationCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">预计餐饮费</div>
              <div className="font-medium">¥{trip.estimatedMealCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">预计其他费用</div>
              <div className="font-medium">¥{trip.estimatedOtherCost.toLocaleString()}</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">预计总费用</div>
              <div className="text-2xl font-bold">¥{trip.estimatedTotalCost.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 审批流程 */}
      {trip.approvalRecords && trip.approvalRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>审批流程</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trip.approvalRecords.map((record, index) => {
                const config = approvalStatusConfig[record.status];
                const Icon = config.icon;
                return (
                  <div
                    key={record.id}
                    className={`p-3 rounded-md border ${
                      record.status === 'pending'
                        ? 'bg-yellow-50 border-yellow-400'
                        : record.status === 'rejected'
                          ? 'bg-red-50 border-red-300'
                          : 'bg-background border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{record.step}</span>
                          {record.status === 'pending' && (
                            <Badge variant="secondary" className="text-xs">当前环节</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          审批人：{record.approver}
                        </div>
                        {record.time && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {record.time}
                          </div>
                        )}
                      </div>
                      <Badge variant={config.badgeVariant} className="text-xs">
                        {config.badge}
                      </Badge>
                    </div>
                    {record.comment && (
                      <div className={`mt-2 p-2 rounded-md text-sm ${
                        record.status === 'rejected'
                          ? 'bg-red-50 border border-red-300 text-red-700'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {record.status === 'rejected' && (
                          <div className="text-xs font-semibold text-red-600 mb-1">驳回理由</div>
                        )}
                        {record.comment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
