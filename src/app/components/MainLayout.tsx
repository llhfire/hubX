'use client';

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Home,
  HeadphonesIcon,
  User,
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  Calendar,
  HelpCircle,
  FlaskConical,
  Users,
  ChevronDown,
  ChevronRight,
  Menu,
  Bell,
  Layers,
  Building2,
  Wrench,
  Truck,
  BookOpen,
  BarChart3,
  Bot,
  Receipt,
  CreditCard,
  FileCheck,
  Plane,
  Bed,
  DollarSign,
  Clock,
  MapPin,
} from 'lucide-react';
import { DailyReportModal } from '../pages/daily-report/DailyReportModal';
import { RoleSelectModal } from '../pages/daily-report/RoleSelectModal';
import { DailyReport } from '../pages/daily-report/types';
import { ReminderBell, hasDailyReportUnsubmittedReminder } from '../reminders/components/ReminderBell';
import { useReminders } from '../reminders/ReminderContext';

// ── 菜单配置 ──────────────────────────────────────────────────
interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  children?: { key: string; label: string }[];
}

const menuItems: MenuItem[] = [
  { key: '/', icon: <Home className="h-4 w-4" />, label: '工作台' },
  { key: '/workbench', icon: <User className="h-4 w-4" />, label: '个人工作台' },
  {
    key: 'leads',
    icon: <HeadphonesIcon className="h-4 w-4" />,
    label: '线索管理',
    children: [
      { key: '/leads/public', label: '公海线索' },
      { key: '/leads/my', label: '我的线索' },
      { key: '/leads/trash', label: '垃圾线索' },
      { key: '/leads/governance', label: '线索治理' },
    ],
  },
  {
    key: 'lead-cost',
    icon: <FlaskConical className="h-4 w-4" />,
    label: '线索成本',
    children: [
      { key: '/lead-cost/dashboard', label: '成本看板' },
      { key: '/lead-cost/daily', label: '投放日报' },
      { key: '/lead-cost/recharge', label: '充值记录' },
      { key: '/lead-cost/analysis', label: '渠道分析' },
    ],
  },
  { key: '/customers', icon: <User className="h-4 w-4" />, label: '客户管理' },
  {
    key: 'contracts',
    icon: <FileText className="h-4 w-4" />,
    label: '合同管理',
    children: [
      { key: '/contracts', label: '合同列表' },
      { key: '/contracts/payments', label: '回款看板' },
      { key: '/contracts/forecast', label: '回款预测' },
    ],
  },
  { key: '/projects', icon: <Layers className="h-4 w-4" />, label: '项目管理' },
  {
    key: 'dailyreport',
    icon: <Calendar className="h-4 w-4" />,
    label: '日报',
    children: [
      { key: '/dailyreport/list', label: '日报列表' },
      { key: '/dailyreport/view', label: '日报视图' },
      { key: '/dailyreport/projectlog', label: '项目视图' },
    ],
  },
  { key: '/reports', icon: <LayoutDashboard className="h-4 w-4" />, label: '数据报表' },
  { key: '/assets', icon: <Layers className="h-4 w-4" />, label: '资产管理' },
  { key: '/maintenance', icon: <HeadphonesIcon className="h-4 w-4" />, label: '售后运维' },
  { key: '/suppliers', icon: <User className="h-4 w-4" />, label: '供应商管理' },
  { key: '/knowledge', icon: <FileText className="h-4 w-4" />, label: '知识库' },
  { key: '/meetings', icon: <Calendar className="h-4 w-4" />, label: '会议管理' },
  { key: '/roi', icon: <FlaskConical className="h-4 w-4" />, label: '全链路 ROI' },
  { key: '/ai', icon: <Layers className="h-4 w-4" />, label: 'AI 智能助手' },
  {
    key: 'travel',
    icon: <Plane className="h-4 w-4" />,
    label: '差旅管理',
    children: [
      { key: '/travel/trips', label: '出差管理' },
      { key: '/travel/reimbursements', label: '报销管理' },
      { key: '/travel/loans', label: '借款管理' },
      { key: '/travel/dormitory', label: '宿舍管理' },
      { key: '/travel/punch', label: '打卡' },
      { key: '/travel/standards', label: '费用标准' },
      { key: '/travel/dashboard', label: '差旅看板' },
    ],
  },
  {
    key: 'employees',
    icon: <Users className="h-4 w-4" />,
    label: '员工管理',
    children: [
      { key: '/employees', label: '员工列表' },
      { key: '/employees/attendance', label: '考勤管理' },
      { key: '/employees/performance', label: '绩效考核' },
      { key: '/employees/level-rates', label: '职级时薪设置' },
    ],
  },
  {
    key: 'finance',
    icon: <FileText className="h-4 w-4" />,
    label: '财务管理',
    children: [
      { key: '/finance/dashboard', label: '财务统计' },
      { key: '/finance/project-cost', label: '项目成本核算' },
      { key: '/finance/salary', label: '工资表' },
      { key: '/quotation', label: '报价管理' },
      { key: '/businesstrip', label: '出差申请' },
      { key: '/reimbursement', label: '报销申请' },
      { key: '/paymentinvoice', label: '回款与发票' },
    ],
  },
  {
    key: 'system',
    icon: <Settings className="h-4 w-4" />,
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

// ── 侧边栏组件 ──────────────────────────────────────────────
function Sidebar({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: (v: boolean) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/leads/')) return '/leads/my';
    if (path.startsWith('/lead-cost/')) return path;
    if (path.startsWith('/dailyreport/')) return '/dailyreport/list';
    if (path.startsWith('/customers/')) return '/customers';
    if (path.startsWith('/projects/')) return '/projects';
    if (path.startsWith('/employees/')) return '/employees';
    return path;
  };

  const toggleMenu = (key: string) => {
    setOpenMenus(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-border transition-all duration-200 ${
        collapsed ? 'w-12' : 'w-48'
      }`}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 h-14 px-4">
        <div
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
        >
          H
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-primary whitespace-nowrap">
            HubX Ops
          </span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-56px)]">
        <nav className="px-2 py-2">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.key}>
                <button
                  onClick={() => toggleMenu(item.key)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {openMenus.includes(item.key) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && openMenus.includes(item.key) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        onClick={() => navigate(child.key)}
                        className={`flex items-center w-full px-3 py-1.5 text-sm rounded-md transition-colors ${
                          location.pathname === child.key
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  getSelectedKey() === item.key
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          )}
        </nav>
      </ScrollArea>
    </div>
  );
}

// ── 主布局组件 ──────────────────────────────────────────────
export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [dailyReportVisible, setDailyReportVisible] = useState(false);
  const [roleSelectVisible, setRoleSelectVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'sales' | 'general' | 'ad-delivery' | 'dev'>('dev');
  const [currentUserId] = useState('user-sales-zhangsan');
  const { reminders, submitDailyReport } = useReminders();
  const showUnsubmittedBadge = hasDailyReportUnsubmittedReminder(reminders);

  const handleDailyReportOpen = () => {
    setSelectedRole('dev');
    setRoleSelectVisible(true);
  };

  const handleRoleSelect = (role: 'sales' | 'general' | 'ad-delivery' | 'dev') => {
    setSelectedRole(role);
    setRoleSelectVisible(false);
    setDailyReportVisible(true);
  };

  const handleDailyReportSubmit = (report: DailyReport) => {
    submitDailyReport(report);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Main Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ${
          collapsed ? 'ml-12' : 'ml-48'
        }`}
      >
        {/* Header */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-end px-6 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Daily Report */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleDailyReportOpen}
            >
              <Calendar className="h-5 w-5 text-muted-foreground" />
              {showUnsubmittedBadge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center">
                  <HelpCircle className="h-3 w-3 text-white" />
                </span>
              )}
            </Button>

            {/* Reminder Bell */}
            <ReminderBell onOpenDailyReport={handleDailyReportOpen} />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      张
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">张三</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  系统设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modals */}
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
    </div>
  );
}
