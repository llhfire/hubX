import { useState } from 'react';
import {
  Card,
  Input,
  Select,
  DatePicker,
  Button,
  Avatar,
  Tag,
  Space,
  Typography,
  Collapse,
  Badge,
} from '@arco-design/web-react';
import { IconSearch, IconRefresh, IconExport, IconFile, IconDown, IconRight } from '@arco-design/web-react/icon';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const CollapseItem = Collapse.Item;

type ActionType = '申请' | '通过' | '驳回' | '新增' | '修改' | '上传' | '删除';
type BizModule = '出差' | '报销' | '报价' | '合同' | '项目';

interface FieldChange {
  field: string;
  before: string;
  after: string;
}

interface LogAttachment {
  name: string;
  size: string;
}

interface LogEntry {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  bizModule: BizModule;
  actionType: ActionType;
  summary: string;
  bizNo: string;
  comment: string;
  changes: FieldChange[];
  attachments: LogAttachment[];
  createdAt: string;
  workHours?: number;
  workContent?: string;
}

const allProjects = [
  { value: 'all', label: '全部项目' },
  { value: 'PRJ001', label: 'A公司CRM系统开发' },
  { value: 'PRJ002', label: 'B公司电商平台开发' },
  { value: 'PRJ003', label: 'C公司移动应用开发' },
];

const allMembers = [
  { value: '张三', label: '张三' },
  { value: '李四', label: '李四' },
  { value: '王五', label: '王五' },
  { value: '赵六', label: '赵六' },
  { value: '孙七', label: '孙七' },
];

const actionTypeOptions: ActionType[] = ['申请', '通过', '驳回', '新增', '修改', '上传', '删除'];

const actionColorMap: Record<ActionType, string> = {
  申请: 'gray',
  通过: 'green',
  驳回: 'red',
  新增: 'arcoblue',
  修改: 'orange',
  上传: 'purple',
  删除: 'red',
};

const bizModuleColorMap: Record<BizModule, string> = {
  出差: 'cyan',
  报销: 'orange',
  报价: 'purple',
  合同: 'arcoblue',
  项目: 'green',
};

const mockLogs: LogEntry[] = [
  {
    id: '1',
    projectId: 'PRJ001',
    projectName: 'A公司CRM系统开发',
    userId: 'u1',
    userName: '张三',
    bizModule: '项目',
    actionType: '修改',
    summary: '更新项目进度至 75%，并备注当前里程碑完成情况',
    bizNo: 'PRJ202604001',
    comment: '前端模块已完成，正在联调后端接口，预计本周末完成集成测试。',
    changes: [
      { field: '项目进度', before: '60%', after: '75%' },
      { field: '风险等级', before: '延期风险', after: '正常' },
    ],
    attachments: [{ name: '集成测试报告_v1.pdf', size: '2.3 MB' }],
    createdAt: '2026-05-06 17:42',
    workHours: 6.5,
    workContent: '完成用户管理模块前端开发，包括用户列表、新增编辑、权限分配等功能；完成与后端API的联调工作；编写前端单元测试用例；协助UI设计师优化交互细节。',
  },
  {
    id: '2',
    projectId: 'PRJ001',
    projectName: 'A公司CRM系统开发',
    userId: 'u3',
    userName: '王五',
    bizModule: '出差',
    actionType: '通过',
    summary: '出差申请"BT20260425001"已通过部门审批环节',
    bizNo: 'BT20260425001',
    comment: '行程合理，费用预估在标准内，同意出行。',
    changes: [
      { field: '审批状态', before: '待审批', after: '已通过' },
    ],
    attachments: [],
    createdAt: '2026-05-06 14:15',
  },
  {
    id: '3',
    projectId: 'PRJ001',
    projectName: 'A公司CRM系统开发',
    userId: 'u2',
    userName: '李四',
    bizModule: '报销',
    actionType: '申请',
    summary: '提交报销申请"RB20260506001"，金额 ¥4,800',
    bizNo: 'RB20260506001',
    comment: '本次差旅含高铁往返及住宿3晚，请审核。',
    changes: [
      { field: '报销金额', before: '—', after: '¥4,800' },
      { field: '报销状态', before: '—', after: '待审批' },
    ],
    attachments: [
      { name: '高铁票据.jpg', size: '0.8 MB' },
      { name: '酒店发票.pdf', size: '1.1 MB' },
    ],
    createdAt: '2026-05-06 10:30',
  },
  {
    id: '4',
    projectId: 'PRJ001',
    projectName: 'A公司CRM系统开发',
    userId: 'u4',
    userName: '赵六',
    bizModule: '报价',
    actionType: '驳回',
    summary: '报价单"QT20260505001"被财务审批驳回',
    bizNo: 'QT20260505001',
    comment: '报价金额超出预算上限15%，请重新核算并提交修订版本。',
    changes: [
      { field: '报价状态', before: '待审批', after: '已拒绝' },
      { field: '报价金额', before: '¥580,000', after: '¥580,000' },
    ],
    attachments: [{ name: '报价审核意见.docx', size: '156 KB' }],
    createdAt: '2026-05-05 16:00',
  },
  {
    id: '5',
    projectId: 'PRJ001',
    projectName: 'A公司CRM系统开发',
    userId: 'u5',
    userName: '孙七',
    bizModule: '项目',
    actionType: '上传',
    summary: '上传 UI 设计终稿及交互说明文档',
    bizNo: 'PRJ202604001',
    comment: '设计稿已按照评审意见修改，含移动端和 PC 端全套页面。',
    changes: [],
    attachments: [
      { name: 'UI设计终稿_v3.fig', size: '18.4 MB' },
      { name: '交互说明文档.pdf', size: '3.7 MB' },
    ],
    createdAt: '2026-05-05 11:20',
  },
  {
    id: '6',
    projectId: 'PRJ002',
    projectName: 'B公司电商平台开发',
    userId: 'u2',
    userName: '李四',
    bizModule: '合同',
    actionType: '新增',
    summary: '新建合同记录"CT20260504001 — 电商平台开发补充协议"',
    bizNo: 'CT20260504001',
    comment: '客户要求追加移动端适配模块，合同增补金额 ¥80,000。',
    changes: [
      { field: '合同金额', before: '¥200,000', after: '¥280,000' },
      { field: '结束日期', before: '2026-08-25', after: '2026-09-15' },
    ],
    attachments: [
      { name: '补充协议_已签章.pdf', size: '4.2 MB' },
    ],
    createdAt: '2026-05-04 09:55',
  },
];

