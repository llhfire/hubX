import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { CheckCircle2, AlertCircle, Clock, Shield } from 'lucide-react'

const PAYSLIP_DATA = {
  employeeName: '张伟', employeeNo: 'HX-2025-001', position: 'L8 后端开发工程师',
  department: '技术部', period: '2026年7月', workDays: 23, actualWorkDays: 21,
  baseSalary: 22000, dailySalary: 956.52, probationSalary: 0, isProbation: false,
  performanceBase: 5000, performanceCoefficient: 1.1, performancePay: 5500,
  attendanceDeduction: 0, socialInsurance: 1200, tax: 380, totalDeduction: 1580,
  netSalary: 25920, confirmStatus: '待确认' as const,
}

export function PayrollDetail() {
  const d = PAYSLIP_DATA
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">工资条详情</h1>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{d.confirmStatus}</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-indigo-100 text-indigo-700">张</AvatarFallback></Avatar>
            <div>
              <div className="font-semibold">{d.employeeName}</div>
              <div className="text-xs text-slate-400">{d.employeeNo} · {d.position} · {d.department}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500">{d.period}</div>
            <div className="text-3xl font-bold text-indigo-600 mt-1">¥{d.netSalary.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">实发工资（{d.actualWorkDays}/{d.workDays} 工作日）</div>
          </div>

          <Separator />

          <div className="space-y-2.5">
            <h4 className="text-sm font-medium text-slate-700">收入明细</h4>
            <div className="flex justify-between text-sm"><span className="text-slate-500">基本工资</span><span>¥{d.baseSalary.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">日薪基数 (÷{d.workDays}天)</span><span>¥{d.dailySalary.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">绩效实发 ({d.performanceBase}×{d.performanceCoefficient})</span><span className="text-green-600">+¥{d.performancePay.toLocaleString()}</span></div>
          </div>

          <Separator />

          <div className="space-y-2.5">
            <h4 className="text-sm font-medium text-slate-700">扣减明细</h4>
            <div className="flex justify-between text-sm"><span className="text-slate-500">考勤扣款</span><span>{d.attendanceDeduction > 0 ? `-¥${d.attendanceDeduction}` : '¥0'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">社保公积金</span><span className="text-red-500">-¥{d.socialInsurance.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">个人所得税</span><span className="text-red-500">-¥{d.tax}</span></div>
            <div className="flex justify-between text-sm font-medium border-t pt-2"><span>合计扣减</span><span className="text-red-500">-¥{d.totalDeduction.toLocaleString()}</span></div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>实发工资</span>
            <span className="text-indigo-600">¥{d.netSalary.toLocaleString()}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 gap-2"><CheckCircle2 className="h-4 w-4" />确认无误</Button>
            <Button variant="outline" className="flex-1 gap-2"><AlertCircle className="h-4 w-4" />有异议</Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <Shield className="h-3.5 w-3.5" />
            <span>确认后将记录时间戳、IP 地址及设备信息作为法律凭证</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
