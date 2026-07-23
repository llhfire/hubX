import { useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Input,
  Space,
  Tabs,
  Tag,
  Typography,
  Select,
} from '@arco-design/web-react';
import {
  IconEdit,
  IconLink,
  IconMore,
  IconCopy,
  IconExpand,
  IconStar,
  IconThumbUp,
  IconClose,
} from '@arco-design/web-react/icon';
import type { Defect, Requirement, Task, WorkItemActions, WorkItemType } from '../types';
import {
  STATUS_COLOR_MAP,
  PRIORITY_COLOR_MAP,
  SEVERITY_COLOR_MAP,
  STATUS_OPTIONS,
  TYPE_LABEL_MAP,
  TYPE_BADGE_COLOR,
  SPACING,
} from '../constants';
import { getEmployeeName } from '../mockData';
import { CommentSection } from './CommentSection';

const { Title, Text, Paragraph } = Typography;
const TabPane = Tabs.TabPane;

// ── 优先级配置 ────────────────────────────────────────────────
const PRIORITY_PILL: Record<string, { bg: string; color: string }> = {
  '高': { bg: '#fff1f0', color: '#f53f3f' },
  '中': { bg: '#e8f5e9', color: '#00b42a' },
  '低': { bg: '#f5f5f5', color: '#86909c' },
};

// ── 状态配置 ──────────────────────────────────────────────────
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

interface WorkItemDetailDrawerProps {
  workItemId: string;
  workItemType: WorkItemType;
  workItems: WorkItemActions;
  onClose: () => void;
}

