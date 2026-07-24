import { useState, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import {
  FlaskConical,
  ArrowRight,
  User,
  FileText,
  Trophy,
  Calendar,
} from 'lucide-react';

// ---------- 类型 ----------

interface FunnelData {
  stage: string;
  value: number;
  unit: string;
  conversionRate?: number;
}

interface ChannelROI {
  channel: string;
  spend: number;
  leads: number;
  customers: number;
  contracts: number;
  revenue: number;
  roi: number;
  leadCost: number;
  conversionRate: number;
}

interface PersonROI {
  name: string;
  department: string;
  leads: number;
  followedLeads: number;
  customers: number;
  contracts: number;
  contractAmount: number;
  conversionRate: number;
}

interface ProjectROI {
  projectName: string;
  projectType: string;
  contractAmount: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  duration: number;
}

// ---------- 模拟数据 ----------

const funnelData: FunnelData[] = [
  { stage: '广告消耗',   value: 180000, unit: '元' },
  { stage: '线索获取',   value: 320,    unit: '条' },
  { stage: '有效线索',   value: 210,    unit: '条', conversionRate: 65.6 },
  { stage: '客户转化',   value: 48,     unit: '个', conversionRate: 22.9 },
  { stage: '签约合同',   value: 35,     unit: '个', conversionRate: 72.9 },
  { stage: '项目完成',   value: 28,     unit: '个', conversionRate: 80.0 },
  { stage: '项目利润',   value: 2450000, unit: '元' },
];

const channelROI: ChannelROI[] = [
  { channel: '百度推广', spend: 68000,  leads: 120, customers: 18, contracts: 14, revenue: 4200000, roi: 5176,  leadCost: 567,  conversionRate: 15.0 },
  { channel: '抖音',     spend: 52000,  leads: 95,  customers: 12, contracts: 9,  revenue: 2800000, roi: 5285,  leadCost: 547,  conversionRate: 12.6 },
  { channel: '小红书',   spend: 28000,  leads: 55,  customers: 8,  contracts: 6,  revenue: 1500000, roi: 5257,  leadCost: 509,  conversionRate: 14.5 },
  { channel: '微信推广', spend: 18000,  leads: 30,  customers: 6,  contracts: 4,  revenue: 1200000, roi: 6567,  leadCost: 600,  conversionRate: 20.0 },
  { channel: '淘宝',     spend: 14000,  leads: 20,  customers: 4,  contracts: 2,  revenue: 600000,  roi: 4186,  leadCost: 700,  conversionRate: 20.0 },
];

const personROI: PersonROI[] = [
  { name: '张三', department: '销售部', leads: 85, followedLeads: 78, customers: 15, contracts: 12, contractAmount: 3600000, conversionRate: 17.6 },
  { name: '钱七', department: '销售部', leads: 72, followedLeads: 65, customers: 12, contracts: 10, contractAmount: 2800000, conversionRate: 16.7 },
  { name: '周九', department: '销售部', leads: 58, followedLeads: 50, customers: 8,  contracts: 6,  contractAmount: 1800000, conversionRate: 13.8 },
  { name: '杨帆', department: '销售部', leads: 45, followedLeads: 38, customers: 5,  contracts: 3,  contractAmount: 900000,  conversionRate: 11.1 },
  { name: '李四', department: '技术部', leads: 30, followedLeads: 25, customers: 4,  contracts: 2,  contractAmount: 600000,  conversionRate: 13.3 },
  { name: '王五', department: '销售部', leads: 30, followedLeads: 22, customers: 4,  contracts: 2,  contractAmount: 500000,  conversionRate: 13.3 },
];

const projectROI: ProjectROI[] = [
  { projectName: '企业管理系统开发', projectType: '软件开发', contractAmount: 1200000, totalCost: 680000,  profit: 520000,  profitMargin: 43.3, duration: 90 },
  { projectName: '云服务平台项目',   projectType: '软件开发', contractAmount: 2000000, totalCost: 1100000, profit: 900000,  profitMargin: 45.0, duration: 120 },
  { projectName: '电商平台小程序',   projectType: '小程序',   contractAmount: 850000,  totalCost: 420000,  profit: 430000,  profitMargin: 50.6, duration: 60 },
  { projectName: '智能制造 MES',    projectType: '软件开发', contractAmount: 1500000, totalCost: 950000,  profit: 550000,  profitMargin: 36.7, duration: 150 },
  { projectName: '医疗健康 APP',    projectType: '移动应用', contractAmount: 550000,  totalCost: 280000,  profit: 270000,  profitMargin: 49.1, duration: 75 },
  { projectName: '数据分析平台',     projectType: '软件开发', contractAmount: 680000,  totalCost: 350000,  profit: 330000,  profitMargin: 48.5, duration: 45 },
  { projectName: '零售POS系统',     projectType: '软件开发', contractAmount: 360000,  totalCost: 180000,  profit: 180000,  profitMargin: 50.0, duration: 30 },
  { projectName: '物流追踪系统',     projectType: '软件开发', contractAmount: 480000,  totalCost: 320000,  profit: 160000,  profitMargin: 33.3, duration: 60 },
];

// ---------- 主组件 ----------

export function FullChainROI() {
  const [activeTab, setActiveTab] = useState('funnel');
  const [filterPeriod, setFilterPeriod] = useState('2026-Q2');

  const summary = useMemo(() => {
    const totalSpend = channelROI.reduce((s, c) => s + c.spend, 0);
    const totalRevenue = channelROI.reduce((s, c) => s + c.revenue, 0);
    const totalProfit = projectROI.reduce((s, p) => s + p.profit, 0);
    const avgMargin = Math.round(projectROI.reduce((s, p) => s + p.profitMargin, 0) / projectROI.length * 10) / 10;
    const totalLeads = channelROI.reduce((s, c) => s + c.leads, 0);
    return { totalSpend, totalRevenue, totalProfit, avgMargin, totalLeads };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">广告总消耗</div>
            <div className="text-2xl font-bold mt-1">¥{summary.totalSpend.toLocaleString()}</div>
            <FlaskConical className="absolute top-4 right-4 h-5 w-5 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">总营收</div>
            <div className="text-2xl font-bold mt-1">¥{summary.totalRevenue.toLocaleString()}</div>
            <Trophy className="absolute top-4 right-4 h-5 w-5 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">总利润</div>
            <div className="text-2xl font-bold mt-1">¥{summary.totalProfit.toLocaleString()}</div>
            <FileText className="absolute top-4 right-4 h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">平均利润率</div>
            <div className="text-2xl font-bold mt-1">{summary.avgMargin}%</div>
            <Calendar className="absolute top-4 right-4 h-5 w-5 text-violet-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">总线索数</div>
            <div className="text-2xl font-bold mt-1">{summary.totalLeads}条</div>
            <User className="absolute top-4 right-4 h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">整体ROI</div>
            <div className="text-2xl font-bold mt-1">{Math.round((summary.totalProfit / Math.max(summary.totalSpend, 1)) * 100)}%</div>
            <ArrowRight className="absolute top-4 right-4 h-5 w-5 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* 主体 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="funnel"><ArrowRight className="mr-1 h-4 w-4 inline" /> 漏斗分析</TabsTrigger>
              <TabsTrigger value="channel"><FlaskConical className="mr-1 h-4 w-4 inline" /> 渠道 ROI</TabsTrigger>
              <TabsTrigger value="person"><User className="mr-1 h-4 w-4 inline" /> 人员 ROI</TabsTrigger>
              <TabsTrigger value="project"><FileText className="mr-1 h-4 w-4 inline" /> 项目 ROI</TabsTrigger>
            </TabsList>

            <div className="pt-4">
              {/* 漏斗分析 Tab */}
              <TabsContent value="funnel">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-medium">时间周期：</span>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026-Q1">2026 Q1</SelectItem>
                      <SelectItem value="2026-Q2">2026 Q2</SelectItem>
                      <SelectItem value="2026-H1">2026 上半年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-stretch py-5">
                  {funnelData.map((stage, idx) => (
                    <div key={stage.stage} className="flex-1 flex flex-col items-center relative">
                      {/* 转化率箭头 */}
                      {idx > 0 && idx < funnelData.length - 1 && (
                        <div className="absolute top-5 -left-3 text-muted-foreground text-lg">→</div>
                      )}
                      {/* 数值 */}
                      <div className={`text-xl font-bold ${idx === funnelData.length - 1 ? 'text-green-500' : 'text-primary'}`}>
                        {stage.unit === '元' ? `¥${(stage.value / 10000).toFixed(0)}万` : stage.value}
                      </div>
                      {/* 单位 */}
                      <div className="text-xs text-muted-foreground mb-1">{stage.unit}</div>
                      {/* 阶段名 */}
                      <div className="text-sm font-semibold text-center mb-2">{stage.stage}</div>
                      {/* 转化率 */}
                      {stage.conversionRate !== undefined && (
                        <Badge variant="secondary" className="text-xs">转化率 {stage.conversionRate}%</Badge>
                      )}
                      {/* 漏斗宽度可视化 */}
                      <div
                        className="rounded-full mt-2"
                        style={{
                          width: `${100 - idx * 10}%`,
                          height: 8,
                          background: `linear-gradient(90deg, oklch(from var(--primary) l c h / ${1 - idx * 0.12}), oklch(from var(--primary) l c h / ${0.7 - idx * 0.1}))`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* 关键指标 */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 pb-4">
                      <div className="text-xs text-muted-foreground">单条线索成本</div>
                      <div className="text-lg font-bold">¥{Math.round(180000 / 320)}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 pb-4">
                      <div className="text-xs text-muted-foreground">单客户获客成本</div>
                      <div className="text-lg font-bold">¥{Math.round(180000 / 48)}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 pb-4">
                      <div className="text-xs text-muted-foreground">平均合同金额</div>
                      <div className="text-lg font-bold">¥{Math.round(10600000 / 35 / 10000)}万</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 pb-4">
                      <div className="text-xs text-muted-foreground">投入产出比</div>
                      <div className="text-lg font-bold text-green-500">1 : {Math.round(10600000 / 180000 * 10) / 10}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 渠道 ROI Tab */}
              <TabsContent value="channel">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>渠道</TableHead>
                      <TableHead>投放消耗</TableHead>
                      <TableHead>线索数</TableHead>
                      <TableHead>客户数</TableHead>
                      <TableHead>合同数</TableHead>
                      <TableHead>营收</TableHead>
                      <TableHead>单线索成本</TableHead>
                      <TableHead>转化率</TableHead>
                      <TableHead>ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channelROI.map((row) => (
                      <TableRow key={row.channel}>
                        <TableCell className="font-semibold">{row.channel}</TableCell>
                        <TableCell>¥{row.spend.toLocaleString()}</TableCell>
                        <TableCell>{row.leads}</TableCell>
                        <TableCell>{row.customers}</TableCell>
                        <TableCell>{row.contracts}</TableCell>
                        <TableCell>¥{(row.revenue / 10000).toFixed(0)}万</TableCell>
                        <TableCell>¥{row.leadCost}</TableCell>
                        <TableCell><Progress value={row.conversionRate} className="w-[60px]" /></TableCell>
                        <TableCell>
                          <Badge className={`font-semibold ${row.roi > 5000 ? 'bg-green-500' : row.roi > 3000 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>{row.roi}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* 人员 ROI Tab */}
              <TabsContent value="person">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>线索数</TableHead>
                      <TableHead>跟进数</TableHead>
                      <TableHead>客户数</TableHead>
                      <TableHead>合同数</TableHead>
                      <TableHead>合同金额</TableHead>
                      <TableHead>转化率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personROI.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell className="font-semibold">{row.name}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.leads}</TableCell>
                        <TableCell>{row.followedLeads}</TableCell>
                        <TableCell>{row.customers}</TableCell>
                        <TableCell>{row.contracts}</TableCell>
                        <TableCell>¥{(row.contractAmount / 10000).toFixed(0)}万</TableCell>
                        <TableCell>
                          <Progress
                            value={row.conversionRate * 3}
                            className={`w-[60px] ${row.conversionRate > 15 ? '[&>div]:bg-green-500' : row.conversionRate > 12 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* 项目 ROI Tab */}
              <TabsContent value="project">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>合同额</TableHead>
                      <TableHead>总成本</TableHead>
                      <TableHead>利润</TableHead>
                      <TableHead>利润率</TableHead>
                      <TableHead>工期(天)</TableHead>
                      <TableHead>月利润率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectROI.map((row) => {
                      const monthlyRate = Math.round(row.profitMargin / row.duration * 30 * 10) / 10;
                      return (
                        <TableRow key={row.projectName}>
                          <TableCell className="font-semibold">{row.projectName}</TableCell>
                          <TableCell><Badge variant="secondary">{row.projectType}</Badge></TableCell>
                          <TableCell>¥{(row.contractAmount / 10000).toFixed(0)}万</TableCell>
                          <TableCell>¥{(row.totalCost / 10000).toFixed(0)}万</TableCell>
                          <TableCell className="font-semibold text-green-500">¥{(row.profit / 10000).toFixed(0)}万</TableCell>
                          <TableCell>
                            <Badge className={`font-semibold ${row.profitMargin >= 45 ? 'bg-green-500' : row.profitMargin >= 35 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>{row.profitMargin}%</Badge>
                          </TableCell>
                          <TableCell>{row.duration}</TableCell>
                          <TableCell className="text-sm">{monthlyRate}%/月</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
