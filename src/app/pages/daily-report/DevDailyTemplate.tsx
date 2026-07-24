import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { DevReportContent, ProjectTask, WorkKind, WORK_KIND_LABELS, WORK_KIND_ABILITY_MAP } from './types';

interface Props {
  content: DevReportContent;
  onChange: (content: DevReportContent) => void;
}

const ALL_WORK_KINDS = Object.keys(WORK_KIND_LABELS) as WorkKind[];

export function DevDailyTemplate({ content, onChange }: Props) {
  const tasks: ProjectTask[] = content['project-tasks'] || [];

  const updateField = (field: keyof DevReportContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const updateTasks = (newTasks: ProjectTask[]) => {
    updateField('project-tasks', newTasks);
  };

  const addTask = () => {
    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      projectName: '',
      workKind: 'dev-coding',
      description: '',
      hours: 0,
    };
    updateTasks([...tasks, newTask]);
  };

  const removeTask = (id: string) => {
    updateTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, field: keyof ProjectTask, value: any) => {
    updateTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const totalHours = tasks.reduce((s, t) => s + (t.hours || 0), 0);

  return (
    <div className="flex flex-col gap-4">
      {/* 主要工种 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">今日主要工种</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select
            value={content['work-kind'] || 'dev-coding'}
            onValueChange={(v) => updateField('work-kind', v as WorkKind)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_WORK_KINDS.map(k => (
                <SelectItem key={k} value={k}>
                  {WORK_KIND_LABELS[k]}
                  <Badge variant="outline" className="ml-2 text-[10px]">
                    {WORK_KIND_ABILITY_MAP[k].dimension} +{WORK_KIND_ABILITY_MAP[k].xpPer8h}/8h
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-muted-foreground">
            工种将映射到能力维度，自动累积经验值（每 8 小时）
          </p>
        </CardContent>
      </Card>

      {/* 项目任务 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>项目任务</span>
            <Badge variant="secondary">总工时 {totalHours}h</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">项目名称</TableHead>
                <TableHead className="w-[140px]">工种</TableHead>
                <TableHead>工作描述</TableHead>
                <TableHead className="w-[80px]">工时(h)</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    暂无任务
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Input
                        placeholder="项目名"
                        value={task.projectName}
                        onChange={(e) => updateTask(task.id, 'projectName', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.workKind}
                        onValueChange={(v) => updateTask(task.id, 'workKind', v as WorkKind)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_WORK_KINDS.map(k => (
                            <SelectItem key={k} value={k}>{WORK_KIND_LABELS[k]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="做了什么"
                        value={task.description}
                        onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={24}
                        step={0.5}
                        value={task.hours}
                        onChange={(e) => updateTask(task.id, 'hours', parseFloat(e.target.value) || 0)}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Button variant="outline" size="sm" className="mt-3" onClick={addTask}>
            <Plus className="h-4 w-4 mr-1" />
            添加任务
          </Button>
        </CardContent>
      </Card>

      {/* 代码进展 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">代码进展</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="今日代码层面的进展（提交、PR、功能完成等）"
            value={content['code-progress'] || ''}
            onChange={(e) => updateField('code-progress', e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* 遇到的问题 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">遇到的问题</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="遇到的问题或阻塞项"
            value={content['problems-encountered'] || ''}
            onChange={(e) => updateField('problems-encountered', e.target.value)}
            rows={2}
          />
        </CardContent>
      </Card>

      {/* 明日计划 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">明日工作计划</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="请输入明日工作计划（必填）"
            value={content['tomorrow-plan'] || ''}
            onChange={(e) => updateField('tomorrow-plan', e.target.value)}
            rows={2}
          />
        </CardContent>
      </Card>
    </div>
  );
}
