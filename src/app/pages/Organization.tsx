import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../components/ui/alert-dialog';

// 部门树形数据
const departmentTree = [
  {
    key: '1',
    title: '总公司',
    value: '1',
    children: [
      {
        key: '1-1',
        title: '技术部',
        value: '1-1',
        children: [
          { key: '1-1-1', title: '前端组', value: '1-1-1' },
          { key: '1-1-2', title: '后端组', value: '1-1-2' },
        ],
      },
      {
        key: '1-2',
        title: '销售部',
        value: '1-2',
        children: [
          { key: '1-2-1', title: '华东区', value: '1-2-1' },
          { key: '1-2-2', title: '华北区', value: '1-2-2' },
        ],
      },
      { key: '1-3', title: '行政部', value: '1-3' },
    ],
  },
];

// 模拟部门数据
const mockDepartments = [
  { id: '1', name: '总公司', parentName: '-', level: 1, memberCount: 120, leader: '张三', status: '启用' },
  { id: '1-1', name: '技术部', parentName: '总公司', level: 2, memberCount: 50, leader: '李四', status: '启用' },
  { id: '1-1-1', name: '前端组', parentName: '技术部', level: 3, memberCount: 20, leader: '王五', status: '启用' },
  { id: '1-1-2', name: '后端组', parentName: '技术部', level: 3, memberCount: 30, leader: '赵六', status: '启用' },
  { id: '1-2', name: '销售部', parentName: '总公司', level: 2, memberCount: 40, leader: '钱七', status: '启用' },
  { id: '1-2-1', name: '华东区', parentName: '销售部', level: 3, memberCount: 20, leader: '孙八', status: '启用' },
  { id: '1-2-2', name: '华北区', parentName: '销售部', level: 3, memberCount: 20, leader: '周九', status: '启用' },
  { id: '1-3', name: '行政部', parentName: '总公司', level: 2, memberCount: 30, leader: '吴十', status: '启用' },
];

// 模拟员工数据
const mockEmployees = [
  {
    id: '1',
    name: '张三',
    jobNumber: 'EMP001',
    department: '总公司',
    position: '总经理',
    phone: '13800138001',
    email: 'zhangsan@company.com',
    status: '在职',
    hireDate: '2020-01-01',
    leaveDate: '',
  },
  {
    id: '2',
    name: '李四',
    jobNumber: 'EMP002',
    department: '技术部',
    position: '技术总监',
    phone: '13800138002',
    email: 'lisi@company.com',
    status: '在职',
    hireDate: '2020-03-15',
    leaveDate: '',
  },
  {
    id: '3',
    name: '王五',
    jobNumber: 'EMP003',
    department: '前端组',
    position: '前端主管',
    phone: '13800138003',
    email: 'wangwu@company.com',
    status: '在职',
    hireDate: '2020-06-01',
    leaveDate: '',
  },
  {
    id: '4',
    name: '赵六',
    jobNumber: 'EMP004',
    department: '后端组',
    position: '后端主管',
    phone: '13800138004',
    email: 'zhaoliu@company.com',
    status: '在职',
    hireDate: '2020-08-20',
    leaveDate: '',
  },
  {
    id: '5',
    name: '钱七',
    jobNumber: 'EMP005',
    department: '销售部',
    position: '销售总监',
    phone: '13800138005',
    email: 'qianqi@company.com',
    status: '在职',
    hireDate: '2021-01-10',
    leaveDate: '',
  },
];

// 递归渲染树形选项
function renderTreeOptions(nodes: typeof departmentTree, depth = 0): React.ReactNode[] {
  return nodes.flatMap((node) => [
    <SelectItem key={node.value} value={node.value}>
      {'  '.repeat(depth)}{node.title}
    </SelectItem>,
    ...(node.children ? renderTreeOptions(node.children, depth + 1) : []),
  ]);
}

const initialDepartmentForm = { name: '', parentId: '', leader: '', status: '启用' };
const initialEmployeeForm = {
  jobNumber: '',
  name: '',
  department: '',
  position: '',
  phone: '',
  email: '',
  status: '在职',
  hireDate: '',
};

