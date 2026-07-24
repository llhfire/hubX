import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { Calculator, DollarSign, Calendar, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, TravelSubsidy } from '../../types';
import { calculateSubsidy } from '../../travel-api';

interface SubsidyTabProps {
  trip: Trip;
  onUpdate: () => void;
}

export function SubsidyTab({ trip, onUpdate }: SubsidyTabProps) {
  const [loading, setLoading] = useState(false);
  const [subsidy, setSubsidy] = useState<TravelSubsidy | null>(trip.subsidy || null);

  useEffect(() => {
    if (!subsidy) {
      loadSubsidy();
    }
  }, [trip.id]);

  const loadSubsidy = async () => {
    setLoading(true);
    try {
      const data = await calculateSubsidy(trip.id);
      setSubsidy(data);
    } catch (error) {
      toast.error('计算补贴失败');
    } finally {
      setLoading(false);
    }
  };

  // 重新计算
  const handleRecalculate = async () => {
    setLoading(true);
    try {
      const data = await calculateSubsidy(trip.id);
      setSubsidy(data);
      toast.success('补贴已重新计算');
    } catch (error) {
      toast.error('计算失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !subsidy) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">计算中...</div>
      </div>
    );
  }

  if (!subsidy) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground mb-4">暂无补贴数据</div>
            <Button onClick={handleRecalculate}>
              <Calculator className="mr-2 h-4 w-4" />
              计算补贴
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 补贴总额 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">差旅补贴总额</div>
              <div className="text-3xl font-bold text-primary">¥{subsidy.totalAmount.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <Badge variant={subsidy.isPaid ? 'default' : 'secondary'}>
                {subsidy.isPaid ? '已发放' : '待发放'}
              </Badge>
              {subsidy.isPaid && subsidy.paidWithSalary && (
                <div className="text-sm text-muted-foreground mt-1">
                  随 {subsidy.paidWithSalary} 工资发放
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 计算明细 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>计算明细</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRecalculate} disabled={loading}>
            <Calculator className="mr-2 h-4 w-4" />
            重新计算
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">计算模式</div>
                <div className="font-medium">
                  {subsidy.calcMode === 'calendar_day' ? '按自然日' : '按实际工作日'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">补贴标准</div>
                <div className="font-medium">¥{subsidy.standard}/天</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">补贴天数</div>
                <div className="font-medium">{subsidy.days}天</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">城市等级</div>
                <div className="font-medium">
                  {subsidy.cityLevel === 'first_tier' ? '一线城市' :
                   subsidy.cityLevel === 'second_tier' ? '二线城市' :
                   subsidy.cityLevel === 'third_tier' ? '三线城市' : '其他'}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 工作日详情（按工作日计算时显示） */}
          {subsidy.calcMode === 'working_day' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">工作日</div>
                  <div className="font-medium">{subsidy.workingDays || 0}天</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">加班工作日</div>
                  <div className="font-medium">{subsidy.overtimeDays || 0}天</div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* 计算公式 */}
          <div className="p-4 bg-muted rounded-md">
            <div className="text-sm text-muted-foreground mb-2">计算公式</div>
            <div className="font-mono">
              {subsidy.calcMode === 'calendar_day' ? (
                <>
                  补贴金额 = 补贴标准 × 自然日天数
                  <br />
                  = ¥{subsidy.standard} × {subsidy.days}天
                  <br />
                  = <span className="font-bold text-primary">¥{subsidy.totalAmount.toLocaleString()}</span>
                </>
              ) : (
                <>
                  补贴金额 = 补贴标准 × (工作日 + 加班工作日)
                  <br />
                  = ¥{subsidy.standard} × ({subsidy.workingDays || 0} + {subsidy.overtimeDays || 0})天
                  <br />
                  = ¥{subsidy.standard} × {subsidy.days}天
                  <br />
                  = <span className="font-bold text-primary">¥{subsidy.totalAmount.toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 发放说明 */}
      <Card>
        <CardHeader>
          <CardTitle>发放说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• 差旅补贴将随当月工资一起发放</p>
            <p>• 补贴金额不计入工资基数，作为独立津贴发放</p>
            <p>• 出差单关闭后，补贴金额自动汇总到当月工资</p>
            <p>• 如有疑问，请联系财务部门</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
