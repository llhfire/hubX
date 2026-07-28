import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Plus, ClipboardList } from 'lucide-react'

type DispatchStatus = '待接单' | '进行中' | '待验收' | '已验收' | '超时自动结单'

interface DispatchItem {
  id: string
  title: string
  type: '行政' | '项目'
  bizLine: string
  assignee: string
  deadline: string
  hours: number
  status: DispatchStatus
  assigner: string
}

const statusColor: Record<DispatchStatus, string> = {
  '待接单': 'bg-blue-50 text-blue-600 border-blue-200',
  '进行中': 'bg-amber-50 text-amber-600 border-amber-200',
  '待验收': 'bg-purple-50 text-purple-600 border-purple-200',
  '已验收': 'bg-green-50 text-green-600 border-green-200',
  '超时自动结单': 'bg-red-50 text-red-600 border-red-200',
}

const typeColor: Record<string, string> = {
  '行政': 'bg-slate-100 text-slate-600',
  '项目': 'bg-indigo-50 text-indigo-600',
}

const MOCK_DATA: DispatchItem[] = [
  { id: 'dsp-001', title: 'CRM系统需求评审', type: '项目', bizLine: '软件定制开发', assignee: '陈志远', deadline: '2026-07-18', hours: 4, status: '已验收', assigner: '赵雅琴' },
  { id: 'dsp-002', title: '办公室网络设备更换', type: '行政', bizLine: '软件定制开发', assignee: '孙小明', deadline: '2026-07-20', hours: 0, status: '进行中', assigner: '吴静怡' },
  { id: 'dsp-003', title: '移民业务推广视频制作', type: '项目', bizLine: 'IP打造', assignee: '林美玲', deadline: '2026-07-25', hours: 0, status: '待接单', assigner: '周海涛' },
  { id: 'dsp-004', title: '电商后台数据看板开发', type: '项目', bizLine: '电商业务', assignee: '刘思琪', deadline: '2026-07-28', hours: 0, status: '进行中', assigner: '赵雅琴' },
  { id: 'dsp-005', title: '月度团建活动策划', type: '行政', bizLine: '软件定制开发', assignee: '吴静怡', deadline: '2026-07-22', hours: 6, status: '待验收', assigner: '张明华' },
  { id: 'dsp-006', title: '客户合同模板更新', type: '行政', bizLine: '移民业务', assignee: '赵雅琴', deadline: '2026-07-15', hours: 3, status: '超时自动结单', assigner: '吴静怡' },
]

export function DispatchList() {
  const [items] = useState<DispatchItem[]>(MOCK_DATA)

  const statusCounts = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})
  }, [items])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">任务派单</h1>
          <div className="flex gap-1.5">
            {(Object.keys(statusColor) as DispatchStatus[]).map((s) => (
              statusCounts[s] ? (
                <Badge key={s} variant="outline" className={`text-xs ${statusColor[s]}`}>{s} {statusCounts[s]}</Badge>
              ) : null
            ))}
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />新建派单
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务标题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>业务线</TableHead>
                <TableHead>责任人</TableHead>
                <TableHead>截止时间</TableHead>
                <TableHead className="text-center">工时(h)</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>派单人</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-slate-400" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${typeColor[item.type]}`}>{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{item.bizLine}</TableCell>
                  <TableCell className="text-sm">{item.assignee}</TableCell>
                  <TableCell className="text-sm text-slate-500">{item.deadline}</TableCell>
                  <TableCell className="text-center text-sm">
                    {item.hours > 0 ? item.hours : <span className="text-slate-300">-</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColor[item.status]}`}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{item.assigner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
