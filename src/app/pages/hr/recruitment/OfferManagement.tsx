import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import {
  ArrowLeft,
  Plus,
  FileCheck,
  FileX,
  Clock,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { OFFER_RECORDS } from '../mockData'
import type { OfferStatus } from '../types'

const STATUS_TABS: { label: string; value: OfferStatus | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '已生成', value: '已生成' },
  { label: '已发送', value: '已发送' },
  { label: '已查看', value: '已查看' },
  { label: '已接受', value: '已接受' },
  { label: '已拒绝', value: '已拒绝' },
  { label: '已过期', value: '已过期' },
]

const statusConfig: Record<OfferStatus, { color: string; icon: React.ReactNode }> = {
  '待生成': {
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: <Clock className="h-3 w-3" />,
  },
  '已生成': {
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <FileCheck className="h-3 w-3" />,
  },
  '已发送': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Send className="h-3 w-3" />,
  },
  '已查看': {
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    icon: <Eye className="h-3 w-3" />,
  },
  '已接受': {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  '已拒绝': {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="h-3 w-3" />,
  },
  '已过期': {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
}

function formatSalary(n: number): string {
  return `¥${n.toLocaleString('zh-CN')}`
}

export function OfferManagement() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<OfferStatus | 'all'>('all')

  const filtered = useMemo(() => {
    if (activeTab === 'all') return OFFER_RECORDS
    return OFFER_RECORDS.filter((o) => o.status === activeTab)
  }, [activeTab])

  // 统计
  const totalCount = OFFER_RECORDS.length
  const acceptedCount = OFFER_RECORDS.filter((o) => o.status === '已接受').length
  const rejectedCount = OFFER_RECORDS.filter((o) => o.status === '已拒绝').length
  const pendingCount = OFFER_RECORDS.filter((o) =>
    ['已生成', '已发送', '已查看'].includes(o.status)
  ).length

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/candidates')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800">Offer管理</h1>
          <Badge variant="secondary">{filtered.length} 份</Badge>
        </div>
        <Button
          className="gap-2"
          onClick={() =>
            toast.success('生成Offer功能开发中', {
              description: '请选择候选人后生成Offer',
              position: 'top-right',
            })
          }
        >
          <Plus className="h-4 w-4" />
          生成Offer
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <FileCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{totalCount}</div>
                <div className="text-xs text-slate-500">Offer总数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">{acceptedCount}</div>
                <div className="text-xs text-slate-500">已接受</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <FileX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">{rejectedCount}</div>
                <div className="text-xs text-slate-500">已拒绝</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
                <div className="text-xs text-slate-500">待跟进</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 状态筛选标签 */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1 text-xs">
                {OFFER_RECORDS.filter((o) => o.status === tab.value).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Offer表格 */}
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>候选人</TableHead>
                <TableHead>岗位</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>基本薪资</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>有效期至</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                    暂无Offer数据
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((offer) => (
                  <TableRow
                    key={offer.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/hr/candidates/${offer.candidateId}`)
                    }
                  >
                    <TableCell>
                      <div className="text-sm font-medium">{offer.candidateName}</div>
                    </TableCell>
                    <TableCell className="text-sm">{offer.position}</TableCell>
                    <TableCell className="text-sm">{offer.departmentName}</TableCell>
                    <TableCell className="text-sm font-mono font-medium">
                      {formatSalary(offer.baseSalary)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs gap-1 ${statusConfig[offer.status].color}`}
                      >
                        {statusConfig[offer.status].icon}
                        {offer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{offer.validUntil}</TableCell>
                    <TableCell className="text-sm text-slate-500">{offer.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/hr/candidates/${offer.candidateId}`)
                        }}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
