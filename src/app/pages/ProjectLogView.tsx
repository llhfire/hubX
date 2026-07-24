import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/ui/popover';
import {
  Search,
  RefreshCw,
  Download,
  FileText,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react';

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

function getBadgeClassName(color: string): string {
  switch (color) {
    case 'arcoblue':
      return 'bg-blue-500 text-white border-transparent';
    case 'green':
      return 'bg-green-500 text-white border-transparent';
    case 'red':
      return ''; // use variant="destructive"
    case 'purple':
      return 'bg-purple-500 text-white border-transparent';
    case 'orange':
      return 'bg-orange-500 text-white border-transparent';
    case 'cyan':
      return 'bg-cyan-500 text-white border-transparent';
    case 'gray':
      return ''; // use variant="secondary"
    default:
      return '';
  }
}

function getBadgeVariant(color: string): 'default' | 'destructive' | 'secondary' | 'outline' {
  if (color === 'red') return 'destructive';
  if (color === 'gray') return 'secondary';
  return 'default';
}

function ColorBadge({ color, children }: { color: string; children: React.ReactNode }) {
  const className = getBadgeClassName(color);
  if (className) {
    return <Badge className={className}>{children}</Badge>;
  }
  return <Badge variant={getBadgeVariant(color)}>{children}</Badge>;
}

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
    <div className="flex items-center gap-3 py-1 text-[13px]">
      <span className="text-muted-foreground w-[90px] shrink-0">{change.field}</span>
      <span
        className="px-2 py-px rounded font-mono"
        style={{
          background: '#fff1f0',
          color: '#cf1322',
          textDecoration: change.before !== '—' ? 'line-through' : 'none',
        }}
      >
        {change.before}
      </span>
      {change.before !== '—' && (
        <>
          <span className="text-muted-foreground">→</span>
          <span
            className="px-2 py-px rounded font-mono"
            style={{ background: '#f6ffed', color: '#389e0d' }}
          >
            {change.after}
          </span>
        </>
      )}
    </div>
  );
}

