import { useState } from 'react';
import { Card, Tabs, Typography } from '@arco-design/web-react';
import { useWorkItems } from './hooks/useWorkItems';
import { RequirementList } from './components/RequirementList';
import { TaskList } from './components/TaskList';
import { DefectList } from './components/DefectList';
import { WorkItemStats } from './components/WorkItemStats';

const { Title } = Typography;
const TabPane = Tabs.TabPane;

interface IssuesTabProps {
  projectId: string;
}

export function IssuesTab({ projectId }: IssuesTabProps) {
  const [activeTab, setActiveTab] = useState('requirement');
  const workItems = useWorkItems(projectId);

  return (
    <div>
      {/* 统计概览 */}
      <WorkItemStats stats={workItems.stats} />

      {/* 工作项列表 */}
      <Card>
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          type="card"
        >
          <TabPane
            key="requirement"
            title={`需求 (${workItems.stats.requirement.total})`}
          >
            <RequirementList
              items={workItems.requirements}
              workItems={workItems}
              projectId={projectId}
            />
          </TabPane>
          <TabPane
            key="task"
            title={`任务 (${workItems.stats.task.total})`}
          >
            <TaskList
              items={workItems.tasks}
              workItems={workItems}
              projectId={projectId}
            />
          </TabPane>
          <TabPane
            key="defect"
            title={`缺陷 (${workItems.stats.defect.total})`}
          >
            <DefectList
              items={workItems.defects}
              workItems={workItems}
              projectId={projectId}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
