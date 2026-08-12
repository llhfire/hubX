import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { initialExpenseRecords, defaultCategories, projectOptions, departmentOptions } from '../mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6b7280'];

export default function ReportPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const yearRecords = useMemo(
    () => initialExpenseRecords.filter(r => r.expenseDate.startsWith(year)),
    [year]
  );

  // ── 月度汇总 ──────────────────────────────────────────────
  const monthlySummary = useMemo(() => {
    const months: { month: string; total: number; [key: string]: any }[] = [];
    for (let i = 1; i <= 12; i++) {
      const key = `${year}-${String(i).padStart(2, '0')}`;
      const label = `${i}月`;
      const monthRecords = yearRecords.filter(r => r.expenseDate.startsWith(key));
      const total = monthRecords.reduce((sum, r) => sum + r.amount, 0);
      const row: any = { month: label, total };
      for (const cat of defaultCategories) {
        row[cat.name] = monthRecords.filter(r => r.categoryId === cat.id).reduce((sum, r) => sum + r.amount, 0);
      }
      months.push(row);
    }
    return months;
  }, [year, yearRecords]);

  // ── 年度分类汇总 ──────────────────────────────────────────
  const categorySummary = useMemo(() => {
    return defaultCategories.map((cat) => {
      const total = yearRecords.filter(r => r.categoryId === cat.id).reduce((sum, r) => sum + r.amount, 0);
      return { name: cat.name, amount: total };
    }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [yearRecords]);

  const yearTotal = categorySummary.reduce((sum, c) => sum + c.amount, 0);

  // ── 项目成本报表 ──────────────────────────────────────────
  const projectCostData = useMemo(() => {
    return projectOptions.map((proj) => {
      const records = yearRecords.filter(r => r.projectId === proj.id);
      const total = records.reduce((sum, r) => sum + r.amount, 0);
      return { name: proj.name, amount: total, count: records.length };
    }).filter(p => p.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [yearRecords]);

  // ── 部门成本报表 ──────────────────────────────────────────
  const departmentCostData = useMemo(() => {
    return departmentOptions.map((dept) => {
      const records = yearRecords.filter(r => r.departmentId === dept.id);
      const total = records.reduce((sum, r) => sum + r.amount, 0);
      return { name: dept.name, amount: total, count: records.length };
    }).filter(d => d.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [yearRecords]);

  const handleExport = () => {
    toast.success('导出功能开发中');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">费用报表</h2>
        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026年</SelectItem>
              <SelectItem value="2025">2025年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">汇总报表</TabsTrigger>
          <TabsTrigger value="trend">趋势分析</TabsTrigger>
          <TabsTrigger value="project">项目成本</TabsTrigger>
          <TabsTrigger value="department">部门成本</TabsTrigger>
        </TabsList>

        {/* 汇总报表 */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">年度费用汇总</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">¥{yearTotal.toLocaleString()}</div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={categorySummary} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {categorySummary.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">分类明细</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>费用分类</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySummary.map((cat, i) => (
                      <TableRow key={cat.name}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell className="text-right">¥{cat.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{(cat.amount / yearTotal * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 趋势分析 */}
        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">月度费用趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlySummary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                  <Legend />
                  {defaultCategories.slice(0, 5).map((cat, i) => (
                    <Bar key={cat.id} dataKey={cat.name} stackId="a" fill={COLORS[i]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 项目成本 */}
        <TabsContent value="project" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">项目成本报表</CardTitle>
            </CardHeader>
            <CardContent>
              {projectCostData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">暂无项目费用数据</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={projectCostData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="name" fontSize={12} width={160} />
                      <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>项目名称</TableHead>
                        <TableHead className="text-right">费用金额</TableHead>
                        <TableHead className="text-right">记录条数</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectCostData.map((p) => (
                        <TableRow key={p.name}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-right">¥{p.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{p.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 部门成本 */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">部门成本报表</CardTitle>
            </CardHeader>
            <CardContent>
              {departmentCostData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">暂无部门费用数据</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={departmentCostData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="name" fontSize={12} width={120} />
                      <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                      <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>部门名称</TableHead>
                        <TableHead className="text-right">费用金额</TableHead>
                        <TableHead className="text-right">记录条数</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentCostData.map((d) => (
                        <TableRow key={d.name}>
                          <TableCell className="font-medium">{d.name}</TableCell>
                          <TableCell className="text-right">¥{d.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{d.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
