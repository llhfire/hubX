import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { Calculator, Settings, ArrowRight, Info } from "lucide-react";

const rules = [
  {
    title: "试岗期规则",
    icon: "🧪",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    items: [
      { label: "未通过", desc: "按 100 元/天 结算试岗期薪资" },
      { label: "通过", desc: "追溯试用期薪资，差额补发至当月工资" },
    ],
  },
  {
    title: "普通员工薪资",
    icon: "💰",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    items: [
      { label: "计算公式", desc: "基本工资 ÷ 当月实际工作日 × 出勤天数" },
      { label: "缺勤扣款", desc: "基本工资 ÷ 当月实际工作日 × 缺勤天数" },
    ],
  },
  {
    title: "绩效实发",
    icon: "📊",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    items: [
      { label: "计算公式", desc: "绩效基数 × 绩效系数（S=1.5, A=1.2, B=1.0, C=0.8, D=0.5）" },
      { label: "发放条件", desc: "当月出勤率 ≥ 80% 方可全额发放" },
    ],
  },
];

const exampleSteps = [
  { label: "基本工资", value: "25,000", note: "员工：张明" },
  { label: "当月工作日", value: "22 天", note: "2026年7月" },
  { label: "出勤天数", value: "21 天", note: "请假1天" },
  { label: "应发基本工资", value: "23,863.64", note: "25000 ÷ 22 × 21" },
  { label: "绩效基数", value: "5,000", note: "岗位绩效基数" },
  { label: "绩效等级", value: "A（系数1.2）", note: "本季度评级" },
  { label: "绩效实发", value: "6,000", note: "5000 × 1.2" },
  { label: "社保个人部分", value: "-3,200", note: "五险一金" },
  { label: "个人所得税", value: "-1,850", note: "累计预扣法" },
  { label: "实发工资", value: "24,813.64", note: "最终到手", highlight: true },
];

export function PayrollEngine() {
  const [workDays, setWorkDays] = useState(22);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">薪资计算引擎</h1>
        </div>
        <Badge variant="outline" className="gap-1">
          <Settings className="h-3 w-3" />
          引擎版本 v2.1
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {rules.map((rule) => (
          <Card key={rule.title} className={rule.color}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span>{rule.icon}</span>
                {rule.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rule.items.map((item, idx) => (
                <div key={idx}>
                  <Badge className={rule.badge} variant="secondary">
                    {item.label}
                  </Badge>
                  <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  {idx < rule.items.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-500" />
              全局参数配置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 w-32">当月工作日</label>
              <Input
                type="number"
                value={workDays}
                onChange={(e) => setWorkDays(Number(e.target.value))}
                className="w-24"
                min={1}
                max={31}
              />
              <span className="text-sm text-slate-500">天</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 w-32">出勤率阈值</label>
              <Input type="text" value="80%" readOnly className="w-24 bg-slate-50" />
              <span className="text-sm text-slate-500">低于此值绩效按比例发放</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 w-32">试岗日薪</label>
              <Input type="text" value="¥100/天" readOnly className="w-24 bg-slate-50" />
              <span className="text-sm text-slate-500">未通过试岗时的结算标准</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Info className="h-4 w-4" />
              <span>参数修改后将从下月工资开始生效</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4 text-slate-500" />
              计算示例 — 逐步拆解
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {exampleSteps.map((step, idx) => (
                <div key={idx}>
                  <div
                    className={`flex items-center justify-between py-2.5 px-2 rounded ${
                      step.highlight ? "bg-green-50 border border-green-200 mt-1" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 w-28">{step.label}</span>
                      {idx < exampleSteps.length - 1 && !step.highlight && (
                        <ArrowRight className="h-3 w-3 text-slate-300" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{step.note}</span>
                      <span
                        className={`text-sm font-mono ${
                          step.highlight
                            ? "text-green-700 font-bold text-base"
                            : step.value.startsWith("-")
                              ? "text-red-600"
                              : "text-slate-800"
                        }`}
                      >
                        {step.value.startsWith("-") ? step.value : `¥${step.value}`}
                      </span>
                    </div>
                  </div>
                  {idx < exampleSteps.length - 1 && !step.highlight && (
                    <Separator />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
