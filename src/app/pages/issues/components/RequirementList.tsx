import { useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Menu,
  Select,
  Space,
  Table,
  Tag,
  Input,
  Typography,
} from '@arco-design/web-react';
import { IconPlus, IconSearch, IconMoreVertical } from '@arco-design/web-react/icon';
import { Requirement, WorkItemFilter } from '../types';
import { getEmployeeName } from '../mockData';
import { WorkItemDetailDrawer } from './WorkItemDetailDrawer';
import { WorkItemFormModal } from './WorkItemFormModal';

const { Text } = Typography;

const STATUS_COLOR_MAP: Record<string, string> = {
  '待处理': 'arcoblue',
  '进行中': 'orange',
  '已完成': 'green',
  '已搁置': 'gray',
};

const PRIORITY_COLOR_MAP: Record<string, string> = {
  '高': 'red',
  '中': 'orange',
  '低': 'blue',
};

interface RequirementListProps {
  items: Requirement[];
  workItems: any;
  projectId: string;
}

export function RequirementList({ items, workItems, projectId }: RequirementListProps) {
  const [filter, setFilter] = useState<WorkItemFilter>({
    keyword: '',
    status: [],
    priority: [],
    assigneeId: [],
    creatorId: [],
  });
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(
    () => workItems.filterItems(items, filter),
    [items, filter, workItems]
  );

  const columns = [
    {
      title: '编号',
      dataIndex: 'projectNo',
      width: 100,
      fixed: 'left' as const,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (title: string, item: Requirement) => (
        <Button
          type="text"
          size="small"
          style={{ padding: 0, fontWeight: 500 }}
          onClick={() => setSelectedId(item.id)}
        >
          {title}
        </Button>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={STATUS_COLOR_MAP[status]}>{status}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (p: string) => (
        <Tag color={PRIORITY_COLOR_MAP[p]}>{p}</Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assigneeId',
      width: 100,
      render: (id: string) => getEmployeeName(id),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={12}>
      {/* 操作栏 */}
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Input
            prefix={<IconSearch />}
            placeholder="搜索标题或描述..."
            value={filter.keyword}
            onChange={kw => setFilter(prev => ({ ...prev, keyword: kw }))}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder="状态"
            mode="multiple"
            value={filter.status}
            onChange={status => setFilter(prev => ({ ...prev, status }))}
            style={{ width: 160 }}
          >
            <Select.Option value="待处理">待处理</Select.Option>
            <Select.Option value="进行中">进行中</Select.Option>
            <Select.Option value="已完成">已完成</Select.Option>
            <Select.Option value="已搁置">已搁置</Select.Option>
          </Select>
          <Select
            placeholder="优先级"
            mode="multiple"
            value={filter.priority}
            onChange={priority => setFilter(prev => ({ ...prev, priority }))}
            style={{ width: 140 }}
          >
            <Select.Option value="高">高</Select.Option>
            <Select.Option value="中">中</Select.Option>
            <Select.Option value="低">低</Select.Option>
          </Select>
        </Space>
        <Space>
          <Button type="primary" icon={<IconPlus />} onClick={() => setFormVisible(true)}>
            新建需求
          </Button>
        </Space>
      </Space>

      {/* 列表 */}
      <Table
        columns={columns}
        data={filtered}
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: true }}
        scroll={{ x: 800 }}
      />

      {/* 详情弹窗 */}
      {selectedId && (
        <WorkItemDetailDrawer
          workItemId={selectedId}
          workItemType="requirement"
          workItems={workItems}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* 创建表单 */}
      {formVisible && (
        <WorkItemFormModal
          type="requirement"
          projectId={projectId}
          workItems={workItems}
          onClose={() => setFormVisible(false)}
        />
      )}
    </Space>
  );
}
