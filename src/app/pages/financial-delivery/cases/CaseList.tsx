import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Download, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  mockCases,
  CaseStatus,
  HealthStatus,
  caseStatusMap,
  healthStatusMap,
  industryOptions,
  projectTypeOptions,
} from '../mockData';
import type { Case } from '../mockData';

export default function CaseList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  // 筛选后的数据
  const filteredData = useMemo(() => {
    return mockCases.filter((item) => {
      // 关键词筛选
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const match =
          item.caseNo.toLowerCase().includes(keyword) ||
          (item.leadName && item.leadName.toLowerCase().includes(keyword)) ||
          (item.projectName && item.projectName.toLowerCase().includes(keyword));
        if (!match) return false;
      }

      // 状态筛选
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // 行业筛选
      if (industryFilter !== 'all' && item.industry !== industryFilter) {
        return false;
      }

      return true;
    });
  }, [searchKeyword, statusFilter, industryFilter]);

  // 统计数据
  const statistics = useMemo(() => {
    const total = filteredData.length;
    const inProgress = filteredData.filter((item) => item.status === CaseStatus.IN_PROGRESS).length;
    const completed = filteredData.filter((item) => item.status === CaseStatus.COMPLETED).length;
    const totalRevenue = filteredData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
    const totalCost = filteredData.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const alertCount = filteredData.filter(
      (item) => item.healthStatus === HealthStatus.YELLOW || item.healthStatus === HealthStatus.RED
    ).length;

    return { total, inProgress, completed, totalRevenue, totalCost, totalProfit, profitMargin, alertCount };
  }, [filteredData]);

  // 获取状态徽章样式
  const getStatusBadge = (status: CaseStatus) => {
    const config = caseStatusMap[status];
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      default: 'default',
      processing: 'secondary',
      success: 'default',
      warning: 'outline',
      error: 'destructive',
    };
    return <Badge variant={variantMap[config.color] || 'default'}>{config.label}</Badge>;
  };

  // 获取健康状态徽章样式
  const getHealthBadge = (status: HealthStatus) => {
    const config = healthStatusMap[status];
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      green: 'default',
      yellow: 'outline',
      red: 'destructive',
    };
    return <Badge variant={variantMap[config.color] || 'default'}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">业务单管理</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button size="sm" onClick={() => navigate('/financial-delivery/cases/create')}>
            <Plus className="mr-2 h-4 w-4" />
            新建业务单
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总业务单数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完结</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{statistics.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预警数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statistics.alertCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总利润</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{statistics.totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              利润率: {statistics.profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 筛选条件 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索业务单编号、线索名称、项目名称"
                className="pl-8"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.entries(caseStatusMap).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                {industryOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 表格 */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">业务单编号</TableHead>
                <TableHead className="w-[200px]">关联线索/项目</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[100px]">健康状态</TableHead>
                <TableHead className="w-[100px]">行业</TableHead>
                <TableHead className="w-[120px]">项目类型</TableHead>
                <TableHead className="w-[120px] text-right">合同金额</TableHead>
                <TableHead className="w-[120px]">当前利润率</TableHead>
                <TableHead className="w-[120px] text-center">WIP 天数</TableHead>
                <TableHead className="w-[120px]">创建时间</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate(`/financial-delivery/cases/${item.id}`)}
                    >
                      {item.caseNo}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div>
                      {item.leadName && <div className="text-sm">{item.leadName}</div>}
                      {item.projectName && (
                        <div className="text-xs text-muted-foreground">{item.projectName}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getHealthBadge(item.healthStatus)}</TableCell>
                  <TableCell>{item.industry || '-'}</TableCell>
                  <TableCell>{item.projectType || '-'}</TableCell>
                  <TableCell className="text-right">
                    {item.contractAmount ? `¥${item.contractAmount.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>
                    {item.currentMargin !== undefined && item.currentMargin !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, item.currentMargin)}%`,
                              backgroundColor:
                                item.currentMargin >= 30
                                  ? '#22c55e'
                                  : item.currentMargin >= 20
                                  ? '#f59e0b'
                                  : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-sm">{item.currentMargin}%</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.wipDays !== undefined && item.wipDays !== null ? (
                      <Badge
                        variant={
                          item.wipDays <= 7
                            ? 'default'
                            : item.wipDays <= 14
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {item.wipDays}天
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/financial-delivery/cases/${item.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/financial-delivery/cases/${item.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}