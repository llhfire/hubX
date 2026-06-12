import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Layout, Menu, Avatar, Dropdown, Badge } from '@arco-design/web-react';
import {
  IconHome,
  IconCustomerService,
  IconUser,
  IconFile,
  IconApps,
  IconDashboard,
  IconSettings,
  IconPoweroff,
  IconCalendar,
  IconQuestionCircle,
  IconExperiment,
} from '@arco-design/web-react/icon';
import { DailyReportModal } from '../pages/daily-report/DailyReportModal';
import { RoleSelectModal } from '../pages/daily-report/RoleSelectModal';
import { DailyReport } from '../pages/daily-report/types';
import { ReminderBell, hasDailyReportUnsubmittedReminder } from '../reminders/components/ReminderBell';
import { useReminders } from '../reminders/ReminderContext';

const Sider = Layout.Sider;
const Header = Layout.Header;
const Content = Layout.Content;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [dailyReportVisible, setDailyReportVisible] = useState(false);
  const [roleSelectVisible, setRoleSelectVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'sales' | 'general'>('sales');
  const [currentUserId] = useState('user-sales-zhangsan');
  const { reminders, submitDailyReport } = useReminders();
  const showUnsubmittedBadge = hasDailyReportUnsubmittedReminder(reminders);

  const handleDailyReportOpen = () => {
    setSelectedRole('sales');
    setRoleSelectVisible(true);
  };

  const handleRoleSelect = (role: 'sales' | 'general') => {
    setSelectedRole(role);
    setRoleSelectVisible(false);
    setDailyReportVisible(true);
  };

  const handleDailyReportSubmit = (report: DailyReport) => {
    submitDailyReport(report);
  };

  const menuItems = [
    { key: '/', icon: <IconHome />, label: '工作台' },
    {
      key: 'leads',
      icon: <IconCustomerService />,
      label: '线索管理',
      children: [
        { key: '/leads/public', label: '公海线索' },
        { key: '/leads/my', label: '我的线索' },
        { key: '/leads/trash', label: '垃圾线索' },
      ],
    },
    {
      key: 'lead-cost',
      icon: <IconExperiment />,
      label: '线索成本',
      children: [
        { key: '/lead-cost/dashboard', label: '成本看板' },
        { key: '/lead-cost/daily', label: '投放日报' },
        { key: '/lead-cost/recharge', label: '充值记录' },
        { key: '/lead-cost/analysis', label: '渠道分析' },
      ],
    },
    { key: '/customers', icon: <IconUser />, label: '客户管理' },
    { key: '/contracts', icon: <IconFile />, label: '合同管理' },
    { key: '/projects', icon: <IconApps />, label: '项目管理' },
    {
      key: 'dailyreport',
      icon: <IconCalendar />,
      label: '日报',
      children: [
        { key: '/dailyreport/list', label: '日报列表' },
        { key: '/dailyreport/view', label: '日报视图' },
        { key: '/dailyreport/projectlog', label: '项目视图' },
      ],
    },
    { key: '/reports', icon: <IconDashboard />, label: '数据报表' },
    {
      key: 'finance',
      icon: <IconFile />,
      label: '财务管理',
      children: [
        { key: '/finance/dashboard', label: '财务统计' },
        { key: '/finance/salary', label: '工资表' },
        { key: '/quotation', label: '报价管理' },
        { key: '/businesstrip', label: '出差申请' },
        { key: '/reimbursement', label: '报销申请' },
        { key: '/paymentinvoice', label: '回款与发票' },
      ],
    },
    {
      key: 'system',
      icon: <IconSettings />,
      label: '系统管理',
      children: [
        { key: '/system/organization', label: '组织架构' },
        { key: '/system/permission', label: '用户权限' },
        { key: '/system/company', label: '本公司主体' },
        { key: '/system/dictionary', label: '数据字典' },
        { key: '/system/log', label: '系统日志' },
        { key: '/system/config', label: '系统配置' },
        { key: '/system/workflow', label: '审批模板管理' },
        { key: '/system/bizapproval', label: '业务审批配置' },
        { key: '/system/expensecategory', label: '费用分类管理' },
      ],
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/leads/')) {
      if (path === '/leads/public' || path === '/leads/my' || path === '/leads/trash') {
        return [path];
      }
      return ['/leads/my'];
    }
    if (path.startsWith('/lead-cost/')) {
      return [path];
    }
    if (path.startsWith('/dailyreport/')) {
      if (path === '/dailyreport/list' || path === '/dailyreport/view' || path === '/dailyreport/projectlog') {
        return [path];
      }
      return ['/dailyreport/list'];
    }
    if (path.startsWith('/customers/')) {
      return ['/customers'];
    }
    if (path.startsWith('/projects/')) {
      return ['/projects'];
    }
    return [path];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/leads/')) {
      return ['leads'];
    }
    if (path.startsWith('/lead-cost/')) {
      return ['lead-cost'];
    }
    if (path.startsWith('/dailyreport/')) {
      return ['dailyreport'];
    }
    if (path.startsWith('/system/')) {
      return ['system'];
    }
    if (
      path.startsWith('/finance/') ||
      path === '/quotation' ||
      path === '/businesstrip' ||
      path === '/reimbursement' ||
      path === '/paymentinvoice'
    ) {
      return ['finance'];
    }
    return [];
  };

  const dropList = (
    <Menu>
      <MenuItem key="profile">
        <IconUser style={{ marginRight: 8 }} />
        个人中心
      </MenuItem>
      <MenuItem key="settings">
        <IconSettings style={{ marginRight: 8 }} />
        系统设置
      </MenuItem>
      <Menu.Item key="logout">
        <IconPoweroff style={{ marginRight: 8 }} />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="h-screen">
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsible
        breakpoint="lg"
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="flex items-center justify-center px-4"
          style={{ height: 64, borderBottom: '1px solid var(--color-border-2)' }}
        >
          {!collapsed && (
            <span style={{ fontSize: 18, fontWeight: 600, color: 'rgb(var(--primary-6))' }}>
              HubX
            </span>
          )}
          {collapsed && (
            <span style={{ fontSize: 18, fontWeight: 600, color: 'rgb(var(--primary-6))' }}>
              CRM
            </span>
          )}
        </div>
        <Menu
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          onClickMenuItem={handleMenuClick}
          style={{ marginTop: 16 }}
        >
          {menuItems.map((item) =>
            item.children ? (
              <SubMenu
                key={item.key}
                title={
                  <>
                    {item.icon}
                    {item.label}
                  </>
                }
              >
                {item.children.map((child) => (
                  <MenuItem key={child.key}>{child.label}</MenuItem>
                ))}
              </SubMenu>
            ) : (
              <MenuItem key={item.key}>
                {item.icon}
                {item.label}
              </MenuItem>
            )
          )}
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 48 : 200, transition: 'margin 0.2s' }}>
        <Header
          style={{
            height: 64,
            background: 'var(--color-bg-2)',
            borderBottom: '1px solid var(--color-border-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div></div>
          <div className="flex items-center gap-4">
            <Badge
              count={
                showUnsubmittedBadge ? (
                  <IconQuestionCircle style={{ color: 'red', fontSize: 16 }} />
                ) : (
                  0
                )
              }
              style={{ display: showUnsubmittedBadge ? 'flex' : 'none' }}
            >
              <IconCalendar style={{ fontSize: 20, cursor: 'pointer' }} onClick={handleDailyReportOpen} />
            </Badge>
            <ReminderBell onOpenDailyReport={handleDailyReportOpen} />
            <Dropdown droplist={dropList} position="br">
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar size={32} style={{ backgroundColor: 'rgb(var(--primary-6))' }}>
                  张
                </Avatar>
                <span>张三</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            background: 'var(--color-fill-1)',
          }}
        >
          <div style={{ padding: 24 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      <DailyReportModal
        visible={dailyReportVisible}
        onCancel={() => setDailyReportVisible(false)}
        onSubmit={handleDailyReportSubmit}
        currentUserId={currentUserId}
        defaultRole={selectedRole}
      />

      <RoleSelectModal
        visible={roleSelectVisible}
        onCancel={() => setRoleSelectVisible(false)}
        onSelect={handleRoleSelect}
      />
    </Layout>
  );
}
