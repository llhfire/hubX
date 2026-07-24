// src/app/pages/daily-report/DailyReportDetail.tsx

import { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { DailyReport, DailyReportComment, SalesReportContent, GeneralReportContent, LeadTrackingItem } from './types';

interface Props {
  visible: boolean;
  onCancel: () => void;
  report: DailyReport | null;
  comments: DailyReportComment[];
  onAddComment: (reportId: string, content: string, mentionedUsers: string[]) => void;
  currentUserId: string;
}

export function DailyReportDetail({ visible, onCancel, report, comments, onAddComment, currentUserId }: Props) {
  const [commentText, setCommentText] = useState('');

  if (!report) return null;

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    const mentionedUsers = extractMentionedUsers(commentText);
    onAddComment(report.id, commentText, mentionedUsers);
    setCommentText('');
  };

  const extractMentionedUsers = (text: string): string[] => {
    const regex = /@(\S+)/g;
    const matches = text.match(regex);
    if (!matches) return [];
    return matches.map(m => m.substring(1));
  };

  const getLevelVariant = (level: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      S: 'destructive',
      A: 'default',
      B: 'secondary',
      C: 'outline',
    };
    return variants[level] || 'outline';
  };

  const renderSalesContent = (content: SalesReportContent) => (
    <div className="flex flex-col gap-4">
      {content['lead-tracking'] && content['lead-tracking'].length > 0 && (
        <div>
          <p className="font-semibold text-base mb-2">线索跟进情况</p>
          {content['lead-tracking'].map((item: LeadTrackingItem) => (
            <Card key={item.leadId} className="mb-2">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getLevelVariant(item.level)}>{item.level}</Badge>
                  <span className="font-semibold">{item.leadName}</span>
                </div>
                {item.statusChanges.length > 0 && (
                  <div className="mt-1">
                    <span className="text-muted-foreground text-sm">状态变更：</span>
                    <span className="text-sm">{item.statusChanges.join(', ')}</span>
                  </div>
                )}
                {item.followRecords.length > 0 && (
                  <div className="mt-1">
                    <span className="text-muted-foreground text-sm">跟进记录：</span>
                    {item.followRecords.map((record, i) => (
                      <div key={i} className="ml-2 text-sm">{record}</div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {content['assistance-needed'] && (
        <div>
          <p className="font-semibold text-base mb-2">需协助事项</p>
          <div className="p-3 bg-muted rounded-md">
            {content['assistance-needed']}
          </div>
        </div>
      )}
      {content['tomorrow-plan'] && (
        <div>
          <p className="font-semibold text-base mb-2">明日工作计划</p>
          <div className="p-3 bg-muted rounded-md">
            {content['tomorrow-plan']}
          </div>
        </div>
      )}
    </div>
  );

  const renderGeneralContent = (content: GeneralReportContent) => (
    <div className="flex flex-col gap-4">
      {content['project-tasks'] && content['project-tasks'].length > 0 && (
        <div>
          <p className="font-semibold text-base mb-2">项目任务</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>项目名称</TableHead>
                <TableHead>任务形式</TableHead>
                <TableHead>用时（小时）</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content['project-tasks'].map((task: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{task.projectName}</TableCell>
                  <TableCell>{task.taskForm}</TableCell>
                  <TableCell>{task.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {content['today-summary'] && (
        <div>
          <p className="font-semibold text-base mb-2">今日总结</p>
          <div className="p-3 bg-muted rounded-md">
            {content['today-summary']}
          </div>
        </div>
      )}
      {content['problems-encountered'] && (
        <div>
          <p className="font-semibold text-base mb-2">遇到的问题</p>
          <div className="p-3 bg-muted rounded-md">
            {content['problems-encountered']}
          </div>
        </div>
      )}
      {content['tomorrow-plan'] && (
        <div>
          <p className="font-semibold text-base mb-2">明日工作计划</p>
          <div className="p-3 bg-muted rounded-md">
            {content['tomorrow-plan']}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (report.templateType === 'sales') {
      return renderSalesContent(report.content as SalesReportContent);
    } else {
      return renderGeneralContent(report.content as GeneralReportContent);
    }
  };

  const reportComments = comments.filter(c => c.reportId === report.id);

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>日报详情</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div><span className="text-muted-foreground">日报日期：</span>{report.reportDate}</div>
          <div><span className="text-muted-foreground">汇报人：</span>{report.userName}</div>
          <div><span className="text-muted-foreground">部门：</span>{report.department}</div>
          <div><span className="text-muted-foreground">模板类型：</span>{report.templateType === 'sales' ? '销售日报' : '通用日报'}</div>
        </div>

        <div className="mb-6">{renderContent()}</div>

        {/* 评论区域 */}
        <div className="border-t pt-4">
          <p className="font-semibold text-base mb-3">
            评论 ({reportComments.length})
          </p>

          {reportComments.length > 0 && (
            <div className="mb-4">
              {reportComments.map((comment) => (
                <Card key={comment.id} className="mb-2">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{comment.userName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">{comment.userName}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="添加评论... (可使用 @用户名 来提及他人)"
              className="flex-1"
              rows={2}
            />
            <Button onClick={handleSubmitComment}>
              发送
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
