import { WorkItemsPage } from './WorkItemsPage';

interface IssuesTabProps {
  projectId: string;
}

/**
 * 嵌入式工作项标签页
 * 用于在项目详情页中以 Tab 形式展示工作项
 * 底层委托给 WorkItemsPage（embedded 模式）
 */
export function IssuesTab({ projectId }: IssuesTabProps) {
  return <WorkItemsPage embedded projectId={projectId} />;
}
