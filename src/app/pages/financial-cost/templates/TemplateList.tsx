import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { initialExpenseTemplates, cycleTypeMap, type ExpenseTemplate } from '../mockData';

export default function TemplateList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ExpenseTemplate[]>(initialExpenseTemplates);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    setTemplates(prev => prev.filter(t => t.id !== deleteId));
    setDeleteId(null);
    toast.success('费用模板已删除');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">费用模板</h2>
        <Button size="sm" onClick={() => navigate('/financial-cost/templates/create')}>
          <Plus className="h-4 w-4 mr-1" />
          新增模板
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">模板名称</TableHead>
                  <TableHead className="w-[100px]">一级分类</TableHead>
                  <TableHead className="w-[100px]">二级分类</TableHead>
                  <TableHead className="w-[120px] text-right">金额（元）</TableHead>
                  <TableHead className="w-[80px]">周期</TableHead>
                  <TableHead className="w-[110px]">生效日期</TableHead>
                  <TableHead className="w-[110px]">结束日期</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[80px]">调整次数</TableHead>
                  <TableHead className="w-[100px] sticky right-0 bg-card">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  templates.map((tpl) => (
                    <TableRow key={tpl.id}>
                      <TableCell className="font-medium">{tpl.templateName}</TableCell>
                      <TableCell>{tpl.categoryName}</TableCell>
                      <TableCell>{tpl.subCategoryName}</TableCell>
                      <TableCell className="text-right font-medium">¥{tpl.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{cycleTypeMap[tpl.cycleType].label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{tpl.startDate}</TableCell>
                      <TableCell className="text-sm">{tpl.endDate ?? '长期'}</TableCell>
                      <TableCell>
                        <Badge variant={tpl.isActive ? 'default' : 'secondary'} className="text-[10px]">
                          {tpl.isActive ? '启用' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tpl.amountHistory.length > 0 ? (
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <Clock className="w-3 h-3" />
                            {tpl.amountHistory.length} 次
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="sticky right-0 bg-card">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigate(`/financial-cost/templates/${tpl.id}`)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteId(tpl.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该费用模板吗？</AlertDialogTitle>
            <AlertDialogDescription>删除后模板将不再生成费用记录。</AlertDialogDescription>
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
