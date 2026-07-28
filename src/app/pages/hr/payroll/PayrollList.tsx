import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import { Send, AlertTriangle, Download, Filter, ShieldCheck } from "lucide-react";
import type { PayrollRecord } from "@/app/pages/hr/types";

interface PayrollAnomaly {
  id: string;
  level: "warning" | "critical";
  employee: string;
  message: string;
  explanation: string;
}

const mockAnomalies: PayrollAnomaly[] = [
  {
    id: "ano-001",
    level: "warning",
    employee: "李婷",
    message: "考勤扣款较上月增长 200%",
    explanation: "本月请事假 2 天导致考勤扣款翻倍，已核实请假审批单，扣款计算无误。",
  },
  {
    id: "ano-002",
    level: "critical",
    employee: "王磊",
    message: "绩效奖金异常偏高，实发较上月激增 40%",
    explanation: "试岗期通过，追溯补发了试用期差额 + 绩效系数 1.2，已与部门负责人确认。",
  },
  {
    id: "ano-003",
    level: "warning",
    employee: "吴琳",
    message: "试岗期薪资已计入，转正日期待确认",
    explanation: "系统自动按转正薪资计算，需确认实际转正生效日期是否为本月 1 日。",
  },
];

const mockPayroll: PayrollRecord[] = [
  {
    id: "pay-001", employeeId: "emp-001", employeeName: "张明", departmentName: "技术部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 22,
    baseSalary: 25000, dailySalary: 1136, probationSalary: 0, isProbation: false,
    trialResult: "不适用", performanceBase: 5000, performanceCoefficient: 1.2,
    performancePay: 6000, attendanceDeduction: 0,
    socialInsurance: 3200, tax: 1850, totalDeduction: 5050, netSalary: 25950,
    status: "已审批", confirmStatus: "已确认", confirmedAt: "2026-07-26", confirmedIp: "192.168.1.10",
    aiAnomalyNote: null,
  },
  {
    id: "pay-002", employeeId: "emp-002", employeeName: "李婷", departmentName: "产品部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 20,
    baseSalary: 18000, dailySalary: 818, probationSalary: 0, isProbation: false,
    trialResult: "不适用", performanceBase: 3000, performanceCoefficient: 1.0,
    performancePay: 3000, attendanceDeduction: 1636,
    socialInsurance: 2400, tax: 980, totalDeduction: 3380, netSalary: 15984,
    status: "已审批", confirmStatus: "已确认", confirmedAt: "2026-07-27", confirmedIp: "192.168.1.22",
    aiAnomalyNote: "考勤扣款较上月增长200%",
  },
  {
    id: "pay-003", employeeId: "emp-003", employeeName: "王磊", departmentName: "销售部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 22,
    baseSalary: 15000, dailySalary: 682, probationSalary: 0, isProbation: false,
    trialResult: "不适用", performanceBase: 8000, performanceCoefficient: 1.5,
    performancePay: 12000, attendanceDeduction: 0,
    socialInsurance: 2100, tax: 1420, totalDeduction: 3520, netSalary: 23480,
    status: "待复核", confirmStatus: "待确认", confirmedAt: null, confirmedIp: null,
    aiAnomalyNote: "绩效奖金异常偏高，请核实",
  },
  {
    id: "pay-004", employeeId: "emp-004", employeeName: "赵雪", departmentName: "设计部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 22,
    baseSalary: 20000, dailySalary: 909, probationSalary: 3000, isProbation: true,
    trialResult: "已通过", performanceBase: 4000, performanceCoefficient: 1.0,
    performancePay: 4000, attendanceDeduction: 0,
    socialInsurance: 2800, tax: 1350, totalDeduction: 4150, netSalary: 22850,
    status: "已审批", confirmStatus: "已确认", confirmedAt: "2026-07-25", confirmedIp: "192.168.1.15",
    aiAnomalyNote: null,
  },
  {
    id: "pay-005", employeeId: "emp-005", employeeName: "陈浩", departmentName: "技术部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 19,
    baseSalary: 30000, dailySalary: 1364, probationSalary: 0, isProbation: false,
    trialResult: "不适用", performanceBase: 6000, performanceCoefficient: 1.2,
    performancePay: 7200, attendanceDeduction: 4091,
    socialInsurance: 3800, tax: 2680, totalDeduction: 6480, netSalary: 26629,
    status: "待复核", confirmStatus: "待确认", confirmedAt: null, confirmedIp: null,
    aiAnomalyNote: "请假天数异常，请确认审批单",
  },
  {
    id: "pay-006", employeeId: "emp-006", employeeName: "孙悦", departmentName: "市场部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 21,
    baseSalary: 16000, dailySalary: 727, probationSalary: 0, isProbation: false,
    trialResult: "不适用", performanceBase: 3000, performanceCoefficient: 1.0,
    performancePay: 3000, attendanceDeduction: 727,
    socialInsurance: 2200, tax: 760, totalDeduction: 2960, netSalary: 15313,
    status: "已审批", confirmStatus: "已确认", confirmedAt: "2026-07-26", confirmedIp: "192.168.1.30",
    aiAnomalyNote: null,
  },
  {
    id: "pay-007", employeeId: "emp-007", employeeName: "周强", departmentName: "运维部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 22,
    baseSalary: 22000, dailySalary: 1000, probationSalary: 0, isProbation: false,
    trialResult: "不适用", performanceBase: 4000, performanceCoefficient: 1.0,
    performancePay: 4000, attendanceDeduction: 0,
    socialInsurance: 3000, tax: 1260, totalDeduction: 4260, netSalary: 21740,
    status: "已审批", confirmStatus: "已确认", confirmedAt: "2026-07-25", confirmedIp: "192.168.1.18",
    aiAnomalyNote: null,
  },
  {
    id: "pay-008", employeeId: "emp-008", employeeName: "吴琳", departmentName: "人事部",
    year: 2026, month: 7, workDays: 22, actualWorkDays: 22,
    baseSalary: 17000, dailySalary: 773, probationSalary: 1700, isProbation: true,
    trialResult: "已通过", performanceBase: 3000, performanceCoefficient: 1.0,
    performancePay: 3000, attendanceDeduction: 0,
    socialInsurance: 2300, tax: 820, totalDeduction: 3120, netSalary: 18580,
    status: "待复核", confirmStatus: "待确认", confirmedAt: null, confirmedIp: null,
    aiAnomalyNote: "试岗期薪资已计入，请确认转正日期",
  },
];

