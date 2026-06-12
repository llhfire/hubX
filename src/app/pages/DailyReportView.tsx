import { useState } from 'react';
import { Card, Tree, Badge, Collapse, Descriptions, Table, DatePicker, Button, Tag } from '@arco-design/web-react';
import { DailyReportDetail } from './daily-report/DailyReportDetail';
import { DailyReport, DailyReportComment } from './daily-report/types';

const CollapseItem = Collapse.Item;

export function DailyReportView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['dept-1']);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [comments, setComments] = useState<DailyReportComment[]>([]);

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

  const handleViewDetail = (report: DailyReport) => {
    setSelectedReport(report);
    setDetailVisible(true);
  };

  // 模拟组织架构数据
  const orgData = [
    {
      title: '销售部',
      key: 'dept-1',
      total: 5,
      reported: 3,
      unreported: 2,
      children: [
        {
          title: '张三',
          key: 'emp-1',
          isLeaf: true,
          reported: true,
        },
        {
          title: '李四',
          key: 'emp-2',
          isLeaf: true,
          reported: true,
        },
        {
          title: '王五',
          key: 'emp-3',
          isLeaf: true,
          reported: false,
        },
        {
          title: '赵六',
          key: 'emp-4',
          isLeaf: true,
          reported: true,
        },
        {
          title: '钱七',
          key: 'emp-5',
          isLeaf: true,
          reported: false,
        },
      ],
    },
    {
      title: '技术部',
      key: 'dept-2',
      total: 3,
      reported: 2,
      unreported: 1,
      children: [
        {
          title: '孙八',
          key: 'emp-6',
          isLeaf: true,
          reported: true,
        },
        {
          title: '周九',
          key: 'emp-7',
          isLeaf: true,
          reported: true,
        },
        {
          title: '吴十',
          key: 'emp-8',
          isLeaf: true,
          reported: false,
        },
      ],
    },
    {
      title: '市场部',
      key: 'dept-3',
      total: 2,
      reported: 1,
      unreported: 1,
      children: [
        {
          title: '郑十一',
          key: 'emp-9',
          isLeaf: true,
          reported: true,
        },
        {
          title: '王十二',
          key: 'emp-10',
          isLeaf: true,
          reported: false,
        },
      ],
    },
  ];

  // 模拟员工历史日报数据（支持多种模板类型）
  const employeeReports: Record<string, DailyReport[]> = {
    'emp-1': [
      {
        id: '1',
        userId: 'emp-1',
        userName: '张三',
        department: '销售部',
        reportDate: '2026-04-25',
        templateId: 'general-template',
        templateType: 'general',
        content: {
          'project-tasks': [
            { id: 't1', projectName: '阿里巴巴-企业管理系统', taskForm: '需求沟通', hours: 3 },
            { id: 't2', projectName: '腾讯-云服务平台', taskForm: '方案编写', hours: 5 },
          ],
          'today-summary': '完成了两个项目的需求分析和方案编写工作，进展顺利。',
          'tomorrow-plan': '继续跟进项目进度，完成报价单制作。',
        },
        status: 'submitted',
        createdAt: '2026-04-25T18:00:00Z',
        updatedAt: '2026-04-25T18:00:00Z',
      },
      {
        id: '2',
        userId: 'emp-1',
        userName: '张三',
        department: '销售部',
        reportDate: '2026-04-24',
        templateId: 'sales-template',
        templateType: 'sales',
        content: {
          'lead-tracking': [
            { leadId: 'lead-1', leadName: '阿里巴巴-李总', level: 'S', statusChanges: ['S->A级'], followRecords: ['电话沟通需求，确认合作意向'] },
            { leadId: 'lead-2', leadName: '腾讯云-王总', level: 'A', statusChanges: [], followRecords: ['线下拜访，讲解产品功能'] },
          ],
          'assistance-needed': '需要市场部协助准备产品宣传材料',
          'tomorrow-plan': '继续跟进阿里巴巴项目，准备报价单',
        },
        status: 'submitted',
        createdAt: '2026-04-24T18:00:00Z',
        updatedAt: '2026-04-24T18:00:00Z',
      },
    ],
    'emp-2': [
      {
        id: '3',
        userId: 'emp-2',
        userName: '李四',
        department: '销售部',
        reportDate: '2026-04-25',
        templateId: 'general-template',
        templateType: 'general',
        content: {
          'project-tasks': [
            { id: 't3', projectName: '字节跳动-协作工具', taskForm: '客户拜访', hours: 4 },
          ],
          'today-summary': '拜访了字节跳动客户，了解了详细需求。',
          'problems-encountered': '客户对价格比较敏感，需要调整方案',
          'tomorrow-plan': '整理客户需求文档，提交初步方案。',
        },
        status: 'submitted',
        createdAt: '2026-04-25T18:00:00Z',
        updatedAt: '2026-04-25T18:00:00Z',
      },
    ],
  };

  const renderTreeTitle = (node: any) => {
    if (node.isLeaf) {
      return (
        <span>
          {node.title}
          {node.reported ? (
            <Badge status="success" text="已汇报" style={{ marginLeft: 8 }} />
          ) : (
            <Badge status="default" text="未汇报" style={{ marginLeft: 8 }} />
          )}
        </span>
      );
    }
    return (
      <span>
        {node.title}
        <span style={{ marginLeft: 8, color: 'var(--color-text-3)', fontSize: 12 }}>
          ({node.reported}/{node.total})
        </span>
      </span>
    );
  };

  const handleSelect = (selectedKeys: string[]) => {
    const key = selectedKeys[0];
    if (key && key.startsWith('emp-')) {
      setSelectedEmployee(key);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 112px)' }}>
      <Card
        style={{ width: 320, flexShrink: 0 }}
        title="组织架构"
        extra={
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            style={{ width: 140 }}
            format="YYYY-MM-DD"
          />
        }
      >
        <Tree
          treeData={orgData}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          onSelect={handleSelect}
          renderTitle={renderTreeTitle}
        />
      </Card>

      <Card
        style={{ flex: 1, overflow: 'auto' }}
        title={selectedEmployee ? `员工日报历史` : '选择员工查看日报'}
      >
        {selectedEmployee && employeeReports[selectedEmployee] ? (
          <Collapse defaultActiveKey={['0']}>
            {employeeReports[selectedEmployee].map((report, index) => {
              const isGeneral = report.templateType === 'general';
              const projectTasks = isGeneral && (report.content as any)['project-tasks'] || [];
              const totalHours = projectTasks.reduce((sum: number, t: any) => sum + (t.hours || 0), 0);

              return (
              <CollapseItem
                key={index.toString()}
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{report.reportDate} <Tag size="small" color={isGeneral ? 'arcoblue' : 'green'}>{isGeneral ? '通用' : '销售'}</Tag></span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-3)' }}>
                      {isGeneral ? `项目数: ${projectTasks.length} | 总用时: ${totalHours}小时` : '销售日报'}
                    </span>
                  </div>
                }
              >
                <div>
                  {isGeneral ? (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>今日项目用时</div>
                        <Table
                          columns={[
                            { title: '项目名称', dataIndex: 'projectName' },
                            { title: '任务形式', dataIndex: 'taskForm' },
                            { title: '用时（小时）', dataIndex: 'hours', width: 120 },
                          ]}
                          data={projectTasks}
                          pagination={false}
                          size="small"
                        />
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>今日工作总结</div>
                        <div style={{ padding: 12, background: 'var(--color-fill-2)', borderRadius: 4 }}>
                          {(report.content as any)['today-summary']}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>明日工作预期</div>
                        <div style={{ padding: 12, background: 'var(--color-fill-2)', borderRadius: 4 }}>
                          {(report.content as any)['tomorrow-plan']}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>线索跟进</div>
                        <div style={{ padding: 12, background: 'var(--color-fill-2)', borderRadius: 4 }}>
                          {(report.content as any)['lead-tracking']?.length || 0} 条跟进记录
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>需协助事项</div>
                        <div style={{ padding: 12, background: 'var(--color-fill-2)', borderRadius: 4 }}>
                          {(report.content as any)['assistance-needed'] || '无'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>明日工作计划</div>
                        <div style={{ padding: 12, background: 'var(--color-fill-2)', borderRadius: 4 }}>
                          {(report.content as any)['tomorrow-plan'] || '无'}
                        </div>
                      </div>
                    </>
                  )}

                  <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Button type="primary" size="small" onClick={() => handleViewDetail(report)}>
                      查看详情 & 评论
                    </Button>
                  </div>
                </div>
              </CollapseItem>
              );
            })}
          </Collapse>
        ) : selectedEmployee ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-3)', padding: 40 }}>
            该员工暂无日报记录
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--color-text-3)', padding: 40 }}>
            请从左侧选择员工查看日报历史
          </div>
        )}
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
