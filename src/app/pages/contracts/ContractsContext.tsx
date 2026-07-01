// 合同模块的全局状态：内存态 mock 数据 + 操作动作。
//
// 沿用 ReminderContext 的 Provider + hook 模式，避免在多个页面之间手动同步。

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type {
  ApprovalNode,
  CollectionRecord,
  Contract,
  ContractFormData,
  ContractStatus,
  DunningRecord,
  PaymentBlocker,
  ScanArchiveEntry,
  ScanFile,
  WizardInput,
} from './types';
import { buildInitialContracts } from './mockData';
import { renderTemplate } from './templates';
import { canTransitionTo, generateContractNo, getNextVersionNo } from './utils';

interface ContractsContextValue {
  contracts: Contract[];
  getById: (id: string | undefined) => Contract | undefined;
  createFromWizard: (input: WizardInput) => Contract;
  saveDraft: (id: string, formData: ContractFormData) => void;
  saveAsVersion: (id: string, formData: ContractFormData, label: string) => void;
  submitForApproval: (id: string, formData: ContractFormData) => void;
  withdrawApproval: (id: string) => void;
  approveStep: (id: string, stepIndex: number, comment?: string) => void;
  rejectStep: (id: string, stepIndex: number, comment: string) => void;
  markMailed: (id: string) => void;
  uploadScan: (
    id: string,
    files: ScanFile[],
    note?: string,
  ) => ScanArchiveEntry | null;
  setPrimaryScan: (id: string, entryId: string) => void;
  voidContract: (id: string, reason: string) => void;
  // 回款操作
  addCollection: (contractId: string, record: Omit<CollectionRecord, 'id' | 'contractId'>) => void;
  addBlocker: (contractId: string, blocker: Omit<PaymentBlocker, 'id' | 'contractId' | 'createdAt'>) => void;
  resolveBlocker: (contractId: string, blockerId: string) => void;
  addDunning: (contractId: string, record: Omit<DunningRecord, 'id' | 'contractId'>) => void;
}

const ContractsContext = createContext<ContractsContextValue | null>(null);

const DEFAULT_APPROVERS: Record<ApprovalNode['step'], string> = {
  发起申请: '张三',
  商务审核: '王经理 - 商务主管',
  财务审核: '陈财务 - 财务总监',
  法务审核: '赵律师 - 法务部',
};

function createInitialApprovalFlow(): ApprovalNode[] {
  return (
    Object.keys(DEFAULT_APPROVERS) as Array<keyof typeof DEFAULT_APPROVERS>
  ).map((step) => ({
    step,
    approver: DEFAULT_APPROVERS[step],
    status: 'pending',
    time: '',
    comment: '',
  }));
}

