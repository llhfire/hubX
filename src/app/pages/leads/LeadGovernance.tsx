import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  FlaskConical,
  User,
  Pencil,
  Headphones,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// ---------- 类型 ----------

type LeadStatus = '未联系' | '未接通' | '初步沟通' | '需求调研' | '方案报价' | '合同洽谈' | '已签单' | '已终止';
type LeadLevel = '高' | '中' | '低';

interface LeadRecord {
  id: string;
  name: string;
  source: string;
  level: LeadLevel;
  status: LeadStatus;
  owner: string;
  entity: string;
  createTime: string;
  claimTime: string;
  lastFollowTime: string;
  nextFollowTime: string;
  followCount: number;
  daysHeld: number;
}

interface SalesGovernance {
  salesName: string;
  department: string;
  totalLeads: number;
  activeLeads: number;
  followedToday: number;
  followedThisWeek: number;
  overdueCount: number;
  avgResponseHours: number;
  conversionCount: number;
  complianceRate: number;
  violations: ViolationRecord[];
}

interface ViolationRecord {
  id: string;
  salesName: string;
  type: 'overdue_followup' | 'no_followup_record' | 'status_not_updated' | 'exceed_hold_days';
  description: string;
  leadName: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  autoAction?: string;
}

interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  threshold: string;
  enabled: boolean;
  action: string;
}

// ---------- 模拟数据 ----------

const mockLeads: LeadRecord[] = [
  { id: 'LS001', name: '某科技公司APP开发', source: '百度推广', level: '高', status: '需求调研', owner: '张三', entity: '中科软艺', createTime: '2026-06-20', claimTime: '2026-06-20', lastFollowTime: '2026-07-01', nextFollowTime: '2026-06-28', followCount: 5, daysHeld: 12 },
  { id: 'LS002', name: '金融公司管理系统', source: '抖音', level: '高', status: '方案报价', owner: '张三', entity: '软艺信息', createTime: '2026-06-15', claimTime: '2026-06-15', lastFollowTime: '2026-06-29', nextFollowTime: '2026-06-25', followCount: 8, daysHeld: 17 },
  { id: 'LS003', name: '电商平台小程序', source: '百度推广', level: '中', status: '初步沟通', owner: '李四', entity: '中科软艺', createTime: '2026-06-25', claimTime: '2026-06-25', lastFollowTime: '2026-07-02', nextFollowTime: '2026-07-05', followCount: 3, daysHeld: 7 },
  { id: 'LS004', name: '教育行业CRM', source: '小红书', level: '中', status: '未联系', owner: '李四', entity: '巴蜀文攻', createTime: '2026-06-28', claimTime: '2026-06-28', lastFollowTime: '', nextFollowTime: '2026-06-30', followCount: 0, daysHeld: 4 },
  { id: 'LS005', name: '医疗健康APP', source: '百度推广', level: '高', status: '合同洽谈', owner: '王五', entity: '中科软艺', createTime: '2026-06-10', claimTime: '2026-06-10', lastFollowTime: '2026-07-01', nextFollowTime: '2026-07-03', followCount: 12, daysHeld: 22 },
  { id: 'LS006', name: '物流追踪系统', source: '抖音', level: '低', status: '未接通', owner: '王五', entity: '软艺信息', createTime: '2026-06-22', claimTime: '2026-06-22', lastFollowTime: '2026-06-25', nextFollowTime: '2026-06-24', followCount: 2, daysHeld: 10 },
  { id: 'LS007', name: '社交平台开发', source: '微信推广', level: '中', status: '需求调研', owner: '赵六', entity: '中科软艺', createTime: '2026-06-18', claimTime: '2026-06-18', lastFollowTime: '2026-06-30', nextFollowTime: '2026-07-01', followCount: 6, daysHeld: 14 },
  { id: 'LS008', name: '零售POS系统', source: '百度推广', level: '高', status: '已签单', owner: '赵六', entity: '巴蜀文攻', createTime: '2026-06-05', claimTime: '2026-06-05', lastFollowTime: '2026-06-28', nextFollowTime: '', followCount: 15, daysHeld: 27 },
  { id: 'LS009', name: '智能制造MES', source: '抖音', level: '高', status: '初步沟通', owner: '钱七', entity: '软艺信息', createTime: '2026-06-29', claimTime: '2026-06-29', lastFollowTime: '', nextFollowTime: '2026-07-01', followCount: 0, daysHeld: 3 },
  { id: 'LS010', name: '保险行业系统', source: '小红书', level: '中', status: '未联系', owner: '钱七', entity: '中科软艺', createTime: '2026-06-30', claimTime: '2026-06-30', lastFollowTime: '', nextFollowTime: '2026-07-02', followCount: 0, daysHeld: 2 },
];

