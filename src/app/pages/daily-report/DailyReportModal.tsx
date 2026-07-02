// src/app/pages/daily-report/DailyReportModal.tsx

import { useState, useEffect, useRef } from 'react';
import { Modal, DatePicker, Message, Tag, Space } from '@arco-design/web-react';
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
  sales:        { label: '销售日报', color: '#165dff' },
  'ad-delivery': { label: '投放日报', color: '#ff7d00' },
  dev:          { label: '开发日报', color: '#00b42a' },
  general:      { label: '通用日报', color: '#7c3aed' },
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
      Message.warning('请填写明日工作计划（必填）');
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
    Message.success('日报提交成功');
    onCancel();
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
    <Modal
      title={<Space><Tag color={templateMeta.color} style={{ color: '#fff' }}>{templateMeta.label}</Tag><span>填写日报</span></Space>}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="提交日报"
      cancelText="取消"
      style={{ width: 780 }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>日期：</span>
        <DatePicker
          value={reportDate}
          onChange={(date) => date && setSessionState(prev => ({ ...prev, reportDate: date }))}
          style={{ width: 200 }}
        />
      </div>
      {renderTemplate()}
    </Modal>
  );
}
