import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Separator } from '@/app/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { Upload, FileText, CheckCircle2, AlertTriangle, Brain, Eye, Download, Sparkles, Loader2, GitCompare } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'motion/react'

// OCR 识别结果（模拟）
const ocrResult = {
  basicInfo: {
    name: '张伟',
    gender: '男',
    birthDate: '1992-03-15',
    nativePlace: '广东梅州',
    ethnicity: '汉族',
    maritalStatus: '已婚',
    idCard: '440301199203151234',
    phone: '13800001234',
    wechat: 'zhangwei_dev',
    address: '深圳市南山区科技园南区',
    housing: '租房',
    position: '高级后端工程师',
    expectedSalary: '25000-30000',
    lowestSalary: '22000',
   填表时间: '2024-03-05',
  },
  education: [
    { period: '2010.09 - 2014.06', school: '深圳大学', major: '计算机科学与技术', degree: '本科', type: '统招' },
  ],
  training: [
    { period: '2021.03 - 2021.06', content: 'PMP 项目管理培训', certificate: 'PMP 项目管理专业人士' },
    { period: '2023.01 - 2023.04', content: 'AWS 解决方案架构师培训', certificate: 'AWS Solutions Architect' },
  ],
  workExperience: [
    { period: '2024.03 - 至今', company: 'XX 软件科技有限公司', position: '高级后端工程师', reason: '寻求更好发展', salary: '22000', referee: '王建国 138****5678' },
    { period: '2020.06 - 2024.02', company: '某在线教育公司', position: '后端开发工程师', reason: '业务单一，想拓展行业', salary: '18000', referee: '李经理 139****1234' },
    { period: '2018.07 - 2020.05', company: '某金融科技公司', position: '开发工程师', reason: '职业发展', salary: '12000', referee: '张总监 137****5678' },
  ],
  emergencyContact: { name: '张芳', relation: '姐妹', phone: '136****9012' },
  careerMotivation: ['能力提升', '薪资回报', '发展前景'],
  jobPriority: ['发展空间', '薪资福利', '团队氛围'],
  strengths: '8年Java后端开发经验，精通Spring Boot微服务架构，有完整的电商、教育、行业项目交付经验。',
  shortTermPlan: '1年内成为团队技术负责人，带领小团队完成项目交付。',
  recruitmentSource: '人才招聘网站（Boss直聘）',
  availableDate: '收到Offer后2周内',
  email: 'zhangwei@example.com',
}

// 现有员工档案数据（用于比对）
const existingEmployeeData = {
  name: '张伟',
  gender: '男',
  phone: '138****1234',
  idCard: '44030119920315****',
  position: '后端开发工程师',
  education: '深圳大学 · 计算机科学与技术',
  workYears: '8年',
  skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
}

// 数据比对结果
const dataComparison = [
  { field: '姓名', ocrValue: '张伟', existingValue: '张伟', match: true },
  { field: '性别', ocrValue: '男', existingValue: '男', match: true },
  { field: '联系电话', ocrValue: '13800001234', existingValue: '138****1234', match: true, note: '脱敏后一致' },
  { field: '应聘岗位', ocrValue: '高级后端工程师', existingValue: '后端开发工程师', match: false, note: '登记表为"高级"，档案无"高级"前缀' },
  { field: '学历', ocrValue: '深圳大学 · 计算机科学与技术', existingValue: '深圳大学 · 计算机科学与技术', match: true },
  { field: '工作年限', ocrValue: '6年（3段工作经历）', existingValue: '8年', match: false, note: '登记表填写的工作经历推算为6年，档案记录为8年，存在差异' },
  { field: '期望薪资', ocrValue: '¥25,000 - ¥30,000', existingValue: '¥22,000（实际入职薪资）', match: false, note: '期望薪资与实际定薪存在差异，属正常情况' },
  { field: '紧急联系人', ocrValue: '张芳（姐妹）136****9012', existingValue: '未填写', match: false, note: '档案中缺少紧急联系人信息' },
  { field: '身份证号码', ocrValue: '44030119920315****', existingValue: '44030119920315****', match: true },
]

