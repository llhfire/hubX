import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, RefreshCw } from 'lucide-react';

// 模拟操作日志数据
const mockOperationLogs = [
  {
    id: '1',
    username: 'admin',
    name: '管理员',
    module: '用户管理',
    operation: '新建用户',
    method: 'POST /api/users',
    params: '{"username":"zhangsan","name":"张三"}',
    ip: '192.168.1.100',
    location: '北京市',
    status: '成功',
    errorMsg: '',
    duration: '120ms',
    time: '2026-04-19 10:30:25',
  },
  {
    id: '2',
    username: 'zhangsan',
    name: '张三',
    module: '线索管理',
    operation: '新建线索',
    method: 'POST /api/leads',
    params: '{"name":"某公司APP开发需求"}',
    ip: '192.168.1.101',
    location: '上海市',
    status: '成功',
    errorMsg: '',
    duration: '95ms',
    time: '2026-04-19 10:25:18',
  },
  {
    id: '3',
    username: 'lisi',
    name: '李四',
    module: '客户管理',
    operation: '编辑客户',
    method: 'PUT /api/customers/123',
    params: '{"level":"VIP"}',
    ip: '192.168.1.102',
    location: '广州市',
    status: '成功',
    errorMsg: '',
    duration: '85ms',
    time: '2026-04-19 10:20:32',
  },
  {
    id: '4',
    username: 'wangwu',
    name: '王五',
    module: '系统配置',
    operation: '修改配置',
    method: 'PUT /api/config',
    params: '{"leadRecycleDays":7}',
    ip: '192.168.1.103',
    location: '深圳市',
    status: '失败',
    errorMsg: '权限不足',
    duration: '50ms',
    time: '2026-04-19 10:15:45',
  },
  {
    id: '5',
    username: 'admin',
    name: '管理员',
    module: '角色管理',
    operation: '权限配置',
    method: 'PUT /api/roles/2/permissions',
    params: '{"permissions":["customer-view","lead-my"]}',
    ip: '192.168.1.100',
    location: '北京市',
    status: '成功',
    errorMsg: '',
    duration: '110ms',
    time: '2026-04-19 10:10:20',
  },
];

// 模拟登录日志数据
const mockLoginLogs = [
  {
    id: '1',
    username: 'admin',
    name: '管理员',
    ip: '192.168.1.100',
    location: '北京市',
    browser: 'Chrome 122',
    os: 'Windows 10',
    status: '成功',
    message: '登录成功',
    time: '2026-04-19 09:00:00',
  },
  {
    id: '2',
    username: 'zhangsan',
    name: '张三',
    ip: '192.168.1.101',
    location: '上海市',
    browser: 'Chrome 122',
    os: 'macOS',
    status: '成功',
    message: '登录成功',
    time: '2026-04-19 08:50:15',
  },
  {
    id: '3',
    username: 'lisi',
    name: '李四',
    ip: '192.168.1.102',
    location: '广州市',
    browser: 'Safari 17',
    os: 'iOS',
    status: '成功',
    message: '登录成功',
    time: '2026-04-19 08:45:30',
  },
  {
    id: '4',
    username: 'wangwu',
    name: '王五',
    ip: '192.168.1.103',
    location: '深圳市',
    browser: 'Chrome 122',
    os: 'Android',
    status: '失败',
    message: '密码错误',
    time: '2026-04-19 08:40:20',
  },
  {
    id: '5',
    username: 'wangwu',
    name: '王五',
    ip: '192.168.1.103',
    location: '深圳市',
    browser: 'Chrome 122',
    os: 'Android',
    status: '成功',
    message: '登录成功',
    time: '2026-04-19 08:41:05',
  },
];

