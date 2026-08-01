import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  mockCases,
  mockDashboardData,
  CaseStatus,
  HealthStatus,
  caseStatusMap,
  healthStatusMap,
} from '../mockData';

export default function Dashboard() {
  const navigate = useNavigate();

  // 统计数据
  const statistics = useMemo(() => {
    const totalCases = mockCases.length;
    const inProgressCases = mockCases.filter((c) => c.status === CaseStatus.IN_PROGRESS).length;
    const completedCases = mockCases.filter((c) => c.status === CaseStatus.COMPLETED).length;
    const alertCases = mockCases.filter(
      (c) => c.healthStatus === HealthStatus.YELLOW || c.healthStatus === HealthStatus.RED
    ).length;

    const totalRevenue = mockCases.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
    const totalCost = mockCases.reduce((sum, c) => sum + (c.totalCost || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return { totalCases, inProgressCases, completedCases, alertCases, totalRevenue, totalCost, totalProfit, profitMargin };
  }, []);

  // 预警 Case 列表
  const alertCases = useMemo(
    () => mockCases.filter((c) => c.healthStatus === HealthStatus.YELLOW || c.healthStatus === HealthStatus.RED),
    []
  );

  // 最近更新的 Case
  const recentCases = useMemo(
    () => [...mockCases].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5),
    []
  );

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">精益交付仪表盘</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/financial-delivery/cases')}>
            业务单管理
          </Button>
          <Button onClick={() => navigate('/financial-delivery/cases/create')}>新建业务单</Button>
        </div>
      </div>

      {/* 概览统计 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/financial-delivery/cases')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总业务单数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statistics.totalCases}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/financial-delivery/cases')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.inProgressCases}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/financial-delivery/cases')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完结</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{statistics.completedCases}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/financial-delivery/cases')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预警数</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statistics.alertCases}</div>
          </CardContent>
        </Card>
      </div>

      {/* 财务指标 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{statistics.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总成本</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ¥{statistics.totalCost.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总利润</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{statistics.totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">利润率: {statistics.profitMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* 项目健康度气泡图（简化版） */}
      <Card>
        <CardHeader>
          <CardTitle>项目健康度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] border rounded-lg p-4">
            {/* 坐标轴标签 */}
            <div className="absolute left-4 top-2 text-xs text-muted-foreground">利润率 (%)</div>
            <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">WIP 占用天数</div>

            {/* 气泡 */}
            {mockDashboardData.bubbleChart.map((item) => {
              const x = (item.wipDays / 30) * 80;
              const y = 100 - item.currentMargin;
              const size = Math.max(30, Math.min(60, item.contractAmount / 3000));

              return (
                <div
                  key={item.caseId}
                  className="absolute cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor:
                      item.healthStatus === HealthStatus.GREEN
                        ? '#22c55e'
                        : item.healthStatus === HealthStatus.YELLOW
                        ? '#f59e0b'
                        : '#ef4444',
                    opacity: 0.8,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => navigate(`/financial-delivery/cases/${item.caseId}`)}
                  title={`${item.caseName}\n利润率: ${item.currentMargin}%\nWIP天数: ${item.wipDays}天\n合同金额: ¥${item.contractAmount.toLocaleString()}`}
                >
                  <span className="text-white text-xs font-bold">{item.currentMargin}%</span>
                </div>
              );
            })}

            {/* 图例 */}
            <div className="absolute right-4 top-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs">健康</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs">预警</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs">风险</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 预警列表和最近更新 */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>风险预警</CardTitle>
            <Button variant="link" onClick={() => navigate('/financial-delivery/cases')}>
              查看全部
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>业务单编号</TableHead>
                  <TableHead>项目名称</TableHead>
                  <TableHead>健康状态</TableHead>
                  <TableHead>当前利润率</TableHead>
                  <TableHead>WIP 天数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertCases.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => navigate(`/financial-delivery/cases/${item.id}`)}
                      >
                        {item.caseNo}
                      </Button>
                    </TableCell>
                    <TableCell>{item.projectName || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.healthStatus === HealthStatus.YELLOW ? 'outline' : 'destructive'
                        }
                      >
                        {healthStatusMap[item.healthStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.currentMargin !== undefined ? `${item.currentMargin}%` : '-'}
                    </TableCell>
                    <TableCell>
                      {item.wipDays !== undefined ? `${item.wipDays}天` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>最近更新</CardTitle>
            <Button variant="link" onClick={() => navigate('/financial-delivery/cases')}>
              查看全部
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>业务单编号</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>更新时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCases.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => navigate(`/financial-delivery/cases/${item.id}`)}
                      >
                        {item.caseNo}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={caseStatusMap[item.status].color === 'success' ? 'default' : 'secondary'}>
                        {caseStatusMap[item.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}