const mockViolations: ViolationRecord[] = [
  { id: 'v1', salesName: '李四', type: 'overdue_followup', description: '线索 LS004 超期 3 天未跟进', leadName: '教育行业CRM', severity: 'high',   date: '2026-07-02', autoAction: '已发送提醒通知' },
  { id: 'v2', salesName: '钱七', type: 'no_followup_record', description: '线索 LS009 认领 3 天未填写跟进记录', leadName: '智能制造MES', severity: 'medium', date: '2026-07-02' },
  { id: 'v3', salesName: '钱七', type: 'overdue_followup', description: '线索 LS010 超期 2 天未跟进', leadName: '保险行业系统', severity: 'high',   date: '2026-07-02' },
  { id: 'v4', salesName: '张三', type: 'status_not_updated', description: '线索 LS002 跟进 8 次未更新状态', leadName: '金融公司管理系统', severity: 'low', date: '2026-07-01' },
  { id: 'v5', salesName: '王五', type: 'exceed_hold_days', description: '线索 LS005 持有超 20 天未完成', leadName: '医疗健康APP', severity: 'medium', date: '2026-07-01', autoAction: '已标记为重点关注' },
  { id: 'v6', salesName: '李四', type: 'overdue_followup', description: '线索 LS002 超期 5 天未跟进', leadName: '金融公司管理系统', severity: 'high', date: '2026-06-30', autoAction: '已自动回收至公海' },
];

const defaultRules: GovernanceRule[] = [
  { id: 'r1', name: '每日最低跟进次数', description: '每个销售每天至少跟进 3 次（含电话/微信/上门）', threshold: '3 次/天', enabled: true,  action: '未达标时发送提醒' },
  { id: 'r2', name: '线索响应时间', description: '新认领线索必须在 24 小时内首次跟进', threshold: '24 小时', enabled: true,  action: '超时自动回收至公海' },
  { id: 'r3', name: '跟进记录规范', description: '每次跟进必须填写跟进内容和下次跟进时间', threshold: '100%',    enabled: true,  action: '限制提交' },
  { id: 'r4', name: '状态更新频率', description: '每 5 次跟进必须更新一次线索状态', threshold: '5 次跟进',  enabled: true,  action: '系统提醒' },
  { id: 'r5', name: '最大持有天数', description: '线索持有超过 30 天未完成自动回收', threshold: '30 天',     enabled: true,  action: '自动回收至公海' },
  { id: 'r6', name: '垃圾线索比例限制', description: '个人垃圾线索比例超过 30% 限制领取新线索', threshold: '30%', enabled: false, action: '限制领取新线索' },
];

// ---------- 计算治理数据 ----------