export function WorkItemDetailDrawer({
  workItemId,
  workItemType,
  workItems,
  onClose,
}: WorkItemDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('detail');

  const item = useMemo(() => {
    if (workItemType === 'requirement') {
      return workItems.requirements.find((r: Requirement) => r.id === workItemId);
    } else if (workItemType === 'task') {
      return workItems.tasks.find((t: Task) => t.id === workItemId);
    } else {
      return workItems.defects.find((d: Defect) => d.id === workItemId);
    }
  }, [workItemId, workItemType, workItems.requirements, workItems.tasks, workItems.defects]);

  if (!item) return null;

  const comments = workItems.getComments(workItemId);
  const activityLogs = workItems.getActivityLogs(workItemId);
  const links = workItems.getLinks(workItemId);
  const statusOptions = STATUS_OPTIONS[workItemType];

  const handleStatusChange = (newStatus: string) => {
    if (workItemType === 'requirement') {
      workItems.updateRequirementStatus(workItemId, newStatus as Requirement['status'], '1');
    } else if (workItemType === 'task') {
      workItems.updateTaskStatus(workItemId, newStatus as Task['status'], '1');
    } else {
      workItems.updateDefectStatus(workItemId, newStatus as Defect['status'], '1');
    }
  };

  const statusPill = STATUS_PILL[item.status] || STATUS_PILL['待处理'];
  const priorityPill = PRIORITY_PILL[item.priority] || PRIORITY_PILL['中'];

  return (
    <Drawer
      width={900}
      visible={true}
      onCancel={onClose}
      footer={null}
      closable={false}
      style={{ padding: 0 }}
      className="tapid-detail-drawer"
      header={
        <div style={{
          display: 'none',
          margin: 0,
          padding: 0,
          minHeight: 0,
        }}>
          {/* 隐藏默认头部 */}
        </div>
      }
    >
      {/* 自定义头部 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${SPACING.md}px ${SPACING.lg}px`,
        borderBottom: '1px solid #e5e6eb',
        background: '#fafafa',
      }}>
        <Space size={SPACING.md}>
          <Select
            value={item.status}
            onChange={handleStatusChange}
            style={{ width: 100 }}
            size="small"
            bordered={false}
            dropdownStyle={{ minWidth: 120 }}
          >
            {statusOptions.map(s => (
              <Select.Option key={s} value={s}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: STATUS_PILL[s]?.bg || '#f5f5f5',
                  color: STATUS_PILL[s]?.color || '#86909c',
                  fontSize: 12,
                }}>
                  {s}
                </span>
              </Select.Option>
            ))}
          </Select>
          <Text style={{ color: '#86909c' }}>ID: {item.projectNo}</Text>
        </Space>
        <Space size={SPACING.sm}>
          <Button type="text" size="small" icon={<IconExpand />} />
          <Button type="text" size="small" icon={<IconThumbUp />} />
          <Button type="text" size="small" icon={<IconLink />} />
          <Button type="text" size="small" icon={<IconMore />} />
          <Button type="text" size="small" icon={<IconCopy />} />
          <Button type="text" size="small" icon={<IconClose />} onClick={onClose} />
        </Space>
      </div>

      {/* 标题区域 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.sm,
        padding: `${SPACING.md}px ${SPACING.lg}px`,
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px 6px',
          borderRadius: 4,
          background: TYPE_BADGE_COLOR[workItemType],
          color: '#fff',
          fontSize: 10,
          fontWeight: 600,
          lineHeight: 1,
        }}>
          {TYPE_LABEL_MAP[workItemType].slice(0, 2)}
        </span>
        <Text style={{ fontSize: 16, fontWeight: 600 }}>{item.title}</Text>
        <Space size={4}>
          <Button type="text" size="small" icon={<IconCopy />} style={{ color: '#86909c' }} />
          <Button type="text" size="small" icon={<IconStar />} style={{ color: '#86909c' }} />
          <Button type="text" size="small" icon={<IconLink />} style={{ color: '#86909c' }} />
        </Space>
      </div>

      {/* Tab 导航 */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        style={{ padding: `0 ${SPACING.lg}px` }}
        size="small"
      >
        <TabPane key="detail" title="详细信息" />
        <TabPane key="sub" title={`子需求 (${0})`} />
        <TabPane key="bugs" title={`缺陷 (${0})`} />
        <TabPane key="history" title={`变更历史 (${activityLogs.length})`} />
        <TabPane key="more" title="更多" />
      </Tabs>

      {/* 主内容区域 - 占据所有可用空间，可滚动 */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* 左侧内容区 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: `${SPACING.lg}px`,
          borderRight: '1px solid #e5e6eb',
          paddingBottom: 80, /* 为底部评论框留出空间 */
        }}>
          {/* 编辑按钮 */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: SPACING.md,
          }}>
            <Space>
              <Button type="text" size="small" icon={<IconEdit />}>编辑</Button>
              <Button type="text" size="small" icon={<IconExpand />} />
            </Space>
          </div>

          {/* 描述内容 */}
          <div
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: item.description }}
            style={{
              lineHeight: 1.8,
              color: '#1d2129',
            }}
          />

          {/* 验收标准（需求） */}
          {workItemType === 'requirement' && (item as Requirement).acceptanceCriteria && (
            <div style={{ marginTop: SPACING.xl }}>
              <Title heading={6} style={{ marginBottom: SPACING.sm }}>验收标准</Title>
              <Paragraph style={{ whiteSpace: 'pre-wrap', color: '#4e5969' }}>
                {(item as Requirement).acceptanceCriteria}
              </Paragraph>
            </div>
          )}

          {/* 复现步骤（缺陷） */}
          {workItemType === 'defect' && (item as Defect).reproductionSteps && (
            <div style={{ marginTop: SPACING.xl }}>
              <Title heading={6} style={{ marginBottom: SPACING.sm }}>复现步骤</Title>
              <Paragraph style={{ whiteSpace: 'pre-wrap', color: '#4e5969' }}>
                {(item as Defect).reproductionSteps}
              </Paragraph>
            </div>
          )}

          {/* 检查清单（任务） */}
          {workItemType === 'task' && (item as Task).checklist.length > 0 && (
            <div style={{ marginTop: SPACING.xl }}>
              <Title heading={6} style={{ marginBottom: SPACING.sm }}>检查清单</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                {(item as Task).checklist.map((c) => (
                  <label
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: SPACING.sm,
                      cursor: 'pointer',
                      padding: `${SPACING.xs}px 0`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={c.done}
                      onChange={() => {
                        const updated = (item as Task).checklist.map((x) =>
                          x.id === c.id ? { ...x, done: !x.done } : x
                        );
                        workItems.updateTask(workItemId, { checklist: updated }, '1');
                      }}
                      style={{ width: 16, height: 16 }}
                    />
                    <Text style={{
                      textDecoration: c.done ? 'line-through' : 'none',
                      color: c.done ? '#86909c' : '#1d2129',
                    }}>
                      {c.text}
                    </Text>
                  </label>
                ))}
              </Space>
            </div>
          )}

          {/* 关联 */}
          {(item.contractId || links.length > 0) && (
            <div style={{ marginTop: SPACING.xl }}>
              <Title heading={6} style={{ marginBottom: SPACING.sm }}>关联</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                {item.contractId && (
                  <Text type="secondary">关联合同：{item.contractId}</Text>
                )}
                {links.length > 0 && (
                  <Space wrap>
                    {links.map((l) => {
                      const linkedId = l.sourceId === workItemId ? l.targetId : l.sourceId;
                      const linkedItem = workItems.allWorkItems.find(w => w.id === linkedId);
                      return (
                        <Tag key={l.id} style={{ borderRadius: 4 }}>
                          {linkedItem?.projectNo || linkedId}
                        </Tag>
                      );
                    })}
                  </Space>
                )}
              </Space>
            </div>
          )}

          {/* 评论列表 */}
          <div style={{ marginTop: SPACING.xl }}>
            <Title heading={6} style={{ marginBottom: SPACING.sm }}>评论 ({comments.length})</Title>
            <CommentSection
              workItemId={workItemId}
              workItemType={workItemType}
              comments={comments}
              workItems={workItems}
              listOnly
            />
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div style={{
          width: 280,
          overflowY: 'auto',
          padding: `${SPACING.lg}px`,
          background: '#fafafa',
          flexShrink: 0,
        }}>
          <Title heading={6} style={{ marginBottom: SPACING.md, color: '#86909c' }}>基础信息</Title>

          <Space direction="vertical" style={{ width: '100%' }} size={SPACING.md}>
            {/* 状态 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space size={SPACING.xs}>
                <span style={{ color: '#86909c', fontSize: 13 }}>状态</span>
              </Space>
              <span style={{
                padding: '2px 10px',
                borderRadius: 10,
                background: statusPill.bg,
                color: statusPill.color,
                fontSize: 12,
                fontWeight: 500,
              }}>
                {item.status}
              </span>
            </div>

            {/* 父需求（任务和缺陷） */}
            {(workItemType === 'task' || workItemType === 'defect') && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#86909c', fontSize: 13 }}>父需求</span>
                <Text style={{ fontSize: 13 }}>
                  {(workItemType === 'task' ? (item as Task).requirementId : (item as Defect).requirementId) || '-'}
                </Text>
              </div>
            )}

            {/* 创建模板 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>创建模板</span>
              <Text style={{ fontSize: 13 }}>工作项模板</Text>
            </div>

            {/* 分类 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>分类</span>
              <Text style={{ fontSize: 13 }}>未分类</Text>
            </div>

            {/* 优先级 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>优先级</span>
              <span style={{
                padding: '2px 10px',
                borderRadius: 10,
                background: priorityPill.bg,
                color: priorityPill.color,
                fontSize: 12,
                fontWeight: 500,
              }}>
                {item.priority}
              </span>
            </div>

            {/* 严重程度（缺陷） */}
            {workItemType === 'defect' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#86909c', fontSize: 13 }}>严重程度</span>
                <Text style={{ fontSize: 13 }}>{(item as Defect).severity}</Text>
              </div>
            )}

            {/* 处理人 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>处理人</span>
              <Space size={SPACING.xs}>
                <Avatar size={18} style={{ backgroundColor: '#165dff', fontSize: 10 }}>
                  {getEmployeeName(item.assigneeId)[0]}
                </Avatar>
                <Text style={{ fontSize: 13 }}>{getEmployeeName(item.assigneeId)}</Text>
              </Space>
            </div>

            {/* 预计开始 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>预计开始</span>
              <Text style={{ fontSize: 13 }}>{item.createdAt?.split(' ')[0] || '-'}</Text>
            </div>

            {/* 预计结束 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>预计结束</span>
              <Text style={{ fontSize: 13 }}>{(item as Task).dueDate || '-'}</Text>
            </div>

            {/* 创建人 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>创建人</span>
              <Space size={SPACING.xs}>
                <Avatar size={18} style={{ backgroundColor: '#00b42a', fontSize: 10 }}>
                  {getEmployeeName(item.creatorId)[0]}
                </Avatar>
                <Text style={{ fontSize: 13 }}>{getEmployeeName(item.creatorId)}</Text>
              </Space>
            </div>

            {/* 创建时间 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#86909c', fontSize: 13 }}>创建时间</span>
              <Text style={{ fontSize: 13 }}>{item.createdAt}</Text>
            </div>

            {/* 完成时间 */}
            {item.status === '已完成' || item.status === '已关闭' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#86909c', fontSize: 13 }}>完成时间</span>
                <Text style={{ fontSize: 13 }}>{item.updatedAt}</Text>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#86909c', fontSize: 13 }}>完成时间</span>
                <Text style={{ fontSize: 13, color: '#c9cdd4' }}>-</Text>
              </div>
            )}

            {/* 工时（任务） */}
            {workItemType === 'task' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#86909c', fontSize: 13 }}>工时</span>
                <Text style={{ fontSize: 13 }}>
                  {(item as Task).actualHours || 0}/{(item as Task).estimatedHours || 0}h
                </Text>
              </div>
            )}
          </Space>
        </div>
      </div>

      {/* 底部评论输入框 - 固定在底部 */}
      <div style={{
        borderTop: '1px solid #e5e6eb',
        padding: `${SPACING.md}px ${SPACING.lg}px`,
        background: '#fff',
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
      }}>
        <CommentSection
          workItemId={workItemId}
          workItemType={workItemType}
          comments={comments}
          workItems={workItems}
          inputOnly
        />
      </div>
    </Drawer>
  );
}
