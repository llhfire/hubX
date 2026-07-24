import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Search, Plus } from 'lucide-react';
import { DailyReportDetail } from './daily-report/DailyReportDetail';
import { DailyReport, DailyReportComment } from './daily-report/types';

export function DailyReportList() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    department: '',
    dateRange: [] as string[],
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

  const renderTemplateType = (type: string) => type === 'sales' ? '销售日报' : '通用日报';

  return (
    <div>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              className="w-[200px]"
              placeholder="搜索汇报人"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.department}
              onValueChange={(value) => setSearchForm({ ...searchForm, department: value })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="销售部">销售部</SelectItem>
                <SelectItem value="技术部">技术部</SelectItem>
                <SelectItem value="市场部">市场部</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="flex h-10 w-[130px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={searchForm.dateRange[0] || ''}
                onChange={(e) => setSearchForm({ ...searchForm, dateRange: [e.target.value, searchForm.dateRange[1] || ''] })}
                placeholder="开始日期"
              />
              <span className="text-muted-foreground">至</span>
              <input
                type="date"
                className="flex h-10 w-[130px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={searchForm.dateRange[1] || ''}
                onChange={(e) => setSearchForm({ ...searchForm, dateRange: [searchForm.dateRange[0] || '', e.target.value] })}
                placeholder="结束日期"
              />
            </div>
            <Button variant="default" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>日报列表</CardTitle>
          <CardAction>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              新增日报
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 120 }}>日报时间</TableHead>
                <TableHead style={{ width: 100 }}>汇报人</TableHead>
                <TableHead style={{ width: 120 }}>部门</TableHead>
                <TableHead style={{ width: 100 }}>模板类型</TableHead>
                <TableHead style={{ width: 100 }}>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.reportDate}</TableCell>
                  <TableCell>{record.userName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{renderTemplateType(record.templateType)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetail(record)}>
                      查看详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