// AI 纠错结果
const aiCorrections = [
  { field: '联系电话', original: '13800001234', corrected: '138-0000-1234', reason: '格式标准化', type: 'format' as const },
  { field: '身份证号码', original: '440301199203151234', corrected: '44030119920315****', reason: '敏感信息脱敏', type: 'privacy' as const },
  { field: '期望薪资', original: '25000-30000', corrected: '¥25,000 - ¥30,000', reason: '格式标准化', type: 'format' as const },
  { field: '工作经历-薪资', original: '22000', corrected: '¥22,000', reason: '格式标准化', type: 'format' as const },
  { field: '工作经历-离职原因', original: '业务单一，想拓展行业', corrected: '业务单一，希望拓展行业经验', reason: '语句优化', type: 'content' as const },
  { field: '紧急联络人', original: '张芳', corrected: '张芳（姐妹）', reason: '补充关系说明', type: 'content' as const },
]

interface RegistrationFormOCRProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'upload' | 'view'
}

export function RegistrationFormOCR({ open, onOpenChange, mode = 'view' }: RegistrationFormOCRProps) {
  const [uploading, setUploading] = useState(false)
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'done'>('done')
  const [activeTab, setActiveTab] = useState('basic')

  const handleUpload = () => {
    setUploading(true)
    setOcrStatus('processing')
    setTimeout(() => {
      setUploading(false)
      setOcrStatus('done')
      toast.success('OCR 识别完成，AI 纠错已完成')
    }, 2000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">应聘人员登记表</h2>
              <p className="text-xs text-slate-400">OCR 识别 + AI 智能纠错 + 归档</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ocrStatus === 'done' && (
              <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                <CheckCircle2 className="h-3 w-3" />已识别归档
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>✕</Button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto p-6">
          {/* 上传区 */}
          <Card className="mb-4 border-dashed border-2 border-indigo-200 bg-indigo-50/30">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-700">上传扫描件</h3>
                  <p className="text-xs text-slate-400 mt-0.5">支持 PDF、JPG、PNG 格式，AI 将自动 OCR 识别并纠错</p>
                </div>
                <Button onClick={handleUpload} disabled={uploading} className="gap-2">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? '识别中...' : '上传文件'}
                </Button>
              </div>
              {ocrStatus === 'processing' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI 正在进行 OCR 识别与智能纠错...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* OCR 识别结果 */}
          {ocrStatus === 'done' && (
            <div className="space-y-4">
              {/* AI 纠错摘要 */}
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />AI 纠错结果
                    <Badge variant="outline" className="text-[10px]">{aiCorrections.length} 处修正</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {aiCorrections.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border text-xs">
                        <Badge variant="outline" className={`text-[9px] ${
                          c.type === 'format' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          c.type === 'privacy' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-green-50 text-green-600 border-green-200'
                        }`}>{c.type === 'format' ? '格式' : c.type === 'privacy' ? '脱敏' : '内容'}</Badge>
                        <span className="text-slate-400 w-20 shrink-0">{c.field}</span>
                        <span className="text-slate-400 line-through">{c.original}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-700 font-medium">{c.corrected}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 识别内容详情 */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="basic">基本信息</TabsTrigger>
                  <TabsTrigger value="education">教育经历</TabsTrigger>
                  <TabsTrigger value="work">工作经历</TabsTrigger>
                  <TabsTrigger value="other">其他信息</TabsTrigger>
                  <TabsTrigger value="compare" className="gap-1">
                    <GitCompare className="h-3.5 w-3.5" />数据比对
                    <Badge variant="outline" className="text-[9px] ml-1 bg-amber-50 text-amber-600 border-amber-200">
                      {dataComparison.filter((d) => !d.match).length} 项差异
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: '姓名', value: ocrResult.basicInfo.name },
                          { label: '性别', value: ocrResult.basicInfo.gender },
                          { label: '出生日期', value: ocrResult.basicInfo.birthDate },
                          { label: '籍贯', value: ocrResult.basicInfo.nativePlace },
                          { label: '民族', value: ocrResult.basicInfo.ethnicity },
                          { label: '婚姻状况', value: ocrResult.basicInfo.maritalStatus },
                          { label: '证件号码', value: ocrResult.basicInfo.idCard },
                          { label: '联系电话', value: ocrResult.basicInfo.phone },
                          { label: '微信号', value: ocrResult.basicInfo.wechat },
                          { label: '现住址', value: ocrResult.basicInfo.address, span: 2 },
                          { label: '居住情况', value: ocrResult.basicInfo.housing },
                          { label: '应聘岗位', value: ocrResult.basicInfo.position },
                          { label: '期望薪资', value: `¥${ocrResult.basicInfo.expectedSalary}` },
                          { label: '最低薪资', value: `¥${ocrResult.basicInfo.lowestSalary}` },
                          { label: '填表时间', value: ocrResult.basicInfo.填表时间 },
                        ].map((f) => (
                          <div key={f.label} className={`${f.span === 2 ? 'col-span-2' : ''}`}>
                            <Label className="text-xs text-slate-400">{f.label}</Label>
                            <div className="text-sm font-medium mt-0.5">{f.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">教育经历</h4>
                        {ocrResult.education.map((e, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded border">
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-slate-400">{e.period}</span>
                              <span className="font-medium">{e.school}</span>
                              <span>{e.major}</span>
                              <Badge variant="outline" className="text-xs">{e.degree}</Badge>
                              <Badge variant="outline" className="text-xs">{e.type}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">培训与证书</h4>
                        {ocrResult.training.map((t, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded border">
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-slate-400">{t.period}</span>
                              <span className="font-medium">{t.content}</span>
                              <Badge className="text-xs bg-green-100 text-green-700 border-green-200">{t.certificate}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="work">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {ocrResult.workExperience.map((w, i) => (
                          <div key={i} className="relative pl-6 border-l-2 border-indigo-200">
                            <div className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <div className="p-3 bg-slate-50 rounded border">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{w.company}</span>
                                <Badge variant="outline" className="text-xs">{w.period}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                                <span>职位: {w.position}</span>
                                <span>月薪: ¥{w.salary}</span>
                                <span>离职原因: {w.reason}</span>
                                <span>证明人: {w.referee}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="other">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-slate-400">紧急联络人</Label>
                          <div className="text-sm font-medium">{ocrResult.emergencyContact.name}（{ocrResult.emergencyContact.relation}）{ocrResult.emergencyContact.phone}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-400">邮箱</Label>
                          <div className="text-sm font-medium">{ocrResult.email}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-400">可上岗时间</Label>
                          <div className="text-sm font-medium">{ocrResult.availableDate}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-400">得知途径</Label>
                          <div className="text-sm font-medium">{ocrResult.recruitmentSource}</div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-xs text-slate-400">求职动机</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ocrResult.careerMotivation.map((m) => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">岗位优势</Label>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{ocrResult.strengths}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-slate-400">短期职业规划</Label>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{ocrResult.shortTermPlan}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 数据比对 */}
                <TabsContent value="compare">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <GitCompare className="h-4 w-4 text-indigo-500" />登记表 vs 档案数据比对
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dataComparison.map((item, i) => (
                          <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
                            item.match ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'
                          }`}>
                            <div className="shrink-0">
                              {item.match ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-slate-700 w-20">{item.field}</span>
                                <Badge variant="outline" className={`text-[10px] ${
                                  item.match ? 'bg-green-100 text-green-600 border-green-200' : 'bg-amber-100 text-amber-600 border-amber-200'
                                }`}>
                                  {item.match ? '一致' : '差异'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex-1">
                                  <span className="text-xs text-slate-400">登记表:</span>
                                  <span className="ml-1 text-slate-700">{item.ocrValue}</span>
                                </div>
                                <span className="text-slate-300">vs</span>
                                <div className="flex-1">
                                  <span className="text-xs text-slate-400">档案:</span>
                                  <span className="ml-1 text-slate-700">{item.existingValue}</span>
                                </div>
                              </div>
                              {item.note && (
                                <p className="text-xs text-amber-600 mt-1 italic">💡 {item.note}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 汇总 */}
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">比对结果</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-green-600">✅ {dataComparison.filter((d) => d.match).length} 项一致</span>
                            <span className="text-xs text-amber-600">⚠️ {dataComparison.filter((d) => !d.match).length} 项差异</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          差异项将在归档后自动更新到员工档案中，标注为"登记表补充"。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>扫描件归档</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span>基础信息更新</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span>简历数据补充</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>{dataComparison.filter((d) => !d.match).length} 项差异已标注</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1"><Download className="h-4 w-4" />下载扫描件</Button>
            <Button onClick={() => {
              toast.success('登记表已归档', {
                description: `扫描件已保存，${dataComparison.filter((d) => !d.match).length} 项差异已更新到员工档案`,
              })
              onOpenChange(false)
            }} className="gap-1">
              <CheckCircle2 className="h-4 w-4" />确认归档
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
