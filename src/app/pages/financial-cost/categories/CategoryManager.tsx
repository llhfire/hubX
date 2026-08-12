import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/components/ui/alert-dialog';
import { Switch } from '@/app/components/ui/switch';
import { FolderTree, Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { defaultCategories, type ExpenseCategory } from '../mockData';

interface CategoryTreeNodeProps {
  category: ExpenseCategory;
  selectedId: string | null;
  onSelect: (cat: ExpenseCategory) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

function CategoryTreeNode({ category, selectedId, onSelect, expandedIds, onToggleExpand }: CategoryTreeNodeProps) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedId === category.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
          isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'
        }`}
        style={{ paddingLeft: `${(category.level - 1) * 16 + 8}px` }}
        onClick={() => onSelect(category)}
      >
        {hasChildren ? (
          <button
            className="p-0.5 hover:bg-gray-200 rounded"
            onClick={(e) => { e.stopPropagation(); onToggleExpand(category.id); }}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <FolderTree className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="flex-1 truncate">{category.name}</span>
        <span className="text-xs text-gray-400 mr-1">{category.code}</span>
        {!category.isActive && <Badge variant="secondary" className="text-[10px]">已禁用</Badge>}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<ExpenseCategory[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(defaultCategories.map(c => c.id)));
  const [formVisible, setFormVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);

  // 表单状态
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formParentId, setFormParentId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (cat: ExpenseCategory) => {
    setSelectedCategory(cat);
  };

  const openCreateForm = (parentId: string | null = null) => {
    setEditingCategory(null);
    setFormName('');
    setFormCode('');
    setFormParentId(parentId);
    setFormVisible(true);
  };

  const openEditForm = () => {
    if (!selectedCategory) return;
    setEditingCategory(selectedCategory);
    setFormName(selectedCategory.name);
    setFormCode(selectedCategory.code);
    setFormParentId(selectedCategory.parentId);
    setFormVisible(true);
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error('请输入分类名称'); return; }
    if (!formCode.trim()) { toast.error('请输入分类编码'); return; }

    const isEdit = !!editingCategory;
    const level = formParentId ? 2 : 1;

    if (isEdit) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === editingCategory.id) {
          return { ...cat, name: formName, code: formCode };
        }
        if (cat.children) {
          return {
            ...cat,
            children: cat.children.map(child =>
              child.id === editingCategory.id
                ? { ...child, name: formName, code: formCode }
                : child
            ),
          };
        }
        return cat;
      }));
      toast.success('分类已更新');
    } else {
      const newCat: ExpenseCategory = {
        id: `cat-${Date.now()}`,
        parentId: formParentId,
        name: formName,
        code: formCode,
        level,
        sortOrder: 99,
        isActive: true,
      };

      if (formParentId) {
        setCategories(prev => prev.map(cat =>
          cat.id === formParentId
            ? { ...cat, children: [...(cat.children ?? []), newCat] }
            : cat
        ));
      } else {
        setCategories(prev => [...prev, newCat]);
      }
      toast.success('分类已创建');
    }
    setFormVisible(false);
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    if (selectedCategory.level === 1 && selectedCategory.children && selectedCategory.children.length > 0) {
      toast.error('请先删除子分类');
      return;
    }

    if (selectedCategory.level === 1) {
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
    } else {
      setCategories(prev => prev.map(cat =>
        cat.children
          ? { ...cat, children: cat.children.filter(c => c.id !== selectedCategory.id) }
          : cat
      ));
    }
    setSelectedCategory(null);
    setDeleteConfirmVisible(false);
    toast.success('分类已删除');
  };

  const handleToggleActive = (checked: boolean) => {
    if (!selectedCategory) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id === selectedCategory.id) return { ...cat, isActive: checked };
      if (cat.children) {
        return {
          ...cat,
          children: cat.children.map(child =>
            child.id === selectedCategory.id ? { ...child, isActive: checked } : child
          ),
        };
      }
      return cat;
    }));
    setSelectedCategory(prev => prev ? { ...prev, isActive: checked } : null);
    toast.success(checked ? '分类已启用' : '分类已禁用');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">费用分类管理</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* 左侧：分类树 */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">分类目录</CardTitle>
              <Button size="sm" onClick={() => openCreateForm()}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                新增
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2 max-h-[600px] overflow-y-auto">
            {categories.map((cat) => (
              <CategoryTreeNode
                key={cat.id}
                category={cat}
                selectedId={selectedCategory?.id ?? null}
                onSelect={handleSelect}
                expandedIds={expandedIds}
                onToggleExpand={toggleExpand}
              />
            ))}
          </CardContent>
        </Card>

        {/* 右侧：详情 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">分类详情</CardTitle>
              {selectedCategory && (
                <div className="flex items-center gap-2">
                  {selectedCategory.level === 1 && (
                    <Button size="sm" variant="outline" onClick={() => openCreateForm(selectedCategory.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      添加子分类
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={openEditForm}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    编辑
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteConfirmVisible(true)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    删除
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">分类名称</Label>
                    <div className="text-sm font-medium mt-1">{selectedCategory.name}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">分类编码</Label>
                    <div className="text-sm font-medium mt-1">{selectedCategory.code}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">级别</Label>
                    <div className="text-sm font-medium mt-1">{selectedCategory.level === 1 ? '一级分类' : '二级分类'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">状态</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Switch
                        checked={selectedCategory.isActive}
                        onCheckedChange={handleToggleActive}
                      />
                      <span className="text-sm">{selectedCategory.isActive ? '启用' : '禁用'}</span>
                    </div>
                  </div>
                </div>
                {selectedCategory.level === 1 && selectedCategory.children && (
                  <div>
                    <Label className="text-muted-foreground text-xs">子分类列表</Label>
                    <div className="mt-2 space-y-1">
                      {selectedCategory.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                          <span>{child.name}</span>
                          <span className="text-xs text-muted-foreground">{child.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
                <FolderTree className="w-10 h-10 mb-3 opacity-40" />
                请在左侧选择一个分类查看详情
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 新增/编辑表单弹窗 */}
      <Dialog open={formVisible} onOpenChange={setFormVisible}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? '编辑分类' : '新增分类'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>分类名称</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="请输入分类名称" />
            </div>
            <div className="space-y-2">
              <Label>分类编码</Label>
              <Input value={formCode} onChange={(e) => setFormCode(e.target.value)} placeholder="请输入分类编码，如 HC-01" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormVisible(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog open={deleteConfirmVisible} onOpenChange={setDeleteConfirmVisible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该分类吗？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后该分类将不再可用，已关联的费用记录不受影响。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
