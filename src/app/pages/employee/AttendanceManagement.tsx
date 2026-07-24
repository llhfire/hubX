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
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import {
  Plus,
  Check,
  CalendarDays,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useEmployee } from './EmployeeContext';
import {
  AttendanceRecord,
  LeaveType,
  AttendanceStatus,
  ALL_LEAVE_TYPES,
  ALL_EMPLOYMENT_STATUSES,
} from './mockData';

const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  '年假': 'bg-blue-500',
  '事假': 'bg-orange-500',
  '病假': 'bg-red-500',
  '调休': 'bg-teal-500',
  '婚宴': 'bg-pink-500',
  '产宴': 'bg-pink-500',
  '丧宴': 'bg-gray-500',
  '加班': 'bg-green-500',
};

const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  '已批准': 'bg-green-500',
  '待审批': 'bg-orange-500',
  '已拒绝': 'bg-red-500',
  '已撤销': 'bg-gray-500',
};

function getStatusBadgeClass(s: AttendanceStatus) {
  return ATTENDANCE_STATUS_COLORS[s] || 'bg-gray-500';
}

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

export function AttendanceManagement() {
  const { attendance, employees, addAttendance, approveAttendance, rejectAttendance } = useEmployee();

  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formType, setFormType] = useState<LeaveType>('年假');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formDays, setFormDays] = useState('');
  const [formReason, setFormReason] = useState('');

  // 筛选
  const filteredRecords = useMemo(() => {
    return attendance.filter(r => {
      if (filterType && r.type !== filterType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterMonth && !r.startDate.startsWith(filterMonth)) return false;
      return true;
    });
  }, [attendance, filterType, filterStatus, filterMonth]);

  // 摘要
  const stats = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const thisMonthRecords = attendance.filter(r => r.startDate.startsWith(thisMonth) && r.status === '已批准');
    const totalLeaveDays = thisMonthRecords.filter(r => r.type !== '加班').reduce((sum, r) => sum + r.days, 0);
    const totalOvertimeHours = thisMonthRecords
      .filter(r => r.type === '加班')
      .reduce((sum, r) => sum + r.days * 8, 0);
    const pendingCount = attendance.filter(r => r.status === '待审批').length;
    const attendedEmployees = new Set<string>(thisMonthRecords.map(r => r.employeeId));
    return { totalLeaveDays, totalOvertimeHours, pendingCount, attendedCount: attendedEmployees.size };
  }, [attendance]);

  const handleAdd = () => {
    setFormEmployeeId('');
    setFormType('年假');
    setFormStartDate('');
    setFormEndDate('');
    setFormDays('');
    setFormReason('');
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formEmployeeId) {
      toast.error('请选择申请人');
      return;
    }
    if (!formStartDate || !formEndDate) {
      toast.error('请选择日期范围');
      return;
    }
    if (!formDays || !/^\d+(\.5)?$/.test(formDays)) {
      toast.error('请输入正确的天数');
      return;
    }
    if (!formReason) {
      toast.error('请输入事由');
      return;
    }
    addAttendance({
      employeeId: formEmployeeId,
      employeeName: employees.find(e => e.id === formEmployeeId)?.name || '',
      type: formType,
      startDate: formStartDate,
      endDate: formEndDate,
      days: parseFloat(formDays),
      reason: formReason,
      status: '待审批',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    toast.success('申请已提交，等待审批');
    setDialogOpen(false);
  };

  const handleApprove = (id: string) => {
    approveAttendance(id, '当前管理员');
    toast.success('已批准');
  };

  const handleReject = (id: string) => {
    rejectAttendance(id, '当前管理员');
    toast.success('已拒绝');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="本月请假天数"
          value={stats.totalLeaveDays}
          suffix="天"
          icon={<CalendarDays className="text-orange-500" />}
        />
        <StatCard
          title="本月加班时长"
          value={stats.totalOvertimeHours}
          suffix="小时"
          icon={<Clock className="text-green-500" />}
        />
        <StatCard
          title="待审批申请"
          value={stats.pendingCount}
          suffix="条"
          icon={<AlertCircle className="text-orange-500" />}
        />
        <StatCard
          title="本月有考勤记录"
          value={stats.attendedCount}
          suffix="人"
          icon={<Check className="text-primary" />}
        />
      </div>

      {/* 筛选 + 列表 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <Input
              type="month"
              className="w-[150px]"
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
            />
            <Select value={filterType || '__all__'} onValueChange={v => setFilterType(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部类型</SelectItem>
                {ALL_LEAVE_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus || '__all__'} onValueChange={v => setFilterStatus(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部状态</SelectItem>
                {(['已批准', '待审批', '已拒绝', '已撤销'] as AttendanceStatus[]).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <Button onClick={handleAdd}>
                <Plus className="mr-1 size-4" />
                新增申请
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>申请人</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>开始日期</TableHead>
                <TableHead>结束日期</TableHead>
                <TableHead>天数</TableHead>
                <TableHead>事由</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>
                      <Badge className={LEAVE_TYPE_COLORS[record.type]}>{record.type}</Badge>
                    </TableCell>
                    <TableCell>{record.startDate}</TableCell>
                    <TableCell>{record.endDate}</TableCell>
                    <TableCell>{record.days}天</TableCell>
                    <TableCell className="max-w-[200px] truncate">{record.reason}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(record.status)}>{record.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {record.status !== '待审批' ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleApprove(record.id)}>
                            批准
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleReject(record.id)}>
                            拒绝
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增申请弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-4" />
              新增请假/加班申请
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>申请人</Label>
              <Select value={formEmployeeId} onValueChange={setFormEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择申请人" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter(e => e.employmentStatus !== '已离职')
                    .map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}（{e.department}/{e.position}）
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>类型</Label>
              <RadioGroup value={formType} onValueChange={v => setFormType(v as LeaveType)} className="flex flex-wrap gap-4">
                {ALL_LEAVE_TYPES.map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <RadioGroupItem value={t} id={`type-${t}`} />
                    <Label htmlFor={`type-${t}`}>{t}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>开始日期</Label>
                <Input type="date" value={formStartDate} onChange={e => setFormStartDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>结束日期</Label>
                <Input type="date" value={formEndDate} onChange={e => setFormEndDate(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>天数</Label>
              <Input placeholder="如 1, 0.5, 3" value={formDays} onChange={e => setFormDays(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>事由</Label>
              <Textarea placeholder="请输入请假/加班事由" rows={4} value={formReason} onChange={e => setFormReason(e.target.value)} />
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
