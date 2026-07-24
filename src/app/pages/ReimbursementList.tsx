import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Search, Plus, Download, Check, X, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export function ReimbursementList() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    status: '',
    type: '',
    startDate: '',
    endDate: '',
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<any>(null);
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalComment, setApprovalComment] = useState('');
  const [workflowExpanded, setWorkflowExpanded] = useState(false);

  // 模拟数据
  const mockData = [
    {
      id: '1',
      reimbursementNo: 'RB20260425001',
      leadName: '阿里巴巴-企业管理系统',
      customerEntity: '阿里巴巴（中国）有限公司',
      ourEntity: '北京科技有限公司',
      applicant: '张三',
      department: '销售部',
      type: '差旅费',
      amount: 4800,
      status: '待审批',
      createDate: '2026-04-25',
      items: [
        { category: '交通费', description: '北京-杭州高铁往返', amount: 1200 },
        { category: '住宿费', description: '杭州酒店3晚', amount: 2400 },
        { category: '餐费', description: '工作餐', amount: 600 },
        { category: '其他', description: '打车费用', amount: 600 },
      ],
      attachments: [
        { id: 'att-1-1', name: '高铁票.pdf', size: '256KB' },
        { id: 'att-1-2', name: '酒店发票.pdf', size: '512KB' },
        { id: 'att-1-3', name: '行程单.jpg', size: '1.2MB' },
      ],
      approvalFlow: [
        { step: '发起申请', approver: '张三 - 销售部', status: 'approved', time: '2026-04-25 09:30', comment: '提交报销申请' },
        { step: '部门主管审批', approver: '王经理 - 销售主管', status: 'approved', time: '2026-04-25 11:00', comment: '同意报销' },
        { step: '财务审核', approver: '陈财务 - 财务部', status: 'pending', time: '', comment: '' },
      ],
    },
    {
      id: '2',
      reimbursementNo: 'RB20260424001',
      leadName: '腾讯-云服务平台',
      customerEntity: '腾讯科技（深圳）有限公司',
      ourEntity: '北京科技有限公司',
      applicant: '李四',
      department: '销售部',
      type: '业务招待费',
      amount: 2500,
      status: '已通过',
      createDate: '2026-04-24',
      items: [
        { category: '餐费', description: '客户商务宴请', amount: 2000 },
        { category: '礼品费', description: '商务礼品', amount: 500 },
      ],
      attachments: [
        { id: 'att-2-1', name: '餐饮发票.pdf', size: '652KB' },
      ],
      approvalFlow: [
        { step: '发起申请', approver: '李四 - 销售部', status: 'approved', time: '2026-04-24 08:00', comment: '提交报销申请' },
        { step: '部门主管审批', approver: '王经理 - 销售主管', status: 'approved', time: '2026-04-24 10:30', comment: '批准' },
        { step: '财务审核', approver: '陈财务 - 财务部', status: 'approved', time: '2026-04-24 14:00', comment: '同意' },
      ],
    },
    {
      id: '3',
      reimbursementNo: 'RB20260423001',
      leadName: '字节跳动-协作工具',
      customerEntity: '北京字节跳动科技有限公司',
      ourEntity: '上海分公司',
      applicant: '王五',
      department: '技术部',
      type: '办公费用',
      amount: 1200,
      status: '已拒绝',
      createDate: '2026-04-23',
      items: [
        { category: '办公用品', description: '投影仪', amount: 1200 },
      ],
      attachments: [
        { id: 'att-3-1', name: '采购发票.pdf', size: '428KB' },
      ],
      approvalFlow: [
        { step: '发起申请', approver: '王五 - 技术部', status: 'approved', time: '2026-04-23 10:00', comment: '提交报销申请' },
        { step: '部门主管审批', approver: '李主管 - 技术主管', status: 'rejected', time: '2026-04-23 13:30', comment: '此类办公设备应由公司统一采购，个人报销不符合规定' },
      ],
    },
  ];

  const handleSearch = () => {
    console.log('搜索条件：', searchForm);
  };

  const handleReset = () => {
    setSearchForm({
      keyword: '',
      status: '',
      type: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleViewDetail = (record: any) => {
    setSelectedReimbursement(record);
    setDetailVisible(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; text: string }> = {
      '待审批': { variant: 'secondary', text: '待审批' },
      '已通过': { variant: 'default', text: '已通过' },
      '已拒绝': { variant: 'destructive', text: '已拒绝' },
    };
    const config = statusMap[status] || { variant: 'outline' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleApproval = () => {
    if (!approvalComment.trim()) {
      toast.error('请填写审批意见');
      return;
    }
    toast.success(
      `审批${approvalAction === 'approve' ? '通过' : '不通过'}成功，审批意见：${approvalComment}`
    );
    setApprovalVisible(false);
    setDetailVisible(false);
    setApprovalComment('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              className="w-[200px]"
              placeholder="搜索报销单号/线索名称"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.type}
              onValueChange={(value) => setSearchForm({ ...searchForm, type: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="报销类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="差旅费">差旅费</SelectItem>
                <SelectItem value="业务招待费">业务招待费</SelectItem>
                <SelectItem value="办公费用">办公费用</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={searchForm.status}
              onValueChange={(value) => setSearchForm({ ...searchForm, status: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="待审批">待审批</SelectItem>
                <SelectItem value="已通过">已通过</SelectItem>
                <SelectItem value="已拒绝">已拒绝</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-[140px]"
              value={searchForm.startDate}
              onChange={(e) => setSearchForm({ ...searchForm, startDate: e.target.value })}
            />
            <Input
              type="date"
              className="w-[140px]"
              value={searchForm.endDate}
              onChange={(e) => setSearchForm({ ...searchForm, endDate: e.target.value })}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>报销申请列表</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增报销申请
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">报销单号</TableHead>
                  <TableHead className="whitespace-nowrap">线索名称</TableHead>
                  <TableHead className="whitespace-nowrap">客户主体</TableHead>
                  <TableHead className="whitespace-nowrap">对接主体</TableHead>
                  <TableHead className="whitespace-nowrap">申请人</TableHead>
                  <TableHead className="whitespace-nowrap">部门</TableHead>
                  <TableHead className="whitespace-nowrap">报销类型</TableHead>
                  <TableHead className="whitespace-nowrap">报销金额</TableHead>
                  <TableHead className="whitespace-nowrap">状态</TableHead>
                  <TableHead className="whitespace-nowrap">创建日期</TableHead>
                  <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="whitespace-nowrap">{record.reimbursementNo}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.leadName}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.customerEntity}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.ourEntity}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.applicant}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.department}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.type}</TableCell>
                    <TableCell className="whitespace-nowrap">{'¥'}{record.amount.toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap">{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.createDate}</TableCell>
                    <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                      <Button variant="link" size="sm" onClick={() => handleViewDetail(record)}>
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
            共 {mockData.length} 条记录
          </div>
        </CardContent>
      </Card>

      {/* 详情弹窗 */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>报销申请详情</DialogTitle>
          </DialogHeader>
          {selectedReimbursement && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">报销单号</span>
                  <div className="font-medium">{selectedReimbursement.reimbursementNo}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">线索名称</span>
                  <div className="font-medium">{selectedReimbursement.leadName}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">客户主体</span>
                  <div className="font-medium">{selectedReimbursement.customerEntity}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">对接主体</span>
                  <div className="font-medium">{selectedReimbursement.ourEntity}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">申请人</span>
                  <div className="font-medium">{selectedReimbursement.applicant}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">部门</span>
                  <div className="font-medium">{selectedReimbursement.department}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">报销类型</span>
                  <div className="font-medium">{selectedReimbursement.type}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">报销金额</span>
                  <div className="font-medium">{'¥'}{selectedReimbursement.amount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">创建日期</span>
                  <div className="font-medium">{selectedReimbursement.createDate}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">状态</span>
                  <div>{getStatusBadge(selectedReimbursement.status)}</div>
                </div>
              </div>

              {/* 审批流程 */}
              {selectedReimbursement.approvalFlow && selectedReimbursement.approvalFlow.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">审批流程</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setWorkflowExpanded(!workflowExpanded)}
                    >
                      {workflowExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                      {workflowExpanded ? '收起完整流程' : '查看完整流程'}
                    </Button>
                  </div>

                  <div className="bg-muted rounded-md p-4 border">
                    {selectedReimbursement.approvalFlow.map((node: any, index: number) => {
                      const isCurrentNode = node.status === 'pending';
                      const isRejectedNode = node.status === 'rejected';
                      const isFirstNode = index === 0;

                      const shouldShowByDefault = isFirstNode || isCurrentNode || isRejectedNode;
                      const shouldShow = workflowExpanded || shouldShowByDefault;

                      if (!shouldShow) return null;

                      return (
                        <div
                          key={index}
                          className={`mb-3 p-3 rounded-md border ${
                            isCurrentNode
                              ? 'bg-yellow-50 border-yellow-400'
                              : isRejectedNode
                                ? 'bg-red-50 border-red-300'
                                : 'bg-background border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {node.status === 'approved' && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {node.status === 'rejected' && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            {node.status === 'pending' && (
                              <Clock className="h-5 w-5 text-orange-600" />
                            )}

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{node.step}</span>
                                {isCurrentNode && (
                                  <Badge variant="secondary" className="text-xs">当前环节</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                审批人：{node.approver}
                              </div>
                              {node.time && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {node.time}
                                </div>
                              )}
                            </div>

                            <div>
                              {node.status === 'approved' && (
                                <Badge variant="default" className="text-xs">已通过</Badge>
                              )}
                              {node.status === 'rejected' && (
                                <Badge variant="destructive" className="text-xs">已驳回</Badge>
                              )}
                              {node.status === 'pending' && (
                                <Badge variant="secondary" className="text-xs">待审批</Badge>
                              )}
                            </div>
                          </div>

                          {isRejectedNode && node.comment && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded-md">
                              <div className="text-xs font-semibold text-red-600 mb-1">
                                驳回理由
                              </div>
                              <div className="text-sm text-red-700">
                                {node.comment}
                              </div>
                            </div>
                          )}

                          {!isRejectedNode && node.comment && (
                            <div className="mt-2 p-2 bg-muted rounded-md text-sm text-muted-foreground">
                              {node.comment}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="font-semibold mb-3">报销明细</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">费用类别</TableHead>
                      <TableHead className="whitespace-nowrap">说明</TableHead>
                      <TableHead className="whitespace-nowrap text-right">金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReimbursement.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{item.category}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{'¥'}{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-semibold">合计</TableCell>
                      <TableCell className="text-right font-semibold">
                        {'¥'}{selectedReimbursement.items.reduce((sum: number, item: any) => sum + item.amount, 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 附件列表 */}
              {selectedReimbursement.attachments && selectedReimbursement.attachments.length > 0 && (
                <div>
                  <div className="font-semibold mb-3">附件列表</div>
                  <div className="bg-muted rounded-md p-4 border">
                    <div className="space-y-2">
                      {selectedReimbursement.attachments.map((file: any) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 bg-background rounded-md border"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{file.name}</span>
                            <span className="text-xs text-muted-foreground">({file.size})</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info(`下载附件: ${file.name}`)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 审批按钮栏 */}
              {selectedReimbursement.status === '待审批' && (
                <>
                  <Separator />
                  <div className="flex justify-center gap-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                      onClick={() => {
                        setApprovalAction('approve');
                        setApprovalVisible(true);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      通过
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => {
                        setApprovalAction('reject');
                        setApprovalVisible(true);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      不通过
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 审批意见弹窗 */}
      <Dialog open={approvalVisible} onOpenChange={setApprovalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? '审批通过' : '审批不通过'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>审批意见</Label>
              <Textarea
                placeholder={
                  approvalAction === 'approve'
                    ? '请填写审批意见（如：费用合理，同意报销）'
                    : '请填写不通过的理由（如：费用超标，请重新核算）'
                }
                rows={4}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setApprovalVisible(false);
              setApprovalComment('');
            }}>
              取消
            </Button>
            <Button onClick={handleApproval}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
