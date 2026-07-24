import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '../../components/ui/pagination';
import { initialDailyReports, initialProjects } from '../project-management/mockData';

export function ProjectDailyReportsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // 分页计算
  const totalPages = Math.ceil(projectDailyReports.length / pageSize);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return projectDailyReports.slice(start, start + pageSize);
  }, [projectDailyReports, currentPage]);

  if (!project) {
    return <div>项目不存在</div>;
  }

  return (
    <div>
      {/* 顶部导航 */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={() => navigate(`/projects/${projectId}`)}>
          <ArrowLeft className="h-4 w-4" />
          返回项目
        </Button>
        <h4 className="text-lg font-semibold m-0">
          关联日报 — {project.name}
        </h4>
      </div>

      {/* 工时概览 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>工时概览</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">编号</TableHead>
                <TableHead className="w-[120px]">人员名称</TableHead>
                <TableHead className="w-[150px]">职位</TableHead>
                <TableHead className="w-[100px]">已用工时</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberHours.map((member, index) => (
                <TableRow key={member.personName}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{member.personName}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.hours}H</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium bg-muted/50">
                <TableCell colSpan={3}>总计</TableCell>
                <TableCell>{totalHours}H</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 日报列表 */}
      <Card>
        <CardHeader>
          <CardTitle>日报列表 ({projectDailyReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">编号</TableHead>
                  <TableHead className="w-[120px]">日期</TableHead>
                  <TableHead className="w-[100px]">提交人</TableHead>
                  <TableHead className="w-[150px]">职位</TableHead>
                  <TableHead className="w-[80px]">工时(h)</TableHead>
                  <TableHead>工作内容</TableHead>
                  <TableHead className="w-[200px]">风险反馈</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.personName}</TableCell>
                    <TableCell>{report.position}</TableCell>
                    <TableCell>{report.hours}</TableCell>
                    <TableCell>
                      <span className="block max-w-[400px] truncate">
                        {report.workContent}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="block max-w-[200px] truncate text-muted-foreground">
                        {report.riskFeedback}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                共 {projectDailyReports.length} 条记录
              </span>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
