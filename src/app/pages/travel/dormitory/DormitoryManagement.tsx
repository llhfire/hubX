import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { Plus, Building2, Bed, User, Wrench, DollarSign, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { DormitoryBuilding, DormitoryRoom, DormitoryCheckIn } from '../types';
import { getDormitoryList } from '../travel-api';

export function DormitoryManagement() {
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<DormitoryBuilding[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<DormitoryBuilding | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [checkInVisible, setCheckInVisible] = useState(false);

  // 新建楼栋表单
  const [buildingForm, setBuildingForm] = useState({
    name: '',
    city: '',
    district: '',
    street: '',
    community: '',
    address: '',
    landlordName: '',
    landlordPhone: '',
    leaseStartDate: '',
    leaseEndDate: '',
    monthlyRent: 0,
    deposit: 0,
  });

  // 入住表单
  const [checkInForm, setCheckInForm] = useState({
    employeeId: '',
    employeeName: '',
    buildingId: '',
    floorId: '',
    roomId: '',
    bedId: '',
    checkInDate: '',
    checkInType: 'long_term' as 'long_term' | 'trip',
    tripId: '',
  });

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    setLoading(true);
    try {
      const result = await getDormitoryList();
      setBuildings(result.list);
      if (result.list.length > 0) {
        setSelectedBuilding(result.list[0]);
      }
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存楼栋
  const handleSaveBuilding = () => {
    if (!buildingForm.name || !buildingForm.city) {
      toast.error('请填写完整信息');
      return;
    }
    toast.success('创建成功');
    setFormVisible(false);
    loadBuildings();
  };

  // 办理入住
  const handleCheckIn = () => {
    if (!checkInForm.employeeName || !checkInForm.bedId) {
      toast.error('请填写完整信息');
      return;
    }
    toast.success('入住登记成功');
    setCheckInVisible(false);
  };

  // 获取房间状态颜色
  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300';
      case 'occupied': return 'bg-blue-100 border-blue-300';
      case 'maintenance': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  // 获取床位状态颜色
  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-50 border-green-200';
      case 'occupied': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="rooms" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="rooms">房间管理</TabsTrigger>
            <TabsTrigger value="checkin">入住管理</TabsTrigger>
            <TabsTrigger value="expenses">费用管理</TabsTrigger>
            <TabsTrigger value="maintenance">维护管理</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setFormVisible(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增楼栋
            </Button>
            <Button onClick={() => setCheckInVisible(true)}>
              <User className="mr-2 h-4 w-4" />
              入住登记
            </Button>
          </div>
        </div>

        {/* 房间管理 */}
        <TabsContent value="rooms">
          <div className="grid grid-cols-4 gap-4">
            {/* 左侧：楼栋列表 */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-base">楼栋列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {buildings.map((building) => (
                    <div
                      key={building.id}
                      className={`p-3 rounded-md cursor-pointer border ${
                        selectedBuilding?.id === building.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedBuilding(building)}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{building.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {building.city} {building.district}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        月租 ¥{building.monthlyRent.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 右侧：房间详情 */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>
                  {selectedBuilding ? selectedBuilding.name : '请选择楼栋'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBuilding ? (
                  <div className="space-y-6">
                    {/* 楼栋信息 */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-md">
                      <div>
                        <div className="text-sm text-muted-foreground">地址</div>
                        <div className="font-medium">
                          {selectedBuilding.city} {selectedBuilding.district} {selectedBuilding.street} {selectedBuilding.community}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">房东</div>
                        <div className="font-medium">{selectedBuilding.landlordName} {selectedBuilding.landlordPhone}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">租期</div>
                        <div className="font-medium">{selectedBuilding.leaseStartDate} ~ {selectedBuilding.leaseEndDate}</div>
                      </div>
                    </div>

                    {/* 楼层和房间 */}
                    {selectedBuilding.floors?.map((floor) => (
                      <div key={floor.id}>
                        <h4 className="font-semibold mb-3">{floor.floorNumber}楼</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {floor.rooms?.map((room) => (
                            <div
                              key={room.id}
                              className={`p-3 rounded-md border ${getRoomStatusColor(room.status)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{room.roomNumber}</span>
                                <Badge variant="outline" className="text-xs">
                                  {room.roomType === 'single' ? '单人间' : room.roomType === 'double' ? '双人间' : '四人间'}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                设施：{room.facilities.join('、')}
                              </div>
                              <div className="space-y-1">
                                {room.beds?.map((bed) => (
                                  <div
                                    key={bed.id}
                                    className={`flex items-center justify-between p-1.5 rounded text-sm ${getBedStatusColor(bed.status)}`}
                                  >
                                    <div className="flex items-center gap-1">
                                      <Bed className="h-3 w-3" />
                                      <span>{bed.bedNumber}</span>
                                    </div>
                                    {bed.status === 'occupied' ? (
                                      <span className="text-blue-600">{bed.occupantName}</span>
                                    ) : (
                                      <span className="text-green-600">空闲</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    请选择楼栋查看房间
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 入住管理 */}
        <TabsContent value="checkin">
          <Card>
            <CardHeader>
              <CardTitle>入住记录</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>宿舍</TableHead>
                    <TableHead>房间</TableHead>
                    <TableHead>床位</TableHead>
                    <TableHead>入住日期</TableHead>
                    <TableHead>入住类型</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      暂无入住记录
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 费用管理 */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>宿舍费用</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>楼栋</TableHead>
                    <TableHead>费用类型</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>费用期间</TableHead>
                    <TableHead>分摊方式</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      暂无费用记录
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 维护管理 */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>维护记录</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>楼栋</TableHead>
                    <TableHead>房间</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>紧急程度</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      暂无维护记录
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新建楼栋弹窗 */}
      <Dialog open={formVisible} onOpenChange={setFormVisible}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新增楼栋</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>楼栋名称</Label>
                <Input
                  placeholder="如：杭州西湖公寓"
                  value={buildingForm.name}
                  onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>城市</Label>
                <Input
                  placeholder="如：杭州"
                  value={buildingForm.city}
                  onChange={(e) => setBuildingForm({ ...buildingForm, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>行政区</Label>
                <Input
                  placeholder="如：西湖区"
                  value={buildingForm.district}
                  onChange={(e) => setBuildingForm({ ...buildingForm, district: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>街道</Label>
                <Input
                  placeholder="如：文三路"
                  value={buildingForm.street}
                  onChange={(e) => setBuildingForm({ ...buildingForm, street: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>小区名称</Label>
                <Input
                  placeholder="如：翠苑小区"
                  value={buildingForm.community}
                  onChange={(e) => setBuildingForm({ ...buildingForm, community: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>详细地址</Label>
                <Input
                  placeholder="如：3栋"
                  value={buildingForm.address}
                  onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>房东姓名</Label>
                <Input
                  placeholder="房东姓名"
                  value={buildingForm.landlordName}
                  onChange={(e) => setBuildingForm({ ...buildingForm, landlordName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>房东电话</Label>
                <Input
                  placeholder="联系电话"
                  value={buildingForm.landlordPhone}
                  onChange={(e) => setBuildingForm({ ...buildingForm, landlordPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>租期开始</Label>
                <Input
                  type="date"
                  value={buildingForm.leaseStartDate}
                  onChange={(e) => setBuildingForm({ ...buildingForm, leaseStartDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>租期结束</Label>
                <Input
                  type="date"
                  value={buildingForm.leaseEndDate}
                  onChange={(e) => setBuildingForm({ ...buildingForm, leaseEndDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>月租金</Label>
                <Input
                  type="number"
                  placeholder="¥0"
                  value={buildingForm.monthlyRent || ''}
                  onChange={(e) => setBuildingForm({ ...buildingForm, monthlyRent: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>押金</Label>
                <Input
                  type="number"
                  placeholder="¥0"
                  value={buildingForm.deposit || ''}
                  onChange={(e) => setBuildingForm({ ...buildingForm, deposit: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormVisible(false)}>
              取消
            </Button>
            <Button onClick={handleSaveBuilding}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 入住登记弹窗 */}
      <Dialog open={checkInVisible} onOpenChange={setCheckInVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>入住登记</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>员工</Label>
                <Input
                  placeholder="选择员工"
                  value={checkInForm.employeeName}
                  onChange={(e) => setCheckInForm({ ...checkInForm, employeeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>入住类型</Label>
                <Select
                  value={checkInForm.checkInType}
                  onValueChange={(value) => setCheckInForm({ ...checkInForm, checkInType: value as 'long_term' | 'trip' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long_term">长期入住</SelectItem>
                    <SelectItem value="trip">出差入住</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>宿舍</Label>
              <Select
                value={checkInForm.buildingId}
                onValueChange={(value) => setCheckInForm({ ...checkInForm, buildingId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择宿舍" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>入住日期</Label>
              <Input
                type="date"
                value={checkInForm.checkInDate}
                onChange={(e) => setCheckInForm({ ...checkInForm, checkInDate: e.target.value })}
              />
            </div>
            {checkInForm.checkInType === 'trip' && (
              <div className="space-y-2">
                <Label>关联出差单</Label>
                <Input
                  placeholder="选择出差单"
                  value={checkInForm.tripId}
                  onChange={(e) => setCheckInForm({ ...checkInForm, tripId: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckInVisible(false)}>
              取消
            </Button>
            <Button onClick={handleCheckIn}>
              确认入住
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
