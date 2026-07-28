import { useState } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { Switch } from '@/app/components/ui/switch'
import { Separator } from '@/app/components/ui/separator'
import { ContractRiskDemo } from './demo/ContractRiskDemo'
import { ProjectBreakdownDemo } from './demo/ProjectBreakdownDemo'
import { AssignTaskDemo } from './demo/AssignTaskDemo'
import { AgentLogViewer } from './demo/AgentLogViewer'
import {
  Sparkles,
  Terminal,
  Shield,
  FileText,
  GitBranch,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react'

export function AIDriven() {
  const [activeTab, setActiveTab] = useState('contract-risk')
  const [logViewerOpen, setLogViewerOpen] = useState(false)
  const [isDesensitized, setIsDesensitized] = useState(false)

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI 驱动演示</h1>
            <p className="text-sm text-slate-500">体验 Agent 静默异步处理 + 跨域 Context 穿透 + 混合 UI 渲染</p>
          </div>
        </div>

        {/* Demo 控制器 */}
        <div className="flex items-center gap-4">
          {/* 角色切换 */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border">
            {isDesensitized ? (
              <EyeOff className="h-4 w-4 text-amber-500" />
            ) : (
              <Eye className="h-4 w-4 text-green-500" />
            )}
            <span className="text-xs text-slate-600">
              {isDesensitized ? '销售视角（脱敏）' : '总监视角（完整）'}
            </span>
            <Switch
              checked={isDesensitized}
              onCheckedChange={setIsDesensitized}
              className="scale-75"
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Agent 日志 */}
          <Button
            variant={logViewerOpen ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
            onClick={() => setLogViewerOpen(!logViewerOpen)}
          >
            <Terminal className="h-4 w-4" />
            Agent 日志
          </Button>
        </div>
      </div>

      {/* 技术说明条 */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="py-3">
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-500" />
              <span><strong>Topic 边界：</strong>Agent 仅在授权域内操作</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span><strong>静默异步：</strong>提交即返回，Agent 后台处理</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5 text-blue-500" />
              <span><strong>Context 穿透：</strong>跨域数据自动关联分析</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 演示场景 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="contract-risk" className="gap-1.5">
                <FileText className="h-4 w-4" />
                合同风险审查
              </TabsTrigger>
              <TabsTrigger value="project-breakdown" className="gap-1.5">
                <GitBranch className="h-4 w-4" />
                合同→项目拆解
              </TabsTrigger>
              <TabsTrigger value="assign-task" className="gap-1.5">
                <Users className="h-4 w-4" />
                派工 RPG 穿透
              </TabsTrigger>
            </TabsList>

            {/* 场景 A */}
            <TabsContent value="contract-risk">
              <div className="mb-4">
                <Badge variant="outline" className="text-xs mr-2">Inline 增强</Badge>
                <span className="text-sm text-slate-500">
                  销售提交合同后，Agent 静默穿透客户历史、财务记录、团队负载，在表单字段旁 Inline 高亮风险提示。
                </span>
              </div>
              <ContractRiskDemo />
            </TabsContent>

            {/* 场景 B */}
            <TabsContent value="project-breakdown">
              <div className="mb-4">
                <Badge variant="outline" className="text-xs mr-2">Drawer + 拖拽</Badge>
                <span className="text-sm text-slate-500">
                  合同审批通过后，Agent 在后台自动拆解 WBS 任务链，PM 可在右侧抽屉中拖拽调整工时和负责人。
                </span>
              </div>
              <ProjectBreakdownDemo />
            </TabsContent>

            {/* 场景 C */}
            <TabsContent value="assign-task">
              <div className="mb-4">
                <Badge variant="outline" className="text-xs mr-2">跨域穿透</Badge>
                <span className="text-sm text-slate-500">
                  指派任务时，Agent 穿透员工 RPG 能力模型和工时负载，智能推荐最匹配的工程师。
                </span>
              </div>
              <AssignTaskDemo />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Agent 日志查看器 */}
      <AgentLogViewer
        open={logViewerOpen}
        onOpenChange={setLogViewerOpen}
      />
    </div>
  )
}
