import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Plus, X, Check, AlertCircle, Info, Bell, Mail, Calendar, Clock, FileText, Download, Upload, Trash2, Edit, Eye, Filter, RefreshCw, ExternalLink, Copy, Share2, Star, Heart, Bookmark, Flag, Home, Settings, User, Loader2, MoreHorizontal, ArrowRight, CheckCircle2, AlertTriangle, XCircle, LayoutDashboard, BarChart3, Phone, MessageCircle, MapPin, Paperclip } from 'lucide-react';

// ========== 基础组件 ==========

// Button 组件
function ButtonShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-[#141517] text-white text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-800 transition-all">
          主要按钮
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition-all">
          次要按钮
        </button>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          边框按钮
        </button>
        <button className="px-4 py-2 text-gray-600 text-[13px] font-medium rounded-xl hover:bg-gray-100 transition-all">
          透明按钮
        </button>
        <button className="px-4 py-2 bg-[#ff5622] text-white text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-[#e64d1f] transition-all">
          橙色按钮
        </button>
        <button className="px-4 py-2 bg-[#18a568] text-white text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-[#159560] transition-all">
          成功按钮
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-[12px] font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-gray-200 transition-all">
          小按钮
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition-all">
          中按钮
        </button>
        <button className="px-5 py-2.5 bg-gray-100 text-gray-700 text-[14px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition-all">
          大按钮
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          带图标
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition-all flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          加载中
        </button>
        <button className="p-2 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition-all">
          <Settings className="w-4 h-4" />
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition-all flex items-center gap-2" disabled>
          禁用
        </button>
      </div>
    </div>
  );
}

// Input 组件
function InputShowcase() {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">文本输入框</label>
        <input
          type="text"
          placeholder="请输入文本..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">搜索输入框</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">带按钮输入框</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="请输入邮箱..."
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          <button className="px-4 py-2.5 bg-[#141517] text-white text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-gray-800 transition-all">
            提交
          </button>
        </div>
      </div>
      <div>
        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">禁用状态</label>
        <input
          type="text"
          placeholder="禁用输入框"
          disabled
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 text-gray-500 cursor-not-allowed"
        />
      </div>
    </div>
  );
}

// Badge 组件
function BadgeShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[12px] font-medium rounded-full">默认</span>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded-full">蓝色</span>
        <span className="px-3 py-1 bg-green-50 text-green-600 text-[12px] font-medium rounded-full">绿色</span>
        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[12px] font-medium rounded-full">橙色</span>
        <span className="px-3 py-1 bg-red-50 text-red-600 text-[12px] font-medium rounded-full">红色</span>
        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[12px] font-medium rounded-full">紫色</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[12px] font-medium rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          已批准
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-[12px] font-medium rounded-full">
          <AlertCircle className="w-3.5 h-3.5" />
          待处理
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-[12px] font-medium rounded-full">
          <XCircle className="w-3.5 h-3.5" />
          已拒绝
        </span>
      </div>
    </div>
  );
}

// Avatar 组件
function AvatarShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[12px] font-medium">JD</div>
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[13px] font-medium">AB</div>
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-[14px] font-medium">CD</div>
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[15px] font-medium">EF</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[13px] font-medium">JD</div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[13px] font-medium">KL</div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-400 rounded-full border-2 border-white" />
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-[13px] font-medium">MN</div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-white" />
        </div>
      </div>
    </div>
  );
}

// ========== 数据展示组件 ==========

// Status Badge 组件
function StatusBadgeShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eafaef] rounded-xl text-[12px] font-bold text-[#18a568]">
          <CheckCircle2 className="w-4 h-4" />
          已批准
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fff1c9] rounded-xl text-[12px] font-bold text-[#ad5528]">
          <AlertCircle className="w-4 h-4" />
          待审核...
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl text-[12px] font-medium text-[#75767a]">
          <div className="w-4 h-4 border-[2px] border-dashed border-[#a7aaaf] rounded-full" />
          进行中
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-xl text-[12px] font-bold text-red-600">
          <XCircle className="w-4 h-4" />
          已拒绝
        </span>
      </div>
    </div>
  );
}

