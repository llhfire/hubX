import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  User,
  Users,
  CalendarDays,
  MoreHorizontal,
} from 'lucide-react';
import { useEmployee } from './EmployeeContext';
import {
  Employee,
  Position,
  JobLevel,
  ALL_POSITIONS,
  ALL_JOB_LEVELS,
  ALL_EMPLOYMENT_STATUSES,
  DEPARTMENTS,
  formatCurrency,
  getLevelColor,
  getStatusColor,
  calcWorkDays,
} from './mockData';

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          {icon}
          <span className="text-2xl font-bold">{value.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmployeeList() {
  const navigate = useNavigate();
  const { employees, addEmployee, updateEmployee } = useEmployee();

  // 搜索筛选
  const [keyword, setKeyword] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');

  // 弹窗
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // 表单状态
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // 筛选后数据
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      if (keyword) {
        const kw = keyword.toLowerCase();
        if (!e.name.toLowerCase().includes(kw) && !e.jobNumber.toLowerCase().includes(kw)) return false;
      }
      if (filterPosition && e.position !== filterPosition) return false;
      if (filterLevel && e.level !== filterLevel) return false;
      if (filterStatus && e.employmentStatus !== filterStatus) return false;
      if (filterDepartment && e.department !== filterDepartment) return false;
      return true;
    });
  }, [employees, keyword, filterPosition, filterLevel, filterStatus, filterDepartment]);

  // 摘要统计
  const currentMonth = new Date().toISOString().slice(0, 7);
  const stats = useMemo(() => {
    const total = employees.filter(e => e.employmentStatus !== '已离职').length;
    const thisMonthHire = employees.filter(e => e.hireDate.startsWith(currentMonth)).length;
    const thisMonthLeave = employees.filter(
      e => e.employmentStatus === '已离职' && (e as any).leaveDate?.startsWith(currentMonth),
    ).length;
    const onTrial = employees.filter(e => e.employmentStatus === '试用期').length;
    return { total, thisMonthHire, thisMonthLeave, onTrial };
  }, [employees, currentMonth]);

  // 操作
  const handleAdd = () => {
    setEditingEmployee(null);
    setFormValues({
      employmentStatus: '在职',
      hireDate: new Date().toISOString().slice(0, 10),
    });
    setDialogOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormValues({
      jobNumber: emp.jobNumber,
      name: emp.name,
      department: emp.department,
      position: emp.position,
      level: emp.level,
      employmentStatus: emp.employmentStatus,
      phone: emp.phone,
      email: emp.email || '',
      hireDate: emp.hireDate,
      contractEndDate: emp.contractEndDate || '',
      education: emp.education || '',
      school: emp.school || '',
    });
    setDialogOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formValues.jobNumber) { toast.error('请输入工号'); return; }
    if (!formValues.name) { toast.error('请输入姓名'); return; }
    if (!formValues.department) { toast.error('请选择部门'); return; }
    if (!formValues.position) { toast.error('请选择职位'); return; }
    if (!formValues.level) { toast.error('请选择职级'); return; }
    if (!formValues.employmentStatus) { toast.error('请选择状态'); return; }
    if (!formValues.phone) { toast.error('请输入手机号'); return; }
    if (!/^1[3-9]\d{9}$/.test(formValues.phone)) { toast.error('手机号格式不正确'); return; }
    if (!formValues.hireDate) { toast.error('请选择入职日期'); return; }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formValues as any);
      toast.success('编辑成功');
    } else {
      addEmployee(formValues as any);
      toast.success('新增成功');
    }
    setDialogOpen(false);
  };

  const handleRegularize = (emp: Employee) => {
    const today = new Date().toISOString().slice(0, 10);
    updateEmployee(emp.id, { employmentStatus: '已转正', 转正Date: today } as any);
    toast.success(`${emp.name} 已转正`);
  };

  const handleResign = (emp: Employee) => {
    updateEmployee(emp.id, { employmentStatus: '已离职' } as any);
    toast.success(`${emp.name} 已标记为离职`);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="在职总数" value={stats.total} icon={<User className="text-primary" />} />
        <StatCard title="本月入职" value={stats.thisMonthHire} icon={<Users className="text-green-500" />} />
        <StatCard title="本月离职" value={stats.thisMonthLeave} icon={<User className="text-red-500" />} />
        <StatCard title="试用期人数" value={stats.onTrial} icon={<CalendarDays className="text-orange-500" />} />
      </div>

      {/* 筛选 + 表格 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                className="w-[200px] pl-8"
                placeholder="搜索姓名或工号"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>
            <Select value={filterPosition || '__all__'} onValueChange={v => setFilterPosition(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="全部职位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部职位</SelectItem>
                {ALL_POSITIONS.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLevel || '__all__'} onValueChange={v => setFilterLevel(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="全部职级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部职级</SelectItem>
                {ALL_JOB_LEVELS.map(l => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus || '__all__'} onValueChange={v => setFilterStatus(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部状态</SelectItem>
                {ALL_EMPLOYMENT_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDepartment || '__all__'} onValueChange={v => setFilterDepartment(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="全部部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部部门</SelectItem>
                {DEPARTMENTS.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <Button onClick={handleAdd}>
                <Plus className="mr-1 size-4" />
                新增员工
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>工号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>MBTI</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>职级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>时薪</TableHead>
                  <TableHead>入职日期</TableHead>
                  <TableHead>入职天数</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{record.jobNumber}</TableCell>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        {record.personality?.mbti ? (
                          <Badge className="bg-purple-500 font-semibold">{record.personality.mbti.type}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.position}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(record.level)} style={{ fontWeight: 600 }}>
                          {record.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.employmentStatus)}>
                          {record.employmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary font-semibold">{formatCurrency(record.standardHourlyRate)}/h</span>
                      </TableCell>
                      <TableCell>{record.hireDate}</TableCell>
                      <TableCell>{calcWorkDays(record.hireDate)}天</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/employees/${record.id}`)}>
                            查看
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                            编辑
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleRegularize(record)}>
                                办理转正
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResign(record)}>
                                办理离职
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 新增 / 编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="size-4" />
              {editingEmployee ? '编辑员工' : '新增员工'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>工号</Label>
                <Input placeholder="如 EMP017" value={formValues.jobNumber || ''} onChange={e => handleFormChange('jobNumber', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>姓名</Label>
                <Input placeholder="请输入姓名" value={formValues.name || ''} onChange={e => handleFormChange('name', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>所属部门</Label>
                <Select value={formValues.department || ''} onValueChange={v => handleFormChange('department', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>职位</Label>
                <Select value={formValues.position || ''} onValueChange={v => handleFormChange('position', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择职位" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_POSITIONS.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>职级</Label>
                <Select value={formValues.level || ''} onValueChange={v => handleFormChange('level', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择职级" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_JOB_LEVELS.map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>在职状态</Label>
                <Select value={formValues.employmentStatus || ''} onValueChange={v => handleFormChange('employmentStatus', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_EMPLOYMENT_STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>手机号</Label>
                <Input placeholder="请输入手机号" value={formValues.phone || ''} onChange={e => handleFormChange('phone', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>邮箱</Label>
                <Input placeholder="请输入邮箱" value={formValues.email || ''} onChange={e => handleFormChange('email', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>入职日期</Label>
                <Input type="date" value={formValues.hireDate || ''} onChange={e => handleFormChange('hireDate', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>合同到期日</Label>
                <Input type="date" value={formValues.contractEndDate || ''} onChange={e => handleFormChange('contractEndDate', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>学历</Label>
                <Input placeholder="如 本科/硕士/大专" value={formValues.education || ''} onChange={e => handleFormChange('education', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>毕业院校</Label>
                <Input placeholder="请输入毕业院校" value={formValues.school || ''} onChange={e => handleFormChange('school', e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editingEmployee ? '保存' : '新增'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
