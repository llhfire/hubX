// ========================================
// 微信群管理页（线索管理子页面）
// ========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, MessageSquare, Users, Link2, Unlink, ArrowRight, Loader2, Archive } from 'lucide-react';
import { useWeChat } from './WeChatContext';
import { ActivityIndicator } from './components';
import { activityLevelConfig, type WeChatGroup, type ActivityLevel } from './types';
import { toast } from 'sonner';

export default function WeChatGroupList() {
  const navigate = useNavigate();
  const { groups, isLoadingGroups, fetchGroups } = useWeChat();
  const [keyword, setKeyword] = useState('');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('linked');

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // 筛选
  const filteredGroups = groups.filter(g => {
    if (keyword && !g.groupName.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (activityFilter !== 'all' && g.activityLevel !== activityFilter) return false;
    return true;
  });

  const linkedGroups = filteredGroups.filter(g => g.leadId || g.projectId);
  const unlinkedGroups = filteredGroups.filter(g => !g.leadId && !g.projectId);
  const archivedGroups = filteredGroups.filter(g => g.isArchived);

  const handleViewDetail = (group: WeChatGroup) => {
    if (group.leadId) {
      navigate(`/leads/${group.leadId}/chat-analysis`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" /> 微信群管理
        </h1>
        <p className="text-muted-foreground text-sm mt-1">管理机器人加入的业务群聊</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{groups.length}</p>
            <p className="text-xs text-muted-foreground">总群数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{groups.filter(g => g.activityLevel === '高').length}</p>
            <p className="text-xs text-muted-foreground">高活跃</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{groups.filter(g => g.activityLevel === '中').length}</p>
            <p className="text-xs text-muted-foreground">中活跃</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{groups.filter(g => g.activityLevel === '低').length}</p>
            <p className="text-xs text-muted-foreground">低活跃</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{groups.filter(g => g.activityLevel === '沉默').length}</p>
            <p className="text-xs text-muted-foreground">沉默</p>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索群名称..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={activityFilter} onValueChange={setActivityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="活跃度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="高">高活跃</SelectItem>
            <SelectItem value="中">中活跃</SelectItem>
            <SelectItem value="低">低活跃</SelectItem>
            <SelectItem value="沉默">沉默</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 群列表 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="linked" className="text-xs">
            已关联 <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4">{linkedGroups.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unlinked" className="text-xs">
            未关联 <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4">{unlinkedGroups.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="archived" className="text-xs">
            已归档 <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4">{archivedGroups.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linked" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {isLoadingGroups ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>群名称</TableHead>
                      <TableHead>关联线索</TableHead>
                      <TableHead>关联项目</TableHead>
                      <TableHead>机器人</TableHead>
                      <TableHead>成员数</TableHead>
                      <TableHead>今日消息</TableHead>
                      <TableHead>活跃度</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkedGroups.map(group => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.groupName}</TableCell>
                        <TableCell>
                          {group.leadName ? (
                            <Badge variant="outline" className="text-xs">{group.leadName}</Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {group.projectName ? (
                            <Badge variant="outline" className="text-xs">{group.projectName}</Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-sm">{group.botNickname}</TableCell>
                        <TableCell>{group.memberCount}</TableCell>
                        <TableCell>{group.todayMsgCount}</TableCell>
                        <TableCell>
                          <ActivityIndicator level={group.activityLevel} size="sm" />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleViewDetail(group)}
                            >
                              查看分析 <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              <Unlink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {linkedGroups.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          暂无已关联的群
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unlinked" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>群名称</TableHead>
                    <TableHead>机器人</TableHead>
                    <TableHead>成员数</TableHead>
                    <TableHead>加入时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unlinkedGroups.map(group => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.groupName}</TableCell>
                      <TableCell className="text-sm">{group.botNickname}</TableCell>
                      <TableCell>{group.memberCount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(group.botJoinedAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Link2 className="h-3 w-3 mr-1" /> 关联线索
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {unlinkedGroups.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        暂无未关联的群
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Archive className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>暂无已归档的群</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
