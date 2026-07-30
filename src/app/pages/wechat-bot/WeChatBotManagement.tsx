// ========================================
// 机器人管理页（系统设置）
// ========================================

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Bot, Wifi, WifiOff, AlertTriangle, Monitor, RefreshCw, Plus, Settings, Loader2 } from 'lucide-react';
import { useWeChat } from './WeChatContext';
import { botStatusConfig, type WeChatBot } from './types';
import { toast } from 'sonner';

export default function WeChatBotManagement() {
  const { bots, isLoadingBots, fetchBots, updateBot } = useWeChat();
  const [editBot, setEditBot] = useState<WeChatBot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const statusIcons = {
    '在线': Wifi,
    '离线': WifiOff,
    '异常': AlertTriangle,
  };

  const handleEdit = (bot: WeChatBot) => {
    setEditBot(bot);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editBot) return;
    await updateBot(editBot.id, { remark: editBot.remark });
    toast.success('更新成功');
    setIsDialogOpen(false);
  };

  // 云端电脑状态
  const cloudPcs = bots.map(b => ({
    id: b.cloudComputer,
    botName: b.nickname,
    status: b.status,
    lastSync: b.lastSyncTime,
  }));

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" /> 微信机器人管理
          </h1>
          <p className="text-muted-foreground text-sm mt-1">管理微信机器人账号和云端电脑状态</p>
        </div>
        <Button onClick={() => { setEditBot(null); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> 新增机器人
        </Button>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">机器人总数</p>
                <p className="text-2xl font-bold">{bots.length}</p>
              </div>
              <Bot className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">在线</p>
                <p className="text-2xl font-bold text-green-600">{bots.filter(b => b.status === '在线').length}</p>
              </div>
              <Wifi className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">离线</p>
                <p className="text-2xl font-bold text-gray-500">{bots.filter(b => b.status === '离线').length}</p>
              </div>
              <WifiOff className="h-8 w-8 text-gray-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">异常</p>
                <p className="text-2xl font-bold text-red-600">{bots.filter(b => b.status === '异常').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 机器人列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">机器人账号列表</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBots ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>昵称</TableHead>
                  <TableHead>微信号</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>云端电脑</TableHead>
                  <TableHead>已加入群数</TableHead>
                  <TableHead>最后同步</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.map(bot => {
                  const StatusIcon = statusIcons[bot.status];
                  const statusConf = botStatusConfig[bot.status];
                  return (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.nickname}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{bot.wechatId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          statusConf.color === 'green' ? 'bg-green-50 border-green-200 text-green-700' :
                          statusConf.color === 'red' ? 'bg-red-50 border-red-200 text-red-700' :
                          'bg-gray-50 border-gray-200 text-gray-700'
                        }>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConf.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{bot.cloudComputer}</TableCell>
                      <TableCell>{bot.groupCount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {bot.lastSyncTime ? new Date(bot.lastSyncTime).toLocaleString('zh-CN') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleEdit(bot)}>
                            <Settings className="h-3 w-3 mr-1" /> 设置
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" /> 同步
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 云端电脑状态 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor className="h-4 w-4" /> 云端电脑状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cloudPcs.map(pc => (
              <div key={pc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{pc.id}</p>
                  <p className="text-xs text-muted-foreground">绑定: {pc.botName}</p>
                </div>
                <Badge variant="outline" className={
                  pc.status === '在线' ? 'bg-green-50 border-green-200 text-green-700' :
                  pc.status === '异常' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-gray-50 border-gray-200 text-gray-700'
                }>
                  {pc.status === '在线' ? '运行中' : pc.status === '异常' ? '异常' : '离线'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 编辑弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editBot ? '编辑机器人' : '新增机器人'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>微信昵称</Label>
              <Input value={editBot?.nickname || ''} disabled={!editBot} placeholder="输入微信昵称" />
            </div>
            <div className="space-y-2">
              <Label>微信号</Label>
              <Input value={editBot?.wechatId || ''} disabled={!editBot} placeholder="输入微信号" />
            </div>
            <div className="space-y-2">
              <Label>云端电脑</Label>
              <Input value={editBot?.cloudComputer || ''} disabled={!editBot} placeholder="输入云端电脑标识" />
            </div>
            <div className="space-y-2">
              <Label>备注</Label>
              <Input
                value={editBot?.remark || ''}
                onChange={(e) => editBot && setEditBot({ ...editBot, remark: e.target.value })}
                placeholder="备注信息"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