export function Organization() {
  const [activeTab, setActiveTab] = useState('department');
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [departmentForm, setDepartmentForm] = useState(initialDepartmentForm);
  const [employeeForm, setEmployeeForm] = useState(initialEmployeeForm);

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentForm(initialDepartmentForm);
    setDepartmentModalVisible(true);
  };

  const handleEditDepartment = (record: any) => {
    setEditingDepartment(record);
    setDepartmentForm({
      name: record.name,
      parentId: record.parentId || '',
      leader: record.leader,
      status: record.status,
    });
    setDepartmentModalVisible(true);
  };

  const handleDeleteDepartment = (_id: string) => {
    toast.success('删除成功');
  };

  const handleDepartmentSubmit = () => {
    if (!departmentForm.name.trim()) {
      toast.error('请输入部门名称');
      return;
    }
    toast.success(editingDepartment ? '编辑成功' : '新建成功');
    setDepartmentModalVisible(false);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm(initialEmployeeForm);
    setEmployeeModalVisible(true);
  };

  const handleEditEmployee = (record: any) => {
    setEditingEmployee(record);
    setEmployeeForm({
      jobNumber: record.jobNumber,
      name: record.name,
      department: record.department,
      position: record.position,
      phone: record.phone,
      email: record.email,
      status: record.status,
      hireDate: record.hireDate,
    });
    setEmployeeModalVisible(true);
  };

  const handleDeleteEmployee = (_id: string) => {
    toast.success('删除成功');
  };

  const handleEmployeeSubmit = () => {
    if (!employeeForm.jobNumber.trim() || !employeeForm.name.trim() || !employeeForm.phone.trim()) {
      toast.error('请填写必填字段');
      return;
    }
    toast.success(editingEmployee ? '编辑成功' : '新建成功');
    setEmployeeModalVisible(false);
  };

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="department">部门管理</TabsTrigger>
              <TabsTrigger value="employee">人员管理</TabsTrigger>
            </TabsList>

            <TabsContent value="department">
              <div className="mb-4">
                <Button onClick={handleAddDepartment}>
                  <Plus className="mr-2 h-4 w-4" />
                  新建部门
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>部门名称</TableHead>
                    <TableHead>上级部门</TableHead>
                    <TableHead>层级</TableHead>
                    <TableHead>人员数量</TableHead>
                    <TableHead>负责人</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDepartments.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.parentName}</TableCell>
                      <TableCell>第{record.level}级</TableCell>
                      <TableCell>{record.memberCount}人</TableCell>
                      <TableCell>{record.leader}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === '启用' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDepartment(record)}
                          >
                            <Pencil className="h-4 w-4" />
                            编辑
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                                删除
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除该部门吗?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDepartment(record.id)}>
                                  确定
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="employee">
              <div className="mb-4">
                <Button onClick={handleAddEmployee}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增员工
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>工号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>入职日期</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmployees.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.jobNumber}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>{record.phone}</TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === '在职' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.hireDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(record)}
                          >
                            <Pencil className="h-4 w-4" />
                            编辑
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                                删除
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除该员工吗?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEmployee(record.id)}>
                                  确定
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 部门编辑弹窗 */}
      <Dialog open={departmentModalVisible} onOpenChange={setDepartmentModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? '编辑部门' : '新建部门'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>部门名称 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入部门名称"
                value={departmentForm.name}
                onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>上级部门</Label>
              <Select
                value={departmentForm.parentId}
                onValueChange={(val) => setDepartmentForm({ ...departmentForm, parentId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择上级部门" />
                </SelectTrigger>
                <SelectContent>
                  {renderTreeOptions(departmentTree)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>部门负责人</Label>
              <Input
                placeholder="请输入负责人姓名"
                value={departmentForm.leader}
                onChange={(e) => setDepartmentForm({ ...departmentForm, leader: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select
                value={departmentForm.status}
                onValueChange={(val) => setDepartmentForm({ ...departmentForm, status: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="启用">启用</SelectItem>
                  <SelectItem value="禁用">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepartmentModalVisible(false)}>
              取消
            </Button>
            <Button onClick={handleDepartmentSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 员工编辑弹窗 */}
      <Dialog open={employeeModalVisible} onOpenChange={setEmployeeModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEmployee ? '编辑员工' : '新增员工'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>工号 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入工号"
                value={employeeForm.jobNumber}
                onChange={(e) => setEmployeeForm({ ...employeeForm, jobNumber: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>姓名 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入姓名"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>所属部门 <span className="text-destructive">*</span></Label>
              <Select
                value={employeeForm.department}
                onValueChange={(val) => setEmployeeForm({ ...employeeForm, department: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {renderTreeOptions(departmentTree)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>职位</Label>
              <Input
                placeholder="请输入职位"
                value={employeeForm.position}
                onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>手机号 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入手机号"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>邮箱</Label>
              <Input
                placeholder="请输入邮箱"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select
                value={employeeForm.status}
                onValueChange={(val) => setEmployeeForm({ ...employeeForm, status: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="在职">在职</SelectItem>
                  <SelectItem value="离职">离职</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>入职日期</Label>
              <Input
                type="date"
                placeholder="请选择入职日期"
                value={employeeForm.hireDate}
                onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmployeeModalVisible(false)}>
              取消
            </Button>
            <Button onClick={handleEmployeeSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
