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
  Select,
  Progress,
  Typography,
  Tabs,
  Tooltip,
} from '@arco-design/web-react';
import {
  IconFile,
  IconExperiment,
  IconExclamationCircle,
  IconArrowRight,
  IconTrophy,
  IconCalendar,
} from '@arco-design/web-react/icon';
import {
  initialProjects,
  initialDailyReports,
  calculateProjectHours,
} from '../project-management/mockData';
import {
  contractNames,
  buildRDCostDetails,
  buildOpCostDetails,
  mockBusinessCosts,
  mockOutsourceCosts,
  mockOtherCosts,
} from './contractCostData';
import { useContracts } from '../contracts/ContractsContext';
import { formatCurrency } from '../employee/mockData';

const Row = Grid.Row;
const Col = Grid.Col;
const TabPane = Tabs.TabPane;
const Title = Typography.Title;

interface ProjectCostRow {
  projectId: string;
  projectName: string;
  projectNo: string;
  status: string;
  progress: number;
  contractId: string;
  contractName: string;
  contractAmount: number;
  totalHours: number;
  rdCost: number;
  opCost: number;
  businessCost: number;
  outsourceCost: number;
  otherCost: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  budgetAlert: 'ok' | 'warning' | 'danger';
}

export function ProjectCostAccounting() {
  const navigate = useNavigate();
  const { contracts } = useContracts();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('');

  // 计算每个项目的成本
  const projectCostData: ProjectCostRow[] = useMemo(() => {
    return initialProjects.map(project => {
      const contractId = project.contractId || '';
      const contractName = contractNames[contractId] || '—';
      const contractObj = contracts.find(c => c.id === contractId);
      const contractAmount = contractObj?.totalAmount || 0;

      // 工时
      const totalHours = calculateProjectHours(project.id, initialDailyReports);

      // 研发成本（工时 × 时薪）
      const rdDetails = contractId ? buildRDCostDetails(contractId, '2026-06') : [];
      const rdCost = rdDetails.reduce((s, d) => s + d.cost, 0);

      // 运营分摊
      const opDetails = contractId ? buildOpCostDetails(contractId, '2026-06') : [];
      const opCost = opDetails.reduce((s, d) => s + d.cost, 0);

      // 其他成本（从 mock 数据按 contractId 汇总）
      const businessCost = mockBusinessCosts.filter(b => b.contractId === contractId).reduce((s, b) => s + b.amount, 0);
      const outsourceCost = mockOutsourceCosts.filter(b => b.contractId === contractId).reduce((s, b) => s + b.amount, 0);
      const otherCost = mockOtherCosts.filter(b => b.contractId === contractId).reduce((s, b) => s + b.amount, 0);

      const totalCost = rdCost + opCost + businessCost + outsourceCost + otherCost;
      const profit = contractAmount - totalCost;
      const profitMargin = contractAmount > 0 ? Math.round((profit / contractAmount) * 100) : 0;

      // 预算预警
      let budgetAlert: 'ok' | 'warning' | 'danger' = 'ok';
      if (profitMargin < 0) budgetAlert = 'danger';
      else if (profitMargin < 15) budgetAlert = 'warning';

      return {
        projectId: project.id,
        projectName: project.name,
        projectNo: project.projectNo,
        status: project.status,
        progress: project.progress,
        contractId,
        contractName,
        contractAmount,
        totalHours,
        rdCost,
        opCost,
        businessCost,
        outsourceCost,
        otherCost,
        totalCost,
        profit,
        profitMargin,
        budgetAlert,
      };
    });
  }, []);

  // 汇总
  const summary = useMemo(() => {
    const total = projectCostData.reduce(
      (acc, p) => ({
        contractAmount: acc.contractAmount + p.contractAmount,
        totalCost: acc.totalCost + p.totalCost,
        profit: acc.profit + p.profit,
        totalHours: acc.totalHours + p.totalHours,
        rdCost: acc.rdCost + p.rdCost,
      }),
      { contractAmount: 0, totalCost: 0, profit: 0, totalHours: 0, rdCost: 0 },
    );
    const avgMargin = total.contractAmount > 0 ? Math.round((total.profit / total.contractAmount) * 100) : 0;
    const alertCount = projectCostData.filter(p => p.budgetAlert === 'danger' || p.budgetAlert === 'warning').length;
    return { ...total, avgMargin, alertCount, projectCount: projectCostData.length };
  }, [projectCostData]);

  const filteredData = useMemo(() => {
    if (!filterStatus) return projectCostData;
    return projectCostData.filter(p => p.status === filterStatus);
  }, [projectCostData, filterStatus]);

  const statusOptions = Array.from(new Set(initialProjects.map(p => p.status)));

  const columns = [
    {
      title: '项目', dataIndex: 'projectName', width: 160, fixed: 'left' as const,
      render: (_: unknown, row: ProjectCostRow) => (
        <Button type="text" size="small" style={{ fontWeight: 600, padding: 0 }} onClick={() => navigate(`/projects/${row.projectId}`)}>
          {row.projectName}
        </Button>
      ),
    },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (s: string) => {
        const colors: Record<string, string> = { '进行中': '#165dff', '已完成': '#00b42a', '验收中': '#0fc6c2', '未开始': '#86909c', '延迟': '#f53f3f', '搁置': '#c9cdd4', '催款中': '#ff7d00' };
        return <Tag color={colors[s] || '#86909c'}>{s}</Tag>;
      },
    },
    {
      title: '进度', dataIndex: 'progress', width: 90,
      render: (p: number) => <Progress percent={p} size="small" />,
    },
    {
      title: '合同额', dataIndex: 'contractAmount', width: 100,
      render: (v: number) => <span style={{ fontWeight: 600 }}>{formatCurrency(v)}</span>,
      sorter: (a: ProjectCostRow, b: ProjectCostRow) => a.contractAmount - b.contractAmount,
    },
    {
      title: '总工时', dataIndex: 'totalHours', width: 80,
      render: (v: number) => `${v}h`,
    },
    {
      title: '研发成本', dataIndex: 'rdCost', width: 100,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: '运营分摊', dataIndex: 'opCost', width: 100,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: '总成本', dataIndex: 'totalCost', width: 100,
      render: (v: number) => <span style={{ fontWeight: 700, color: '#f53f3f' }}>{formatCurrency(v)}</span>,
      sorter: (a: ProjectCostRow, b: ProjectCostRow) => a.totalCost - b.totalCost,
    },
    {
      title: '利润', dataIndex: 'profit', width: 100,
      render: (v: number) => <span style={{ fontWeight: 700, color: v >= 0 ? '#00b42a' : '#f53f3f' }}>{formatCurrency(v)}</span>,
      sorter: (a: ProjectCostRow, b: ProjectCostRow) => a.profit - b.profit,
    },
    {
      title: '利润率', dataIndex: 'profitMargin', width: 90,
      render: (v: number, row: ProjectCostRow) => (
        <Tooltip content={row.budgetAlert === 'danger' ? '亏损预警' : row.budgetAlert === 'warning' ? '利润率偏低' : '健康'}>
          <Tag color={row.budgetAlert === 'danger' ? '#f53f3f' : row.budgetAlert === 'warning' ? '#ff7d00' : '#00b42a'}>
            {v}%
          </Tag>
        </Tooltip>
      ),
      sorter: (a: ProjectCostRow, b: ProjectCostRow) => a.profitMargin - b.profitMargin,
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* 摘要栏 */}
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic title="项目总数" value={summary.projectCount} suffix="个" prefix={<IconFile style={{ color: 'rgb(var(--primary-6))' }} />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="合同总额" value={summary.contractAmount} prefix={<IconFile style={{ color: '#165dff' }} />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="总成本" value={summary.totalCost} prefix={<IconExperiment style={{ color: '#f53f3f' }} />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="总利润" value={summary.profit} prefix={<IconTrophy style={{ color: '#00b42a' }} />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="平均利润率" value={summary.avgMargin} suffix="%" prefix={<IconCalendar style={{ color: '#ff7d00' }} />} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="预警项目"
              value={summary.alertCount}
              suffix="个"
              prefix={<IconExclamationCircle style={{ color: '#f53f3f' }} />}
              valueStyle={{ color: summary.alertCount > 0 ? '#f53f3f' : '#00b42a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 成本明细 Tab */}
      <Card bordered={false}>
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <TabPane key="overview" title={<span><IconFile /> 项目成本总览</span>} />
          <TabPane key="rd" title={<span><IconExperiment /> 研发成本明细</span>} />
        </Tabs>

        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '16px 0' }}>
              <Select
                style={{ width: 130 }}
                placeholder="全部状态"
                allowClear
                value={filterStatus}
                onChange={setFilterStatus}
              >
                {statusOptions.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
              </Select>
            </div>
            <Table
              columns={columns as any}
              data={filteredData}
              rowKey="projectId"
              pagination={{ pageSize: 10, showTotal: true }}
              scroll={{ x: 1200 }}
            />
          </div>
        )}

        {activeTab === 'rd' && (
          <RDCostDetailTable projectCostData={projectCostData} />
        )}
      </Card>
    </Space>
  );
}

function RDCostDetailTable({ projectCostData }: { projectCostData: ProjectCostRow[] }) {
  const rows = useMemo(() => {
    const result: any[] = [];
    projectCostData.forEach(p => {
      if (!p.contractId) return;
      const details = buildRDCostDetails(p.contractId, '2026-06');
      details.forEach(d => {
        result.push({ ...d, projectName: p.projectName });
      });
    });
    return result;
  }, [projectCostData]);

  return (
    <div style={{ marginTop: 16 }}>
      <Table
        columns={[
          { title: '项目', dataIndex: 'projectName', width: 140 },
          { title: '姓名', dataIndex: 'employeeName', width: 80 },
          { title: '角色', dataIndex: 'position', width: 80, render: (v: string) => <Tag>{v}</Tag> },
          { title: '工时', dataIndex: 'hours', width: 70, render: (v: number) => `${v}h` },
          { title: '时薪', dataIndex: 'hourlyRate', width: 80, render: (v: number) => formatCurrency(v) },
          {
            title: '成本', dataIndex: 'cost', width: 100,
            render: (v: number) => <span style={{ fontWeight: 600, color: '#f53f3f' }}>{formatCurrency(v)}</span>,
            sorter: (a: any, b: any) => a.cost - b.cost,
          },
        ] as any}
        data={rows}
        rowKey={r => `${r.projectName}-${r.employeeName}`}
        pagination={{ pageSize: 15, showTotal: true }}
        summary={() => {
          const totalHours = rows.reduce((s: number, r: any) => s + (r.hours || 0), 0);
          const totalCost = rows.reduce((s: number, r: any) => s + (r.cost || 0), 0);
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3}>
                <span style={{ fontWeight: 600 }}>合计</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <span style={{ fontWeight: 600 }}>{totalHours}h</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell>—</Table.Summary.Cell>
              <Table.Summary.Cell>
                <span style={{ fontWeight: 700, color: '#f53f3f' }}>{formatCurrency(totalCost)}</span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
}
