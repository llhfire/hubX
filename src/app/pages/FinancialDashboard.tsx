import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell, Tooltip as RechartTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Plus, Pencil, Trash2, Download } from 'lucide-react';

import { Button } from '../components/ui/button';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter,
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../components/ui/dialog';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '../components/ui/tooltip';

import { contractCostPermissions } from './contract-cost/contractCostData';

// ─── Mock data ───────────────────────────────────────────────────────────────

const contractData = [
  { key: '1', name: '企业管理系统开发合同', customer: '阿里巴巴（中国）有限公司', start: '2026-03-20', end: '2026-09-30', total: 500000, received: 200000, costRD: 80000, costBiz: 30000, costOutsource: 120000, costOther: 20000 },
  { key: '2', name: '云服务平台建设合同', customer: '腾讯科技（深圳）有限公司', start: '2026-03-15', end: '2026-08-20', total: 800000, received: 800000, costRD: 200000, costBiz: 60000, costOutsource: 180000, costOther: 40000 },
  { key: '3', name: '协作工具定制开发合同', customer: '北京字节跳动科技有限公司', start: '2026-03-10', end: '2026-07-15', total: 350000, received: 105000, costRD: 90000, costBiz: 20000, costOutsource: 100000, costOther: 10000 },
  { key: '4', name: 'A公司CRM系统开发', customer: 'A科技公司', start: '2026-03-20', end: '2026-06-20', total: 1200000, received: 800000, costRD: 300000, costBiz: 80000, costOutsource: 250000, costOther: 60000 },
];

const opExpenses = [
  { key: '1', date: '2026-05-01', type: '房租物业', amount: 38000, period: '2026-05', allocation: '公司级', approvalNo: 'AP2026050001', status: '已支付', enteredBy: '张三' },
  { key: '2', date: '2026-05-03', type: '水电网络', amount: 4200, period: '2026-05', allocation: '公司级', approvalNo: 'AP2026050002', status: '已支付', enteredBy: '张三' },
  { key: '3', date: '2026-05-05', type: '行政杂费', amount: 1800, period: '2026-05', allocation: '行政部', approvalNo: 'AP2026050003', status: '已支付', enteredBy: '李四' },
  { key: '4', date: '2026-04-01', type: '房租物业', amount: 38000, period: '2026-04', allocation: '公司级', approvalNo: 'AP2026040001', status: '已支付', enteredBy: '张三' },
  { key: '5', date: '2026-04-03', type: '水电网络', amount: 3900, period: '2026-04', allocation: '公司级', approvalNo: 'AP2026040002', status: '已支付', enteredBy: '张三' },
  { key: '6', date: '2026-04-10', type: '设备维护', amount: 6500, period: '2026-04', allocation: '技术部', approvalNo: 'AP2026040003', status: '未支付', enteredBy: '王五' },
];

const trendData = [
  { month: '2025-11', 房租物业: 38000, 水电网络: 3600, 行政杂费: 2100, 设备维护: 0 },
  { month: '2025-12', 房租物业: 38000, 水电网络: 4100, 行政杂费: 3200, 设备维护: 8000 },
  { month: '2026-01', 房租物业: 38000, 水电网络: 3800, 行政杂费: 1900, 设备维护: 0 },
  { month: '2026-02', 房租物业: 38000, 水电网络: 3500, 行政杂费: 1600, 设备维护: 0 },
  { month: '2026-03', 房租物业: 38000, 水电网络: 4000, 行政杂费: 2400, 设备维护: 5000 },
  { month: '2026-04', 房租物业: 38000, 水电网络: 3900, 行政杂费: 1800, 设备维护: 6500 },
  { month: '2026-05', 房租物业: 38000, 水电网络: 4200, 行政杂费: 1800, 设备维护: 0 },
];

const PIE_COLORS = ['#165dff', '#0fc6c2', '#ff7d00', '#7816ff'];

