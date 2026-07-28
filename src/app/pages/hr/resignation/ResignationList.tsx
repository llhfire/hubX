import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { UserMinus, CheckCircle, XCircle } from "lucide-react";
import type { ResignationRecord } from "@/app/pages/hr/types";

const mockData: ResignationRecord[] = [
  {
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
    ],
    customerHandovers: [
      { customerName: "深圳创新科技有限公司", handoverTo: "emp-003", handoverToName: "王磊", status: "待交接" },
    ],
    assetReturns: [
      { assetName: "MacBook Pro 16寸", assetNo: "C02X12345678", returned: true, returnedAt: "2026-07-25" },
      { assetName: "门禁卡", assetNo: "A-004521", returned: false, returnedAt: null },
    ],
    salarySettlement: "待结算",
    hookStatus: {
      wecomDisabled: false,
      oaDisabled: true,
      systemDisabled: false,
      hookLog: [
        { action: "OA账号已停用", timestamp: "2026-07-15 10:02", result: "成功" },
        { action: "企微账号注销", timestamp: "2026-07-15 10:05", result: "等待确认" },
      ],
    },
  },
  {
    id: "res-002",
    employeeId: "emp-011",
    employeeName: "杨静",
    departmentName: "市场部",
    position: "市场经理",
    resignationDate: "2026-06-20",
    lastWorkDate: "2026-07-20",
    reason: "家庭原因，需回老家发展",
    status: "已完成",
    projectHandovers: [
      { projectName: "品牌推广方案", handoverTo: "emp-006", handoverToName: "孙悦", status: "已交接" },
    ],
    customerHandovers: [
      { customerName: "杭州数联网络", handoverTo: "emp-003", handoverToName: "王磊", status: "已交接" },
    ],
    assetReturns: [
      { assetName: "MacBook Air M3", assetNo: "C02Y98765432", returned: true, returnedAt: "2026-07-18" },
      { assetName: "门禁卡", assetNo: "A-003892", returned: true, returnedAt: "2026-07-18" },
    ],
    salarySettlement: "已结算 ¥18,500",
    hookStatus: {
      wecomDisabled: true,
      oaDisabled: true,
      systemDisabled: true,
      hookLog: [
        { action: "企微账号已注销", timestamp: "2026-07-20 09:00", result: "成功" },
        { action: "OA账号已停用", timestamp: "2026-07-20 09:01", result: "成功" },
        { action: "全部系统权限已回收", timestamp: "2026-07-20 09:05", result: "成功" },
      ],
    },
  },
];

const statusColor: Record<string, string> = {
  待审批: "bg-blue-100 text-blue-700",
  交接中: "bg-amber-100 text-amber-700",
  待老板审批: "bg-purple-100 text-purple-700",
  已完成: "bg-green-100 text-green-700",
  已驳回: "bg-red-100 text-red-700",
};

const HookIcon = ({ done }: { done: boolean }) =>
  done ? <CheckCircle className="h-4 w-4 text-green-500 inline-block" /> : <XCircle className="h-4 w-4 text-red-500 inline-block" />;

export function ResignationList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UserMinus className="h-5 w-5 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800">离职管理</h1>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>岗位</TableHead>
                <TableHead>离职日期</TableHead>
                <TableHead>最后工作日</TableHead>
                <TableHead>离职原因</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-center">企微</TableHead>
                <TableHead className="text-center">OA</TableHead>
                <TableHead className="text-center">系统</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/hr/resignation/${row.id}`)}
                >
                  <TableCell className="font-medium">{row.employeeName}</TableCell>
                  <TableCell>{row.departmentName}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell>{row.resignationDate}</TableCell>
                  <TableCell>{row.lastWorkDate}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{row.reason}</TableCell>
                  <TableCell>
                    <Badge className={statusColor[row.status] || ""} variant="secondary">
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <HookIcon done={row.hookStatus.wecomDisabled} />
                  </TableCell>
                  <TableCell className="text-center">
                    <HookIcon done={row.hookStatus.oaDisabled} />
                  </TableCell>
                  <TableCell className="text-center">
                    <HookIcon done={row.hookStatus.systemDisabled} />
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
