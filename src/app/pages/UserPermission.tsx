import { useState } from 'react';
import { Plus, Pencil, Trash2, Lock } from 'lucide-react';
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
import { Checkbox } from '../components/ui/checkbox';
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

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    name: '管理员',
    phone: '13800138001',
    email: 'admin@company.com',
    roles: ['管理员'],
    status: '启用',
    createTime: '2020-01-01',
  },
  {
    id: '2',
    username: 'zhangsan',
    name: '张三',
    phone: '13800138002',
    email: 'zhangsan@company.com',
    roles: ['销售经理'],
    status: '启用',
    createTime: '2021-03-15',
  },
  {
    id: '3',
    username: 'lisi',
    name: '李四',
    phone: '13800138003',
    email: 'lisi@company.com',
    roles: ['销售人员'],
    status: '启用',
    createTime: '2021-06-20',
  },
  {
    id: '4',
    username: 'wangwu',
    name: '王五',
    phone: '13800138004',
    email: 'wangwu@company.com',
    roles: ['技术人员'],
    status: '禁用',
    createTime: '2022-01-10',
  },
];

// 模拟角色数据
const mockRoles = [
  {
    id: '1',
    name: '管理员',
    code: 'admin',
    description: '系统管理员,拥有所有权限',
    userCount: 1,
    status: '启用',
    createTime: '2020-01-01',
  },
  {
    id: '2',
    name: '销售经理',
    code: 'sales_manager',
    description: '销售部门经理,可管理本部门所有线索和客户',
    userCount: 5,
    status: '启用',
    createTime: '2021-01-01',
  },
  {
    id: '3',
    name: '销售人员',
    code: 'sales',
    description: '销售人员,只能查看和管理自己的线索和客户',
    userCount: 20,
    status: '启用',
    createTime: '2021-01-01',
  },
  {
    id: '4',
    name: '技术人员',
    code: 'tech',
    description: '技术人员,可查看项目信息',
    userCount: 15,
    status: '启用',
    createTime: '2021-01-01',
  },
];

// 模拟权限树数据
interface PermissionNode {
  title: string;
  key: string;
  children?: PermissionNode[];
}

const mockPermissionTree: PermissionNode[] = [
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '组织架构管理', key: 'system-org' },
      { title: '用户权限管理', key: 'system-permission' },
      {
        title: '本公司主体管理',
        key: 'system-company',
        children: [
          { title: '查看公司主体', key: 'system-company-view' },
          { title: '新建公司主体', key: 'system-company-create' },
          { title: '编辑公司主体', key: 'system-company-edit' },
          { title: '删除公司主体', key: 'system-company-delete' },
          { title: '维护公司资料', key: 'system-company-files' },
        ],
      },
      { title: '数据字典管理', key: 'system-dict' },
      { title: '系统日志管理', key: 'system-log' },
      { title: '系统配置管理', key: 'system-config' },
    ],
  },
  {
    title: '客户管理',
    key: 'customer',
    children: [
      { title: '查看客户', key: 'customer-view' },
      { title: '新建客户', key: 'customer-create' },
      { title: '编辑客户', key: 'customer-edit' },
      { title: '删除客户', key: 'customer-delete' },
      { title: '导出客户', key: 'customer-export' },
    ],
  },
  {
    title: '线索管理',
    key: 'lead',
    children: [
      { title: '公海线索管理', key: 'lead-public' },
      { title: '我的线索', key: 'lead-my' },
      { title: '认领线索', key: 'lead-claim' },
      { title: '新建线索', key: 'lead-create' },
      { title: '编辑线索', key: 'lead-edit' },
      { title: '转让线索', key: 'lead-transfer' },
      { title: '放弃线索', key: 'lead-abandon' },
    ],
  },
  {
    title: '合同管理',
    key: 'contract',
    children: [
      { title: '查看合同', key: 'contract-view' },
      { title: '新建合同', key: 'contract-create' },
      { title: '编辑合同', key: 'contract-edit' },
      { title: '删除合同', key: 'contract-delete' },
    ],
  },
  {
    title: '项目管理',
    key: 'project',
    children: [
      { title: '查看项目', key: 'project-view' },
      { title: '新建项目', key: 'project-create' },
      { title: '编辑项目', key: 'project-edit' },
      { title: '删除项目', key: 'project-delete' },
    ],
  },
  {
    key: 'finance',
    title: '财务管理',
    children: [
      { key: 'finance-salary-view', title: '查看工资表' },
      { key: 'finance-salary-edit', title: '编辑/导入工资和实际工时' },
      { key: 'finance-contract-cost-view', title: '查看合同成本明细' },
      { key: 'finance-contract-cost-detail', title: '查看人员薪资数字' },
    ],
  },
];

