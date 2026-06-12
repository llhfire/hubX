import { Card, Grid, Statistic, Table, Typography, Badge, Progress } from '@arco-design/web-react';
import { useState } from 'react';
import {
  IconArrowRise,
  IconArrowFall,
  IconCustomerService,
  IconUser,
  IconFile,
  IconApps,
} from '@arco-design/web-react/icon';
import { DailyReportModal } from './daily-report/DailyReportModal';
import type { DailyReport } from './daily-report/types';
import { ReminderTodoPanel } from '../reminders/components/ReminderTodoPanel';
import { useReminders } from '../reminders/ReminderContext';

const Row = Grid.Row;
const Col = Grid.Col;
const Title = Typography.Title;

export function Dashboard() {
  const [dailyReportVisible, setDailyReportVisible] = useState(false);
  const { submitDailyReport } = useReminders();
  const currentUserId = 'user-sales-zhangsan';
  const statistics = [
    {
      title: '本月新增线索',
      value: 156,
      comparison: '+12.5%',
      trend: 'up',
      icon: <IconCustomerService style={{ fontSize: 32 }} />,
      color: '#165dff',
    },
    {
      title: '待跟进线索',
      value: 42,
      comparison: '-8.3%',
      trend: 'down',
      icon: <IconCustomerService style={{ fontSize: 32 }} />,
      color: '#00b42a',
    },
    {
      title: '本月签约客户',
      value: 28,
      comparison: '+18.2%',
      trend: 'up',
      icon: <IconUser style={{ fontSize: 32 }} />,
      color: '#ff7d00',
    },
    {
      title: '进行中项目',
      value: 35,
      comparison: '+5.7%',
      trend: 'up',
      icon: <IconApps style={{ fontSize: 32 }} />,
      color: '#f53f3f',
    },
  ];

  const recentLeads = [
    {
      key: '1',
      name: '某科技公司APP开发需求',
      customer: '北京科技有限公司',
      status: '需求调研',
      level: '高',
      followTime: '2小时前',
      owner: '张三',
    },
    {
      key: '2',
      name: '企业管理系统定制',
      customer: '上海商贸公司',
      status: '方案报价',
      level: '中',
      followTime: '5小时前',
      owner: '李四',
    },
    {
      key: '3',
      name: '小程序开发项目',
      customer: '深圳电商公司',
      status: '合同洽谈',
      level: '高',
      followTime: '1天前',
      owner: '王五',
    },
    {
      key: '4',
      name: '数据分析平台',
      customer: '广州金融公司',
      status: '初步沟通',
      level: '中',
      followTime: '2天前',
      owner: '赵六',
    },
  ];

  const projectProgress = [
    { key: '1', name: 'A公司CRM系统', customer: 'A科技公司', progress: 75, status: '正常', deadline: '2026-05-15' },
    { key: '2', name: 'B公司电商平台', customer: 'B电商公司', progress: 45, status: '正常', deadline: '2026-06-20' },
    { key: '3', name: 'C公司移动应用', customer: 'C互联网公司', progress: 30, status: '延期风险', deadline: '2026-05-30' },
    { key: '4', name: 'D公司数据中台', customer: 'D数据公司', progress: 90, status: '正常', deadline: '2026-04-25' },
  ];

  const leadColumns = [
    { title: '线索名称', dataIndex: 'name' },
    { title: '客户', dataIndex: 'customer' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => <Badge status="processing" text={status} />,
    },
    {
      title: '意向等级',
      dataIndex: 'level',
      render: (level: string) => (
        <Badge
          status={level === '高' ? 'error' : 'warning'}
          text={level}
        />
      ),
    },
    { title: '最后跟进', dataIndex: 'followTime' },
    { title: '负责人', dataIndex: 'owner' },
  ];

  const projectColumns = [
    { title: '项目名称', dataIndex: 'name' },
    { title: '客户', dataIndex: 'customer' },
    {
      title: '进度',
      dataIndex: 'progress',
      render: (progress: number) => (
        <div className="flex items-center gap-2">
          <Progress percent={progress} size="small" style={{ width: 100 }} />
          <span>{progress}%</span>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => (
        <Badge
          status={status === '正常' ? 'success' : 'warning'}
          text={status}
        />
      ),
    },
    { title: '截止日期', dataIndex: 'deadline' },
  ];

  return (
    <div>
      <Title heading={4} style={{ marginBottom: 24 }}>
        工作台
      </Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statistics.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ color: 'var(--color-text-2)', marginBottom: 8 }}>
                    {stat.title}
                  </div>
                  <Statistic
                    value={stat.value}
                    precision={0}
                    style={{ marginBottom: 8 }}
                  />
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <IconArrowRise style={{ color: '#00b42a' }} />
                    ) : (
                      <IconArrowFall style={{ color: '#f53f3f' }} />
                    )}
                    <span
                      style={{
                        color: stat.trend === 'up' ? '#00b42a' : '#f53f3f',
                        fontSize: 14,
                      }}
                    >
                      {stat.comparison}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <ReminderTodoPanel onOpenDailyReport={() => setDailyReportVisible(true)} />

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="待跟进线索"
            extra={
              <a href="/leads/my" style={{ color: 'rgb(var(--primary-6))' }}>
                查看全部
              </a>
            }
            style={{ marginBottom: 16 }}
          >
            <Table columns={leadColumns} data={recentLeads} pagination={false} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="项目进度"
            extra={
              <a href="/projects" style={{ color: 'rgb(var(--primary-6))' }}>
                查看全部
              </a>
            }
          >
            <Table columns={projectColumns} data={projectProgress} pagination={false} />
          </Card>
        </Col>
      </Row>
      <DailyReportModal
        visible={dailyReportVisible}
        onCancel={() => setDailyReportVisible(false)}
        onSubmit={(report: DailyReport) => submitDailyReport(report)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
