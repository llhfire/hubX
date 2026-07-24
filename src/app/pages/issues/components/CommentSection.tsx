import { useState } from 'react';
import { AtSign, Send, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';
import type { Comment, WorkItemActions, WorkItemType } from '../types';
import { getEmployeeName } from '../mockData';
import { initialEmployees } from '../../employee/mockData';

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

  const toggleMention = (id: string) => {
    setSelectedMentions(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const removeMention = (id: string) => {
    setSelectedMentions(prev => prev.filter(m => m !== id));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 评论列表 */}
      {!inputOnly && (
        <div className="flex flex-col">
          {comments.length === 0 ? (
            <span className="text-sm text-muted-foreground">暂无评论</span>
          ) : (
            comments.map((comment, index) => (
              <div
                key={comment.id}
                className="py-3"
                style={{
                  borderBottom: index < comments.length - 1 ? '1px solid var(--color-neutral-3)' : 'none',
                }}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-[#165dff] text-white text-xs">
                        {getEmployeeName(comment.authorId)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium">{getEmployeeName(comment.authorId)}</span>
                    <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                  </div>
                  <p className="text-[13px] ml-9 mb-0">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 评论输入框 */}
      {!listOnly && (
        <div className="flex flex-col gap-1.5 w-full">
          {selectedMentions.length > 0 && (
            <div className="flex items-center gap-1">
              {selectedMentions.map(id => (
                <Badge key={id} variant="secondary" className="gap-1 pr-1">
                  @{getEmployeeName(id)}
                  <button
                    type="button"
                    className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    onClick={() => removeMention(id)}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Textarea
            placeholder="输入评论... (Ctrl+Enter 发送)"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[2.5rem] max-h-[6rem] resize-none"
          />
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMentions(!showMentions)}
            >
              <AtSign className="size-4" />
              @
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              <Send className="size-4" />
              发送
            </Button>
          </div>
          {showMentions && (
            <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
              {initialEmployees.map(emp => (
                <label
                  key={emp.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={selectedMentions.includes(emp.id)}
                    onCheckedChange={() => toggleMention(emp.id)}
                  />
                  {emp.name} ({emp.position})
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
