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

type DocStatus = '已交' | '未交';
type ContractStatus = '已签' | '未签';
type TrialStatus = '试岗中' | '已转正' | '已离职';

interface OnboardingItem {
  id: string;
  name: string;
  position: string;
  department: string;
  joinDate: string;
  docStatus: DocStatus;
  trialAgreement: ContractStatus;
  laborContract: ContractStatus;
  trialStatus: TrialStatus;
}

const trialStatusColor: Record<TrialStatus, string> = {
  '试岗中': 'bg-amber-100 text-amber-700 border-amber-200',
  '已转正': 'bg-green-100 text-green-700 border-green-200',
  '已离职': 'bg-red-100 text-red-700 border-red-200',
};

const docStatusColor: Record<DocStatus, string> = {
  '已交': 'bg-green-100 text-green-700 border-green-200',
  '未交': 'bg-red-100 text-red-700 border-red-200',
};

const contractStatusColor: Record<ContractStatus, string> = {
  '已签': 'bg-green-100 text-green-700 border-green-200',
  '未签': 'bg-amber-100 text-amber-700 border-amber-200',
};

const mockData: OnboardingItem[] = [
  {
    id: '1',
    name: '黄丽',
    position: 'UI设计师',
    department: '设计部',
    joinDate: '2026-07-15',
    docStatus: '已交',
    trialAgreement: '已签',
    laborContract: '未签',
    trialStatus: '试岗中',
  },
  {
    id: '2',
    name: '吴强',
    position: '前端开发',
    department: '技术部',
    joinDate: '2026-07-10',
    docStatus: '已交',
    trialAgreement: '已签',
    laborContract: '未签',
    trialStatus: '试岗中',
  },
  {
    id: '3',
    name: '郑明',
    position: '销售经理',
    department: '销售部',
    joinDate: '2026-06-01',
    docStatus: '已交',
    trialAgreement: '已签',
    laborContract: '已签',
    trialStatus: '已转正',
  },
];

export default function OnboardingList() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">入职管理</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          发送入职邀请
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工</TableHead>
                <TableHead>岗位</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>入职日期</TableHead>
                <TableHead>资料状态</TableHead>
                <TableHead>试岗协议</TableHead>
                <TableHead>劳动合同</TableHead>
                <TableHead>试岗状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id} className="cursor-pointer">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={docStatusColor[item.docStatus]}>
                      资料{item.docStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={contractStatusColor[item.trialAgreement]}>
                      {item.trialAgreement}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={contractStatusColor[item.laborContract]}>
                      {item.laborContract}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={trialStatusColor[item.trialStatus]}>
                      {item.trialStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
