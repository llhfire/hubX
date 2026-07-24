import { useState, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';

// ---------- 类型 ----------

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  location: string;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance';
}

interface Meeting {
  id: string;
  title: string;
  roomName: string;
  startTime: string;
  endTime: string;
  organizer: string;
  attendees: string[];
  agenda: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  projectId?: string;
  priority: 'high' | 'normal' | 'low';
}

interface MeetingMinute {
  id: string;
  meetingId: string;
  meetingTitle: string;
  date: string;
  decisions: string[];
  actionItems: { task: string; owner: string; deadline: string; done: boolean }[];
}

// ---------- 模拟数据 ----------

const mockRooms: MeetingRoom[] = [
  { id: 'room-1', name: '会议室 A（大）', capacity: 20, location: '3楼东侧', equipment: ['投影仪', '白板', '视频会议系统'], status: 'available' },
  { id: 'room-2', name: '会议室 B（中）', capacity: 10, location: '3楼西侧', equipment: ['投影仪', '白板'], status: 'occupied' },
  { id: 'room-3', name: '会议室 C（小）', capacity: 6,  location: '2楼南侧', equipment: ['显示屏'], status: 'available' },
  { id: 'room-4', name: '洽谈室',       capacity: 4,  location: '1楼前台旁', equipment: ['显示屏', '电话'], status: 'available' },
  { id: 'room-5', name: '培训室',       capacity: 30, location: '4楼整层', equipment: ['投影仪', '音响', '白板', '录播系统'], status: 'maintenance' },
];

const mockMeetings: Meeting[] = [
  { id: 'mt-1', title: 'CRM 项目周会', roomName: '会议室 B（中）', startTime: '2026-07-02 10:00', endTime: '2026-07-02 11:00', organizer: '张三', attendees: ['张三', '李四', '王五', '黄丽'], agenda: '1. 进度同步\n2. 问题讨论\n3. 下周计划', status: 'ongoing', projectId: '1', priority: 'normal' },
  { id: 'mt-2', title: '云服务平台需求评审', roomName: '会议室 A（大）', startTime: '2026-07-02 14:00', endTime: '2026-07-02 16:00', organizer: '徐强', attendees: ['徐强', '李四', '陈明', '林小红'], agenda: '1. 需求文档评审\n2. 技术方案讨论\n3. 排期确认', status: 'scheduled', projectId: '2', priority: 'high' },
  { id: 'mt-3', title: '电商平台验收准备', roomName: '会议室 C（小）', startTime: '2026-07-03 09:30', endTime: '2026-07-03 10:30', organizer: '李四', attendees: ['李四', '赵六', '陈明'], agenda: '验收清单确认', status: 'scheduled', projectId: '3', priority: 'high' },
  { id: 'mt-4', title: 'Q2 季度复盘会', roomName: '会议室 A（大）', startTime: '2026-06-30 14:00', endTime: '2026-06-30 17:00', organizer: '徐强', attendees: ['徐强', '张三', '李四', '王五', '赵六', '黄丽', '陈明'], agenda: 'Q2 项目复盘与 Q3 规划', status: 'completed', priority: 'normal' },
  { id: 'mt-5', title: '客户 A 项目启动会', roomName: '洽谈室', startTime: '2026-07-01 10:00', endTime: '2026-07-01 11:30', organizer: '张三', attendees: ['张三', '钱七'], agenda: '项目启动沟通', status: 'completed', projectId: '1', priority: 'normal' },
];

const mockMinutes: MeetingMinute[] = [
  {
    id: 'min-1', meetingId: 'mt-4', meetingTitle: 'Q2 季度复盘会', date: '2026-06-30',
    decisions: ['Q3 重点推进 CRM 系统升级', '增加自动化测试覆盖率目标至 80%'],
    actionItems: [
      { task: '编写 Q3 技术规划', owner: '徐强', deadline: '2026-07-10', done: false },
      { task: '搭建自动化测试框架', owner: '黄丽', deadline: '2026-07-15', done: false },
      { task: '完成 CRM 看板优化', owner: '王五', deadline: '2026-07-08', done: true },
    ],
  },
  {
    id: 'min-2', meetingId: 'mt-5', meetingTitle: '客户 A 项目启动会', date: '2026-07-01',
    decisions: ['项目周期 3 个月', '采用敏捷开发模式，2 周一个 Sprint'],
    actionItems: [
      { task: '签署合同', owner: '张三', deadline: '2026-07-03', done: true },
      { task: '组建项目团队', owner: '徐强', deadline: '2026-07-05', done: true },
    ],
  },
];

