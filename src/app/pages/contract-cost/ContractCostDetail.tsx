import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  buildRDCostDetails,
  buildOpCostDetails,
  hasActualData,
  contractCostPermissions,
  contractNames,
  contractProjectMap,
  mockBusinessCosts,
  mockOutsourceCosts,
  mockOtherCosts,
  mockSalaryData,
  getHourlyOpCost,
  mockMonthlyOpExpenses,
  ACTIVE_EMPLOYEE_COUNT,
  STANDARD_MONTHLY_HOURS,
  type RDCostDetail,
  type BusinessCostRecord,
  type OutsourceCostRecord,
  type OtherCostRecord,
  type OpCostDetail,
} from './contractCostData';

const CURRENT_MONTH = '2026-05';

function fmt(value: number): string {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ContractCostDetail() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rd');

  const cid = contractId ?? '';
  const contractName = contractNames[cid] ?? `合同${cid}`;
  const projectIds = contractProjectMap[cid] ?? [];
  const hasProjects = projectIds.length > 0;

  const useActual = hasActualData(CURRENT_MONTH, mockSalaryData);
  const canViewDetail = contractCostPermissions.contractCostDetail;

  // ─── 数据构建 ──────────────────────────────────────────────
  const rdDetails = hasProjects
    ? buildRDCostDetails(cid, CURRENT_MONTH, mockSalaryData, useActual)
    : [];
  const bizDetails = mockBusinessCosts.filter((r) => r.contractId === cid && r.month === CURRENT_MONTH);
  const outsourceDetails = mockOutsourceCosts.filter((r) => r.contractId === cid && r.month === CURRENT_MONTH);
  const otherDetails = mockOtherCosts.filter((r) => r.contractId === cid && r.month === CURRENT_MONTH);
  const opDetails = hasProjects ? buildOpCostDetails(cid, CURRENT_MONTH) : [];

  const rdTotal = rdDetails.reduce((s, r) => s + r.cost, 0);
  const bizTotal = bizDetails.reduce((s, r) => s + r.amount, 0);
  const outsourceTotal = outsourceDetails.reduce((s, r) => s + r.amount, 0);
  const otherTotal = otherDetails.reduce((s, r) => s + r.amount, 0);
  const opTotal = opDetails.reduce((s, r) => s + r.cost, 0);

  // ─── 运营费用计算参数 ─────────────────────────────────────
  const monthlyOpExpense = mockMonthlyOpExpenses[CURRENT_MONTH] ?? 0;
  const hourlyOpCost = getHourlyOpCost(CURRENT_MONTH);

  // ─── 概览卡片数据 ────────────────────────────────────────
  const summaryCards = [
    { label: '科研成本', value: rdTotal, color: 'text-blue-500' },
    { label: '商务成本', value: bizTotal, color: 'text-teal-500' },
    { label: '外包成本', value: outsourceTotal, color: 'text-orange-500' },
    { label: '其他成本', value: otherTotal, color: 'text-purple-500' },
    { label: '分摊运营成本', value: opTotal, color: 'text-red-500' },
  ];

  // ─── 合计行渲染 ──────────────────────────────────────────
  function renderRDSummary() {
    if (rdDetails.length === 0) return null;
    const totalHours = rdDetails.reduce((s, r) => s + r.hours, 0);
    return (
      <div className="text-right px-4 py-2 font-semibold">
        合计：工时 {totalHours}h，金额 {canViewDetail ? `¥${fmt(rdTotal)}` : '***'}
      </div>
    );
  }

  function renderAmountSummary(total: number) {
    return (
      <div className="text-right px-4 py-2 font-semibold">
        合计：¥{fmt(total)}
      </div>
    );
  }

  function renderOpSummary() {
    if (opDetails.length === 0) return null;
    const totalHours = opDetails.reduce((s, r) => s + r.hours, 0);
    return (
      <div className="text-right px-4 py-2 font-semibold">
        合计：工时 {totalHours}h，金额 ¥{fmt(opTotal)}
      </div>
    );
  }

  // ─── 无项目关联 ──────────────────────────────────────────
  if (!hasProjects) {
    return (
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>财务统计</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>合同成本明细</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{contractName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold m-0">{contractName} - 成本明细</h2>
        </div>

        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            该合同未关联项目
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* ── 面包屑 ── */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>财务统计</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>合同成本明细</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{contractName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── 标题行 ── */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold m-0">
          {contractName} - 成本明细
        </h2>
        <Badge variant={useActual ? 'default' : 'secondary'}>
          {useActual ? '实际' : '名义'}
        </Badge>
      </div>

      {/* ── 5 张概览卡片 ── */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className="text-center">
            <CardContent className="pt-4">
              <p className="text-muted-foreground text-sm">{card.label}</p>
              <p className={`text-2xl font-semibold mt-2 ${card.color}`}>
                ¥{fmt(card.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tabs ── */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="rd">科研成本</TabsTrigger>
              <TabsTrigger value="biz">商务成本</TabsTrigger>
              <TabsTrigger value="outsource">外包成本</TabsTrigger>
              <TabsTrigger value="other">其他成本</TabsTrigger>
              <TabsTrigger value="op">分摊运营成本</TabsTrigger>
            </TabsList>

            {/* ── 科研成本 ── */}
            <TabsContent value="rd">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">员工</TableHead>
                    <TableHead className="w-[140px]">职位</TableHead>
                    <TableHead className="w-[100px]">工时(h)</TableHead>
                    <TableHead className="w-[120px]">时薪(元/h)</TableHead>
                    <TableHead className="w-[120px]">金额(元)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rdDetails.map((row) => (
                    <TableRow key={row.employeeId}>
                      <TableCell>{row.employeeName}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.hours}</TableCell>
                      <TableCell>{canViewDetail ? fmt(row.hourlyRate) : '***'}</TableCell>
                      <TableCell>{canViewDetail ? fmt(row.cost) : '***'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {renderRDSummary()}
            </TabsContent>

            {/* ── 商务成本 ── */}
            <TabsContent value="biz">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">类别</TableHead>
                    <TableHead>说明</TableHead>
                    <TableHead className="w-[120px]">金额(元)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bizDetails.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{fmt(row.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {bizDetails.length > 0 && renderAmountSummary(bizTotal)}
            </TabsContent>

            {/* ── 外包成本 ── */}
            <TabsContent value="outsource">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">供应商</TableHead>
                    <TableHead>说明</TableHead>
                    <TableHead className="w-[120px]">金额(元)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outsourceDetails.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.vendorName}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{fmt(row.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {outsourceDetails.length > 0 && renderAmountSummary(outsourceTotal)}
            </TabsContent>

            {/* ── 其他成本 ── */}
            <TabsContent value="other">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">类别</TableHead>
                    <TableHead>说明</TableHead>
                    <TableHead className="w-[120px]">金额(元)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherDetails.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{fmt(row.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {otherDetails.length > 0 && renderAmountSummary(otherTotal)}
            </TabsContent>

            {/* ── 分摊运营成本 ── */}
            <TabsContent value="op">
              {/* 计算过程展示 */}
              <Card className="mb-4 bg-muted">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-3">运营成本分摊计算</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {CURRENT_MONTH} 运营总费用
                      </p>
                      <p className="text-lg font-semibold">¥{fmt(monthlyOpExpense)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">在职员工数</p>
                      <p className="text-lg font-semibold">{ACTIVE_EMPLOYEE_COUNT} 人</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">标准月工时</p>
                      <p className="text-lg font-semibold">{STANDARD_MONTHLY_HOURS} h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">每小时运营成本</p>
                      <p className="text-lg font-semibold text-red-500">
                        ¥{fmt(hourlyOpCost)}/h
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs mt-2">
                    计算公式：每小时运营成本 = 运营总费用 ÷ 在职员工数 ÷ 标准月工时
                    = ¥{fmt(monthlyOpExpense)} ÷ {ACTIVE_EMPLOYEE_COUNT} ÷ {STANDARD_MONTHLY_HOURS}
                    = ¥{fmt(hourlyOpCost)}/h
                  </p>
                </CardContent>
              </Card>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">员工</TableHead>
                    <TableHead className="w-[140px]">职位</TableHead>
                    <TableHead className="w-[100px]">工时(h)</TableHead>
                    <TableHead className="w-[160px]">每小时运营成本(元/h)</TableHead>
                    <TableHead className="w-[120px]">金额(元)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opDetails.map((row) => (
                    <TableRow key={row.employeeName}>
                      <TableCell>{row.employeeName}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.hours}</TableCell>
                      <TableCell>{fmt(row.hourlyOpCost)}</TableCell>
                      <TableCell>{fmt(row.cost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {renderOpSummary()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