// Card 组件
function CardShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
        <h4 className="text-[14px] font-semibold text-gray-900 mb-2">基础卡片</h4>
        <p className="text-[13px] text-gray-500">带边框的简单卡片。</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="p-5">
          <h4 className="text-[14px] font-semibold text-gray-900 mb-2">带图片卡片</h4>
          <p className="text-[13px] text-gray-500">带头部图片的卡片。</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-gray-900">文档</h4>
            <p className="text-[12px] text-gray-500">2.4 MB</p>
          </div>
        </div>
        <p className="text-[13px] text-gray-500">带图标和元数据的卡片。</p>
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
        <h4 className="text-[14px] font-semibold mb-2">深色卡片</h4>
        <p className="text-[13px] text-gray-300">深色主题的卡片变体。</p>
      </div>
    </div>
  );
}

// Table 组件
function TableShowcase() {
  const data = [
    { id: '001', name: '网站重设计', status: 'approved', progress: 100 },
    { id: '002', name: '移动应用', status: 'in_progress', progress: 65 },
    { id: '003', name: '品牌指南', status: 'pending', progress: 0 },
  ];

  return (
    <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
      <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 items-center h-[36px] px-6 text-[#697181] text-[13px] font-semibold">
        <div>编号</div>
        <div>项目名称</div>
        <div>状态</div>
        <div>进度</div>
      </div>
      <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] overflow-hidden">
        <div className="px-6">
          {data.map((item, index) => (
            <div key={item.id} className={`grid grid-cols-[1fr_2fr_1fr_1fr] gap-3 items-center h-[48px] ${index < data.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <span className="text-[13px] text-gray-400">{item.id}</span>
              <span className="text-[13px] font-semibold text-gray-900">{item.name}</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                item.status === 'approved' ? 'bg-green-50 text-green-600' :
                item.status === 'in_progress' ? 'bg-amber-50 text-amber-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {item.status === 'approved' ? '✓' : item.status === 'in_progress' ? '◎' : '○'}
                {item.status === 'approved' ? '已批准' : item.status === 'in_progress' ? '进行中' : '待处理'}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
                <span className="text-[11px] text-gray-500 w-8">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stat 组件
function StatShowcase() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: '总收入', value: '¥45,231.89', change: '+20.1%', up: true },
        { label: '活跃用户', value: '2,350', change: '+12.5%', up: true },
        { label: '转化率', value: '3.2%', change: '-0.5%', up: false },
        { label: '平均时长', value: '4分32秒', change: '+8.2%', up: true },
      ].map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200/60 p-4">
          <p className="text-[12px] text-gray-500 mb-1">{stat.label}</p>
          <p className="text-[20px] font-bold text-gray-900">{stat.value}</p>
          <p className={`text-[12px] font-medium mt-1 ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}

// ========== 导航组件 ==========

// Breadcrumb 组件
function BreadcrumbShowcase() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[13px]">
        <Home className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400 hover:text-gray-600 cursor-pointer">首页</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-gray-400 hover:text-gray-600 cursor-pointer">项目</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-gray-700 font-medium">网站重设计</span>
      </div>
      <div className="flex items-center gap-2 text-[13px] bg-gray-100/80 px-3 py-2 rounded-xl w-fit">
        <span className="text-gray-500">项目</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-500">绕行</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-700 font-medium">DEL-3</span>
      </div>
    </div>
  );
}

// Tabs 组件
function TabsShowcase() {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    { id: 'all', label: '全部', count: 24 },
    { id: 'active', label: '活跃', count: 18 },
    { id: 'inactive', label: '停用', count: 6 },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
            activeTab === tab.id
              ? 'bg-gray-100 text-gray-600'
              : 'bg-gray-200/60 text-gray-500'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

// Pagination 组件
function PaginationShowcase() {
  return (
    <div className="flex items-center gap-1">
      <button className="px-3 py-1.5 text-[13px] text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">上一页</button>
      <button className="px-3 py-1.5 text-[13px] bg-gray-900 text-white rounded-lg">1</button>
      <button className="px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">2</button>
      <button className="px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">3</button>
      <span className="px-2 text-gray-400">...</span>
      <button className="px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">10</button>
      <button className="px-3 py-1.5 text-[13px] text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">下一页</button>
    </div>
  );
}

// Steps 组件
function StepsShowcase() {
  const [currentStep, setCurrentStep] = useState(2);
  const steps = ['已下单', '处理中', '已发货', '已送达'];

  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium ${
              index < currentStep ? 'bg-[#18a568] text-white' :
              index === currentStep ? 'bg-[#141517] text-white' :
              'bg-gray-100 text-gray-500'
            }`}>
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={`text-[12px] font-medium ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}>{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-3 ${
              index < currentStep ? 'bg-[#18a568]' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ========== 反馈组件 ==========

// Alert 组件
function AlertShowcase() {
  return (
    <div className="space-y-3 max-w-lg">
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-[13px] font-medium text-blue-900">信息提示</p>
          <p className="text-[12px] text-blue-700 mt-1">这是一条信息提示消息。</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <p className="text-[13px] font-medium text-green-900">成功</p>
          <p className="text-[12px] text-green-700 mt-1">您的更改已成功保存。</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-[13px] font-medium text-amber-900">警告</p>
          <p className="text-[12px] text-amber-700 mt-1">请在继续之前进行审核。</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <p className="text-[13px] font-medium text-red-900">错误</p>
          <p className="text-[12px] text-red-700 mt-1">出了点问题。请重试。</p>
        </div>
      </div>
    </div>
  );
}

// Tooltip 组件
function TooltipShowcase() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative group">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-xl hover:bg-gray-200 transition-colors">
          悬停我
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[12px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          提示文本
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
      <div className="relative group">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-[13px] font-medium rounded-xl hover:bg-gray-200 transition-colors">
          顶部
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[12px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          顶部提示
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
}

// Toast 组件
function ToastShowcase() {
  return (
    <div className="space-y-3 max-w-sm">
      <div className="flex items-center gap-3 p-3 bg-gray-900 text-white rounded-xl shadow-lg">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <span className="text-[13px] flex-1">更改已成功保存</span>
        <button className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-lg">
        <Info className="w-5 h-5 text-blue-500" />
        <span className="text-[13px] text-gray-700 flex-1">有新的更新可用</span>
        <button className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

// ========== 布局组件 ==========

// Divider 组件
function DividerShowcase() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="h-px bg-gray-200" />
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[12px] text-gray-400">或</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[12px] text-gray-400">带文字分割线</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    </div>
  );
}

// Tag 组件
function TagShowcase() {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-[12px] font-medium rounded-lg">
        设计
        <X className="w-3 h-3 cursor-pointer hover:text-gray-900" />
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[12px] font-medium rounded-lg">
        开发
        <X className="w-3 h-3 cursor-pointer hover:text-blue-900" />
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[12px] font-medium rounded-lg">
        市场
        <X className="w-3 h-3 cursor-pointer hover:text-green-900" />
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-[12px] font-medium rounded-lg">
        研究
        <X className="w-3 h-3 cursor-pointer hover:text-purple-900" />
      </span>
    </div>
  );
}

// Progress 组件
function ProgressShowcase() {
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-gray-700">上传中...</span>
          <span className="text-[12px] text-gray-500">45%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: '45%' }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-gray-700">已完成</span>
          <span className="text-[12px] text-gray-500">100%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-gray-700">错误</span>
          <span className="text-[12px] text-gray-500">70%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 rounded-full" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}

// ========== 跟进表单组件 ==========

// 跟进表单组件（独立展示）
function FollowFormShowcase() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-6 max-w-[520px]">
      {/* 头部 */}
      <div className="mb-5">
        <h4 className="text-[16px] font-semibold text-gray-900">添加跟进记录</h4>
      </div>

      {/* 表单内容 */}
      <div className="space-y-4">
        {/* 跟进类型 + 跟进方式 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">跟进类型</label>
            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option value="普通跟进">普通跟进</option>
              <option value="需求确认">需求确认</option>
              <option value="方案演示">方案演示</option>
              <option value="商务谈判">商务谈判</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">跟进方式</label>
            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option value="电话沟通">电话沟通</option>
              <option value="微信沟通">微信沟通</option>
              <option value="上门拜访">上门拜访</option>
              <option value="邮件往来">邮件往来</option>
              <option value="线上会议">线上会议</option>
            </select>
          </div>
        </div>

        {/* 跟进内容 */}
        <div>
          <label className="block text-[12px] text-gray-500 mb-1.5">
            跟进内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="请输入跟进内容..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
          />
        </div>

        {/* 跟进时长 + 下次跟进时间 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">跟进时长（分钟）</label>
            <input
              type="number"
              placeholder="如：30"
              min="0"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">下次跟进时间</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* 线索专属字段 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">线索阶段</label>
            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option value="">请选择</option>
              <option value="初步建联">初步建联</option>
              <option value="需求确认">需求确认</option>
              <option value="方案报价">方案报价</option>
              <option value="商务谈判">商务谈判</option>
              <option value="已签单">已签单</option>
              <option value="已流失">已流失</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">意向等级</label>
            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option value="">请选择</option>
              <option value="意向高">意向高</option>
              <option value="意向中">意向中</option>
              <option value="意向低">意向低</option>
              <option value="无意向">无意向</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5">客户状态</label>
            <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option value="">请选择</option>
              <option value="有预算">有预算</option>
              <option value="需汇报领导">需汇报领导</option>
              <option value="竞品对比中">竞品对比中</option>
              <option value="价格敏感">价格敏感</option>
              <option value="决策周期长">决策周期长</option>
              <option value="已流失">已流失</option>
            </select>
          </div>
        </div>

        {/* 附件 */}
        <div>
          <label className="block text-[12px] text-gray-500 mb-1.5">附件</label>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Paperclip className="w-3.5 h-3.5" />
            添加附件
          </button>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-xl hover:bg-gray-50 transition-colors">
          取消
        </button>
        <button className="px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-xl shadow-sm hover:shadow-md transition-all">
          添加
        </button>
      </div>
    </div>
  );
}

// ========== 线索跟进组件 ==========

// 线索跟进组件（按照实际线索详情页右侧栏布局）
function LeadFollowUpShowcase() {
  const [activeTab, setActiveTab] = useState('follow');

  // 模拟线索数据
  const lead = {
    name: '张三',
    company: '腾讯科技',
    phone: '138****8888',
    email: 'zhangsan@example.com',
    status: '跟进中',
    source: '官网表单',
    lastContact: '2024-01-15',
    nextFollow: '2024-01-18',
  };

  // 模拟跟进记录
  const followRecords = [
    {
      id: 1,
      type: 'phone',
      content: '客户对产品功能感兴趣，希望了解更多细节',
      time: '2024-01-15 14:30',
      operator: '李销售',
      nextPlan: '发送产品手册',
    },
    {
      id: 2,
      type: 'visit',
      content: '上门拜访，演示产品原型，客户反馈良好',
      time: '2024-01-12 10:00',
      operator: '李销售',
      nextPlan: '安排技术对接',
    },
    {
      id: 3,
      type: 'wechat',
      content: '微信沟通确认需求，客户预算充足',
      time: '2024-01-10 16:45',
      operator: '李销售',
      nextPlan: '电话跟进',
    },
  ];

  return (
    <>
      <div className="flex gap-4">
        {/* 左侧 - 线索基础信息（模拟实际页面的 3/5 宽度） */}
        <div className="flex-1 max-w-[60%]">
          <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h4 className="text-[15px] font-semibold text-gray-900">{lead.name}</h4>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-full">
                  {lead.status}
                </span>
              </div>
              <button className="text-[12px] text-gray-500 hover:text-gray-700">编辑</button>
            </div>

            {/* 基础信息 */}
            <div className="space-y-3">
              <div className="text-[13px] font-medium text-gray-700">联系信息</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
                <div><span className="text-gray-500">线索名称：</span>{lead.name}</div>
                <div><span className="text-gray-500">联系方式：</span>{lead.phone}</div>
                <div><span className="text-gray-500">客户来源：</span>{lead.source}</div>
                <div><span className="text-gray-500">邮箱：</span>{lead.email}</div>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="text-[13px] font-medium text-gray-700">业务信息</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
                <div><span className="text-gray-500">最后联系：</span>{lead.lastContact}</div>
                <div><span className="text-gray-500">下次跟进：</span><span className="text-orange-600">{lead.nextFollow}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧 - 跟进记录（模拟实际页面的 2/5 宽度） */}
        <div className="flex-1 max-w-[40%]">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl mb-3">
            {[
              { id: 'follow', label: '跟进记录', count: followRecords.length },
              { id: 'quotation', label: '报价' },
              { id: 'travel', label: '出差申请' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    activeTab === tab.id ? 'bg-gray-100 text-gray-600' : 'bg-gray-200/60 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 跟进记录卡片 - Table 风格 */}
          <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
            {/* 表头 - 灰色背景 */}
            <div className="flex items-center justify-between h-[36px] px-5">
              <span className="text-[13px] font-semibold text-[#697181]">跟进记录</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
                <Plus className="w-3 h-3" />
                记录
              </button>
            </div>

            {/* 跟进记录时间线 - 白色背景 */}
            <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-3 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {followRecords.map((record, index) => (
                  <div key={record.id} className="flex gap-3">
                    {/* 时间线圆点 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        record.type === 'phone' ? 'bg-blue-50 text-blue-600' :
                        record.type === 'visit' ? 'bg-green-50 text-green-600' :
                        record.type === 'wechat' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {record.type === 'phone' ? <Phone className="w-3.5 h-3.5" /> :
                         record.type === 'visit' ? <MapPin className="w-3.5 h-3.5" /> :
                         record.type === 'wechat' ? <MessageCircle className="w-3.5 h-3.5" /> :
                         <Mail className="w-3.5 h-3.5" />}
                      </div>
                      {index < followRecords.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                      )}
                    </div>

                    {/* 记录内容 */}
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-semibold text-gray-900">{record.operator}</span>
                        <span className="text-[11px] text-gray-400">{record.time}</span>
                      </div>
                      <p className="text-[12px] text-gray-700 mb-1.5 leading-relaxed">{record.content}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-500">下次计划：</span>
                        <span className="text-[11px] text-orange-600 font-medium">{record.nextPlan}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ========== 侧边栏组件 ==========

// Sidebar 组件
function SidebarShowcase() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeProject, setActiveProject] = useState('aurora');

  const mainMenu = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'invoices', label: '发票', icon: <FileText className="w-4 h-4" /> },
    { id: 'requests', label: '请求', icon: <Mail className="w-4 h-4" /> },
    { id: 'reports', label: '报表', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const projects = [
    { id: 'aurora', label: 'Aurora Arzentum' },
    { id: 'detour', label: 'Detour' },
  ];

  return (
    <div className="flex gap-6">
      {/* 侧边栏 */}
      <div className="w-[240px] bg-white rounded-2xl border border-gray-200/60 p-3 flex flex-col gap-1">
        {/* 用户信息 */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-[13px] font-bold">D</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-500">Client</p>
            <p className="text-[13px] font-semibold text-gray-900 truncate">Deev Professio...</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* 通知 */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="text-[13px] text-gray-700">通知</span>
          </div>
          <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-medium flex items-center justify-center">
            2
          </span>
        </div>

        {/* 搜索框 */}
        <div className="relative px-3 py-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>

        {/* 主菜单 */}
        <div className="flex flex-col gap-0.5 mt-2">
          {mainMenu.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                activeItem === item.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gray-100 my-2" />

        {/* 项目分组 */}
        <div className="px-3 py-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">项目</p>
        </div>
        <div className="flex flex-col gap-0.5">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setActiveProject(project.id)}
              className={`px-3 py-2.5 rounded-xl text-[13px] font-medium text-left transition-all ${
                activeProject === project.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {project.label}
            </button>
          ))}
        </div>
      </div>

      {/* 预览说明 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-[14px] font-medium text-gray-700 mb-1">Sidebar Component</p>
          <p className="text-[13px] text-gray-500">左侧导航菜单，包含用户信息、通知、搜索、主菜单和项目列表</p>
        </div>
      </div>
    </div>
  );
}

// ========== 项目管理组件 ==========

// 项目概览卡片组件
function ProjectSummaryShowcase() {
  const summaryCards = [
    {
      title: '交付进度',
      level: '严重',
      levelColor: 'bg-red-50 text-red-600',
      value: '项目交付执行 / 34%',
      subtitle: '域名注册与实名认证逾期 70 天',
      extra: '下一座碑：一期交付（2026-06-15）',
    },
    {
      title: '工作项目',
      level: '预警',
      levelColor: 'bg-orange-50 text-orange-600',
      value: '11',
      subtitle: '3 需求 / 5 任务 / 3 缺陷',
      extra: '含 3 个待处理缺陷',
    },
    {
      title: '负责人',
      level: '正常',
      levelColor: 'bg-green-50 text-green-600',
      value: '李四',
      subtitle: '当前无高优先行项目',
      extra: '当前项目可优先推进',
    },
    {
      title: '交付时间',
      level: '严重',
      levelColor: 'bg-red-50 text-red-600',
      value: '已逾期 34 天',
      subtitle: '合同约定交付日：2026-06-30',
      extra: '已逾期',
    },
    {
      title: '总工时',
      level: '预警',
      levelColor: 'bg-orange-50 text-orange-600',
      value: '18.5H',
      subtitle: '王五 7.5H / 李四 6H / 赵六 5H',
      extra: '前三成员占比 100%',
    },
    {
      title: '客户动态',
      level: '正常',
      levelColor: 'bg-green-50 text-green-600',
      value: '5',
      subtitle: '3 个新需求 / 5 个任务',
      extra: '共 11 个工作日',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {summaryCards.map((card, i) => (
        <div key={i} className="bg-[#F5F6F8] rounded-2xl p-[3px]">
          <div className="bg-white rounded-[13px] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-gray-500">{card.title}</span>
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${card.levelColor}`}>
                {card.level}
              </span>
            </div>
            <p className="text-[18px] font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">{card.subtitle}</p>
            <p className="text-[11px] text-gray-400 mt-1">{card.extra}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 微信群卡片组件
function WeChatGroupShowcase() {
  return (
    <div className="bg-[#F5F6F8] rounded-2xl p-[3px]">
      <div className="bg-white rounded-[13px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-medium rounded-full">微信群</span>
                <span className="text-[14px] font-semibold text-gray-900">【0721】家具小程序开发</span>
              </div>
              <span className="text-[12px] text-gray-400 mt-1">👥 4人</span>
            </div>
          </div>
          <span className="text-[12px] text-gray-400">高</span>
        </div>
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500">今日</span>
            <span className="text-[16px] font-bold text-gray-900">47</span>
            <span className="text-[13px] text-gray-500">条消息</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-red-500">5</span>
            <span className="text-[13px] text-red-500">条待审核</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-[13px] text-gray-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              需求 <span className="font-medium text-gray-700">4</span>
            </span>
            <span className="text-[13px] text-gray-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              任务 <span className="font-medium text-gray-700">1</span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-[12px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              上次采集: 07/29 10:30:00
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              下次采集: 07/29 10:30:30
            </span>
          </div>
          <span className="text-[13px] text-blue-500 cursor-pointer hover:text-blue-600">查看详情 →</span>
        </div>
      </div>
    </div>
  );
}

// 主页面组件
export default function ComponentShowcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');

  const componentGroups = [
    {
      id: 'buttons',
      name: '按钮',
      description: '按钮组件用于触发操作或事件',
      component: <ButtonShowcase />,
    },
    {
      id: 'inputs',
      name: '输入框',
      description: '输入框组件用于收集用户数据',
      component: <InputShowcase />,
    },
    {
      id: 'badges',
      name: '徽章',
      description: '徽章组件用于状态标记',
      component: <BadgeShowcase />,
    },
    {
      id: 'avatars',
      name: '头像',
      description: '头像组件用于展示用户信息',
      component: <AvatarShowcase />,
    },
    {
      id: 'status',
      name: '状态徽章',
      description: '状态徽章用于展示任务状态',
      component: <StatusBadgeShowcase />,
    },
    {
      id: 'cards',
      name: '卡片',
      description: '卡片组件用于内容容器',
      component: <CardShowcase />,
    },
    {
      id: 'tables',
      name: '表格',
      description: '表格组件用于数据展示',
      component: <TableShowcase />,
    },
    {
      id: 'stats',
      name: '统计卡片',
      description: '统计组件用于数据概览',
      component: <StatShowcase />,
    },
    {
      id: 'breadcrumb',
      name: '面包屑导航',
      description: '面包屑导航用于层级导航',
      component: <BreadcrumbShowcase />,
    },
    {
      id: 'tabs',
      name: '选项卡',
      description: '选项卡用于内容切换',
      component: <TabsShowcase />,
    },
    {
      id: 'pagination',
      name: '分页器',
      description: '分页器用于列表分页',
      component: <PaginationShowcase />,
    },
    {
      id: 'steps',
      name: '步骤条',
      description: '步骤条用于流程引导',
      component: <StepsShowcase />,
    },
    {
      id: 'alerts',
      name: '警告提示',
      description: '警告提示用于信息反馈',
      component: <AlertShowcase />,
    },
    {
      id: 'tooltips',
      name: '文字提示',
      description: '文字提示用于辅助说明',
      component: <TooltipShowcase />,
    },
    {
      id: 'toasts',
      name: '轻提示',
      description: '轻提示用于操作反馈',
      component: <ToastShowcase />,
    },
    {
      id: 'dividers',
      name: '分割线',
      description: '分割线用于内容分隔',
      component: <DividerShowcase />,
    },
    {
      id: 'tags',
      name: '标签',
      description: '标签用于分类标记',
      component: <TagShowcase />,
    },
    {
      id: 'progress',
      name: '进度条',
      description: '进度条用于进度展示',
      component: <ProgressShowcase />,
    },
    {
      id: 'sidebar',
      name: '侧边栏',
      description: '侧边栏导航组件',
      component: <SidebarShowcase />,
    },
    {
      id: 'lead-follow',
      name: '线索跟进',
      description: '线索跟进记录与表单组件',
      component: <LeadFollowUpShowcase />,
    },
    {
      id: 'follow-form',
      name: '跟进表单',
      description: '添加跟进记录的表单组件',
      component: <FollowFormShowcase />,
    },
    {
      id: 'project-summary',
      name: '项目概览卡片',
      description: '项目概览统计卡片组件',
      component: <ProjectSummaryShowcase />,
    },
    {
      id: 'wechat-group',
      name: '微信群卡片',
      description: '微信群消息统计卡片组件',
      component: <WeChatGroupShowcase />,
    },
  ];

  const filteredGroups = componentGroups.filter(group => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           group.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-3">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">HubX</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">Components</span>
        </div>

        {/* 页面标题 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-[13px] bg-[#ffe8dc] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#ff5622]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="10" height="10" rx="2" />
              <rect x="18" y="4" width="10" height="10" rx="2" />
              <rect x="4" y="18" width="10" height="10" rx="2" />
              <rect x="18" y="18" width="10" height="10" rx="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-gray-900">组件库</h1>
            <p className="text-[13px] text-gray-500">HubX 设计系统组件库</p>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="relative flex-1 max-w-md mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索组件..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
          />
        </div>

        {/* 组件组列表 */}
        <div className="space-y-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
              {/* 组头 */}
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-[15px] font-semibold text-gray-900">{group.name}</h3>
                <p className="text-[13px] text-gray-500 mt-0.5">{group.description}</p>
              </div>

              {/* 组件预览 */}
              <div className="p-6 bg-gray-50/50">
                {group.component}
              </div>
            </div>
          ))}
        </div>

        {/* 底部统计 */}
        <div className="mt-6 text-[13px] text-gray-400">
          Showing {filteredGroups.length} of {componentGroups.length} component groups
        </div>
      </div>
    </div>
  );
}
