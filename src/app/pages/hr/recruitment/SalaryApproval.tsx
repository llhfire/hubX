import { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, ArrowLeft, Brain, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Separator } from '@/app/components/ui/separator';
import { toast } from 'sonner';
import { AIFeatureTag } from '../components/AIFeatureTag';

interface ApprovalStep {
  label: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
}

const candidate = {
  name: '张伟',
  position: '前端开发',
  department: '技术部',
  currentCompany: '字节跳动',
  experience: '5年',
  matchScore: 92,
  interviewScore: 88,
};

const salaryProposal = {
  baseSalary: '15,000',
  performance: '3,000',
  allowance: '500',
  total: '18,500',
  budgetSaving: '10%',
};

const aiSuggestion = {
  range: '12K - 14K',
  level: 'P4',
  percentile: '50分位',
  note: '基于候选人4年竞品电商PM经验及市场薪酬数据，建议底薪12K-14K，位于公司同职级P4的50分位。',
};

const approvalSteps: ApprovalStep[] = [
  { label: 'HR 提交', approver: '王小红', status: 'approved' },
  { label: '总经理审批', approver: '李总', status: 'pending' },
  { label: '老板确认', approver: '陈总', status: 'pending' },
];

const bossSummary =
  '候选人张伟，竞品电商PM经验4年，拟定底薪15K+绩效3K，低于部门预算10%。';

export function SalaryApproval() {
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = () => {
    setApprovalStatus('approved');
    toast.success('审批已通过', {
      description: '定薪方案已通过，系统将自动通知 HR 和候选人',
      style: { borderLeft: '4px solid #22c55e' },
      position: 'top-right',
    });
  };

  const handleReject = () => {
    setApprovalStatus('rejected');
    toast.error('审批已驳回', {
      description: '定薪方案已驳回，HR 将收到通知并重新拟定方案',
      style: { borderLeft: '4px solid #ef4444' },
      position: 'top-right',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">定薪审批</h1>
        {approvalStatus !== 'pending' && (
          <Badge
            className={approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
          >
            {approvalStatus === 'approved' ? '已通过' : '已驳回'}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">候选人信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{candidate.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">{candidate.name}</span>
                <Badge variant="outline">{candidate.position}</Badge>
                <Badge variant="outline">{candidate.department}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {candidate.currentCompany} · {candidate.experience}经验 · 匹配度{' '}
                {candidate.matchScore}分 · 面试 {candidate.interviewScore}分
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">拟定薪资方案</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">底薪</label>
              <Input value={salaryProposal.baseSalary} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">绩效</label>
              <Input value={salaryProposal.performance} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">补贴</label>
              <Input value={salaryProposal.allowance} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">合计</label>
              <Input value={salaryProposal.total} readOnly className="font-semibold" />
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              低于部门预算 {salaryProposal.budgetSaving}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-violet-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-500" />
            智能定薪建议
            <AIFeatureTag
              text="AI 薪酬分析"
              detail="基于候选人竞品经验、市场薪酬分位数及公司职级体系综合评估"
              level="suggestion"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-violet-800">
              建议底薪 12k-14k，位于公司同职级 P4 的 50 分位
            </p>
            <p className="text-sm text-violet-600">{aiSuggestion.note}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground">建议范围</div>
              <div className="text-lg font-semibold text-slate-800">{aiSuggestion.range}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground">对标职级</div>
              <div className="text-lg font-semibold text-slate-800">{aiSuggestion.level}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground">市场分位</div>
              <div className="text-lg font-semibold text-slate-800">{aiSuggestion.percentile}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            老板审批摘要
            <AIFeatureTag
              text="AI 自动摘要"
              detail="自动提取候选人关键信息并生成结构化审批摘要，节省老板阅读时间"
              level="info"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 leading-relaxed">
              {bossSummary}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">审批流程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {approvalSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : step.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {step.status === 'approved' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : step.status === 'rejected' ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{step.label}</span>
                  <span className="text-xs font-medium">{step.approver}</span>
                </div>
                {i < approvalSteps.length - 1 && (
                  <div className="w-12 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="destructive"
          onClick={handleReject}
          disabled={approvalStatus !== 'pending'}
        >
          <XCircle className="mr-2 h-4 w-4" />
          拒绝
        </Button>
        <Button
          onClick={handleApprove}
          disabled={approvalStatus !== 'pending'}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          通过
        </Button>
      </div>
    </div>
  );
}
