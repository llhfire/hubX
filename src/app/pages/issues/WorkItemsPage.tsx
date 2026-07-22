import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, Card, Grid, Space, Tabs, Typography } from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { useWorkItems } from './hooks/useWorkItems';
import { RequirementList } from './components/RequirementList';
import { TaskList } from './components/TaskList';
import { DefectList } from './components/DefectList';
import { WorkItemStats } from './components/WorkItemStats';
import { getProjectName } from './mockData';

const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;

export function WorkItemsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requirement');

  if (!projectId) return <div>缺少项目 ID</div>;

  const workItems = useWorkItems(projectId);
  const projectName = getProjectName(projectId);

  return (
    <div>
      {/* 顶部导航 */}
      <Space style={{ marginBottom: 16 }}>
        <Button type="text" icon={<IconLeft />} onClick={() => navigate(`/projects/${projectId}`)}>
          返回项目
        </Button>
        <Title heading={4} style={{ margin: 0 }}>工作项 — {projectName}</Title>
      </Space>

      {/* 统计概览 */}
      <WorkItemStats stats={workItems.stats} />

      {/* 工作项列表 */}
      <Card>
        <Tabs activeTab={activeTab} onChange={setActiveTab} type="card">
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
