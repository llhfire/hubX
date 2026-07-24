// src/app/pages/daily-report/GeneralDailyTemplate.tsx

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { ProjectTask, GeneralReportContent } from './types';

interface Props {
  initialContent?: GeneralReportContent;
  onChange: (content: GeneralReportContent) => void;
}

function getGeneralTemplateState(initialContent?: GeneralReportContent) {
  return {
    projectTasks: initialContent?.['project-tasks'] || [],
    todaySummary: initialContent?.['today-summary'] || '',
    problemsEncountered: initialContent?.['problems-encountered'] || '',
    tomorrowPlan: initialContent?.['tomorrow-plan'] || '',
  };
}

export function GeneralDailyTemplate({ initialContent, onChange }: Props) {
  const initialState = getGeneralTemplateState(initialContent);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>(initialState.projectTasks);
  const [todaySummary, setTodaySummary] = useState(initialState.todaySummary);
  const [problemsEncountered, setProblemsEncountered] = useState(initialState.problemsEncountered);
  const [tomorrowPlan, setTomorrowPlan] = useState(initialState.tomorrowPlan);

  // 同步外部初始内容/新会话数据
  useEffect(() => {
    const nextState = getGeneralTemplateState(initialContent);
    setProjectTasks(nextState.projectTasks);
    setTodaySummary(nextState.todaySummary);
    setProblemsEncountered(nextState.problemsEncountered);
    setTomorrowPlan(nextState.tomorrowPlan);
  }, [initialContent]);

  // 更新内容 - 使用 debounce 避免频繁触发
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      onChange({
        'project-tasks': projectTasks,
        'today-summary': todaySummary,
        'problems-encountered': problemsEncountered,
        'tomorrow-plan': tomorrowPlan,
      });
    }, 100);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [projectTasks, todaySummary, problemsEncountered, tomorrowPlan, onChange]);

  // 添加项目任务行
  const addProjectTask = () => {
    setProjectTasks([
      ...projectTasks,
      { id: `task-${Date.now()}`, projectName: '', taskForm: '', hours: 0 },
    ]);
  };

  // 删除项目任务行
  const removeProjectTask = (index: number) => {
    setProjectTasks(projectTasks.filter((_, i) => i !== index));
  };

  // 更新项目任务
  const updateProjectTask = (index: number, field: keyof ProjectTask, value: string | number) => {
    const newTasks = [...projectTasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setProjectTasks(newTasks);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 项目任务 */}
      <div>
        <p className="font-semibold mb-2">项目任务</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">项目名称</TableHead>
              <TableHead className="w-[120px]">任务形式</TableHead>
              <TableHead className="w-[100px]">用时（小时）</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Button variant="outline" onClick={addProjectTask}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加项目任务
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              projectTasks.map((task, index) => (
                <TableRow key={task.id || index}>
                  <TableCell>
                    <Input
                      value={task.projectName || ''}
                      onChange={(e) => updateProjectTask(index, 'projectName', e.target.value)}
                      placeholder="请输入项目名称"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={task.taskForm || ''}
                      onChange={(e) => updateProjectTask(index, 'taskForm', e.target.value)}
                      placeholder="如：需求沟通"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={task.hours || 0}
                      onChange={(e) => updateProjectTask(index, 'hours', parseFloat(e.target.value) || 0)}
                      min={0}
                      placeholder="0"
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeProjectTask(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {projectTasks.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addProjectTask}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            添加一行
          </Button>
        )}
      </div>

      {/* 今日总结 */}
      <div>
        <p className="font-semibold mb-2">今日总结</p>
        <Textarea
          value={todaySummary}
          onChange={(e) => setTodaySummary(e.target.value)}
          placeholder="请输入今日工作总结..."
          rows={3}
        />
      </div>

      {/* 遇到的问题 */}
      <div>
        <p className="font-semibold mb-2">遇到的问题</p>
        <Textarea
          value={problemsEncountered}
          onChange={(e) => setProblemsEncountered(e.target.value)}
          placeholder="请输入遇到的问题..."
          rows={3}
        />
      </div>

      {/* 明日工作计划 */}
      <div>
        <p className="font-semibold mb-2">
          明日工作计划 <span className="text-red-500">*</span>
        </p>
        <Textarea
          value={tomorrowPlan}
          onChange={(e) => setTomorrowPlan(e.target.value)}
          placeholder="请输入明日工作计划（必填）..."
          rows={3}
        />
      </div>
    </div>
  );
}
