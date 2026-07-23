import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, Card, Space, Table, Typography } from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { initialDailyReports, initialProjects } from '../project-management/mockData';

const { Title, Text } = Typography;

export function ProjectDailyReportsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = useMemo(
    () => initialProjects.find(p => p.id === projectId),
    [projectId]
  );

  const projectDailyReports = useMemo(
    () => initialDailyReports.filter(r => r.projectId === projectId),
    [projectId]
  );

  // 计算成员工时（按 personName 分组）
  const memberHours = useMemo(() => {
    const hourMap = new Map<string, { personName: string; position: string; hours: number }>();
    projectDailyReports.forEach(report => {
      const existing = hourMap.get(report.personName);
      if (existing) {
        existing.hours += report.hours;
      } else {
        hourMap.set(report.personName, {
          personName: report.personName,
          position: report.position,
          hours: report.hours,
        });
      }
    });

    return Array.from(hourMap.values()).sort((a, b) => b.hours - a.hours);
  }, [projectDailyReports]);

  const totalHours = memberHours.reduce((sum, m) => sum + m.hours, 0);

  const columns = [
    {
      title: '编号',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '提交人', dataIndex: 'personName', width: 100 },
    { title: '职位', dataIndex: 'position', width: 150 },
    { title: '工时(h)', dataIndex: 'hours', width: 80 },
    {
      title: '工作内容',
      dataIndex: 'workContent',
      render: (content: string) => (
        <Text ellipsis style={{ maxWidth: 400 }}>{content}</Text>
      ),
    },
    {
      title: '风险反馈',
      dataIndex: 'riskFeedback',
      width: 200,
      render: (content: string) => (
        <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>{content}</Text>
      ),
    },
  ];

  const memberColumns = [
    {
      title: '编号',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: '人员名称', dataIndex: 'personName', width: 120 },
    { title: '职位', dataIndex: 'position', width: 150 },
    { title: '已用工时', dataIndex: 'hours', width: 100, render: (h: number) => `${h}H` },
  ];

  if (!project) {
    return <div>项目不存在</div>;
  }

  return (
    <div>
      {/* 顶部导航 */}
      <Space style={{ marginBottom: 16 }}>
        <Button type="text" icon={<IconLeft />} onClick={() => navigate(`/projects/${projectId}`)}>
          返回项目
        </Button>
        <Title heading={4} style={{ margin: 0 }}>
          关联日报 — {project.name}
        </Title>
      </Space>

      {/* 工时概览 */}
      <Card title="工时概览" style={{ marginBottom: 16 }}>
        <Table
          columns={memberColumns}
          data={memberHours}
          rowKey="personName"
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3}>总计</Table.Summary.Cell>
              <Table.Summary.Cell>{totalHours}H</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      {/* 日报列表 */}
      <Card title={`日报列表 (${projectDailyReports.length})`}>
        <Table
          columns={columns}
          data={projectDailyReports}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, showTotal: true }}
        />
      </Card>
    </div>
  );
}
