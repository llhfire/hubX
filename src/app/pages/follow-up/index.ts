// HubX 统一跟进记录模块 - 导出
export { FollowTimeline } from './FollowTimeline';
export { FollowForm } from './FollowForm';
export { ContractFollowUp } from './ContractFollowUp';
export { ConfirmDocumentGenerator, ConfirmDocumentList } from './ConfirmDocumentGenerator';
export type {
  FollowRecord,
  FollowType,
  FollowMethod,
  EntityType,
  LeadStage,
  IntentLevel,
  CustomerStatus,
  ProjectStatus,
  ConfirmDocument,
  ConfirmDocumentType,
  Attachment,
} from './types';
export {
  followTypeConfig,
  followMethodConfig,
  leadStageConfig,
  projectStatusConfig,
  confirmDocTypeConfig,
} from './types';