function nowString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export function ContractsProvider({ children }: PropsWithChildren) {
  const [contracts, setContracts] = useState<Contract[]>(() => buildInitialContracts());
  const seqRef = useRef<number>(100); // 合同编号当天序号计数器（mock 简化）

  const getById = useCallback(
    (id: string | undefined) => contracts.find((c) => c.id === id),
    [contracts],
  );

  // 给单个合同应用一个变更，并自动更新 updatedAt。
  const updateContract = useCallback(
    (id: string, mutate: (c: Contract) => Contract) => {
      setContracts((prev) =>
        prev.map((c) =>
          c.id === id ? { ...mutate(c), updatedAt: nowString() } : c,
        ),
      );
    },
    [],
  );

  const createFromWizard = useCallback((input: WizardInput): Contract => {
    seqRef.current += 1;
    const id = `c${Date.now()}`;
    const now = nowString();
    const formData = input.formData;
    const v1 = {
      versionNo: 'V1',
      formData,
      renderedHtml: renderTemplate(formData.templateId, formData),
      label: '首次保存草稿',
      createdAt: now,
      createdBy: '张三',
    };
    const newContract: Contract = {
      id,
      contractNo: generateContractNo(new Date(), seqRef.current),
      status: 'draft',
      leadId: input.leadId,
      quoteId: input.quoteId,
      current: formData,
      versionHistory: [v1],
      approvalFlow: createInitialApprovalFlow(),
      archivedScans: [],
      createdAt: now,
      createdBy: '张三',
      updatedAt: now,
    };
    setContracts((prev) => [newContract, ...prev]);
    return newContract;
  }, []);

  const saveDraft = useCallback(
    (id: string, formData: ContractFormData) => {
      updateContract(id, (c) => ({ ...c, current: formData }));
    },
    [updateContract],
  );

  const saveAsVersion = useCallback(
    (id: string, formData: ContractFormData, label: string) => {
      updateContract(id, (c) => {
        const versionNo = getNextVersionNo(c.versionHistory.map((v) => v.versionNo));
        const newVersion = {
          versionNo,
          formData,
          renderedHtml: renderTemplate(formData.templateId, formData),
          label: label || `手动保存`,
          createdAt: nowString(),
          createdBy: '张三',
        };
        return {
          ...c,
          current: formData,
          versionHistory: [...c.versionHistory, newVersion],
        };
      });
    },
    [updateContract],
  );

  const submitForApproval = useCallback(
    (id: string, formData: ContractFormData) => {
      updateContract(id, (c) => {
        if (!canTransitionTo(c.status, 'approving') && c.status !== 'draft') return c;
        const versionNo = getNextVersionNo(c.versionHistory.map((v) => v.versionNo));
        const isResubmit = c.approvalFlow.some((n) => n.status === 'rejected');
        const submission = {
          versionNo,
          formData,
          renderedHtml: renderTemplate(formData.templateId, formData),
          label: isResubmit ? '驳回后再次提交' : '提交审批前自动保存',
          createdAt: nowString(),
          createdBy: '张三',
        };
        const flow = createInitialApprovalFlow();
        // 第 1 节点 "发起申请" 直接置为 approved
        flow[0] = { ...flow[0], status: 'approved', time: nowString(), comment: '提交合同审批' };
        return {
          ...c,
          status: 'approving',
          current: formData,
          versionHistory: [...c.versionHistory, submission],
          approvalFlow: flow,
          approvedVersionNo: undefined,
          approvedAt: undefined,
        };
      });
    },
    [updateContract],
  );

  const withdrawApproval = useCallback(
    (id: string) => {
      updateContract(id, (c) => {
        if (c.status !== 'approving') return c;
        return { ...c, status: 'draft', approvalFlow: createInitialApprovalFlow() };
      });
    },
    [updateContract],
  );

  const approveStep = useCallback(
    (id: string, stepIndex: number, comment = '同意') => {
      updateContract(id, (c) => {
        const flow = c.approvalFlow.map((n, i) =>
          i === stepIndex ? { ...n, status: 'approved' as const, time: nowString(), comment } : n,
        );
        const allApproved = flow.every((n) => n.status === 'approved');
        if (allApproved && canTransitionTo(c.status, 'pending_mail')) {
          const lastVersion = c.versionHistory[c.versionHistory.length - 1];
          return {
            ...c,
            approvalFlow: flow,
            status: 'pending_mail',
            approvedVersionNo: lastVersion?.versionNo,
            approvedAt: nowString(),
          };
        }
        return { ...c, approvalFlow: flow };
      });
    },
    [updateContract],
  );

  const rejectStep = useCallback(
    (id: string, stepIndex: number, comment: string) => {
      updateContract(id, (c) => {
        if (c.status !== 'approving') return c;
        const flow = c.approvalFlow.map((n, i) =>
          i === stepIndex ? { ...n, status: 'rejected' as const, time: nowString(), comment } : n,
        );
        return { ...c, approvalFlow: flow, status: 'draft' };
      });
    },
    [updateContract],
  );

  const markMailed = useCallback(
    (id: string) => {
      updateContract(id, (c) => {
        if (!canTransitionTo(c.status, 'pending_return')) return c;
        return { ...c, status: 'pending_return', mailedAt: nowString() };
      });
    },
    [updateContract],
  );

  const uploadScan = useCallback(
    (id: string, files: ScanFile[], note?: string): ScanArchiveEntry | null => {
      const contract = contracts.find((c) => c.id === id);
      if (!contract) return null;
      // 上传扫描件触发首次归档；已归档时是补充扫描件。
      const isFirstArchive = contract.status === 'pending_return';
      const isSupplemental = contract.status === 'archived';
      if (!isFirstArchive && !isSupplemental) return null;

      const entry: ScanArchiveEntry = {
        id: `scan-${Date.now()}`,
        files,
        uploadedAt: nowString(),
        uploadedBy: '李四',
        isPrimary: true,
        linkedVersionNo: contract.approvedVersionNo ?? 'V1',
        note,
      };

      updateContract(id, (c) => {
        const archivedScans = c.archivedScans.map((s) => ({ ...s, isPrimary: false }));
        archivedScans.push(entry);
        return {
          ...c,
          archivedScans,
          status: isFirstArchive ? 'archived' : c.status,
        };
      });
      return entry;
    },
    [contracts, updateContract],
  );

  const setPrimaryScan = useCallback(
    (id: string, entryId: string) => {
      updateContract(id, (c) => ({
        ...c,
        archivedScans: c.archivedScans.map((s) => ({ ...s, isPrimary: s.id === entryId })),
      }));
    },
    [updateContract],
  );

  const voidContract = useCallback(
    (id: string, reason: string) => {
      updateContract(id, (c) => {
        if (!canTransitionTo(c.status, 'voided')) return c;
        // 把作废原因记到最近一条审批节点的 comment 里（演示用）
        const flow = [...c.approvalFlow];
        return { ...c, status: 'voided', approvalFlow: flow, current: { ...c.current, contractContent: c.current.contractContent + `\n\n[作废原因] ${reason}` } };
      });
    },
    [updateContract],
  );

  const addCollection = useCallback(
    (contractId: string, record: Omit<CollectionRecord, 'id' | 'contractId'>) => {
      updateContract(contractId, (c) => {
        const newRecord: CollectionRecord = {
          ...record,
          id: `col-${Date.now()}`,
          contractId,
        };
        const records = [...(c.collectionRecords ?? []), newRecord];
        const received = records.reduce((s, r) => s + r.amount, 0);
        return { ...c, collectionRecords: records, receivedAmount: received };
      });
    },
    [updateContract],
  );

  const addBlocker = useCallback(
    (contractId: string, blocker: Omit<PaymentBlocker, 'id' | 'contractId' | 'createdAt'>) => {
      updateContract(contractId, (c) => {
        const newBlocker: PaymentBlocker = {
          ...blocker,
          id: `blocker-${Date.now()}`,
          contractId,
          createdAt: nowString(),
        };
        return { ...c, paymentBlockers: [...(c.paymentBlockers ?? []), newBlocker] };
      });
    },
    [updateContract],
  );

  const resolveBlocker = useCallback(
    (contractId: string, blockerId: string) => {
      updateContract(contractId, (c) => ({
        ...c,
        paymentBlockers: (c.paymentBlockers ?? []).map((b) =>
          b.id === blockerId ? { ...b, resolvedAt: nowString(), resolvedBy: '当前用户' } : b,
        ),
      }));
    },
    [updateContract],
  );

  const addDunning = useCallback(
    (contractId: string, record: Omit<DunningRecord, 'id' | 'contractId'>) => {
      updateContract(contractId, (c) => {
        const newRecord: DunningRecord = { ...record, id: `dun-${Date.now()}`, contractId };
        return { ...c, dunningRecords: [...(c.dunningRecords ?? []), newRecord] };
      });
    },
    [updateContract],
  );

  const value = useMemo<ContractsContextValue>(
    () => ({
      contracts,
      getById,
      createFromWizard,
      saveDraft,
      saveAsVersion,
      submitForApproval,
      withdrawApproval,
      approveStep,
      rejectStep,
      markMailed,
      uploadScan,
      setPrimaryScan,
      voidContract,
      addCollection,
      addBlocker,
      resolveBlocker,
      addDunning,
    }),
    [
      addBlocker,
      addCollection,
      addDunning,
      approveStep,
      contracts,
      createFromWizard,
      getById,
      markMailed,
      rejectStep,
      resolveBlocker,
      saveAsVersion,
      saveDraft,
      setPrimaryScan,
      submitForApproval,
      uploadScan,
      voidContract,
      withdrawApproval,
    ],
  );

  return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>;
}

export function useContracts(): ContractsContextValue {
  const ctx = useContext(ContractsContext);
  if (!ctx) throw new Error('useContracts must be used within ContractsProvider');
  return ctx;
}

// 便捷工具：把 ContractStatus 数组中的 statuses 数过来（用于 Tab 计数等）
export function countByStatus(contracts: Contract[]): Record<ContractStatus, number> {
  const counts: Record<ContractStatus, number> = {
    draft: 0,
    approving: 0,
    pending_mail: 0,
    pending_return: 0,
    archived: 0,
    voided: 0,
  };
  contracts.forEach((c) => {
    counts[c.status] = (counts[c.status] ?? 0) + 1;
  });
  return counts;
}
