import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, Space, Tabs, Typography } from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { useWorkItems } from './hooks/useWorkItems';
import { RequirementList } from './components/RequirementList';
import { TaskList } from './components/TaskList';
import { DefectList } from './components/DefectList';
import { getProjectName } from './mockData';
import { SPACING } from './constants';

const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;

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
    <div style={{ background: '#fff', minHeight: '100%' }}>
      {/* 顶部导航栏 — TAPD 风格 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${SPACING.md}px ${SPACING.lg}px`,
        borderBottom: '1px solid #e5e6eb',
      }}>
        <Space size={SPACING.lg}>
          <Button
            type="text"
            icon={<IconLeft />}
            onClick={() => projectId ? navigate(`/projects/${projectId}`) : navigate('/projects')}
            style={{ color: '#86909c' }}
          >
            返回{projectId ? '项目' : '项目列表'}
          </Button>
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            size="large"
            style={{ marginBottom: 0 }}
          >
            <TabPane
              key="requirement"
              title={
                <Space size={4}>
                  <span>需求</span>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ({workItems.stats.requirement.total})
                  </Text>
                </Space>
              }
            />
            <TabPane
              key="task"
              title={
                <Space size={4}>
                  <span>任务</span>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ({workItems.stats.task.total})
                  </Text>
                </Space>
              }
            />
            <TabPane
              key="defect"
              title={
                <Space size={4}>
                  <span>缺陷</span>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ({workItems.stats.defect.total})
                  </Text>
                </Space>
              }
            />
            <TabPane key="doc" title="文档" disabled />
            <TabPane key="wiki" title="Wiki" disabled />
          </Tabs>
        </Space>
        <Space>
          <Text type="secondary" style={{ fontSize: 13 }}>{projectName}</Text>
        </Space>
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