interface OperationSearchForm {
  username: string;
  module: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface LoginSearchForm {
  username: string;
  ip: string;
  status: string;
  startDate: string;
  endDate: string;
}

export function SystemLog() {
  const [activeTab, setActiveTab] = useState('operation');

  const [operationSearch, setOperationSearch] = useState<OperationSearchForm>({
    username: '',
    module: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const [loginSearch, setLoginSearch] = useState<LoginSearchForm>({
    username: '',
    ip: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const handleOperationSearch = () => {
    console.log('搜索操作日志', operationSearch);
  };

  const handleOperationReset = () => {
    setOperationSearch({ username: '', module: '', status: '', startDate: '', endDate: '' });
  };

  const handleLoginSearch = () => {
    console.log('搜索登录日志', loginSearch);
  };

  const handleLoginReset = () => {
    setLoginSearch({ username: '', ip: '', status: '', startDate: '', endDate: '' });
  };

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="operation">操作日志</TabsTrigger>
              <TabsTrigger value="login">登录日志</TabsTrigger>
            </TabsList>

            <TabsContent value="operation" className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Input
                  placeholder="操作人"
                  className="w-[150px]"
                  value={operationSearch.username}
                  onChange={(e) => setOperationSearch({ ...operationSearch, username: e.target.value })}
                />
                <Select
                  value={operationSearch.module}
                  onValueChange={(value) => setOperationSearch({ ...operationSearch, module: value })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="所属模块" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">用户管理</SelectItem>
                    <SelectItem value="customer">客户管理</SelectItem>
                    <SelectItem value="lead">线索管理</SelectItem>
                    <SelectItem value="contract">合同管理</SelectItem>
                    <SelectItem value="project">项目管理</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={operationSearch.status}
                  onValueChange={(value) => setOperationSearch({ ...operationSearch, status: value })}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="fail">失败</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  className="w-[140px]"
                  value={operationSearch.startDate}
                  onChange={(e) => setOperationSearch({ ...operationSearch, startDate: e.target.value })}
                />
                <span className="text-muted-foreground">至</span>
                <Input
                  type="date"
                  className="w-[140px]"
                  value={operationSearch.endDate}
                  onChange={(e) => setOperationSearch({ ...operationSearch, endDate: e.target.value })}
                />
                <Button onClick={handleOperationSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </Button>
                <Button variant="outline" onClick={handleOperationReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重置
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">操作人</TableHead>
                      <TableHead className="w-[120px]">所属模块</TableHead>
                      <TableHead className="w-[120px]">操作类型</TableHead>
                      <TableHead className="w-[200px]">请求方式</TableHead>
                      <TableHead className="w-[120px]">IP地址</TableHead>
                      <TableHead className="w-[100px]">操作地点</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="w-[80px]">耗时</TableHead>
                      <TableHead className="w-[160px]">操作时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOperationLogs.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.module}</TableCell>
                        <TableCell>{record.operation}</TableCell>
                        <TableCell>{record.method}</TableCell>
                        <TableCell>{record.ip}</TableCell>
                        <TableCell>{record.location}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === '成功' ? 'default' : 'destructive'}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.duration}</TableCell>
                        <TableCell>{record.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="login" className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Input
                  placeholder="用户名"
                  className="w-[150px]"
                  value={loginSearch.username}
                  onChange={(e) => setLoginSearch({ ...loginSearch, username: e.target.value })}
                />
                <Input
                  placeholder="IP地址"
                  className="w-[150px]"
                  value={loginSearch.ip}
                  onChange={(e) => setLoginSearch({ ...loginSearch, ip: e.target.value })}
                />
                <Select
                  value={loginSearch.status}
                  onValueChange={(value) => setLoginSearch({ ...loginSearch, status: value })}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="fail">失败</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  className="w-[140px]"
                  value={loginSearch.startDate}
                  onChange={(e) => setLoginSearch({ ...loginSearch, startDate: e.target.value })}
                />
                <span className="text-muted-foreground">至</span>
                <Input
                  type="date"
                  className="w-[140px]"
                  value={loginSearch.endDate}
                  onChange={(e) => setLoginSearch({ ...loginSearch, endDate: e.target.value })}
                />
                <Button onClick={handleLoginSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </Button>
                <Button variant="outline" onClick={handleLoginReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重置
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">用户名</TableHead>
                      <TableHead className="w-[100px]">姓名</TableHead>
                      <TableHead className="w-[120px]">IP地址</TableHead>
                      <TableHead className="w-[100px]">登录地点</TableHead>
                      <TableHead className="w-[120px]">浏览器</TableHead>
                      <TableHead className="w-[120px]">操作系统</TableHead>
                      <TableHead className="w-[80px]">状态</TableHead>
                      <TableHead className="w-[120px]">提示消息</TableHead>
                      <TableHead className="w-[160px]">登录时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLoginLogs.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.username}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.ip}</TableCell>
                        <TableCell>{record.location}</TableCell>
                        <TableCell>{record.browser}</TableCell>
                        <TableCell>{record.os}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === '成功' ? 'default' : 'destructive'}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.message}</TableCell>
                        <TableCell>{record.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
