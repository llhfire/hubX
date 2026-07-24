import { useState } from 'react';
import { Plus, Pencil, Trash2, Copy, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

type RejectPolicy = '驳回至上一级' | '驳回至发起人' | '流程终止';
type ApproveStrategy = '单签' | '会签';

interface ApprovalNode {
  id: string;
  name: string;
  strategy: ApproveStrategy;
  rejectPolicy: RejectPolicy;
}

interface WorkflowTemplate {
  key: string;
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  nodes: ApprovalNode[];
  status: boolean;
  updatedAt: string;
}

const initialTemplates: WorkflowTemplate[] = [
  {
    key: '1',
    id: 'T001',
    name: '通用双层审批',
    description: '适用于大多数业务场景，部门负责人初审，财务复审',
    nodeCount: 2,
    nodes: [
      { id: 'n1', name: '部门审批', strategy: '单签', rejectPolicy: '驳回至发起人' },
      { id: 'n2', name: '财务审批', strategy: '单签', rejectPolicy: '驳回至上一级' },
    ],
    status: true,
    updatedAt: '2026-04-20',
  },
  {
    key: '2',
    id: 'T002',
    name: '高额费用三级审批',
    description: '用于大额报销、合同审批，需经过三级审核',
    nodeCount: 3,
    nodes: [
      { id: 'n1', name: '直属上级', strategy: '单签', rejectPolicy: '驳回至发起人' },
      { id: 'n2', name: '部门总监', strategy: '单签', rejectPolicy: '驳回至上一级' },
      { id: 'n3', name: '财务核算', strategy: '会签', rejectPolicy: '流程终止' },
    ],
    status: true,
    updatedAt: '2026-04-18',
  },
  {
    key: '3',
    id: 'T003',
    name: '快速单签审批',
    description: '单一审批节点，适合低风险业务快速流转',
    nodeCount: 1,
    nodes: [
      { id: 'n1', name: '直属经理', strategy: '单签', rejectPolicy: '驳回至发起人' },
    ],
    status: false,
    updatedAt: '2026-04-10',
  },
];

const rejectOptions: RejectPolicy[] = ['驳回至上一级', '驳回至发起人', '流程终止'];

function FlowPreview({ nodes }: { nodes: ApprovalNode[] }) {
  return (
    <div className="flex items-center flex-wrap gap-1" style={{ margin: '4px 0' }}>
      <span style={{
        padding: '2px 10px',
        borderRadius: 12,
        background: '#e8f5e9',
        color: '#2e7d32',
        fontSize: 12,
        fontWeight: 500,
      }}>发起</span>
      {nodes.map((node) => (
        <span key={node.id} className="flex items-center gap-1">
          <ArrowRight style={{ fontSize: 12, color: '#aaa' }} size={12} />
          <span style={{
            padding: '2px 10px',
            borderRadius: 12,
            background: '#e3f2fd',
            color: '#1565c0',
            fontSize: 12,
            fontWeight: 500,
          }}>{node.name}</span>
        </span>
      ))}
      <ArrowRight style={{ fontSize: 12, color: '#aaa' }} size={12} />
      <span style={{
        padding: '2px 10px',
        borderRadius: 12,
        background: '#fce4ec',
        color: '#c62828',
        fontSize: 12,
        fontWeight: 500,
      }}>结束</span>
    </div>
  );
}

export function WorkflowTemplateList() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(initialTemplates);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [nodes, setNodes] = useState<ApprovalNode[]>([]);

  const openCreate = () => {
    setEditingTemplate(null);
    setNodes([{ id: Date.now().toString(), name: '', strategy: '单签', rejectPolicy: '驳回至发起人' }]);
    setFormName('');
    setFormDescription('');
    setModalVisible(true);
  };

  const openEdit = (record: WorkflowTemplate) => {
    setEditingTemplate(record);
    setNodes(record.nodes.map((n) => ({ ...n })));
    setFormName(record.name);
    setFormDescription(record.description);
    setModalVisible(true);
  };

  const openCopy = (record: WorkflowTemplate) => {
    setEditingTemplate(null);
    const copiedNodes = record.nodes.map((n) => ({ ...n, id: Date.now().toString() + Math.random() }));
    setNodes(copiedNodes);
    setFormName(`${record.name}-副本`);
    setFormDescription(record.description);
    setModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setTemplates((prev) => prev.filter((t) => t.key !== key));
    toast.success('模板已删除');
  };

  const handleStatusChange = (key: string, val: boolean) => {
    setTemplates((prev) => prev.map((t) => t.key === key ? { ...t, status: val } : t));
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('请输入模板名称');
      return;
    }
    if (nodes.length === 0) { toast.error('请至少添加一个审批节点'); return; }
    if (nodes.some((n) => !n.name.trim())) { toast.error('节点名称不能为空'); return; }

    if (editingTemplate) {
      setTemplates((prev) => prev.map((t) =>
        t.key === editingTemplate.key
          ? { ...t, name: formName, description: formDescription, nodes, nodeCount: nodes.length, updatedAt: '2026-05-06' }
          : t
      ));
      toast.success('模板已更新');
    } else {
      const newId = `T00${templates.length + 1}`;
      setTemplates((prev) => [...prev, {
        key: Date.now().toString(),
        id: newId,
        name: formName,
        description: formDescription || '',
        nodes,
        nodeCount: nodes.length,
        status: true,
        updatedAt: '2026-05-06',
      }]);
      toast.success('模板已创建');
    }
    setModalVisible(false);
  };

  const addNode = () => {
    setNodes((prev) => [...prev, { id: Date.now().toString(), name: '', strategy: '单签', rejectPolicy: '驳回至发起人' }]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNode = (id: string, field: keyof ApprovalNode, value: string) => {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, [field]: value } : n));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold m-0">审批模板管理</h4>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> 新建模板
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: 80 }}>模板ID</TableHead>
                  <TableHead style={{ width: 180 }}>模板名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead style={{ width: 380 }}>审批流</TableHead>
                  <TableHead style={{ width: 80 }}>状态</TableHead>
                  <TableHead style={{ width: 110 }}>最后修改</TableHead>
                  <TableHead style={{ width: 140 }} className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((record) => (
                  <TableRow key={record.key}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell><span className="font-medium">{record.name}</span></TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell><FlowPreview nodes={record.nodes} /></TableCell>
                    <TableCell>
                      <Switch
                        checked={record.status}
                        onCheckedChange={(v) => handleStatusChange(record.key, v)}
                      />
                    </TableCell>
                    <TableCell>{record.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(record)}>
                          <Pencil className="h-4 w-4 mr-1" /> 编辑
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openCopy(record)}>
                          <Copy className="h-4 w-4 mr-1" /> 复制
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>确认删除该模板？</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(record.key)}>确认</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalVisible} onOpenChange={(open) => !open && setModalVisible(false)}>
        <DialogContent className="max-w-[680px]">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? '编辑审批模板' : '新建审批模板'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">模板名称</Label>
              <Input
                id="template-name"
                placeholder="如：通用双层审批"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-desc">模板描述</Label>
              <Textarea
                id="template-desc"
                placeholder="适用场景说明"
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-2">
            <div className="font-medium mb-3 text-foreground">审批节点配置</div>

            {/* Start node */}
            <div className="flex items-center gap-3 mb-2">
              <div style={{
                padding: '6px 16px',
                borderRadius: 20,
                background: '#e8f5e9',
                color: '#2e7d32',
                fontSize: 13,
                fontWeight: 500,
                minWidth: 80,
                textAlign: 'center',
              }}>发起节点</div>
              <span className="text-muted-foreground text-xs">自动生成，不可删除</span>
            </div>

            {nodes.map((node, index) => (
              <div key={node.id} className="flex items-start gap-2 mb-2">
                <div className="text-muted-foreground text-xs pt-2 min-w-[16px]">↓</div>
                <div className="flex-1 border rounded-md p-3 bg-muted/50">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-xs text-muted-foreground mb-1 w-full">
                      审批节点 {index + 1}
                    </div>
                    <Input
                      placeholder="节点名称（如：部门审批）"
                      value={node.name}
                      onChange={(e) => updateNode(node.id, 'name', e.target.value)}
                      className="w-[180px]"
                    />
                    <RadioGroup
                      value={node.strategy}
                      onValueChange={(v) => updateNode(node.id, 'strategy', v)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="单签" id={`strategy-${node.id}-1`} />
                        <Label htmlFor={`strategy-${node.id}-1`}>单签</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="会签" id={`strategy-${node.id}-2`} />
                        <Label htmlFor={`strategy-${node.id}-2`}>会签</Label>
                      </div>
                    </RadioGroup>
                    <Select
                      value={node.rejectPolicy}
                      onValueChange={(v) => updateNode(node.id, 'rejectPolicy', v)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rejectOptions.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={nodes.length === 1}
                      onClick={() => removeNode(node.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-muted-foreground text-xs mb-2">↓</div>

            {/* End node */}
            <div className="flex items-center gap-3 mb-3">
              <div style={{
                padding: '6px 16px',
                borderRadius: 20,
                background: '#fce4ec',
                color: '#c62828',
                fontSize: 13,
                fontWeight: 500,
                minWidth: 80,
                textAlign: 'center',
              }}>结束节点</div>
              <span className="text-muted-foreground text-xs">自动生成，不可删除</span>
            </div>

            <Button variant="outline" className="w-full border-dashed" onClick={addNode}>
              <Plus className="mr-2 h-4 w-4" /> 添加审批节点
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={handleSave}>保存模板</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
