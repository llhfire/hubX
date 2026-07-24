import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { toast } from 'sonner';
import { Upload, Eye } from 'lucide-react';
import type { ScanArchiveEntry, ScanFile } from '../types';

interface Props {
  entries: ScanArchiveEntry[];
  // 是否允许上传：合同必须处于 pending_return 或 archived 状态。
  uploadEnabled: boolean;
  // 上传目的：'first' 表示首次归档，'supplemental' 表示补充上传。
  uploadIntent: 'first' | 'supplemental' | null;
  onUpload: (files: ScanFile[], note?: string) => void;
  onSetPrimary: (entryId: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export function ScanFileList({
  entries,
  uploadEnabled,
  uploadIntent,
  onUpload,
  onSetPrimary,
}: Props) {
  const [previewFile, setPreviewFile] = useState<ScanFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBeforeUpload = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} 超过 20MB 上限`);
      return false;
    }
    const isAllowed =
      file.type === 'application/pdf' ||
      file.type.startsWith('image/');
    if (!isAllowed) {
      toast.error(`${file.name} 不是 PDF/图片，已忽略`);
      return false;
    }
    return true;
  };

  const handleUploadFiles = (files: File[]) => {
    const validFiles = files.filter((f) => handleBeforeUpload(f));
    if (validFiles.length === 0) return;
    const scanFiles: ScanFile[] = validFiles.map((f, idx) => ({
      id: `f-${Date.now()}-${idx}`,
      fileName: f.name,
      fileSize: f.size,
      mimeType: f.type,
      blobUrl: URL.createObjectURL(f),
      uploadedAt: new Date().toLocaleString('zh-CN'),
      uploadedBy: '李四',
    }));
    onUpload(scanFiles);
    toast.success(
      uploadIntent === 'first'
        ? `已收到客户回寄件，合同状态已切换至「已归档」`
        : `已补充扫描件`,
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleUploadFiles(Array.from(files));
    // 重置 input 以便再次选择同一文件
    e.target.value = '';
  };

  return (
    <div>
      {uploadEnabled && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-8 mx-auto text-muted-foreground" />
              <div className="mt-2 text-muted-foreground text-sm">
                {uploadIntent === 'first'
                  ? '点击或拖拽上传客户回寄盖章件（PDF / 图片，单文件 ≤ 20MB）'
                  : '补充上传扫描件（PDF / 图片，单文件 ≤ 20MB）'}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      )}

      {entries.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">尚无扫描件</div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <ScanEntryCard
              key={entry.id}
              entry={entry}
              onSetPrimary={() => onSetPrimary(entry.id)}
              onPreview={(f) => setPreviewFile(f)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!previewFile} onOpenChange={(open) => { if (!open) setPreviewFile(null); }}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{previewFile?.fileName ?? '预览'}</DialogTitle>
          </DialogHeader>
          {previewFile && <FilePreview file={previewFile} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScanEntryCard({
  entry,
  onSetPrimary,
  onPreview,
}: {
  entry: ScanArchiveEntry;
  onSetPrimary: () => void;
  onPreview: (f: ScanFile) => void;
}) {
  return (
    <Card className={entry.isPrimary ? 'border-primary' : ''}>
      <CardContent className="pt-3 pb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">归档 {entry.uploadedAt}</span>
            {entry.isPrimary && <Badge>当前主件</Badge>}
            <Badge variant="outline">对应版本：{entry.linkedVersionNo}</Badge>
          </div>
          {!entry.isPrimary && (
            <Button size="sm" variant="outline" onClick={onSetPrimary}>
              设为主件
            </Button>
          )}
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          上传人：{entry.uploadedBy}
          {entry.note ? ` · ${entry.note}` : ''}
        </div>
        {entry.files.map((f) => (
          <div
            key={f.id}
            className="flex justify-between items-center p-1.5 bg-muted rounded mb-1"
          >
            <div className="flex items-center gap-2 text-[13px]">
              <span>{f.fileName}</span>
              <span className="text-muted-foreground">{formatSize(f.fileSize)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => onPreview(f)}
            >
              <Eye className="size-3" />
              预览
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FilePreview({ file }: { file: ScanFile }) {
  if (!file.blobUrl) {
    return (
      <div className="text-center text-muted-foreground py-8">
        演示数据，无可用预览。
        <br />
        真实环境中扫描件会从 OSS / 文件服务读取。
      </div>
    );
  }
  if (file.mimeType.startsWith('image/')) {
    return (
      <img
        src={file.blobUrl}
        alt={file.fileName}
        style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      />
    );
  }
  return (
    <iframe
      title={file.fileName}
      src={file.blobUrl}
      style={{ width: '100%', height: 600, border: 'none' }}
    />
  );
}
