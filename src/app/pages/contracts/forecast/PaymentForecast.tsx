import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { PaymentPlanItem } from '../types';
import { formatCurrency } from '../../employee/mockData';

// ---------- 类型 ----------

interface MilestoneStatus {
  period: number;
  expectedDate: string;
  amount: number;
  percentage: number;
  status: 'paid' | 'overdue' | 'upcoming' | 'normal';
  daysUntil: number;
  receivedAmount: number;
}

interface MonthlyForecast {
  month: string;
  incoming: number;
  contractCount: number;
  riskCount: number;
}

// ---------- 本地模拟数据 ----------

interface ForecastContract {
  id: string;
  contractNo: string;
  contractName: string;
  customerName: string;
  totalAmount: number;
  paymentPlans: PaymentPlanItem[];
  collectionRecords: { amount: number; date: string }[];
}

const forecastContracts: ForecastContract[] = [
  {
    id: 'c1', contractNo: 'HT202601001', contractName: '企业管理系统开发', customerName: '北京科技有限公司',
    totalAmount: 1_200_000,
    paymentPlans: [
      { period: 1, expectedDate: '2026-03-20', amount: 480_000, percentage: 40 },
      { period: 2, expectedDate: '2026-05-20', amount: 360_000, percentage: 30 },
      { period: 3, expectedDate: '2026-07-20', amount: 360_000, percentage: 30 },
    ],
    collectionRecords: [{ amount: 480_000, date: '2026-03-22' }],
  },
  {
    id: 'c2', contractNo: 'HT202601002', contractName: '云服务平台项目', customerName: '创新科技有限公司',
    totalAmount: 2_000_000,
    paymentPlans: [
      { period: 1, expectedDate: '2026-04-01', amount: 1_000_000, percentage: 50 },
      { period: 2, expectedDate: '2026-06-01', amount: 600_000, percentage: 30 },
      { period: 3, expectedDate: '2026-09-01', amount: 400_000, percentage: 20 },
    ],
    collectionRecords: [{ amount: 1_000_000, date: '2026-04-03' }],
  },
  {
    id: 'c3', contractNo: 'HT202601003', contractName: '电商平台小程序', customerName: '东方电子商务有限公司',
    totalAmount: 850_000,
    paymentPlans: [
      { period: 1, expectedDate: '2026-04-15', amount: 340_000, percentage: 40 },
      { period: 2, expectedDate: '2026-06-15', amount: 255_000, percentage: 30 },
      { period: 3, expectedDate: '2026-07-15', amount: 255_000, percentage: 30 },
    ],
    collectionRecords: [{ amount: 340_000, date: '2026-04-16' }],
  },
  {
    id: 'c4', contractNo: 'HT202601004', contractName: '智能制造 MES 系统', customerName: '华夏制造集团',
    totalAmount: 1_500_000,
    paymentPlans: [
      { period: 1, expectedDate: '2026-02-15', amount: 900_000, percentage: 60 },
      { period: 2, expectedDate: '2026-05-15', amount: 450_000, percentage: 30 },
      { period: 3, expectedDate: '2026-07-01', amount: 150_000, percentage: 10 },
    ],
    collectionRecords: [{ amount: 900_000, date: '2026-02-18' }],
  },
  {
    id: 'c5', contractNo: 'HT202601005', contractName: '医疗健康 APP', customerName: '康健医疗科技',
    totalAmount: 550_000,
    paymentPlans: [
      { period: 1, expectedDate: '2026-05-10', amount: 275_000, percentage: 50 },
      { period: 2, expectedDate: '2026-07-10', amount: 275_000, percentage: 50 },
    ],
    collectionRecords: [],
  },
];

