import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  ArrowLeft,
  User,
  IdCard,
  CalendarDays,
  Star,
  Edit,
  Trophy,
  FlaskConical,
  Check,
} from 'lucide-react';
import { useEmployee } from './EmployeeContext';
import {
  formatCurrency,
  getLevelColor,
  getStatusColor,
  getRankColor,
  calcWorkDays,
  calcWeightedScore,
  calcPromotionProgress,
  ABILITY_DIMENSION_LABELS,
  ABILITY_DIMENSION_COLORS,
  AbilityDimension,
  SkillNode,
  MBTI_DESCRIPTIONS,
  ENNEAGRAM_DESCRIPTIONS,
  MBTIPersonality,
  BigFiveProfile,
  DISCProfile,
  EnneagramProfile,
} from './mockData';

// ---------- 员工能力雷达图 ----------
function RadarChart({ scores, size = 240 }: { scores: { tech: number; biz: number; mgmt: number; tool: number; domain: number }; size?: number }) {
  const dims: AbilityDimension[] = ['tech', 'biz', 'mgmt', 'tool', 'domain'];
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 32;
  const levels = 5;
  const angleFor = (i: number) => (Math.PI * 2 * i) / 5 - Math.PI / 2;

  const gridPolygons = Array.from({ length: levels }, (_, lv) => {
    const r = (radius * (lv + 1)) / levels;
    return dims.map((_, i) => { const a = angleFor(i); return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(' ');
  });

  const dataPts = dims.map((d, i) => {
    const a = angleFor(i);
    const r = (radius * scores[d]) / 100;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');

  const labels = dims.map((d, i) => {
    const a = angleFor(i);
    return { x: cx + (radius + 20) * Math.cos(a), y: cy + (radius + 20) * Math.sin(a), label: ABILITY_DIMENSION_LABELS[d], color: ABILITY_DIMENSION_COLORS[d] };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridPolygons.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke="var(--color-border)" strokeWidth={1} strokeOpacity={0.4} />)}
      {dims.map((_, i) => { const a = angleFor(i); return <line key={i} x1={cx} y1={cy} x2={cx + radius * Math.cos(a)} y2={cy + radius * Math.sin(a)} stroke="var(--color-border)" strokeOpacity={0.3} />; })}
      <polygon points={dataPts} fill="var(--primary)" fillOpacity={0.2} stroke="var(--primary)" strokeWidth={2} />
      {dims.map((d, i) => {
        const a = angleFor(i);
        const r = (radius * scores[d]) / 100;
        return <circle key={d} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={4} fill="var(--primary)" />;
      })}
      {labels.map(l => (
        <text key={l.label} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={l.color} fontWeight={600}>
          {l.label}
        </text>
      ))}
    </svg>
  );
}

// 技能卡
function SkillCard({ skill, empScore }: { skill: SkillNode; empScore: number }) {
  const dimScore = empScore;
  const prereqsMet = true;
  const scoreMet = skill.requiredScore ? dimScore >= skill.requiredScore : false;
  const unlocked = prereqsMet && scoreMet;
  const mastery = unlocked ? (skill.requiredScore && dimScore / skill.requiredScore >= 1.3 ? '精通' : '入门') : '未解锁';

  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        borderColor: unlocked ? ABILITY_DIMENSION_COLORS[skill.domain] : 'var(--color-border)',
        borderLeftWidth: 3,
        borderLeftColor: unlocked ? ABILITY_DIMENSION_COLORS[skill.domain] : '#c9cdd4',
        background: unlocked ? 'var(--card)' : 'var(--muted)',
        opacity: unlocked ? 1 : 0.5,
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-[13px]">{skill.name}</span>
        {unlocked ? (
          <Badge className="text-[10px]" style={{ backgroundColor: ABILITY_DIMENSION_COLORS[skill.domain] }}>{mastery}</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px]">🔒 {skill.requiredScore}+</Badge>
        )}
      </div>
      <div className="text-[11px] text-muted-foreground">{skill.description}</div>
    </div>
  );
}

// 自定义 Progress（支持自定义颜色）
function ColoredProgress({ value, color, className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`bg-primary/20 relative h-2 w-full overflow-hidden rounded-full ${className || ''}`}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, backgroundColor: color || 'var(--primary)' }}
      />
    </div>
  );
}

