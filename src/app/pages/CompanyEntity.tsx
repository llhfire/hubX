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
import { CompanyEntityInfoModal, type CompanyEntityModalMode } from './company-entity/CompanyEntityInfoModal';
import {
  companyEntityPermissions,
  mockCompanyEntities,
  type CompanyEntityRecord,
} from './company-entity/companyEntityData';

export function CompanyEntity() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<CompanyEntityModalMode>('view');
  const [editingRecord, setEditingRecord] = useState<CompanyEntityRecord | null>(null);

  const openModal = (mode: CompanyEntityModalMode, record: CompanyEntityRecord | null) => {
    setModalMode(mode);
    setEditingRecord(record);
    setModalVisible(true);
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>本公司主体管理</CardTitle>
          {companyEntityPermissions.create && (
            <Button onClick={() => openModal('edit', null)}>
              <Plus className="mr-2 h-4 w-4" />
              新建主体
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>公司名称</TableHead>
                  <TableHead>简称</TableHead>
                  <TableHead>统一社会信用代码</TableHead>
                  <TableHead>法定代表人</TableHead>
                  <TableHead>注册资本</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCompanyEntities.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.shortName}</TableCell>
                    <TableCell>{record.taxNumber}</TableCell>
                    <TableCell>{record.legalPerson}</TableCell>
                    <TableCell>{record.registeredCapital}</TableCell>
                    <TableCell>{record.contactPhone}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === '启用' ? 'default' : 'destructive'}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.createTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {companyEntityPermissions.view && (
                          <Button variant="ghost" size="sm" onClick={() => openModal('view', record)}>
                            查看
                          </Button>
                        )}
                        {companyEntityPermissions.edit && (
                          <Button variant="ghost" size="sm" onClick={() => openModal('edit', record)}>
                            <Pencil className="mr-1 h-3 w-3" />
                            编辑
                          </Button>
                        )}
                        {companyEntityPermissions.delete && (
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
                                  确定要删除该主体吗?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toast.success('删除成功')}>
                                  确定
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CompanyEntityInfoModal
        visible={modalVisible}
        mode={modalMode}
        defaultTab="basic"
        record={editingRecord}
        permissions={companyEntityPermissions}
        onOk={() => {
          toast.success(editingRecord ? '编辑成功' : '新建成功');
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
}
