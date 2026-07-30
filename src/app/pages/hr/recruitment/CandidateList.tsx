import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Search, Upload, Eye, Heart, Users, Star, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { CANDIDATES } from '../mockData'
import type { Candidate, ResumeSource } from '../types'

const SOURCE_OPTIONS: ResumeSource[] = ['Boss直聘', '猎聘', '拉勾', '内部推荐', '主动投递', '猎头', '其他']

const sourceColor: Record<string, string> = {
  'Boss直聘': 'bg-blue-100 text-blue-700 border-blue-200',
  '猎聘': 'bg-purple-100 text-purple-700 border-purple-200',
  '拉勾': 'bg-green-100 text-green-700 border-green-200',
  '内部推荐': 'bg-amber-100 text-amber-700 border-amber-200',
  '主动投递': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  '猎头': 'bg-rose-100 text-rose-700 border-rose-200',
  '其他': 'bg-slate-100 text-slate-500 border-slate-200',
}

export function CandidateList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(CANDIDATES.filter((c) => c.isFavorited).map((c) => c.id))
  )

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        toast.success('已取消收藏')
      } else {
        next.add(id)
        toast.success('已收藏')
      }
      return next
    })
  }

  const filtered = useMemo(() => {
    return CANDIDATES.filter((c) => {
      const matchSearch = !search || c.name.includes(search)
      const matchSource = sourceFilter === 'all' || c.source === sourceFilter
      const matchSkill = !skillFilter || c.parsedResume.skills.some((s) =>
        s.toLowerCase().includes(skillFilter.toLowerCase())
      )
      return matchSearch && matchSource && matchSkill
    })
  }, [search, sourceFilter, skillFilter])

  // 统计
  const totalCount = CANDIDATES.length
  const favoritedCount = favorites.size
  const sourceBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    CANDIDATES.forEach((c) => {
      map[c.source] = (map[c.source] || 0) + 1
    })
    return map
  }, [])

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">候选人管理</h1>
          <Badge variant="secondary">{filtered.length} 人</Badge>
        </div>
        <Button className="gap-2" onClick={() => toast.success('简历导入功能开发中')}>
          <Upload className="h-4 w-4" />
          导入简历
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{totalCount}</div>
                <div className="text-xs text-slate-500">候选人总数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{favoritedCount}</div>
                <div className="text-xs text-slate-500">已收藏</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Filter className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{sourceBreakdown['Boss直聘'] || 0}</div>
                <div className="text-xs text-slate-500">Boss直聘</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-50">
                <Filter className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{sourceBreakdown['猎头'] || 0}</div>
                <div className="text-xs text-slate-500">猎头推荐</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索姓名..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="来源" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部来源</SelectItem>
                {SOURCE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="筛选技能..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 候选人表格 */}
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>性别</TableHead>
                <TableHead>电话</TableHead>
                <TableHead>学历</TableHead>
                <TableHead>工作年限</TableHead>
                <TableHead>技能</TableHead>
                <TableHead>期望薪资</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-slate-400 py-8">
                    暂无候选人数据
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="text-sm font-medium">{c.name}</div>
                    </TableCell>
                    <TableCell className="text-sm">{c.gender}</TableCell>
                    <TableCell className="text-sm font-mono">{c.phone}</TableCell>
                    <TableCell className="text-sm">{c.parsedResume.education}</TableCell>
                    <TableCell className="text-sm">{c.parsedResume.workYears}年</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {c.parsedResume.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.parsedResume.expectedSalary}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${sourceColor[c.source]}`}>
                        {c.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/hr/candidates/${c.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          查看详情
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(c.id)}
                          className={favorites.has(c.id) ? 'text-rose-500' : 'text-slate-400'}
                        >
                          <Heart className={`h-3.5 w-3.5 ${favorites.has(c.id) ? 'fill-rose-500' : ''}`} />
                        </Button>
                      </div>
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
