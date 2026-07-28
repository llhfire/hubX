import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import {
  ClipboardList,
  Clock,
  User,
  Calendar,
  Send,
  CheckCircle,
  Bot,
  Timer,
  Layers,
} from "lucide-react";
import type { Dispatch } from "@/app/pages/hr/types";

const mockDispatch: Dispatch = {
  id: "dsp-001",
  title: "完成供应商管理系统需求文档",
  type: "项目",
  bizLineName: "供应链业务",
  projectName: "供应商管理系统",
  description: "梳理供应商管理模块功能需求，输出 PRD 文档，包含供应商入驻、审核、评级等核心流程。",
  deadline: "2026-07-28",
  assignerId: "emp-020",
  assignerName: "王建国",
  assigneeId: "emp-001",
  assigneeName: "张明",
  actualHours: 0,
  feedback: "",
  status: "进行中",
  createdAt: "2026-07-20 09:00",
  completedAt: null,
  autoCompleted: false,
};

const timeline = [
  { date: "2026-07-20 09:00", action: "任务创建", actor: "王建国", status: "completed" },
  { date: "2026-07-20 09:05", action: "已指派给 张明", actor: "系统", status: "completed" },
  { date: "2026-07-21 14:00", action: "张明 确认接收任务", actor: "张明", status: "completed" },
  { date: "2026-07-25 10:30", action: "提交阶段性进展", actor: "张明", status: "completed" },
  { date: "2026-07-28", action: "截止日期", actor: "", status: "current" },
];

const aiSubTasks = [
  { task: "供应商入驻流程梳理", estimatedHours: 4, status: "已完成" },
  { task: "供应商审核机制设计", estimatedHours: 3, status: "已完成" },
  { task: "供应商评级体系设计", estimatedHours: 4, status: "进行中" },
  { task: "数据字典与接口定义", estimatedHours: 3, status: "待开始" },
  { task: "文档整合与评审准备", estimatedHours: 2, status: "待开始" },
];

const statusColor: Record<string, string> = {
  待接单: "bg-slate-100 text-slate-700",
  进行中: "bg-blue-100 text-blue-700",
  待验收: "bg-amber-100 text-amber-700",
  已验收: "bg-green-100 text-green-700",
  超时自动结单: "bg-red-100 text-red-700",
};

const subTaskColor: Record<string, string> = {
  已完成: "bg-green-100 text-green-700",
  进行中: "bg-blue-100 text-blue-700",
  待开始: "bg-slate-100 text-slate-600",
};

export function DispatchDetail() {
  const [actualHours, setActualHours] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<Dispatch["status"]>(mockDispatch.status);

  const handleSubmit = () => {
    if (!actualHours) {
      toast.error("请填写实际工时");
      return;
    }
    setStatus("待验收");
    toast.success("任务已提交验收", {
      description: `实际工时：${actualHours}h，已通知 ${mockDispatch.assignerName} 进行验收`,
      style: { borderLeft: "4px solid #22c55e" },
      position: "top-right",
    });
  };

  const completedCount = aiSubTasks.filter((t) => t.status === "已完成").length;
  const totalEstHours = aiSubTasks.reduce((s, t) => s + t.estimatedHours, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">调度任务详情</h1>
        </div>
        <Badge className={statusColor[status] || ""} variant="secondary">
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{mockDispatch.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">任务类型</p>
                    <p className="text-sm font-medium">{mockDispatch.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">执行人</p>
                    <p className="text-sm font-medium">{mockDispatch.assigneeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">截止日期</p>
                    <p className="text-sm font-medium">{mockDispatch.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">预估工时</p>
                    <p className="text-sm font-medium">{totalEstHours}h</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">业务线：</span>
                  <span className="text-slate-700">{mockDispatch.bizLineName}</span>
                </div>
                <div>
                  <span className="text-slate-500">关联项目：</span>
                  <span className="text-slate-700">{mockDispatch.projectName}</span>
                </div>
                <div>
                  <span className="text-slate-500">派单人：</span>
                  <span className="text-slate-700">{mockDispatch.assignerName}</span>
                </div>
                <div>
                  <span className="text-slate-500">创建时间：</span>
                  <span className="text-slate-700">{mockDispatch.createdAt}</span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-500 mb-1">任务描述</p>
                <p className="text-sm text-slate-700">{mockDispatch.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="h-4 w-4 text-slate-500" />
                工时反馈
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 w-24">实际工时</label>
                <Input
                  type="number"
                  placeholder="输入实际工时"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  className="w-32"
                  disabled={status === "待验收" || status === "已验收"}
                />
                <span className="text-sm text-slate-500">小时</span>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">完成反馈</label>
                <Textarea
                  placeholder="描述任务完成情况、遇到的问题等..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  disabled={status === "待验收" || status === "已验收"}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={status !== "进行中"}>
                  <Send className="mr-2 h-4 w-4" />
                  提交完成
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                任务时间线
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                          item.status === "completed"
                            ? "bg-green-500"
                            : item.status === "current"
                              ? "bg-blue-500 ring-4 ring-blue-100"
                              : "bg-slate-300"
                        }`}
                      />
                      {idx < timeline.length - 1 && <div className="w-px h-8 bg-slate-200" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-slate-700">{item.action}</p>
                      <p className="text-xs text-slate-400">
                        {item.date}
                        {item.actor && ` · ${item.actor}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-500" />
                AI 任务拆解
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {aiSubTasks.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {sub.status === "已完成" ? (
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          sub.status === "已完成" ? "text-slate-400 line-through" : "text-slate-700"
                        }`}
                      >
                        {sub.task}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{sub.estimatedHours}h</span>
                      <Badge className={subTaskColor[sub.status]} variant="secondary">
                        {sub.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  完成进度：{completedCount}/{aiSubTasks.length}
                </span>
                <span className="text-slate-500">预估总工时：{totalEstHours}h</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