// ---------- 表单数据类型 ----------

interface RoomFormData {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  status: 'available' | 'occupied' | 'maintenance';
}

interface MeetingFormData {
  title: string;
  roomName: string;
  priority: 'high' | 'normal' | 'low';
  startTime: string;
  endTime: string;
  organizer: string;
  attendees: string;
  agenda: string;
}

// ---------- 状态标签配置 ----------

const roomStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  available:   { label: '空闲', variant: 'default' },
  occupied:    { label: '使用中', variant: 'secondary' },
  maintenance: { label: '维护中', variant: 'destructive' },
};

const meetingStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  scheduled:  { label: '已预约', variant: 'default' },
  ongoing:    { label: '进行中', variant: 'secondary' },
  completed:  { label: '已结束', variant: 'outline' },
  cancelled:  { label: '已取消', variant: 'destructive' },
};

const priorityLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  high:   { label: '高', variant: 'destructive' },
  normal: { label: '普通', variant: 'default' },
  low:    { label: '低', variant: 'outline' },
};

// ---------- 主组件 ----------

export function MeetingManagement() {
  const [activeTab, setActiveTab] = useState('meetings');
  const [rooms, setRooms] = useState(mockRooms);
  const [meetings, setMeetings] = useState(mockMeetings);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<MeetingRoom | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  const [roomFormData, setRoomFormData] = useState<RoomFormData>({
    name: '',
    capacity: 10,
    location: '',
    equipment: '',
    status: 'available',
  });

  const [meetingFormData, setMeetingFormData] = useState<MeetingFormData>({
    title: '',
    roomName: '',
    priority: 'normal',
    startTime: '',
    endTime: '',
    organizer: '',
    attendees: '',
    agenda: '',
  });

  const [roomFormErrors, setRoomFormErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});
  const [meetingFormErrors, setMeetingFormErrors] = useState<Partial<Record<keyof MeetingFormData, string>>>({});

  const summary = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const todayMeetings = meetings.filter(m => m.startTime.startsWith('2026-07-02')).length;
    const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').length;
    return { totalRooms, availableRooms, todayMeetings, upcomingMeetings, totalMeetings: meetings.length, completedMeetings: meetings.filter(m => m.status === 'completed').length };
  }, [rooms, meetings]);

  // ---------- 会议室表单验证 ----------
  const validateRoomForm = (): boolean => {
    const errors: Partial<Record<keyof RoomFormData, string>> = {};
    if (!roomFormData.name.trim()) errors.name = '请输入名称';
    if (!roomFormData.capacity || roomFormData.capacity <= 0) errors.capacity = '请输入容量';
    if (!roomFormData.location.trim()) errors.location = '请输入位置';
    setRoomFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------- 会议表单验证 ----------
  const validateMeetingForm = (): boolean => {
    const errors: Partial<Record<keyof MeetingFormData, string>> = {};
    if (!meetingFormData.title.trim()) errors.title = '请输入主题';
    if (!meetingFormData.roomName) errors.roomName = '请选择会议室';
    if (!meetingFormData.startTime) errors.startTime = '请选择开始时间';
    if (!meetingFormData.endTime) errors.endTime = '请选择结束时间';
    if (!meetingFormData.organizer.trim()) errors.organizer = '请输入组织人';
    setMeetingFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------- 会议室操作 ----------
  const handleAddRoom = () => {
    setEditingRoom(null);
    setRoomFormData({ name: '', capacity: 10, location: '', equipment: '', status: 'available' });
    setRoomFormErrors({});
    setRoomModalVisible(true);
  };

  const handleEditRoom = (room: MeetingRoom) => {
    setEditingRoom(room);
    setRoomFormData({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      equipment: room.equipment.join(', '),
      status: room.status,
    });
    setRoomFormErrors({});
    setRoomModalVisible(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (window.confirm('确定删除该会议室吗？')) {
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleRoomSubmit = () => {
    if (!validateRoomForm()) return;
    const equipmentArr = roomFormData.equipment
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);
    const values: Omit<MeetingRoom, 'id'> = {
      name: roomFormData.name,
      capacity: Number(roomFormData.capacity),
      location: roomFormData.location,
      equipment: equipmentArr,
      status: roomFormData.status,
    };
    if (editingRoom) {
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...values } : r));
    } else {
      setRooms(prev => [...prev, { id: `room-${Date.now()}`, ...values }]);
    }
    setRoomModalVisible(false);
  };

  // ---------- 会议操作 ----------
  const handleAddMeeting = () => {
    setEditingMeeting(null);
    setMeetingFormData({ title: '', roomName: '', priority: 'normal', startTime: '', endTime: '', organizer: '', attendees: '', agenda: '' });
    setMeetingFormErrors({});
    setMeetingModalVisible(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setMeetingFormData({
      title: meeting.title,
      roomName: meeting.roomName,
      priority: meeting.priority,
      startTime: meeting.startTime.replace(' ', 'T'),
      endTime: meeting.endTime.replace(' ', 'T'),
      organizer: meeting.organizer,
      attendees: meeting.attendees.join(', '),
      agenda: meeting.agenda,
    });
    setMeetingFormErrors({});
    setMeetingModalVisible(true);
  };

  const handleCancelMeeting = (id: string) => {
    if (window.confirm('确定取消该会议吗？')) {
      setMeetings(prev => prev.map(m => m.id === id ? { ...m, status: 'cancelled' as const } : m));
    }
  };

  const handleMeetingSubmit = () => {
    if (!validateMeetingForm()) return;
    const attendeesArr = meetingFormData.attendees
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);
    const startFormatted = meetingFormData.startTime.replace('T', ' ');
    const endFormatted = meetingFormData.endTime.replace('T', ' ');
    const values: Omit<Meeting, 'id' | 'status'> = {
      title: meetingFormData.title,
      roomName: meetingFormData.roomName,
      priority: meetingFormData.priority,
      startTime: startFormatted,
      endTime: endFormatted,
      organizer: meetingFormData.organizer,
      attendees: attendeesArr,
      agenda: meetingFormData.agenda,
    };
    if (editingMeeting) {
      setMeetings(prev => prev.map(m => m.id === editingMeeting.id ? { ...m, ...values } : m));
    } else {
      setMeetings(prev => [...prev, { id: `mt-${Date.now()}`, ...values, status: 'scheduled' }]);
    }
    setMeetingModalVisible(false);
  };

  // ---------- 辅助：更新表单字段 ----------
  const updateRoomField = (field: keyof RoomFormData, value: string | number) => {
    setRoomFormData(prev => ({ ...prev, [field]: value }));
    if (roomFormErrors[field]) {
      setRoomFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updateMeetingField = (field: keyof MeetingFormData, value: string) => {
    setMeetingFormData(prev => ({ ...prev, [field]: value }));
    if (meetingFormErrors[field]) {
      setMeetingFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // ---------- 渲染 ----------

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="size-4 text-primary" />
              <span className="text-sm text-muted-foreground">会议室</span>
            </div>
            <div className="text-2xl font-bold">{summary.totalRooms} <span className="text-sm font-normal text-muted-foreground">间</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="size-4 text-green-500" />
              <span className="text-sm text-muted-foreground">空闲</span>
            </div>
            <div className="text-2xl font-bold">{summary.availableRooms} <span className="text-sm font-normal text-muted-foreground">间</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="size-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">今日会议</span>
            </div>
            <div className="text-2xl font-bold">{summary.todayMeetings} <span className="text-sm font-normal text-muted-foreground">场</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="size-4 text-primary" />
              <span className="text-sm text-muted-foreground">待开会议</span>
            </div>
            <div className="text-2xl font-bold">{summary.upcomingMeetings} <span className="text-sm font-normal text-muted-foreground">场</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="size-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">会议总数</span>
            </div>
            <div className="text-2xl font-bold">{summary.totalMeetings} <span className="text-sm font-normal text-muted-foreground">场</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="size-4 text-green-500" />
              <span className="text-sm text-muted-foreground">已完成</span>
            </div>
            <div className="text-2xl font-bold">{summary.completedMeetings} <span className="text-sm font-normal text-muted-foreground">场</span></div>
          </CardContent>
        </Card>
      </div>

      {/* 主体 Tab */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="meetings" className="gap-1.5">
                <Calendar className="size-4" />
                会议安排
                {summary.upcomingMeetings > 0 && (
                  <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs">{summary.upcomingMeetings}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rooms" className="gap-1.5">
                <MapPin className="size-4" />
                会议室管理
              </TabsTrigger>
              <TabsTrigger value="minutes" className="gap-1.5">
                <Edit className="size-4" />
                会议记录
              </TabsTrigger>
            </TabsList>

            {/* 会议安排 Tab */}
            <TabsContent value="meetings" className="pt-4">
              <div className="mb-4 flex justify-end">
                <Button onClick={handleAddMeeting}>
                  <Plus className="size-4 mr-1" />
                  预约会议
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 180 }}>会议主题</TableHead>
                    <TableHead style={{ width: 70 }}>优先级</TableHead>
                    <TableHead style={{ width: 110 }}>会议室</TableHead>
                    <TableHead style={{ width: 200 }}>时间</TableHead>
                    <TableHead style={{ width: 70 }}>组织人</TableHead>
                    <TableHead style={{ width: 120 }}>参会人</TableHead>
                    <TableHead style={{ width: 70 }}>状态</TableHead>
                    <TableHead style={{ width: 130 }}>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map(row => (
                    <TableRow key={row.id}>
                      <TableCell className="font-semibold">{row.title}</TableCell>
                      <TableCell>
                        <Badge variant={priorityLabels[row.priority]?.variant || 'outline'}>
                          {priorityLabels[row.priority]?.label || row.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.roomName}</TableCell>
                      <TableCell>{row.startTime} ~ {row.endTime.slice(11)}</TableCell>
                      <TableCell>{row.organizer}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-1">
                          {row.attendees.slice(0, 4).map(u => (
                            <Avatar key={u} className="size-6 border-2 border-background">
                              <AvatarFallback className="text-[11px] bg-primary text-primary-foreground">
                                {u.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {row.attendees.length > 4 && (
                            <Avatar className="size-6 border-2 border-background">
                              <AvatarFallback className="text-[11px] bg-muted text-muted-foreground">
                                +{row.attendees.length - 4}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={meetingStatusLabels[row.status]?.variant || 'outline'}>
                          {meetingStatusLabels[row.status]?.label || row.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditMeeting(row)}>
                            <Edit className="size-3.5 mr-1" />
                            编辑
                          </Button>
                          {row.status === 'scheduled' && (
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleCancelMeeting(row.id)}>
                              <XCircle className="size-3.5 mr-1" />
                              取消
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* 会议室管理 Tab */}
            <TabsContent value="rooms" className="pt-4">
              <div className="mb-4 flex justify-end">
                <Button onClick={handleAddRoom}>
                  <Plus className="size-4 mr-1" />
                  新增会议室
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {rooms.map(room => (
                  <Card key={room.id} className="overflow-hidden" style={{ borderTop: `3px solid ${room.status === 'available' ? 'hsl(var(--primary))' : room.status === 'occupied' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--destructive))'}` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[15px]">{room.name}</span>
                        <Badge variant={roomStatusLabels[room.status]?.variant || 'outline'}>
                          {roomStatusLabels[room.status]?.label || room.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2 space-y-0.5">
                        <div className="flex items-center gap-1"><MapPin className="size-3" /> {room.location}</div>
                        <div className="flex items-center gap-1"><Users className="size-3" /> 容量 {room.capacity} 人</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {room.equipment.map(e => (
                          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                        ))}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEditRoom(room)}>
                          <Edit className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => handleDeleteRoom(room.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 会议记录 Tab */}
            <TabsContent value="minutes" className="pt-4">
              {mockMinutes.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">暂无会议记录</p>
              ) : (
                <div className="space-y-4">
                  {mockMinutes.map(min => (
                    <Card key={min.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-base flex items-center gap-1">
                            <Edit className="size-4" />
                            {min.meetingTitle}
                          </h3>
                          <span className="text-xs text-muted-foreground">{min.date}</span>
                        </div>

                        {min.decisions.length > 0 && (
                          <div className="mb-3">
                            <p className="font-semibold text-sm">决议事项：</p>
                            <ul className="mt-1 ml-5 list-disc text-sm">
                              {min.decisions.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                          </div>
                        )}

                        {min.actionItems.length > 0 && (
                          <div>
                            <p className="font-semibold text-sm">行动项：</p>
                            <Table className="mt-2">
                              <TableHeader>
                                <TableRow>
                                  <TableHead style={{ width: 200 }}>任务</TableHead>
                                  <TableHead style={{ width: 70 }}>负责人</TableHead>
                                  <TableHead style={{ width: 100 }}>截止日期</TableHead>
                                  <TableHead style={{ width: 70 }}>状态</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {min.actionItems.map((item, idx) => (
                                  <TableRow key={`${min.id}-${idx}`}>
                                    <TableCell>{item.task}</TableCell>
                                    <TableCell>{item.owner}</TableCell>
                                    <TableCell>{item.deadline}</TableCell>
                                    <TableCell>
                                      <Badge variant={item.done ? 'default' : 'secondary'} className="text-xs">
                                        {item.done ? '已完成' : '待办'}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 会议室弹窗 */}
      <Dialog open={roomModalVisible} onOpenChange={setRoomModalVisible}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRoom ? '编辑会议室' : '新增会议室'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>名称 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="如：会议室 A"
                value={roomFormData.name}
                onChange={e => updateRoomField('name', e.target.value)}
              />
              {roomFormErrors.name && <p className="text-xs text-destructive">{roomFormErrors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>容量 <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="人数"
                  value={roomFormData.capacity}
                  onChange={e => updateRoomField('capacity', Number(e.target.value))}
                />
                {roomFormErrors.capacity && <p className="text-xs text-destructive">{roomFormErrors.capacity}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>状态 <span className="text-destructive">*</span></Label>
                <Select value={roomFormData.status} onValueChange={v => updateRoomField('status', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">空闲</SelectItem>
                    <SelectItem value="occupied">使用中</SelectItem>
                    <SelectItem value="maintenance">维护中</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>位置 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="如：3楼东侧"
                value={roomFormData.location}
                onChange={e => updateRoomField('location', e.target.value)}
              />
              {roomFormErrors.location && <p className="text-xs text-destructive">{roomFormErrors.location}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>设备</Label>
              <Input
                placeholder="输入设备，用逗号分隔"
                value={roomFormData.equipment}
                onChange={e => updateRoomField('equipment', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomModalVisible(false)}>取消</Button>
            <Button onClick={handleRoomSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 会议弹窗 */}
      <Dialog open={meetingModalVisible} onOpenChange={setMeetingModalVisible}>
        <DialogContent className="max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editingMeeting ? '编辑会议' : '预约会议'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>会议主题 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="会议主题"
                value={meetingFormData.title}
                onChange={e => updateMeetingField('title', e.target.value)}
              />
              {meetingFormErrors.title && <p className="text-xs text-destructive">{meetingFormErrors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>会议室 <span className="text-destructive">*</span></Label>
                <Select value={meetingFormData.roomName} onValueChange={v => updateMeetingField('roomName', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择会议室" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.filter(r => r.status === 'available').map(r => (
                      <SelectItem key={r.id} value={r.name}>{r.name}（{r.capacity}人）</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {meetingFormErrors.roomName && <p className="text-xs text-destructive">{meetingFormErrors.roomName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>优先级</Label>
                <Select value={meetingFormData.priority} onValueChange={v => updateMeetingField('priority', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>开始时间 <span className="text-destructive">*</span></Label>
                <Input
                  type="datetime-local"
                  value={meetingFormData.startTime}
                  onChange={e => updateMeetingField('startTime', e.target.value)}
                />
                {meetingFormErrors.startTime && <p className="text-xs text-destructive">{meetingFormErrors.startTime}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>结束时间 <span className="text-destructive">*</span></Label>
                <Input
                  type="datetime-local"
                  value={meetingFormData.endTime}
                  onChange={e => updateMeetingField('endTime', e.target.value)}
                />
                {meetingFormErrors.endTime && <p className="text-xs text-destructive">{meetingFormErrors.endTime}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>组织人 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="组织人姓名"
                value={meetingFormData.organizer}
                onChange={e => updateMeetingField('organizer', e.target.value)}
              />
              {meetingFormErrors.organizer && <p className="text-xs text-destructive">{meetingFormErrors.organizer}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>参会人</Label>
              <Input
                placeholder="输入参会人，用逗号分隔"
                value={meetingFormData.attendees}
                onChange={e => updateMeetingField('attendees', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>议程</Label>
              <Textarea
                placeholder="会议议程"
                rows={4}
                value={meetingFormData.agenda}
                onChange={e => updateMeetingField('agenda', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingModalVisible(false)}>取消</Button>
            <Button onClick={handleMeetingSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