const avatarColors = ['#165dff', '#0fc6c2', '#ff7d00', '#7816ff', '#00b42a'];
function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

function DiffRow({ change }: { change: FieldChange }) {
  return (
    <div className="flex items-center gap-3" style={{ padding: '4px 0', fontSize: 13 }}>
      <span style={{ color: 'var(--color-text-3)', width: 90, flexShrink: 0 }}>{change.field}</span>
      <span style={{
        padding: '1px 8px',
        background: '#fff1f0',
        color: '#cf1322',
        borderRadius: 4,
        textDecoration: change.before !== '—' ? 'line-through' : 'none',
        fontFamily: 'monospace',
      }}>{change.before}</span>
      {change.before !== '—' && (
        <>
          <span style={{ color: '#aaa' }}>→</span>
          <span style={{
            padding: '1px 8px',
            background: '#f6ffed',
            color: '#389e0d',
            borderRadius: 4,
            fontFamily: 'monospace',
          }}>{change.after}</span>
        </>
      )}
    </div>
  );
}

export function ProjectLogView() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const filtered = mockLogs.filter((log) => {
    if (selectedProject !== 'all' && log.projectId !== selectedProject) return false;
    if (selectedMembers.length > 0 && !selectedMembers.includes(log.userName)) return false;
    if (selectedActionTypes.length > 0 && !selectedActionTypes.includes(log.actionType)) return false;
    if (keyword && !log.summary.includes(keyword) && !log.comment.includes(keyword)) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedProject('all');
    setSelectedMembers([]);
    setSelectedActionTypes([]);
    setKeyword('');
    setDateRange([]);
  };

  return (
    <div>
      {/* Filter Bar */}
      <Card style={{ marginBottom: 16 }}>
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            style={{ width: 220 }}
            placeholder="搜索日志内容"
            prefix={<IconSearch />}
            value={keyword}
            onChange={setKeyword}
            allowClear
          />
          <Select
            style={{ width: 180 }}
            placeholder="选择项目"
            value={selectedProject}
            onChange={setSelectedProject}
            options={allProjects}
          />
          <Select
            mode="multiple"
            style={{ width: 200 }}
            placeholder="操作人员（多选）"
            value={selectedMembers}
            onChange={setSelectedMembers}
            allowClear
            options={allMembers}
          />
          <Select
            mode="multiple"
            style={{ width: 220 }}
            placeholder="操作类型（多选）"
            value={selectedActionTypes}
            onChange={setSelectedActionTypes}
            allowClear
            options={actionTypeOptions.map((t) => ({ value: t, label: t }))}
          />
          <RangePicker
            style={{ width: 260 }}
            placeholder={['开始日期', '结束日期']}
            value={dateRange}
            onChange={setDateRange}
          />
          <Button onClick={handleReset}>重置</Button>
          <div style={{ marginLeft: 'auto' }}>
            <Space>
              <Button icon={<IconRefresh />} onClick={() => {}}>刷新</Button>
              <Button icon={<IconExport />}>导出日志</Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Log Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical timeline line */}
        <div style={{
          position: 'absolute',
          left: 20,
          top: 0,
          bottom: 0,
          width: 2,
          background: 'var(--color-border-2)',
          zIndex: 0,
        }} />

        <div className="flex flex-col gap-3" style={{ paddingLeft: 52 }}>
          {filtered.length === 0 && (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-3)' }}>
                暂无日志记录
              </div>
            </Card>
          )}

          {filtered.map((log) => {
            const expanded = expandedKeys.includes(log.id);
            return (
              <div key={log.id} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: -44,
                  top: 16,
                  zIndex: 1,
                }}>
                  <Avatar
                    size={28}
                    style={{ background: getAvatarColor(log.userName), fontSize: 12, fontWeight: 600 }}
                  >
                    {log.userName.slice(0, 1)}
                  </Avatar>
                </div>

                <Card
                  style={{
                    cursor: 'pointer',
                    border: expanded ? '1px solid rgb(var(--primary-6))' : '1px solid var(--color-border-2)',
                    transition: 'border-color 0.2s',
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  {/* Header row */}
                  <div
                    className="flex items-center gap-3"
                    style={{ padding: '12px 16px' }}
                    onClick={() => toggleExpand(log.id)}
                  >
                    <span style={{ color: 'var(--color-text-3)', fontSize: 12, minWidth: 120 }}>
                      {log.createdAt}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: 13, color: 'var(--color-text-1)', flex: 1 }}>
                      <span style={{ color: getAvatarColor(log.userName), marginRight: 4 }}>{log.userName}</span>
                      {log.summary}
                    </span>
                    <Space size={6}>
                      <Tag color={bizModuleColorMap[log.bizModule]} size="small">{log.bizModule}</Tag>
                      <Tag color={actionColorMap[log.actionType]} size="small">{log.actionType}</Tag>
                    </Space>
                    <span style={{ color: 'var(--color-text-3)', fontSize: 12 }}>
                      {expanded ? <IconDown /> : <IconRight />}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {expanded && (
                    <div style={{
                      borderTop: '1px solid var(--color-border-2)',
                      padding: '14px 16px',
                      background: 'var(--color-fill-1)',
                    }}>
                      <div className="flex gap-6 flex-wrap">
                        {/* Left: context */}
                        <div style={{ flex: 1, minWidth: 280 }}>
                          {/* Business no */}
                          <div style={{ marginBottom: 12 }}>
                            <span style={{ color: 'var(--color-text-3)', fontSize: 12 }}>业务单号：</span>
                            <a style={{ fontSize: 13, color: 'rgb(var(--primary-6))' }}>{log.bizNo}</a>
                            <span style={{ marginLeft: 8, color: 'var(--color-text-3)', fontSize: 12 }}>
                              {log.projectName}
                            </span>
                          </div>

                          {/* Comment */}
                          {log.comment && (
                            <div style={{
                              padding: '8px 12px',
                              background: '#fffbe6',
                              border: '1px solid #ffe58f',
                              borderRadius: 6,
                              fontSize: 13,
                              color: '#614700',
                              marginBottom: 12,
                            }}>
                              <span style={{ fontWeight: 500, marginRight: 6 }}>批注：</span>
                              {log.comment}
                            </div>
                          )}

                          {/* Daily report content */}
                          {(log.workHours !== undefined || log.workContent) && (
                            <div style={{
                              padding: '10px 12px',
                              background: '#e6f7ff',
                              border: '1px solid #91d5ff',
                              borderRadius: 6,
                              marginBottom: 12,
                            }}>
                              <div style={{ fontSize: 12, fontWeight: 500, color: '#003a8c', marginBottom: 8 }}>
                                📊 日报内容
                              </div>
                              {log.workHours !== undefined && (
                                <div style={{ fontSize: 13, color: '#002766', marginBottom: 6 }}>
                                  <span style={{ fontWeight: 500 }}>工作时长：</span>
                                  <span style={{ color: 'rgb(var(--primary-6))', fontWeight: 600 }}>{log.workHours}</span> 小时
                                </div>
                              )}
                              {log.workContent && (
                                <div style={{ fontSize: 13, color: '#002766' }}>
                                  <span style={{ fontWeight: 500 }}>工作内容：</span>
                                  <span>{log.workContent}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Field changes */}
                          {log.changes.length > 0 && (
                            <div>
                              <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 6 }}>字段变更</div>
                              <div style={{
                                border: '1px solid var(--color-border-2)',
                                borderRadius: 6,
                                padding: '6px 10px',
                                background: '#fff',
                              }}>
                                {log.changes.map((c, i) => <DiffRow key={i} change={c} />)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: attachments */}
                        {log.attachments.length > 0 && (
                          <div style={{ minWidth: 200 }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 6 }}>附件</div>
                            <div className="flex flex-col gap-2">
                              {log.attachments.map((att, i) => (
                                <div key={i} className="flex items-center gap-2" style={{
                                  padding: '6px 10px',
                                  border: '1px solid var(--color-border-2)',
                                  borderRadius: 6,
                                  background: '#fff',
                                }}>
                                  <IconFile style={{ color: 'rgb(var(--primary-6))', fontSize: 16 }} />
                                  <div>
                                    <div>
                                      <a style={{
                                        fontSize: 13,
                                        color: 'rgb(var(--primary-6))',
                                        textDecoration: 'underline',
                                      }}>{att.name}</a>
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{att.size}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
