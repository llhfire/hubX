import { useMemo, useState } from 'react';
import {
  Descriptions,
  Divider,
  Drawer,
  Space,
  Tabs,
  Tag,
  Timeline,
  Typography,
  Select,
} from '@arco-design/web-react';
import { Defect, Requirement, Task, WorkItemType } from '../types';
import { getEmployeeName } from '../mockData';
import { CommentSection } from './CommentSection';

const { Title, Text, Paragraph } = Typography;
const TabPane = Tabs.TabPane;

const STATUS_COLOR_MAP: Record<string, string> = {
  '待处理': 'arcoblue',
  '进行中': 'orange',
  '已完成': 'green',
  '已搁置': 'gray',
  '已阻塞': 'red',
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

interface WorkItemDetailDrawerProps {
  workItemId: string;
  workItemType: WorkItemType;
  workItems: any;
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

  const statusOptions = workItemType === 'requirement'
    ? ['待处理', '进行中', '已完成', '已搁置']
    : workItemType === 'task'
      ? ['待处理', '进行中', '已完成', '已阻塞']
      : ['待处理', '处理中', '待验证', '已关闭', '已拒绝', '已重开'];

  const handleStatusChange = (newStatus: string) => {
    if (workItemType === 'requirement') {
      workItems.updateRequirementStatus(workItemId, newStatus as any, '1');
    } else if (workItemType === 'task') {
      workItems.updateTaskStatus(workItemId, newStatus as any, '1');
    } else {
      workItems.updateDefectStatus(workItemId, newStatus as any, '1');
    }
  };

  return (
    <Drawer
      width={640}
      title={
        <Space>
          <Tag>{item.projectNo}</Tag>
          <Text style={{ fontSize: 16, fontWeight: 600 }}>{item.title}</Text>
        </Space>
      }
      visible={true}
      onCancel={onClose}
      footer={null}
      closable={true}
    >
      <Tabs activeTab={activeTab} onChange={setActiveTab} style={{ height: '100%' }}>
        {/* ── 详情 + 评论 Tab ── */}
        <TabPane key="detail" title="详情" style={{ height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            {/* 可滚动区域 */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* 核心字段 */}
                <Descriptions
                  column={2}
                  data={[
                    { label: '状态', value: (
                      <Select
                        value={item.status}
                        onChange={handleStatusChange}
                        style={{ width: 120 }}
                      >
                        {statusOptions.map(s => (
                          <Select.Option key={s} value={s}>
                            <Tag color={STATUS_COLOR_MAP[s]}>{s}</Tag>
                          </Select.Option>
                        ))}
                      </Select>
                    )},
                    { label: '优先级', value: <Tag color={PRIORITY_COLOR_MAP[item.priority]}>{item.priority}</Tag> },
                    ...(workItemType === 'defect' ? [{
                      label: '严重程度',
                      value: <Tag color={SEVERITY_COLOR_MAP[(item as Defect).severity]}>{(item as Defect).severity}</Tag>
                    }] : []),
                    { label: '负责人', value: getEmployeeName(item.assigneeId) },
                    { label: '创建人', value: getEmployeeName(item.creatorId) },
                    ...(workItemType === 'task' ? [
                      { label: '预计工时', value: `${(item as Task).estimatedHours || 0}h` },
                      { label: '实际工时', value: `${(item as Task).actualHours || 0}h` },
                    ] : []),
                    { label: '创建时间', value: item.createdAt },
                    { label: '更新时间', value: item.updatedAt },
                  ]}
                />

                <Divider />

                {/* 描述 */}
                <div>
                  <Title heading={6}>描述</Title>
                  <div
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    style={{ padding: '8px 0', lineHeight: 1.8 }}
                  />
                </div>

                {/* 验收标准（需求） */}
                {workItemType === 'requirement' && (item as Requirement).acceptanceCriteria && (
                  <div>
                    <Title heading={6}>验收标准</Title>
                    <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                      {(item as Requirement).acceptanceCriteria}
                    </Paragraph>
                  </div>
                )}

                {/* 复现步骤（缺陷） */}
                {workItemType === 'defect' && (item as Defect).reproductionSteps && (
                  <div>
                    <Title heading={6}>复现步骤</Title>
                    <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                      {(item as Defect).reproductionSteps}
                    </Paragraph>
                  </div>
                )}

                {/* 检查清单（任务） */}
                {workItemType === 'task' && (item as Task).checklist.length > 0 && (
                  <div>
                    <Title heading={6}>检查清单</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {(item as Task).checklist.map((c: any) => (
                        <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={c.done}
                            onChange={() => {
                              const updated = (item as Task).checklist.map((x: any) =>
                                x.id === c.id ? { ...x, done: !x.done } : x
                              );
                              workItems.updateTask(workItemId, { checklist: updated }, '1');
                            }}
                          />
                          <Text style={{ textDecoration: c.done ? 'line-through' : 'none', color: c.done ? '#86909c' : undefined }}>
                            {c.text}
                          </Text>
                        </label>
                      ))}
                    </Space>
                  </div>
                )}

                {/* 关联 */}
                <div>
                  <Title heading={6}>关联</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {item.contractId && (
                      <Text type="secondary">关联合同：{item.contractId}</Text>
                    )}
                    {links.length > 0 && (
                      <Text type="secondary">
                        关联工作项：{links.map((l: any) => {
                          const linkedId = l.sourceId === workItemId ? l.targetId : l.sourceId;
                          return <Tag key={l.id} style={{ marginLeft: 4 }}>{linkedId}</Tag>;
                        })}
                      </Text>
                    )}
                  </Space>
                </div>

                {/* 评论列表 */}
                <div>
                  <Title heading={6}>评论 ({comments.length})</Title>
                  <CommentSection
                    workItemId={workItemId}
                    workItemType={workItemType}
                    comments={comments}
                    workItems={workItems}
                    listOnly
                  />
                </div>
              </Space>
            </div>

            {/* 底部固定评论输入框 */}
            <div style={{ borderTop: '1px solid var(--color-neutral-3)', paddingTop: 12, marginTop: 12, background: 'var(--color-bg-2)' }}>
              <CommentSection
                workItemId={workItemId}
                workItemType={workItemType}
                comments={comments}
                workItems={workItems}
                inputOnly
              />
            </div>
          </div>
        </TabPane>

        {/* ── 操作历史 Tab ── */}
        <TabPane key="history" title="操作历史">
          <Timeline>
            {activityLogs.map((log: any) => (
              <Timeline.Item key={log.id}>
                <Space>
                  <Text type="secondary">{log.actorId ? getEmployeeName(log.actorId) : '系统'}</Text>
                  <Text>{getActionLabel(log)}</Text>
                  <Text type="secondary">{log.createdAt}</Text>
                </Space>
                {log.remark && <Text type="secondary" style={{ marginLeft: 8 }}>备注: {log.remark}</Text>}
              </Timeline.Item>
            ))}
            {activityLogs.length === 0 && <Text type="secondary">暂无操作记录</Text>}
          </Timeline>
        </TabPane>
      </Tabs>
    </Drawer>
  );
}

function getActionLabel(log: any): string {
  switch (log.action) {
    case 'create': return '创建了工作项';
    case 'status_change': return `将 ${log.field} 从 "${log.oldValue}" 改为 "${log.newValue}"`;
    case 'edit': return `编辑了工作项`;
    case 'assign': return `将负责人从 "${log.oldValue}" 改为 "${log.newValue}"`;
    case 'comment': return '添加了评论';
    default: return log.action;
  }
}
