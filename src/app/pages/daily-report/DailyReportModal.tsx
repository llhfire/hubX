// src/app/pages/daily-report/DailyReportModal.tsx

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { SalesDailyTemplate } from './SalesDailyTemplate';
import { GeneralDailyTemplate } from './GeneralDailyTemplate';
import { AdDeliveryDailyTemplate } from './AdDeliveryDailyTemplate';
import { DevDailyTemplate } from './DevDailyTemplate';
import { mockUsers, getSalesDailyLeadsData, getAdDeliveryMockData } from './templateConfig';
import {
  DailyReport,
  DailyReportContent,
  DailyTemplateType,
  SalesReportContent,
  GeneralReportContent,
  AdDeliveryReportContent,
  DevReportContent,
} from './types';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (report: DailyReport) => void;
  currentUserId?: string;
  defaultRole?: DailyTemplateType;
}

interface DailyReportSessionState {
  reportDate: Date;
  content: DailyReportContent;
}

function createInitialContent(
  templateType: DailyTemplateType,
  currentUserId: string,
  date: Date,
): DailyReportContent {
  if (templateType === 'sales') {
    return {
      'lead-tracking': getSalesDailyLeadsData(currentUserId, date),
      'assistance-needed': '',
      'tomorrow-plan': '',
    };
  }
  if (templateType === 'ad-delivery') {
    return {
      'ad-delivery-data': getAdDeliveryMockData(),
      'optimization-actions': '',
      'tomorrow-plan': '',
    };
  }
  if (templateType === 'dev') {
    return {
      'work-kind': 'dev-coding',
      'project-tasks': [],
      'code-progress': '',
      'problems-encountered': '',
      'tomorrow-plan': '',
    };
  }
  return {
    'work-kind': 'dev-coding',
    'project-tasks': [],
    'today-summary': '',
    'problems-encountered': '',
    'tomorrow-plan': '',
  };
}

function createSessionState(
  templateType: DailyTemplateType,
  currentUserId: string,
  reportDate: Date,
): DailyReportSessionState {
  return {
    reportDate,
    content: createInitialContent(templateType, currentUserId, reportDate),
  };
}

const TEMPLATE_LABELS: Record<DailyTemplateType, { label: string; color: string }> = {
  sales:        { label: '销售日报', color: 'bg-blue-500' },
  'ad-delivery': { label: '投放日报', color: 'bg-orange-500' },
  dev:          { label: '开发日报', color: 'bg-green-500' },
  general:      { label: '通用日报', color: 'bg-purple-500' },
};

export function DailyReportModal({ visible, onCancel, onSubmit, currentUserId = 'user-sales-zhangsan', defaultRole }: Props) {
  const currentTemplateType: DailyTemplateType = defaultRole || 'general';
  const [sessionState, setSessionState] = useState<DailyReportSessionState>(() =>
    createSessionState(currentTemplateType, currentUserId, new Date()),
  );
  const wasVisibleRef = useRef(visible);
  const openingSessionRef = useRef<DailyReportSessionState | null>(null);

  if (visible && !wasVisibleRef.current && openingSessionRef.current === null) {
    openingSessionRef.current = createSessionState(currentTemplateType, currentUserId, new Date());
  }
  if (!visible && openingSessionRef.current !== null) {
    openingSessionRef.current = null;
  }

  const currentSessionState = openingSessionRef.current ?? sessionState;
  const { reportDate, content } = currentSessionState;

  useEffect(() => {
    if (openingSessionRef.current) {
      setSessionState(openingSessionRef.current);
      openingSessionRef.current = null;
    }
    wasVisibleRef.current = visible;
  }, [visible]);

  const handleContentChange = (newContent: DailyReportContent) => {
    setSessionState(prev => ({ ...prev, content: newContent }));
  };

  const handleSubmit = () => {
    if (!content?.['tomorrow-plan']) {
      toast.error('请填写明日工作计划（必填）');
      return;
    }

    const user = mockUsers.find(u => u.id === currentUserId);
    const templateIdMap: Record<DailyTemplateType, string> = {
      sales: 'sales-template-default',
      'ad-delivery': 'ad-delivery-template-default',
      dev: 'dev-template-default',
      general: 'general-template-default',
    };

    const report: DailyReport = {
      id: `report-${Date.now()}`,
      userId: currentUserId,
      userName: user?.name || '未知用户',
      department: user?.department || '未知部门',
      reportDate: reportDate.toISOString().split('T')[0],
      templateId: templateIdMap[currentTemplateType],
      templateType: currentTemplateType,
      content,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(report);
    toast.success('日报提交成功');
    onCancel();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : new Date();
    setSessionState(prev => ({ ...prev, reportDate: date }));
  };

  const renderTemplate = () => {
    switch (currentTemplateType) {
      case 'sales':
        return <SalesDailyTemplate userId={currentUserId} date={reportDate} initialContent={content as SalesReportContent} onChange={handleContentChange} />;
      case 'ad-delivery':
        return <AdDeliveryDailyTemplate content={content as AdDeliveryReportContent} onChange={handleContentChange} />;
      case 'dev':
        return <DevDailyTemplate content={content as DevReportContent} onChange={handleContentChange} />;
      default:
        return <GeneralDailyTemplate initialContent={content as GeneralReportContent | undefined} onChange={handleContentChange} />;
    }
  };

  const templateMeta = TEMPLATE_LABELS[currentTemplateType];

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[780px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge className={templateMeta.color}>{templateMeta.label}</Badge>
            <span>填写日报</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <span className="font-medium mr-2">日期：</span>
          <input
            type="date"
            value={reportDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="border rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        {renderTemplate()}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>取消</Button>
          <Button onClick={handleSubmit}>提交日报</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
