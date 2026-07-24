import { Badge } from '../../../components/ui/badge';
import type { Defect, WorkItemActions } from '../types';
import { STATUS_OPTIONS, SEVERITY_OPTIONS, SEVERITY_COLOR_MAP } from '../constants';
import { getEmployeeName } from '../mockData';
import { WorkItemList, type WorkItemColumn, type FilterConfig } from './WorkItemList';

// Map Arco color names to Badge variants and Tailwind classes
const SEVERITY_BADGE_MAP: Record<string, { variant?: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  'red': { variant: 'destructive' },
  'orange': { variant: 'outline', className: 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  'blue': { variant: 'default' },
  'gray': { variant: 'secondary' },
};

const columns: WorkItemColumn<Defect>[] = [
  { title: '编号', dataIndex: 'projectNo', width: 100, fixed: 'left' },
  { title: '标题', dataIndex: 'title' },
  { title: '状态', dataIndex: 'status', width: 100 },
  {
    title: '严重程度',
    dataIndex: 'severity',
    width: 100,
    render: (s: string) => {
      const color = SEVERITY_COLOR_MAP[s as keyof typeof SEVERITY_COLOR_MAP];
      const badgeStyle = SEVERITY_BADGE_MAP[color] || { variant: 'secondary' };
      return <Badge variant={badgeStyle.variant} className={badgeStyle.className}>{s}</Badge>;
    },
  },
  { title: '优先级', dataIndex: 'priority', width: 80 },
  {
    title: '修复人',
    dataIndex: 'assigneeId',
    width: 100,
    render: (id: string) => getEmployeeName(id),
  },
  {
    title: '发现人',
    dataIndex: 'creatorId',
    width: 100,
    render: (id: string) => getEmployeeName(id),
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 120,
    render: (d: string) => d || '-',
  },
];

const filterConfig: FilterConfig = {
  statusOptions: STATUS_OPTIONS.defect,
  extraFilters: [
    {
      key: 'severity',
      placeholder: '严重程度',
      options: [...SEVERITY_OPTIONS],
    },
  ],
};

interface DefectListProps {
  items: Defect[];
  workItems: WorkItemActions;
  projectId: string;
}

export function DefectList({ items, workItems, projectId }: DefectListProps) {
  return (
    <WorkItemList
      type="defect"
      items={items}
      workItems={workItems}
      projectId={projectId}
      columns={columns}
      filterConfig={filterConfig}
      createLabel="新建缺陷"
      scrollX={900}
    />
  );
}
