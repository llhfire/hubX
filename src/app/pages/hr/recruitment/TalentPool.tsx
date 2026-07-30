import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Heart, Search, Eye, Users, Star } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { CANDIDATES } from '../mockData'
import type { ResumeSource } from '../types'

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '全部来源' },
  { value: 'Boss直聘', label: 'Boss直聘' },
  { value: '猎聘', label: '猎聘' },
  { value: '拉勾', label: '拉勾' },
  { value: '内部推荐', label: '内部推荐' },
  { value: '主动投递', label: '主动投递' },
  { value: '猎头', label: '猎头' },
  { value: '其他', label: '其他' },
]

const WORK_YEARS_OPTIONS = [
  { value: '0', label: '不限' },
  { value: '1', label: '1年以上' },
  { value: '2', label: '2年以上' },
  { value: '3', label: '3年以上' },
  { value: '5', label: '5年以上' },
  { value: '8', label: '8年以上' },
]

const EDUCATION_OPTIONS = [
  { value: 'all', label: '不限学历' },
  { value: '大专', label: '大专' },
  { value: '本科', label: '本科' },
  { value: '硕士', label: '硕士' },
  { value: '博士', label: '博士' },
]

const SOURCE_BADGE_COLORS: Record<string, string> = {
  Boss直聘: 'bg-blue-100 text-blue-700',
  猎聘: 'bg-purple-100 text-purple-700',
  拉勾: 'bg-orange-100 text-orange-700',
  内部推荐: 'bg-green-100 text-green-700',
  主动投递: 'bg-gray-100 text-gray-700',
  猎头: 'bg-red-100 text-red-700',
  其他: 'bg-slate-100 text-slate-700',
}

const EDUCATION_ORDER: Record<string, number> = {
  大专: 1,
  本科: 2,
  硕士: 3,
  博士: 4,
}

export function TalentPool() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState(CANDIDATES)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [minWorkYears, setMinWorkYears] = useState('0')
  const [educationFilter, setEducationFilter] = useState('all')

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (search && !c.name.includes(search)) return false
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false
      if (c.parsedResume.workYears < Number(minWorkYears)) return false
      if (
        educationFilter !== 'all' &&
        (EDUCATION_ORDER[c.parsedResume.education] ?? 0) <
          (EDUCATION_ORDER[educationFilter] ?? 0)
      )
        return false
      return true
    })
  }, [candidates, search, sourceFilter, minWorkYears, educationFilter])

  const totalCount = candidates.length
  const favoritedCount = candidates.filter((c) => c.isFavorited).length

  const toggleFavorite = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorited: !c.isFavorited } : c)),
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">人才库</h1>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总人数</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已收藏</p>
              <p className="text-2xl font-bold">{favoritedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索与筛选 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索姓名..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="简历来源" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={minWorkYears} onValueChange={setMinWorkYears}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="工作年限" />
              </SelectTrigger>
              <SelectContent>
                {WORK_YEARS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={educationFilter} onValueChange={setEducationFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="学历要求" />
              </SelectTrigger>
              <SelectContent>
                {EDUCATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 候选人卡片列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">暂无符合条件的候选人</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((candidate) => {
            const { parsedResume } = candidate
            return (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="text-lg font-medium">
                        {candidate.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-base">{candidate.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${SOURCE_BADGE_COLORS[candidate.source] ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {candidate.source}
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>
                          {parsedResume.education} · {parsedResume.workYears}年经验
                        </p>
                        <p>
                          {parsedResume.lastCompany} · {parsedResume.lastPosition}
                        </p>
                        <p>
                          期望薪资:{' '}
                          <span className="text-foreground font-medium">
                            {parsedResume.expectedSalary}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {parsedResume.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant={candidate.isFavorited ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleFavorite(candidate.id)}
                        >
                          <Heart
                            className={`mr-1.5 h-3.5 w-3.5 ${candidate.isFavorited ? 'fill-current' : ''}`}
                          />
                          {candidate.isFavorited ? '已收藏' : '收藏'}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/hr/candidates/${candidate.id}`)}
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
