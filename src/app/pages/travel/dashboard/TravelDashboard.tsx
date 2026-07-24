import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { DollarSign, TrendingUp, MapPin, Users, Plane, Building2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { getPersonalTravelStats, getDepartmentTravelStats, getProjectTravelStats, getExpenseAnalysis } from '../travel-api';

export function TravelDashboard() {
  const [loading, setLoading] = useState(false);
  const [personalStats, setPersonalStats] = useState<any>(null);
  const [deptStats, setDeptStats] = useState<any>(null);
  const [projectStats, setProjectStats] = useState<any>(null);
  const [expenseAnalysis, setExpenseAnalysis] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [personal, dept, project, analysis] = await Promise.all([
        getPersonalTravelStats('emp-001'),
        getDepartmentTravelStats('销售部'),
        getProjectTravelStats('proj-001'),
        getExpenseAnalysis(),
      ]);
      setPersonalStats(personal);
      setDeptStats(dept);
      setProjectStats(project);
      setExpenseAnalysis(analysis);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">个人看板</TabsTrigger>
          <TabsTrigger value="department">部门看板</TabsTrigger>
          <TabsTrigger value="project">项目看板</TabsTrigger>
          <TabsTrigger value="analysis">费用分析</TabsTrigger>
        </TabsList>

        {/* 个人看板 */}
        <TabsContent value="personal">
          {personalStats && (
            <div className="space-y-4">
              {/* 概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Plane className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">出差次数</div>
                        <div className="text-2xl font-bold">{personalStats.tripCount}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">出差天数</div>
                        <div className="text-2xl font-bold">{personalStats.totalDays}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">差旅费用</div>
                        <div className="text-2xl font-bold">¥{personalStats.totalExpense.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">差旅补贴</div>
                        <div className="text-2xl font-bold">¥{personalStats.totalSubsidy.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 待处理事项 */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">待报销金额</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      ¥{personalStats.pendingReimbursement.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">请及时提交报销申请</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">未结清借款</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      ¥{personalStats.unsettledLoan.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">请尽快冲抵借款</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 部门看板 */}
        <TabsContent value="department">
          {deptStats && (
            <div className="space-y-4">
              {/* 概览卡片 */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">出差次数</div>
                    <div className="text-2xl font-bold">{deptStats.tripCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">差旅费用总计</div>
                    <div className="text-2xl font-bold">¥{deptStats.totalExpense.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">人均差旅费用</div>
                    <div className="text-2xl font-bold">¥{deptStats.avgExpensePerPerson.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* 费用分布 */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">费用类型分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deptStats.expenseByType.map((item: any) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <span className="text-sm">{item.type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(item.amount / deptStats.totalExpense) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-20 text-right">
                              ¥{item.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">城市费用分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deptStats.expenseByCity.map((item: any) => (
                        <div key={item.city} className="flex items-center justify-between">
                          <span className="text-sm">{item.city}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(item.amount / deptStats.totalExpense) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-20 text-right">
                              ¥{item.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 月度趋势 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">月度差旅费用趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-4 h-48">
                    {deptStats.monthlyTrend.map((item: any) => {
                      const maxAmount = Math.max(...deptStats.monthlyTrend.map((t: any) => t.amount));
                      const height = (item.amount / maxAmount) * 100;
                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-sm font-medium">¥{item.amount.toLocaleString()}</div>
                          <div
                            className="w-full bg-primary rounded-t-md"
                            style={{ height: `${height}%` }}
                          />
                          <div className="text-sm text-muted-foreground">{item.month}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* 项目看板 */}
        <TabsContent value="project">
          {projectStats && (
            <div className="space-y-4">
              {/* 概览卡片 */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">差旅费用总计</div>
                    <div className="text-2xl font-bold">¥{projectStats.totalExpense.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">占项目成本比例</div>
                    <div className="text-2xl font-bold">{(projectStats.costRatio * 100).toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">出差人次</div>
                    <div className="text-2xl font-bold">{projectStats.tripCount}</div>
                  </CardContent>
                </Card>
              </div>

              {/* 费用分布 */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">旅程段费用分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projectStats.expenseBySegment.map((item: any) => (
                        <div key={item.segment} className="flex items-center justify-between">
                          <span className="text-sm">{item.segment}</span>
                          <span className="text-sm font-medium">¥{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">人员费用分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projectStats.expenseByPerson.map((item: any) => (
                        <div key={item.person} className="flex items-center justify-between">
                          <span className="text-sm">{item.person}</span>
                          <span className="text-sm font-medium">¥{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 费用分析 */}
        <TabsContent value="analysis">
          {expenseAnalysis && (
            <div className="space-y-4">
              {/* 概览卡片 */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">总费用</div>
                    <div className="text-2xl font-bold">¥{expenseAnalysis.totalExpense.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">平均费用</div>
                    <div className="text-2xl font-bold">¥{expenseAnalysis.avgExpense.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">最高费用</div>
                    <div className="text-2xl font-bold">¥{expenseAnalysis.maxExpense.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* 交通方式分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">交通方式分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {expenseAnalysis.transportDistribution.map((item: any) => (
                      <div key={item.mode} className="text-center p-4 bg-muted rounded-md">
                        <div className="text-2xl font-bold">{item.count}</div>
                        <div className="text-sm text-muted-foreground">{item.mode}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 住宿分析 */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">住宿分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">平均住宿费用/晚</span>
                        <span className="font-medium">¥{expenseAnalysis.avgAccommodationCost}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">酒店占比</span>
                        <span className="font-medium">{expenseAnalysis.hotelVsDormitory.hotel}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">宿舍占比</span>
                        <span className="font-medium">{expenseAnalysis.hotelVsDormitory.dormitory}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">超标分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">超标次数</span>
                        <span className="font-medium text-destructive">{expenseAnalysis.overStandardCount}次</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">超标金额</span>
                        <span className="font-medium text-destructive">¥{expenseAnalysis.overStandardAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">超标原因</div>
                        {expenseAnalysis.overStandardReasons.map((item: any) => (
                          <div key={item.reason} className="flex items-center justify-between text-sm">
                            <span>{item.reason}</span>
                            <span>{item.count}次</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
