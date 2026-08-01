'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Home,
  User,
  HeadphonesIcon,
  FlaskConical,
  FileText,
  Layers,
  Calendar,
  LayoutDashboard,
  Plane,
  Users,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  Building2,
  BarChart3,
  Bot,
  Receipt,
  CreditCard,
  FileCheck,
  Bed,
  DollarSign,
  Clock,
  MapPin,
  Wrench,
  Truck,
  BookOpen,
  Workflow,
  Shield,
  Database,
  ScrollText,
  Sliders,
  GitBranch,
  FolderTree,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarInput,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';

// ── 菜单配置类型 ──────────────────────────────────────────────
interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  children?: { key: string; label: string; badge?: string }[];
}

// ── 菜单数据 ──────────────────────────────────────────────────
const menuItems: MenuItem[] = [
  {
    key: 'workspace',
    icon: <Home className="h-4 w-4" />,
    label: '工作台',
    children: [
      { key: '/', label: '仪表盘' },
      { key: '/workbench', label: '个人工作台' },
    ],
  },
  {
    key: 'leads',
    icon: <HeadphonesIcon className="h-4 w-4" />,
    label: '线索管理',
    badge: 'New',
    children: [
      { key: '/leads/all', label: '全部线索' },
      { key: '/leads/assigned', label: '已分配线索' },
      { key: '/leads/public-pool', label: '公海线索' },
      { key: '/leads/my', label: '我的线索' },
      { key: '/leads/trash', label: '垃圾线索' },
      { key: '/leads/follow-records', label: '跟进记录' },
      { key: '/leads/high-tech', label: '高新企业线索' },
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
  {
    key: 'customers',
    icon: <User className="h-4 w-4" />,
    label: '客户管理',
    children: [
      { key: '/customers', label: '客户列表' },
    ],
  },
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
  {
    key: 'projects',
    icon: <Layers className="h-4 w-4" />,
    label: '项目管理',
    children: [
      { key: '/projects', label: '项目列表' },
      { key: '/issues', label: '工作事项' },
    ],
  },
  {
    key: 'dailyreport',
    icon: <Calendar className="h-4 w-4" />,
    label: '日报管理',
    children: [
      { key: '/dailyreport/list', label: '日报列表' },
      { key: '/dailyreport/view', label: '日报视图' },
      { key: '/dailyreport/projectlog', label: '项目视图' },
    ],
  },
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
    key: 'hr',
    icon: <Users className="h-4 w-4" />,
    label: '人资管理',
    children: [
      { key: '/hr/dashboard', label: '管理看板' },
      { key: '/hr/organization', label: '组织管理' },
      { key: '/hr/employees', label: '员工花名册' },
      { key: '/hr/recruitment', label: '招聘 ATS' },
      { key: '/hr/onboarding', label: '入职管理' },
      { key: '/hr/trial', label: '试岗跟踪' },
      { key: '/hr/attendance', label: '考勤管理' },
      { key: '/hr/performance', label: '绩效管理' },
      { key: '/hr/payroll', label: '薪资核算' },
      { key: '/hr/dispatch', label: '工作派单' },
      { key: '/hr/resignation', label: '离职管理' },
    ],
  },
  {
    key: 'finance',
    icon: <DollarSign className="h-4 w-4" />,
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
    key: 'financial-delivery',
    icon: <FileCheck className="h-4 w-4" />,
    label: '精益交付',
    badge: 'New',
    children: [
      { key: '/financial-delivery/dashboard', label: '财务仪表盘' },
      { key: '/financial-delivery/cases', label: '业务单管理' },
      { key: '/financial-delivery/feature-lists', label: '工时评估' },
      { key: '/financial-delivery/quotations', label: '报价单管理' },
      { key: '/financial-delivery/post-mortems', label: '项目决算' },
    ],
  },
  {
    key: 'operations',
    icon: <Wrench className="h-4 w-4" />,
    label: '运营支持',
    children: [
      { key: '/assets', label: '资产管理' },
      { key: '/maintenance', label: '售后运维' },
      { key: '/suppliers', label: '供应商管理' },
    ],
  },
  {
    key: 'knowledge',
    icon: <BookOpen className="h-4 w-4" />,
    label: '知识与协作',
    children: [
      { key: '/knowledge', label: '知识库' },
      { key: '/meetings', label: '会议管理' },
    ],
  },
  {
    key: 'analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    label: '数据分析',
    children: [
      { key: '/reports', label: '数据报表' },
      { key: '/roi', label: '全链路 ROI' },
    ],
  },
  {
    key: 'ai',
    icon: <Bot className="h-4 w-4" />,
    label: 'AI 能力',
    children: [
      { key: '/ai', label: 'AI 智能助手' },
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

// ── 菜单项组件 ──────────────────────────────────────────────
function NavItem({ item, isActive, onNavigate }: {
  item: MenuItem;
  isActive: (key: string) => boolean;
  onNavigate: (path: string) => void;
}) {
  const { state } = useSidebar();
  const location = useLocation();
  const isExpanded = state === 'expanded';

  const hasActiveChild = item.children?.some(child => isActive(child.key));

  // 使用受控模式，当子菜单激活时自动展开
  const [isOpen, setIsOpen] = useState(hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive(item.key)}
          onClick={() => onNavigate(item.key)}
          tooltip={item.label}
        >
          {item.icon}
          {isExpanded && <span>{item.label}</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={hasActiveChild}
            tooltip={item.label}
          >
            {item.icon}
            {isExpanded && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {isExpanded && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => {
                const childIsActive = isActive(child.key);
                return (
                  <SidebarMenuSubItem key={child.key}>
                    <SidebarMenuSubButton
                      isActive={childIsActive}
                      onClick={() => onNavigate(child.key)}
                      style={childIsActive ? { backgroundColor: 'hsl(220, 15%, 94%)', color: 'hsl(220, 15%, 16%)' } : undefined}
                    >
                      <span>{child.label}</span>
                      {child.badge && (
                        <Badge variant="outline" className="ml-auto h-4 px-1 text-xs">
                          {child.badge}
                        </Badge>
                      )}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}

// ── 侧边栏组件 ──────────────────────────────────────────────
export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // 搜索过滤
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;

    const query = searchQuery.toLowerCase();
    return menuItems.filter(item => {
      const matchesParent = item.label.toLowerCase().includes(query);
      const matchesChild = item.children?.some(
        child => child.label.toLowerCase().includes(query)
      );
      return matchesParent || matchesChild;
    });
  }, [searchQuery]);

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Logo - 与主内容区 header 对齐 */}
      <SidebarHeader className="border-b px-4 h-14 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            H
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary">HubX Ops</span>
              <span className="text-xs text-muted-foreground">运营管理系统</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Search - 菜单上方 */}
      {isExpanded && (
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SidebarInput
              placeholder="搜索菜单..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>导航菜单</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  isActive={isActive}
                  onNavigate={handleNavigate}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rail for resizing */}
      <SidebarRail />
    </Sidebar>
  );
}

export { menuItems };
