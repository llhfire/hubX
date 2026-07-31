// ============================================================
// HubX 确认书生成器组件
// 根据项目阶段自动生成确认书
// ============================================================

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { FileText, Download, Send, CheckCircle } from 'lucide-react';
import type { ConfirmDocument, ConfirmDocumentType } from './types';
import { confirmDocTypeConfig } from './types';

interface ConfirmDocumentGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectNo: string;
  projectName: string;
  signingEntity: string; // 签约主体
  onGenerate: (doc: Omit<ConfirmDocument, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// 确认书模板
const confirmDocTemplates: Record<ConfirmDocumentType, string> = {
  '需求变更确认书': `# 需求变更确认书

**项目编号：** {projectNo}
**项目名称：** {projectName}
**签约主体：** {signingEntity}
**变更日期：** {date}

## 变更内容

{content}

## 变更影响

- 工期影响：______
- 费用影响：______
- 其他影响：______

## 确认意见

甲方确认：______
日期：______

乙方确认：______
日期：______
`,

  '原型确认书': `# 原型确认书

**项目编号：** {projectNo}
**项目名称：** {projectName}
**签约主体：** {signingEntity}
**确认日期：** {date}

## 原型说明

{content}

## 确认事项

1. 功能完整性：□ 已确认
2. 交互流程：□ 已确认
3. 页面布局：□ 已确认

## 确认意见

甲方确认：______
日期：______

乙方确认：______
日期：______
`,

  'UI确认书': `# UI设计确认书

**项目编号：** {projectNo}
**项目名称：** {projectName}
**签约主体：** {signingEntity}
**确认日期：** {date}

## 设计说明

{content}

## 确认事项

1. 视觉风格：□ 已确认
2. 配色方案：□ 已确认
3. 字体规范：□ 已确认
4. 图标设计：□ 已确认

## 确认意见

甲方确认：______
日期：______

乙方确认：______
日期：______
`,

  '验收确认书': `# 项目验收确认书

**项目编号：** {projectNo}
**项目名称：** {projectName}
**签约主体：** {signingEntity}
**验收日期：** {date}

## 验收说明

{content}

## 验收结果

1. 功能验收：□ 通过 □ 不通过
2. 性能验收：□ 通过 □ 不通过
3. 安全验收：□ 通过 □ 不通过

## 验收意见

甲方确认：______
日期：______

乙方确认：______
日期：______
`,

  '终验确认书': `# 项目终验确认书

**项目编号：** {projectNo}
**项目名称：** {projectName}
**签约主体：** {signingEntity}
**终验日期：** {date}

## 终验说明

{content}

## 终验结果

□ 通过终验
□ 不通过终验

## 终验意见

甲方确认：______
日期：______

乙方确认：______
日期：______
`,

  '项目通知书': `# 项目通知书

**项目编号：** {projectNo}
**项目名称：** {projectName}
**签约主体：** {signingEntity}
**通知日期：** {date}

## 通知内容

{content}

## 通知事项

{content}

## 处理要求

______

## 发送方

______
日期：______
`,
};

// 替换模板变量
function renderTemplate(
  template: string,
  data: {
    projectNo: string;
    projectName: string;
    signingEntity: string;
    content: string;
  }
): string {
  const date = new Date().toLocaleDateString('zh-CN');
  return template
    .replace('{projectNo}', data.projectNo)
    .replace('{projectName}', data.projectName)
    .replace('{signingEntity}', data.signingEntity)
    .replace('{content}', data.content)
    .replace(/{date}/g, date);
}

export function ConfirmDocumentGenerator({
  open,
  onOpenChange,
  projectId,
  projectNo,
  projectName,
  signingEntity,
  onGenerate
}: ConfirmDocumentGeneratorProps) {
  const [docType, setDocType] = useState<ConfirmDocumentType>('原型确认书');
  const [content, setContent] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  // 生成预览
  const handlePreview = () => {
    if (!content.trim()) {
      toast.error('请输入确认书内容');
      return;
    }
    const template = confirmDocTemplates[docType];
    const rendered = renderTemplate(template, {
      projectNo,
      projectName,
      signingEntity,
      content: content.trim(),
    });
    setPreviewHtml(rendered);
  };

  // 确认生成
  const handleGenerate = () => {
    if (!content.trim()) {
      toast.error('请输入确认书内容');
      return;
    }

    const template = confirmDocTemplates[docType];
    const rendered = renderTemplate(template, {
      projectNo,
      projectName,
      signingEntity,
      content: content.trim(),
    });

    const doc: Omit<ConfirmDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId,
      projectNo,
      projectName,
      type: docType,
      signingEntity,
      content: rendered,
      attachments: [],
      status: '草稿',
    };

    onGenerate(doc);
    onOpenChange(false);
    setContent('');
    setPreviewHtml('');
    toast.success(`${confirmDocTypeConfig[docType].label}已生成`);
  };

  // 下载文档
  const handleDownload = () => {
    const blob = new Blob([previewHtml], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${confirmDocTypeConfig[docType].label}_${projectNo}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('文档已下载');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>生成确认书</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 确认书类型 */}
          <div className="space-y-2">
            <Label>确认书类型</Label>
            <Select value={docType} onValueChange={(v) => setDocType(v as ConfirmDocumentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(confirmDocTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                    {config.required && <Badge variant="secondary" className="ml-2 text-[10px]">必须</Badge>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 项目信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>项目编号</Label>
              <Input value={projectNo} disabled />
            </div>
            <div className="space-y-2">
              <Label>签约主体</Label>
              <Input value={signingEntity} disabled />
            </div>
          </div>

          {/* 确认书内容 */}
          <div className="space-y-2">
            <Label>确认书内容 <span className="text-red-500">*</span></Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入确认书的主要内容..."
              rows={6}
            />
          </div>

          {/* 预览区域 */}
          {previewHtml && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">文档预览</h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3 mr-1" />
                  下载
                </Button>
              </div>
              <div className="prose prose-sm max-h-[300px] overflow-y-auto bg-white p-4 rounded border">
                <pre className="whitespace-pre-wrap text-xs">{previewHtml}</pre>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          {!previewHtml ? (
            <Button variant="outline" onClick={handlePreview}>
              <FileText className="h-4 w-4 mr-1" />
              预览
            </Button>
          ) : (
            <Button onClick={handleGenerate}>
              <Send className="h-4 w-4 mr-1" />
              生成并归档
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 确认书列表组件
interface ConfirmDocumentListProps {
  documents: ConfirmDocument[];
  onArchive?: (docId: string) => void;
}

export function ConfirmDocumentList({ documents, onArchive }: ConfirmDocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无确认书</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map(doc => (
        <Card key={doc.id} className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{doc.type}</span>
            </div>
            <Badge
              variant={doc.status === '已归档' ? 'default' : 'secondary'}
              className="text-[10px]"
            >
              {doc.status}
            </Badge>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <div>项目：{doc.projectNo} - {doc.projectName}</div>
            <div>签约主体：{doc.signingEntity}</div>
            <div>创建时间：{new Date(doc.createdAt).toLocaleString('zh-CN')}</div>
          </div>

          {doc.status === '草稿' && onArchive && (
            <div className="mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onArchive(doc.id)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                归档到合同
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
