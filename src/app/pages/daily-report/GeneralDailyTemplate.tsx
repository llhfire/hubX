// src/app/pages/daily-report/GeneralDailyTemplate.tsx

import { useState, useEffect, useRef } from 'react';
import { Input, Button, Table, InputNumber } from '@arco-design/web-react';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';
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

  const taskColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 200,
      render: (_: string, __: ProjectTask, index: number) => (
        <Input
          value={projectTasks[index]?.projectName || ''}
          onChange={(v) => updateProjectTask(index, 'projectName', v)}
          placeholder="请输入项目名称"
        />
      ),
    },
    {
      title: '任务形式',
      dataIndex: 'taskForm',
      width: 120,
      render: (_: string, __: ProjectTask, index: number) => (
        <Input
          value={projectTasks[index]?.taskForm || ''}
          onChange={(v) => updateProjectTask(index, 'taskForm', v)}
          placeholder="如：需求沟通"
        />
      ),
    },
    {
      title: '用时（小时）',
      dataIndex: 'hours',
      width: 100,
      render: (_: number, __: ProjectTask, index: number) => (
        <InputNumber
          value={projectTasks[index]?.hours || 0}
          onChange={(v) => updateProjectTask(index, 'hours', v || 0)}
          min={0}
          placeholder="0"
        />
      ),
    },
    {
      title: '',
      width: 50,
      render: (_: any, __: any, index: number) => (
        <Button
          type="text"
          icon={<IconDelete />}
          onClick={() => removeProjectTask(index)}
          status="danger"
        />
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 项目任务 */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>项目任务</div>
        <Table
          columns={taskColumns}
          data={projectTasks}
          pagination={false}
          size="small"
          noDataElement={
            <div style={{ padding: 16 }}>
              <Button type="dashed" icon={<IconPlus />} onClick={addProjectTask}>
                添加项目任务
              </Button>
            </div>
          }
        />
        {projectTasks.length > 0 && (
          <Button
            type="dashed"
            icon={<IconPlus />}
            onClick={addProjectTask}
            style={{ marginTop: 8 }}
          >
            添加一行
          </Button>
        )}
      </div>

      {/* 今日总结 */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>今日总结</div>
        <Input.TextArea
          value={todaySummary}
          onChange={(value) => setTodaySummary(value)}
          placeholder="请输入今日工作总结..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </div>

      {/* 遇到的问题 */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>遇到的问题</div>
        <Input.TextArea
          value={problemsEncountered}
          onChange={(value) => setProblemsEncountered(value)}
          placeholder="请输入遇到的问题..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </div>

      {/* 明日工作计划 */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>
          明日工作计划 <span style={{ color: 'red' }}>*</span>
        </div>
        <Input.TextArea
          value={tomorrowPlan}
          onChange={(value) => setTomorrowPlan(value)}
          placeholder="请输入明日工作计划（必填）..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </div>
    </div>
  );
}
