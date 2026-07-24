import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Eye, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { useContracts, countByStatus } from './contracts/ContractsContext';
import { ContractStatusBadge } from './contracts/components/ContractStatusBadge';
import { CONTRACT_STATUS_LABEL } from './contracts/utils';
import type { Contract, ContractStatus } from './contracts/types';

// "履行中" 是 archived + executionStatus === '履行中' 的组合伪状态。
type ListFilter = 'all' | ContractStatus | 'executing';

export function Contracts() {
  const navigate = useNavigate();
  const { contracts } = useContracts();
  const [filter, setFilter] = useState<ListFilter>('all');
  const [keyword, setKeyword] = useState('');

  const counts = useMemo(() => countByStatus(contracts), [contracts]);
  const executingCount = contracts.filter(
    (c) => c.status === 'archived' && c.executionStatus === '履行中',
  ).length;

  const filtered = useMemo(() => {
    let list = contracts;
    if (filter === 'executing') {
      list = list.filter((c) => c.status === 'archived' && c.executionStatus === '履行中');
    } else if (filter !== 'all') {
      list = list.filter((c) => c.status === filter);
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.contractNo.toLowerCase().includes(kw) ||
          c.current.contractName.toLowerCase().includes(kw) ||
          c.current.customerName.toLowerCase().includes(kw),
      );
    }
    return list;
  }, [contracts, filter, keyword]);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset page when filter or keyword changes
  useMemo(() => setPage(1), [filter, keyword]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">合同管理</h2>
        <Button onClick={() => navigate('/contracts/new')}>
          <Plus className="size-4" />
          新建合同
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all" onValueChange={(k) => setFilter(k as ListFilter)}>
            <TabsList>
              <TabsTrigger value="all">全部 ({contracts.length})</TabsTrigger>
              <TabsTrigger value="draft">{CONTRACT_STATUS_LABEL.draft} ({counts.draft})</TabsTrigger>
              <TabsTrigger value="approving">{CONTRACT_STATUS_LABEL.approving} ({counts.approving})</TabsTrigger>
              <TabsTrigger value="pending_mail">{CONTRACT_STATUS_LABEL.pending_mail} ({counts.pending_mail})</TabsTrigger>
              <TabsTrigger value="pending_return">{CONTRACT_STATUS_LABEL.pending_return} ({counts.pending_return})</TabsTrigger>
              <TabsTrigger value="executing">履行中 ({executingCount})</TabsTrigger>
              <TabsTrigger value="archived">{CONTRACT_STATUS_LABEL.archived} ({counts.archived})</TabsTrigger>
              <TabsTrigger value="voided">{CONTRACT_STATUS_LABEL.voided} ({counts.voided})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {/* Content rendered below, shared across all tabs */}
            </TabsContent>
            <TabsContent value="draft" />
            <TabsContent value="approving" />
            <TabsContent value="pending_mail" />
            <TabsContent value="pending_return" />
            <TabsContent value="executing" />
            <TabsContent value="archived" />
            <TabsContent value="voided" />
          </Tabs>

          <div className="flex gap-4 mb-4">
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="搜索合同编号、名称、客户"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">合同编号</TableHead>
                <TableHead className="w-[220px]">合同名称</TableHead>
                <TableHead className="w-[150px]">客户名称</TableHead>
                <TableHead className="w-[120px]">合同金额</TableHead>
                <TableHead className="w-[110px]">形成状态</TableHead>
                <TableHead className="w-[70px]">版本</TableHead>
                <TableHead className="w-[120px]">签订日期</TableHead>
                <TableHead className="w-[120px]">终止日期</TableHead>
                <TableHead className="w-[100px]">履行状态</TableHead>
                <TableHead className="w-[100px]">已收款</TableHead>
                <TableHead className="w-[100px]">待收款</TableHead>
                <TableHead className="w-[180px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.contractNo}</TableCell>
                  <TableCell>
                    <a
                      className="text-primary cursor-pointer px-1 py-0.5 rounded hover:bg-accent"
                      onClick={() => navigate(`/contracts/${c.id}`)}
                    >
                      {c.current.contractName}
                    </a>
                  </TableCell>
                  <TableCell>{c.current.customerName}</TableCell>
                  <TableCell>{`¥${(c.current.totalAmount / 10000).toFixed(0)}万`}</TableCell>
                  <TableCell><ContractStatusBadge status={c.status} size="small" /></TableCell>
                  <TableCell>{`V${c.versionHistory.length}`}</TableCell>
                  <TableCell>{c.current.signDate}</TableCell>
                  <TableCell>{c.current.endDate}</TableCell>
                  <TableCell>
                    {c.status === 'archived' && c.executionStatus ? (
                      <Badge
                        className={
                          c.executionStatus === '已完成'
                            ? 'bg-green-500 text-white'
                            : ''
                        }
                        variant={c.executionStatus === '已完成' ? undefined : 'default'}
                      >
                        {c.executionStatus}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.receivedAmount !== undefined ? `¥${(c.receivedAmount / 10000).toFixed(0)}万` : '—'}
                  </TableCell>
                  <TableCell>
                    {c.receivableAmount !== undefined ? `¥${(c.receivableAmount / 10000).toFixed(0)}万` : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/contracts/${c.id}`)}
                      >
                        <Eye className="size-4" />
                        查看
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="size-4" />
                        下载
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-muted-foreground">
              共 {filtered.length} 条记录
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </Button>
              <span className="text-sm">
                {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
