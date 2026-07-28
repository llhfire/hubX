import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'
import { UserPlus, Save } from 'lucide-react'

interface EmployeeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: any
}

const genderOptions = ['男', '女']
const legalEntities = ['主公司', '子公司A', '子公司B']
const departments = ['技术部', '产品部', '市场部', '销售部', '财务部', '人事部', '行政部']
const businessLines = ['企业服务', '消费互联网', '人工智能', '金融科技']
const positions = ['前端开发', '后端开发', '产品经理', 'UI设计师', '测试工程师', '运维工程师', 'HR专员', '财务专员']
const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'M1', 'M2', 'M3']
const supervisors = ['张三', '李四', '王五', '赵六', '孙七']

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      {children}
    </div>
  )
}

function SelectField({
  label,
  placeholder,
  options,
  value,
  onValueChange,
}: {
  label: string
  placeholder: string
  options: string[]
  value?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <FormField label={label}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: EmployeeFormDialogProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    gender: initialData?.gender ?? '',
    phone: initialData?.phone ?? '',
    idCard: initialData?.idCard ?? '',
    legalEntity: initialData?.legalEntity ?? '',
    department: initialData?.department ?? '',
    businessLine: initialData?.businessLine ?? '',
    position: initialData?.position ?? '',
    level: initialData?.level ?? '',
    supervisor: initialData?.supervisor ?? '',
    hireDate: initialData?.hireDate ?? '',
    baseSalary: initialData?.baseSalary ?? '',
    performanceBase: initialData?.performanceBase ?? '',
    bankCard: initialData?.bankCard ?? '',
    bankName: initialData?.bankName ?? '',
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    toast.success('保存成功')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-indigo-500" />
            {mode === 'create' ? '新增员工' : '编辑员工'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <FormField label="姓名">
            <Input
              placeholder="请输入姓名"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </FormField>

          <SelectField
            label="性别"
            placeholder="请选择性别"
            options={genderOptions}
            value={form.gender}
            onValueChange={(v) => updateField('gender', v)}
          />

          <FormField label="手机">
            <Input
              placeholder="请输入手机号"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </FormField>

          <FormField label="身份证">
            <Input
              placeholder="请输入身份证号"
              value={form.idCard}
              onChange={(e) => updateField('idCard', e.target.value)}
            />
          </FormField>

          <SelectField
            label="签约法人"
            placeholder="请选择签约法人"
            options={legalEntities}
            value={form.legalEntity}
            onValueChange={(v) => updateField('legalEntity', v)}
          />

          <SelectField
            label="行政部门"
            placeholder="请选择部门"
            options={departments}
            value={form.department}
            onValueChange={(v) => updateField('department', v)}
          />

          <SelectField
            label="业务线"
            placeholder="请选择业务线"
            options={businessLines}
            value={form.businessLine}
            onValueChange={(v) => updateField('businessLine', v)}
          />

          <SelectField
            label="岗位"
            placeholder="请选择岗位"
            options={positions}
            value={form.position}
            onValueChange={(v) => updateField('position', v)}
          />

          <SelectField
            label="职级"
            placeholder="请选择职级"
            options={levels}
            value={form.level}
            onValueChange={(v) => updateField('level', v)}
          />

          <SelectField
            label="直属上级"
            placeholder="请选择直属上级"
            options={supervisors}
            value={form.supervisor}
            onValueChange={(v) => updateField('supervisor', v)}
          />

          <FormField label="入职日期">
            <Input
              type="date"
              value={form.hireDate}
              onChange={(e) => updateField('hireDate', e.target.value)}
            />
          </FormField>

          <FormField label="基本工资">
            <Input
              type="number"
              placeholder="请输入基本工资"
              value={form.baseSalary}
              onChange={(e) => updateField('baseSalary', e.target.value)}
            />
          </FormField>

          <FormField label="绩效基数">
            <Input
              type="number"
              placeholder="请输入绩效基数"
              value={form.performanceBase}
              onChange={(e) => updateField('performanceBase', e.target.value)}
            />
          </FormField>

          <FormField label="银行卡号">
            <Input
              placeholder="请输入银行卡号"
              value={form.bankCard}
              onChange={(e) => updateField('bankCard', e.target.value)}
            />
          </FormField>

          <FormField label="开户行">
            <Input
              placeholder="请输入开户行"
              value={form.bankName}
              onChange={(e) => updateField('bankName', e.target.value)}
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} className="gap-1.5">
            <Save className="h-4 w-4" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