const EXPENSE_TYPES = ['房租物业', '水电网络', '行政杂费', '设备维护', '其他'];
const ALLOCATION_OPTIONS = ['公司级', '销售部', '技术部', '行政部', '财务部'];
const STATUS_OPTIONS = ['已支付', '未支付', '分期'];

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="
      relative overflow-hidden
      rounded-xl
      bg-white
      border border-gray-100
      shadow-sm
      hover:shadow-md
      transition-shadow duration-200
    ">
      {/* 顶部渐变条 */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${color || '#165dff'}, ${color || '#165dff'}80)`
        }}
      />

      <div className="p-5 pt-6">
        {/* 标签 */}
        <div className="text-[13px] font-medium text-gray-500 mb-3 tracking-wide">
          {label}
        </div>

        {/* 数值 */}
        <div className="text-[28px] font-bold text-gray-900 tracking-tight leading-none font-mono tabular-nums">
          {value}
        </div>

        {/* 副标题 */}
        {sub && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-[13px] text-gray-400">{sub}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Default form data ────────────────────────────────────────────────────────

const defaultFormData = {
  type: '',
  period: '',
  date: '',
  amount: '',
  status: '',
  allocation: '',
  approvalNo: '',
  enteredBy: '张三',
};

// ─── Main component ───────────────────────────────────────────────────────────

export function FinancialDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('all');
  const [opList, setOpList] = useState(opExpenses);
  const [entryVisible, setEntryVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [periodFilter, setPeriodFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [formData, setFormData] = useState(defaultFormData);

  // Derived contract stats
  const totalContract = contractData.reduce((s, r) => s + r.total, 0);
  const totalReceived = contractData.reduce((s, r) => s + r.received, 0);
  const totalPending = totalContract - totalReceived;
  const totalCost = contractData.reduce((s, r) => s + r.costRD + r.costBiz + r.costOutsource + r.costOther, 0);

  // Pie chart data for latest month op expenses
  const pieData = [
    { name: '房租物业', value: opList.filter((e) => e.type === '房租物业').reduce((s, e) => s + e.amount, 0) },
    { name: '水电网络', value: opList.filter((e) => e.type === '水电网络').reduce((s, e) => s + e.amount, 0) },
    { name: '行政杂费', value: opList.filter((e) => e.type === '行政杂费').reduce((s, e) => s + e.amount, 0) },
    { name: '设备维护', value: opList.filter((e) => e.type === '设备维护').reduce((s, e) => s + e.amount, 0) },
  ].filter((d) => d.value > 0);

  const filteredOp = opList.filter((e) => {
    if (periodFilter && e.period !== periodFilter) return false;
    if (typeFilter && e.type !== typeFilter) return false;
    return true;
  });

  const filteredTotal = filteredOp.reduce((s, e) => s + e.amount, 0);

  const openCreate = () => {
    setEditingEntry(null);
    setFormData({ ...defaultFormData, enteredBy: '张三', date: new Date().toISOString().slice(0, 10) });
    setEntryVisible(true);
  };

  const openEdit = (record: any) => {
    setEditingEntry(record);
    setFormData({
      type: record.type || '',
      period: record.period || '',
      date: record.date || '',
      amount: String(record.amount || ''),
      status: record.status || '',
      allocation: record.allocation || '',
      approvalNo: record.approvalNo || '',
      enteredBy: record.enteredBy || '',
    });
    setEntryVisible(true);
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.type) {
      toast.error('请选择成本类型');
      return;
    }
    if (!formData.period) {
      toast.error('请输入归属周期');
      return;
    }
    if (!formData.date) {
      toast.error('请选择发生日期');
      return;
    }
    if (!formData.amount) {
      toast.error('请输入金额');
      return;
    }
    if (!formData.status) {
      toast.error('请选择状态');
      return;
    }

    const values = {
      type: formData.type,
      period: formData.period,
      date: formData.date,
      amount: Number(formData.amount),
      status: formData.status,
      allocation: formData.allocation,
      approvalNo: formData.approvalNo,
      enteredBy: formData.enteredBy,
    };

    if (editingEntry) {
      setOpList((prev) => prev.map((e) => e.key === editingEntry.key ? { ...e, ...values } : e));
      toast.success('已更新');
    } else {
      setOpList((prev) => [...prev, { ...values, key: String(Date.now()) }]);
      toast.success('录入成功');
    }
    setEntryVisible(false);
  };

  const handleDelete = (key: string) => {
    setOpList((prev) => prev.filter((e) => e.key !== key));
    toast.success('已删除');
  };

  const periods = [...new Set(opList.map((e) => e.period))].sort().reverse();

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              财务统计
            </h1>
            <p className="mt-1 text-[14px] text-gray-500">
              查看合同收入、成本和利润数据
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="contract">
        <TabsList className="mb-6">
          <TabsTrigger value="contract" className="px-4">合同统计</TabsTrigger>
          <TabsTrigger value="operation" className="px-4">运营成本</TabsTrigger>
        </TabsList>

        {/* ── 合同统计 ── */}
        <TabsContent value="contract">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-5 mb-6">
            <SummaryCard label="合同总额" value={`¥${(totalContract / 10000).toFixed(1)}万`} color="#165dff" />
            <SummaryCard label="到账金额" value={`¥${(totalReceived / 10000).toFixed(1)}万`} sub={`回款率 ${(totalReceived / totalContract * 100).toFixed(1)}%`} color="#00b42a" />
            <SummaryCard label="待收款" value={`¥${(totalPending / 10000).toFixed(1)}万`} color="#ff7d00" />
            <SummaryCard label="成本总额" value={`¥${(totalCost / 10000).toFixed(1)}万`} sub={`利润率 ${((totalContract - totalCost) / totalContract * 100).toFixed(1)}%`} color="#7816ff" />
          </div>

          <Card className="rounded-xl border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">合同费用明细</CardTitle>
              <CardAction>
                <Button variant="outline" size="sm" className="rounded-lg h-9 px-4">
                  <Download className="size-4 mr-2" />
                  导出报表
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 tracking-wide" style={{ minWidth: 220 }}>合同名称</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 200 }}>客户</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 110 }}>合同总额</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 110 }}>回款金额</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 110 }}>成本总额</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 120 }}>利润</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 100 }}>科研成本</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 100 }}>商务成本</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 100 }}>外包成本</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 100 }}>其他成本</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 110 }}>合同起始</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 110 }}>合同截止</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractData.map((r, index) => {
                    const cost = r.costRD + r.costBiz + r.costOutsource + r.costOther;
                    const profit = r.total - cost;
                    const ratio = cost / r.total;
                    const isWarning = ratio >= 0.8;
                    return (
                      <TableRow
                        key={r.key}
                        className={`
                          h-[52px] border-b border-gray-100
                          hover:bg-gray-50/50 transition-colors duration-150
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                        `}
                      >
                        <TableCell className="px-4 py-0">
                          {contractCostPermissions.contractCostView ? (
                            <a
                              className="text-primary font-medium hover:underline underline-offset-2 cursor-pointer"
                              onClick={() => navigate(`/finance/contract-cost/${r.key}`)}
                            >
                              {r.name}
                            </a>
                          ) : (
                            <span className="font-medium text-gray-900">{r.name}</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-0 text-gray-600">{r.customer}</TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-900">¥{(r.total / 10000).toFixed(1)}万</TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-900">¥{(r.received / 10000).toFixed(1)}万</TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-900">¥{(cost / 10000).toFixed(1)}万</TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums">
                          <span className={`font-semibold ${isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                            ¥{(profit / 10000).toFixed(1)}万
                            {isWarning && <span className="text-[11px] ml-1">⚠</span>}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-600">¥{(r.costRD / 10000).toFixed(1)}万</TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-600">¥{(r.costBiz / 10000).toFixed(1)}万</TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-600">¥{(r.costOutsource / 10000).toFixed(1)}万</TableCell>
                        <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-600">¥{(r.costOther / 10000).toFixed(1)}万</TableCell>
                        <TableCell className="px-4 py-0 text-gray-600">{r.start}</TableCell>
                        <TableCell className="px-4 py-0 text-gray-600">{r.end}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow className="h-14 bg-gray-50 border-t-2 border-gray-200 hover:bg-gray-50">
                    <TableCell className="px-4 font-semibold text-gray-700">合计</TableCell>
                    <TableCell />
                    <TableCell className="px-4 text-right font-semibold font-mono tabular-nums text-gray-900">
                      ¥{(contractData.reduce((s, r) => s + r.total, 0) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell className="px-4 text-right font-semibold font-mono tabular-nums text-gray-900">
                      ¥{(contractData.reduce((s, r) => s + r.received, 0) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell className="px-4 text-right font-semibold font-mono tabular-nums text-gray-900">
                      ¥{(contractData.reduce((s, r) => s + r.costRD + r.costBiz + r.costOutsource + r.costOther, 0) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell className="px-4 text-right font-semibold font-mono tabular-nums text-emerald-600">
                      ¥{((contractData.reduce((s, r) => s + r.total, 0) - contractData.reduce((s, r) => s + r.costRD + r.costBiz + r.costOutsource + r.costOther, 0)) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono tabular-nums text-gray-600">
                      ¥{(contractData.reduce((s, r) => s + r.costRD, 0) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono tabular-nums text-gray-600">
                      ¥{(contractData.reduce((s, r) => s + r.costBiz, 0) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono tabular-nums text-gray-600">
                      ¥{(contractData.reduce((s, r) => s + r.costOutsource, 0) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell className="px-4 text-right font-mono tabular-nums text-gray-600">
                      ¥{(contractData.reduce((s, r) => s + r.costOther, 0) / 10000).toFixed(1)}万
                    </TableCell>
                    <TableCell /><TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── 运营成本 ── */}
        <TabsContent value="operation">
          <div className="grid grid-cols-[1fr_2fr] gap-5 mb-6">
            {/* Pie chart */}
            <Card className="rounded-xl border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">支出分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <RechartTooltip formatter={(v: number) => `¥${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Line chart */}
            <Card className="rounded-xl border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">月度支出趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-2)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <RechartTooltip formatter={(v: number) => `¥${v.toLocaleString()}`} />
                    <Legend />
                    {['房租物业', '水电网络', '行政杂费', '设备维护'].map((key, i) => (
                      <Line key={key} type="monotone" dataKey={key} stroke={PIE_COLORS[i]} strokeWidth={2} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Op expense list */}
          <Card className="rounded-xl border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-gray-900">运营费用明细</CardTitle>
              <CardAction>
                <div className="flex items-center gap-3">
                  <Select value={periodFilter || undefined} onValueChange={(v) => setPeriodFilter(v === '__all__' ? '' : v)}>
                    <SelectTrigger className="w-[120px] h-9 rounded-lg border-gray-200 text-[13px]">
                      <SelectValue placeholder="筛选周期" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">全部</SelectItem>
                      {periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter || undefined} onValueChange={(v) => setTypeFilter(v === '__all__' ? '' : v)}>
                    <SelectTrigger className="w-[120px] h-9 rounded-lg border-gray-200 text-[13px]">
                      <SelectValue placeholder="费用类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">全部</SelectItem>
                      {EXPENSE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="rounded-lg h-9 px-4" onClick={openCreate}>
                    <Plus className="size-4 mr-2" />
                    录入费用
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 110 }}>发生日期</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 110 }}>成本类型</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 text-right font-mono" style={{ minWidth: 100 }}>金额</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 100 }}>归属周期</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 100 }}>分摊对象</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 140 }}>关联审批单号</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 100 }}>付款状态</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50" style={{ minWidth: 80 }}>录入人</TableHead>
                    <TableHead className="h-12 px-4 text-[13px] font-semibold text-gray-500 bg-gray-50/50 sticky right-0 bg-gray-50/50" style={{ minWidth: 110 }}>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOp.map((record, index) => (
                    <TableRow
                      key={record.key}
                      className={`
                        h-[52px] border-b border-gray-100
                        hover:bg-gray-50/50 transition-colors duration-150
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                      `}
                    >
                      <TableCell className="px-4 py-0 text-gray-600">{record.date}</TableCell>
                      <TableCell className="px-4 py-0">
                        <Badge className="bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-2.5 py-0.5 text-[12px] font-medium">
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-0 text-right font-mono tabular-nums text-gray-900 font-medium">
                        ¥{record.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 py-0 text-gray-600">{record.period}</TableCell>
                      <TableCell className="px-4 py-0 text-gray-600">{record.allocation}</TableCell>
                      <TableCell className="px-4 py-0 font-mono text-[13px] text-gray-500">{record.approvalNo}</TableCell>
                      <TableCell className="px-4 py-0">
                        <Badge
                          className={`
                            inline-flex items-center gap-1.5
                            px-2.5 py-1
                            rounded-full
                            text-[12px] font-medium
                            ${record.status === '已支付'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : record.status === '未支付'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }
                          `}
                        >
                          <span
                            className={`
                              w-1.5 h-1.5 rounded-full
                              ${record.status === '已支付' ? 'bg-emerald-500'
                                : record.status === '未支付' ? 'bg-amber-500'
                                : 'bg-purple-500'}
                            `}
                          />
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-0 text-gray-600">{record.enteredBy}</TableCell>
                      <TableCell className="px-4 py-0 sticky right-0 bg-white">
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                  onClick={() => openEdit(record)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>编辑</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>删除</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除？</AlertDialogTitle>
                                <AlertDialogDescription>此操作不可撤销，确定要删除这条费用记录吗？</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-lg">取消</AlertDialogCancel>
                                <AlertDialogAction className="rounded-lg bg-red-500 hover:bg-red-600" onClick={() => handleDelete(record.key)}>确认删除</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="h-14 bg-gray-50 border-t-2 border-gray-200 hover:bg-gray-50">
                    <TableCell colSpan={2} className="px-4 text-right font-semibold text-gray-700">合计</TableCell>
                    <TableCell className="px-4 text-right font-semibold font-mono tabular-nums text-primary">
                      ¥{filteredTotal.toLocaleString()}
                    </TableCell>
                    <TableCell colSpan={6} />
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Entry Dialog */}
      <Dialog open={entryVisible} onOpenChange={setEntryVisible}>
        <DialogContent className="sm:max-w-[600px] rounded-xl">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editingEntry ? '编辑费用记录' : '录入运营费用'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-1">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">成本类型</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="h-10 rounded-lg border-gray-200 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <SelectValue placeholder="请选择成本类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_TYPES.map((t) => <SelectItem key={t} value={t} className="text-[14px]">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">归属周期</Label>
                <Input
                  placeholder="如：2026-05"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="h-10 rounded-lg border-gray-200 text-[14px] placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">发生日期</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-10 rounded-lg border-gray-200 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">金额（元）</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="请输入金额"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-10 rounded-lg border-gray-200 text-[14px] placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">付款状态</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="h-10 rounded-lg border-gray-200 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <SelectValue placeholder="请选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="text-[14px]">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">分摊对象</Label>
                <Select value={formData.allocation || undefined} onValueChange={(v) => setFormData({ ...formData, allocation: v === '__none__' ? '' : v })}>
                  <SelectTrigger className="h-10 rounded-lg border-gray-200 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <SelectValue placeholder="请选择分摊对象" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__" className="text-[14px]">无</SelectItem>
                    {ALLOCATION_OPTIONS.map((a) => <SelectItem key={a} value={a} className="text-[14px]">{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">关联审批单号</Label>
                <Input
                  placeholder="如：AP2026050001"
                  value={formData.approvalNo}
                  onChange={(e) => setFormData({ ...formData, approvalNo: e.target.value })}
                  className="h-10 rounded-lg border-gray-200 text-[14px] placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-gray-600 block">录入人</Label>
                <Input
                  disabled
                  value={formData.enteredBy}
                  onChange={(e) => setFormData({ ...formData, enteredBy: e.target.value })}
                  className="h-10 rounded-lg border-gray-200 text-[14px] bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
            <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setEntryVisible(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="rounded-lg px-6"
              >
                保存
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
