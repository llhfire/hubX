// Wizard 使用的轻量线索/报价上下文 mock。
//
// 线索详情页（LeadDetail.tsx）的 quotationHistory 是页面局部 state，
// 没有跨页面共享层。原型阶段我们这里维护一份"按 leadId 查得到线索基本信息
// 和报价历史"的最小 mock，让 Wizard 能从 URL 参数还原上下文。
//
// 真接入后端时，这层会被一个真实的 leadsApi 替代。

import type { QuotationRecord } from './types';

export interface LeadContext {
  id: string;
  leadName: string;
  customerName: string;
  customerEntity: string; // 对接主体（与 companyEntityData.shortName 对齐）
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  productCategory: string;
  estimatedDuration?: string; // 工期字面量，如 '3个月'
  quotations: QuotationRecord[];
}

const MOCK_LEAD_CONTEXTS: LeadContext[] = [
  {
    id: 'lead-1',
    leadName: '某科技公司APP开发需求',
    customerName: '北京科技有限公司',
    customerEntity: '中科软艺',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    contactEmail: 'zhang@example.com',
    productCategory: '软件开发',
    estimatedDuration: '3个月',
    quotations: [
      {
        id: 'q1',
        name: 'APP开发项目报价方案V2',
        status: '已报价',
        flowStatus: '已审核',
        amount: '680,000',
        period: '3个月',
        createTime: '2026-04-10 14:30',
        entity: '中科软艺',
      },
      {
        id: 'q2',
        name: 'APP开发项目初步报价',
        status: '未报价',
        flowStatus: '已审核',
        amount: '750,000',
        period: '4个月',
        createTime: '2026-04-05 10:20',
        entity: '软艺信息',
      },
    ],
  },
  {
    id: 'lead-6',
    leadName: 'F信息公司CRM定制',
    customerName: 'F信息公司',
    customerEntity: '中科软艺',
    contactPerson: '范经理',
    contactPhone: '13911112222',
    productCategory: '软件开发',
    estimatedDuration: '3个月',
    quotations: [
      {
        id: 'quote-6',
        name: 'CRM定制开发报价',
        status: '已报价',
        flowStatus: '已审核',
        amount: '680,000',
        period: '3个月',
        createTime: '2026-06-08 11:00',
        entity: '中科软艺',
      },
    ],
  },
  {
    id: 'lead-without-quote',
    leadName: '某零售公司咨询需求',
    customerName: '某零售公司',
    customerEntity: '中科软艺',
    contactPerson: '钱经理',
    contactPhone: '13522224444',
    productCategory: '技术服务',
    quotations: [],
  },
];

export function findLeadContext(leadId: string | null | undefined): LeadContext | null {
  if (!leadId) return null;
  return MOCK_LEAD_CONTEXTS.find((l) => l.id === leadId) ?? null;
}

export function findQuotation(
  leadId: string | null | undefined,
  quoteId: string | null | undefined,
): QuotationRecord | null {
  const lead = findLeadContext(leadId);
  if (!lead || !quoteId) return null;
  return lead.quotations.find((q) => q.id === quoteId) ?? null;
}

// 把报价中的金额字符串（"680,000"）转成数字
export function parseQuoteAmount(amountStr: string | undefined): number {
  if (!amountStr) return 0;
  const n = Number(amountStr.replace(/[,，\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
