import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ExpenseStandard, StandardDetail, CityLevel, SubsidyCalcMode } from '../types';
import { getExpenseStandardList } from '../travel-api';

export function StandardList() {
  const [loading, setLoading] = useState(false);
  const [standards, setStandards] = useState<ExpenseStandard[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<ExpenseStandard | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  // 标准表单
  const [standardForm, setStandardForm] = useState({
    name: '',
    effectiveDate: '',
    expiryDate: '',
  });

  // 明细表单
  const [detailForm, setDetailForm] = useState({
    levels: [] as string[],
    cityLevels: [] as CityLevel[],
    highSpeedRailClass: 'second' as 'second' | 'first' | 'business',
    bulletTrainClass: 'second' as 'second' | 'first',
    airplaneClass: 'economy' as 'economy' | 'business' | 'first',
    selfDriveRate: 0,
    localTransportLimit: 0,
    hotelLimit: 0,
    hotelRoomType: '',
    mealAllowance: 0,
    entertainmentMealLimit: 0,
    communicationAllowance: 0,
    miscellaneousAllowance: 0,
    subsidyCalcMode: 'calendar_day' as SubsidyCalcMode,
    subsidyAmount: 0,
  });

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    setLoading(true);
    try {
      const data = await getExpenseStandardList();
      setStandards(data);
      if (data.length > 0) {
        setSelectedStandard(data[0]);
      }
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存标准
  const handleSaveStandard = () => {
    if (!standardForm.name || !standardForm.effectiveDate) {
      toast.error('请填写完整信息');
      return;
    }
    toast.success('创建成功');
    setFormVisible(false);
    loadStandards();
  };

  // 职级选项
  const levelOptions = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];

  // 城市等级选项
  const cityLevelOptions: { value: CityLevel; label: string }[] = [
    { value: 'first_tier', label: '一线城市' },
    { value: 'second_tier', label: '二线城市' },
    { value: 'third_tier', label: '三线城市' },
    { value: 'other', label: '其他' },
  ];

  // 座位等级选项
  const seatClassOptions: Record<string, { value: string; label: string }[]> = {
    highSpeedRail: [
      { value: 'second', label: '二等座' },
      { value: 'first', label: '一等座' },
      { value: 'business', label: '商务座' },
    ],
    bulletTrain: [
      { value: 'second', label: '二等座' },
      { value: 'first', label: '一等座' },
    ],
    airplane: [
      { value: 'economy', label: '经济舱' },
      { value: 'business', label: '商务舱' },
      { value: 'first', label: '头等舱' },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">差旅费用标准</h2>
        <Button onClick={() => setFormVisible(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增标准
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* 左侧：标准列表 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base">标准列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {standards.map((standard) => (
                <div
                  key={standard.id}
                  className={`p-3 rounded-md cursor-pointer border ${
                    selectedStandard?.id === standard.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedStandard(standard)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{standard.name}</span>
                    <Badge variant={standard.status === 'active' ? 'default' : 'secondary'}>
                      {standard.status === 'active' ? '启用' : '禁用'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    生效日期：{standard.effectiveDate}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 右侧：标准详情 */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedStandard ? selectedStandard.name : '请选择标准'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStandard ? (
              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-md">
                  <div>
                    <div className="text-sm text-muted-foreground">标准名称</div>
                    <div className="font-medium">{selectedStandard.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">生效日期</div>
                    <div className="font-medium">{selectedStandard.effectiveDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">状态</div>
                    <Badge variant={selectedStandard.status === 'active' ? 'default' : 'secondary'}>
                      {selectedStandard.status === 'active' ? '启用' : '禁用'}
                    </Badge>
                  </div>
                </div>

                {/* 标准明细表格 */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>职级</TableHead>
                      <TableHead>城市等级</TableHead>
                      <TableHead>高铁</TableHead>
                      <TableHead>动车</TableHead>
                      <TableHead>飞机</TableHead>
                      <TableHead>住宿限额</TableHead>
                      <TableHead>餐补</TableHead>
                      <TableHead>补贴</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStandard.details.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="whitespace-nowrap">
                          {detail.levels.join('、')}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {detail.cityLevels.map(level => {
                            const option = cityLevelOptions.find(o => o.value === level);
                            return option?.label || level;
                          }).join('、')}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {seatClassOptions.highSpeedRail.find(o => o.value === detail.highSpeedRailClass)?.label}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {seatClassOptions.bulletTrain.find(o => o.value === detail.bulletTrainClass)?.label}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {seatClassOptions.airplane.find(o => o.value === detail.airplaneClass)?.label}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ¥{detail.hotelLimit}/晚
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ¥{detail.mealAllowance}/天
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ¥{detail.subsidyAmount}/天
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                请选择标准查看详情
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 新建标准弹窗 */}
      <Dialog open={formVisible} onOpenChange={setFormVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增费用标准</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>标准名称</Label>
              <Input
                placeholder="如：2026年差旅费用标准"
                value={standardForm.name}
                onChange={(e) => setStandardForm({ ...standardForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>生效日期</Label>
                <Input
                  type="date"
                  value={standardForm.effectiveDate}
                  onChange={(e) => setStandardForm({ ...standardForm, effectiveDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>失效日期（可选）</Label>
                <Input
                  type="date"
                  value={standardForm.expiryDate}
                  onChange={(e) => setStandardForm({ ...standardForm, expiryDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormVisible(false)}>
              取消
            </Button>
            <Button onClick={handleSaveStandard}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
