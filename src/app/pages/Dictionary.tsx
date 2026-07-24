import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// 模拟字典分类数据
const mockDictTypes = [
  { id: '1', code: 'customer_source', name: '客户来源', description: '客户来源渠道分类', status: '启用', createTime: '2020-01-01' },
  { id: '2', code: 'customer_level', name: '客户等级', description: '客户价值等级分类', status: '启用', createTime: '2020-01-01' },
  { id: '3', code: 'lead_status', name: '线索状态', description: '线索跟进状态分类', status: '启用', createTime: '2020-01-01' },
  { id: '4', code: 'lead_tag', name: '线索标签', description: '线索业务类型标签', status: '启用', createTime: '2020-01-01' },
  { id: '5', code: 'industry', name: '所属行业', description: '客户所属行业分类', status: '启用', createTime: '2020-01-01' },
];

// 模拟字典项数据
const mockDictItems: Record<string, any[]> = {
  '1': [
    { id: '1-1', label: '百度推广', value: 'baidu', sort: 1, status: '启用', remark: '百度搜索推广渠道' },
    { id: '1-2', label: '抖音推广', value: 'douyin', sort: 2, status: '启用', remark: '抖音信息流推广' },
    { id: '1-3', label: '小红书', value: 'xiaohongshu', sort: 3, status: '启用', remark: '小红书推广渠道' },
    { id: '1-4', label: '展会', value: 'exhibition', sort: 4, status: '启用', remark: '线下展会获客' },
    { id: '1-5', label: '老客户推荐', value: 'referral', sort: 5, status: '启用', remark: '老客户转介绍' },
  ],
  '2': [
    { id: '2-1', label: 'VIP客户', value: 'vip', sort: 1, status: '启用', remark: '年签约额>100万' },
    { id: '2-2', label: 'A级客户', value: 'a', sort: 2, status: '启用', remark: '年签约额50-100万' },
    { id: '2-3', label: 'B级客户', value: 'b', sort: 3, status: '启用', remark: '年签约额10-50万' },
    { id: '2-4', label: 'C级客户', value: 'c', sort: 4, status: '启用', remark: '年签约额<10万' },
  ],
  '3': [
    { id: '3-1', label: '未联系', value: 'not_contacted', sort: 1, status: '启用', remark: '' },
    { id: '3-2', label: '未接通', value: 'no_answer', sort: 2, status: '启用', remark: '' },
    { id: '3-3', label: '初步沟通', value: 'initial_contact', sort: 3, status: '启用', remark: '' },
    { id: '3-4', label: '需求调研', value: 'requirement', sort: 4, status: '启用', remark: '' },
    { id: '3-5', label: '方案报价', value: 'quotation', sort: 5, status: '启用', remark: '' },
    { id: '3-6', label: '合同洽谈', value: 'negotiation', sort: 6, status: '启用', remark: '' },
    { id: '3-7', label: '已签单', value: 'signed', sort: 7, status: '启用', remark: '' },
    { id: '3-8', label: '已终止', value: 'terminated', sort: 8, status: '启用', remark: '' },
  ],
  '4': [
    { id: '4-1', label: 'APP开发', value: 'app', sort: 1, status: '启用', remark: '' },
    { id: '4-2', label: '小程序', value: 'miniprogram', sort: 2, status: '启用', remark: '' },
    { id: '4-3', label: '管理系统', value: 'system', sort: 3, status: '启用', remark: '' },
    { id: '4-4', label: 'CMS系统', value: 'cms', sort: 4, status: '启用', remark: '' },
    { id: '4-5', label: '电商平台', value: 'ecommerce', sort: 5, status: '启用', remark: '' },
  ],
  '5': [
    { id: '5-1', label: '互联网', value: 'internet', sort: 1, status: '启用', remark: '' },
    { id: '5-2', label: '金融', value: 'finance', sort: 2, status: '启用', remark: '' },
    { id: '5-3', label: '教育', value: 'education', sort: 3, status: '启用', remark: '' },
    { id: '5-4', label: '医疗', value: 'healthcare', sort: 4, status: '启用', remark: '' },
    { id: '5-5', label: '制造业', value: 'manufacturing', sort: 5, status: '启用', remark: '' },
  ],
};

interface TypeFormData {
  code: string;
  name: string;
  description: string;
  status: string;
}

interface ItemFormData {
  label: string;
  value: string;
  sort: number;
  remark: string;
  status: string;
}

