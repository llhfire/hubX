import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  contractCostPermissions,
  getHourlyRate,
  getSalaryForMonth,
  mockSalaryData,
  type MonthlySalaryRecord,
} from './contractCostData';

const MONTHS = ['2026-05', '2026-04', '2026-03', '2026-02', '2026-01'];

export function SalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [salaryModalVisible, setSalaryModalVisible] = useState(false);
  const [hoursModalVisible, setHoursModalVisible] = useState(false);

  const { salaryView, salaryEdit } = contractCostPermissions;

  if (!salaryView) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          暂无权限查看工资表
        </CardContent>
      </Card>
    );
  }

  const data = getSalaryForMonth(selectedMonth, mockSalaryData);

  const mask = (value: string | number) => (salaryView ? value : '***');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold m-0">工资表</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {salaryEdit && (
            <>
              <Button onClick={() => setSalaryModalVisible(true)}>
                <Upload className="h-4 w-4 mr-1" />
                导入工资
              </Button>
              <Button variant="outline" onClick={() => setHoursModalVisible(true)}>
                <Upload className="h-4 w-4 mr-1" />
                导入实际工时
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">员工姓名</TableHead>
                <TableHead className="w-[100px]">部门</TableHead>
                <TableHead className="w-[140px]">职位</TableHead>
                <TableHead className="w-[120px]">名义月工资</TableHead>
                <TableHead className="w-[110px]">名义月工时</TableHead>
                <TableHead className="w-[110px]">名义时薪</TableHead>
                <TableHead className="w-[120px]">实际月工资</TableHead>
                <TableHead className="w-[110px]">实际月工时</TableHead>
                <TableHead className="w-[110px]">实际时薪</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.employeeId}>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.position}</TableCell>
                  <TableCell>{mask(record.nominalSalary.toLocaleString())}</TableCell>
                  <TableCell>{record.nominalHours}</TableCell>
                  <TableCell>{mask(getHourlyRate(record, false).toFixed(2))}</TableCell>
                  <TableCell>
                    {record.actualSalary != null ? mask(record.actualSalary.toLocaleString()) : '-'}
                  </TableCell>
                  <TableCell>
                    {record.actualHours != null ? record.actualHours : '-'}
                  </TableCell>
                  <TableCell>
                    {record.actualSalary != null && record.actualHours != null
                      ? mask(getHourlyRate(record, true).toFixed(2))
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {record.inherited ? (
                      <Badge variant="destructive">沿用上月</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-500">已录入</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 导入工资弹窗 */}
      <Dialog open={salaryModalVisible} onOpenChange={setSalaryModalVisible}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>导入工资</DialogTitle>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">点击或拖拽文件到此区域上传</p>
            <p className="text-xs text-muted-foreground mt-1">支持 .xlsx, .xls, .csv 格式</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSalaryModalVisible(false)}>取消</Button>
            <Button onClick={() => setSalaryModalVisible(false)}>确认导入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 导入实际工时弹窗 */}
      <Dialog open={hoursModalVisible} onOpenChange={setHoursModalVisible}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>导入实际工时</DialogTitle>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">点击或拖拽文件到此区域上传</p>
            <p className="text-xs text-muted-foreground mt-1">支持 .xlsx, .xls, .csv 格式</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHoursModalVisible(false)}>取消</Button>
            <Button onClick={() => setHoursModalVisible(false)}>确认导入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
