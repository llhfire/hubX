import { Tag } from '@arco-design/web-react';
import type { Defect, WorkItemActions } from '../types';
import { STATUS_OPTIONS, SEVERITY_OPTIONS, SEVERITY_COLOR_MAP } from '../constants';
import { getEmployeeName } from '../mockData';
import { WorkItemList, type WorkItemColumn, type FilterConfig } from './WorkItemList';

const columns: WorkItemColumn<Defect>[] = [
  { title: '编号', dataIndex: 'projectNo', width: 100, fixed: 'left' },
  { title: '标题', dataIndex: 'title' },
  { title: '状态', dataIndex: 'status', width: 100 },
  {
    title: '严重程度',
    dataIndex: 'severity',
    width: 100,
    render: (s: string) => (
      <Tag color={SEVERITY_COLOR_MAP[s as keyof typeof SEVERITY_COLOR_MAP]}>{s}</Tag>
    ),
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
