import { useState } from 'react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { AlertTriangle, CheckCircle2, MapPin, ChevronDown, ChevronUp, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface ComplianceGuideProps {
  destination: string
  days: number
  department: string
  companions: string[]
}

const CITY_LEVEL: Record<string, { level: string; hotelLimit: number; transportLimit: number }> = {
  '北京': { level: '一线', hotelLimit: 220, transportLimit: 50 },
  '上海': { level: '一线', hotelLimit: 220, transportLimit: 50 },
  '广州': { level: '一线', hotelLimit: 220, transportLimit: 50 },
  '深圳': { level: '一线', hotelLimit: 220, transportLimit: 50 },
  '成都': { level: '新一线', hotelLimit: 220, transportLimit: 50 },
  '重庆': { level: '二线', hotelLimit: 180, transportLimit: 30 },
  '武汉': { level: '二线', hotelLimit: 180, transportLimit: 30 },
  '杭州': { level: '新一线', hotelLimit: 220, transportLimit: 50 },
  '南京': { level: '新一线', hotelLimit: 220, transportLimit: 50 },
  '长沙': { level: '二线', hotelLimit: 180, transportLimit: 30 },
  '西安': { level: '二线', hotelLimit: 180, transportLimit: 30 },
}

export function ComplianceGuide({ destination, days, department, companions }: ComplianceGuideProps) {
  const [expanded, setExpanded] = useState(false)
  const cityInfo = CITY_LEVEL[destination] || { level: '三线及以下', hotelLimit: 150, transportLimit: 30 }
  const isSoftware = department.includes('软件')
  const isSales = department.includes('销售')
  const hotelLimit = isSales && days >= 7 ? Math.round(cityInfo.hotelLimit * 0.9) : cityInfo.hotelLimit

  return (
    <div className="border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      {/* 紧凑横幅 */}
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-blue-100/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">报销合规指引</span>
          <Badge variant="outline" className="text-[10px] bg-white border-blue-200">{destination} · {days}天 · {cityInfo.level}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>住宿 <strong className="text-blue-600">¥{hotelLimit}</strong>/天</span>
            <span>交通 <strong className="text-blue-600">¥{cityInfo.transportLimit}</strong>/天</span>
            <span>餐补 <strong className="text-blue-600">¥40</strong>/天</span>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {/* 展开详情 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 border-t border-blue-100 space-y-2">
              <div className="grid grid-cols-3 gap-3">
                {/* 住宿 */}
                <div className="p-2 bg-white rounded border border-blue-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Bed className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">住宿</span>
                  </div>
                  <p className="text-xs text-slate-500">上限 ¥{hotelLimit}/天，标间/大床房</p>
                  <p className="text-xs text-slate-500">总额上限 ¥{hotelLimit * days}</p>
                  {companions.length > 0 && (
                    <p className="text-[10px] text-amber-600 mt-1">⚠️ 须与同行人员合住</p>
                  )}
                </div>
                {/* 交通 */}
                <div className="p-2 bg-white rounded border border-blue-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Car className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-semibold text-slate-700">市内交通</span>
                  </div>
                  <p className="text-xs text-slate-500">上限 ¥{cityInfo.transportLimit}/天</p>
                  <p className="text-xs text-slate-500">总额上限 ¥{cityInfo.transportLimit * days}</p>
                  {!isSales && <p className="text-[10px] text-slate-400 mt-1">职能部门仅限二等座/经济舱</p>}
                </div>
                {/* 餐补 */}
                <div className="p-2 bg-white rounded border border-blue-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Utensils className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-semibold text-slate-700">餐补</span>
                  </div>
                  <p className="text-xs text-slate-500">¥40/天，总额 ¥{(days - 1) * 40}</p>
                  <p className="text-xs text-slate-500">往返路途当日无补贴</p>
                </div>
              </div>

              {/* 合规要点 */}
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" /> 保持企微打卡</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" /> 留存网约车行程单</span>
                <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-amber-500" /> 返回7天内报销</span>
                {isSoftware && <span className="flex items-center gap-1 text-red-500"><AlertTriangle className="h-3 w-3" /> 驻场未结束禁止返程</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Bed(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
}

function Car(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
}

function Utensils(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
}
