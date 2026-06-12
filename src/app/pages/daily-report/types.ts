// src/app/pages/daily-report/types.ts

// 模板字段类型
export type FieldType = 'text' | 'textarea' | 'lead-tracking' | 'project-task-list' | 'date' | 'select';

// 模板字段定义
export interface TemplateField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  order: number;
  options?: { label: string; value: string }[];
}

// 日报模板
export interface DailyTemplate {
  id: string;
  name: string;
  type: 'sales' | 'general';
  fields: TemplateField[];
  isDefault: boolean;
}

// 项目任务
export interface ProjectTask {
  id: string;
  projectName: string;
  taskForm: string;
  hours: number;
}

// 线索跟进情况
export interface LeadTrackingItem {
  leadId: string;
  leadName: string;
  level: 'S' | 'A' | 'B' | 'C';
  statusChanges: string[];
  followRecords: string[];
}

// 销售日报内容
export interface SalesReportContent {
  'lead-tracking'?: LeadTrackingItem[];
  'assistance-needed'?: string;
  'tomorrow-plan'?: string;
}

// 通用日报内容
export interface GeneralReportContent {
  'project-tasks'?: ProjectTask[];
  'today-summary'?: string;
  'problems-encountered'?: string;
  'tomorrow-plan'?: string;
}

// 日报类型（联合类型）
export type DailyReportContent = SalesReportContent | GeneralReportContent;

// 日报
export interface DailyReport {
  id: string;
  userId: string;
  userName: string;
  department: string;
  reportDate: string;
  templateId: string;
  templateType: 'sales' | 'general';
  content: DailyReportContent;
  status: 'draft' | 'submitted' | 'reviewed';
  createdAt: string;
  updatedAt: string;
  hasUnreadComments?: boolean;
}

// 日报评论
export interface DailyReportComment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  content: string;
  mentionedUsers: string[];
  createdAt: string;
  readBy: string[];
}

// 用户模板配置
export interface UserTemplateConfig {
  userId: string;
  templateId: string;
}