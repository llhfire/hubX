import { useState } from 'react';
import { Card, Table, Button, Input, Select, DatePicker, Space } from '@arco-design/web-react';
import { IconSearch, IconPlus } from '@arco-design/web-react/icon';
import { DailyReportDetail } from './daily-report/DailyReportDetail';
import { DailyReport, DailyReportComment } from './daily-report/types';

const { RangePicker } = DatePicker;

export function DailyReportList() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    department: '',
    dateRange: [],
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [comments, setComments] = useState<DailyReportComment[]>([]);

  // 模拟数据
  const mockData: DailyReport[] = [
    {
      id: '1',
      userId: 'user-sales-zhangsan',
      userName: '张三',
      department: '销售部',
      reportDate: '2026-04-25',
      templateId: 'general-template',
      templateType: 'general',
      status: 'submitted',
      createdAt: '2026-04-25T18:00:00Z',
      updatedAt: '2026-04-25T18:00:00Z',
      content: {
        'project-tasks': [
          { id: 't1', projectName: '阿里巴巴-企业管理系统', taskForm: '需求沟通', hours: 3 },
          { id: 't2', projectName: '腾讯-云服务平台', taskForm: '方案编写', hours: 5 },
        ],
        'today-summary': '完成了两个项目的需求分析和方案编写工作，进展顺利。',
        'tomorrow-plan': '继续跟进项目进度，完成报价单制作。',
      },
    },
    {
      id: '2',
      userId: 'user-sales-lisi',
      userName: '李四',
      department: '销售部',
      reportDate: '2026-04-24',
      templateId: 'sales-template',
      templateType: 'sales',
      status: 'submitted',
      createdAt: '2026-04-24T18:00:00Z',
      updatedAt: '2026-04-24T18:00:00Z',
      content: {
        'lead-tracking': [
          {
            leadId: 'lead-1',
            leadName: '字节跳动',
            level: 'S',
            statusChanges: ['初次接触 -> 需求确认'],
            followRecords: ['拜访了字节跳动客户，了解了详细需求。'],
          },
        ],
        'tomorrow-plan': '整理客户需求文档，提交初步方案。',
      },
    },
    {
      id: '3',
      userId: 'user-tech-wangwu',
      userName: '王五',
      department: '技术部',
      reportDate: '2026-04-24',
      templateId: 'general-template',
      templateType: 'general',
      status: 'submitted',
      createdAt: '2026-04-24T18:00:00Z',
      updatedAt: '2026-04-24T18:00:00Z',
      content: {
        'project-tasks': [
          { id: 't3', projectName: '阿里巴巴-企业管理系统', taskForm: '技术调研', hours: 6 },
        ],
        'today-summary': '完成技术方案调研，确定技术栈。',
        'tomorrow-plan': '开始架构设计工作。',
      },
    },
  ];

  const handleAddComment = (reportId: string, content: string, mentionedUsers: string[]) => {
    const newComment: DailyReportComment = {
      id: `comment-${Date.now()}`,
      reportId,
      userId: 'user-sales-zhangsan',
      userName: '张三',
      content,
      mentionedUsers,
      createdAt: new Date().toISOString(),
      readBy: ['user-sales-zhangsan'],
    };
    setComments([...comments, newComment]);
  };

  const columns = [
    {
      title: '日报时间',
      dataIndex: 'reportDate',
      width: 120,
      key: 'reportDate',
    },
    {
      title: '汇报人',
      dataIndex: 'userName',
      width: 100,
      key: 'userName',
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
      key: 'department',
    },
    {
      title: '模板类型',
      dataIndex: 'templateType',
      width: 100,
      key: 'templateType',
      render: (type: string) => type === 'sales' ? '销售日报' : '通用日报',
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: 100,
      key: 'op',
      render: (_: any, record: DailyReport) => (
        <Button type="text" size="small" onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  const handleSearch = () => {
    console.log('搜索条件：', searchForm);
  };

  const handleReset = () => {
    setSearchForm({
      keyword: '',
      department: '',
      dateRange: [],
    });
  };

  const handleViewDetail = (record: DailyReport) => {
    setSelectedReport(record);
    setDetailVisible(true);
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space size="medium" wrap>
          <Input
            style={{ width: 200 }}
            placeholder="搜索汇报人"
            value={searchForm.keyword}
            onChange={(value) => setSearchForm({ ...searchForm, keyword: value })}
            allowClear
          />
          <Select
            style={{ width: 200 }}
            placeholder="选择部门"
            value={searchForm.department}
            onChange={(value) => setSearchForm({ ...searchForm, department: value })}
            allowClear
            options={[
              { label: '销售部', value: '销售部' },
              { label: '技术部', value: '技术部' },
              { label: '市场部', value: '市场部' },
            ]}
          />
          <RangePicker
            style={{ width: 280 }}
            placeholder={['开始日期', '结束日期']}
            value={searchForm.dateRange}
            onChange={(value) => setSearchForm({ ...searchForm, dateRange: value })}
          />
          <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Card>

      <Card
        title="日报列表"
        extra={
          <Button type="primary" icon={<IconPlus />}>
            新增日报
          </Button>
        }
      >
        <Table
          columns={columns}
          data={mockData}
          pagination={{
            total: mockData.length,
            pageSize: 10,
            showTotal: true,
            sizeCanChange: true,
          }}
        />
      </Card>

      <DailyReportDetail
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        report={selectedReport}
        comments={comments}
        onAddComment={handleAddComment}
        currentUserId="user-sales-zhangsan"
      />
    </div>
  );
}
