import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 测试文件目录
  testDir: './e2e',

  // 每个测试的超时时间
  timeout: 30000,

  // 断言超时
  expect: {
    timeout: 5000,
  },

  // 测试报告
  reporter: 'html',

  // 全局设置
  use: {
    // 基础 URL
    baseURL: 'http://localhost:5173',

    // 失败时截图
    screenshot: 'only-on-failure',

    // 失败时录制视频
    video: 'retain-on-failure',

    // 浏览器上下文选项
    trace: 'on-first-retry',
  },

  // 浏览器配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 开发服务器配置
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
