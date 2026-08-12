import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, FileText, AlertTriangle, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { initialExpenseRecords, defaultCategories, sourceTypeMap } from '../mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6b7280'];

export default function Dashboard() {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // 本月费用
  const thisMonthRecords = useMemo(
    () => initialExpenseRecords.filter(r => r.expenseDate.startsWith(currentMonth)),
    [currentMonth]
  );
  const thisMonthTotal = thisMonthRecords.reduce((sum, r) => sum + r.amount, 0);

  // 上月费用
  const lastMonth = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
  }, []);
  const lastMonthRecords = useMemo(
    () => initialExpenseRecords.filter(r => r.expenseDate.startsWith(lastMonth)),
    [lastMonth]
  );
  const lastMonthTotal = lastMonthRecords.reduce((sum, r) => sum + r.amount, 0);

  const monthChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;

  // 本年费用
  const currentYear = new Date().getFullYear().toString();
  const yearRecords = useMemo(
    () => initialExpenseRecords.filter(r => r.expenseDate.startsWith(currentYear)),
    [currentYear]
  );
  const yearTotal = yearRecords.reduce((sum, r) => sum + r.amount, 0);

  // 按一级分类汇总
  const categoryPieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const record of yearRecords) {
      const name = record.categoryName;
      map.set(name, (map.get(name) ?? 0) + record.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [yearRecords]);

  // 按月度汇总
  const monthlyBarData = useMemo(() => {
    const months: { month: string; amount: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (6 - i));
      const key = d.toISOString().slice(0, 7);
      const label = `${d.getMonth() + 1}月`;
      const total = initialExpenseRecords
        .filter(r => r.expenseDate.startsWith(key))
        .reduce((sum, r) => sum + r.amount, 0);
      months.push({ month: label, amount: total });
    }
    return months;
  }, []);

  // 按数据来源汇总
  const sourcePieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const record of yearRecords) {
      const label = sourceTypeMap[record.sourceType].label;
      map.set(label, (map.get(label) ?? 0) + record.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [yearRecords]);

  // 近 5 条记录
  const recentRecords = useMemo(
    () => [...initialExpenseRecords].sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)).slice(0, 5),
    []
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">运营成本总览</h2>

      {/* 汇总卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">本月费用</span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">¥{thisMonthTotal.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {monthChange >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-red-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-green-500" />
              )}
              <span className={`text-xs ${monthChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                环比 {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">（vs 上月 ¥{lastMonthTotal.toLocaleString()}）</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">本年累计</span>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">¥{yearTotal.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">共 {yearRecords.length} 条记录</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">费用分类数</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{defaultCategories.length}</div>
            <div className="text-xs text-muted-foreground mt-1">一级分类</div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 月度趋势 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">近 7 个月费用趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, '费用']} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 分类饼图 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">费用分类占比（本年）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 最近记录 + 来源分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">最近费用记录</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">编号</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">日期</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">分类</th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">金额</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">来源</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{r.expenseNo}</td>
                      <td className="px-4 py-2 text-muted-foreground">{r.expenseDate}</td>
                      <td className="px-4 py-2">{r.categoryName} / {r.subCategoryName}</td>
                      <td className="px-4 py-2 text-right font-medium">¥{r.amount.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className="text-[10px]">{sourceTypeMap[r.sourceType].label}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">数据来源分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sourcePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {sourcePieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