function calcSalesGovernance(salesName: string): SalesGovernance {
  const leads = mockLeads.filter(l => l.owner === salesName);
  const activeLeads = leads.filter(l => !['已签单', '已终止'].includes(l.status));
  const overdueCount = leads.filter(l => {
    if (!l.nextFollowTime || ['已签单', '已终止'].includes(l.status)) return false;
    return new Date(l.nextFollowTime) < new Date('2026-07-02');
  }).length;

  const todayFollows = leads.filter(l => l.lastFollowTime === '2026-07-02').length;
  const weekFollows = leads.filter(l => {
    if (!l.lastFollowTime) return false;
    const d = new Date(l.lastFollowTime);
    return d >= new Date('2026-06-26') && d <= new Date('2026-07-02');
  }).length;

  const conversionCount = leads.filter(l => l.status === '已签单').length;
  const violations = mockViolations.filter(v => v.salesName === salesName);

  // 合规率计算
  const totalChecks = activeLeads.length * 3; // 3 项检查：跟进频率、记录完整性、状态更新
  const violationPoints = violations.reduce((s, v) => s + (v.severity === 'high' ? 3 : v.severity === 'medium' ? 2 : 1), 0);
  const complianceRate = Math.max(0, Math.round(((totalChecks - violationPoints) / Math.max(totalChecks, 1)) * 100));

  return {
    salesName,
    department: '销售部',
    totalLeads: leads.length,
    activeLeads: activeLeads.length,
    followedToday: todayFollows,
    followedThisWeek: weekFollows,
    overdueCount,
    avgResponseHours: Math.round(8 + Math.random() * 20),
    conversionCount,
    complianceRate,
    violations,
  };
}

// ---------- 辅助函数 ----------

function ComplianceProgress({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold w-9">{value}%</span>
    </div>
  );
}

const violationTypeMap: Record<string, string> = {
  overdue_followup: '逾期未跟进',
  no_followup_record: '无跟进记录',
  status_not_updated: '状态未更新',
  exceed_hold_days: '超期持有',
};

const statusColorMap: Record<string, string> = {
  '未联系': 'bg-gray-400 hover:bg-gray-500',
  '未接通': 'bg-yellow-500 hover:bg-yellow-600',
  '初步沟通': 'bg-blue-500 hover:bg-blue-600',
  '需求调研': 'bg-sky-500 hover:bg-sky-600',
  '方案报价': 'bg-purple-500 hover:bg-purple-600',
  '合同洽谈': 'bg-orange-500 hover:bg-orange-600',
  '已签单': 'bg-green-500 hover:bg-green-600',
  '已终止': 'bg-red-500 hover:bg-red-600',
};

// ---------- 主组件 ----------

