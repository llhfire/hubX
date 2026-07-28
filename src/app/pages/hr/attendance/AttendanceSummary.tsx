import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { CalendarCheck } from 'lucide-react'

interface AttendanceRow {
  id: string
  name: string
  department: string
  workDays: number
  actualDays: number
  late: number
  earlyLeave: number
  leaveDays: number
  businessTrip: number
  deduction: number
}

const MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07']
const MONTH_LABELS: Record<string, string> = {
  '2026-01': '2026年1月', '2026-02': '2026年2月', '2026-03': '2026年3月',
  '2026-04': '2026年4月', '2026-05': '2026年5月', '2026-06': '2026年6月', '2026-07': '2026年7月',
}

const MOCK_DATA: Record<string, AttendanceRow[]> = {
  '2026-07': [
    { id: '1', name: '陈志远', department: '前端组', workDays: 23, actualDays: 22, late: 2, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '2', name: '王建国', department: '技术部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '3', name: '刘思琪', department: '后端组', workDays: 23, actualDays: 21, late: 1, earlyLeave: 1, leaveDays: 1, businessTrip: 0, deduction: 100 },
    { id: '4', name: '赵雅琴', department: '产品部', workDays: 23, actualDays: 22, late: 1, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '5', name: '孙小明', department: '设计部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '6', name: '周海涛', department: '销售部', workDays: 23, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 3, deduction: 0 },
    { id: '7', name: '林美玲', department: '运营部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '8', name: '吴静怡', department: '行政财务部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
  ],
  '2026-06': [
    { id: '1', name: '陈志远', department: '前端组', workDays: 22, actualDays: 22, late: 1, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '2', name: '王建国', department: '技术部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '3', name: '刘思琪', department: '后端组', workDays: 22, actualDays: 21, late: 0, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '4', name: '赵雅琴', department: '产品部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '5', name: '孙小明', department: '设计部', workDays: 22, actualDays: 21, late: 2, earlyLeave: 1, leaveDays: 0, businessTrip: 0, deduction: 200 },
    { id: '6', name: '周海涛', department: '销售部', workDays: 22, actualDays: 19, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 3, deduction: 0 },
    { id: '7', name: '林美玲', department: '运营部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '8', name: '吴静怡', department: '行政财务部', workDays: 22, actualDays: 22, late: 1, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
  ],
  '2026-05': [
    { id: '1', name: '陈志远', department: '前端组', workDays: 21, actualDays: 21, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '2', name: '王建国', department: '技术部', workDays: 21, actualDays: 21, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '3', name: '刘思琪', department: '后端组', workDays: 21, actualDays: 20, late: 1, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '4', name: '赵雅琴', department: '产品部', workDays: 21, actualDays: 21, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '5', name: '孙小明', department: '设计部', workDays: 21, actualDays: 21, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '6', name: '周海涛', department: '销售部', workDays: 21, actualDays: 18, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 3, deduction: 0 },
    { id: '7', name: '林美玲', department: '运营部', workDays: 21, actualDays: 21, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '8', name: '吴静怡', department: '行政财务部', workDays: 21, actualDays: 20, late: 0, earlyLeave: 1, leaveDays: 1, businessTrip: 0, deduction: 0 },
  ],
  '2026-04': [
    { id: '1', name: '陈志远', department: '前端组', workDays: 22, actualDays: 22, late: 1, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '2', name: '王建国', department: '技术部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '3', name: '刘思琪', department: '后端组', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '4', name: '赵雅琴', department: '产品部', workDays: 22, actualDays: 21, late: 0, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '5', name: '孙小明', department: '设计部', workDays: 22, actualDays: 22, late: 1, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '6', name: '周海涛', department: '销售部', workDays: 22, actualDays: 19, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 3, deduction: 0 },
    { id: '7', name: '林美玲', department: '运营部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '8', name: '吴静怡', department: '行政财务部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
  ],
  '2026-03': [
    { id: '1', name: '陈志远', department: '前端组', workDays: 23, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '2', name: '王建国', department: '技术部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '3', name: '刘思琪', department: '后端组', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '4', name: '赵雅琴', department: '产品部', workDays: 23, actualDays: 22, late: 1, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '5', name: '孙小明', department: '设计部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '6', name: '周海涛', department: '销售部', workDays: 23, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 3, deduction: 0 },
    { id: '7', name: '林美玲', department: '运营部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '8', name: '吴静怡', department: '行政财务部', workDays: 23, actualDays: 23, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
  ],
  '2026-02': [
    { id: '1', name: '陈志远', department: '前端组', workDays: 20, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '2', name: '王建国', department: '技术部', workDays: 20, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '3', name: '刘思琪', department: '后端组', workDays: 20, actualDays: 19, late: 1, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '4', name: '赵雅琴', department: '产品部', workDays: 20, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '5', name: '孙小明', department: '设计部', workDays: 20, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '6', name: '周海涛', department: '销售部', workDays: 20, actualDays: 17, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 3, deduction: 0 },
    { id: '7', name: '林美玲', department: '运营部', workDays: 20, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '8', name: '吴静怡', department: '行政财务部', workDays: 20, actualDays: 20, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
  ],
  '2026-01': [
    { id: '1', name: '陈志远', department: '前端组', workDays: 22, actualDays: 21, late: 1, earlyLeave: 0, leaveDays: 1, businessTrip: 0, deduction: 0 },
    { id: '2', name: '王建国', department: '技术部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '3', name: '刘思琪', department: '后端组', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '4', name: '赵雅琴', department: '产品部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '5', name: '孙小明', department: '设计部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '6', name: '周海涛', department: '销售部', workDays: 22, actualDays: 19, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 3, deduction: 0 },
    { id: '7', name: '林美玲', department: '运营部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
    { id: '8', name: '吴静怡', department: '行政财务部', workDays: 22, actualDays: 22, late: 0, earlyLeave: 0, leaveDays: 0, businessTrip: 0, deduction: 0 },
  ],
}

export function AttendanceSummary() {
  const [month, setMonth] = useState('2026-07')

  const data = useMemo(() => MOCK_DATA[month] ?? [], [month])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">月度考勤汇总</h1>
          <Badge variant="secondary">{MONTH_LABELS[month]}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-slate-400" />
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40"><SelectValue placeholder="选择月份" /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m}>{MONTH_LABELS[m]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工</TableHead>
                <TableHead>部门</TableHead>
                <TableHead className="text-center">应出勤</TableHead>
                <TableHead className="text-center">实际出勤</TableHead>
                <TableHead className="text-center">迟到</TableHead>
                <TableHead className="text-center">早退</TableHead>
                <TableHead className="text-center">请假</TableHead>
                <TableHead className="text-center">出差</TableHead>
                <TableHead className="text-right">缺勤扣款</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-sm text-slate-500">{row.department}</TableCell>
                  <TableCell className="text-center">{row.workDays}</TableCell>
                  <TableCell className="text-center">{row.actualDays}</TableCell>
                  <TableCell className="text-center">
                    {row.late > 0 ? (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{row.late}</Badge>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.earlyLeave > 0 ? (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{row.earlyLeave}</Badge>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.leaveDays > 0 ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">{row.leaveDays}</Badge>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.businessTrip > 0 ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">{row.businessTrip}</Badge>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.deduction > 0 ? (
                      <span className="text-red-600 font-medium">¥{row.deduction}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
