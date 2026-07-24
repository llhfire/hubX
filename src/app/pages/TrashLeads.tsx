import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { Eye, Search, Undo2, UserPlus } from 'lucide-react';

export function TrashLeads() {
  const navigate = useNavigate();

  const trashLeads = [
    {
      key: '1',
      name: '某餐饮APP虚假需求',
      source: '百度推广',
      contact: '张某',
      phone: '138****0000',
      reason: '重复线索，已在系统中存在',
      discardBy: '李四',
      discardTime: '2026-04-18 10:30',
      tags: ['小程序', '餐饮'],
    },
    {
      key: '2',
      name: '无效联系方式',
      source: '抖音',
      contact: '王某',
      phone: '139****1111',
      reason: '电话无法接通，疑似虚假信息',
      discardBy: '张三',
      discardTime: '2026-04-17 14:20',
      tags: ['APP'],
    },
    {
      key: '3',
      name: '恶意询价',
      source: '小红书',
      contact: '刘某',
      phone: '136****2222',
      reason: '多次询价从未签单，浪费时间',
      discardBy: '王五',
      discardTime: '2026-04-16 16:45',
      tags: ['管理系统'],
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">垃圾线索池</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 w-[240px]" placeholder="搜索线索名称、联系人" />
            </div>
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="线索来源" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baidu">百度推广</SelectItem>
                <SelectItem value="douyin">抖音</SelectItem>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
                <SelectItem value="wechat">微信推广</SelectItem>
              </SelectContent>
            </Select>
            <Button>搜索</Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>线索名称</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>联系人</TableHead>
                  <TableHead>手机号</TableHead>
                  <TableHead>意向标签</TableHead>
                  <TableHead>丢弃原因</TableHead>
                  <TableHead>丢弃人</TableHead>
                  <TableHead>丢弃时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trashLeads.map((record) => (
                  <TableRow key={record.key}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-gray-500" />
                        <span>{record.source}</span>
                      </span>
                    </TableCell>
                    <TableCell>{record.contact}</TableCell>
                    <TableCell>{record.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {record.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{record.reason}</TableCell>
                    <TableCell>{record.discardBy}</TableCell>
                    <TableCell>{record.discardTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/leads/${record.key}`, { state: { from: 'trash' } })}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>查看详情</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast.success('线索认领成功');
                              }}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>重新认领</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast.success('已扔回公海线索');
                              }}
                            >
                              <Undo2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>扔回公海</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">共 15 条记录</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>上一页</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
