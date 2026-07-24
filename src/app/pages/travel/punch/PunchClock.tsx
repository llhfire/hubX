import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { MapPin, Clock, CheckCircle, AlertTriangle, Plane } from 'lucide-react';
import { toast } from 'sonner';
import type { PunchRecord } from '../types';
import { mockPunchRecords } from '../mock-data';

export function PunchClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>(mockPunchRecords);
  const [isOnTrip] = useState(true); // 模拟出差中状态
  const [tripDestination] = useState('杭州'); // 模拟出差目的地

  // 更新时间
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });

  // 打卡
  const handlePunch = (type: 'clock_in' | 'clock_out' | 'overtime') => {
    const newRecord: PunchRecord = {
      id: `punch-${Date.now()}`,
      employeeId: 'emp-001',
      employeeName: '张三',
      punchTime: currentTime.toLocaleString('zh-CN'),
      punchType: type,
      punchMethod: 'gps',
      longitude: 120.1234,
      latitude: 30.2345,
      address: '浙江省杭州市西湖区文三路',
      accuracy: 10,
      isOnTrip: isOnTrip,
      tripId: isOnTrip ? '1' : undefined,
      tripNo: isOnTrip ? 'BT20260425001' : undefined,
      status: 'normal',
    };
    setPunchRecords([newRecord, ...punchRecords]);
    toast.success(`${type === 'clock_in' ? '上班' : type === 'clock_out' ? '下班' : '加班'}打卡成功`);
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' });
  };

  // 打卡类型标签
  const punchTypeLabels: Record<string, string> = {
    clock_in: '上班',
    clock_out: '下班',
    overtime: '加班',
  };

  // 状态标签
  const statusLabels: Record<string, { text: string; variant: 'default' | 'destructive' | 'secondary' }> = {
    normal: { text: '正常', variant: 'default' },
    abnormal: { text: '异常', variant: 'destructive' },
    makeup: { text: '补卡', variant: 'secondary' },
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="clock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clock">打卡</TabsTrigger>
          <TabsTrigger value="records">打卡记录</TabsTrigger>
        </TabsList>

        {/* 打卡页面 */}
        <TabsContent value="clock">
          <div className="max-w-md mx-auto space-y-6">
            {/* 出差状态提示 */}
            {isOnTrip && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">出差中</div>
                      <div className="text-sm text-muted-foreground">
                        目的地：{tripDestination} | 关联出差单：BT20260425001
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 时间显示 */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-6xl font-bold font-mono">{formatTime(currentTime)}</div>
                <div className="text-muted-foreground mt-2">{formatDate(currentTime)}</div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isOnTrip ? `浙江省杭州市西湖区文三路` : '北京市朝阳区建国门外大街'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 打卡按钮 */}
            <div className="grid grid-cols-3 gap-4">
              <Button
                size="lg"
                className="h-24 text-lg"
                onClick={() => handlePunch('clock_in')}
              >
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-6 w-6" />
                  <span>上班打卡</span>
                </div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-24 text-lg"
                onClick={() => handlePunch('clock_out')}
              >
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-6 w-6" />
                  <span>下班打卡</span>
                </div>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-24 text-lg"
                onClick={() => handlePunch('overtime')}
              >
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-6 w-6" />
                  <span>加班打卡</span>
                </div>
              </Button>
            </div>

            {/* 今日打卡记录 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">今日打卡</CardTitle>
              </CardHeader>
              <CardContent>
                {punchRecords.filter(p => p.punchTime.startsWith('2026-04-28')).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    今日暂无打卡记录
                  </div>
                ) : (
                  <div className="space-y-2">
                    {punchRecords.filter(p => p.punchTime.startsWith('2026-04-28')).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">{punchTypeLabels[record.punchType]}</div>
                            <div className="text-sm text-muted-foreground">{record.punchTime}</div>
                          </div>
                        </div>
                        <Badge variant={statusLabels[record.status].variant}>
                          {statusLabels[record.status].text}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 打卡记录 */}
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>打卡记录</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>打卡时间</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>打卡方式</TableHead>
                    <TableHead>位置</TableHead>
                    <TableHead>出差</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {punchRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">{record.punchTime}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">{punchTypeLabels[record.punchType]}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {record.punchMethod === 'gps' ? 'GPS定位' : record.punchMethod === 'wifi' ? 'WiFi' : '手动补卡'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{record.address}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {record.isOnTrip ? (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <Plane className="h-3 w-3" />
                            出差中
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={statusLabels[record.status].variant}>
                          {statusLabels[record.status].text}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
