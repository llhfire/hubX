import { useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  Space,
  Typography,
  List,
  Select,
  Tag,
} from '@arco-design/web-react';
import { IconAt, IconSend } from '@arco-design/web-react/icon';
import type { Comment, WorkItemActions, WorkItemType } from '../types';
import { getEmployeeName } from '../mockData';
import { initialEmployees } from '../../employee/mockData';

const { Text, Paragraph } = Typography;

interface CommentSectionProps {
  workItemId: string;
  workItemType: WorkItemType;
  comments: Comment[];
  workItems: WorkItemActions;
  listOnly?: boolean;
  inputOnly?: boolean;
}

export function CommentSection({
  workItemId,
  workItemType,
  comments,
  workItems,
  listOnly,
  inputOnly,
}: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    workItems.addComment(workItemId, workItemType, '1', content, selectedMentions);
    setContent('');
    setSelectedMentions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={8}>
      {/* 评论列表 */}
      {!inputOnly && (
        <List
          dataSource={comments}
          render={(comment: Comment, index: number) => (
            <List.Item
              key={comment.id}
              style={{
                padding: '12px 0',
                borderBottom: index < comments.length - 1 ? '1px solid var(--color-neutral-3)' : 'none',
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size={4}>
                <Space>
                  <Avatar size={28} style={{ backgroundColor: '#165dff' }}>
                    {getEmployeeName(comment.authorId)[0]}
                  </Avatar>
                  <Text style={{ fontWeight: 500, fontSize: 13 }}>{getEmployeeName(comment.authorId)}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{comment.createdAt}</Text>
                </Space>
                <Paragraph style={{ marginLeft: 36, marginBottom: 0, fontSize: 13 }}>
                  {comment.content}
                </Paragraph>
              </Space>
            </List.Item>
          )}
          noDataElement={<Text type="secondary" style={{ fontSize: 13 }}>暂无评论</Text>}
        />
      )}

      {/* 评论输入框 */}
      {!listOnly && (
        <Space direction="vertical" style={{ width: '100%' }} size={6}>
          {selectedMentions.length > 0 && (
            <Space size={4}>
              {selectedMentions.map(id => (
                <Tag
                  key={id}
                  size="small"
                  closable
                  onClose={() => setSelectedMentions(prev => prev.filter(m => m !== id))}
                >
                  @{getEmployeeName(id)}
                </Tag>
              ))}
            </Space>
          )}
          <Input.TextArea
            placeholder="输入评论... (Ctrl+Enter 发送)"
            value={content}
            onChange={setContent}
            onKeyDown={handleKeyDown}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button
              size="small"
              icon={<IconAt />}
              onClick={() => setShowMentions(!showMentions)}
            >
              @
            </Button>
            <Button type="primary" size="small" icon={<IconSend />} onClick={handleSubmit}>
              发送
            </Button>
          </Space>
          {showMentions && (
            <Select
              placeholder="选择要 @的人"
              mode="multiple"
              value={selectedMentions}
              onChange={setSelectedMentions}
              onBlur={() => setShowMentions(false)}
              style={{ width: '100%' }}
              showSearch
            >
              {initialEmployees.map(emp => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.position})
                </Select.Option>
              ))}
            </Select>
          )}
        </Space>
      )}
    </Space>
  );
}
