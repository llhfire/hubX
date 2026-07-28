import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import { Calculator, DollarSign, Calendar, Clock, CheckCircle, MapPin, User, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import type { Trip, TravelSubsidy } from '../../types'
import { calculateSubsidy } from '../../travel-api'

interface SubsidyTabProps {
  trip: Trip
  onUpdate: () => void
}

// 模拟考勤数据
const mockPunchRecords = [
  { date: '2026-04-28', clockIn: '08:55', clockOut: '18:30', location: '杭州阿里园区', status: '正常' },
  { date: '2026-04-29', clockIn: '09:00', clockOut: '19:15', location: '杭州阿里园区', status: '正常' },
  { date: '2026-04-30', clockIn: '08:50', clockOut: '18:45', location: '杭州阿里园区', status: '正常' },
  { date: '2026-05-01', clockIn: null, clockOut: null, location: '-', status: '节假日' },
  { date: '2026-05-02', clockIn: '09:10', clockOut: '19:30', location: '杭州阿里园区', status: '迟到10分钟' },
  { date: '2026-05-03', clockIn: '08:55', clockOut: '18:20', location: '杭州阿里园区', status: '正常' },
  { date: '2026-05-04', clockIn: '08:30', clockOut: '10:00', location: '杭州高铁站', status: '返程日' },
]

const statusColors: Record<string, string> = {
  '正常': 'bg-green-100 text-green-700',
  '节假日': 'bg-blue-100 text-blue-700',
  '迟到10分钟': 'bg-amber-100 text-amber-700',
  '返程日': 'bg-slate-100 text-slate-600',
}

export function SubsidyTab({ trip, onUpdate }: SubsidyTabProps) {
  const [loading, setLoading] = useState(false)
  const [subsidy, setSubsidy] = useState<TravelSubsidy | null>(trip.subsidy || null)

  const loadSubsidy = async () => {
    setLoading(true)
    try {
      const data = await calculateSubsidy(trip.id)
      setSubsidy(data)
    } catch {
      toast.error('计算补贴失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculate = async () => {
    setLoading(true)
    try {
      const data = await calculateSubsidy(trip.id)
      setSubsidy(data)
      toast.success('补贴已重新计算')
    } catch {
      toast.error('计算失败')
    } finally {
      setLoading(false)
    }
  }

  const workDays = mockPunchRecords.filter((r) => r.status === '正常' || r.status === '迟到10分钟').length
  const lateCount = mockPunchRecords.filter((r) => r.status.includes('迟到')).length

  return (
    <div className="space-y-4">
      {/* 顶部：补贴总额 + 计算参数 并排 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 补贴总额 */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">差旅补贴总额</span>
              <Badge variant={subsidy?.isPaid ? 'default' : 'secondary'} className="text-[10px]">
                {subsidy?.isPaid ? '已发放' : '待发放'}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-indigo-600">¥{subsidy?.totalAmount.toLocaleString() || '-'}</div>
            <div className="text-xs text-slate-400 mt-1">随当月工资发放</div>
          </CardContent>
        </Card>

        {/* 计算参数 */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-sm font-medium text-slate-700 mb-3">计算参数</div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500">模式</span>
                <span className="font-medium">{subsidy?.calcMode === 'calendar_day' ? '自然日' : '工作日'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500">标准</span>
                <span className="font-medium">¥{subsidy?.standard}/天</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500">天数</span>
                <span className="font-medium">{subsidy?.days}天</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500">城市</span>
                <span className="font-medium">{subsidy?.cityLevel === 'first_tier' ? '一线' : '二线'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 考勤概况 */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">考勤概况</div>
              <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={() => toast.info('已同步企微打卡数据')}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-1.5 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{workDays}</div>
                <div className="text-[10px] text-slate-400">出勤天数</div>
              </div>
              <div className="p-1.5 bg-amber-50 rounded">
                <div className="text-lg font-bold text-amber-600">{lateCount}</div>
                <div className="text-[10px] text-slate-400">迟到次数</div>
              </div>
              <div className="p-1.5 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">{subsidy?.days}</div>
                <div className="text-[10px] text-slate-400">补贴天数</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 中部：计算公式 + 考勤记录 并排 */}
      <div className="grid grid-cols-5 gap-4">
        {/* 计算公式 */}
        <div className="col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">计算公式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm">
                <div className="text-slate-500 text-xs mb-1">公式</div>
                <div>补贴金额 = 补贴标准 × 天数</div>
                <div className="text-slate-400 mt-1">
                  = ¥{subsidy?.standard} × {subsidy?.days}天
                </div>
                <div className="text-indigo-600 font-bold mt-1">
                  = ¥{subsidy?.totalAmount.toLocaleString()}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-slate-500">发放规则</h4>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>• 差旅补贴随当月工资一起发放</p>
                  <p>• 不计入工资基数，作为独立津贴</p>
                  <p>• 出差单关闭后自动汇总到当月工资</p>
                  <p>• 往返路途当日享受补贴</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 考勤记录 */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />出差考勤记录
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">{mockPunchRecords.length} 天</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {mockPunchRecords.map((record, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 px-2 hover:bg-slate-50 rounded text-sm">
                    <span className="text-slate-400 font-mono text-xs w-20">{record.date.slice(5)}</span>
                    <span className="font-mono text-xs w-20">{record.clockIn || '-'}</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-mono text-xs w-20">{record.clockOut || '-'}</span>
                    <span className="text-slate-400 text-xs flex-1">{record.location}</span>
                    <Badge variant="outline" className={`text-[10px] ${statusColors[record.status] || 'bg-slate-100 text-slate-600'}`}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
