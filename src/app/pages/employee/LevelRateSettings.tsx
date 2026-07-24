import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Save, Users } from 'lucide-react';
import { useEmployee } from './EmployeeContext';
import {
  LevelRateConfig,
  Position,
  ALL_POSITIONS,
  ALL_JOB_LEVELS,
  formatCurrency,
  getLevelColor,
} from './mockData';

export function LevelRateSettings() {
  const { levelRates, updateLevelRate } = useEmployee();

  const [activePosition, setActivePosition] = useState<string>('前端开发');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const positionRates = useMemo(
    () => levelRates.filter(r => r.position === activePosition),
    [levelRates, activePosition],
  );

  const handleEdit = (record: LevelRateConfig) => {
    setEditingKey(`${record.level}-${record.position}`);
    setEditValue(record.standardRate);
  };

  const handleSave = (record: LevelRateConfig) => {
    updateLevelRate(record.level, record.position, editValue);
    setEditingKey(null);
    toast.success(`已更新 ${record.level}·${record.position} 的标准时薪为 ${formatCurrency(editValue)}/h，对应员工已同步更新`);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5" />
              职级 × 职位 标准时薪配置
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              修改标准时薪后，系统中对应「职级 × 职位」的员工标准时薪会自动同步更新。
            </p>
          </div>

          <Tabs value={activePosition} onValueChange={setActivePosition}>
            <TabsList>
              {ALL_POSITIONS.map(pos => (
                <TabsTrigger key={pos} value={pos}>{pos}</TabsTrigger>
              ))}
            </TabsList>

            {ALL_POSITIONS.map(pos => (
              <TabsContent key={pos} value={pos}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>职级</TableHead>
                      <TableHead>职位</TableHead>
                      <TableHead>时薪范围（元/小时）</TableHead>
                      <TableHead>标准时薪（元/小时）</TableHead>
                      <TableHead>等级描述</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positionRates.map(record => {
                      const key = `${record.level}-${record.position}`;
                      const isEditing = editingKey === key;
                      return (
                        <TableRow key={key}>
                          <TableCell>
                            <Badge className={getLevelColor(record.level)} style={{ fontWeight: 700 }}>
                              {record.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.position}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatCurrency(record.minRate)} ~ {formatCurrency(record.maxRate)}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  className="w-[100px]"
                                  min={record.minRate}
                                  max={record.maxRate}
                                  value={editValue}
                                  onChange={e => setEditValue(parseFloat(e.target.value) || 0)}
                                  autoFocus
                                />
                                <Button variant="ghost" size="sm" onClick={() => handleSave(record)}>
                                  保存
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setEditingKey(null)}>
                                  取消
                                </Button>
                              </div>
                            ) : (
                              <span className="font-bold text-primary text-[15px]">
                                {formatCurrency(record.standardRate)}/h
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>
                            {!isEditing && (
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                                <Save className="mr-1 size-4" />
                                编辑时薪
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
