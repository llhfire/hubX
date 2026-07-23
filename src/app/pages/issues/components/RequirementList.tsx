import type { Requirement, WorkItemActions } from '../types';
import { STATUS_OPTIONS } from '../constants';
import { WorkItemList, type WorkItemColumn, type FilterConfig } from './WorkItemList';

const columns: WorkItemColumn<Requirement>[] = [
  { title: '编号', dataIndex: 'projectNo', width: 100, fixed: 'left' },
  { title: '标题', dataIndex: 'title' },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '优先级', dataIndex: 'priority', width: 80 },
  { title: '负责人', dataIndex: 'assigneeId', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', width: 120 },
];

const filterConfig: FilterConfig = {
  statusOptions: STATUS_OPTIONS.requirement,
};

interface RequirementListProps {
  items: Requirement[];
  workItems: WorkItemActions;
  projectId: string;
}

export function RequirementList({ items, workItems, projectId }: RequirementListProps) {
  return (
    <WorkItemList
      type="requirement"
      items={items}
      workItems={workItems}
      projectId={projectId}
      columns={columns}
      filterConfig={filterConfig}
      createLabel="新建需求"
    />
  );
}
