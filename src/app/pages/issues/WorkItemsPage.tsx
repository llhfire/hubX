import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useWorkItems } from './hooks/useWorkItems';
import { RequirementList } from './components/RequirementList';
import { TaskList } from './components/TaskList';
import { DefectList } from './components/DefectList';
import { getProjectName } from './mockData';
import { SPACING } from './constants';

interface WorkItemsPageProps {
  /** 嵌入模式：不显示返回导航和项目标题 */
  embedded?: boolean;
  /** 嵌入模式下需要外部传入 projectId */
  projectId?: string;
}

export function WorkItemsPage({ embedded = false, projectId: propProjectId }: WorkItemsPageProps) {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requirement');

  const projectId = propProjectId || params.id || undefined;
  const workItems = useWorkItems(projectId);
  const projectName = projectId ? getProjectName(projectId) : '所有项目';

  return (
    <div className="bg-white min-h-full">
      {/* 顶部导航栏 — TAPD 风格 */}
      <div
        className="flex items-center justify-between border-b border-[#e5e6eb]"
        style={{ padding: `${SPACING.md}px ${SPACING.lg}px` }}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-[#86909c]"
            onClick={() => projectId ? navigate(`/projects/${projectId}`) : navigate('/projects')}
          >
            <ArrowLeft />
            返回{projectId ? '项目' : '项目列表'}
          </Button>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="requirement">
                需求
                <span className="text-xs text-muted-foreground">
                  ({workItems.stats.requirement.total})
                </span>
              </TabsTrigger>
              <TabsTrigger value="task">
                任务
                <span className="text-xs text-muted-foreground">
                  ({workItems.stats.task.total})
                </span>
              </TabsTrigger>
              <TabsTrigger value="defect">
                缺陷
                <span className="text-xs text-muted-foreground">
                  ({workItems.stats.defect.total})
                </span>
              </TabsTrigger>
              <TabsTrigger value="doc" disabled>
                文档
              </TabsTrigger>
              <TabsTrigger value="wiki" disabled>
                Wiki
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">{projectName}</span>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: `${SPACING.lg}px` }}>
        {activeTab === 'requirement' && (
          <RequirementList
            items={workItems.requirements}
            workItems={workItems}
            projectId={projectId || ''}
          />
        )}
        {activeTab === 'task' && (
          <TaskList
            items={workItems.tasks}
            workItems={workItems}
            projectId={projectId || ''}
          />
        )}
        {activeTab === 'defect' && (
          <DefectList
            items={workItems.defects}
            workItems={workItems}
            projectId={projectId || ''}
          />
        )}
      </div>
    </div>
  );
}
