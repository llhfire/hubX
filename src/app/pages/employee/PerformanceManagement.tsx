import { useState, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import {
  Plus,
  Star,
  Users,
  Trophy,
  CalendarDays,
} from 'lucide-react';
import { useEmployee } from './EmployeeContext';
import {
  PerformanceReview,
  PerformanceRank,
  ReviewPeriod,
  calcPerformance,
  getRankColor,
} from './mockData';

const RANK_META: Record<PerformanceRank, { color: string; label: string }> = {
  'S': { color: 'bg-purple-500', label: '卓越' },
  'A': { color: 'bg-green-500', label: '优秀' },
  'B': { color: 'bg-blue-500', label: '良好' },
  'C': { color: 'bg-orange-500', label: '合格' },
  'D': { color: 'bg-red-500', label: '待改进' },
};

function StatCard({ title, value, suffix, icon }: { title: string; value: number; suffix: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          {icon}
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">{suffix}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceManagement() {
  const { performanceReviews, employees, addPerformance } = useEmployee();

  const [filterPeriod, setFilterPeriod] = useState<string>('');
  const [filterRank, setFilterRank] = useState<string>('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formPeriod, setFormPeriod] = useState<ReviewPeriod>('季度');
  const [formPeriodLabel, setFormPeriodLabel] = useState('');
  const [kpiScore, setKpiScore] = useState(75);
  const [behaviorScore, setBehaviorScore] = useState(75);
  const [formEvaluator, setFormEvaluator] = useState('');
  const [formComment, setFormComment] = useState('');

  const previewPerf = calcPerformance(kpiScore, behaviorScore);

  // 筛选
  const filteredReviews = useMemo(() => {
    return performanceReviews.filter(r => {
      if (filterPeriod && r.period !== filterPeriod) return false;
      if (filterRank && r.rank !== filterRank) return false;
      return true;
    });
  }, [performanceReviews, filterPeriod, filterRank]);

  // 摘要
  const stats = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthReviews = performanceReviews.filter(r => r.periodLabel === thisMonth);
    const quarter = `2026-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
    const quarterReviews = performanceReviews.filter(r => r.periodLabel === quarter);

    const avgKpi =
      performanceReviews.length > 0
        ? Math.round(performanceReviews.reduce((s, r) => s + r.kpiScore, 0) / performanceReviews.length)
        : 0;
    const topRanked = performanceReviews.filter(r => r.rank === 'S' || r.rank === 'A').length;
    const topRate = performanceReviews.length > 0 ? Math.round((topRanked / performanceReviews.length) * 100) : 0;

    return {
      monthCount: monthReviews.length,
      quarterCount: quarterReviews.length,
      avgKpi,
      topRate,
    };
  }, [performanceReviews]);

  const handleAdd = () => {
    setFormEmployeeId('');
    setFormPeriod('季度');
    setFormPeriodLabel('');
    setKpiScore(75);
    setBehaviorScore(75);
    setFormEvaluator('');
    setFormComment('');
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formEmployeeId) { toast.error('请选择被考核人'); return; }
    if (!formPeriod) { toast.error('请选择周期'); return; }
    if (!formPeriodLabel) { toast.error('请输入考核标签'); return; }
    if (!formEvaluator) { toast.error('请输入考核人'); return; }

    const { totalScore, rank } = calcPerformance(kpiScore, behaviorScore);
    addPerformance({
      employeeId: formEmployeeId,
      employeeName: employees.find(e => e.id === formEmployeeId)?.name || '',
      department: employees.find(e => e.id === formEmployeeId)?.department || '',
      period: formPeriod,
      periodLabel: formPeriodLabel,
      kpiScore,
      behaviorScore,
      totalScore,
      rank,
      evaluator: formEvaluator,
      comment: formComment,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    toast.success('考核已成功提交');
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="本月考核人数" value={stats.monthCount} suffix="人" icon={<Users className="text-primary" />} />
        <StatCard title="本季度考核人数" value={stats.quarterCount} suffix="人" icon={<CalendarDays className="text-teal-500" />} />
        <StatCard title="平均 KPI 得分" value={stats.avgKpi} suffix="分" icon={<Star className="text-orange-500" />} />
        <StatCard title="S/A 评级占比" value={stats.topRate} suffix="%" icon={<Trophy className="text-purple-500" />} />
      </div>

      {/* 筛选 + 列表 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <Select value={filterPeriod || '__all__'} onValueChange={v => setFilterPeriod(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部周期</SelectItem>
                <SelectItem value="月度">月度</SelectItem>
                <SelectItem value="季度">季度</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRank || '__all__'} onValueChange={v => setFilterRank(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部评级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部评级</SelectItem>
                {(['S', 'A', 'B', 'C', 'D'] as PerformanceRank[]).map(r => (
                  <SelectItem key={r} value={r}>{r} · {RANK_META[r].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <Button onClick={handleAdd}>
                <Plus className="mr-1 size-4" />
                新增考核
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>被考核人</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>周期</TableHead>
                <TableHead>考核月份/季</TableHead>
                <TableHead>KPI分</TableHead>
                <TableHead>行为分</TableHead>
                <TableHead>综合分</TableHead>
                <TableHead>评级</TableHead>
                <TableHead>考核人</TableHead>
                <TableHead>评语</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.period}</Badge>
                    </TableCell>
                    <TableCell>{record.periodLabel}</TableCell>
                    <TableCell className="font-semibold">{record.kpiScore}</TableCell>
                    <TableCell className="font-semibold">{record.behaviorScore}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${record.totalScore >= 80 ? 'text-green-600' : record.totalScore >= 70 ? 'text-blue-600' : 'text-orange-500'}`}>
                        {record.totalScore}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={RANK_META[record.rank].color} style={{ fontWeight: 700 }}>
                        {record.rank} · {RANK_META[record.rank].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.evaluator}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{record.comment}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增考核弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-4" />
              新增绩效考核
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label>被考核人</Label>
              <Select value={formEmployeeId} onValueChange={setFormEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择被考核人" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter(e => e.employmentStatus !== '已离职')
                    .map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}（{e.department}/{e.position}/{e.level}）
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>考核周期</Label>
                <Select value={formPeriod} onValueChange={v => setFormPeriod(v as ReviewPeriod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="月度">月度</SelectItem>
                    <SelectItem value="季度">季度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>考核标签</Label>
                <Input placeholder="如 2026-Q3 或 2026-07" value={formPeriodLabel} onChange={e => setFormPeriodLabel(e.target.value)} />
              </div>
            </div>

            {/* KPI 滑块 */}
            <div className="grid gap-2">
              <Label>KPI 完成度 — {kpiScore} 分</Label>
              <Slider
                min={0}
                max={100}
                value={[kpiScore]}
                onValueChange={([v]) => setKpiScore(v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span><span>60</span><span>80</span><span>100</span>
              </div>
            </div>

            {/* 行为滑块 */}
            <div className="grid gap-2">
              <Label>行为评价 — {behaviorScore} 分</Label>
              <Slider
                min={0}
                max={100}
                value={[behaviorScore]}
                onValueChange={([v]) => setBehaviorScore(v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span><span>60</span><span>80</span><span>100</span>
              </div>
            </div>

            {/* 预览 */}
            <div className="bg-muted rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">综合得分预览：</span>
                  <Badge
                    className={getRankColor(previewPerf.rank)}
                    style={{ fontWeight: 700, fontSize: 14 }}
                  >
                    {previewPerf.totalScore} 分
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">评级：</span>
                  <Badge className={getRankColor(previewPerf.rank)} style={{ fontWeight: 700 }}>
                    {previewPerf.rank} · {RANK_META[previewPerf.rank]?.label || ''}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>考核人</Label>
              <Input placeholder="请输入考核人姓名" value={formEvaluator} onChange={e => setFormEvaluator(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>评语</Label>
              <Textarea placeholder="请输入评语（可选）" rows={4} value={formComment} onChange={e => setFormComment(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
