import { Badge } from "@/app/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  "在职": "bg-green-100 text-green-700 border-green-200",
  "已通过": "bg-green-100 text-green-700 border-green-200",
  "已验收": "bg-green-100 text-green-700 border-green-200",
  "已确认": "bg-green-100 text-green-700 border-green-200",
  "已完成": "bg-green-100 text-green-700 border-green-200",
  "通过": "bg-green-100 text-green-700 border-green-200",

  "试岗中": "bg-amber-100 text-amber-700 border-amber-200",
  "进行中": "bg-blue-100 text-blue-700 border-blue-200",
  "待审批": "bg-amber-100 text-amber-700 border-amber-200",
  "待验收": "bg-amber-100 text-amber-700 border-amber-200",
  "待确认": "bg-blue-100 text-blue-700 border-blue-200",

  "已离职": "bg-red-100 text-red-700 border-red-200",
  "已拒绝": "bg-red-100 text-red-700 border-red-200",
  "已驳回": "bg-red-100 text-red-700 border-red-200",
  "未通过": "bg-red-100 text-red-700 border-red-200",
  "超时": "bg-slate-100 text-slate-700 border-slate-200",

  "待接单": "bg-slate-100 text-slate-700 border-slate-200",
  "计算中": "bg-slate-100 text-slate-700 border-slate-200",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <Badge variant="outline" className={style}>
      {status}
    </Badge>
  );
}
