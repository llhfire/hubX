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
import { HRPolicyBot } from '../pages/hr/components/HRPolicyBot';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './ui/sidebar';

// ── 主布局组件 ──────────────────────────────────────────────
export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
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
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Area */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="h-14 bg-white border-b border-border flex items-center px-6 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
            </div>
            <div className="flex-1" />
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
        </SidebarInset>
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
      <HRPolicyBot />
    </SidebarProvider>
  );
}
