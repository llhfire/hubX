import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import {
  UserMinus,
  FolderOpen,
  Users,
  Monitor,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Bot,
} from "lucide-react";
import type { ResignationRecord } from "@/app/pages/hr/types";

const mockData: ResignationRecord = {
  id: "res-001",
  employeeId: "emp-010",
  employeeName: "刘洋",
  departmentName: "技术部",
  position: "高级前端工程师",
  resignationDate: "2026-07-15",
  lastWorkDate: "2026-08-14",
  reason: "个人职业发展规划，计划转向全栈方向",
  status: "交接中",
  projectHandovers: [
    { projectName: "HubX 前端重构", handoverTo: "emp-001", handoverToName: "张明", status: "已交接" },
    { projectName: "用户中心 V2.0", handoverTo: "emp-004", handoverToName: "赵雪", status: "待交接" },
    { projectName: "组件库维护", handoverTo: "emp-005", handoverToName: "陈浩", status: "待交接" },
  ],
  customerHandovers: [
    { customerName: "深圳创新科技有限公司", handoverTo: "emp-003", handoverToName: "王磊", status: "已交接" },
    { customerName: "杭州数联网络", handoverTo: "emp-006", handoverToName: "孙悦", status: "待交接" },
  ],
  assetReturns: [
    { assetName: "MacBook Pro 16寸", assetNo: "C02X12345678", returned: true, returnedAt: "2026-07-25" },
    { assetName: "显示器 Dell U2723QE", assetNo: "CN-0DELL-2723", returned: true, returnedAt: "2026-07-25" },
    { assetName: "门禁卡", assetNo: "A-004521", returned: false, returnedAt: null },
    { assetName: "工位钥匙", assetNo: "K-3F-018", returned: false, returnedAt: null },
  ],
  salarySettlement: "待结算",
  hookStatus: {
    wecomDisabled: false,
    oaDisabled: true,
    systemDisabled: false,
    hookLog: [
      { action: "触发离职Hook", timestamp: "2026-07-15 10:00", result: "成功" },
      { action: "发送离职通知至部门负责人", timestamp: "2026-07-15 10:01", result: "成功" },
      { action: "OA账号已停用", timestamp: "2026-07-15 10:02", result: "成功" },
      { action: "企微账号注销", timestamp: "2026-07-15 10:05", result: "等待确认" },
      { action: "系统权限扫描", timestamp: "2026-07-15 10:08", result: "处理中" },
      { action: "已回收 GitLab 权限", timestamp: "2026-07-15 10:10", result: "成功" },
    ],
  },
};

const salaryItems = [
  { item: "当月工资（按实际出勤）", amount: 18333.33, note: "15个工作日/22天" },
  { item: "未休年假折算", amount: 3409.09, note: "剩余3天年假" },
  { item: "绩效奖金（按比例）", amount: 2500, note: "A级，系数1.2" },
  { item: "社保公积金（个人部分）", amount: -3200, note: "" },
  { item: "个人所得税", amount: -1420, note: "" },
];

const totalSettlement = salaryItems.reduce((s, i) => s + i.amount, 0);

const statusIcon = (done: boolean) =>
  done ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />;

export function ResignationDetail() {
  const returnedCount = mockData.assetReturns.filter((a) => a.returned).length;
  const totalCount = mockData.assetReturns.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UserMinus className="h-5 w-5 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800">离职交接详情</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500">员工</p>
              <p className="text-base font-medium">{mockData.employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">部门 / 岗位</p>
              <p className="text-base font-medium">{mockData.departmentName} · {mockData.position}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">申请离职日期</p>
              <p className="text-base font-medium">{mockData.resignationDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">最后工作日</p>
              <p className="text-base font-medium">{mockData.lastWorkDate}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Badge className="bg-amber-100 text-amber-700" variant="secondary">
              {mockData.status}
            </Badge>
            <span className="text-sm text-slate-500">离职原因：{mockData.reason}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="project">
        <TabsList>
          <TabsTrigger value="project" className="gap-1">
            <FolderOpen className="h-4 w-4" />
            项目交接
          </TabsTrigger>
          <TabsTrigger value="customer" className="gap-1">
            <Users className="h-4 w-4" />
            客户移交
          </TabsTrigger>
          <TabsTrigger value="asset" className="gap-1">
            <Monitor className="h-4 w-4" />
            资产归还
          </TabsTrigger>
          <TabsTrigger value="salary" className="gap-1">
            <DollarSign className="h-4 w-4" />
            薪资结算
          </TabsTrigger>
          <TabsTrigger value="hook" className="gap-1">
            <Shield className="h-4 w-4" />
            权限Hook
          </TabsTrigger>
        </TabsList>

        <TabsContent value="project">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>项目名称</TableHead>
                    <TableHead>交接人</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.projectHandovers.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{p.projectName}</TableCell>
                      <TableCell>{p.handoverToName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {statusIcon(p.status === "已交接")}
                          <span>{p.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>客户名称</TableHead>
                    <TableHead>移交人</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.customerHandovers.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{c.customerName}</TableCell>
                      <TableCell>{c.handoverToName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {statusIcon(c.status === "已交接")}
                          <span>{c.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asset">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>资产名称</TableHead>
                    <TableHead>资产编号</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>归还日期</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.assetReturns.map((a, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{a.assetName}</TableCell>
                      <TableCell className="font-mono text-xs">{a.assetNo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {a.returned ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{a.returned ? "已归还" : "待归还"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{a.returnedAt || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-3 text-sm text-slate-500">归还进度：{returnedCount}/{totalCount}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>结算项目</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>备注</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryItems.map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{s.item}</TableCell>
                      <TableCell className={`text-right font-mono ${s.amount < 0 ? "text-red-600" : ""}`}>
                        {s.amount < 0 ? "-" : ""}¥{Math.abs(s.amount).toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{s.note}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-green-50 border-t-2 border-green-200">
                    <TableCell className="font-bold">合计实发</TableCell>
                    <TableCell className="text-right font-mono text-green-700 font-bold text-base">
                      ¥{totalSettlement.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hook">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {[
                  { name: "企业微信", icon: "💬", done: mockData.hookStatus.wecomDisabled },
                  { name: "OA系统", icon: "🏢", done: mockData.hookStatus.oaDisabled },
                  { name: "内部系统", icon: "🖥️", done: mockData.hookStatus.systemDisabled },
                ].map((hook) => (
                  <div key={hook.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{hook.icon}</span>
                        <span className="font-medium">{hook.name}</span>
                      </div>
                      <Badge
                        className={hook.done ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}
                        variant="secondary"
                      >
                        {hook.done ? "已完成" : "处理中"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border rounded-lg p-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Hook 日志</p>
                <div className="space-y-1.5">
                  {mockData.hookStatus.hookLog.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-400 font-mono text-xs w-36 shrink-0">{entry.timestamp}</span>
                      <span className="text-slate-600 flex-1">{entry.action}</span>
                      <Badge
                        className={
                          entry.result === "成功"
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }
                        variant="outline"
                      >
                        {entry.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert className="border-green-200 bg-green-50">
        <Bot className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">AI 交接完整性审查</AlertTitle>
        <AlertDescription className="text-green-700">
          <div className="flex items-start gap-2 mt-1">
            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">交接完整性审查通过</p>
              <p className="text-sm mt-1">
                项目交接文档齐全，客户移交清单已确认，资产归还 {returnedCount}/{totalCount} 项已完成。
              </p>
              <p className="text-sm mt-1 text-amber-700">
                <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                建议：门禁卡和工位钥匙归还后再完成最终交接确认。
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
