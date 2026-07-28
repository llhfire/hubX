import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import { CheckCircle, XCircle, Clock, User, MapPin, Calendar, DollarSign, Building2, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import type { Trip } from '../../types'

interface BasicInfoTabProps {
  trip: Trip
}

const approvalStatusConfig: Record<string, { icon: typeof CheckCircle; color: string; badge: string; badgeVariant: 'default' | 'destructive' | 'secondary' }> = {
  approved: { icon: CheckCircle, color: 'text-green-600', badge: '已通过', badgeVariant: 'default' },
  rejected: { icon: XCircle, color: 'text-red-600', badge: '已驳回', badgeVariant: 'destructive' },
  pending: { icon: Clock, color: 'text-orange-600', badge: '待审批', badgeVariant: 'secondary' },
}

const transportModeLabels: Record<string, string> = {
  high_speed_rail: '高铁', bullet_train: '动车', airplane: '飞机',
  self_drive: '自驾', bus: '大巴', ferry: '轮船', other: '其他',
}

export function BasicInfoTab({ trip }: BasicInfoTabProps) {
  const [approvalExpanded, setApprovalExpanded] = useState(false)
  const isApproved = trip.approvalRecords?.every((r) => r.status === 'approved')

  return (
    <div className="space-y-3">
      {/* 顶部：申请信息 + 行程信息 + 费用预估 三列并排 */}
      <div className="grid grid-cols-3 gap-3">
        {/* 申请信息 */}
        <Card>
          <CardContent className="pt-3 pb-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-slate-700">申请信息</span>
            </div>
            <div className="grid grid-cols-1 gap-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">单号</span><span className="font-mono text-xs">{trip.tripNo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">申请人</span><span className="font-medium">{trip.applicantName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">部门</span><span>{trip.department}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">创建日期</span><span>{trip.createDate}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">关联客户</span><span className="text-xs">{trip.customerName || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">关联项目</span><span className="text-xs">{trip.projectName || '-'}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* 行程信息 */}
        <Card>
          <CardContent className="pt-3 pb-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-slate-700">行程信息</span>
            </div>
            <div className="grid grid-cols-1 gap-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">目的地</span><span className="font-medium">{trip.destinations.join('、')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">天数</span><span className="font-semibold text-primary">{trip.days}天</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">日期</span><span className="text-xs">{trip.startDate} ~ {trip.endDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">交通</span><span>{trip.transportModes.map((m) => transportModeLabels[m] || m).join('、')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">住宿</span><span>{trip.accommodationIntent === 'hotel' ? '酒店' : trip.accommodationIntent === 'dormitory' ? '宿舍' : '无'}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* 费用预估 */}
        <Card>
          <CardContent className="pt-3 pb-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-slate-700">费用预估</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">交通</span><span>¥{trip.estimatedTransportCost.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">住宿</span><span>¥{trip.estimatedAccommodationCost.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">餐饮</span><span>¥{trip.estimatedMealCost.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">其他</span><span>¥{trip.estimatedOtherCost.toLocaleString()}</span></div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground">预计总费用</span>
              <span className="text-lg font-bold text-primary">¥{trip.estimatedTotalCost.toLocaleString()}</span>
            </div>
            {trip.needLoan && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">借款</span>
                <span className="text-amber-600">¥{trip.loanAmount?.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 出差目的 */}
      <Card>
        <CardContent className="pt-3 pb-3">
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-muted-foreground w-16 shrink-0 mt-0.5">出差目的</span>
            <span className="text-sm text-muted-foreground leading-relaxed">{trip.purpose || '未填写'}</span>
          </div>
        </CardContent>
      </Card>

      {/* 审批流程 - 通过后可折叠 */}
      {trip.approvalRecords && trip.approvalRecords.length > 0 && (
        <Card>
          <div
            className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => isApproved && setApprovalExpanded(!approvalExpanded)}
          >
            <div className="flex items-center gap-2">
              {isApproved ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm font-semibold text-slate-700">审批流程</span>
              <Badge variant="outline" className="text-[10px]">
                {trip.approvalRecords.filter((r) => r.status === 'approved').length}/{trip.approvalRecords.length} 已通过
              </Badge>
            </div>
            {isApproved && (
              approvalExpanded
                ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <AnimatePresence>
            {(approvalExpanded || !isApproved) && (
              <motion.div
                initial={isApproved ? { height: 0, opacity: 0 } : false}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 space-y-2">
                  {trip.approvalRecords.map((record) => {
                    const config = approvalStatusConfig[record.status] || approvalStatusConfig.pending
                    const Icon = config.icon
                    return (
                      <div key={record.id} className="flex items-center gap-3 py-2 px-3 rounded-md bg-muted">
                        <Icon className={`h-4 w-4 ${config.color} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{record.step}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{record.approver}</span>
                          </div>
                          {record.comment && <p className="text-xs text-muted-foreground mt-0.5">{record.comment}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant={config.badgeVariant} className="text-[10px]">{config.badge}</Badge>
                          {record.time && <div className="text-[10px] text-muted-foreground mt-0.5">{record.time}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}
    </div>
  )
}
