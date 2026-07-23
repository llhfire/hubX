import { Progress, Typography } from '@arco-design/web-react';
import type { Task, WorkItemActions } from '../types';
import { STATUS_OPTIONS } from '../constants';
import { WorkItemList, type WorkItemColumn, type FilterConfig } from './WorkItemList';

const { Text } = Typography;

const columns: WorkItemColumn<Task>[] = [
  { title: '编号', dataIndex: 'projectNo', width: 100, fixed: 'left' },
  { title: '标题', dataIndex: 'title' },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '优先级', dataIndex: 'priority', width: 80 },
  { title: '负责人', dataIndex: 'assigneeId', width: 100 },
  {
    title: '进度',
    width: 120,
    render: (_: any, item: Task) => {
      const total = item.checklist.length;
      const done = item.checklist.filter(c => c.done).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return total > 0 ? (
        <Progress percent={pct} size="small" />
      ) : (
        <Text type="secondary">-</Text>
      );
    },
  },
  {
    title: '工时',
    width: 100,
    render: (_: any, item: Task) => (
      <Text>{item.actualHours || 0}/{item.estimatedHours || 0}h</Text>
    ),
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 120,
    render: (d: string) => d || '-',
  },
];

const filterConfig: FilterConfig = {
  statusOptions: STATUS_OPTIONS.task,
};

interface TaskListProps {
  items: Task[];
  workItems: WorkItemActions;
  projectId: string;
}

export function TaskList({ items, workItems, projectId }: TaskListProps) {
  return (
    <WorkItemList
      type="task"
      items={items}
      workItems={workItems}
      projectId={projectId}
      columns={columns}
      filterConfig={filterConfig}
      createLabel="新建任务"
      scrollX={900}
    />
  );
}