// 描述项
function DescItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium mt-0.5">{value}</dd>
    </div>
  );
}

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployeeById, getPerformanceByEmployee, attendance, skillTrees } = useEmployee();

  const employee = getEmployeeById(id || '');
  const performance = getPerformanceByEmployee(id || '');
  const empAttendance = attendance.filter(a => a.employeeId === id);

  const [activeTab, setActiveTab] = useState('profile');

  if (!employee) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">员工不存在</CardContent>
      </Card>
    );
  }

  const workDays = calcWorkDays(employee.hireDate);
  const latestPerf = performance.length > 0 ? performance[performance.length - 1] : null;
  const cap = employee.capability;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 顶部栏 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/employees')}>
                <ArrowLeft className="mr-1 size-4" />
                返回
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                  {employee.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-bold m-0">{employee.name}</h4>
                    <Badge className={getLevelColor(employee.level)} style={{ fontWeight: 600 }}>{employee.level}</Badge>
                    <Badge className={getStatusColor(employee.employmentStatus)}>{employee.employmentStatus}</Badge>
                    {cap?.promotionEligible && <Badge className="bg-orange-500">可晋级</Badge>}
                  </div>
                  <div className="mt-1 text-muted-foreground text-[13px]">
                    {employee.jobNumber} · {employee.department} · {employee.position}
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate('/employees')}>
              <Edit className="mr-1 size-4" />
              编辑
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 核心指标 */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { title: '入职天数', value: workDays, suffix: '天', icon: <CalendarDays className="text-primary" /> },
          { title: '标准时薪', value: formatCurrency(employee.standardHourlyRate), prefix: '¥', suffix: '/h', icon: null, valueClass: 'text-primary' },
          { title: '最近评级', value: latestPerf ? latestPerf.rank : '—', icon: null, valueClass: latestPerf ? getRankColor(latestPerf.rank) : '' },
          { title: '加权总分', value: cap ? cap.weightedScore : '—', suffix: '分', icon: <Trophy className="text-orange-500" /> },
          { title: '已解锁技能', value: cap ? cap.skills.filter(s => s.status === 'unlocked').length : '—', suffix: '个', icon: <Check className="text-green-500" /> },
          { title: '累计经验', value: cap ? cap.totalXP : '—', suffix: 'XP', icon: <FlaskConical className="text-purple-500" /> },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="py-3">
              <div className="text-sm text-muted-foreground">{item.title}</div>
              <div className="flex items-center gap-1 mt-1">
                {item.icon}
                <span className={`text-xl font-bold ${item.valueClass || ''}`}>{item.value}</span>
                {item.suffix && <span className="text-xs text-muted-foreground">{item.suffix}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="profile">档案</TabsTrigger>
              <TabsTrigger value="capability">
                <Trophy className="size-4 text-orange-500 mr-1" />
                能力
              </TabsTrigger>
              <TabsTrigger value="personality">
                <Star className="size-4 text-purple-500 mr-1" />
                性格测评
              </TabsTrigger>
              <TabsTrigger value="attendance">考勤</TabsTrigger>
              <TabsTrigger value="performance">绩效</TabsTrigger>
            </TabsList>

            <div className="pt-4">
              {/* 档案 Tab */}
              <TabsContent value="profile">
                <div>
                  <h6 className="font-semibold mb-3 flex items-center gap-2"><User className="size-4" /> 个人信息</h6>
                  <dl className="grid grid-cols-3 gap-x-4 gap-y-0">
                    <DescItem label="姓名" value={employee.name} />
                    <DescItem label="工号" value={employee.jobNumber} />
                    <DescItem label="手机号" value={employee.phone} />
                    <DescItem label="邮箱" value={employee.email} />
                    <DescItem label="身份证" value={employee.idCard || '—'} />
                    <DescItem label="紧急联系人" value={employee.emergencyContact || '—'} />
                    <DescItem label="最高学历" value={employee.education || '—'} />
                    <DescItem label="毕业院校" value={employee.school || '—'} />
                    <DescItem label="入职前经验" value={employee.previousExperience || '—'} />
                  </dl>
                  <hr className="my-5" />
                  <h6 className="font-semibold mb-3 flex items-center gap-2"><IdCard className="size-4" /> 工作信息</h6>
                  <dl className="grid grid-cols-3 gap-x-4 gap-y-0">
                    <DescItem label="所属部门" value={employee.department} />
                    <DescItem label="职位" value={employee.position} />
                    <DescItem label="职级" value={<Badge className={getLevelColor(employee.level)}>{employee.level}</Badge>} />
                    <DescItem label="在职状态" value={<Badge className={getStatusColor(employee.employmentStatus)}>{employee.employmentStatus}</Badge>} />
                    <DescItem label="入职日期" value={employee.hireDate} />
                    <DescItem label="转正日期" value={(employee as any).转正Date || '—'} />
                    <DescItem label="合同到期日" value={employee.contractEndDate} />
                    <DescItem label="标准时薪" value={<span className="font-bold text-primary">{formatCurrency(employee.standardHourlyRate)}/h</span>} />
                    <DescItem label="银行卡" value={employee.bankAccount || '—'} />
                  </dl>
                </div>
              </TabsContent>

              {/* 能力 Tab */}
              <TabsContent value="capability">
                {cap ? (
                  <div>
                    <div className="grid grid-cols-[10fr_14fr] gap-6 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">能力雷达图</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center py-4">
                          <RadarChart scores={cap.scores} size={280} />
                        </CardContent>
                      </Card>
                      <div className="flex flex-col gap-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">五维能力分数</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {(Object.keys(cap.scores) as AbilityDimension[]).map(dim => (
                              <div key={dim}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-semibold text-[13px]" style={{ color: ABILITY_DIMENSION_COLORS[dim] }}>
                                    {ABILITY_DIMENSION_LABELS[dim]}
                                  </span>
                                  <span className="font-bold text-[13px]">{cap.scores[dim]}/100</span>
                                </div>
                                <ColoredProgress value={cap.scores[dim]} color={ABILITY_DIMENSION_COLORS[dim]} />
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">晋级评估</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">当前加权总分</span>
                              <span className="text-xl font-bold" style={{ color: cap.promotionEligible ? '#00b42a' : 'var(--primary)' }}>
                                {cap.weightedScore}
                              </span>
                            </div>
                            <div className="mb-2">
                              <ColoredProgress
                                value={calcPromotionProgress(cap.weightedScore, employee.level)}
                                color={cap.promotionEligible ? '#00b42a' : 'var(--primary)'}
                              />
                            </div>
                            {cap.promotionEligible ? (
                              <Badge className="bg-green-500 text-[13px] py-1 px-3">
                                <Trophy className="mr-1 size-3" /> 已达标，具备晋升资格！
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                未达晋升门槛，继续积累经验即可晋级
                              </span>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* 技能树 */}
                    <h6 className="font-semibold mb-3 flex items-center gap-2">
                      <FlaskConical className="size-4 text-purple-500" /> 技能树
                    </h6>
                    <Tabs defaultValue="tech">
                      <TabsList>
                        {(['tech', 'biz', 'mgmt', 'tool', 'domain'] as AbilityDimension[]).map(domain => (
                          <TabsTrigger key={domain} value={domain}>
                            <Badge className="mr-1" style={{ backgroundColor: ABILITY_DIMENSION_COLORS[domain] }}>{ABILITY_DIMENSION_LABELS[domain]}</Badge>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {(['tech', 'biz', 'mgmt', 'tool', 'domain'] as AbilityDimension[]).map(domain => (
                        <TabsContent key={domain} value={domain}>
                          <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(layer => {
                              const skills = skillTrees.filter(s => s.domain === domain && s.layer === layer);
                              return (
                                <div key={layer}>
                                  <div className="mb-2 flex items-center gap-2">
                                    <Badge
                                      className={
                                        layer === 1 ? 'bg-green-500' :
                                        layer === 2 ? 'bg-blue-500' :
                                        'bg-purple-500'
                                      }
                                    >
                                      {layer === 1 ? '基础' : layer === 2 ? '进阶' : '专家'}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    {skills.map(s => <SkillCard key={s.id} skill={s} empScore={cap.scores[s.domain]} />)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-10">该员工尚未录入能力数值</p>
                )}
              </TabsContent>

              {/* 性格测评 Tab */}
              <TabsContent value="personality">
                {employee.personality ? (
                  <PersonalityView assessment={employee.personality} employeeName={employee.name} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-5xl mb-4">🧩</div>
                    <p>该员工尚未完成性格测评</p>
                    <p className="text-xs">完成 MBTI、大五人格、DISC 九型人格测评后，分析数据将自动显示在此处。</p>
                  </div>
                )}
              </TabsContent>

              {/* 考勤 Tab */}
              <TabsContent value="attendance">
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>类型</TableHead>
                        <TableHead>开始</TableHead>
                        <TableHead>结束</TableHead>
                        <TableHead>天数</TableHead>
                        <TableHead>事由</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>审批人</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {empAttendance.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">暂无考勤记录</TableCell>
                        </TableRow>
                      ) : (
                        empAttendance.map(record => (
                          <TableRow key={record.id}>
                            <TableCell><Badge variant="outline">{record.type}</Badge></TableCell>
                            <TableCell>{record.startDate}</TableCell>
                            <TableCell>{record.endDate}</TableCell>
                            <TableCell>{record.days}</TableCell>
                            <TableCell>{record.reason}</TableCell>
                            <TableCell>
                              <Badge className={
                                record.status === '已批准' ? 'bg-green-500' :
                                record.status === '待审批' ? 'bg-orange-500' :
                                'bg-red-500'
                              }>{record.status}</Badge>
                            </TableCell>
                            <TableCell>{record.approvedBy}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* 绩效 Tab */}
              <TabsContent value="performance">
                <div>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {[...performance].reverse().slice(0, 4).map(p => (
                      <Card key={p.id}>
                        <CardContent className="py-3">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">{p.periodLabel}</div>
                            <Badge className={getRankColor(p.rank)} style={{ fontWeight: 700, fontSize: 16 }}>{p.rank}</Badge>
                          </div>
                          <div className="text-xl font-bold mt-1">{p.totalScore}<span className="text-xs text-muted-foreground ml-1">分</span></div>
                          <div className="mt-1 text-xs text-muted-foreground">KPI {p.kpiScore} · 行为 {p.behaviorScore}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>周期</TableHead>
                        <TableHead>KPI</TableHead>
                        <TableHead>行为</TableHead>
                        <TableHead>综合</TableHead>
                        <TableHead>评级</TableHead>
                        <TableHead>考核人</TableHead>
                        <TableHead>评语</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performance.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">暂无考核记录</TableCell>
                        </TableRow>
                      ) : (
                        [...performance].reverse().map(p => (
                          <TableRow key={p.id}>
                            <TableCell>{p.periodLabel}</TableCell>
                            <TableCell>{p.kpiScore}</TableCell>
                            <TableCell>{p.behaviorScore}</TableCell>
                            <TableCell>{p.totalScore}</TableCell>
                            <TableCell>
                              <Badge className={getRankColor(p.rank)}>{p.rank}</Badge>
                            </TableCell>
                            <TableCell>{p.evaluator}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{p.comment}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// 性格测评视图
// ============================================================

interface PersonalityViewProps {
  assessment: NonNullable<import('./mockData').PersonalityAssessment>;
  employeeName: string;
}

function PersonalityView({ assessment, employeeName }: PersonalityViewProps) {
  const { mbti, bigFive, disc, enneagram } = assessment;
  const testCount = [mbti, bigFive, disc, enneagram].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 顶部摘要 */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(236,72,153,0.05))' }}>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🧩</div>
            <div>
              <h5 className="text-lg font-bold m-0">{employeeName} · 性格测评报告</h5>
              <p className="text-sm text-muted-foreground">
                已完成 {testCount} 项测评：{[mbti && 'MBTI', bigFive && '大五人格', disc && 'DISC', enneagram && '九型人格'].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MBTI */}
      {mbti && <MBTICard mbti={mbti} />}

      {/* 大五 + DISC 并排 */}
      <div className="grid grid-cols-2 gap-4">
        {bigFive && <BigFiveCard bigFive={bigFive} />}
        {disc && <DISCCard disc={disc} />}
      </div>

      {/* 九型人格 */}
      {enneagram && <EnneagramCard enneagram={enneagram} />}
    </div>
  );
}

function MBTICard({ mbti }: { mbti: MBTIPersonality }) {
  const info = MBTI_DESCRIPTIONS[mbti.type];

  const dimensions = [
    { dim: 'E/I', pos: '外向 E', neg: '内向 I', value: mbti.EI },
    { dim: 'S/N', pos: '实感 S', neg: '直觉 N', value: mbti.SN },
    { dim: 'T/F', pos: '思考 T', neg: '情感 F', value: mbti.TF },
    { dim: 'J/P', pos: '判断 J', neg: '感知 P', value: mbti.JP },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">🔮</span> MBTI 性格类型
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-5 flex-wrap">
          <div
            className="w-[100px] h-[100px] rounded-2xl flex items-center justify-center text-[28px] font-extrabold text-white tracking-widest"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            {mbti.type}
          </div>
          <div>
            <h4 className="text-lg font-bold m-0">{info.nickname}</h4>
            <p className="text-sm text-muted-foreground">{info.summary}</p>
            {mbti.description && (
              <p className="text-[13px] text-foreground mt-2">💡 {mbti.description}</p>
            )}
            <p className="text-[11px] text-muted-foreground">测试日期：{mbti.testDate}</p>
          </div>
        </div>

        {/* 四维度 */}
        <div className="grid grid-cols-4 gap-4">
          {dimensions.map(d => {
            const isPos = d.value >= 0;
            const pct = Math.abs(d.value);
            return (
              <div key={d.dim}>
                <div className="text-center mb-2 font-semibold">{d.dim}</div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={isPos ? 'text-blue-600' : 'text-muted-foreground'}>{d.pos}</span>
                  <span className={!isPos ? 'text-purple-500' : 'text-muted-foreground'}>{d.neg}</span>
                </div>
                <ColoredProgress value={pct} color={isPos ? '#165dff' : '#a855f7'} />
                <div className="text-center text-[11px] text-muted-foreground mt-1">
                  {isPos ? d.pos : d.neg} {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function BigFiveCard({ bigFive }: { bigFive: BigFiveProfile }) {
  const traits = [
    { label: 'openness', cn: '开放性', value: bigFive.openness, color: '#7c3aed', desc: '好奇心、想象力、尝新' },
    { label: 'conscientiousness', cn: '尽责性', value: bigFive.conscientiousness, color: '#00b42a', desc: '组织性、责任感、目标导向' },
    { label: 'extraversion', cn: '外向性', value: bigFive.extraversion, color: '#ff7d00', desc: '社交性、精力充沛、乐观' },
    { label: 'agreeableness', cn: '宜人性', value: bigFive.agreeableness, color: '#165dff', desc: '合作、信任、利他' },
    { label: 'neuroticism', cn: '情绪稳定性', value: 100 - bigFive.neuroticism, color: '#0fc6c2', desc: '情绪稳定（反向计分）' },
  ];

  const topTrait = traits.reduce((best, t) => (t.value > best.value ? t : best), traits[0]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base"><span className="mr-2">🧬</span> 大五人格 OCEAN</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs text-muted-foreground mb-4">
          最突出特征：<Badge className="ml-1" style={{ backgroundColor: topTrait.color }}>{topTrait.cn} {topTrait.value}</Badge>
        </p>
        {traits.map(t => (
          <div key={t.label} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[13px] font-semibold">{t.cn} <span className="text-muted-foreground font-normal text-[11px]">{t.desc}</span></span>
              <span className="text-[13px] font-bold" style={{ color: t.color }}>{t.value}</span>
            </div>
            <ColoredProgress value={t.value} color={t.color} />
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground mt-2">测试日期：{bigFive.testDate}</p>
      </CardContent>
    </Card>
  );
}

function DISCCard({ disc }: { disc: DISCProfile }) {
  const all = [
    { key: 'D', label: '指挥型', value: disc.dominance, color: '#f53f3f', icon: '🎯', desc: '结果导向、果断' },
    { key: 'I', label: '影响型', value: disc.influence, color: '#ff7d00', icon: '🤝', desc: '乐观、说服力强' },
    { key: 'S', label: '稳健型', value: disc.steadiness, color: '#00b42a', icon: '🤲', desc: '耐心、稳定、合作' },
    { key: 'C', label: '服从型', value: disc.compliance, color: '#165dff', icon: '📐', desc: '精确、系统化' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base"><span className="mr-2">🎭</span> DISC 行为风格</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground">主要风格</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {all.map(item => (
              <div
                key={item.key}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold"
                style={{
                  background: item.key === disc.primaryStyle ? item.color : 'var(--muted)',
                  color: item.key === disc.primaryStyle ? '#fff' : 'var(--muted-foreground)',
                }}
              >
                {item.key}
              </div>
            ))}
          </div>
          <Badge className="mt-2" style={{ backgroundColor: all.find(a => a.key === disc.primaryStyle)?.color }}>
            {all.find(a => a.key === disc.primaryStyle)?.label}型 · {all.find(a => a.key === disc.primaryStyle)?.desc}
          </Badge>
        </div>

        {all.map(item => (
          <div key={item.key} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[13px] font-semibold">
                {item.icon} {item.label}
                <span className="text-muted-foreground font-normal text-[11px] ml-1">{item.desc}</span>
              </span>
              <span className="text-[13px] font-bold">{item.value}%</span>
            </div>
            <ColoredProgress value={item.value} color={item.color} />
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground mt-2">测试日期：{disc.testDate}</p>
      </CardContent>
    </Card>
  );
}

function EnneagramCard({ enneagram }: { enneagram: EnneagramProfile }) {
  const info = ENNEAGRAM_DESCRIPTIONS[enneagram.type];
  const colors = ['#f53f3f', '#ff7d00', '#f7d038', '#00b42a', '#0fc6c2', '#165dff', '#7c3aed', '#eb2f96', '#86909c'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">🔢</span> 九型人格
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center text-4xl font-extrabold text-white"
              style={{ background: `linear-gradient(135deg, ${colors[enneagram.type - 1]}, ${colors[enneagram.type - 1]}aa)` }}
            >
              {enneagram.type}
            </div>
            <Badge className="text-sm" style={{ backgroundColor: colors[enneagram.type - 1] }}>{info.name}</Badge>
            {enneagram.wing && <Badge variant="outline" className="mt-1 block w-fit mx-auto">W{enneagram.wing}</Badge>}
          </div>
          <div>
            <p className="mb-2">{info.summary}</p>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(t => (
                <Badge
                  key={t}
                  variant={t === enneagram.type ? 'default' : 'outline'}
                  style={t === enneagram.type ? { backgroundColor: colors[t - 1] } : {}}
                >
                  {t}号 · {ENNEAGRAM_DESCRIPTIONS[t].name}
                </Badge>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">测试日期：{enneagram.testDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
