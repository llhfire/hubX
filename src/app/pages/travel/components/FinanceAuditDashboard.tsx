import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, Shield, ChevronDown, ChevronUp, User, MapPin, Clock, Receipt } from 'lucide-react';

interface AuditCase {
  id: string;
  tripNo: string;
  applicantName: string;
  department: string;
  destination: string;
  tripDays: number;
  tripData: {
    applyDate: string;
    declaredTransport: number;
    declaredAccommodation: number;
    declaredMeal: number;
    declaredTotal: number;
  };
  punchData: {
    expectedDays: number;
    actualPunchDays: number;
    matchRate: number;
    abnormalDays: number;
  };
  invoiceData: {
    submittedCount: number;
    totalAmount: number;
    matchedAmount: number;
    unmatchedAmount: number;
    overStandardAmount: number;
  };
  aiConclusion: 'pass' | 'partial_deduct' | 'reject';
  aiSummary: string;
  anomalies: { type: 'error' | 'warning'; message: string }[];
  deductAmount?: number;
}

const MOCK_AUDIT_CASES: AuditCase[] = [
  {
    id: 'audit-1',
    tripNo: 'BT20260425001',
    applicantName: '张三',
    department: '销售部',
    destination: '杭州',
    tripDays: 3,
    tripData: {
      applyDate: '2026-04-25',
      declaredTransport: 1000,
      declaredAccommodation: 1200,
      declaredMeal: 600,
      declaredTotal: 2800,
    },
    punchData: {
      expectedDays: 3,
      actualPunchDays: 3,
      matchRate: 100,
      abnormalDays: 0,
    },
    invoiceData: {
      submittedCount: 5,
      totalAmount: 2950,
      matchedAmount: 2750,
      unmatchedAmount: 200,
      overStandardAmount: 0,
    },
    aiConclusion: 'pass',
    aiSummary: '打卡记录与出差天数完全匹配，发票金额与申报基本一致，推荐全额通过。',
    anomalies: [],
  },
  {
    id: 'audit-2',
    tripNo: 'BT20260424001',
    applicantName: '李四',
    department: '销售部',
    destination: '深圳',
    tripDays: 2,
    tripData: {
      applyDate: '2026-04-24',
      declaredTransport: 2000,
      declaredAccommodation: 800,
      declaredMeal: 300,
      declaredTotal: 3100,
    },
    punchData: {
      expectedDays: 2,
      actualPunchDays: 1,
      matchRate: 50,
      abnormalDays: 1,
    },
    invoiceData: {
      submittedCount: 3,
      totalAmount: 2950,
      matchedAmount: 2600,
      unmatchedAmount: 350,
      overStandardAmount: 180,
    },
    aiConclusion: 'partial_deduct',
    aiSummary: '第2天无打卡记录，住宿发票金额超出标准，建议扣减 530 元后通过。',
    deductAmount: 530,
    anomalies: [
      { type: 'warning', message: '4月27日无打卡记录，需确认是否实际出差' },
      { type: 'error', message: '住宿发票 800 元超出一线城市标准（220 元/天），超标 580 元' },
      { type: 'warning', message: '餐饮发票 150 元超出单日餐补标准（40 元/天），建议按标准报销' },
    ],
  },
  {
    id: 'audit-3',
    tripNo: 'BT20260420003',
    applicantName: '赵六',
    department: '技术部',
    destination: '成都',
    tripDays: 5,
    tripData: {
      applyDate: '2026-04-20',
      declaredTransport: 600,
      declaredAccommodation: 1100,
      declaredMeal: 800,
      declaredTotal: 2500,
    },
    punchData: {
      expectedDays: 5,
      actualPunchDays: 2,
      matchRate: 40,
      abnormalDays: 3,
    },
    invoiceData: {
      submittedCount: 4,
      totalAmount: 2400,
      matchedAmount: 1200,
      unmatchedAmount: 1200,
      overStandardAmount: 660,
    },
    aiConclusion: 'reject',
    aiSummary: '打卡记录严重缺失（仅2/5天），住宿金额大幅超标，多项费用无法匹配发票，建议拒绝报销并要求补充材料。',
    anomalies: [
      { type: 'error', message: '5天出差仅2天有打卡记录，打卡匹配率 40%，严重不达标' },
      { type: 'error', message: '住宿发票 1100 元超出标准（220 元/天×5天=1100 元），但打卡仅2天，实际可报销 440 元' },
      { type: 'error', message: '1200 元费用无法找到对应发票凭证' },
      { type: 'warning', message: '出差期间有异地打卡记录，疑似未在目的地打卡' },
      { type: 'warning', message: '交通费用 600 元无对应车票/机票附件' },
    ],
  },
];