const monthOptions = [
  { year: 2026, month: 7, label: "2026-07" },
  { year: 2026, month: 6, label: "2026-06" },
  { year: 2026, month: 5, label: "2026-05" },
  { year: 2026, month: 4, label: "2026-04" },
];

const confirmColor: Record<string, string> = {
  已确认: "bg-green-100 text-green-700",
  待确认: "bg-amber-100 text-amber-700",
  有异议: "bg-red-100 text-red-700",
};

export function PayrollList() {
  const [selectedKey, setSelectedKey] = useState("2026-07");

  const selected = monthOptions.find((m) => m.label === selectedKey)!;

  const filteredData = useMemo(
    () => mockPayroll.filter((r) => r.year === selected.year && r.month === selected.month),
    [selected],
  );

  const handleSendPaySlips = () => {
    toast.success("工资条已发送", {
      description: `已通过企业微信向 ${filteredData.length} 名员工推送 ${selectedKey} 工资条`,
      style: { borderLeft: "4px solid #22c55e" },
      position: "top-right",
      duration: 5000,
    });
  };

  const fmt = (v: number) => `¥${v.toLocaleString("zh-CN")}`;

  const netColor = (r: PayrollRecord) => {
    if (r.attendanceDeduction >= 2000) return "text-red-600 font-semibold";
    if (r.netSalary >= 20000) return "text-green-600 font-semibold";
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">月度工资表</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            导出Excel
          </Button>
          <Button size="sm" className="gap-2" onClick={handleSendPaySlips}>
            <Send className="h-4 w-4" />
            发送工资条
          </Button>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            <span className="text-amber-800">AI 算薪异动审计</span>
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
              {mockAnomalies.length} 项待复核
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {mockAnomalies.map((ano) => (
            <div
              key={ano.id}
              className={`rounded-lg p-3 border ${
                ano.level === "critical"
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    ano.level === "critical" ? "text-red-500" : "text-amber-500"
                  }`}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {ano.employee}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        ano.level === "critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {ano.level === "critical" ? "高风险" : "提醒"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700">
                    ⚠️ {ano.message}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ano.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择月份" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((m) => (
                  <SelectItem key={m.label} value={m.label}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-500">共 {filteredData.length} 条记录</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>月度</TableHead>
                <TableHead className="text-right">基本工资</TableHead>
                <TableHead className="text-right">试岗薪资</TableHead>
                <TableHead className="text-right">考勤扣款</TableHead>
                <TableHead className="text-right">绩效实发</TableHead>
                <TableHead className="text-right">社保个税</TableHead>
                <TableHead className="text-right">实发工资</TableHead>
                <TableHead>确认状态</TableHead>
                <TableHead>AI 异常</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell>{r.departmentName}</TableCell>
                  <TableCell>{`${r.year}-${String(r.month).padStart(2, "0")}`}</TableCell>
                  <TableCell className="text-right">{fmt(r.baseSalary)}</TableCell>
                  <TableCell className="text-right">
                    {r.probationSalary > 0 ? fmt(r.probationSalary) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.attendanceDeduction > 0 ? (
                      <span className="text-red-600">-{fmt(r.attendanceDeduction)}</span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">{fmt(r.performancePay)}</TableCell>
                  <TableCell className="text-right">-{fmt(r.socialInsurance + r.tax)}</TableCell>
                  <TableCell className={`text-right ${netColor(r)}`}>{fmt(r.netSalary)}</TableCell>
                  <TableCell>
                    <Badge className={confirmColor[r.confirmStatus] || ""} variant="secondary">
                      {r.confirmStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {r.aiAnomalyNote ? (
                      <Badge variant="destructive" className="gap-1 cursor-help" title={r.aiAnomalyNote}>
                        <AlertTriangle className="h-3 w-3" />
                        ⚠️
                      </Badge>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
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
