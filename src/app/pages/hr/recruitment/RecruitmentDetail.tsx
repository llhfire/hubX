import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Users } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import { RECRUITMENT_NEEDS, CANDIDATE_DEMAND_RELATIONS, CANDIDATES } from '../mockData';
import type { RecruitmentNeedStatus, CandidateStage } from '../types';

const statusConfig: Record<RecruitmentNeedStatus, { color: string }> = {
  '待审批': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  '招聘中': { color: 'bg-green-100 text-green-700 border-green-200' },
  '已暂停': { color: 'bg-amber-100 text-amber-700 border-amber-200' },
  '已关闭': { color: 'bg-gray-100 text-gray-600 border-gray-200' },
  '已到岗': { color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

const stageConfig: Record<CandidateStage, { color: string }> = {
  '简历筛选': { color: 'bg-gray-100 text-gray-600 border-gray-200' },
  '面试中': { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  '待定薪': { color: 'bg-purple-100 text-purple-700 border-purple-200' },
  '已发Offer': { color: 'bg-amber-100 text-amber-700 border-amber-200' },
  '已接受': { color: 'bg-green-100 text-green-700 border-green-200' },
  '已拒绝': { color: 'bg-red-100 text-red-600 border-red-200' },
  '已淘汰': { color: 'bg-red-100 text-red-500 border-red-200' },
};

function matchScoreColor(score: number): string {
  if (score >= 85) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 70) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
}

export function RecruitmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const need = useMemo(
    () => RECRUITMENT_NEEDS.find((n) => n.id === id),
    [id],
  );

  const candidates = useMemo(() => {
    if (!id) return [];
    const relations = CANDIDATE_DEMAND_RELATIONS.filter((r) => r.demandId === id);
    return relations
      .map((rel) => {
        const candidate = CANDIDATES.find((c) => c.id === rel.candidateId);
        return { ...rel, candidate };
      })
      .filter((item) => item.candidate != null);
  }, [id]);

  if (!need) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate('/hr/recruitment')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <p className="text-muted-foreground">未找到该招聘需求</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/recruitment')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-slate-800">{need.position}</h1>
        <Badge variant="outline" className={statusConfig[need.status].color}>
          {need.status}
        </Badge>
        <Badge variant="outline" className={
          need.urgentLevel === '高' ? 'border-red-300 text-red-600' :
          need.urgentLevel === '中' ? 'border-amber-300 text-amber-600' :
          'border-gray-300 text-gray-500'
        }>
          紧急程度: {need.urgentLevel}
        </Badge>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <Users className="h-8 w-8 text-muted-foreground/30" />
            <div>
              <p className="text-2xl font-bold">
                {need.hiredCount}<span className="text-sm text-muted-foreground">/{need.headcount}</span>
              </p>
              <p className="text-xs text-muted-foreground">已到岗/需求人数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{candidates.length}</p>
              <p className="text-xs text-muted-foreground">候选人数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">部门</p>
            <p className="mt-1 font-medium">{need.departmentName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">业务线</p>
            <p className="mt-1 font-medium">{need.bizLineName}</p>
          </CardContent>
        </Card>
      </div>

      {/* 岗位详情 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">岗位描述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{need.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">岗位要求</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {need.requirements}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 时间与审批信息 */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">申请日期</span>
              <p className="mt-1 font-medium">{need.requestDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">期望到岗</span>
              <p className="mt-1 font-medium">{need.expectedDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">审批人</span>
              <p className="mt-1 font-medium">{need.approver}</p>
            </div>
            <div>
              <span className="text-muted-foreground">审批状态</span>
              <p className="mt-1">
                <Badge variant="outline" className={
                  need.approvalStatus === '已通过' ? 'bg-green-50 text-green-600 border-green-200' :
                  need.approvalStatus === '待审批' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                  'bg-red-50 text-red-600 border-red-200'
                }>
                  {need.approvalStatus}
                </Badge>
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">创建时间</span>
              <p className="mt-1 font-medium">{need.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 候选人列表 */}
      <div>
        <h2 className="text-lg font-semibold mb-3">候选人列表</h2>
        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>阶段</TableHead>
                  <TableHead>AI匹配度</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>最近更新</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map(({ candidate, stage, matchScore, updatedAt }) => (
                  <TableRow key={candidate!.id}>
                    <TableCell className="font-medium">{candidate!.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={stageConfig[stage].color}>
                        {stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={matchScoreColor(matchScore)}>
                        {matchScore}分
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{candidate!.source}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/hr/candidates/${candidate!.id}`)}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {candidates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      暂无候选人
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
