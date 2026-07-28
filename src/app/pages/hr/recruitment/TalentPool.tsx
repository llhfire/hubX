import { Heart, Search, Video } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

interface Talent {
  id: string;
  name: string;
  skills: string[];
  lastCompany: string;
  workYears: number;
  matchScore: number;
  expectedSalary: string;
  education: string;
}

function matchScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
}

const mockTalents: Talent[] = [
  {
    id: '1',
    name: '张伟',
    skills: ['React', 'TypeScript', 'Node.js'],
    lastCompany: '字节跳动',
    workYears: 5,
    matchScore: 92,
    expectedSalary: '25-30K',
    education: '本科',
  },
  {
    id: '2',
    name: '李娜',
    skills: ['Figma', 'Sketch', 'PS'],
    lastCompany: '美团',
    workYears: 3,
    matchScore: 78,
    expectedSalary: '18-22K',
    education: '本科',
  },
  {
    id: '3',
    name: '王磊',
    skills: ['Vue', 'JavaScript', 'Webpack'],
    lastCompany: '阿里云',
    workYears: 4,
    matchScore: 85,
    expectedSalary: '22-28K',
    education: '硕士',
  },
  {
    id: '4',
    name: '赵敏',
    skills: ['Python', 'Django', 'PostgreSQL'],
    lastCompany: '腾讯',
    workYears: 6,
    matchScore: 70,
    expectedSalary: '28-35K',
    education: '本科',
  },
  {
    id: '5',
    name: '陈晨',
    skills: ['React Native', 'Flutter', 'iOS'],
    lastCompany: '小米',
    workYears: 3,
    matchScore: 65,
    expectedSalary: '20-25K',
    education: '本科',
  },
  {
    id: '6',
    name: '刘洋',
    skills: ['Java', 'Spring Boot', '微服务'],
    lastCompany: '京东',
    workYears: 7,
    matchScore: 88,
    expectedSalary: '30-38K',
    education: '硕士',
  },
];

export default function TalentPool() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">人才库</h1>

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索姓名、技能、公司..." className="pl-9" />
            </div>
            <Input placeholder="技能筛选" className="w-[160px]" />
            <Input placeholder="工作年限" className="w-[120px]" />
            <Input placeholder="期望薪资" className="w-[120px]" />
            <Button>搜索</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTalents.map((talent) => (
          <Card key={talent.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{talent.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{talent.name}</span>
                      <Badge variant="outline" className={matchScoreColor(talent.matchScore)}>
                        {talent.matchScore}分
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {talent.lastCompany} · {talent.workYears}年经验 · {talent.education}
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    期望薪资: {talent.expectedSalary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {talent.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="mr-1.5 h-3.5 w-3.5" />
                      收藏
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Video className="mr-1.5 h-3.5 w-3.5" />
                      发起面试
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
