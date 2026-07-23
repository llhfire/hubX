import { useMemo, useState, useCallback } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Menu,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconMore,
  IconEdit,
  IconSettings,
  IconFilter,
  IconApps,
  IconEye,
  IconClose,
  IconStar,
} from '@arco-design/web-react/icon';
import type { WorkItem, WorkItemActions, WorkItemFilter, WorkItemType } from '../types';
import {
  STATUS_COLOR_MAP,
  PRIORITY_COLOR_MAP,
  SEVERITY_COLOR_MAP,
  TYPE_LABEL_MAP,
  STATUS_OPTIONS,
  SPACING,
} from '../constants';
import { getEmployeeName } from '../mockData';
import { WorkItemDetailDrawer } from './WorkItemDetailDrawer';
import { WorkItemFormModal } from './WorkItemFormModal';

const { Text } = Typography;

// ── 类型徽章颜色 ──────────────────────────────────────────────
const TYPE_BADGE_COLOR: Record<WorkItemType, string> = {
  requirement: '#165dff',
  task: '#00b42a',
  defect: '#f53f3f',
};

// ── 优先级配置（药丸样式） ────────────────────────────────────
const PRIORITY_PILL: Record<string, { bg: string; color: string }> = {
  '高': { bg: '#fff1f0', color: '#f53f3f' },
  '中': { bg: '#e8f5e9', color: '#00b42a' },
  '低': { bg: '#f5f5f5', color: '#86909c' },
};

// ── 状态配置（药丸样式） ──────────────────────────────────────
const STATUS_PILL: Record<string, { bg: string; color: string }> = {
  '待处理': { bg: '#fff7e6', color: '#ff7d00' },
  '进行中': { bg: '#e6f7ff', color: '#165dff' },
  '已完成': { bg: '#f6ffed', color: '#00b42a' },
  '已搁置': { bg: '#f5f5f5', color: '#86909c' },
  '已阻塞': { bg: '#fff1f0', color: '#f53f3f' },
  '处理中': { bg: '#fff7e6', color: '#ff7d00' },
  '待验证': { bg: '#f9f0ff', color: '#722ed1' },
  '已关闭': { bg: '#f6ffed', color: '#00b42a' },
  '已拒绝': { bg: '#f5f5f5', color: '#86909c' },
  '已重开': { bg: '#fff1f0', color: '#f53f3f' },
};

// ── 列配置类型 ────────────────────────────────────────────────
export interface WorkItemColumn<T extends WorkItem> {
  title: string;
  dataIndex?: string;
  width?: number;
  fixed?: 'left' | 'right';
  render?: (value: any, item: T) => React.ReactNode;
}

// ── 筛选器配置类型 ────────────────────────────────────────────
export interface FilterConfig {
  statusOptions: string[];
  extraFilters?: Array<{
    key: string;
    placeholder: string;
    options: string[];
    colorMap?: Record<string, string>;
  }>;
}

// ── 组件 Props ────────────────────────────────────────────────
interface WorkItemListProps<T extends WorkItem> {
  type: WorkItemType;
  items: T[];
  workItems: WorkItemActions;
  projectId: string;
  columns: WorkItemColumn<T>[];
  filterConfig: FilterConfig;
  createLabel: string;
  scrollX?: number;
}

