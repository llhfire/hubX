import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Plus, FileCheck, FileX, CheckCircle, XCircle } from 'lucide-react'
import { ONBOARDING_RECORDS } from '../mockData'
import type { OnboardingStatus } from '../types'

const statusColorMap: Record<OnboardingStatus, string> = {
  '待入职': 'bg-slate-100 text-slate-700 border-slate-200',
  '资料收集中': 'bg-blue-100 text-blue-700 border-blue-200',
  '试岗中': 'bg-amber-100 text-amber-700 border-amber-200',
  '试用期': 'bg-purple-100 text-purple-700 border-purple-200',
  '已转正': 'bg-green-100 text-green-700 border-green-200',
  '已淘汰': 'bg-red-100 text-red-700 border-red-200',
}

export function OnboardingList() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredRecords =
    statusFilter === 'all'
      ? ONBOARDING_RECORDS
      : ONBOARDING_RECORDS.filter((r) => r.status === statusFilter)

  function getDocumentsProgress(record: (typeof ONBOARDING_RECORDS)[0]) {
    const total = record.documents.length
    const submitted = record.documents.filter((d) => d.submitted).length
    return `${submitted}/${total}`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">入职管理</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          发送入职邀请
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="待入职">待入职</SelectItem>
            <SelectItem value="资料收集中">资料收集中</SelectItem>
            <SelectItem value="试岗中">试岗中</SelectItem>
            <SelectItem value="试用期">试用期</SelectItem>
            <SelectItem value="已转正">已转正</SelectItem>
            <SelectItem value="已淘汰">已淘汰</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          共 {filteredRecords.length} 条记录
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工姓名</TableHead>
                <TableHead>岗位</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>入职日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>资料进度</TableHead>
                <TableHead>试岗协议</TableHead>
                <TableHead>劳动合同</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow
                  key={record.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/hr/onboarding/${record.id}`)}
                >
                  <TableCell className="font-medium">
                    {record.employeeName}
                  </TableCell>
                  <TableCell>{record.position}</TableCell>
                  <TableCell>{record.departmentName}</TableCell>
                  <TableCell>{record.joinDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColorMap[record.status]}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {getDocumentsProgress(record)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.trialAgreementSigned ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <FileCheck className="h-4 w-4" /> 已签
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        <FileX className="h-4 w-4" /> 未签
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.laborContractSigned ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" /> 已签
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        <XCircle className="h-4 w-4" /> 未签
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/hr/onboarding/${record.id}`)
                      }}
                    >
                      查看详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    暂无符合条件的入职记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
