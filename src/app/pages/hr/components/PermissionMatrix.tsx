import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { ShieldCheck } from 'lucide-react'

const roles = [
  { name: '普通员工', color: 'bg-slate-100 text-slate-700' },
  { name: '部门主管', color: 'bg-blue-100 text-blue-700' },
  { name: 'HR专员', color: 'bg-purple-100 text-purple-700' },
  { name: '财务人员', color: 'bg-emerald-100 text-emerald-700' },
  { name: '总经理/老板', color: 'bg-amber-100 text-amber-700' },
  { name: '系统管理员', color: 'bg-rose-100 text-rose-700' },
]

const functions = [
  '花名册查看',
  '身份证/银行卡',
  '薪资/工资条',
  '招聘/ATS',
  '定薪审批',
  '电子签章',
  '绩效打分',
  '考勤管理',
  '工作派单',
]

type PermissionLevel = '全部' | '部分' | '仅本人' | '无权'

const permissionBadgeStyle: Record<PermissionLevel, string> = {
  '全部': 'bg-green-50 text-green-700 border-green-200',
  '部分': 'bg-blue-50 text-blue-700 border-blue-200',
  '仅本人': 'bg-amber-50 text-amber-700 border-amber-200',
  '无权': 'bg-red-50 text-red-700 border-red-200',
}

const matrix: Record<string, PermissionLevel[]> = {
  '普通员工': ['仅本人', '仅本人', '仅本人', '无权', '无权', '仅本人', '仅本人', '仅本人', '仅本人'],
  '部门主管': ['部分', '部分', '仅本人', '无权', '无权', '部分', '全部', '全部', '全部'],
  'HR专员': ['全部', '全部', '部分', '全部', '无权', '全部', '无权', '全部', '部分'],
  '财务人员': ['部分', '全部', '全部', '无权', '无权', '部分', '无权', '部分', '无权'],
  '总经理/老板': ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部'],
  '系统管理员': ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部'],
}

export function PermissionMatrix() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-500" />
          <CardTitle className="text-sm">权限矩阵</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          {(Object.keys(permissionBadgeStyle) as PermissionLevel[]).map((level) => (
            <Badge
              key={level}
              variant="outline"
              className={`text-xs ${permissionBadgeStyle[level]}`}
            >
              {level}
            </Badge>
          ))}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px] font-bold">角色</TableHead>
                {functions.map((fn) => (
                  <TableHead key={fn} className="text-center font-bold whitespace-nowrap">
                    {fn}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.name}>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${role.color}`}>
                      {role.name}
                    </Badge>
                  </TableCell>
                  {matrix[role.name].map((level, idx) => (
                    <TableCell key={idx} className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-xs ${permissionBadgeStyle[level]}`}
                      >
                        {level}
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
