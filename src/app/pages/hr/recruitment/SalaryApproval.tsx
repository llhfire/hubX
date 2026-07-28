import { Sparkles, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Separator } from '@/app/components/ui/separator';

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

export default function SalaryApproval() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">定薪审批</h1>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            AI 薪酬建议
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-200 gap-1">
              <Sparkles className="h-3 w-3" />
              AI Feature
            </Badge>
            <span className="text-sm">
              建议底薪 {aiSuggestion.range}，位于公司同职级 {aiSuggestion.level} 的{' '}
              {aiSuggestion.percentile}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{aiSuggestion.note}</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">老板摘要</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {bossSummary}
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button variant="destructive">
          <XCircle className="mr-2 h-4 w-4" />
          驳回
        </Button>
        <Button>
          <CheckCircle className="mr-2 h-4 w-4" />
          通过
        </Button>
      </div>
    </div>
  );
}