/** Multi-select dropdown using Popover + Checkbox */
function MultiSelect({
  placeholder,
  options,
  value,
  onChange,
  width,
}: {
  placeholder: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (val: string[]) => void;
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (val: string) => {
    onChange(
      value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val]
    );
  };

  return (
    <div ref={ref} className="relative" style={{ width: width ?? 200 }}>
      <button
        type="button"
        className="border-input bg-background hover:bg-accent flex h-9 w-full items-center justify-between rounded-md border px-3 text-sm"
        onClick={() => setOpen(!open)}
      >
        <span className={value.length === 0 ? 'text-muted-foreground' : ''}>
          {value.length === 0
            ? placeholder
            : value.length === 1
              ? options.find((o) => o.value === value[0])?.label ?? value[0]
              : `已选 ${value.length} 项`}
        </span>
        <ChevronDown className="size-4 opacity-50" />
      </button>
      {open && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border shadow-md">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
              >
                <Checkbox
                  checked={value.includes(opt.value)}
                  onCheckedChange={() => toggle(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectLogView() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
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
    setDateStart('');
    setDateEnd('');
  };

  return (
    <div>
      {/* Filter Bar */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                className="w-[220px] pl-9"
                placeholder="搜索日志内容"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择项目" />
              </SelectTrigger>
              <SelectContent>
                {allProjects.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <MultiSelect
              placeholder="操作人员（多选）"
              options={allMembers}
              value={selectedMembers}
              onChange={setSelectedMembers}
              width={200}
            />
            <MultiSelect
              placeholder="操作类型（多选）"
              options={actionTypeOptions.map((t) => ({ value: t, label: t }))}
              value={selectedActionTypes}
              onChange={setSelectedActionTypes}
              width={220}
            />
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">-</span>
              <input
                type="date"
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={() => {}}>
                <RefreshCw className="size-4" />
                刷新
              </Button>
              <Button variant="outline">
                <Download className="size-4" />
                导出日志
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"
          style={{ zIndex: 0 }}
        />

        <div className="flex flex-col gap-3 pl-[52px]">
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                暂无日志记录
              </CardContent>
            </Card>
          )}

          {filtered.map((log) => {
            const expanded = expandedKeys.includes(log.id);
            return (
              <div key={log.id} className="relative">
                {/* Timeline avatar dot */}
                <div className="absolute -left-[44px] top-4 z-[1]">
                  <div
                    className="flex items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{
                      backgroundColor: getAvatarColor(log.userName),
                      width: 28,
                      height: 28,
                    }}
                  >
                    {log.userName.slice(0, 1)}
                  </div>
                </div>

                <Card
                  className="cursor-pointer transition-[border-color]"
                  style={{
                    borderColor: expanded ? 'hsl(var(--primary))' : undefined,
                  }}
                >
                  {/* Header row */}
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                    onClick={() => toggleExpand(log.id)}
                  >
                    <span className="text-muted-foreground min-w-[120px] text-xs">
                      {log.createdAt}
                    </span>
                    <span className="flex-1 text-[13px] font-medium text-foreground">
                      <span className="mr-1" style={{ color: getAvatarColor(log.userName) }}>
                        {log.userName}
                      </span>
                      {log.summary}
                    </span>
                    <div className="flex gap-1.5">
                      <ColorBadge color={bizModuleColorMap[log.bizModule]}>
                        {log.bizModule}
                      </ColorBadge>
                      <ColorBadge color={actionColorMap[log.actionType]}>
                        {log.actionType}
                      </ColorBadge>
                    </div>
                    <span className="text-muted-foreground">
                      {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {expanded && (
                    <div className="border-t bg-muted/50 px-4 py-3.5">
                      <div className="flex flex-wrap gap-6">
                        {/* Left: context */}
                        <div className="min-w-[280px] flex-1">
                          {/* Business no */}
                          <div className="mb-3">
                            <span className="text-muted-foreground text-xs">业务单号：</span>
                            <a className="text-[13px] text-primary">{log.bizNo}</a>
                            <span className="ml-2 text-muted-foreground text-xs">
                              {log.projectName}
                            </span>
                          </div>

                          {/* Comment */}
                          {log.comment && (
                            <div
                              className="mb-3 rounded-md border px-3 py-2 text-[13px]"
                              style={{
                                background: '#fffbe6',
                                borderColor: '#ffe58f',
                                color: '#614700',
                              }}
                            >
                              <span className="mr-1.5 font-medium">批注：</span>
                              {log.comment}
                            </div>
                          )}

                          {/* Daily report content */}
                          {(log.workHours !== undefined || log.workContent) && (
                            <div
                              className="mb-3 rounded-md border px-3 py-2.5"
                              style={{
                                background: '#e6f7ff',
                                borderColor: '#91d5ff',
                              }}
                            >
                              <div className="mb-2 text-xs font-medium" style={{ color: '#003a8c' }}>
                                📊 日报内容
                              </div>
                              {log.workHours !== undefined && (
                                <div className="mb-1.5 text-[13px]" style={{ color: '#002766' }}>
                                  <span className="font-medium">工作时长：</span>
                                  <span className="font-semibold text-primary">{log.workHours}</span> 小时
                                </div>
                              )}
                              {log.workContent && (
                                <div className="text-[13px]" style={{ color: '#002766' }}>
                                  <span className="font-medium">工作内容：</span>
                                  <span>{log.workContent}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Field changes */}
                          {log.changes.length > 0 && (
                            <div>
                              <div className="text-muted-foreground mb-1.5 text-xs">字段变更</div>
                              <div className="rounded-md border bg-white px-2.5 py-1.5">
                                {log.changes.map((c, i) => (
                                  <DiffRow key={i} change={c} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: attachments */}
                        {log.attachments.length > 0 && (
                          <div className="min-w-[200px]">
                            <div className="text-muted-foreground mb-1.5 text-xs">附件</div>
                            <div className="flex flex-col gap-2">
                              {log.attachments.map((att, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 rounded-md border bg-white px-2.5 py-1.5"
                                >
                                  <FileText className="size-4 text-primary" />
                                  <div>
                                    <div>
                                      <a
                                        className="rounded px-1 py-0.5 text-[13px] text-primary hover:bg-muted cursor-pointer"
                                      >
                                        {att.name}
                                      </a>
                                    </div>
                                    <div className="text-muted-foreground text-[11px]">
                                      {att.size}
                                    </div>
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
