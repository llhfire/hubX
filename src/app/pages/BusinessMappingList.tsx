import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Pencil, Eye } from 'lucide-react';
import { toast } from 'sonner';

type AssigneeType = '具体人员' | '部门角色' | '指定主管' | '上一节点负责人';

interface NodeAssignment {
  nodeId: string;
  nodeName: string;
  strategy: '单签' | '会签';
  assigneeType: AssigneeType;
  assigneeValue: string;
  skipIfEmpty: boolean;
}

interface BusinessMapping {
  key: string;
  bizCode: string;
  bizName: string;
  templateId: string | null;
  templateName: string | null;
  assignments: NodeAssignment[];
  updatedAt: string;
}

const templates = [
  {
    id: 'T001',
    name: '通用双层审批',
    nodes: [
      { id: 'n1', name: '部门审批', strategy: '单签' as const },
      { id: 'n2', name: '财务审批', strategy: '单签' as const },
    ],
  },
  {
    id: 'T002',
    name: '高额费用三级审批',
    nodes: [
      { id: 'n1', name: '直属上级', strategy: '单签' as const },
      { id: 'n2', name: '部门总监', strategy: '单签' as const },
      { id: 'n3', name: '财务核算', strategy: '会签' as const },
    ],
  },
  {
    id: 'T003',
    name: '快速单签审批',
    nodes: [
      { id: 'n1', name: '直属经理', strategy: '单签' as const },
    ],
  },
];

const assigneeTypeOptions: AssigneeType[] = ['具体人员', '部门角色', '指定主管', '上一节点负责人'];

const assigneeValueOptions: Record<AssigneeType, string[]> = {
  具体人员: ['张三（财务主管）', '李四（总经理）', '王五（运营总监）', '赵六（销售总监）'],
  部门角色: ['部门经理', '财务主管', '差旅管理员', '销售主管', '技术总监'],
  指定主管: ['直属上级', '部门总监', 'CEO'],
  上一节点负责人: ['上一节点负责人'],
};

const initialMappings: BusinessMapping[] = [
  {
    key: '1',
    bizCode: 'TRAVEL',
    bizName: '出差申请',
    templateId: 'T001',
    templateName: '通用双层审批',
    assignments: [
      { nodeId: 'n1', nodeName: '部门审批', strategy: '单签', assigneeType: '部门角色', assigneeValue: '部门经理', skipIfEmpty: false },
      { nodeId: 'n2', nodeName: '财务审批', strategy: '单签', assigneeType: '部门角色', assigneeValue: '差旅管理员', skipIfEmpty: false },
    ],
    updatedAt: '2026-04-20',
  },
  {
    key: '2',
    bizCode: 'REIMBURSE',
    bizName: '报销申请',
    templateId: 'T002',
    templateName: '高额费用三级审批',
    assignments: [
      { nodeId: 'n1', nodeName: '直属上级', strategy: '单签', assigneeType: '指定主管', assigneeValue: '直属上级', skipIfEmpty: false },
      { nodeId: 'n2', nodeName: '部门总监', strategy: '单签', assigneeType: '部门角色', assigneeValue: '部门经理', skipIfEmpty: false },
      { nodeId: 'n3', nodeName: '财务核算', strategy: '会签', assigneeType: '具体人员', assigneeValue: '张三（财务主管）', skipIfEmpty: true },
    ],
    updatedAt: '2026-04-19',
  },
  {
    key: '3',
    bizCode: 'QUOTATION',
    bizName: '报价',
    templateId: 'T001',
    templateName: '通用双层审批',
    assignments: [
      { nodeId: 'n1', nodeName: '部门审批', strategy: '单签', assigneeType: '部门角色', assigneeValue: '销售主管', skipIfEmpty: false },
      { nodeId: 'n2', nodeName: '财务审批', strategy: '单签', assigneeType: '具体人员', assigneeValue: '张三（财务主管）', skipIfEmpty: false },
    ],
    updatedAt: '2026-04-18',
  },
  {
    key: '4',
    bizCode: 'CONTRACT',
    bizName: '合同记录',
    templateId: null,
    templateName: null,
    assignments: [],
    updatedAt: '-',
  },
];

