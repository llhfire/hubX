import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle,
  FileText,
  Upload,
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/separator';

interface Document {
  label: string;
  uploaded: boolean;
}

const employee = {
  name: '黄丽',
  position: 'UI设计师',
  department: '设计部',
  joinDate: '2026-07-15',
  trialDaysTotal: 7,
  trialDaysPassed: 4,
};

const documents: Document[] = [
  { label: '身份证', uploaded: true },
  { label: '学历证', uploaded: true },
  { label: '银行卡', uploaded: true },
  { label: '离职证明', uploaded: false },
];

type SignTarget = '试岗协议' | '劳动合同' | null;

export default function OnboardingDetail() {
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [signTarget, setSignTarget] = useState<SignTarget>(null);
  const [signed, setSigned] = useState<Record<string, string>>({});

  function handleOpenSign(target: SignTarget) {
    setSignTarget(target);
    setSignDialogOpen(true);
  }

  function handleSign() {
    if (signTarget) {
      const mockSignId = `ES-${Date.now().toString(36).toUpperCase()}`;
      setSigned((prev) => ({ ...prev, [signTarget]: mockSignId }));
    }
    setSignDialogOpen(false);
  }

  const trialPercent = Math.round(
    (employee.trialDaysPassed / employee.trialDaysTotal) * 100,
  );
  const trialRemaining = employee.trialDaysTotal - employee.trialDaysPassed;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">入职详情</h1>
      </div>

      <Card>
        <CardContent className="py-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
              {employee.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">{employee.name}</span>
                <Badge variant="outline">{employee.position}</Badge>
                <Badge variant="outline">{employee.department}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                入职日期: {employee.joinDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">入职资料清单</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.label}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doc.label}</span>
                </div>
                {doc.uploaded ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    已上传
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    上传
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">电子签署</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(['试岗协议', '劳动合同'] as const).map((target) => (
              <div key={target}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{target}</span>
                    {signed[target] && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        已签署
                      </Badge>
                    )}
                  </div>
                  {signed[target] ? (
                    <span className="text-xs text-muted-foreground">
                      签署编号: {signed[target]}
                    </span>
                  ) : (
                    <Button size="sm" onClick={() => handleOpenSign(target)}>
                      签署
                    </Button>
                  )}
                </div>
                <Separator className="mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">试岗期跟踪</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>
              已完成 {employee.trialDaysPassed} / {employee.trialDaysTotal} 天
            </span>
            <span className="text-muted-foreground">
              剩余 {trialRemaining} 天
            </span>
          </div>
          <Progress value={trialPercent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {trialRemaining > 0
              ? `试岗期预计 ${trialRemaining} 天后结束，届时可进行转正评估。`
              : '试岗期已结束，请进行转正评估。'}
          </p>
        </CardContent>
      </Card>

      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>电子签署 - {signTarget}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div
              className="border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={handleSign}
            >
              <p className="text-sm text-muted-foreground mb-2">
                点击此区域完成签署
              </p>
              <div className="text-4xl font-serif italic text-muted-foreground/40">
                {employee.name}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSign}>
              <CheckCircle className="mr-2 h-4 w-4" />
              确认签署
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