export function WorkItemList<T extends WorkItem>({
  type,
  items,
  workItems,
  projectId,
  columns,
  filterConfig,
  createLabel,
  scrollX = 1000,
}: WorkItemListProps<T>) {
  const [filter, setFilter] = useState<WorkItemFilter>(() => ({
    keyword: '',
    status: [],
    priority: [],
    assigneeId: [],
    creatorId: [],
    ...Object.fromEntries(
      (filterConfig.extraFilters || []).map(ef => [ef.key, []])
    ),
  }));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const filtered = useMemo(
    () => workItems.filterItems(items, filter),
    [items, filter, workItems]
  );

  // ── 构建表格列 ──────────────────────────────────────────
  const tableColumns = useMemo(() => {
    const cols: any[] = [
      // 复选框列
      {
        title: '',
        dataIndex: 'checkbox',
        width: 40,
        fixed: 'left' as const,
        render: (_: any, item: T) => (
          <Checkbox
            checked={selectedRowKeys.includes(item.id)}
            onChange={(checked) => {
              setSelectedRowKeys(prev =>
                checked
                  ? [...prev, item.id]
                  : prev.filter(id => id !== item.id)
              );
            }}
          />
        ),
      },
      // ID 列
      {
        title: 'ID',
        dataIndex: 'projectNo',
        width: 100,
        fixed: 'left' as const,
        render: (projectNo: string) => (
          <Text style={{ color: '#165dff', fontSize: 13 }}>{projectNo}</Text>
        ),
      },
      // 标题列（带类型徽章）
      {
        title: (
          <Space>
            <span>标题</span>
            <Text type="secondary" style={{ fontSize: 12 }}>({filtered.length})</Text>
          </Space>
        ),
        dataIndex: 'title',
        render: (title: string, item: T) => (
          <Space size={8}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px 6px',
                borderRadius: 4,
                background: TYPE_BADGE_COLOR[type],
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {TYPE_LABEL_MAP[type].slice(0, 2)}
            </span>
            <Button
              type="text"
              size="small"
              style={{ padding: 0, fontWeight: 500, color: '#1d2129' }}
              onClick={() => setSelectedId(item.id)}
            >
              {title}
            </Button>
          </Space>
        ),
      },
    ];

    // 根据类型添加其他列
    if (type === 'defect') {
      cols.push({
        title: '严重程度',
        dataIndex: 'severity',
        width: 100,
        render: (s: string) => {
          const pill = SEVERITY_COLOR_MAP[s] === 'red'
            ? { bg: '#fff1f0', color: '#f53f3f' }
            : SEVERITY_COLOR_MAP[s] === 'orange'
              ? { bg: '#fff7e6', color: '#ff7d00' }
              : { bg: '#f5f5f5', color: '#86909c' };
          return (
            <span style={{
              padding: '2px 8px',
              borderRadius: 10,
              background: pill.bg,
              color: pill.color,
              fontSize: 12,
            }}>
              {s}
            </span>
          );
        },
      });
    }

    // 优先级列
    cols.push({
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (p: string) => {
        const pill = PRIORITY_PILL[p] || PRIORITY_PILL['中'];
        return (
          <span style={{
            padding: '2px 10px',
            borderRadius: 10,
            background: pill.bg,
            color: pill.color,
            fontSize: 12,
            fontWeight: 500,
          }}>
            {p}
          </span>
        );
      },
    });

    // 状态列
    cols.push({
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const pill = STATUS_PILL[status] || STATUS_PILL['待处理'];
        return (
          <span style={{
            padding: '2px 10px',
            borderRadius: 10,
            background: pill.bg,
            color: pill.color,
            fontSize: 12,
            fontWeight: 500,
          }}>
            {status}
          </span>
        );
      },
    });

    // 处理人列
    cols.push({
      title: '处理人',
      dataIndex: 'assigneeId',
      width: 120,
      render: (id: string) => (
        <Space size={6}>
          <Avatar size={20} style={{ backgroundColor: '#165dff', fontSize: 11 }}>
            {getEmployeeName(id)[0]}
          </Avatar>
          <Text style={{ fontSize: 13 }}>{getEmployeeName(id)}</Text>
        </Space>
      ),
    });

    // 任务特有列
    if (type === 'task') {
      cols.push({
        title: '预计开始',
        dataIndex: 'createdAt',
        width: 110,
        render: (d: string) => (
          <Text type="secondary" style={{ fontSize: 13 }}>{d?.split(' ')[0] || '-'}</Text>
        ),
      });
      cols.push({
        title: '预计结束',
        dataIndex: 'dueDate',
        width: 110,
        render: (d: string) => (
          <Text type="secondary" style={{ fontSize: 13 }}>{d || '-'}</Text>
        ),
      });
    }

    // 缺陷特有列
    if (type === 'defect') {
      cols.push({
        title: '预计开始',
        dataIndex: 'createdAt',
        width: 110,
        render: (d: string) => (
          <Text type="secondary" style={{ fontSize: 13 }}>{d?.split(' ')[0] || '-'}</Text>
        ),
      });
      cols.push({
        title: '预计结束',
        dataIndex: 'dueDate',
        width: 110,
        render: (d: string) => (
          <Text type="secondary" style={{ fontSize: 13 }}>{d || '-'}</Text>
        ),
      });
    }

    return cols;
  }, [type, filtered.length, selectedRowKeys]);

  return (
    <div>
      {/* 工具栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        padding: `${SPACING.sm}px 0`,
      }}>
        <Space size={SPACING.sm}>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => setFormVisible(true)}
            style={{ borderRadius: 6 }}
          >
            {createLabel}
          </Button>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="batch">批量编辑</Menu.Item>
                <Menu.Item key="export">导出</Menu.Item>
                <Menu.Item key="import">导入</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<IconMore />}>更多操作</Button>
          </Dropdown>
        </Space>
        <Space size={SPACING.lg}>
          <Button type="text" icon={<IconEye />}>视图：所有</Button>
          <Button type="text" icon={<IconApps />}>分组：无分组</Button>
          <Button type="text" icon={<IconFilter />}>过滤</Button>
          <Text type="secondary">共 {filtered.length} 个</Text>
          <Button type="text" icon={<IconSettings />}>设置</Button>
        </Space>
      </div>

      {/* 搜索和筛选栏 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
        padding: `${SPACING.sm}px ${SPACING.md}px`,
        background: '#fafafa',
        borderRadius: 6,
      }}>
        <Input
          prefix={<IconSearch />}
          placeholder="搜索标题或描述..."
          value={filter.keyword}
          onChange={kw => setFilter(prev => ({ ...prev, keyword: kw }))}
          style={{ width: 240 }}
          allowClear
          variant="borderless"
        />
        <Select
          placeholder="状态"
          mode="multiple"
          value={filter.status}
          onChange={status => setFilter(prev => ({ ...prev, status }))}
          style={{ minWidth: 120 }}
          variant="borderless"
          maxTagCount={1}
        >
          {filterConfig.statusOptions.map(s => (
            <Select.Option key={s} value={s}>{s}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="优先级"
          mode="multiple"
          value={filter.priority}
          onChange={priority => setFilter(prev => ({ ...prev, priority }))}
          style={{ minWidth: 100 }}
          variant="borderless"
          maxTagCount={1}
        >
          <Select.Option value="高">高</Select.Option>
          <Select.Option value="中">中</Select.Option>
          <Select.Option value="低">低</Select.Option>
        </Select>
        {filterConfig.extraFilters?.map(ef => (
          <Select
            key={ef.key}
            placeholder={ef.placeholder}
            mode="multiple"
            value={filter[ef.key as keyof WorkItemFilter] as string[] || []}
            onChange={val => setFilter(prev => ({ ...prev, [ef.key]: val }))}
            style={{ minWidth: 100 }}
            variant="borderless"
            maxTagCount={1}
          >
            {ef.options.map(opt => (
              <Select.Option key={opt} value={opt}>{opt}</Select.Option>
            ))}
          </Select>
        ))}
      </div>

      {/* 表格 */}
      <Table
        columns={tableColumns}
        data={filtered}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showTotal: true,
          showJumper: true,
          size: 'small',
        }}
        scroll={{ x: scrollX }}
        border={false}
        stripe={false}
        noDataElement={
          <div style={{ padding: 40, color: '#86909c' }}>
            <div style={{ fontSize: 14 }}>暂无数据</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>点击上方按钮创建{TYPE_LABEL_MAP[type]}</div>
          </div>
        }
        style={{ borderRadius: 8 }}
      />

      {/* 详情弹窗 */}
      {selectedId && (
        <WorkItemDetailDrawer
          workItemId={selectedId}
          workItemType={type}
          workItems={workItems}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* 创建表单 */}
      {formVisible && (
        <WorkItemFormModal
          type={type}
          projectId={projectId}
          workItems={workItems}
          onClose={() => setFormVisible(false)}
        />
      )}
    </div>
  );
}
