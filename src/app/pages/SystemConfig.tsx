import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface MessageConfig {
  enableWechat: boolean;
  wechatWebhook: string;
  enableEmail: boolean;
  emailHost: string;
  emailPort: number;
  emailUser: string;
  emailPassword: string;
  enableSMS: boolean;
  smsProvider: string;
  smsAccessKey: string;
  smsAccessSecret: string;
}

interface BackupConfig {
  enableAutoBackup: boolean;
  backupInterval: string;
  backupTime: string;
  backupRetention: number;
  backupPath: string;
}

interface BusinessConfig {
  leadRecycleDays: number;
  followRemindDays: number;
  contractExpireRemindDays: number;
  customerInactiveDays: number;
  enableDuplicateCheck: boolean;
  enableAutoAssign: boolean;
}

export function SystemConfig() {
  const [activeTab, setActiveTab] = useState('message');

  const [messageConfig, setMessageConfig] = useState<MessageConfig>({
    enableWechat: true,
    wechatWebhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxx',
    enableEmail: true,
    emailHost: 'smtp.company.com',
    emailPort: 465,
    emailUser: 'noreply@company.com',
    emailPassword: '********',
    enableSMS: false,
    smsProvider: 'aliyun',
    smsAccessKey: '',
    smsAccessSecret: '',
  });

  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    enableAutoBackup: true,
    backupInterval: 'daily',
    backupTime: '02:00',
    backupRetention: 30,
    backupPath: '/data/backups',
  });

  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({
    leadRecycleDays: 7,
    followRemindDays: 3,
    contractExpireRemindDays: 30,
    customerInactiveDays: 90,
    enableDuplicateCheck: true,
    enableAutoAssign: false,
  });

  const handleMessageSubmit = () => {
    console.log('消息渠道配置', messageConfig);
    toast.success('保存成功');
  };

  const handleBackupSubmit = () => {
    console.log('备份配置', backupConfig);
    toast.success('保存成功');
  };

  const handleBusinessSubmit = () => {
    console.log('业务参数配置', businessConfig);
    toast.success('保存成功');
  };

  const handleBackupNow = () => {
    toast.loading('正在备份数据...');
    setTimeout(() => {
      toast.success('数据备份成功');
    }, 2000);
  };

  const handleRestore = () => {
    toast.warning('数据恢复功能需谨慎使用,请联系系统管理员');
  };

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="message">消息渠道配置</TabsTrigger>
              <TabsTrigger value="backup">备份与恢复</TabsTrigger>
              <TabsTrigger value="business">业务参数配置</TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="mt-6">
              <div className="max-w-[800px] space-y-6">
                <div>
                  <h3 className="text-lg font-medium">企业微信通知</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>启用企业微信通知</Label>
                      <Switch
                        checked={messageConfig.enableWechat}
                        onCheckedChange={(checked) =>
                          setMessageConfig({ ...messageConfig, enableWechat: checked })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Webhook地址</Label>
                      <Input
                        placeholder="请输入企业微信机器人Webhook地址"
                        value={messageConfig.wechatWebhook}
                        onChange={(e) =>
                          setMessageConfig({ ...messageConfig, wechatWebhook: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">邮件通知</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>启用邮件通知</Label>
                      <Switch
                        checked={messageConfig.enableEmail}
                        onCheckedChange={(checked) =>
                          setMessageConfig({ ...messageConfig, enableEmail: checked })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>SMTP服务器</Label>
                      <Input
                        placeholder="请输入SMTP服务器地址"
                        value={messageConfig.emailHost}
                        onChange={(e) =>
                          setMessageConfig({ ...messageConfig, emailHost: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>SMTP端口</Label>
                      <Input
                        type="number"
                        placeholder="请输入SMTP端口"
                        value={messageConfig.emailPort}
                        onChange={(e) =>
                          setMessageConfig({ ...messageConfig, emailPort: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>发件人邮箱</Label>
                      <Input
                        placeholder="请输入发件人邮箱"
                        value={messageConfig.emailUser}
                        onChange={(e) =>
                          setMessageConfig({ ...messageConfig, emailUser: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>邮箱密码</Label>
                      <Input
                        type="password"
                        placeholder="请输入邮箱密码或授权码"
                        value={messageConfig.emailPassword}
                        onChange={(e) =>
                          setMessageConfig({ ...messageConfig, emailPassword: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">短信通知</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>启用短信通知</Label>
                      <Switch
                        checked={messageConfig.enableSMS}
                        onCheckedChange={(checked) =>
                          setMessageConfig({ ...messageConfig, enableSMS: checked })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>短信服务商</Label>
                      <Select
                        value={messageConfig.smsProvider}
                        onValueChange={(value) =>
                          setMessageConfig({ ...messageConfig, smsProvider: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择短信服务商" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aliyun">阿里云</SelectItem>
                          <SelectItem value="tencent">腾讯云</SelectItem>
                          <SelectItem value="huawei">华为云</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>AccessKey</Label>
                      <Input
                        placeholder="请输入AccessKey"
                        value={messageConfig.smsAccessKey}
                        onChange={(e) =>
                          setMessageConfig({ ...messageConfig, smsAccessKey: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>AccessSecret</Label>
                      <Input
                        type="password"
                        placeholder="请输入AccessSecret"
                        value={messageConfig.smsAccessSecret}
                        onChange={(e) =>
                          setMessageConfig({ ...messageConfig, smsAccessSecret: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleMessageSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="mt-6">
              <div className="max-w-[800px] space-y-6">
                <div>
                  <h3 className="text-lg font-medium">自动备份配置</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>启用自动备份</Label>
                      <Switch
                        checked={backupConfig.enableAutoBackup}
                        onCheckedChange={(checked) =>
                          setBackupConfig({ ...backupConfig, enableAutoBackup: checked })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>备份频率</Label>
                      <Select
                        value={backupConfig.backupInterval}
                        onValueChange={(value) =>
                          setBackupConfig({ ...backupConfig, backupInterval: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择备份频率" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">每日备份</SelectItem>
                          <SelectItem value="weekly">每周备份</SelectItem>
                          <SelectItem value="monthly">每月备份</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>备份时间</Label>
                      <Input
                        placeholder="请输入备份时间,如:02:00"
                        value={backupConfig.backupTime}
                        onChange={(e) =>
                          setBackupConfig({ ...backupConfig, backupTime: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>备份保留天数</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="请输入保留天数"
                        value={backupConfig.backupRetention}
                        onChange={(e) =>
                          setBackupConfig({ ...backupConfig, backupRetention: parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>备份存储路径</Label>
                      <Input
                        placeholder="请输入备份文件存储路径"
                        value={backupConfig.backupPath}
                        onChange={(e) =>
                          setBackupConfig({ ...backupConfig, backupPath: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={handleBackupSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    保存配置
                  </Button>
                  <Button variant="outline" onClick={handleBackupNow}>
                    立即备份
                  </Button>
                  <Button variant="destructive" onClick={handleRestore}>
                    数据恢复
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-6">
              <div className="max-w-[800px] space-y-6">
                <div>
                  <h3 className="text-lg font-medium">线索管理</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>线索自动回收天数</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="请输入天数"
                        value={businessConfig.leadRecycleDays}
                        onChange={(e) =>
                          setBusinessConfig({ ...businessConfig, leadRecycleDays: parseInt(e.target.value) || 1 })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        销售认领线索后,若超过设置天数未跟进,系统将自动回收至公海线索
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>跟进提醒天数</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="请输入天数"
                        value={businessConfig.followRemindDays}
                        onChange={(e) =>
                          setBusinessConfig({ ...businessConfig, followRemindDays: parseInt(e.target.value) || 1 })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        线索超过设置天数未跟进,系统将发送提醒通知
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>启用线索查重</Label>
                      <Switch
                        checked={businessConfig.enableDuplicateCheck}
                        onCheckedChange={(checked) =>
                          setBusinessConfig({ ...businessConfig, enableDuplicateCheck: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>启用线索自动分配</Label>
                      <Switch
                        checked={businessConfig.enableAutoAssign}
                        onCheckedChange={(checked) =>
                          setBusinessConfig({ ...businessConfig, enableAutoAssign: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">客户管理</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>客户闲置天数</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="请输入天数"
                        value={businessConfig.customerInactiveDays}
                        onChange={(e) =>
                          setBusinessConfig({ ...businessConfig, customerInactiveDays: parseInt(e.target.value) || 1 })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        客户超过设置天数无任何业务往来,系统将标记为闲置客户
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">合同管理</h3>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>合同到期提醒天数</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="请输入天数"
                        value={businessConfig.contractExpireRemindDays}
                        onChange={(e) =>
                          setBusinessConfig({ ...businessConfig, contractExpireRemindDays: parseInt(e.target.value) || 1 })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        合同到期前N天发送提醒通知
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleBusinessSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