export function LeadGovernance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [rules, setRules] = useState(defaultRules);
  const [leadsPage, setLeadsPage] = useState(1);
  const [sortField, setSortField] = useState<string>('salesName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const leadsPageSize = 10;

  const salesList = useMemo(() => {
    const names = [...new Set(mockLeads.map(l => l.owner))];
    return names.map(name => calcSalesGovernance(name));
  }, []);

  const summary = useMemo(() => {
    const total = mockLeads.length;
    const active = mockLeads.filter(l => !['已签单', '已终止'].includes(l.status)).length;
    const overdue = mockLeads.filter(l => {
      if (!l.nextFollowTime || ['已签单', '已终止'].includes(l.status)) return false;
      return new Date(l.nextFollowTime) < new Date('2026-07-02');
    }).length;
    const violations = mockViolations.length;
    const avgCompliance = Math.round(salesList.reduce((s, sg) => s + sg.complianceRate, 0) / Math.max(salesList.length, 1));
    const conversions = mockLeads.filter(l => l.status === '已签单').length;
    return { total, active, overdue, violations, avgCompliance, conversions };
  }, [salesList]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const sortedSalesList = useMemo(() => {
    const sorted = [...salesList];
    sorted.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField] as number;
      const bVal = (b as Record<string, unknown>)[sortField] as number;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    return sorted;
  }, [salesList, sortField, sortDir]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const leadsTotalPages = Math.ceil(mockLeads.length / leadsPageSize);
  const pagedLeads = mockLeads.slice((leadsPage - 1) * leadsPageSize, leadsPage * leadsPageSize);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Headphones className="h-4 w-4" /> 线索总数
            </div>
            <div className="text-2xl font-bold">{summary.total} 条</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <FlaskConical className="h-4 w-4" /> 活跃线索
            </div>
            <div className="text-2xl font-bold">{summary.active} 条</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <AlertTriangle className="h-4 w-4" /> 逾期未跟进
            </div>
            <div className={cn('text-2xl font-bold', summary.overdue > 0 ? 'text-red-500' : 'text-green-500')}>
              {summary.overdue} 条
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <XCircle className="h-4 w-4" /> 违规记录
            </div>
            <div className="text-2xl font-bold">{summary.violations} 条</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" /> 平均合规率
            </div>
            <div className="text-2xl font-bold">{summary.avgCompliance} %</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <User className="h-4 w-4" /> 已转化
            </div>
            <div className="text-2xl font-bold">{summary.conversions} 条</div>
          </CardContent>
        </Card>
      </div>

      {/* 主体 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview"><User className="h-4 w-4 mr-1" /> 人员合规看板</TabsTrigger>
              <TabsTrigger value="violations"><AlertTriangle className="h-4 w-4 mr-1" /> 违规记录</TabsTrigger>
              <TabsTrigger value="rules"><Pencil className="h-4 w-4 mr-1" /> 治理规则</TabsTrigger>
              <TabsTrigger value="leads"><Headphones className="h-4 w-4 mr-1" /> 线索明细</TabsTrigger>
            </TabsList>

            <div className="pt-4">
              {/* 人员合规 Tab */}
              <TabsContent value="overview">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">销售</TableHead>
                      <TableHead className="w-20 cursor-pointer" onClick={() => handleSort('activeLeads')}>
                        <span className="inline-flex items-center gap-1">
                          活跃线索
                          {sortField === 'activeLeads' && (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                        </span>
                      </TableHead>
                      <TableHead className="w-20">今日跟进</TableHead>
                      <TableHead className="w-24 cursor-pointer" onClick={() => handleSort('followedThisWeek')}>
                        <span className="inline-flex items-center gap-1">
                          本周跟进
                          {sortField === 'followedThisWeek' && (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                        </span>
                      </TableHead>
                      <TableHead className="w-20 cursor-pointer" onClick={() => handleSort('overdueCount')}>
                        <span className="inline-flex items-center gap-1">
                          逾期线索
                          {sortField === 'overdueCount' && (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                        </span>
                      </TableHead>
                      <TableHead className="w-24">平均响应</TableHead>
                      <TableHead className="w-20">已转化</TableHead>
                      <TableHead className="w-36 cursor-pointer" onClick={() => handleSort('complianceRate')}>
                        <span className="inline-flex items-center gap-1">
                          合规率
                          {sortField === 'complianceRate' && (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                        </span>
                      </TableHead>
                      <TableHead className="w-16">违规</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSalesList.map(row => (
                      <TableRow key={row.salesName}>
                        <TableCell className="font-semibold">{row.salesName}</TableCell>
                        <TableCell>{row.activeLeads}条</TableCell>
                        <TableCell>{row.followedToday}次</TableCell>
                        <TableCell>{row.followedThisWeek}次</TableCell>
                        <TableCell>
                          {row.overdueCount > 0 ? (
                            <Badge variant="destructive">{row.overdueCount}条</Badge>
                          ) : (
                            <Badge className="bg-green-500 hover:bg-green-600">0</Badge>
                          )}
                        </TableCell>
                        <TableCell>{row.avgResponseHours}h</TableCell>
                        <TableCell>{row.conversionCount}条</TableCell>
                        <TableCell>
                          <ComplianceProgress value={row.complianceRate} />
                        </TableCell>
                        <TableCell>
                          {row.violations.length > 0 ? (
                            <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-destructive px-1.5 text-xs text-white font-medium">
                              {row.violations.length}
                            </span>
                          ) : (
                            <Badge className="bg-green-500 hover:bg-green-600">无</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* 违规记录 Tab */}
              <TabsContent value="violations">
                {mockViolations.filter(v => v.severity === 'high').length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      当前有 {mockViolations.filter(v => v.severity === 'high').length} 条高严重性违规，建议立即处理。
                    </AlertDescription>
                  </Alert>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">严重度</TableHead>
                      <TableHead className="w-20">销售</TableHead>
                      <TableHead className="w-32">违规类型</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead className="w-32">相关线索</TableHead>
                      <TableHead className="w-24">日期</TableHead>
                      <TableHead className="w-36">自动处置</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockViolations.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Badge
                            className={cn(
                              row.severity === 'high'
                                ? 'bg-red-500 hover:bg-red-600'
                                : row.severity === 'medium'
                                  ? 'bg-orange-500 hover:bg-orange-600'
                                  : 'bg-gray-400 hover:bg-gray-500'
                            )}
                          >
                            {row.severity === 'high' ? '高' : row.severity === 'medium' ? '中' : '低'}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.salesName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{violationTypeMap[row.type] || row.type}</Badge>
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.leadName}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          {row.autoAction ? (
                            <Badge className="bg-orange-500 hover:bg-orange-600">{row.autoAction}</Badge>
                          ) : (
                            <span className="text-muted-foreground">&mdash;</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* 治理规则 Tab */}
              <TabsContent value="rules">
                <div className="grid grid-cols-3 gap-4">
                  {rules.map(rule => (
                    <Card key={rule.id} className={cn(rule.enabled ? 'border-primary border-2' : 'border')}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm">{rule.name}</span>
                          <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                            {rule.enabled ? '已启用' : '已禁用'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                        <Separator className="my-2" />
                        <div className="text-xs space-y-1">
                          <div><span className="text-muted-foreground">阈值：</span>{rule.threshold}</div>
                          <div><span className="text-muted-foreground">处置：</span>{rule.action}</div>
                        </div>
                        <Button
                          variant={rule.enabled ? 'secondary' : 'default'}
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => toggleRule(rule.id)}
                        >
                          {rule.enabled ? '禁用规则' : '启用规则'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 线索明细 Tab */}
              <TabsContent value="leads">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">线索名称</TableHead>
                      <TableHead className="w-24">来源</TableHead>
                      <TableHead className="w-16">等级</TableHead>
                      <TableHead className="w-24">状态</TableHead>
                      <TableHead className="w-20">负责人</TableHead>
                      <TableHead className="w-20">跟进次数</TableHead>
                      <TableHead className="w-20">持有天数</TableHead>
                      <TableHead className="w-24">下次跟进</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedLeads.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{row.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              row.level === '高'
                                ? 'bg-red-500 hover:bg-red-600'
                                : row.level === '中'
                                  ? 'bg-orange-500 hover:bg-orange-600'
                                  : 'bg-gray-400 hover:bg-gray-500'
                            )}
                          >
                            {row.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(statusColorMap[row.status] || 'bg-gray-400 hover:bg-gray-500')}>
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.owner}</TableCell>
                        <TableCell>{row.followCount}次</TableCell>
                        <TableCell>
                          <span className={cn(
                            row.daysHeld > 20 ? 'text-red-500' : row.daysHeld > 14 ? 'text-orange-500' : ''
                          )}>
                            {row.daysHeld}天
                          </span>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            if (!row.nextFollowTime || ['已签单', '已终止'].includes(row.status)) return <span>&mdash;</span>;
                            const isOverdue = new Date(row.nextFollowTime) < new Date('2026-07-02');
                            return (
                              <span className={cn(isOverdue ? 'text-red-500 font-semibold' : '')}>
                                {row.nextFollowTime}
                                {isOverdue && (
                                  <AlertTriangle className="inline h-3 w-3 ml-1 text-orange-500" />
                                )}
                              </span>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* 分页 */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    共 {mockLeads.length} 条记录，第 {leadsPage}/{leadsTotalPages} 页
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={leadsPage <= 1}
                      onClick={() => setLeadsPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={leadsPage >= leadsTotalPages}
                      onClick={() => setLeadsPage(p => Math.min(leadsTotalPages, p + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
