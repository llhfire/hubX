import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Building2, Plus, Edit, Trash2, Search, ChevronRight, ChevronDown, FolderKanban } from 'lucide-react'

const LEGAL_ENTITIES = [
  { id: 'le-1', name: '深圳前海智学教育科技有限公司', creditCode: '91440300MA5G2XXXXX', address: '深圳市南山区科技园南区', contact: '王建国' },
  { id: 'le-2', name: '深圳XX软件科技有限公司', creditCode: '91440300MA5D1XXXXX', address: '深圳市福田区车公庙天安数码城', contact: '李明' },
]

const DEPARTMENTS = [
  { id: 'd-1', name: '产品部', parentId: null, leader: '陈强', headcount: 5 },
  { id: 'd-2', name: '技术部', parentId: null, leader: '张伟', headcount: 18 },
  { id: 'd-2-1', name: '前端组', parentId: 'd-2', leader: '王磊', headcount: 6 },
  { id: 'd-2-2', name: '后端组', parentId: 'd-2', leader: '张伟', headcount: 8 },
  { id: 'd-2-3', name: '测试组', parentId: 'd-2', leader: '赵敏', headcount: 4 },
  { id: 'd-3', name: '设计部', parentId: null, leader: '李娜', headcount: 4 },
  { id: 'd-4', name: '销售部', parentId: null, leader: '刘洋', headcount: 12 },
  { id: 'd-5', name: '运营部', parentId: null, leader: '周婷', headcount: 8 },
  { id: 'd-6', name: '行政财务部', parentId: null, leader: '孙丽', headcount: 6 },
]

const BIZ_LINES = [
  { id: 'bl-1', name: '软件定制开发', leader: '张伟', headcount: 22, description: '为甲方客户提供软件定制开发服务' },
  { id: 'bl-2', name: 'IP打造', leader: '周婷', headcount: 8, description: '自有IP内容运营与品牌建设' },
  { id: 'bl-3', name: '移民业务', leader: '刘洋', headcount: 10, description: '移民咨询与办理服务' },
  { id: 'bl-4', name: '电商业务', leader: '陈强', headcount: 6, description: '电商平台运营与自营商品' },
]

const POSITIONS = [
  { id: 'p-1', name: '前端开发工程师', levels: ['L5 初级', 'L6 中级', 'L7 高级', 'L8 专家'] },
  { id: 'p-2', name: '后端开发工程师', levels: ['L5 初级', 'L6 中级', 'L7 高级', 'L8 专家', 'L9 架构师'] },
  { id: 'p-3', name: 'UI 设计师', levels: ['L4 助理', 'L5 初级', 'L6 中级', 'L7 高级'] },
  { id: 'p-4', name: '产品经理', levels: ['L5 初级', 'L6 中级', 'L7 高级'] },
  { id: 'p-5', name: '销售经理', levels: ['L5 初级', 'L6 中级', 'L7 高级'] },
  { id: 'p-6', name: '测试工程师', levels: ['L4 助理', 'L5 初级', 'L6 中级'] },
  { id: 'p-7', name: '运营专员', levels: ['L4 助理', 'L5 初级', 'L6 中级'] },
  { id: 'p-8', name: 'HR 专员', levels: ['L5 初级', 'L6 中级'] },
]

function DeptTree({ items, parentId = null, level = 0 }: { items: typeof DEPARTMENTS; parentId?: string | null; level?: number }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['d-2']))
  const children = items.filter((d) => d.parentId === parentId)

  return (
    <div className={level > 0 ? 'ml-6' : ''}>
      {children.map((dept) => (
        <div key={dept.id}>
          <div
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer group"
            onClick={() => setExpanded((prev) => {
              const next = new Set(prev)
              if (next.has(dept.id)) next.delete(dept.id)
              else next.add(dept.id)
              return next
            })}
          >
            {children.some((d) => d.parentId === dept.id) ? (
              expanded.has(dept.id) ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            ) : <div className="w-3.5" />}
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{dept.name}</span>
            <span className="text-xs text-slate-400">{dept.leader}</span>
            <Badge variant="secondary" className="text-[10px] ml-auto">{dept.headcount}人</Badge>
            <Button variant="ghost" size="sm" className="h-6 px-1.5 opacity-0 group-hover:opacity-100">
              <Edit className="h-3 w-3" />
            </Button>
          </div>
          {expanded.has(dept.id) && (
            <DeptTree items={items} parentId={dept.id} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  )
}

export function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('departments')
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">组织管理</h1>
        <Button className="gap-2"><Plus className="h-4 w-4" />新增</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="departments">行政部门</TabsTrigger>
              <TabsTrigger value="entities">法人主体</TabsTrigger>
              <TabsTrigger value="bizlines">主业务线</TabsTrigger>
              <TabsTrigger value="positions">岗位职级</TabsTrigger>
            </TabsList>

            <div className="pt-4">
              {/* 行政部门 */}
              <TabsContent value="departments">
                <div className="flex items-center gap-2 mb-4">
                  <Input placeholder="搜索部门..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
                </div>
                <div className="border rounded-lg p-3">
                  <DeptTree items={DEPARTMENTS} />
                </div>
                <p className="text-xs text-slate-400 mt-3">共 {DEPARTMENTS.length} 个部门，{DEPARTMENTS.reduce((s, d) => s + d.headcount, 0)} 名员工</p>
              </TabsContent>

              {/* 法人主体 */}
              <TabsContent value="entities">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>法人名称</TableHead>
                      <TableHead>统一社会信用代码</TableHead>
                      <TableHead>地址</TableHead>
                      <TableHead>联系人</TableHead>
                      <TableHead className="w-20">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LEGAL_ENTITIES.map((le) => (
                      <TableRow key={le.id}>
                        <TableCell className="font-medium">{le.name}</TableCell>
                        <TableCell className="font-mono text-xs">{le.creditCode}</TableCell>
                        <TableCell className="text-sm text-slate-500">{le.address}</TableCell>
                        <TableCell>{le.contact}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* 主业务线 */}
              <TabsContent value="bizlines">
                <div className="grid grid-cols-2 gap-4">
                  {BIZ_LINES.map((bl) => (
                    <Card key={bl.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FolderKanban className="h-4 w-4 text-indigo-500" />
                            <span className="font-semibold">{bl.name}</span>
                          </div>
                          <Badge variant="secondary">{bl.headcount}人</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{bl.description}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>负责人: {bl.leader}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 岗位职级 */}
              <TabsContent value="positions">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>岗位名称</TableHead>
                      <TableHead>职级体系</TableHead>
                      <TableHead>职级数</TableHead>
                      <TableHead className="w-20">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {POSITIONS.map((pos) => (
                      <TableRow key={pos.id}>
                        <TableCell className="font-medium">{pos.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pos.levels.map((l) => (
                              <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{pos.levels.length}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
