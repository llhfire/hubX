// 模板注册表。新增模板时在这里加一项，所有页面（编辑页/详情页/列表页）
// 自动可见。

import type { ContractTemplate } from '../types';
import { cloudServiceTemplate } from './cloudService';
import { serviceContractTemplate } from './serviceContract';
import { softwareSalesTemplate } from './softwareSales';

export const contractTemplates: ContractTemplate[] = [
  softwareSalesTemplate,
  serviceContractTemplate,
  cloudServiceTemplate,
];

export function getTemplateById(id: string): ContractTemplate | undefined {
  return contractTemplates.find((t) => t.id === id);
}

// 返回适用于指定产品类别的模板。空类别或匹配不上时返回全部。
export function getTemplatesByCategory(category?: string): ContractTemplate[] {
  if (!category) return contractTemplates;
  const matched = contractTemplates.filter((t) => t.productCategories.includes(category));
  return matched.length > 0 ? matched : contractTemplates;
}

// 根据 templateId 渲染合同正文（如果模板找不到，返回提示文本）。
export function renderTemplate(templateId: string, formData: Parameters<ContractTemplate['render']>[0]): string {
  const tpl = getTemplateById(templateId);
  if (!tpl) {
    return `<div style="padding:32px;text-align:center;color:var(--color-text-3);">
      模板 ${templateId} 不存在或已被移除。请重新选择模板。
    </div>`;
  }
  return tpl.render(formData);
}
