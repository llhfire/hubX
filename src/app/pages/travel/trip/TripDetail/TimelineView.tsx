import { useMemo } from 'react'
import { Badge } from '@/app/components/ui/badge'
import type { Expense, TripExpenseType } from '../../types'

interface TimelineViewProps {
  expenses: (Expense & { segmentDesc: string })[]
  typeLabels: Record<TripExpenseType, string>
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  transport: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  accommodation: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  meal: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  local_transport: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  communication: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
  entertainment: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  office: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  other: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
}

const TRACK_TYPES: TripExpenseType[] = ['transport', 'accommodation', 'meal', 'local_transport', 'other']

export function TimelineView({ expenses, typeLabels }: TimelineViewProps) {
  // 按日期和类型分组
  const { dateRange, expensesByDate } = useMemo(() => {
    if (expenses.length === 0) return { dateRange: [], expensesByDate: {} }

    const dates = [...new Set(expenses.map((e) => e.date))].sort()
    const byDate: Record<string, (Expense & { segmentDesc: string })[]> = {}
    expenses.forEach((e) => {
      if (!byDate[e.date]) byDate[e.date] = []
      byDate[e.date].push(e)
    })
    return { dateRange: dates, expensesByDate: byDate }
  }, [expenses])

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无费用记录
      </div>
    )
  }

  // 计算每天各类型的费用
  const getDailyAmount = (date: string, type: TripExpenseType) => {
    return expensesByDate[date]
      ?.filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0) || 0
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {/* 日期标题行 */}
        <div className="flex items-end mb-1 pl-24">
          {dateRange.map((date) => (
            <div key={date} className="flex-1 text-center">
              <div className="text-xs font-medium text-slate-600">{date.slice(5)}</div>
              <div className="text-[10px] text-slate-400">
                ¥{expensesByDate[date]?.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* 时间轴线 */}
        <div className="relative ml-24 mb-0.5">
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-slate-200" />
          {dateRange.map((date, i) => (
            <div
              key={date}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 border-2 border-white shadow"
              style={{ left: `${(i / (dateRange.length - 1 || 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* 费用类型轨道 */}
        <div className="space-y-1 mt-2">
          {TRACK_TYPES.map((type) => {
            const hasData = dateRange.some((d) => getDailyAmount(d, type) > 0)
            return (
              <div key={type} className="flex items-center">
                {/* 类型标签 */}
                <div className="w-24 shrink-0 text-right pr-3">
                  <span className={`text-xs ${hasData ? 'font-medium text-slate-700' : 'text-slate-400'}`}>
                    {typeLabels[type]}
                  </span>
                </div>

                {/* 轨道 */}
                <div className="flex-1 relative h-8 bg-slate-50/30 rounded border border-slate-100">
                  {/* 轨道背景线 */}
                  <div className="absolute inset-y-1/2 -translate-y-1/2 left-1 right-1 h-px bg-slate-200" />

                  {/* 日期网格线 */}
                  {dateRange.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-slate-100/50"
                      style={{ left: `${((i + 0.5) / dateRange.length) * 100}%` }}
                    />
                  ))}

                  {/* 费用胶囊 */}
                  {dateRange.map((date, i) => {
                    const amount = getDailyAmount(date, type)
                    if (amount === 0) return null

                    const colors = TYPE_COLORS[type] || TYPE_COLORS.other

                    return (
                      <div
                        key={date}
                        className={`absolute top-1/2 rounded-full border text-[10px] font-semibold cursor-pointer hover:shadow-md transition-shadow z-10 whitespace-nowrap ${colors.bg} ${colors.text} ${colors.border}`}
                        style={{
                          left: `${((i + 0.5) / dateRange.length) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          paddingLeft: '6px',
                          paddingRight: '6px',
                          paddingTop: '1px',
                          paddingBottom: '1px',
                        }}
                        title={`${date}: ¥${amount}`}
                      >
                        ¥{amount}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* 每日总计 */}
        <div className="flex items-center mt-2 pt-1.5 border-t border-slate-100">
          <div className="w-24 shrink-0 text-right pr-3">
            <span className="text-[11px] font-semibold text-slate-600">每日合计</span>
          </div>
          <div className="flex-1 flex">
            {dateRange.map((date) => {
              const total = expensesByDate[date]?.reduce((sum, e) => sum + e.amount, 0) || 0
              return (
                <div key={date} className="flex-1 text-center">
                  <div className="text-[11px] font-bold text-indigo-600">¥{total.toLocaleString()}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
