// src/app/pages/daily-report/DailyReportModal.tsx

import { useState, useEffect, useRef } from 'react';
import { Modal, DatePicker, Message } from '@arco-design/web-react';
import { SalesDailyTemplate } from './SalesDailyTemplate';
import { GeneralDailyTemplate } from './GeneralDailyTemplate';
import { mockUsers, getSalesDailyLeadsData } from './templateConfig';
import { DailyReport, DailyReportContent, SalesReportContent, GeneralReportContent } from './types';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (report: DailyReport) => void;
  currentUserId?: string;
  defaultRole?: 'sales' | 'general';
}

interface DailyReportSessionState {
  reportDate: Date;
  content: DailyReportContent;
}

function createInitialContent(
  templateType: 'sales' | 'general',
  currentUserId: string,
  date: Date,
): DailyReportContent {
  if (templateType === 'sales') {
    const initialSalesContent: SalesReportContent = {
      'lead-tracking': getSalesDailyLeadsData(currentUserId, date),
      'assistance-needed': '',
      'tomorrow-plan': '',
    };

    return initialSalesContent;
  }

  const initialGeneralContent: GeneralReportContent = {
    'project-tasks': [],
    'today-summary': '',
    'problems-encountered': '',
    'tomorrow-plan': '',
  };

  return initialGeneralContent;
}

function createSessionState(
  templateType: 'sales' | 'general',
  currentUserId: string,
  reportDate: Date,
): DailyReportSessionState {
  return {
    reportDate,
    content: createInitialContent(templateType, currentUserId, reportDate),
  };
}

export function DailyReportModal({ visible, onCancel, onSubmit, currentUserId = 'user-sales-zhangsan', defaultRole }: Props) {
  const currentTemplateType: 'sales' | 'general' = defaultRole || 'general';
  const [sessionState, setSessionState] = useState<DailyReportSessionState>(() => {
    const initialDate = new Date();
    return createSessionState(currentTemplateType, currentUserId, initialDate);
  });
  const wasVisibleRef = useRef(visible);
  const openingSessionRef = useRef<DailyReportSessionState | null>(null);

  if (visible && !wasVisibleRef.current && openingSessionRef.current === null) {
    const nextReportDate = new Date();
    openingSessionRef.current = createSessionState(currentTemplateType, currentUserId, nextReportDate);
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
    setSessionState((prevState) => ({
      ...prevState,
      content: newContent,
    }));
  };

  const handleSubmit = () => {
    // 校验必填项
    if (!content?.['tomorrow-plan']) {
      Message.warning('请填写明日工作计划（必填）');
      return;
    }

    const user = mockUsers.find(u => u.id === currentUserId);
    const report: DailyReport = {
      id: `report-${Date.now()}`,
      userId: currentUserId,
      userName: user?.name || '未知用户',
      department: user?.department || '未知部门',
      reportDate: reportDate.toISOString().split('T')[0],
      templateId: currentTemplateType === 'sales' ? 'sales-template-default' : 'general-template-default',
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
    if (currentTemplateType === 'sales') {
      return (
        <SalesDailyTemplate
          userId={currentUserId}
          date={reportDate}
          initialContent={content as SalesReportContent}
          onChange={handleContentChange}
        />
      );
    }

    return (
      <GeneralDailyTemplate
        initialContent={content as GeneralReportContent | undefined}
        onChange={handleContentChange}
      />
    );
  };

  return (
    <Modal
      title="填写日报"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="提交日报"
      cancelText="取消"
      style={{ width: 700 }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>日期：</span>
        <DatePicker
          value={reportDate}
          onChange={(date) => date && setSessionState((prevState) => ({
            ...prevState,
            reportDate: date,
          }))}
          style={{ width: 200 }}
        />
      </div>

      {renderTemplate()}
    </Modal>
  );
}
