// src/app/pages/daily-report/templateConfig.ts

import { DailyTemplate, UserTemplateConfig, LeadTrackingItem } from './types';

// 销售日报模板
export const salesTemplate: DailyTemplate = {
  id: 'sales-template-default',
  name: '销售日报模板',
  type: 'sales',
  isDefault: true,
  fields: [
    {
      id: 'lead-tracking',
      name: '线索跟进情况',
      type: 'lead-tracking',
      required: false,
      order: 1,
    },
    {
      id: 'assistance-needed',
      name: '需协助事项',
      type: 'textarea',
      required: false,
      order: 2,
    },
    {
      id: 'tomorrow-plan',
      name: '明日工作计划',
      type: 'textarea',
      required: true,
      order: 3,
    },
  ],
};

// 通用日报模板
export const generalTemplate: DailyTemplate = {
  id: 'general-template-default',
  name: '通用日报模板',
  type: 'general',
  isDefault: true,
  fields: [
    {
      id: 'project-tasks',
      name: '项目任务',
      type: 'project-task-list',
      required: false,
      order: 1,
    },
    {
      id: 'today-summary',
      name: '今日总结',
      type: 'textarea',
      required: false,
      order: 2,
    },
    {
      id: 'problems-encountered',
      name: '遇到的问题',
      type: 'textarea',
      required: false,
      order: 3,
    },
    {
      id: 'tomorrow-plan',
      name: '明日工作计划',
      type: 'textarea',
      required: true,
      order: 4,
    },
  ],
};

// 获取用户模板配置（模拟）
export function getUserTemplateConfig(userId: string): UserTemplateConfig | null {
  const configs: Record<string, UserTemplateConfig> = {
    'user-sales-zhangsan': { userId: 'user-sales-zhangsan', templateId: 'sales-template-default' },
  };
  return configs[userId] || null;
}

// 根据用户ID获取模板
export function getUserTemplate(userId: string, userRole: 'sales' | 'other' = 'other'): DailyTemplate {
  const userConfig = getUserTemplateConfig(userId);
  if (userConfig) {
    if (userConfig.templateId === 'sales-template-default') return salesTemplate;
    if (userConfig.templateId === 'general-template-default') return generalTemplate;
  }
  return userRole === 'sales' ? salesTemplate : generalTemplate;
}

// 模拟用户数据
export const mockUsers = [
  { id: 'user-sales-zhangsan', name: '张三', role: 'sales' as const, department: '销售部' },
  { id: 'user-sales-lisi', name: '李四', role: 'sales' as const, department: '销售部' },
  { id: 'user-tech-wangwu', name: '王五', role: 'other' as const, department: '技术部' },
];

// 获取线索跟进数据（模拟）
export function getSalesDailyLeadsData(userId: string, date: Date): LeadTrackingItem[] {
  const mockLeads: LeadTrackingItem[] = [
    {
      leadId: 'lead-1',
      leadName: '阿里巴巴-企业管理系统',
      level: 'S',
      statusChanges: ['意向低 → 意向高'],
      followRecords: ['今天电话沟通，对方表示有合作意向，希望进一步演示产品。'],
    },
    {
      leadId: 'lead-2',
      leadName: '腾讯-云服务平台',
      level: 'A',
      statusChanges: [],
      followRecords: ['下午发送了产品资料包，对方已确认收到。'],
    },
    {
      leadId: 'lead-3',
      leadName: '字节跳动-协作工具',
      level: 'B',
      statusChanges: ['初步建联 → 已出demo'],
      followRecords: ['上午进行线上demo演示，对方反馈积极。'],
    },
  ];
  return mockLeads;
}

// 判断是否为销售人员
export function isSalesUser(userId: string): boolean {
  const user = mockUsers.find(u => u.id === userId);
  return user?.role === 'sales';
}