export function BusinessMappingList() {
  const [mappings, setMappings] = useState<BusinessMapping[]>(initialMappings);
  const [configOpen, setConfigOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<BusinessMapping | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<NodeAssignment[]>([]);

  const openConfig = (record: BusinessMapping) => {
    setEditing(record);
    setSelectedTemplateId(record.templateId);
    setAssignments(record.assignments.map((a) => ({ ...a })));
    setConfigOpen(true);
  };

  const openPreview = (record: BusinessMapping) => {
    setEditing(record);
    setPreviewOpen(true);
  };

  const handleTemplateChange = (tid: string) => {
    setSelectedTemplateId(tid);
    const tmpl = templates.find((t) => t.id === tid);
    if (tmpl) {
      setAssignments(tmpl.nodes.map((n) => ({
        nodeId: n.id,
        nodeName: n.name,
        strategy: n.strategy,
        assigneeType: '部门角色',
        assigneeValue: '',
        skipIfEmpty: false,
      })));
    }
  };

  const updateAssignment = (nodeId: string, field: keyof NodeAssignment, value: any) => {
    setAssignments((prev) => prev.map((a) => {
      if (a.nodeId !== nodeId) return a;
      const updated = { ...a, [field]: value };
      if (field === 'assigneeType') updated.assigneeValue = '';
      return updated;
    }));
  };

  const handleSave = () => {
    if (!selectedTemplateId) { toast.error('请选择审批模板'); return; }
    const incomplete = assignments.find((a) => !a.assigneeValue && !a.skipIfEmpty);
    if (incomplete) { toast.warning(`节点"${incomplete.nodeName}"尚未配置审批人`); return; }

    const tmpl = templates.find((t) => t.id === selectedTemplateId);
    setMappings((prev) => prev.map((m) =>
      m.key === editing!.key
        ? { ...m, templateId: selectedTemplateId, templateName: tmpl?.name || '', assignments, updatedAt: '2026-05-06' }
        : m
    ));
    toast.success('业务审批配置已保存');
    setConfigOpen(false);
  };

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold m-0">业务审批配置</h4>
        <p className="text-muted-foreground mt-1 text-sm">
          将业务模块与审批模板绑定，并为每个审批节点指定具体审批人或角色策略。
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">业务模块</TableHead>
                <TableHead className="w-[200px]">当前绑定模板</TableHead>
                <TableHead className="w-[100px]">审批环节数</TableHead>
                <TableHead className="w-[120px]">最近更新</TableHead>
                <TableHead className="w-[140px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((record) => (
                <TableRow key={record.key}>
                  <TableCell className="font-medium">{record.bizName}</TableCell>
                  <TableCell>
                    {record.templateName ? (
                      <Badge variant="default">{record.templateName}</Badge>
                    ) : (
                      <span className="text-muted-foreground">未配置</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.assignments.length > 0 ? (
                      `${record.assignments.length} 个节点`
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </TableCell>
                  <TableCell>{record.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openConfig(record)}>
                        <Pencil className="mr-1 h-4 w-4" />
                        配置
                      </Button>
                      {record.templateId && (
                        <Button variant="ghost" size="sm" onClick={() => openPreview(record)}>
                          <Eye className="mr-1 h-4 w-4" />
                          预览
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Config Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-[780px]">
          <DialogHeader>
            <DialogTitle>配置审批 &mdash; {editing?.bizName}</DialogTitle>
          </DialogHeader>
          <div className="mb-5">
            <div className="font-medium mb-2">步骤 1：选择审批模板</div>
            <Select value={selectedTemplateId || undefined} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="请选择审批模板" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.id} &mdash; {t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentTemplate && assignments.length > 0 && (
            <div>
              <div className="font-medium mb-2">步骤 2：环节审批人映射</div>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted text-sm">
                      <TableHead className="font-medium text-foreground">审批环节</TableHead>
                      <TableHead className="font-medium text-foreground">审批策略</TableHead>
                      <TableHead className="font-medium text-foreground">审批人员 / 策略</TableHead>
                      <TableHead className="font-medium text-foreground">异常处理</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((a) => (
                      <TableRow key={a.nodeId}>
                        <TableCell className="font-medium">{a.nodeName}</TableCell>
                        <TableCell>
                          <Badge className={a.strategy === '会签' ? 'bg-purple-500 text-white' : ''}>
                            {a.strategy}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Select value={a.assigneeType} onValueChange={(v) => updateAssignment(a.nodeId, 'assigneeType', v)}>
                              <SelectTrigger className="w-[150px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {assigneeTypeOptions.map((o) => (
                                  <SelectItem key={o} value={o}>{o}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {a.assigneeType !== '上一节点负责人' && (
                              <Select value={a.assigneeValue || undefined} onValueChange={(v) => updateAssignment(a.nodeId, 'assigneeValue', v)}>
                                <SelectTrigger className="w-[180px] h-8">
                                  <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                  {assigneeValueOptions[a.assigneeType].map((o) => (
                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={a.skipIfEmpty}
                              onCheckedChange={(v) => updateAssignment(a.nodeId, 'skipIfEmpty', v)}
                            />
                            <span className="text-xs">审批人为空时自动跳过</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle>审批链路预览 &mdash; {editing?.bizName}</DialogTitle>
          </DialogHeader>
          {editing?.templateId && (
            <div>
              <div className="mb-4">
                <span className="text-muted-foreground text-sm">模板：</span>
                <Badge variant="default">{editing.templateName}</Badge>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="px-5 py-2 rounded-full font-medium text-sm"
                    style={{ background: '#e8f5e9', color: '#2e7d32' }}
                  >
                    发起人
                  </div>
                </div>

                {editing.assignments.map((a, idx) => (
                  <div key={a.nodeId} className="flex items-start gap-2">
                    <div className="pt-2.5 text-muted-foreground text-xs min-w-[12px]">&#8595;</div>
                    <div className="flex-1 border rounded-lg p-3 px-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">环节 {idx + 1}：{a.nodeName}</span>
                        <Badge className={a.strategy === '会签' ? 'bg-purple-500 text-white' : ''}>
                          {a.strategy}
                        </Badge>
                      </div>
                      <div className="mt-1.5 text-sm text-muted-foreground">
                        审批人：<span className="text-foreground font-medium">
                          {a.assigneeValue || <span className="text-muted-foreground">未配置</span>}
                        </span>
                        <span className="text-muted-foreground ml-2">（{a.assigneeType}）</span>
                      </div>
                      {a.skipIfEmpty && (
                        <div className="mt-1 text-xs text-orange-500">! 审批人为空时自动跳过</div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-xs">&#8595;</div>
                </div>
                <div
                  className="px-5 py-2 rounded-full font-medium text-sm inline-block self-start"
                  style={{ background: '#fce4ec', color: '#c62828' }}
                >
                  审批结束
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
