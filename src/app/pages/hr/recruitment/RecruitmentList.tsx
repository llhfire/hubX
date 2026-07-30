import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Briefcase, Clock, CheckCircle2, Pause } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import { RECRUITMENT_NEEDS, CANDIDATE_DEMAND_RELATIONS } from '../mockData';
import type { RecruitmentNeedStatus } from '../types';

const statusConfig: Record<RecruitmentNeedStatus, { color: string; label: string }> = {
  '待审批': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: '待审批' },
  '招聘中': { color: 'bg-green-100 text-green-700 border-green-200', label: '招聘中' },
  '已暂停': { color: 'bg-amber-100 text-amber-700 border-amber-200', label: '已暂停' },
  '已关闭': { color: 'bg-gray-100 text-gray-600 border-gray-200', label: '已关闭' },
  '已到岗': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: '已到岗' },
};

export function RecruitmentList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredNeeds = useMemo(() => {
    return RECRUITMENT_NEEDS.filter(need => {
      if (keyword && !need.position.includes(keyword) && !need.departmentName.includes(keyword)) return false;
      if (statusFilter !== 'all' && need.status !== statusFilter) return false;
      return true;
    });
  }, [keyword, statusFilter]);

  // 统计各状态数量
  const stats = useMemo(() => ({
    total: RECRUITMENT_NEEDS.length,
    recruiting: RECRUITMENT_NEEDS.filter(n => n.status === '招聘中').length,
    pending: RECRUITMENT_NEEDS.filter(n => n.status === '待审批').length,
    paused: RECRUITMENT_NEEDS.filter(n => n.status === '已暂停').length,
    hired: RECRUITMENT_NEEDS.filter(n => n.status === '已到岗').length,
  }), []);

  // 获取每个需求的候选人数量
  const getCandidateCount = (demandId: string) => {
    return CANDIDATE_DEMAND_RELATIONS.filter(r => r.demandId === demandId).length;
  };

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">招聘需求管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新增招聘需求
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-muted-foreground/30" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">总需求数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.recruiting}</p>
              <p className="text-xs text-muted-foreground">招聘中</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">待审批</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Pause className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.paused}</p>
              <p className="text-xs text-muted-foreground">已暂停</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.hired}</p>
              <p className="text-xs text-muted-foreground">已到岗</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索岗位或部门..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="待审批">待审批</SelectItem>
            <SelectItem value="招聘中">招聘中</SelectItem>
            <SelectItem value="已暂停">已暂停</SelectItem>
            <SelectItem value="已关闭">已关闭</SelectItem>
            <SelectItem value="已到岗">已到岗</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 需求列表 */}
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>招聘岗位</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>业务线</TableHead>
                <TableHead>需求/已招</TableHead>
                <TableHead>紧急程度</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>审批状态</TableHead>
                <TableHead>申请日期</TableHead>
                <TableHead>期望到岗</TableHead>
                <TableHead>候选人数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNeeds.map((need) => (
                <TableRow
                  key={need.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => navigate(`/hr/recruitment/${need.id}`)}
                >
                  <TableCell className="font-medium">{need.position}</TableCell>
                  <TableCell>{need.departmentName}</TableCell>
                  <TableCell>{need.bizLineName}</TableCell>
                  <TableCell>
                    <span className="font-medium">{need.hiredCount}</span>
                    <span className="text-muted-foreground">/{need.headcount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      need.urgentLevel === '高' ? 'border-red-300 text-red-600' :
                      need.urgentLevel === '中' ? 'border-amber-300 text-amber-600' :
                      'border-gray-300 text-gray-500'
                    }>
                      {need.urgentLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[need.status].color}>
                      {statusConfig[need.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      need.approvalStatus === '已通过' ? 'bg-green-50 text-green-600 border-green-200' :
                      need.approvalStatus === '待审批' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }>
                      {need.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{need.requestDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{need.expectedDate}</TableCell>
                  <TableCell>{getCandidateCount(need.id)}</TableCell>
                </TableRow>
              ))}
              {filteredNeeds.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    暂无招聘需求
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
