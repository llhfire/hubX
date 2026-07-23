import { useCallback, useMemo, useState } from 'react';
import {
  Comment,
  Defect,
  Requirement,
  Task,
  WorkItem,
  WorkItemActions,
  WorkItemLink,
  WorkItemPriority,
  WorkItemFilter,
} from '../types';
import {
  createInitialStore,
  generateId,
  generateProjectNo,
} from '../mockData';

// ============================================================
// 状态管理 Hook
// ============================================================

export function useWorkItems(projectId?: string): WorkItemActions {
  const [store, setStore] = useState(createInitialStore);

  // ── 当前项目的工作项（projectId 为空时显示所有） ────────
  const projectRequirements = useMemo(
    () => projectId ? store.requirements.filter(r => r.projectId === projectId) : store.requirements,
    [store.requirements, projectId]
  );

  const projectTasks = useMemo(
    () => projectId ? store.tasks.filter(t => t.projectId === projectId) : store.tasks,
    [store.tasks, projectId]
  );

  const projectDefects = useMemo(
    () => projectId ? store.defects.filter(d => d.projectId === projectId) : store.defects,
    [store.defects, projectId]
  );

  const allWorkItems = useMemo(
    () => [...projectRequirements, ...projectTasks, ...projectDefects],
    [projectRequirements, projectTasks, projectDefects]
  );

  // ── 创建 ──────────────────────────────────────────────
  const createRequirement = useCallback((data: Omit<Requirement, 'id' | 'projectNo' | 'type' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => {
      const projectReqs = prev.requirements.filter(r => r.projectId === data.projectId);
      const newItem: Requirement = {
        ...data,
        id: generateId(),
        projectNo: nextProjectNo(projectReqs, 'REQ-'),
        type: 'requirement',
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...prev,
        requirements: [...prev.requirements, newItem],
        activityLogs: [...prev.activityLogs, {
          id: generateId(),
          workItemId: newItem.id,
          workItemType: 'requirement' as const,
          actorId: data.creatorId,
          action: 'create' as const,
          createdAt: now,
        }],
      };
    });
  }, []);

  const createTask = useCallback((data: Omit<Task, 'id' | 'projectNo' | 'type' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => {
      const projectTsks = prev.tasks.filter(t => t.projectId === data.projectId);
      const newItem: Task = {
        ...data,
        id: generateId(),
        projectNo: nextProjectNo(projectTsks, 'TSK-'),
        type: 'task',
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...prev,
        tasks: [...prev.tasks, newItem],
        activityLogs: [...prev.activityLogs, {
          id: generateId(),
          workItemId: newItem.id,
          workItemType: 'task' as const,
          actorId: data.creatorId,
          action: 'create' as const,
          createdAt: now,
        }],
      };
    });
  }, []);

  const createDefect = useCallback((data: Omit<Defect, 'id' | 'projectNo' | 'type' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => {
      const projectBugs = prev.defects.filter(d => d.projectId === data.projectId);
      const newItem: Defect = {
        ...data,
        id: generateId(),
        projectNo: nextProjectNo(projectBugs, 'BUG-'),
        type: 'defect',
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...prev,
        defects: [...prev.defects, newItem],
        activityLogs: [...prev.activityLogs, {
          id: generateId(),
          workItemId: newItem.id,
          workItemType: 'defect' as const,
          actorId: data.creatorId,
          action: 'create' as const,
          createdAt: now,
        }],
      };
    });
  }, []);

  // ── 更新状态 ──────────────────────────────────────────
  const updateRequirementStatus = useCallback((id: string, status: Requirement['status'], actorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => {
      const old = prev.requirements.find(r => r.id === id);
      return {
        ...prev,
        requirements: prev.requirements.map(r =>
          r.id === id ? { ...r, status, updatedAt: now } : r
        ),
        activityLogs: [...prev.activityLogs, {
          id: generateId(),
          workItemId: id,
          workItemType: 'requirement' as const,
          actorId,
          action: 'status_change' as const,
          field: 'status',
          oldValue: old?.status,
          newValue: status,
          createdAt: now,
        }],
      };
    });
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Task['status'], actorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => {
      const old = prev.tasks.find(t => t.id === id);
      return {
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === id ? { ...t, status, updatedAt: now } : t
        ),
        activityLogs: [...prev.activityLogs, {
          id: generateId(),
          workItemId: id,
          workItemType: 'task' as const,
          actorId,
          action: 'status_change' as const,
          field: 'status',
          oldValue: old?.status,
          newValue: status,
          createdAt: now,
        }],
      };
    });
  }, []);

  const updateDefectStatus = useCallback((id: string, status: Defect['status'], actorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => {
      const old = prev.defects.find(d => d.id === id);
      return {
        ...prev,
        defects: prev.defects.map(d =>
          d.id === id ? { ...d, status, updatedAt: now } : d
        ),
        activityLogs: [...prev.activityLogs, {
          id: generateId(),
          workItemId: id,
          workItemType: 'defect' as const,
          actorId,
          action: 'status_change' as const,
          field: 'status',
          oldValue: old?.status,
          newValue: status,
          createdAt: now,
        }],
      };
    });
  }, []);

  // ── 编辑字段 ──────────────────────────────────────────
  const updateRequirement = useCallback((id: string, data: Partial<Requirement>, actorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => ({
      ...prev,
      requirements: prev.requirements.map(r =>
        r.id === id ? { ...r, ...data, updatedAt: now } : r
      ),
      activityLogs: [...prev.activityLogs, {
        id: generateId(),
        workItemId: id,
        workItemType: 'requirement' as const,
        actorId,
        action: 'edit' as const,
        createdAt: now,
      }],
    }));
  }, []);

  const updateTask = useCallback((id: string, data: Partial<Task>, actorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id ? { ...t, ...data, updatedAt: now } : t
      ),
      activityLogs: [...prev.activityLogs, {
        id: generateId(),
        workItemId: id,
        workItemType: 'task' as const,
        actorId,
        action: 'edit' as const,
        createdAt: now,
      }],
    }));
  }, []);

  const updateDefect = useCallback((id: string, data: Partial<Defect>, actorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => ({
      ...prev,
      defects: prev.defects.map(d =>
        d.id === id ? { ...d, ...data, updatedAt: now } : d
      ),
      activityLogs: [...prev.activityLogs, {
        id: generateId(),
        workItemId: id,
        workItemType: 'defect' as const,
        actorId,
        action: 'edit' as const,
        createdAt: now,
      }],
    }));
  }, []);

  // ── 评论 ──────────────────────────────────────────────
  const addComment = useCallback((workItemId: string, workItemType: Comment['workItemType'], authorId: string, content: string, mentions: string[] = []) => {
    const now = new Date().toISOString().split('T')[0];
    setStore(prev => ({
      ...prev,
      comments: [...prev.comments, {
        id: generateId(),
        workItemId,
        workItemType,
        authorId,
        content,
        mentions,
        createdAt: now,
      }],
      activityLogs: [...prev.activityLogs, {
        id: generateId(),
        workItemId,
        workItemType,
        actorId: authorId,
        action: 'comment' as const,
        createdAt: now,
      }],
    }));
  }, []);

  const getComments = useCallback((workItemId: string) => {
    return store.comments.filter(c => c.workItemId === workItemId);
  }, [store.comments]);

  // ── 操作历史 ──────────────────────────────────────────
  const getActivityLogs = useCallback((workItemId: string) => {
    return store.activityLogs.filter(l => l.workItemId === workItemId);
  }, [store.activityLogs]);

  // ── 关联 ──────────────────────────────────────────────
  const addLink = useCallback((sourceId: string, targetId: string) => {
    setStore(prev => ({
      ...prev,
      links: [...prev.links, {
        id: generateId(),
        sourceId,
        targetId,
        createdAt: new Date().toISOString().split('T')[0],
      }],
    }));
  }, []);

  const getLinks = useCallback((workItemId: string) => {
    return store.links.filter(l => l.sourceId === workItemId || l.targetId === workItemId);
  }, [store.links]);

  // ── 复制 ──────────────────────────────────────────────
  const duplicateWorkItem = useCallback((item: WorkItem, newProjectId?: string) => {
    const now = new Date().toISOString().split('T')[0];
    const targetProjectId = newProjectId || item.projectId;

    if (item.type === 'requirement') {
      setStore(prev => {
        const projectReqs = prev.requirements.filter(r => r.projectId === targetProjectId);
        const newItem: Requirement = {
          ...item,
          id: generateId(),
          projectNo: nextProjectNo(projectReqs, 'REQ-'),
          title: `${item.title} (副本)`,
          status: '待处理',
          createdAt: now,
          updatedAt: now,
          projectId: targetProjectId,
        };
        return {
          ...prev,
          requirements: [...prev.requirements, newItem],
          activityLogs: [...prev.activityLogs, {
            id: generateId(),
            workItemId: newItem.id,
            workItemType: 'requirement' as const,
            actorId: item.creatorId,
            action: 'create' as const,
            createdAt: now,
          }],
        };
      });
    } else if (item.type === 'task') {
      setStore(prev => {
        const projectTsks = prev.tasks.filter(t => t.projectId === targetProjectId);
        const newItem: Task = {
          ...item,
          id: generateId(),
          projectNo: nextProjectNo(projectTsks, 'TSK-'),
          title: `${item.title} (副本)`,
          status: '待处理',
          actualHours: 0,
          checklist: item.checklist.map(c => ({ ...c, id: generateId(), done: false })),
          createdAt: now,
          updatedAt: now,
          projectId: targetProjectId,
        };
        return {
          ...prev,
          tasks: [...prev.tasks, newItem],
          activityLogs: [...prev.activityLogs, {
            id: generateId(),
            workItemId: newItem.id,
            workItemType: 'task' as const,
            actorId: item.creatorId,
            action: 'create' as const,
            createdAt: now,
          }],
        };
      });
    } else {
      setStore(prev => {
        const projectBugs = prev.defects.filter(d => d.projectId === targetProjectId);
        const newItem: Defect = {
          ...item,
          id: generateId(),
          projectNo: nextProjectNo(projectBugs, 'BUG-'),
          title: `${item.title} (副本)`,
          status: '待处理',
          createdAt: now,
          updatedAt: now,
          projectId: targetProjectId,
        };
        return {
          ...prev,
          defects: [...prev.defects, newItem],
          activityLogs: [...prev.activityLogs, {
            id: generateId(),
            workItemId: newItem.id,
            workItemType: 'defect' as const,
            actorId: item.creatorId,
            action: 'create' as const,
            createdAt: now,
          }],
        };
      });
    }
  }, []);

  // ── 筛选 ──────────────────────────────────────────────
  const filterItems = useCallback((items: WorkItem[], filter: WorkItemFilter) => {
    return items.filter(item => {
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(kw);
        const matchDesc = item.description.toLowerCase().includes(kw);
        if (!matchTitle && !matchDesc) return false;
      }
      if (filter.status.length > 0 && !filter.status.includes(item.status)) return false;
      if (filter.priority.length > 0 && !filter.priority.includes(item.priority)) return false;
      if (filter.assigneeId.length > 0 && !filter.assigneeId.includes(item.assigneeId)) return false;
      if (filter.creatorId.length > 0 && !filter.creatorId.includes(item.creatorId)) return false;

      // 处理额外筛选条件（如缺陷的严重程度）
      const standardKeys = ['keyword', 'status', 'priority', 'assigneeId', 'creatorId', 'dateRange'];
      for (const key of Object.keys(filter)) {
        if (standardKeys.includes(key)) continue;
        const filterValue = filter[key];
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          const itemValue = (item as any)[key];
          if (itemValue && !filterValue.includes(itemValue)) return false;
        }
      }

      return true;
    });
  }, []);

  // ── 统计 ──────────────────────────────────────────────
  const stats = useMemo(() => ({
    requirement: {
      total: projectRequirements.length,
      pending: projectRequirements.filter(r => r.status === '待处理').length,
      inProgress: projectRequirements.filter(r => r.status === '进行中').length,
      completed: projectRequirements.filter(r => r.status === '已完成').length,
    },
    task: {
      total: projectTasks.length,
      pending: projectTasks.filter(t => t.status === '待处理').length,
      inProgress: projectTasks.filter(t => t.status === '进行中').length,
      completed: projectTasks.filter(t => t.status === '已完成').length,
      blocked: projectTasks.filter(t => t.status === '已阻塞').length,
    },
    defect: {
      total: projectDefects.length,
      pending: projectDefects.filter(d => d.status === '待处理').length,
      inProgress: projectDefects.filter(d => d.status === '处理中').length,
      toVerify: projectDefects.filter(d => d.status === '待验证').length,
      closed: projectDefects.filter(d => d.status === '已关闭').length,
    },
  }), [projectRequirements, projectTasks, projectDefects]);

  return {
    // 数据
    requirements: projectRequirements,
    tasks: projectTasks,
    defects: projectDefects,
    allWorkItems,
    comments: store.comments,
    activityLogs: store.activityLogs,
    links: store.links,
    // 创建
    createRequirement,
    createTask,
    createDefect,
    // 状态流转
    updateRequirementStatus,
    updateTaskStatus,
    updateDefectStatus,
    // 编辑
    updateRequirement,
    updateTask,
    updateDefect,
    // 评论
    addComment,
    getComments,
    // 操作历史
    getActivityLogs,
    // 关联
    addLink,
    getLinks,
    // 复制
    duplicateWorkItem,
    // 筛选
    filterItems,
    // 统计
    stats,
  };
}
