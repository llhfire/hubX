import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { ArrowLeft, Edit, UserMinus, Trash2, Plus, Download, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import type { Lead, FollowRecord, FollowMethod, LeadStage, IntentLevel } from './types';
import { leadStageConfig, intentLevelConfig } from './types';
import { getLeadDetail, getFollowRecordList, createFollowRecord, releaseToPublic, markAsTrash, transferLead } from './leads-api';
import { employees, mockLeads } from './mock-data';

export function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [followRecords, setFollowRecords] = useState<FollowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 弹窗状态
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [rightTabKey, setRightTabKey] = useState('follow');

  // 跟进表单
  const [followForm, setFollowForm] = useState({
    method: '微信沟通' as FollowMethod,
    stage: '初步建联' as LeadStage,
    intentLevel: '意向中' as IntentLevel,
    content: '',
    duration: 1,
    nextFollowTime: '',
  });

  // 转移表单
  const [transferForm, setTransferForm] = useState({
    newOwnerId: '',
    newOwnerName: '',
    reason: '',
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const leadData = await getLeadDetail(id);
      setLead(leadData);
      const records = await getFollowRecordList({ leadId: id });
      setFollowRecords(records.list);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建跟进记录
  const handleCreateFollow = async () => {
    if (!lead) return;
    if (!followForm.content) {
      toast.error('请输入跟进详情');
      return;
    }
    try {
      await createFollowRecord({
        leadId: lead.id,
        leadNo: lead.leadNo,
        leadName: lead.name,
        ...followForm,
        followerId: 'emp-001',
        followerName: '当前用户',
      });
      toast.success('跟进记录已添加');
      setFollowModalVisible(false);
      setFollowForm({
        method: '微信沟通', stage: '初步建联', intentLevel: '意向中',
        content: '', duration: 1, nextFollowTime: '',
      });
      loadData();
    } catch (error) {
      toast.error('创建失败');
    }
  };

  // 转移线索
  const handleTransfer = async () => {
    if (!lead) return;
    if (!transferForm.newOwnerId) {
      toast.error('请选择新归属人');
      return;
    }
    try {
      await transferLead(lead.id, transferForm.newOwnerId, transferForm.newOwnerName, transferForm.reason);
      toast.success('转移成功');
      setTransferModalVisible(false);
      loadData();
    } catch (error) {
      toast.error('转移失败');
    }
  };

  // 扔回公海
  const handleRelease = async () => {
    if (!lead) return;
    if (!confirm('确定要将此线索扔回公海吗？')) return;
    try {
      await releaseToPublic(lead.id);
      toast.success('已扔回公海');
      navigate('/leads/all');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // 标记为垃圾
  const handleMarkTrash = async () => {
    if (!lead) return;
    if (!confirm('确定要将此线索标记为垃圾吗？')) return;
    try {
      await markAsTrash(lead.id);
      toast.success('已标记为垃圾');
      navigate('/leads/all');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // 计算跟进剩余时间
  const getRemainingTime = (nextFollowTime?: string) => {
    if (!nextFollowTime) return { text: '-', isOverdue: false };
    const now = new Date();
    const next = new Date(nextFollowTime);
    const diff = next.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 0) return { text: '已超期', isOverdue: true };
    if (hours < 24) return { text: `${hours}小时后`, isOverdue: false };
    const days = Math.floor(hours / 24);
    return { text: `${days}天后`, isOverdue: false };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">加载中...</div></div>;
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-muted-foreground">线索不存在</div>
        <Button variant="outline" onClick={() => navigate('/leads/all')}>返回列表</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回
        </Button>
        <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />编辑</Button>
        <Button variant="outline" size="sm" onClick={() => setTransferModalVisible(true)}>
          <UserMinus className="mr-2 h-4 w-4" />转给他人
        </Button>
        <Button variant="outline" size="sm" onClick={handleRelease}>扔回公海</Button>
        <Button variant="outline" size="sm" className="text-destructive" onClick={handleMarkTrash}>
          <Trash2 className="mr-2 h-4 w-4" />标记为垃圾
        </Button>
      </div>

      {/* 线索标题 */}
      <div>
        <h2 className="text-lg font-semibold">{lead.leadNo}：{lead.name}</h2>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>线索来源：<Badge variant="outline">{lead.source}</Badge></span>
          <span>客户称呼：{lead.contactName || '-'}</span>
          <span>创建人：{lead.creatorName}</span>
          <span>归属人：<span className="text-blue-600">{lead.ownerName}</span></span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          创建时间：{lead.createTime}
        </div>
      </div>

      {/* 两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 左侧主内容 - 只显示基础信息 */}
        <div className="lg:col-span-3">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><span className="text-muted-foreground">线索名称：</span>{lead.name}</div>
                <div><span className="text-muted-foreground">联系方式：</span>{lead.phone || '-'}</div>
                <div><span className="text-muted-foreground">联系人：</span>{lead.contactName || '-'}</div>
                <div><span className="text-muted-foreground">微信：</span>{lead.wechat || '-'}</div>
                <div><span className="text-muted-foreground">创建时间：</span>{lead.createTime}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><span className="text-muted-foreground">推广关键词：</span>{lead.keyword || '-'}</div>
                <div><span className="text-muted-foreground">客户来源：</span>{lead.source}</div>
                <div><span className="text-muted-foreground">所属人：</span>{lead.ownerName}</div>
                <div><span className="text-muted-foreground">客户意向：</span>{lead.intentLevel || '-'}</div>
                <div><span className="text-muted-foreground">跟进状态：</span><Badge variant="outline">{leadStageConfig[lead.stage]?.label}</Badge></div>
                <div><span className="text-muted-foreground">最近一次跟进时间：</span>{lead.lastFollowTime || '-'}</div>
                <div><span className="text-muted-foreground">当前主体：</span>{lead.entity}</div>
                <div><span className="text-muted-foreground">售前群名称：</span>{lead.preSaleGroupName || '-'}</div>
                <div><span className="text-muted-foreground">客户类型：</span>{lead.customerType || '-'}</div>
                <div><span className="text-muted-foreground">客户预算：</span>{lead.budget || '-'}</div>
              </div>

              {lead.remark && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <div className="text-sm font-medium mb-2">客户需求</div>
                    <div className="p-3 bg-muted rounded-md text-sm">{lead.remark}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>附件列表</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.attachments && lead.attachments.length > 0 ? (
                <div className="space-y-2">
                  {lead.attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm">{file.name} ({file.size})</span>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1" />下载</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">暂无附件</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧 - Tab 包含跟进记录、报价、出差申请、报销申请 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="follow">
            <TabsList>
              <TabsTrigger value="follow">跟进记录 ({followRecords.length})</TabsTrigger>
              <TabsTrigger value="quotation">报价</TabsTrigger>
              <TabsTrigger value="travel">出差申请</TabsTrigger>
              <TabsTrigger value="reimbursement">报销申请</TabsTrigger>
            </TabsList>

            <TabsContent value="follow">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">跟进记录</CardTitle>
                  <Button size="sm" onClick={() => setFollowModalVisible(true)}>
                    <Plus className="h-4 w-4 mr-1" />记录
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {followRecords.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">暂无跟进记录</div>
                    ) : (
                      followRecords.map((record, index) => {
                        const remaining = getRemainingTime(record.nextFollowTime);
                        return (
                          <div key={record.id} className="relative pl-6 pb-4">
                            {/* 时间线圆点 */}
                            <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 ${
                              index === 0 ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'
                            }`} />
                            {/* 连接线 */}
                            {index < followRecords.length - 1 && (
                              <div className="absolute left-[5px] top-4 w-0.5 h-full bg-gray-200" />
                            )}

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">
                                  {record.method}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{record.createTime}</span>
                              </div>

                              <div className="flex items-center gap-4 text-xs">
                                <span>客户状态：<Badge variant="outline">{leadStageConfig[record.stage]?.label}</Badge></span>
                                {record.intentLevel && (
                                  <span>意向等级：<Badge variant="outline">{intentLevelConfig[record.intentLevel]?.label}</Badge></span>
                                )}
                                <span className="text-muted-foreground">消耗工时：{record.duration || 0}分钟</span>
                              </div>

                              {record.content && (
                                <div className="text-sm">{record.content}</div>
                              )}

                              <div className="text-xs text-muted-foreground">
                                跟进人：{record.followerName}
                                {record.nextFollowTime && (
                                  <span className="ml-2">
                                    下次跟进时间：{record.nextFollowTime}
                                    <span className={`ml-1 ${remaining.isOverdue ? 'text-red-600' : 'text-orange-600'}`}>
                                      ({remaining.text})
                                    </span>
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-6 text-xs">编辑</Button>
                                <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">删除</Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotation">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">报价</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增</Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">暂无报价记录</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="travel">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">出差申请</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增</Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">暂无出差申请</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reimbursement">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">报销申请</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />新增</Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">暂无报销申请</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 添加跟进记录弹窗 */}
      <Dialog open={followModalVisible} onOpenChange={setFollowModalVisible}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader><DialogTitle>添加跟进记录</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>跟进方式 <span className="text-destructive">*</span></Label>
              <div className="flex gap-4">
                {(['电话沟通', '微信沟通', '上门拜访', '其他'] as FollowMethod[]).map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="method"
                      value={method}
                      checked={followForm.method === method}
                      onChange={(e) => setFollowForm({ ...followForm, method: e.target.value as FollowMethod })}
                      className="accent-blue-600"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>客户状态 <span className="text-destructive">*</span></Label>
              <Select value={followForm.stage} onValueChange={(v) => setFollowForm({ ...followForm, stage: v as LeadStage })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(leadStageConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>意向等级</Label>
              <div className="flex gap-4">
                {(['意向高', '意向中', '意向低', '无意向'] as IntentLevel[]).map((level) => (
                  <label key={level} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="intentLevel"
                      value={level}
                      checked={followForm.intentLevel === level}
                      onChange={(e) => setFollowForm({ ...followForm, intentLevel: e.target.value as IntentLevel })}
                      className="accent-blue-600"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>消耗时间（分钟）</Label>
                <Input
                  type="number"
                  min={0}
                  value={followForm.duration}
                  onChange={(e) => setFollowForm({ ...followForm, duration: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>下次跟进提醒</Label>
                <Input
                  type="datetime-local"
                  value={followForm.nextFollowTime}
                  onChange={(e) => setFollowForm({ ...followForm, nextFollowTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>跟进详情 <span className="text-destructive">*</span></Label>
              <Textarea
                rows={4}
                placeholder="请详细记录本次沟通的内容、客户反馈、关键信息等"
                value={followForm.content}
                onChange={(e) => setFollowForm({ ...followForm, content: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>附件上传</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                点击或拖拽文件到此处上传
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowModalVisible(false)}>取消</Button>
            <Button onClick={handleCreateFollow}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 转移弹窗 */}
      <Dialog open={transferModalVisible} onOpenChange={setTransferModalVisible}>
        <DialogContent>
          <DialogHeader><DialogTitle>转给他人</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>新归属人 <span className="text-destructive">*</span></Label>
              <Select value={transferForm.newOwnerId} onValueChange={(v) => {
                const emp = employees.find(e => e.id === v);
                setTransferForm({ ...transferForm, newOwnerId: v, newOwnerName: emp?.name || '' });
              }}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>转移原因</Label>
              <Textarea rows={3} placeholder="请输入转移原因" value={transferForm.reason} onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferModalVisible(false)}>取消</Button>
            <Button onClick={handleTransfer}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
