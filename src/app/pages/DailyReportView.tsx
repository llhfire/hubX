import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../components/ui/collapsible';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { DailyReportDetail } from './daily-report/DailyReportDetail';
import { DailyReport, DailyReportComment } from './daily-report/types';

interface TreeNode {
  title: string;
  key: string;
  total?: number;
  reported?: number | boolean;
  unreported?: number;
  isLeaf?: boolean;
  children?: TreeNode[];
}

function OrgTreeNode({
  node,
  expandedKeys,
  onToggle,
  onSelect,
  selectedEmployee,
}: {
  node: TreeNode;
  expandedKeys: string[];
  onToggle: (key: string) => void;
  onSelect: (key: string) => void;
  selectedEmployee: string;
}) {
  const isExpanded = expandedKeys.includes(node.key);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(node.key);
    }
    if (node.isLeaf) {
      onSelect(node.key);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 cursor-pointer rounded-md px-2 py-1 text-sm hover:bg-accent ${
          selectedEmployee === node.key ? 'bg-accent font-medium' : ''
        }`}
        onClick={handleClick}
      >
        {hasChildren && (
          <span className="shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-4 shrink-0" />}
        <span>{node.title}</span>
        {node.isLeaf ? (
          node.reported ? (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              已汇报
            </span>
          ) : (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              未汇报
            </span>
          )
        ) : (
          <span className="ml-2 text-xs text-muted-foreground">
            ({node.reported}/{node.total})
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="pl-6">
          {node.children!.map((child) => (
            <OrgTreeNode
              key={child.key}
              node={child}
              expandedKeys={expandedKeys}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedEmployee={selectedEmployee}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DailyReportView() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['dept-1']);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [comments, setComments] = useState<DailyReportComment[]>([]);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ '0': true });

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

  const handleToggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectEmployee = (key: string) => {
    if (key.startsWith('emp-')) {
      setSelectedEmployee(key);
    }
  };

  const toggleCollapseItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 模拟组织架构数据
  const orgData: TreeNode[] = [
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

  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 112px)' }}>
      <Card className="w-80 shrink-0 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>组织架构</CardTitle>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-8 w-36 rounded-md border border-input bg-background px-2 text-sm"
          />
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {orgData.map((node) => (
            <OrgTreeNode
              key={node.key}
              node={node}
              expandedKeys={expandedKeys}
              onToggle={handleToggleExpand}
              onSelect={handleSelectEmployee}
              selectedEmployee={selectedEmployee}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="flex-1 overflow-auto">
        <CardHeader>
          <CardTitle>
            {selectedEmployee ? '员工日报历史' : '选择员工查看日报'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEmployee && employeeReports[selectedEmployee] ? (
            <div className="space-y-2">
              {employeeReports[selectedEmployee].map((report, index) => {
                const isGeneral = report.templateType === 'general';
                const projectTasks =
                  (isGeneral && (report.content as any)['project-tasks']) || [];
                const totalHours = projectTasks.reduce(
                  (sum: number, t: any) => sum + (t.hours || 0),
                  0
                );
                const itemKey = index.toString();

                return (
                  <Collapsible
                    key={itemKey}
                    open={openItems[itemKey] ?? false}
                    onOpenChange={() => toggleCollapseItem(itemKey)}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-4 py-3 text-sm hover:bg-accent">
                      <span className="flex items-center gap-2">
                        <span>{report.reportDate}</span>
                        <Badge
                          className={`text-xs ${
                            isGeneral ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                          }`}
                        >
                          {isGeneral ? '通用' : '销售'}
                        </Badge>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isGeneral
                          ? `项目数: ${projectTasks.length} | 总用时: ${totalHours}小时`
                          : '销售日报'}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border border-t-0 rounded-b-md px-4 py-4">
                      <div>
                        {isGeneral ? (
                          <>
                            <div className="mb-4">
                              <div className="font-semibold mb-2">今日项目用时</div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>项目名称</TableHead>
                                    <TableHead>任务形式</TableHead>
                                    <TableHead className="w-[120px]">用时（小时）</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {projectTasks.map((task: any) => (
                                    <TableRow key={task.id}>
                                      <TableCell>{task.projectName}</TableCell>
                                      <TableCell>{task.taskForm}</TableCell>
                                      <TableCell>{task.hours}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="mb-3">
                              <div className="font-semibold mb-2">今日工作总结</div>
                              <div className="rounded-md bg-muted p-3">
                                {(report.content as any)['today-summary']}
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold mb-2">明日工作预期</div>
                              <div className="rounded-md bg-muted p-3">
                                {(report.content as any)['tomorrow-plan']}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-3">
                              <div className="font-semibold mb-2">线索跟进</div>
                              <div className="rounded-md bg-muted p-3">
                                {(report.content as any)['lead-tracking']?.length || 0} 条跟进记录
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="font-semibold mb-2">需协助事项</div>
                              <div className="rounded-md bg-muted p-3">
                                {(report.content as any)['assistance-needed'] || '无'}
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold mb-2">明日工作计划</div>
                              <div className="rounded-md bg-muted p-3">
                                {(report.content as any)['tomorrow-plan'] || '无'}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="mt-4 text-right">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewDetail(report)}
                          >
                            查看详情 & 评论
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          ) : selectedEmployee ? (
            <div className="p-10 text-center text-muted-foreground">
              该员工暂无日报记录
            </div>
          ) : (
            <div className="p-10 text-center text-muted-foreground">
              请从左侧选择员工查看日报历史
            </div>
          )}
        </CardContent>
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
