import { useMemo, useState } from 'react';
import {
  Button,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from '@arco-design/web-react';
import { IconPlus, IconSearch } from '@arco-design/web-react/icon';
import { Defect, WorkItemFilter } from '../types';
import { getEmployeeName } from '../mockData';
import { WorkItemDetailDrawer } from './WorkItemDetailDrawer';
import { WorkItemFormModal } from './WorkItemFormModal';

const { Text } = Typography;

const STATUS_COLOR_MAP: Record<string, string> = {
  '待处理': 'arcoblue',
  '处理中': 'orange',
  '待验证': 'purple',
  '已关闭': 'green',
  '已拒绝': 'gray',
  '已重开': 'red',
};

const SEVERITY_COLOR_MAP: Record<string, string> = {
  '致命': 'red',
  '严重': 'orange',
  '一般': 'blue',
  '轻微': 'gray',
};

const PRIORITY_COLOR_MAP: Record<string, string> = {
  '高': 'red',
  '中': 'orange',
  '低': 'blue',
};

interface DefectListProps {
  items: Defect[];
  workItems: any;
  projectId: string;
}

export function DefectList({ items, workItems, projectId }: DefectListProps) {
  const [filter, setFilter] = useState<WorkItemFilter>({
    keyword: '',
    status: [],
    priority: [],
    assigneeId: [],
    creatorId: [],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);

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
      render: (title: string, item: Defect) => (
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
      title: '严重程度',
      dataIndex: 'severity',
      width: 100,
      render: (s: string) => (
        <Tag color={SEVERITY_COLOR_MAP[s]}>{s}</Tag>
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
            <Select.Option value="处理中">处理中</Select.Option>
            <Select.Option value="待验证">待验证</Select.Option>
            <Select.Option value="已关闭">已关闭</Select.Option>
            <Select.Option value="已拒绝">已拒绝</Select.Option>
            <Select.Option value="已重开">已重开</Select.Option>
          </Select>
          <Select
            placeholder="严重程度"
            mode="multiple"
            value={filter.priority}
            onChange={priority => setFilter(prev => ({ ...prev, priority }))}
            style={{ width: 140 }}
          >
            <Select.Option value="致命">致命</Select.Option>
            <Select.Option value="严重">严重</Select.Option>
            <Select.Option value="一般">一般</Select.Option>
            <Select.Option value="轻微">轻微</Select.Option>
          </Select>
        </Space>
        <Button type="primary" icon={<IconPlus />} onClick={() => setFormVisible(true)}>
          新建缺陷
        </Button>
      </Space>

      {/* 列表 */}
      <Table
        columns={columns}
        data={filtered}
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: true }}
        scroll={{ x: 900 }}
      />

      {/* 详情弹窗 */}
      {selectedId && (
        <WorkItemDetailDrawer
          workItemId={selectedId}
          workItemType="defect"
          workItems={workItems}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* 创建表单 */}
      {formVisible && (
        <WorkItemFormModal
          type="defect"
          projectId={projectId}
          workItems={workItems}
          onClose={() => setFormVisible(false)}
        />
      )}
    </Space>
  );
}
