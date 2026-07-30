// 项目上下文摘要组件
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { RefreshCw, AlertCircle, Lightbulb, ListTodo, User, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { ProjectContext, ContextEntry } from '../types';

interface ProjectContextSummaryProps {
  context: ProjectContext;
}

interface SectionProps {
  title: string;
  icon: typeof RefreshCw;
  entries: ContextEntry[];
  emptyText?: string;
}

function ContextSection({ title, icon: Icon, entries, emptyText = '暂无' }: SectionProps) {
  if (entries.length === 0) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground/60 pl-5">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <Badge variant="outline" className="text-[10px] py-0 h-4">{entries.length}</Badge>
      </div>
      <div className="space-y-1 pl-5">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-1.5">
            {entry.status === '已确认' ? (
              <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <Clock className="h-3 w-3 text-orange-500 mt-0.5 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-xs leading-relaxed">{entry.content}</p>
              <span className="text-[10px] text-muted-foreground">{entry.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectContextSummary({ context }: ProjectContextSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">项目动态摘要</CardTitle>
          <span className="text-[10px] text-muted-foreground">
            更新于 {new Date(context.lastUpdatedAt).toLocaleString('zh-CN')}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 客户状态 */}
        <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md">
          <User className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <span className="text-xs font-medium text-blue-700">客户状态</span>
            <p className="text-xs text-blue-600 mt-0.5">{context.customerStatus}</p>
          </div>
        </div>

        {/* 风险项 */}
        {context.riskItems.length > 0 && (
          <div className="flex items-start gap-2 p-2 bg-red-50 rounded-md">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-medium text-red-700">风险项</span>
              <ul className="mt-0.5 space-y-0.5">
                {context.riskItems.map((risk, i) => (
                  <li key={i} className="text-xs text-red-600">• {risk}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Separator />

        <ContextSection title="需求变更" icon={RefreshCw} entries={context.requirementChanges} />
        <ContextSection title="已知问题" icon={AlertCircle} entries={context.knownIssues} />
        <ContextSection title="关键决策" icon={Lightbulb} entries={context.keyDecisions} />
        <ContextSection title="待办事项" icon={ListTodo} entries={context.todoItems} />
      </CardContent>
    </Card>
  );
}