const initialUserForm = {
  username: '',
  name: '',
  phone: '',
  email: '',
  password: '',
  roles: [] as string[],
  status: '启用',
};

const initialRoleForm = { name: '', code: '', description: '', status: '启用' };

// 收集所有叶子节点 key
function collectLeafKeys(nodes: PermissionNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children ? collectLeafKeys(node.children) : [node.key]
  );
}

// 收集所有节点 key
function collectAllKeys(nodes: PermissionNode[]): string[] {
  return nodes.flatMap((node) => [
    node.key,
    ...(node.children ? collectAllKeys(node.children) : []),
  ]);
}

// 获取节点的所有后代叶子 key
function getDescendantLeafKeys(node: PermissionNode): string[] {
  if (!node.children) return [node.key];
  return node.children.flatMap((child) => getDescendantLeafKeys(child));
}

// 自定义权限树组件
function PermissionTree({
  treeData,
  checkedKeys,
  onCheckedChange,
}: {
  treeData: PermissionNode[];
  checkedKeys: string[];
  onCheckedChange: (keys: string[]) => void;
}) {
  const allKeys = collectAllKeys(treeData);

  const handleToggle = (node: PermissionNode) => {
    const descendantKeys = getDescendantLeafKeys(node);
    const isLeaf = !node.children;

    if (isLeaf) {
      // 叶子节点：直接切换
      const newKeys = checkedKeys.includes(node.key)
        ? checkedKeys.filter((k) => k !== node.key)
        : [...checkedKeys, node.key];
      onCheckedChange(newKeys);
    } else {
      // 父节点：切换所有叶子后代
      const allDescendantsChecked = descendantKeys.every((k) => checkedKeys.includes(k));
      if (allDescendantsChecked) {
        onCheckedChange(checkedKeys.filter((k) => !descendantKeys.includes(k)));
      } else {
        const newKeys = [...new Set([...checkedKeys, ...descendantKeys])];
        onCheckedChange(newKeys);
      }
    }
  };

  const isChecked = (node: PermissionNode): boolean | 'indeterminate' => {
    if (!node.children) {
      return checkedKeys.includes(node.key);
    }
    const descendantKeys = getDescendantLeafKeys(node);
    const checkedCount = descendantKeys.filter((k) => checkedKeys.includes(k)).length;
    if (checkedCount === 0) return false;
    if (checkedCount === descendantKeys.length) return true;
    return 'indeterminate';
  };

  const renderNode = (node: PermissionNode, depth: number) => {
    const checked = isChecked(node);
    return (
      <div key={node.key}>
        <div className="flex items-center gap-2" style={{ paddingLeft: depth * 24 }}>
          <Checkbox
            checked={checked}
            onCheckedChange={() => handleToggle(node)}
          />
          <span className="text-sm">{node.title}</span>
        </div>
        {node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {treeData.map((node) => renderNode(node, 0))}
    </div>
  );
}

export function UserPermission() {
  const [activeTab, setActiveTab] = useState('user');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [dataScope, setDataScope] = useState('all');
  const [userForm, setUserForm] = useState(initialUserForm);
  const [roleForm, setRoleForm] = useState(initialRoleForm);

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm(initialUserForm);
    setUserModalVisible(true);
  };

  const handleEditUser = (record: any) => {
    setEditingUser(record);
    setUserForm({
      username: record.username,
      name: record.name,
      phone: record.phone,
      email: record.email,
      password: '',
      roles: record.roles,
      status: record.status,
    });
    setUserModalVisible(true);
  };

  const handleDeleteUser = (_id: string) => {
    toast.success('删除成功');
  };

  const handleUserSubmit = () => {
    if (!userForm.username.trim() || !userForm.name.trim() || !userForm.phone.trim()) {
      toast.error('请填写必填字段');
      return;
    }
    if (!editingUser && !userForm.password.trim()) {
      toast.error('请输入密码');
      return;
    }
    toast.success(editingUser ? '编辑成功' : '新建成功');
    setUserModalVisible(false);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm(initialRoleForm);
    setRoleModalVisible(true);
  };

  const handleEditRole = (record: any) => {
    setEditingRole(record);
    setRoleForm({
      name: record.name,
      code: record.code,
      description: record.description,
      status: record.status,
    });
    setRoleModalVisible(true);
  };

  const handleEditRolePermission = (record: any) => {
    setEditingRole(record);
    setSelectedPermissions(['system-org', 'customer-view', 'lead-public']);
    setDataScope('all');
    setPermissionModalVisible(true);
  };

  const handleDeleteRole = (_id: string) => {
    toast.success('删除成功');
  };

  const handleRoleSubmit = () => {
    if (!roleForm.name.trim() || !roleForm.code.trim()) {
      toast.error('请填写必填字段');
      return;
    }
    toast.success(editingRole ? '编辑成功' : '新建成功');
    setRoleModalVisible(false);
  };

  const handlePermissionSubmit = () => {
    toast.success('权限配置成功');
    setPermissionModalVisible(false);
  };

  const handleRoleToggle = (roleName: string) => {
    setUserForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName],
    }));
  };

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="user">用户管理</TabsTrigger>
              <TabsTrigger value="role">角色管理</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <div className="mb-4">
                <Button onClick={handleAddUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  新建用户
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户名</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.username}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.phone}</TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {record.roles.map((role, idx) => (
                            <Badge key={idx} variant="default">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.status === '启用' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.createTime}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(record)}
                          >
                            <Pencil className="h-4 w-4" />
                            编辑
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Lock className="h-4 w-4" />
                            重置密码
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
                                  确定要删除该用户吗?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(record.id)}>
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

            <TabsContent value="role">
              <div className="mb-4">
                <Button onClick={handleAddRole}>
                  <Plus className="mr-2 h-4 w-4" />
                  新建角色
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>角色名称</TableHead>
                    <TableHead>角色编码</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>用户数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoles.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.code}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.userCount}人</TableCell>
                      <TableCell>
                        <Badge variant={record.status === '启用' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.createTime}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRolePermission(record)}
                          >
                            权限配置
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(record)}
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
                                  确定要删除该角色吗?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRole(record.id)}>
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

      {/* 用户编辑弹窗 */}
      <Dialog open={userModalVisible} onOpenChange={setUserModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? '编辑用户' : '新建用户'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>用户名 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入用户名"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>姓名 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入姓名"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>手机号 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入手机号"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>邮箱</Label>
              <Input
                placeholder="请输入邮箱"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                密码{' '}
                {!editingUser && <span className="text-destructive">*</span>}
              </Label>
              <Input
                type="password"
                placeholder={editingUser ? '不填写则不修改密码' : '请输入密码'}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>角色 <span className="text-destructive">*</span></Label>
              <div className="space-y-2">
                {mockRoles.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={userForm.roles.includes(role.name)}
                      onCheckedChange={() => handleRoleToggle(role.name)}
                    />
                    <span className="text-sm">{role.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select
                value={userForm.status}
                onValueChange={(val) => setUserForm({ ...userForm, status: val })}
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
            <Button variant="outline" onClick={() => setUserModalVisible(false)}>
              取消
            </Button>
            <Button onClick={handleUserSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 角色编辑弹窗 */}
      <Dialog open={roleModalVisible} onOpenChange={setRoleModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? '编辑角色' : '新建角色'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>角色名称 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入角色名称"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>角色编码 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入角色编码,如:sales_manager"
                value={roleForm.code}
                onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>描述</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="请输入角色描述"
                rows={3}
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select
                value={roleForm.status}
                onValueChange={(val) => setRoleForm({ ...roleForm, status: val })}
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
            <Button variant="outline" onClick={() => setRoleModalVisible(false)}>
              取消
            </Button>
            <Button onClick={handleRoleSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 权限配置弹窗 */}
      <Dialog open={permissionModalVisible} onOpenChange={setPermissionModalVisible}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>权限配置 - {editingRole?.name || ''}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <div className="mb-2 font-medium">功能权限</div>
              <div className="max-h-[300px] overflow-y-auto rounded-md border p-4">
                <PermissionTree
                  treeData={mockPermissionTree}
                  checkedKeys={selectedPermissions}
                  onCheckedChange={setSelectedPermissions}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 font-medium">数据权限</div>
              <Select value={dataScope} onValueChange={setDataScope}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部数据</SelectItem>
                  <SelectItem value="department">本部门数据</SelectItem>
                  <SelectItem value="self">仅本人数据</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionModalVisible(false)}>
              取消
            </Button>
            <Button onClick={handlePermissionSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
