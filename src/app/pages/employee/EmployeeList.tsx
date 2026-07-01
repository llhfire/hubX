import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Card,
  Grid,
  Statistic,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  Message,
  Dropdown,
  Menu,
  Typography,
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconUser,
  IconUserGroup,
  IconCalendar,
  IconMore,
} from '@arco-design/web-react/icon';
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

const Row = Grid.Row;
const Col = Grid.Col;
const FormItem = Form.Item;

export function EmployeeList() {
  const navigate = useNavigate();
  const { employees, addEmployee, updateEmployee } = useEmployee();

  // 搜索筛选
  const [keyword, setKeyword] = useState('');
  const [filterPosition, setFilterPosition] = useState<Position | ''>('');
  const [filterLevel, setFilterLevel] = useState<JobLevel | ''>('');
  const [filterStatus, setFilterStatus] = useState<EmploymentStatus | ''>('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // 弹窗
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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
    form.resetFields();
    form.setFieldsValue({ employmentStatus: '在职', hireDate: new Date().toISOString().slice(0, 10) });
    setModalVisible(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    form.setFieldsValue(emp);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validate().then(values => {
      if (editingEmployee) {
        updateEmployee(editingEmployee.id, values);
        Message.success('编辑成功');
      } else {
        addEmployee(values);
        Message.success('新增成功');
      }
      setModalVisible(false);
    });
  };

  const handleRegularize = (emp: Employee) => {
    const today = new Date().toISOString().slice(0, 10);
    updateEmployee(emp.id, { employmentStatus: '已转正', 转正Date: today });
    Message.success(`${emp.name} 已转正`);
  };

  const handleResign = (emp: Employee) => {
    const today = new Date().toISOString().slice(0, 10);
    updateEmployee(emp.id, { employmentStatus: '已离职', /* leaveDate: today */ } as any);
    Message.success(`${emp.name} 已标记为离职`);
  };

  // 表格列
  const columns = [
    {
      title: '工号',
      dataIndex: 'jobNumber',
      width: 90,
      fixed: 'left' as const,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      fixed: 'left' as const,
      render: (_: unknown, record: Employee) => (
        <Space>
          <span style={{ color: 'var(--color-text-1)', fontWeight: 500 }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 100,
    },
    {
      title: 'MBTI',
      width: 70,
      render: (_: unknown, record: Employee) => record.personality?.mbti
        ? <Tag color="#7c3aed" style={{ color: '#fff', fontWeight: 600 }}>{record.personality.mbti.type}</Tag>
        : <span style={{ color: 'var(--color-text-3)' }}>—</span>,
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 100,
      render: (pos: string) => <Tag>{pos}</Tag>,
    },
    {
      title: '职级',
      dataIndex: 'level',
      width: 70,
      render: (level: JobLevel) => (
        <Tag color={getLevelColor(level)} style={{ color: '#fff', fontWeight: 600 }}>
          {level}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'employmentStatus',
      width: 80,
      render: (status: EmploymentStatus) => (
        <Tag color={getStatusColor(status)} style={{ color: '#fff' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: '时薪',
      dataIndex: 'standardHourlyRate',
      width: 90,
      render: (rate: number) => <span style={{ color: 'rgb(var(--primary-6))', fontWeight: 600 }}>{formatCurrency(rate)}/h</span>,
      sorter: (a: Employee, b: Employee) => a.standardHourlyRate - b.standardHourlyRate,
    },
    {
      title: '入职日期',
      dataIndex: 'hireDate',
      width: 110,
    },
    {
      title: '入职天数',
      width: 90,
      render: (_: unknown, record: Employee) => `${calcWorkDays(record.hireDate)}天`,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: Employee) => (
        <Space>
          <Button type="text" size="small" onClick={() => navigate(`/employees/${record.id}`)}>
            查看
          </Button>
          <Button type="text" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="regularize" onClick={() => handleRegularize(record)}>
                  办理转正
                </Menu.Item>
                <Menu.Item key="resign" onClick={() => handleResign(record)}>
                  办理离职
                </Menu.Item>
              </Menu>
            }
            position="br"
          >
            <Button type="text" size="small" icon={<IconMore />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* 摘要栏 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: 'var(--color-text-2)' }}>在职总数</span>}
              value={stats.total}
              prefix={<IconUser style={{ color: 'rgb(var(--primary-6))' }} />}
              groupSeparator
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: 'var(--color-text-2)' }}>本月入职</span>}
              value={stats.thisMonthHire}
              prefix={<IconUserGroup style={{ color: '#00b42a' }} />}
              groupSeparator
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: 'var(--color-text-2)' }}>本月离职</span>}
              value={stats.thisMonthLeave}
              prefix={<IconUser style={{ color: '#f53f3f' }} />}
              groupSeparator
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<span style={{ color: 'var(--color-text-2)' }}>试用期人数</span>}
              value={stats.onTrial}
              prefix={<IconCalendar style={{ color: '#ff7d00' }} />}
              groupSeparator
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选 + 表格 */}
      <Card bordered={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <Input
            style={{ width: 200 }}
            placeholder="搜索姓名或工号"
            prefix={<IconSearch />}
            allowClear
            value={keyword}
            onChange={setKeyword}
          />
          <Select
            style={{ width: 130 }}
            placeholder="全部职位"
            allowClear
            value={filterPosition}
            onChange={v => setFilterPosition(v as Position | '')}
          >
            {ALL_POSITIONS.map(p => (
              <Select.Option key={p} value={p}>{p}</Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 110 }}
            placeholder="全部职级"
            allowClear
            value={filterLevel}
            onChange={v => setFilterLevel(v as JobLevel | '')}
          >
            {ALL_JOB_LEVELS.map(l => (
              <Select.Option key={l} value={l}>{l}</Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 120 }}
            placeholder="全部状态"
            allowClear
            value={filterStatus}
            onChange={v => setFilterStatus(v as EmploymentStatus | '')}
          >
            {ALL_EMPLOYMENT_STATUSES.map(s => (
              <Select.Option key={s} value={s}>{s}</Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 130 }}
            placeholder="全部部门"
            allowClear
            value={filterDepartment}
            onChange={setFilterDepartment}
          >
            {DEPARTMENTS.map(d => (
              <Select.Option key={d} value={d}>{d}</Select.Option>
            ))}
          </Select>
          <div style={{ marginLeft: 'auto' }}>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
              新增员工
            </Button>
          </div>
        </div>

        <Table
          columns={columns as any}
          data={filteredEmployees}
          rowKey="id"
          pagination={{ pageSize: 12, showTotal: true, showJumper: true }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* 新增 / 编辑弹窗 */}
      <Modal
        title={
          <Space>
            <IconUser />
            <span>{editingEmployee ? '编辑员工' : '新增员工'}</span>
          </Space>
        }
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        autoFocus={false}
        focusLock={true}
        style={{ width: 600 }}
      >
        <Form form={form} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="工号" field="jobNumber" rules={[{ required: true, message: '请输入工号' }]}>
                <Input placeholder="如 EMP017" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="姓名" field="name" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="所属部门" field="department" rules={[{ required: true, message: '请选择部门' }]}>
                <Select placeholder="请选择部门" allowClear>
                  {DEPARTMENTS.map(d => (
                    <Select.Option key={d} value={d}>{d}</Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="职位" field="position" rules={[{ required: true, message: '请选择职位' }]}>
                <Select placeholder="请选择职位" allowClear>
                  {ALL_POSITIONS.map(p => (
                    <Select.Option key={p} value={p}>{p}</Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="职级" field="level" rules={[{ required: true, message: '请选择职级' }]}>
                <Select placeholder="请选择职级" allowClear>
                  {ALL_JOB_LEVELS.map(l => (
                    <Select.Option key={l} value={l}>{l}</Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="在职状态" field="employmentStatus" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  {ALL_EMPLOYMENT_STATUSES.map(s => (
                    <Select.Option key={s} value={s}>{s}</Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="手机号"
                field="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { match: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="邮箱"
                field="email"
                rules={[{ match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }]}
              >
                <Input placeholder="请输入邮箱" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="入职日期" field="hireDate" rules={[{ required: true, message: '请选择入职日期' }]}>
                <DatePicker placeholder="请选择入职日期" style={{ width: '100%' }} />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="合同到期日" field="contractEndDate">
                <DatePicker placeholder="请选择合同到期日" style={{ width: '100%' }} />
              </FormItem>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="学历" field="education">
                <Input placeholder="如 本科/硕士/大专" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="毕业院校" field="school">
                <Input placeholder="请输入毕业院校" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>
        </Form>
      </Modal>
    </Space>
  );
}
