import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Users, Plus, Search, Download, Eye, Edit, Filter } from 'lucide-react'

interface Emp {
  id: string; employeeNo: string; name: string; gender: string; phone: string
  departmentName: string; bizLineName: string; position: string; level: string
  joinDate: string; trialStatus: string; status: string; baseSalary: number
  directLeaderName: string; avatar: string
}

const MOCK_EMPLOYEES: Emp[] = [
  { id: 'e-1', employeeNo: 'HX-2025-001', name: '张伟', gender: '男', phone: '138****1234', departmentName: '技术部', bizLineName: '软件定制开发', position: '后端开发工程师', level: 'L8', joinDate: '2024-03-15', trialStatus: '已通过', status: '在职', baseSalary: 22000, directLeaderName: '张伟', avatar: '张' },
  { id: 'e-2', employeeNo: 'HX-2025-002', name: '李娜', gender: '女', phone: '139****5678', departmentName: '设计部', bizLineName: '软件定制开发', position: 'UI 设计师', level: 'L6', joinDate: '2024-06-01', trialStatus: '已通过', status: '在职', baseSalary: 15000, directLeaderName: '李娜', avatar: '李' },
  { id: 'e-3', employeeNo: 'HX-2025-003', name: '王磊', gender: '男', phone: '137****9012', departmentName: '技术部', bizLineName: '软件定制开发', position: '前端开发工程师', level: 'L7', joinDate: '2024-04-20', trialStatus: '已通过', status: '在职', baseSalary: 18000, directLeaderName: '王磊', avatar: '王' },
  { id: 'e-4', employeeNo: 'HX-2025-004', name: '赵敏', gender: '女', phone: '136****3456', departmentName: '技术部', bizLineName: '软件定制开发', position: '测试工程师', level: 'L5', joinDate: '2025-01-10', trialStatus: '已通过', status: '在职', baseSalary: 12000, directLeaderName: '赵敏', avatar: '赵' },
  { id: 'e-5', employeeNo: 'HX-2025-005', name: '陈浩', gender: '男', phone: '135****7890', departmentName: '技术部', bizLineName: '软件定制开发', position: '后端开发工程师', level: 'L7', joinDate: '2024-09-01', trialStatus: '已通过', status: '在职', baseSalary: 20000, directLeaderName: '张伟', avatar: '陈' },
  { id: 'e-6', employeeNo: 'HX-2026-006', name: '刘洋', gender: '男', phone: '134****2345', departmentName: '销售部', bizLineName: '移民业务', position: '销售经理', level: 'L6', joinDate: '2025-03-01', trialStatus: '已通过', status: '在职', baseSalary: 14000, directLeaderName: '刘洋', avatar: '刘' },
  { id: 'e-7', employeeNo: 'HX-2026-007', name: '周婷', gender: '女', phone: '133****6789', departmentName: '运营部', bizLineName: 'IP打造', position: '运营专员', level: 'L6', joinDate: '2025-02-15', trialStatus: '已通过', status: '在职', baseSalary: 13000, directLeaderName: '周婷', avatar: '周' },
  { id: 'e-8', employeeNo: 'HX-2026-008', name: '孙丽', gender: '女', phone: '132****0123', departmentName: '行政财务部', bizLineName: '软件定制开发', position: 'HR 专员', level: 'L6', joinDate: '2025-04-01', trialStatus: '已通过', status: '在职', baseSalary: 12000, directLeaderName: '孙丽', avatar: '孙' },
  { id: 'e-9', employeeNo: 'HX-2026-009', name: '黄丽', gender: '女', phone: '131****4567', departmentName: '技术部', bizLineName: '电商业务', position: '前端开发工程师', level: 'L6', joinDate: '2026-07-01', trialStatus: '试岗中', status: '试岗中', baseSalary: 0, directLeaderName: '王磊', avatar: '黄' },
  { id: 'e-10', employeeNo: 'HX-2026-010', name: '吴强', gender: '男', phone: '130****8901', departmentName: '销售部', bizLineName: '电商业务', position: '销售经理', level: 'L5', joinDate: '2026-07-10', trialStatus: '试岗中', status: '试岗中', baseSalary: 0, directLeaderName: '刘洋', avatar: '吴' },
  { id: 'e-11', employeeNo: 'HX-2025-011', name: '郑明', gender: '男', phone: '129****2345', departmentName: '产品部', bizLineName: '软件定制开发', position: '产品经理', level: 'L6', joinDate: '2024-08-01', trialStatus: '已通过', status: '在职', baseSalary: 16000, directLeaderName: '陈强', avatar: '郑' },
  { id: 'e-12', employeeNo: 'HX-2024-012', name: '杨帆', gender: '男', phone: '128****6789', departmentName: '技术部', bizLineName: '软件定制开发', position: '后端开发工程师', level: 'L6', joinDate: '2023-06-15', trialStatus: '已通过', status: '已离职', baseSalary: 16000, directLeaderName: '张伟', avatar: '杨' },
]

const statusColor: Record<string, string> = {
  '在职': 'bg-green-100 text-green-700',
  '试岗中': 'bg-amber-100 text-amber-700',
  '试用期': 'bg-blue-100 text-blue-700',
  '已离职': 'bg-slate-100 text-slate-500',
}

export function EmployeeList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')

  const filtered = useMemo(() => {
    return MOCK_EMPLOYEES.filter((e) => {
      const matchSearch = !search || e.name.includes(search) || e.employeeNo.includes(search) || e.position.includes(search)
      const matchStatus = statusFilter === 'all' || e.status === statusFilter
      const matchDept = deptFilter === 'all' || e.departmentName === deptFilter
      return matchSearch && matchStatus && matchDept
    })
  }, [search, statusFilter, deptFilter])

  const departments = [...new Set(MOCK_EMPLOYEES.map((e) => e.departmentName))]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">员工花名册</h1>
          <Badge variant="secondary">{filtered.length} 人</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />导出</Button>
          <Button className="gap-2"><Plus className="h-4 w-4" />新增员工</Button>
        </div>
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="搜索姓名、工号、岗位..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="状态" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="在职">在职</SelectItem>
                <SelectItem value="试岗中">试岗中</SelectItem>
                <SelectItem value="试用期">试用期</SelectItem>
                <SelectItem value="已离职">已离职</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="部门" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部部门</SelectItem>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 员工表格 */}
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工</TableHead>
                <TableHead>工号</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>业务线</TableHead>
                <TableHead>岗位/职级</TableHead>
                <TableHead>入职日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/hr/employees/${emp.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">{emp.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{emp.name}</div>
                        <div className="text-xs text-slate-400">{emp.gender} · {emp.phone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{emp.employeeNo}</TableCell>
                  <TableCell className="text-sm">{emp.departmentName}</TableCell>
                  <TableCell className="text-sm">{emp.bizLineName}</TableCell>
                  <TableCell>
                    <div className="text-sm">{emp.position}</div>
                    <div className="text-xs text-slate-400">{emp.level}</div>
                  </TableCell>
                  <TableCell className="text-sm">{emp.joinDate}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${statusColor[emp.status]}`}>{emp.status}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/hr/employees/${emp.id}`) }}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
