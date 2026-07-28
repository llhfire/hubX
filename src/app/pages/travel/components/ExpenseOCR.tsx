import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Upload, FileImage, Loader2, CheckCircle2, AlertTriangle, ArrowRight, Camera, X } from 'lucide-react';

interface ExpenseOCRProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OCRResult {
  invoiceNo: string;
  amount: number;
  date: string;
  route: string;
  company: string;
  type: 'transport' | 'accommodation' | 'meal' | 'other';
  compliant: boolean;
  issues: string[];
}

const MOCK_OCR_RESULTS: OCRResult[] = [
  {
    invoiceNo: '012002400311',
    amount: 1053.00,
    date: '2026-04-28',
    route: '北京南 - 杭州东',
    company: '中国铁路上海局集团有限公司',
    type: 'transport',
    compliant: true,
    issues: [],
  },
  {
    invoiceNo: '146002400201',
    amount: 438.00,
    date: '2026-04-28',
    route: '',
    company: '杭州西湖国宾馆有限公司',
    type: 'accommodation',
    compliant: false,
    issues: ['住宿单价 438 元超出当日标准（新一线城市 220 元/天）'],
  },
  {
    invoiceNo: '044002400112',
    amount: 156.00,
    date: '2026-04-29',
    route: '',
    company: '杭州知味观味庄餐饮有限公司',
    type: 'meal',
    compliant: true,
    issues: [],
  },
];

type ProcessingState = 'idle' | 'uploading' | 'processing' | 'done';

const typeLabels: Record<string, string> = {
  transport: '交通费',
  accommodation: '住宿费',
  meal: '餐饮费',
  other: '其他',
};

const typeBadgeVariant = (type: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (type) {
    case 'transport': return 'default';
    case 'accommodation': return 'secondary';
    case 'meal': return 'outline';
    default: return 'outline';
  }
};

export function ExpenseOCR({ open, onOpenChange }: ExpenseOCRProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<OCRResult[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const simulateOCR = useCallback(() => {
    setProcessingState('uploading');
    setProgress(0);
    setResults([]);

    const uploadTimer = setTimeout(() => {
      setProcessingState('processing');
      setSelectedFiles(['行程单_G101.pdf', '酒店发票_西湖国宾馆.pdf', '餐饮发票_知味观.pdf']);

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15 + 5;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setProgress(100);
          setProcessingState('done');
          setResults(MOCK_OCR_RESULTS);
        } else {
          setProgress(Math.min(currentProgress, 99));
        }
      }, 300);
    }, 800);

    return () => {
      clearTimeout(uploadTimer);
    };
  }, []);

  const handleReset = () => {
    setProcessingState('idle');
    setProgress(0);
    setResults([]);
    setSelectedFiles([]);
  };

  const totalAmount = results.reduce((sum, r) => sum + r.amount, 0);
  const compliantCount = results.filter(r => r.compliant).length;
  const issueCount = results.filter(r => !r.compliant).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            票据 OCR 识别
          </DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          className="hidden"
        />

        {processingState === 'idle' && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
            onClick={handleUploadClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              simulateOCR();
            }}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">上传票据图片或 PDF</p>
            <p className="text-sm text-gray-500 mb-4">支持 JPG、PNG、PDF 格式，可批量上传</p>
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); simulateOCR(); }}>
              <FileImage className="h-4 w-4 mr-2" />
              选择文件
            </Button>
          </div>
        )}

        {(processingState === 'uploading' || processingState === 'processing') && (
          <div className="space-y-6 py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700 mb-1">
                {processingState === 'uploading' ? '正在上传票据...' : '正在 OCR 识别...'}
              </p>
              <p className="text-sm text-gray-500 mb-4">AI 正在解析票据信息</p>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <FileImage className="h-4 w-4 text-blue-500" />
                    <span className="flex-1">{file}</span>
                    {processingState === 'processing' && progress > (i + 1) * 30 && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {processingState === 'done' && results.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">识别票据</p>
                  <p className="text-2xl font-bold">{results.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">识别总额</p>
                  <p className="text-2xl font-bold text-blue-600">{totalAmount.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">合规检查</p>
                  <p className="text-2xl font-bold text-green-600">{compliantCount}/{results.length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {results.map((result, index) => (
                <Card key={index} className={result.compliant ? 'border-green-200' : 'border-red-200'}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span>{typeLabels[result.type]}</span>
                        <Badge variant={typeBadgeVariant(result.type)}>{typeLabels[result.type]}</Badge>
                      </CardTitle>
                      {result.compliant ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          合规
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          异常
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">发票号</span>
                        <span className="font-mono">{result.invoiceNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">金额</span>
                        <span className="font-medium">{'¥'}{result.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">日期</span>
                        <span>{result.date}</span>
                      </div>
                      {result.route && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">路线</span>
                          <span>{result.route}</span>
                        </div>
                      )}
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-500">开票单位</span>
                        <span className="text-right">{result.company}</span>
                      </div>
                    </div>
                    {result.issues.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-2 mt-2">
                        {result.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                            <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                重新识别
              </Button>
              <Button className="flex-1" onClick={() => onOpenChange(false)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                自动填入报销单
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
