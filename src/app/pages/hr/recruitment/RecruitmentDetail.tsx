import { ArrowLeft, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

type Stage = '简历筛选' | '初试' | '复试' | '待定薪' | '已录用' | '已淘汰';

interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  interviewScore: number;
  stage: Stage;
  currentCompany: string;
  experience: string;
}

const stageColorMap: Record<Stage, string> = {
  '简历筛选': 'bg-gray-100 text-gray-600 border-gray-200',
  '初试': 'bg-blue-100 text-blue-700 border-blue-200',
  '复试': 'bg-purple-100 text-purple-700 border-purple-200',
  '待定薪': 'bg-amber-100 text-amber-700 border-amber-200',
  '已录用': 'bg-green-100 text-green-700 border-green-200',
  '已淘汰': 'bg-red-100 text-red-700 border-red-200',
};

function matchScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
}

const position = {
  title: '前端开发',
  department: '技术部',
  status: '招聘中',
  urgency: '高',
  headcount: 2,
  businessLine: '软件定制',
};

const candidates: Candidate[] = [
  {
    id: '1',
    name: '张伟',
    matchScore: 92,
    interviewScore: 88,
    stage: '待定薪',
    currentCompany: '字节跳动',
    experience: '5年前端经验',
  },
  {
    id: '2',
    name: '李娜',
    matchScore: 78,
    interviewScore: 82,
    stage: '复试',
    currentCompany: '美团',
    experience: '3年前端经验',
  },
  {
    id: '3',
    name: '王磊',
    matchScore: 55,
    interviewScore: 65,
    stage: '初试',
    currentCompany: '创业公司',
    experience: '2年前端经验',
  },
];

export default function RecruitmentDetail() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">{position.title}</h1>
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
          {position.status}
        </Badge>
        <Badge variant="outline" className="border-red-300 text-red-600">
          紧急程度: {position.urgency}
        </Badge>
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">部门</span>
              <p className="mt-1 font-medium">{position.department}</p>
            </div>
            <div>
              <span className="text-muted-foreground">业务线</span>
              <p className="mt-1 font-medium">{position.businessLine}</p>
            </div>
            <div>
              <span className="text-muted-foreground">需求人数</span>
              <p className="mt-1 font-medium">{position.headcount}人</p>
            </div>
            <div>
              <span className="text-muted-foreground">候选人总数</span>
              <p className="mt-1 font-medium">{candidates.length}人</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">候选人列表</h2>
        <Button variant="outline" size="sm">
          添加候选人
        </Button>
      </div>

      <div className="grid gap-4">
        {candidates.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{c.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      <Badge variant="outline" className={stageColorMap[c.stage]}>
                        {c.stage}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {c.currentCompany} · {c.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">AI匹配度</p>
                    <Badge variant="outline" className={`mt-1 ${matchScoreColor(c.matchScore)}`}>
                      {c.matchScore}分
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">面试评分</p>
                    <Badge variant="outline" className="mt-1">
                      {c.interviewScore}分
                    </Badge>
                  </div>
                  {c.stage === '待定薪' && (
                    <Button size="sm">发起定薪</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
