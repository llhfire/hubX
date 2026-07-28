import { Plus } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

type RecruitmentStatus = '招聘中' | '已暂停' | '已关闭' | '已到岗';

interface RecruitmentItem {
  id: string;
  position: string;
  department: string;
  businessLine: string;
  headcount: number;
  urgency: '高' | '中' | '低';
  status: RecruitmentStatus;
  applyDate: string;
  expectedDate: string;
  candidateCount: number;
}

const statusColorMap: Record<RecruitmentStatus, string> = {
  '招聘中': 'bg-green-100 text-green-700 border-green-200',
  '已暂停': 'bg-amber-100 text-amber-700 border-amber-200',
  '已关闭': 'bg-gray-100 text-gray-600 border-gray-200',
  '已到岗': 'bg-blue-100 text-blue-700 border-blue-200',
};

const mockData: RecruitmentItem[] = [
  {
    id: '1',
    position: '前端开发',
    department: '技术部',
    businessLine: '软件定制',
    headcount: 2,
    urgency: '高',
    status: '招聘中',
    applyDate: '2026-06-15',
    expectedDate: '2026-08-01',
    candidateCount: 12,
  },
  {
    id: '2',
    position: 'UI设计师',
    department: '设计部',
    businessLine: '软件定制',
    headcount: 1,
    urgency: '中',
    status: '招聘中',
    applyDate: '2026-06-20',
    expectedDate: '2026-08-15',
    candidateCount: 8,
  },
  {
    id: '3',
    position: '销售经理',
    department: '销售部',
    businessLine: '电商',
    headcount: 1,
    urgency: '低',
    status: '已关闭',
    applyDate: '2026-05-10',
    expectedDate: '2026-07-01',
    candidateCount: 5,
  },
];

export default function RecruitmentList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">招聘需求管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新增招聘需求
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>招聘岗位</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>业务线</TableHead>
                <TableHead>需求人数</TableHead>
                <TableHead>紧急程度</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>申请日期</TableHead>
                <TableHead>期望到岗</TableHead>
                <TableHead>候选人数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50">
                  <TableCell className="font-medium">{item.position}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.businessLine}</TableCell>
                  <TableCell>{item.headcount}人</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.urgency === '高'
                          ? 'border-red-300 text-red-600'
                          : item.urgency === '中'
                            ? 'border-amber-300 text-amber-600'
                            : 'border-gray-300 text-gray-500'
                      }
                    >
                      {item.urgency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColorMap[item.status]}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.applyDate}</TableCell>
                  <TableCell>{item.expectedDate}</TableCell>
                  <TableCell>{item.candidateCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
