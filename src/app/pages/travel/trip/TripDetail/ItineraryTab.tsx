import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../components/ui/select';
import { Separator } from '../../../../components/ui/separator';
import { Plus, MapPin, Train, Plane, Car, Building2, Edit, Trash2, ArrowRight, LayoutList, GanttChart } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, ItinerarySegment, TransportMode } from '../../types';

interface ItineraryTabProps {
  trip: Trip;
  onUpdate: () => void;
}

const transportModeIcons: Record<TransportMode, typeof Train> = {
  high_speed_rail: Train,
  bullet_train: Train,
  airplane: Plane,
  self_drive: Car,
  bus: Car,
  ferry: Car,
  other: Car,
};

const transportModeLabels: Record<TransportMode, string> = {
  high_speed_rail: '高铁',
  bullet_train: '动车',
  airplane: '飞机',
  self_drive: '自驾',
  bus: '大巴',
  ferry: '轮船',
  other: '其他',
};

export function ItineraryTab({ trip, onUpdate }: ItineraryTabProps) {
  const [formVisible, setFormVisible] = useState(false);
  const [editingSegment, setEditingSegment] = useState<ItinerarySegment | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');
  const [form, setForm] = useState({
    departure: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    transportMode: 'high_speed_rail' as TransportMode,
    transportDetail: '',
    transportCost: 0,
    customerId: '',
    customerName: '',
    projectId: '',
    projectName: '',
  });

  const segments = trip.itinerarySegments || [];

  // 打开新建表单
  const handleCreate = () => {
    setEditingSegment(null);
    setForm({
      departure: '',
      destination: '',
      departureDate: '',
      arrivalDate: '',
      transportMode: 'high_speed_rail',
      transportDetail: '',
      transportCost: 0,
      customerId: trip.customerId || '',
      customerName: trip.customerName || '',
      projectId: trip.projectId || '',
      projectName: trip.projectName || '',
    });
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (segment: ItinerarySegment) => {
    setEditingSegment(segment);
    setForm({
      departure: segment.departure,
      destination: segment.destination,
      departureDate: segment.departureDate,
      arrivalDate: segment.arrivalDate,
      transportMode: segment.transportMode,
      transportDetail: segment.transportDetail || '',
      transportCost: segment.transportCost,
      customerId: segment.customerId || '',
      customerName: segment.customerName || '',
      projectId: segment.projectId || '',
      projectName: segment.projectName || '',
    });
    setFormVisible(true);
  };

  // 删除旅程段
  const handleDelete = (segment: ItinerarySegment) => {
    toast.success('删除成功');
    onUpdate();
  };

  // 保存
  const handleSave = () => {
    if (!form.departure || !form.destination || !form.departureDate) {
      toast.error('请填写完整信息');
      return;
    }
    toast.success(editingSegment ? '更新成功' : '创建成功');
    setFormVisible(false);
    onUpdate();
  };

  // 计算总费用
  const totalTransportCost = segments.reduce((sum, seg) => sum + seg.transportCost, 0);
  const totalAccommodationCost = segments.reduce((sum, seg) => sum + (seg.accommodation?.totalAmount || 0), 0);
  const totalExpense = segments.reduce((sum, seg) => sum + seg.totalExpense, 0);

  return (
    <div className="space-y-4">
      {/* 汇总信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">交通费用</div>
            <div className="text-2xl font-bold">¥{totalTransportCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">住宿费用</div>
            <div className="text-2xl font-bold">¥{totalAccommodationCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">总费用</div>
            <div className="text-2xl font-bold">¥{totalExpense.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* 旅程段列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>旅程段</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode('timeline')}
              >
                <GanttChart className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              添加旅程段
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {segments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无旅程段，请添加
            </div>
          ) : viewMode === 'list' ? (
            // 列表视图
            <div className="space-y-4">
              {segments.map((segment, index) => {
                const TransportIcon = transportModeIcons[segment.transportMode];
                return (
                  <div key={segment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">第 {index + 1} 段</Badge>
                        <Badge variant="secondary">
                          <TransportIcon className="h-3 w-3 mr-1" />
                          {transportModeLabels[segment.transportMode]}
                        </Badge>
                        {segment.transportDetail && (
                          <Badge variant="outline">{segment.transportDetail}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(segment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(segment)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{segment.departure}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{segment.destination}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {segment.departureDate}
                        {segment.departureDate !== segment.arrivalDate && ` ~ ${segment.arrivalDate}`}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">交通费用</div>
                        <div className="font-medium">¥{segment.transportCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">住宿</div>
                        <div className="font-medium">
                          {segment.accommodation
                            ? segment.accommodation.type === 'hotel'
                              ? `${segment.accommodation.hotelName} ¥${segment.accommodation.totalAmount}`
                              : `${segment.accommodation.dormitoryBuildingName} ${segment.accommodation.dormitoryRoomNumber}`
                            : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">关联客户</div>
                        <div className="font-medium">{segment.customerName || '-'}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">关联项目</div>
                        <div className="font-medium">{segment.projectName || '-'}</div>
                      </div>
                    </div>

                    {segment.expenses && segment.expenses.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-muted-foreground mb-2">其他费用</div>
                        <div className="space-y-1">
                          {segment.expenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {expense.type === 'meal' ? '餐饮' : expense.type === 'local_transport' ? '市内交通' : expense.type}
                                </Badge>
                                <span>{expense.date}</span>
                              </div>
                              <span className="font-medium">¥{expense.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // 时间轴视图
            <div className="relative pl-8">
              {segments.map((segment, index) => {
                const TransportIcon = transportModeIcons[segment.transportMode];
                const totalCost = segment.transportCost + (segment.accommodation?.totalAmount || 0) +
                  (segment.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0);
                const isLast = index === segments.length - 1;

                return (
                  <div key={segment.id} className="relative mb-6 last:mb-0">
                    {/* 时间轴线 */}
                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${isLast ? 'bg-gradient-to-b from-blue-500 to-transparent' : 'bg-blue-500'}`} />

                    {/* 时间轴节点 */}
                    <div className="absolute left-0 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />

                    {/* 出发节点标记 */}
                    {index === 0 && (
                      <div className="absolute left-0 -top-6 -translate-x-1/2 text-[10px] text-blue-600 font-medium">
                        出发
                      </div>
                    )}

                    {/* 内容卡片 */}
                    <div className="ml-6 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
                      {/* 头部：路线 + 交通方式 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{segment.departure}</span>
                            <div className="flex items-center gap-1 text-blue-500">
                              <div className="w-8 h-px bg-blue-300" />
                              <TransportIcon className="h-4 w-4" />
                              <div className="w-8 h-px bg-blue-300" />
                            </div>
                            <span className="font-semibold text-slate-800">{segment.destination}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {transportModeLabels[segment.transportMode]}
                            {segment.transportDetail && ` ${segment.transportDetail}`}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleEdit(segment)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => handleDelete(segment)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* 日期 */}
                      <div className="text-xs text-slate-500 mb-3">
                        {segment.departureDate}
                        {segment.departureDate !== segment.arrivalDate && ` ~ ${segment.arrivalDate}`}
                      </div>

                      {/* 费用明细 */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="p-2 bg-blue-50 rounded text-center">
                          <div className="text-[10px] text-slate-400">交通</div>
                          <div className="text-sm font-bold text-blue-600">¥{segment.transportCost.toLocaleString()}</div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded text-center">
                          <div className="text-[10px] text-slate-400">住宿</div>
                          <div className="text-sm font-bold text-purple-600">
                            ¥{(segment.accommodation?.totalAmount || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="p-2 bg-amber-50 rounded text-center">
                          <div className="text-[10px] text-slate-400">其他</div>
                          <div className="text-sm font-bold text-amber-600">
                            ¥{(segment.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-[10px] text-slate-400">小计</div>
                          <div className="text-sm font-bold text-green-600">¥{totalCost.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* 关联信息 */}
                      {(segment.customerName || segment.projectName) && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          {segment.customerName && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />{segment.customerName}
                            </span>
                          )}
                          {segment.projectName && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />{segment.projectName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 终点标记 */}
              {segments.length > 0 && (
                <div className="absolute left-0 -bottom-2 -translate-x-1/2 text-[10px] text-slate-400 font-medium">
                  到达
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新建/编辑表单弹窗 */}
      <Dialog open={formVisible} onOpenChange={setFormVisible}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingSegment ? '编辑旅程段' : '添加旅程段'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>出发地 <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="如：北京"
                  value={form.departure}
                  onChange={(e) => setForm({ ...form, departure: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>目的地 <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="如：杭州"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>出发日期 <span className="text-destructive">*</span></Label>
                <Input
                  type="date"
                  value={form.departureDate}
                  onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>到达日期</Label>
                <Input
                  type="date"
                  value={form.arrivalDate}
                  onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>交通方式 <span className="text-destructive">*</span></Label>
                <Select
                  value={form.transportMode}
                  onValueChange={(value) => setForm({ ...form, transportMode: value as TransportMode })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_speed_rail">高铁</SelectItem>
                    <SelectItem value="bullet_train">动车</SelectItem>
                    <SelectItem value="airplane">飞机</SelectItem>
                    <SelectItem value="self_drive">自驾</SelectItem>
                    <SelectItem value="bus">大巴</SelectItem>
                    <SelectItem value="ferry">轮船</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>交通班次</Label>
                <Input
                  placeholder="如：G101、CA1234"
                  value={form.transportDetail}
                  onChange={(e) => setForm({ ...form, transportDetail: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>交通费用</Label>
              <Input
                type="number"
                placeholder="¥0"
                value={form.transportCost || ''}
                onChange={(e) => setForm({ ...form, transportCost: Number(e.target.value) })}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>关联客户</Label>
                <Input
                  placeholder="选择客户（可选）"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>关联项目</Label>
                <Input
                  placeholder="选择项目（可选）"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormVisible(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