// ---------- 工具 ----------

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function buildMilestones(plans: PaymentPlanItem[], collectionRecords: { amount: number; date: string }[]): MilestoneStatus[] {
  const today = new Date('2026-07-02');
  if (!plans || plans.length === 0) return [];

  return plans.map((plan, idx) => {
    const isPaid = collectionRecords.reduce((s, r) => s + r.amount, 0) >= plans.slice(0, idx + 1).reduce((s, p) => s + p.amount, 0);
    const expectedDate = plan.expectedDate || addMonths('2026-01-15', idx * 2);
    const daysUntil = Math.ceil((new Date(expectedDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: MilestoneStatus['status'] = 'normal';
    if (isPaid) status = 'paid';
    else if (daysUntil < 0) status = 'overdue';
    else if (daysUntil <= 14) status = 'upcoming';

    const receivedAmount = isPaid ? plan.amount : 0;

    return { ...plan, expectedDate, status, daysUntil, receivedAmount };
  });
}

// ---------- 主组件 ----------

export function PaymentForecast() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedContractId, setSelectedContractId] = useState(forecastContracts[0]?.id || '');

  const selectedContract = forecastContracts.find(c => c.id === selectedContractId);

  // 为每个合同生成回款节点状态
  const contractMilestones = useMemo(() => {
    return forecastContracts.map(contract => {
      const milestones = buildMilestones(contract.paymentPlans, contract.collectionRecords || []);
      const totalReceived = milestones.filter(m => m.status === 'paid').reduce((s, m) => s + m.amount, 0);
      const overdueCount = milestones.filter(m => m.status === 'overdue').length;
      const upcomingCount = milestones.filter(m => m.status === 'upcoming').length;
      return { contract, milestones, totalReceived, overdueCount, upcomingCount };
    });
  }, []);

  // 汇总
  const summary = useMemo(() => {
    const totalAmount = forecastContracts.reduce((s, c) => s + c.totalAmount, 0);
    const totalReceived = contractMilestones.reduce((s, cm) => s + cm.totalReceived, 0);
    const totalOverdue = contractMilestones.reduce((s, cm) => s + cm.milestones.filter(m => m.status === 'overdue').reduce((ms, m) => ms + m.amount, 0), 0);
    const riskContracts = contractMilestones.filter(cm => cm.overdueCount > 0 || cm.upcomingCount > 0).length;
    return { totalAmount, totalReceived, totalOverdue, riskContracts, totalContracts: forecastContracts.length };
  }, [contractMilestones]);

  // 现金流预测（3/6/12 个月）
  const forecast = useMemo(() => {
    const months = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01'];
    return months.map(month => {
      let incoming = 0;
      let riskCount = 0;
      let contractCount = 0;

      contractMilestones.forEach(cm => {
        cm.milestones.forEach(m => {
          if (monthKey(m.expectedDate) === month && m.status !== 'paid') {
            incoming += m.amount;
            contractCount++;
            if (m.status === 'overdue' || m.status === 'upcoming') riskCount++;
          }
        });
      });

      return { month, incoming, contractCount, riskCount };
    });
  }, [contractMilestones]);

  const selectedMilestones = selectedContract
    ? contractMilestones.find(cm => cm.contract.id === selectedContractId)
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        <StatCard title="合同总数" value={summary.totalContracts} suffix="个" icon={<FileText className="size-4 text-primary" />} />
        <StatCard title="合同总额" value={summary.totalAmount} icon={<FileText className="size-4 text-primary" />} />
        <StatCard title="已回款" value={summary.totalReceived} icon={<CheckCircle className="size-4 text-emerald-500" />} />
        <StatCard
          title="逾期金额"
          value={summary.totalOverdue}
          icon={<AlertCircle className="size-4 text-destructive" />}
          valueColor={summary.totalOverdue > 0 ? 'text-destructive' : 'text-emerald-500'}
        />
        <StatCard title="风险合同" value={summary.riskContracts} suffix="个" icon={<Clock className="size-4 text-amber-500" />} />
        <StatCard
          title="回款进度"
          value={Math.round((summary.totalReceived / Math.max(summary.totalAmount, 1)) * 100)}
          suffix="%"
          icon={<FlaskConical className="size-4 text-primary" />}
        />
      </div>

      {/* 主体 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">
                <FileText className="size-4" />
                单合同回款看板
              </TabsTrigger>
              <TabsTrigger value="forecast">
                <Calendar className="size-4" />
                现金流预测
              </TabsTrigger>
              <TabsTrigger value="gantt">
                <FlaskConical className="size-4" />
                付款节点甘特图
              </TabsTrigger>
            </TabsList>

            <div className="pt-4">
              {/* 单合同回款看板 Tab */}
              <TabsContent value="overview">
                <div>
                  <div className="mb-4">
                    <span className="font-medium mr-2">选择合同：</span>
                    <Select value={selectedContractId} onValueChange={setSelectedContractId}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {forecastContracts.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.contractName || c.id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedContract && selectedMilestones && (
                    <div>
                      {/* 合同摘要 */}
                      <Card className="mb-4">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="text-base font-semibold m-0">{selectedContract.contractName}</h5>
                              <span className="text-sm text-muted-foreground">{selectedContract.customerName} &middot; {selectedContract.contractNo}</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">总额 {formatCurrency(selectedContract.totalAmount)}</Badge>
                              <Badge className="bg-emerald-500 text-white">已回 {formatCurrency(selectedMilestones.totalReceived)}</Badge>
                              {selectedMilestones.overdueCount > 0 && (
                                <Badge variant="destructive">逾期 {selectedMilestones.overdueCount} 期</Badge>
                              )}
                            </div>
                          </div>
                          <Progress
                            value={Math.round((selectedMilestones.totalReceived / Math.max(selectedContract.totalAmount, 1)) * 100)}
                            className="mt-3"
                          />
                        </CardContent>
                      </Card>

                      {/* 节点列表 */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">期数</TableHead>
                            <TableHead className="w-[80px]">状态</TableHead>
                            <TableHead className="w-[110px]">计划日期</TableHead>
                            <TableHead className="w-[80px]">天数</TableHead>
                            <TableHead className="w-[100px]">计划金额</TableHead>
                            <TableHead className="w-[100px]">已回</TableHead>
                            <TableHead className="w-[60px]">比例</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedMilestones.milestones.map((m) => (
                            <TableRow key={m.period}>
                              <TableCell>第{m.period}期</TableCell>
                              <TableCell>
                                <MilestoneStatusBadge status={m.status} />
                              </TableCell>
                              <TableCell>{m.expectedDate}</TableCell>
                              <TableCell>
                                {m.status === 'paid' ? (
                                  <span className="text-muted-foreground">&mdash;</span>
                                ) : m.daysUntil < 0 ? (
                                  <span className="text-destructive font-semibold">逾期 {Math.abs(m.daysUntil)} 天</span>
                                ) : m.daysUntil <= 7 ? (
                                  <span className="text-amber-500 font-semibold">{m.daysUntil} 天后</span>
                                ) : (
                                  <span>{m.daysUntil} 天后</span>
                                )}
                              </TableCell>
                              <TableCell>{formatCurrency(m.amount)}</TableCell>
                              <TableCell>
                                {m.receivedAmount > 0 ? (
                                  <span className="text-emerald-500 font-semibold">{formatCurrency(m.receivedAmount)}</span>
                                ) : (
                                  <span className="text-muted-foreground">&mdash;</span>
                                )}
                              </TableCell>
                              <TableCell>{m.percentage}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* 现金流预测 Tab */}
              <TabsContent value="forecast">
                <div>
                  {summary.totalOverdue > 0 && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="size-4" />
                      <AlertDescription>
                        当前有 {formatCurrency(summary.totalOverdue)} 逾期未收回，建议优先跟进。
                      </AlertDescription>
                    </Alert>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">月份</TableHead>
                        <TableHead className="w-[140px]">预计回款</TableHead>
                        <TableHead className="w-[100px]">涉及合同数</TableHead>
                        <TableHead className="w-[100px]">风险节点</TableHead>
                        <TableHead className="w-[140px]">累计回款</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {forecast.map((f, index) => {
                        const cumulative = forecast.slice(0, index + 1).reduce((s, f) => s + f.incoming, 0);
                        return (
                          <TableRow key={f.month}>
                            <TableCell>{f.month}</TableCell>
                            <TableCell>
                              <span className={`font-bold ${f.incoming > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                {formatCurrency(f.incoming)}
                              </span>
                            </TableCell>
                            <TableCell>{f.contractCount} 个</TableCell>
                            <TableCell>
                              {f.riskCount > 0 ? (
                                <Badge className="bg-orange-500 text-white">{f.riskCount} 个</Badge>
                              ) : (
                                <Badge className="bg-emerald-500 text-white">无</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">{formatCurrency(cumulative)}</span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* 甘特图 Tab */}
              <TabsContent value="gantt">
                <GanttChart contractMilestones={contractMilestones} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, suffix, icon, valueColor }: {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
        <div className={`text-lg font-bold ${valueColor ?? ''}`}>
          {typeof value === 'number' && value > 10000 ? `¥${(value / 10000).toFixed(1)}万` : value}
          {suffix}
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneStatusBadge({ status }: { status: MilestoneStatus['status'] }) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    paid: { label: '已付', variant: 'default' },
    overdue: { label: '逾期', variant: 'destructive' },
    upcoming: { label: '即将到期', variant: 'outline' },
    normal: { label: '正常', variant: 'secondary' },
  };
  const m = map[status] || map.normal;
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

// ============================================================
// 甘特图组件
// ============================================================

interface GanttChartProps {
  contractMilestones: {
    contract: { id: string; contractName?: string; totalAmount: number };
    milestones: MilestoneStatus[];
    totalReceived: number;
  }[];
}

function GanttChart({ contractMilestones }: GanttChartProps) {
  // 时间范围：2026-02 ~ 2026-09
  const months = ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const chartWidth = 800;
  const leftMargin = 180;
  const rightMargin = 20;
  const rowHeight = 48;
  const headerHeight = 36;

  const totalWidth = leftMargin + chartWidth + rightMargin;

  // 将日期转换为 X 坐标
  const dateToX = (dateStr: string): number => {
    const d = new Date(dateStr);
    const start = new Date('2026-02-01').getTime();
    const end = new Date('2026-10-01').getTime();
    const pct = (d.getTime() - start) / (end - start);
    return leftMargin + pct * chartWidth;
  };

  const colors: Record<string, string> = {
    paid: '#10b981',
    overdue: '#ef4444',
    upcoming: '#f59e0b',
    normal: '#3b82f6',
  };

  return (
    <div>
      <p className="text-muted-foreground text-sm mb-4">
        付款节点甘特图 — 横轴为时间轴，每个色块代表一个付款节点，位置对应计划日期
      </p>

      <ScrollArea>
        <div className="border rounded-lg overflow-auto">
          <svg width={totalWidth} height={headerHeight + contractMilestones.length * rowHeight + 20} style={{ display: 'block' }}>
            {/* 月份刻度 */}
            {months.map((m, i) => {
              const x = leftMargin + (i / (months.length - 1)) * chartWidth;
              return (
                <g key={m}>
                  <line x1={x} y1={0} x2={x} y2={headerHeight + contractMilestones.length * rowHeight} stroke="currentColor" strokeOpacity={0.1} strokeDasharray={i === 0 ? '' : '2,4'} />
                  <text x={x} y={headerHeight - 8} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6} fontWeight={500}>{m}</text>
                </g>
              );
            })}

            {/* 今日线 */}
            {(() => {
              const x = dateToX('2026-07-02');
              return (
                <g>
                  <line x1={x} y1={headerHeight - 4} x2={x} y2={headerHeight + contractMilestones.length * rowHeight} stroke="#ef4444" strokeWidth={2} strokeDasharray="4,3" />
                  <text x={x} y={headerHeight - 14} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>今日</text>
                </g>
              );
            })()}

            {/* 合同行 */}
            {contractMilestones.map((cm, rowIdx) => {
              const y = headerHeight + rowIdx * rowHeight;
              return (
                <g key={cm.contract.id}>
                  {/* 合同名 */}
                  <text x={leftMargin - 10} y={y + rowHeight / 2 + 4} textAnchor="end" fontSize={12} fill="currentColor" fontWeight={600}>
                    {cm.contract.contractName?.slice(0, 12) || cm.contract.id}
                  </text>

                  {/* 基线 */}
                  <line x1={leftMargin} y1={y + rowHeight / 2} x2={leftMargin + chartWidth} y2={y + rowHeight / 2} stroke="currentColor" strokeOpacity={0.15} />

                  {/* 节点 */}
                  {cm.milestones.map(m => {
                    const x = dateToX(m.expectedDate);
                    return (
                      <g key={m.period}>
                        {/* 节点圆点 */}
                        <circle cx={x} cy={y + rowHeight / 2} r={m.status === 'overdue' ? 8 : 6} fill={colors[m.status]} opacity={m.status === 'paid' ? 0.5 : 1} />
                        {/* 期数标签 */}
                        <text x={x} y={y + rowHeight / 2 - 12} textAnchor="middle" fontSize={10} fill={colors[m.status]} fontWeight={700}>
                          P{m.period}
                        </text>
                        {/* 金额标签 */}
                        <text x={x} y={y + rowHeight / 2 + 20} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.4}>
                          {(m.amount / 10000).toFixed(0)}万
                        </text>
                      </g>
                    );
                  })}

                  {/* 连接线（从上一期到本期） */}
                  {cm.milestones.slice(1).map((m, i) => {
                    const prevX = dateToX(cm.milestones[i].expectedDate);
                    const currX = dateToX(m.expectedDate);
                    return (
                      <line key={`line-${i}`} x1={prevX} y1={y + rowHeight / 2} x2={currX} y2={y + rowHeight / 2} stroke={colors[m.status]} strokeWidth={1.5} strokeOpacity={0.4} />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </ScrollArea>

      {/* 图例 */}
      <div className="flex gap-6 mt-4 p-3 bg-muted rounded-lg">
        {[
          { label: '已付', color: '#10b981' },
          { label: '逾期', color: '#ef4444' },
          { label: '即将到期（14天内）', color: '#f59e0b' },
          { label: '正常', color: '#3b82f6' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="size-3.5 rounded-full" style={{ background: item.color }} />
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 border-t-2 border-dashed border-destructive" />
          <span className="text-xs">今日（2026-07-02）</span>
        </div>
      </div>
    </div>
  );
}
