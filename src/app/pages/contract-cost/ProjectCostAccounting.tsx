import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText,
  FlaskConical,
  AlertCircle,
  ArrowRight,
  Trophy,
  Calendar,
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import {
  initialProjects,
  initialDailyReports,
  calculateProjectHours,
} from '../project-management/mockData';
import {
  contractNames,
  buildRDCostDetails,
  buildOpCostDetails,
  mockBusinessCosts,
  mockOutsourceCosts,
  mockOtherCosts,
} from './contractCostData';
import { useContracts } from '../contracts/ContractsContext';
import { formatCurrency } from '../employee/mockData';

interface ProjectCostRow {
  projectId: string;
  projectName: string;
  projectNo: string;
  status: string;
  progress: number;
  contractId: string;
  contractName: string;
  contractAmount: number;
  totalHours: number;
  rdCost: number;
  opCost: number;
  businessCost: number;
  outsourceCost: number;
  otherCost: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  budgetAlert: 'ok' | 'warning' | 'danger';
}

export function ProjectCostAccounting() {
  const navigate = useNavigate();
  const { contracts } = useContracts();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('');

  // 计算每个项目的成本
  const projectCostData: ProjectCostRow[] = useMemo(() => {
    return initialProjects.map(project => {
      const contractId = project.contractId || '';
      const contractName = contractNames[contractId] || '—';
      const contractObj = contracts.find(c => c.id === contractId);
      const contractAmount = contractObj?.totalAmount || 0;

      // 工时
      const totalHours = calculateProjectHours(project.id, initialDailyReports);

      // 研发成本（工时 × 时薪）
      const rdDetails = contractId ? buildRDCostDetails(contractId, '2026-06') : [];
      const rdCost = rdDetails.reduce((s, d) => s + d.cost, 0);

      // 运营分摊
      const opDetails = contractId ? buildOpCostDetails(contractId, '2026-06') : [];
      const opCost = opDetails.reduce((s, d) => s + d.cost, 0);

      // 其他成本（从 mock 数据按 contractId 汇总）
      const businessCost = mockBusinessCosts.filter(b => b.contractId === contractId).reduce((s, b) => s + b.amount, 0);
      const outsourceCost = mockOutsourceCosts.filter(b => b.contractId === contractId).reduce((s, b) => s + b.amount, 0);
      const otherCost = mockOtherCosts.filter(b => b.contractId === contractId).reduce((s, b) => s + b.amount, 0);

      const totalCost = rdCost + opCost + businessCost + outsourceCost + otherCost;
      const profit = contractAmount - totalCost;
      const profitMargin = contractAmount > 0 ? Math.round((profit / contractAmount) * 100) : 0;

      // 预算预警
      let budgetAlert: 'ok' | 'warning' | 'danger' = 'ok';
      if (profitMargin < 0) budgetAlert = 'danger';
      else if (profitMargin < 15) budgetAlert = 'warning';

      return {
        projectId: project.id,
        projectName: project.name,
        projectNo: project.projectNo,
        status: project.status,
        progress: project.progress,
        contractId,
        contractName,
        contractAmount,
        totalHours,
        rdCost,
        opCost,
        businessCost,
        outsourceCost,
        otherCost,
        totalCost,
        profit,
        profitMargin,
        budgetAlert,
      };
    });
  }, []);

  // 汇总
  const summary = useMemo(() => {
    const total = projectCostData.reduce(
      (acc, p) => ({
        contractAmount: acc.contractAmount + p.contractAmount,
        totalCost: acc.totalCost + p.totalCost,
        profit: acc.profit + p.profit,
        totalHours: acc.totalHours + p.totalHours,
        rdCost: acc.rdCost + p.rdCost,
      }),
      { contractAmount: 0, totalCost: 0, profit: 0, totalHours: 0, rdCost: 0 },
    );
    const avgMargin = total.contractAmount > 0 ? Math.round((total.profit / total.contractAmount) * 100) : 0;
    const alertCount = projectCostData.filter(p => p.budgetAlert === 'danger' || p.budgetAlert === 'warning').length;
    return { ...total, avgMargin, alertCount, projectCount: projectCostData.length };
  }, [projectCostData]);

  const filteredData = useMemo(() => {
    if (!filterStatus) return projectCostData;
    return projectCostData.filter(p => p.status === filterStatus);
  }, [projectCostData, filterStatus]);

  const statusOptions = Array.from(new Set(initialProjects.map(p => p.status)));

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '进行中': 'bg-blue-500',
      '已完成': 'bg-green-500',
      '验收中': 'bg-teal-500',
      '未开始': 'bg-gray-400',
      '延迟': 'bg-red-500',
      '搁置': 'bg-gray-300',
      '催款中': 'bg-orange-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getAlertVariant = (alert: 'ok' | 'warning' | 'danger') => {
    if (alert === 'danger') return 'destructive';
    if (alert === 'warning') return 'default';
    return 'default';
  };

  const getAlertColor = (alert: 'ok' | 'warning' | 'danger') => {
    if (alert === 'danger') return 'bg-red-500';
    if (alert === 'warning') return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {/* 摘要栏 */}
        <div className="grid grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileText className="h-4 w-4 text-primary" />
                项目总数
              </div>
              <p className="text-2xl font-semibold mt-1">{summary.projectCount} <span className="text-sm font-normal">个</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileText className="h-4 w-4 text-blue-500" />
                合同总额
              </div>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(summary.contractAmount)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FlaskConical className="h-4 w-4 text-red-500" />
                总成本
              </div>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(summary.totalCost)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Trophy className="h-4 w-4 text-green-500" />
                总利润
              </div>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(summary.profit)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4 text-orange-500" />
                平均利润率
              </div>
              <p className="text-2xl font-semibold mt-1">{summary.avgMargin}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <AlertCircle className="h-4 w-4 text-red-500" />
                预警项目
              </div>
              <p className={`text-2xl font-semibold mt-1 ${summary.alertCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {summary.alertCount} <span className="text-sm font-normal">个</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 成本明细 Tab */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">
                  <FileText className="h-4 w-4 mr-1" />
                  项目成本总览
                </TabsTrigger>
                <TabsTrigger value="rd">
                  <FlaskConical className="h-4 w-4 mr-1" />
                  研发成本明细
                </TabsTrigger>
              </TabsList>

              {activeTab === 'overview' && (
                <TabsContent value="overview">
                  <div className="flex flex-wrap gap-3 my-4">
                    <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v === '__all__' ? '' : v)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">全部状态</SelectItem>
                        {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">项目</TableHead>
                        <TableHead className="w-[80px]">状态</TableHead>
                        <TableHead className="w-[90px]">进度</TableHead>
                        <TableHead className="w-[100px]">合同额</TableHead>
                        <TableHead className="w-[80px]">总工时</TableHead>
                        <TableHead className="w-[100px]">研发成本</TableHead>
                        <TableHead className="w-[100px]">运营分摊</TableHead>
                        <TableHead className="w-[100px]">总成本</TableHead>
                        <TableHead className="w-[100px]">利润</TableHead>
                        <TableHead className="w-[90px]">利润率</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row) => (
                        <TableRow key={row.projectId}>
                          <TableCell>
                            <Button
                              variant="link"
                              className="p-0 h-auto font-semibold"
                              onClick={() => navigate(`/projects/${row.projectId}`)}
                            >
                              {row.projectName}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Progress value={row.progress} className="h-2" />
                          </TableCell>
                          <TableCell className="font-semibold">{formatCurrency(row.contractAmount)}</TableCell>
                          <TableCell>{row.totalHours}h</TableCell>
                          <TableCell>{formatCurrency(row.rdCost)}</TableCell>
                          <TableCell>{formatCurrency(row.opCost)}</TableCell>
                          <TableCell className="font-bold text-red-500">{formatCurrency(row.totalCost)}</TableCell>
                          <TableCell className={`font-bold ${row.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(row.profit)}
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge className={getAlertColor(row.budgetAlert)}>
                                  {row.profitMargin}%
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {row.budgetAlert === 'danger' ? '亏损预警' : row.budgetAlert === 'warning' ? '利润率偏低' : '健康'}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}

              {activeTab === 'rd' && (
                <TabsContent value="rd">
                  <RDCostDetailTable projectCostData={projectCostData} />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

function RDCostDetailTable({ projectCostData }: { projectCostData: ProjectCostRow[] }) {
  const rows = useMemo(() => {
    const result: any[] = [];
    projectCostData.forEach(p => {
      if (!p.contractId) return;
      const details = buildRDCostDetails(p.contractId, '2026-06');
      details.forEach(d => {
        result.push({ ...d, projectName: p.projectName });
      });
    });
    return result;
  }, [projectCostData]);

  const totalHours = rows.reduce((s: number, r: any) => s + (r.hours || 0), 0);
  const totalCost = rows.reduce((s: number, r: any) => s + (r.cost || 0), 0);

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">项目</TableHead>
            <TableHead className="w-[80px]">姓名</TableHead>
            <TableHead className="w-[80px]">角色</TableHead>
            <TableHead className="w-[70px]">工时</TableHead>
            <TableHead className="w-[80px]">时薪</TableHead>
            <TableHead className="w-[100px]">成本</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row.projectName}-${row.employeeName}-${index}`}>
              <TableCell>{row.projectName}</TableCell>
              <TableCell>{row.employeeName}</TableCell>
              <TableCell><Badge variant="outline">{row.position}</Badge></TableCell>
              <TableCell>{row.hours}h</TableCell>
              <TableCell>{formatCurrency(row.hourlyRate)}</TableCell>
              <TableCell className="font-semibold text-red-500">{formatCurrency(row.cost)}</TableCell>
            </TableRow>
          ))}
          {/* 合计行 */}
          <TableRow className="font-semibold bg-muted">
            <TableCell colSpan={3}>合计</TableCell>
            <TableCell>{totalHours}h</TableCell>
            <TableCell>—</TableCell>
            <TableCell className="font-bold text-red-500">{formatCurrency(totalCost)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
