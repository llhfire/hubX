import { Card, Grid, Statistic, Table, Typography, Badge, Progress } from '@arco-design/web-react';
import { useState } from 'react';
import {
  IconArrowRise,
  IconArrowFall,
  IconCustomerService,
  IconUser,
  IconApps,
} from '@arco-design/web-react/icon';
import { DailyReportModal } from './daily-report/DailyReportModal';
import type { DailyReport } from './daily-report/types';
import { ReminderTodoPanel } from '../reminders/components/ReminderTodoPanel';
import { useReminders } from '../reminders/ReminderContext';

const Row = Grid.Row;
const Col = Grid.Col;

export function Dashboard() {
  const [dailyReportVisible, setDailyReportVisible] = useState(false);
  const { submitDailyReport } = useReminders();
  const currentUserId = 'user-sales-zhangsan';

  // --- Statistics — use semantic brand colors instead of hardcoded hex ---
  const statistics = [
    {
      title: '本月新增线索',
      value: 156,
      comparison: '+12.5%',
      trend: 'up' as const,
      icon: <IconCustomerService style={{ fontSize: 24 }} />,
      color: 'hsl(221, 83%, 53%)',       // brand blue
    },
    {
      title: '待跟进线索',
      value: 42,
      comparison: '-8.3%',
      trend: 'down' as const,
      icon: <IconCustomerService style={{ fontSize: 24 }} />,
      color: 'hsl(142, 76%, 36%)',        // success green
    },
    {
      title: '本月签约客户',
      value: 28,
      comparison: '+18.2%',
      trend: 'up' as const,
      icon: <IconUser style={{ fontSize: 24 }} />,
      color: 'hsl(30, 90%, 44%)',         // warning amber
    },
    {
      title: '进行中项目',
      value: 35,
      comparison: '+5.7%',
      trend: 'up' as const,
      icon: <IconApps style={{ fontSize: 24 }} />,
      color: 'hsl(0, 78%, 50%)',          // destructive red
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

  // --- Table columns with deliberate hierarchy ---
  // Primary columns (name): bolder, darker. Secondary columns (time): lighter.
  const leadColumns = [
    {
      title: '线索名称',
      dataIndex: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: 'hsl(220 20% 10%)' }}>{text}</span>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customer',
      render: (text: string) => (
        <span style={{ color: 'hsl(220 10% 35%)' }}>{text}</span>
      ),
    },
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
    {
      title: '最后跟进',
      dataIndex: 'followTime',
      render: (text: string) => (
        <span style={{ color: 'hsl(220 8% 55%)', fontSize: 13 }}>{text}</span>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      render: (text: string) => (
        <span style={{ color: 'hsl(220 10% 35%)' }}>{text}</span>
      ),
    },
  ];

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: 'hsl(220 20% 10%)' }}>{text}</span>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customer',
      render: (text: string) => (
        <span style={{ color: 'hsl(220 10% 35%)' }}>{text}</span>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      render: (progress: number) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={progress}
            size="small"
            style={{ width: 100 }}
            color={
              progress >= 70
                ? 'hsl(142 76% 36%)'
                : progress >= 40
                  ? 'hsl(221 83% 53%)'
                  : 'hsl(30 90% 44%)'
            }
          />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220 15% 25%)' }}>
            {progress}%
          </span>
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
    {
      title: '截止日期',
      dataIndex: 'deadline',
      render: (text: string) => (
        <span style={{ color: 'hsl(220 8% 55%)', fontSize: 13 }}>{text}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Page label — subtle, not a giant heading.
          Per Refactoring UI: section titles are labels for the content below. */}
      <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220 8% 55%)', marginBottom: 20, letterSpacing: '0.025em', textTransform: 'uppercase' }}>
        工作台
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statistics.map((stat, index) => (
          <Col span={6} key={index}>
            <Card
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xs)',
                border: '1px solid hsl(220 12% 88%)',
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div className="flex items-start justify-between">
                <div style={{ flex: 1 }}>
                  {/* Label: de-emphasized */}
                  <div style={{ fontSize: 13, color: 'hsl(220 8% 55%)', marginBottom: 8 }}>
                    {stat.title}
                  </div>
                  {/* Value: prominent, the star */}
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'hsl(220 20% 10%)', marginBottom: 8, lineHeight: 1.2 }}>
                    {stat.value.toLocaleString()}
                  </div>
                  {/* Trend: secondary indicator */}
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <IconArrowRise style={{ fontSize: 14, color: 'hsl(142 76% 36%)' }} />
                    ) : (
                      <IconArrowFall style={{ fontSize: 14, color: 'hsl(0 78% 50%)' }} />
                    )}
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: stat.trend === 'up' ? 'hsl(142 76% 36%)' : 'hsl(0 78% 50%)',
                      }}
                    >
                      {stat.comparison}
                    </span>
                    <span style={{ fontSize: 12, color: 'hsl(220 8% 55%)', marginLeft: 2 }}>环比</span>
                  </div>
                </div>
                {/* Icon container — soft background with matching tint */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: `${stat.color}14`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Reminder Todo Panel */}
      <ReminderTodoPanel onOpenDailyReport={() => setDailyReportVisible(true)} />

      {/* Leads Table */}
      <Card
        title={
          <span style={{ fontSize: 14, fontWeight: 500, color: 'hsl(220 15% 25%)' }}>
            待跟进线索
          </span>
        }
        extra={
          <a
            href="/leads/my"
            style={{ fontSize: 13, color: 'hsl(220 8% 55%)', textDecoration: 'none' }}
          >
            查看全部 →
          </a>
        }
        style={{
          marginBottom: 16,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          border: '1px solid hsl(220 12% 88%)',
        }}
        bodyStyle={{ padding: '0 20px 20px' }}
      >
        <Table columns={leadColumns} data={recentLeads} pagination={false} />
      </Card>

      {/* Project Progress Table */}
      <Card
        title={
          <span style={{ fontSize: 14, fontWeight: 500, color: 'hsl(220 15% 25%)' }}>
            项目进度
          </span>
        }
        extra={
          <a
            href="/projects"
            style={{ fontSize: 13, color: 'hsl(220 8% 55%)', textDecoration: 'none' }}
          >
            查看全部 →
          </a>
        }
        style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xs)',
          border: '1px solid hsl(220 12% 88%)',
        }}
        bodyStyle={{ padding: '0 20px 20px' }}
      >
        <Table columns={projectColumns} data={projectProgress} pagination={false} />
      </Card>

      <DailyReportModal
        visible={dailyReportVisible}
        onCancel={() => setDailyReportVisible(false)}
        onSubmit={(report: DailyReport) => submitDailyReport(report)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