export function Dictionary() {
  const [selectedDictType, setSelectedDictType] = useState<string>('1');
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [typeForm, setTypeForm] = useState<TypeFormData>({
    code: '',
    name: '',
    description: '',
    status: '启用',
  });

  const [itemForm, setItemForm] = useState<ItemFormData>({
    label: '',
    value: '',
    sort: 1,
    remark: '',
    status: '启用',
  });

  const handleAddType = () => {
    setEditingType(null);
    setTypeForm({ code: '', name: '', description: '', status: '启用' });
    setTypeModalVisible(true);
  };

  const handleEditType = (record: any) => {
    setEditingType(record);
    setTypeForm({
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
    });
    setTypeModalVisible(true);
  };

  const handleDeleteType = (id: string) => {
    toast.success('删除成功');
  };

  const handleTypeSubmit = () => {
    if (!typeForm.code || !typeForm.name) {
      toast.error('请填写必填项');
      return;
    }
    toast.success(editingType ? '编辑成功' : '新建成功');
    setTypeModalVisible(false);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({ label: '', value: '', sort: 1, remark: '', status: '启用' });
    setItemModalVisible(true);
  };

  const handleEditItem = (record: any) => {
    setEditingItem(record);
    setItemForm({
      label: record.label,
      value: record.value,
      sort: record.sort,
      remark: record.remark,
      status: record.status,
    });
    setItemModalVisible(true);
  };

  const handleDeleteItem = (id: string) => {
    toast.success('删除成功');
  };

  const handleItemSubmit = () => {
    if (!itemForm.label || !itemForm.value) {
      toast.error('请填写必填项');
      return;
    }
    toast.success(editingItem ? '编辑成功' : '新建成功');
    setItemModalVisible(false);
  };

  const currentDictType = mockDictTypes.find(t => t.id === selectedDictType);
  const currentItems = mockDictItems[selectedDictType] || [];

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>字典分类</CardTitle>
          <Button onClick={handleAddType}>
            <Plus className="mr-2 h-4 w-4" />
            新建分类
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">字典编码</TableHead>
                  <TableHead className="w-[150px]">字典名称</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[120px]">创建时间</TableHead>
                  <TableHead className="w-[150px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDictTypes.map((record) => (
                  <TableRow
                    key={record.id}
                    className={selectedDictType === record.id ? 'bg-muted' : ''}
                  >
                    <TableCell>{record.code}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === '启用' ? 'default' : 'destructive'}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.createTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDictType(record.id)}>
                          查看项
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditType(record)}>
                          <Pencil className="mr-1 h-3 w-3" />
                          编辑
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="mr-1 h-3 w-3" />
                              删除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                确定要删除该字典分类吗?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteType(record.id)}>
                                确定
                              </AlertDialogAction>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>字典项 - {currentDictType?.name || ''}</CardTitle>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            新建字典项
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标签名称</TableHead>
                  <TableHead>标签值</TableHead>
                  <TableHead className="w-[80px]">排序</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.label}</TableCell>
                      <TableCell>{record.value}</TableCell>
                      <TableCell>{record.sort}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === '启用' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.remark}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditItem(record)}>
                            <Pencil className="mr-1 h-3 w-3" />
                            编辑
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="mr-1 h-3 w-3" />
                                删除
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除该字典项吗?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteItem(record.id)}>
                                  确定
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 字典分类编辑弹窗 */}
      <Dialog open={typeModalVisible} onOpenChange={setTypeModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingType ? '编辑字典分类' : '新建字典分类'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>字典编码 *</Label>
              <Input
                placeholder="请输入字典编码,如:customer_source"
                value={typeForm.code}
                onChange={(e) => setTypeForm({ ...typeForm, code: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>字典名称 *</Label>
              <Input
                placeholder="请输入字典名称"
                value={typeForm.name}
                onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>描述</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="请输入描述"
                rows={3}
                value={typeForm.description}
                onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select value={typeForm.status} onValueChange={(value) => setTypeForm({ ...typeForm, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="启用">启用</SelectItem>
                  <SelectItem value="禁用">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTypeModalVisible(false)}>
              取消
            </Button>
            <Button onClick={handleTypeSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 字典项编辑弹窗 */}
      <Dialog open={itemModalVisible} onOpenChange={setItemModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑字典项' : '新建字典项'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>标签名称 *</Label>
              <Input
                placeholder="请输入标签名称"
                value={itemForm.label}
                onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>标签值 *</Label>
              <Input
                placeholder="请输入标签值,如:baidu"
                value={itemForm.value}
                onChange={(e) => setItemForm({ ...itemForm, value: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>排序</Label>
              <Input
                type="number"
                min={1}
                placeholder="请输入排序"
                value={itemForm.sort}
                onChange={(e) => setItemForm({ ...itemForm, sort: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="grid gap-2">
              <Label>备注</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="请输入备注"
                rows={3}
                value={itemForm.remark}
                onChange={(e) => setItemForm({ ...itemForm, remark: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select value={itemForm.status} onValueChange={(value) => setItemForm({ ...itemForm, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="启用">启用</SelectItem>
                  <SelectItem value="禁用">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemModalVisible(false)}>
              取消
            </Button>
            <Button onClick={handleItemSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
