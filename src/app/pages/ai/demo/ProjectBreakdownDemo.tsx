import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { AgentContextDrawer, useAgentPipeline } from '@/app/components/agent'
import { CONTRACT_ANALYSIS, type WBSTask } from '@/app/components/agent/mockData'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  GitBranch,
  Send,
  RotateCcw,
  GripVertical,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'

const ITEM_TYPE = 'wbs-task'

interface DraggableTaskProps {
  task: WBSTask
  index: number
  onHoursChange: (id: string, hours: number) => void
  moveTask: (dragIndex: number, hoverIndex: number) => void
}

function DraggableTask({ task, index, onHoursChange, moveTask }: DraggableTaskProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveTask(item.index, index)
        item.index = index
      }
    },
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm transition-all cursor-move ${
        isDragging ? 'opacity-50 shadow-md scale-[1.02]' : 'hover:shadow-md'
      }`}
    >
      <GripVertical className="h-4 w-4 text-slate-300 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">TSK-{String(index + 1).padStart(3, '0')}</span>
          <span className="text-sm font-medium text-slate-700 truncate">{task.title}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <User className="h-3 w-3" />
            <span>{task.assignee}</span>
            <span className="text-slate-300">·</span>
            <span>{task.assigneeLevel}</span>
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            匹配 {task.skillMatch}%
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Clock className="h-3.5 w-3.5 text-slate-400" />
        <Input
          type="number"
          value={task.hours}
          onChange={(e) => onHoursChange(task.id, Number(e.target.value))}
          className="w-16 h-7 text-xs text-center"
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text-xs text-slate-400">h</span>
      </div>
    </div>
  )
}

export function ProjectBreakdownDemo() {
  const { status, result, submitAction, reset } = useAgentPipeline(CONTRACT_ANALYSIS, 2500)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tasks, setTasks] = useState<WBSTask[]>([])

  const handleSubmit = () => {
    submitAction()
    // 分析完成后自动打开抽屉
    setTimeout(() => {
      setTasks([...CONTRACT_ANALYSIS.suggestedWBS])
      setDrawerOpen(true)
    }, 2700)
  }

  const handleReset = () => {
    setDrawerOpen(false)
    setTasks([])
    reset()
  }

  const handleHoursChange = useCallback((id: string, hours: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, hours } : t)))
  }, [])

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks((prev) => {
      const updated = [...prev]
      const [removed] = updated.splice(dragIndex, 1)
      updated.splice(hoverIndex, 0, removed)
      return updated
    })
  }, [])

  const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0)

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">场景 B</Badge>
          <span className="text-sm text-slate-500">合同到项目的静默拆解</span>
        </div>
        <div className="flex gap-2">
          {status === 'idle' ? (
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              审批通过，生成项目
            </Button>
          ) : (
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          )}
          {status === 'completed' && (
            <Button variant="secondary" onClick={() => setDrawerOpen(true)} className="gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              打开 Agent 洞察
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 项目信息 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              项目排期
              {status === 'completed' && (
                <Badge className="bg-green-100 text-green-700 border-green-200 gap-1" variant="outline">
                  <CheckCircle2 className="h-3 w-3" />
                  Agent 已自动拆解
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'idle' && (
              <div className="text-center py-16 text-slate-400">
                <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">点击"审批通过，生成项目"按钮</p>
                <p className="text-xs mt-1">Agent 将在后台静默结合同类项目历史 WBS 数据，自动拆解交付计划</p>
              </div>
            )}

            {status === 'submitting' && (
              <div className="text-center py-16">
                <Badge variant="secondary">合同审批已通过</Badge>
              </div>
            )}

            {status === 'analyzing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-sm text-indigo-700">Agent 正在穿透同类项目历史数据，自动拆解 WBS...</span>
                </div>
              </motion.div>
            )}

            {status === 'completed' && tasks.length > 0 && (
              <DndProvider backend={HTML5Backend}>
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      index={index}
                      onHoursChange={handleHoursChange}
                      moveTask={moveTask}
                    />
                  ))}
                </div>
              </DndProvider>
            )}
          </CardContent>
        </Card>

        {/* 统计面板 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              工时统计
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'completed' && tasks.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{tasks.length}</div>
                    <div className="text-xs text-blue-500">任务数</div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-700">{totalHours}</div>
                    <div className="text-xs text-indigo-500">总工时</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-slate-500">工时分布</h4>
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-24 truncate">{task.title}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(task.hours / totalHours) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{task.hours}h</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-xs">等待 Agent 完成分析</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent 洞察抽屉 */}
      <AgentContextDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="项目拆解洞察"
        description="基于同类项目历史 WBS 的智能拆解"
        riskLevel={result?.riskLevel ?? null}
        contextSummary={result?.contextSummary}
        isAnalyzing={status === 'analyzing'}
      >
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">自动拆解的 WBS 任务链</h4>
          <p className="text-xs text-slate-400">拖拽可调整顺序，点击工时可修改</p>

          <DndProvider backend={HTML5Backend}>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  index={index}
                  onHoursChange={handleHoursChange}
                  moveTask={moveTask}
                />
              ))}
            </div>
          </DndProvider>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-slate-500">总工时</span>
            <span className="text-lg font-bold text-indigo-600">{totalHours}h</span>
          </div>
        </div>
      </AgentContextDrawer>
    </div>
  )
}
