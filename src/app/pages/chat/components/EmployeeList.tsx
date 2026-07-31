// ============================================================
// HubX 内部通讯 — 员工列表组件
// ============================================================

import { useState } from 'react';
import { useChat } from '../ChatContext';

// Mock 员工数据（后续可复用 EmployeeContext）
const mockEmployees = [
  { id: 'emp-001', name: '张三', department: '技术部', position: '全栈开发', isOnline: true },
  { id: 'emp-002', name: '李四', department: '销售部', position: '销售经理', isOnline: true },
  { id: 'emp-003', name: '王五', department: '产品部', position: '产品经理', isOnline: false },
  { id: 'emp-004', name: '赵六', department: '设计部', position: 'UI设计师', isOnline: true },
  { id: 'emp-005', name: '钱七', department: '人事部', position: '人事专员', isOnline: false },
  { id: 'emp-006', name: '孙八', department: '财务部', position: '财务主管', isOnline: true },
  { id: 'emp-007', name: '周九', department: '技术部', position: '后端开发', isOnline: false },
  { id: 'emp-008', name: '吴十', department: '运营部', position: '运营专员', isOnline: true },
];

// 排除当前用户
const CURRENT_USER_ID = 'emp-001';

interface EmployeeListProps {
  onClose: () => void;
  /** 是否全屏模式（占满容器高度） */
  isFullScreen?: boolean;
}

export function EmployeeList({ onClose, isFullScreen = false }: EmployeeListProps) {
  const { openConversation } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = mockEmployees.filter(
    emp =>
      emp.id !== CURRENT_USER_ID &&
      (emp.name.includes(searchQuery) ||
        emp.department.includes(searchQuery) ||
        emp.position.includes(searchQuery))
  );

  const handleSelectEmployee = (employeeId: string) => {
    openConversation(employeeId);
    onClose();
  };

  // 全屏模式：占满容器高度
  if (isFullScreen) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* 头部 */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">选择聊天对象</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 搜索框 */}
        <div className="px-4 py-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索姓名/部门..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 员工列表 - 占满剩余高度 */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmployees.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">暂无匹配员工</div>
          ) : (
            filteredEmployees.map(emp => (
              <button
                key={emp.id}
                onClick={() => handleSelectEmployee(emp.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
              >
                {/* 头像 */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {emp.name.charAt(0)}
                  </div>
                  {/* 在线状态小绿点 */}
                  {emp.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{emp.name}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {emp.department} · {emp.position}
                  </div>
                </div>
                {/* 在线状态文字 */}
                <div className={`text-xs flex-shrink-0 ${emp.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                  {emp.isOnline ? '在线' : '离线'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  // Dock 模式：固定宽度的弹出层
  return (
    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-72">
      {/* 头部 */}
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">选择聊天对象</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索姓名/部门..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 员工列表 */}
      <div className="max-h-80 overflow-y-auto">
        {filteredEmployees.length === 0 ? (
          <div className="px-3 py-6 text-center text-gray-400 text-sm">暂无匹配员工</div>
        ) : (
          filteredEmployees.map(emp => (
            <button
              key={emp.id}
              onClick={() => handleSelectEmployee(emp.id)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 transition-colors text-left"
            >
              {/* 头像 */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {emp.name.charAt(0)}
                </div>
                {/* 在线状态小绿点 */}
                {emp.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{emp.name}</div>
                <div className="text-xs text-gray-400 truncate">
                  {emp.department} · {emp.position}
                </div>
              </div>
              {/* 在线状态文字 */}
              <div className={`text-xs flex-shrink-0 ${emp.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                {emp.isOnline ? '在线' : '离线'}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
