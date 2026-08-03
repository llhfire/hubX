import { useState } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';

// 模拟数据
const deliverables = [
  {
    id: 'DEL-4',
    name: 'Website UI Design',
    approver: { name: 'Karlo P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karlo' },
    lastUpdate: '-',
    status: 'pending',
    statusText: 'Review is pending...',
  },
  {
    id: 'DEL-5',
    name: 'Homepage Wireframes',
    approver: { name: 'AndrewK.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andrew' },
    lastUpdate: '-',
    status: 'in_progress',
    statusText: 'In progress',
  },
  {
    id: 'DEL-3',
    name: 'Logo Concepts',
    approver: { name: 'Anna V.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' },
    lastUpdate: 'Aug 29',
    status: 'approved',
    statusText: 'Approved',
  },
  {
    id: 'DEL-2',
    name: 'Brand Guidelines',
    approver: { name: 'Karlo P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karlo' },
    lastUpdate: 'Aug 29',
    status: 'approved',
    statusText: 'Approved',
  },
  {
    id: 'DEL-1',
    name: 'User Flow Diagrams',
    approver: { name: 'Karlo P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karlo' },
    lastUpdate: 'Aug 20',
    status: 'approved',
    statusText: 'Approved',
  },
];

// 状态标签组件
function StatusBadge({ status, text }: { status: string; text: string }) {
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fff1c9] rounded-xl text-[12px] font-bold text-[#ad5528]">
        <svg className="w-4 h-4" viewBox="0 0 32 32" fill="none">
          <g stroke="#f5bd3d" strokeLinecap="round" strokeWidth="4">
            <path d="M16 3.5v4.2" />
            <path d="M16 24.3v4.2" />
            <path d="M3.5 16h4.2" />
            <path d="M24.3 16h4.2" />
            <path d="m7.2 7.2 3 3" />
            <path d="m21.8 21.8 3 3" />
            <path d="m24.8 7.2-3 3" />
            <path d="m10.2 21.8-3 3" />
          </g>
        </svg>
        {text}
      </span>
    );
  }

  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-2 px-2 py-1.5 text-[12px] font-medium text-[#75767a]">
        <div className="w-4 h-4 border-[2px] border-dashed border-[#a7aaaf] rounded-full" />
        {text}
      </span>
    );
  }

  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eafaef] rounded-xl text-[12px] font-bold text-[#18a568]">
        <svg className="w-4 h-4" viewBox="0 0 32 32" fill="none">
          <path d="M11 4.8h10l7 7v10l-7 7H11l-7-7v-10l7-7Z" stroke="#17bb73" strokeLinejoin="round" strokeWidth="3.4" />
          <path d="m10.6 16.4 3.8 4.1 7.3-8.2" stroke="#17bb73" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.8" />
        </svg>
        {text}
      </span>
    );
  }

  return null;
}

// 表格行组件
function TableRow({ item, isLast }: { item: typeof deliverables[0]; isLast: boolean }) {
  return (
    <div className={`grid grid-cols-[2.2fr_1.3fr_0.9fr_1.1fr_0.3fr] gap-3 items-center h-[56px] ${!isLast ? 'border-b border-gray-100' : ''}`}>
      {/* 交付物名称 */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-[#a5a7aa] min-w-[42px]">{item.id}</span>
        <div className="w-9 h-9 rounded-[10px] bg-[#ffe8dc] flex items-center justify-center">
          <svg className="w-5 h-5 text-[#ff5622]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M16 5.5 10.5 11 16 16.5 21.5 11 16 5.5Z" />
            <path d="M10.5 11 5 16.5 10.5 22 16 16.5 10.5 11Z" />
            <path d="M21.5 11 16 16.5 21.5 22 27 16.5 21.5 11Z" />
            <path d="M16 16.5 10.5 22 16 27.5 21.5 22 16 16.5Z" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-[#141517]">{item.name}</span>
      </div>

      {/* 审批人 */}
      <div>
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#f4f4f5] rounded-xl">
          <img src={item.approver.avatar} alt="" className="w-6 h-6 rounded-lg object-cover" />
          <span className="text-[13px] font-semibold text-[#4d5868]">{item.approver.name}</span>
        </div>
      </div>

      {/* 最后更新 */}
      <div>
        <span className="text-[13px] font-medium text-[#77787b]">{item.lastUpdate}</span>
      </div>

      {/* 状态 */}
      <div>
        <StatusBadge status={item.status} text={item.statusText} />
      </div>

      {/* 操作 */}
      <div className="flex items-center justify-end">
        {item.status === 'pending' ? (
          <svg className="w-6 h-6 text-[#77787b]" viewBox="0 0 48 48" fill="none">
            <path d="M8 24h30" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5" />
            <path d="m27 13 11 11-11 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />
          </svg>
        ) : (
          <div className="grid justify-items-center gap-[4px] w-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#77787b]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#77787b]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#77787b]" />
          </div>
        )}
      </div>
    </div>
  );
}

// 主页面组件
export default function DeliverablesListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: deliverables.length },
    { id: 'pending', label: 'Pending', count: deliverables.filter(d => d.status === 'pending').length },
    { id: 'in_progress', label: 'In Progress', count: deliverables.filter(d => d.status === 'in_progress').length },
    { id: 'approved', label: 'Approved', count: deliverables.filter(d => d.status === 'approved').length },
  ];

  const filteredDeliverables = deliverables.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Projects</span>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Detour</span>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-700 font-medium">DEL-3</span>
        </div>

        {/* 页面标题 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-[13px] bg-[#ffe8dc] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#ff5622]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 5.5 10.5 11 16 16.5 21.5 11 16 5.5Z" />
              <path d="M10.5 11 5 16.5 10.5 22 16 16.5 10.5 11Z" />
              <path d="M21.5 11 16 16.5 21.5 22 27 16.5 21.5 11Z" />
              <path d="M16 16.5 10.5 22 16 27.5 21.5 22 16 16.5Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Deliverables</h1>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            All Locations
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            All Tags
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex items-center gap-1 mb-5 bg-gray-100/80 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-200/60 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 表格卡片 - 参考 HTML 实现 */}
        <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
          {/* 表头 - 和外层容器同色 */}
          <div className="grid grid-cols-[2.2fr_1.3fr_0.9fr_1.1fr_0.3fr] gap-3 items-center h-[36px] px-6 text-[#697181] text-[13px] font-semibold">
            <div>Deliverable name</div>
            <div>Approver</div>
            <div>Last update</div>
            <div>Status</div>
            <div></div>
          </div>

          {/* 表格内容 - 白色背景，向上偏移 */}
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] overflow-hidden">
            <div className="px-6">
              {filteredDeliverables.map((item, index) => (
                <TableRow
                  key={item.id}
                  item={item}
                  isLast={index === filteredDeliverables.length - 1}
                />
              ))}
            </div>

            {/* 添加按钮 */}
            <div className="px-6 py-3">
              <button className="inline-flex items-center gap-3 px-4 py-2 bg-[#f5f5f5] rounded-[10px] text-[13px] font-bold text-[#151618] hover:bg-[#ebebeb] transition-colors">
                <svg className="w-3.5 h-3.5 text-[#737477]" viewBox="0 0 32 32" fill="none">
                  <path d="M16 5v22M5 16h22" stroke="currentColor" strokeLinecap="round" strokeWidth="3.2" />
                </svg>
                Add deliverable
              </button>
            </div>
          </div>
        </div>

        {/* 分页信息 */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredDeliverables.length} of {deliverables.length} entries
        </div>
      </div>
    </div>
  );
}
