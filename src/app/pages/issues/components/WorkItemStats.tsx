import { Card, Grid, Progress, Space, Typography } from '@arco-design/web-react';

const { Text } = Typography;
const colors = {
  requirement: '#165dff',
  task: '#00b42a',
  defect: '#f53f3f',
};

interface StatsProps {
  stats: {
    requirement: { total: number; pending: number; inProgress: number; completed: number };
    task: { total: number; pending: number; inProgress: number; completed: number; blocked: number };
    defect: { total: number; pending: number; inProgress: number; toVerify: number; closed: number };
  };
}

export function WorkItemStats({ stats }: StatsProps) {
  const reqRate = stats.requirement.total > 0
    ? Math.round((stats.requirement.completed / stats.requirement.total) * 100)
    : 0;
  const tskRate = stats.task.total > 0
    ? Math.round((stats.task.completed / stats.task.total) * 100)
    : 0;
  const bugRate = stats.defect.total > 0
    ? Math.round((stats.defect.closed / stats.defect.total) * 100)
    : 0;

  return (
    <Grid.Row gutter={16} style={{ marginBottom: 16 }}>
      <Grid.Col span={8}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">需求完成率</Text>
            <Progress percent={reqRate} color={colors.requirement} />
            <Space>
              <Text type="secondary">总计 {stats.requirement.total}</Text>
              <Text style={{ color: colors.requirement }}>{stats.requirement.inProgress} 进行中</Text>
            </Space>
          </Space>
        </Card>
      </Grid.Col>
      <Grid.Col span={8}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">任务完成率</Text>
            <Progress percent={tskRate} color={colors.task} />
            <Space>
              <Text type="secondary">总计 {stats.task.total}</Text>
              {stats.task.blocked > 0 && (
                <Text style={{ color: '#f53f3f' }}>{stats.task.blocked} 已阻塞</Text>
              )}
            </Space>
          </Space>
        </Card>
      </Grid.Col>
      <Grid.Col span={8}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">缺陷关闭率</Text>
            <Progress percent={bugRate} color={colors.defect} />
            <Space>
              <Text type="secondary">总计 {stats.defect.total}</Text>
              <Text style={{ color: colors.defect }}>{stats.defect.pending} 待处理</Text>
            </Space>
          </Space>
        </Card>
      </Grid.Col>
    </Grid.Row>
  );
}