const conclusionConfig = {
  pass: { label: '推荐通过', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle2 },
  partial_deduct: { label: '部分扣减', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertTriangle },
  reject: { label: '建议拒绝', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
};

function AuditCaseCard({ auditCase }: { auditCase: AuditCase }) {
  const [expanded, setExpanded] = useState(false);
  const config = conclusionConfig[auditCase.aiConclusion];
  const ConclusionIcon = config.icon;

  return (
    <Card className={auditCase.aiConclusion === 'reject' ? 'border-red-200' : auditCase.aiConclusion === 'partial_deduct' ? 'border-amber-200' : 'border-green-200'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{auditCase.applicantName}</span>
                <Badge variant="outline" className="text-xs">{auditCase.department}</Badge>
                <span className="text-xs text-gray-500">{auditCase.tripNo}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {auditCase.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {auditCase.tripDays}天
                </span>
                <span className="flex items-center gap-1">
                  <Receipt className="h-3 w-3" />
                  {'¥'}{auditCase.tripData.declaredTotal}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${config.color}`}>
              <ConclusionIcon className="h-4 w-4" />
              {config.label}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Alert className={auditCase.aiConclusion === 'reject' ? 'border-red-200 bg-red-50' : auditCase.aiConclusion === 'partial_deduct' ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}>
          <Shield className="h-4 w-4" />
          <AlertTitle>AI 审核结论</AlertTitle>
          <AlertDescription>
            {auditCase.aiSummary}
            {auditCase.deductAmount && (
              <span className="block mt-1 font-medium">建议扣减金额：{'¥'}{auditCase.deductAmount}</span>
            )}
          </AlertDescription>
        </Alert>

        {expanded && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Receipt className="h-3 w-3" />
                  出差申请数据
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">交通费</span>
                    <span>{'¥'}{auditCase.tripData.declaredTransport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">住宿费</span>
                    <span>{'¥'}{auditCase.tripData.declaredAccommodation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">餐饮费</span>
                    <span>{'¥'}{auditCase.tripData.declaredMeal}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>合计</span>
                    <span>{'¥'}{auditCase.tripData.declaredTotal}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  打卡记录对比
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">应出勤</span>
                    <span>{auditCase.punchData.expectedDays} 天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">实际打卡</span>
                    <span>{auditCase.punchData.actualPunchDays} 天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">匹配率</span>
                    <span className={auditCase.punchData.matchRate < 80 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {auditCase.punchData.matchRate}%
                    </span>
                  </div>
                  {auditCase.punchData.abnormalDays > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>异常天数</span>
                      <span className="font-medium">{auditCase.punchData.abnormalDays} 天</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Receipt className="h-3 w-3" />
                  报销发票对比
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">提交发票</span>
                    <span>{auditCase.invoiceData.submittedCount} 张</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">发票总额</span>
                    <span>{'¥'}{auditCase.invoiceData.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">匹配金额</span>
                    <span className="text-green-600">{'¥'}{auditCase.invoiceData.matchedAmount}</span>
                  </div>
                  {auditCase.invoiceData.unmatchedAmount > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span>未匹配</span>
                      <span className="font-medium">{'¥'}{auditCase.invoiceData.unmatchedAmount}</span>
                    </div>
                  )}
                  {auditCase.invoiceData.overStandardAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>超标金额</span>
                      <span className="font-medium">{'¥'}{auditCase.invoiceData.overStandardAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {auditCase.anomalies.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  异常项列表（{auditCase.anomalies.length} 项）
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">级别</TableHead>
                      <TableHead>异常描述</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditCase.anomalies.map((anomaly, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {anomaly.type === 'error' ? (
                            <Badge variant="destructive" className="text-xs">严重</Badge>
                          ) : (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">警告</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{anomaly.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FinanceAuditDashboard() {
  const passCount = MOCK_AUDIT_CASES.filter(c => c.aiConclusion === 'pass').length;
  const partialCount = MOCK_AUDIT_CASES.filter(c => c.aiConclusion === 'partial_deduct').length;
  const rejectCount = MOCK_AUDIT_CASES.filter(c => c.aiConclusion === 'reject').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle>AI 财务审核看板</CardTitle>
            </div>
            <CardDescription>三方比对：出差申请 vs 打卡记录 vs 报销发票</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">待审核</p>
              <p className="text-3xl font-bold">{MOCK_AUDIT_CASES.length}</p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-xs text-green-700 mb-1">推荐通过</p>
              <p className="text-3xl font-bold text-green-700">{passCount}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="text-xs text-amber-700 mb-1">部分扣减</p>
              <p className="text-3xl font-bold text-amber-700">{partialCount}</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-xs text-red-700 mb-1">建议拒绝</p>
              <p className="text-3xl font-bold text-red-700">{rejectCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {MOCK_AUDIT_CASES.map((auditCase) => (
          <AuditCaseCard key={auditCase.id} auditCase={auditCase} />
        ))}
      </div>
    </div>
  );
}
