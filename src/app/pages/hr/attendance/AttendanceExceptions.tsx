import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { AlertCircle, Check, X } from 'lucide-react'

interface ExceptionItem {
  id: string
  name: string
  type: '补卡' | '请假' | '出差'
  startDate: string
  endDate: string
  reason: string
  status: '待审批' | '已通过' | '已拒绝'
  approver: string
}

const statusColor: Record<string, string> = {
  '待审批': 'bg-amber-50 text-amber-600 border-amber-200',
  '已通过': 'bg-green-50 text-green-600 border-green-200',
  '已拒绝': 'bg-red-50 text-red-600 border-red-200',
}

const typeColor: Record<string, string> = {
  '补卡': 'bg-blue-50 text-blue-600',
  '请假': 'bg-purple-50 text-purple-600',
  '出差': 'bg-teal-50 text-teal-600',
}

export function AttendanceExceptions() {
  const [items, setItems] = useState<ExceptionItem[]>([
    { id: 'exc-001', name: '陈志远', type: '补卡', startDate: '2026-07-02', endDate: '2026-07-02', reason: '地铁1号线信号故障导致延误，已在企业微信报备', status: '已通过', approver: '王建国' },
    { id: 'exc-002', name: '刘思琪', type: '请假', startDate: '2026-07-09', endDate: '2026-07-09', reason: '急性肠胃炎，需就医休息一天', status: '已通过', approver: '王建国' },
    { id: 'exc-003', name: '周海涛', type: '出差', startDate: '2026-07-14', endDate: '2026-07-16', reason: '拜访广州意向移民客户，洽谈EB-5投资移民方案', status: '已通过', approver: '张明华' },
    { id: 'exc-004', name: '黄伟杰', type: '补卡', startDate: '2026-07-16', endDate: '2026-07-16', reason: '忘记打卡，实际已在工位工作', status: '待审批', approver: '陈志远' },
    { id: 'exc-005', name: '孙小明', type: '请假', startDate: '2026-07-21', endDate: '2026-07-22', reason: '家中老人住院，需陪同就医', status: '待审批', approver: '赵雅琴' },
  ])

  const handleApprove = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: '已通过' } : item))
  }

  const handleReject = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: '已拒绝' } : item))
  }

  const pendingCount = useMemo(() => items.filter((i) => i.status === '待审批').length, [items])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">考勤异常处理</h1>
          {pendingCount > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 gap-1">
              <AlertCircle className="h-3 w-3" />{pendingCount} 条待审批
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工</TableHead>
                <TableHead>异常类型</TableHead>
                <TableHead>起止时间</TableHead>
                <TableHead>事由</TableHead>
                <TableHead>审批状态</TableHead>
                <TableHead>审批人</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${typeColor[item.type]}`}>{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {item.startDate === item.endDate ? item.startDate : `${item.startDate} ~ ${item.endDate}`}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500 max-w-[200px] truncate">{item.reason}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColor[item.status]}`}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{item.approver}</TableCell>
                  <TableCell>
                    {item.status === '待审批' && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(item.id)}>
                          <Check className="h-3.5 w-3.5 mr-1" />通过
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(item.id)}>
                          <X className="h-3.5 w-3.5 mr-1" />拒绝
                        </Button>
                      </div>
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
