# AGENTS.md

给在本仓库工作的 AI 助手的简短指引。完整业务术语见 `CONTEXT.md`。

## 语言

**永远使用中文。** 所有交流、回复、提问、提交信息、代码注释与文档一律使用中文。

## 项目本质

基于 Arco Design 的企业 CRM **前端原型**，代码源自 Figma/Make 导出。页面以 `useState` + 模块级 mock 数据 + Context 驱动，**没有真实后端**：不存在 axios/fetch 数据层 / React Query / Redux / Zustand。不要假设数据来自服务端，也不要去找 API 层。

注意：当前处于重构中期，**新旧两套页面并存**。根目录扁平页面（`PublicLeads.tsx`、`MyLeads.tsx`、`Employee*`、`Dashboard` 等）与新模块目录（`pages/leads/`、`pages/hr/`、`pages/dashboard/`、`pages/travel/` 等）同时存在，路由里两套路径也并存。改页面前先确认要改的是**哪一套**，以路由 `src/app/routes.tsx` 实际指向为准。

## 命令

使用 **npm**（虽存在 `pnpm-workspace.yaml`，但脚本与锁文件以 npm 为准）：

```bash
npm install
npm run dev          # Vite dev server（Playwright webServer 也用它）
npm run build        # 主要验证手段；没有 lint/typecheck 脚本
npm test             # vitest run（全部单元测试）
npm run test:reminders
npx vitest run <path> -t "用例名"        # 单文件/单用例
npm run test:e2e     # Playwright（会自动拉起 dev server）
```

- 无 `lint` / `typecheck`，常规验证跑 `npm run build`，改动相关逻辑再补单测。
- `react-router@7` 声明 Node >=20。
- 单元测试共约 10 个，集中在 `reminders/__tests__`、`contracts/__tests__`、`daily-report/__tests__`、`leads/__tests__`、`project-management/__tests__`、`dashboard/__tests__` 等。

## 架构要点

- 入口链：`src/main.tsx` → `src/app/App.tsx`（依次嵌套 `ReminderProvider`/`EmployeeProvider`/`ContractsProvider`/`WeChatProvider`/`ChatProvider`，再挂 `RouterProvider` 和 sonner `Toaster`）。
- 路由集中在 `src/app/routes.tsx`；布局组件是 `src/app/components/MainLayout.tsx`（侧边栏、顶栏、提醒入口、日报弹窗）。新增一级导航通常要同时改这两个文件。
- 复杂业务模块在 `src/app/pages/<模块>/` 下自带 `types` / `mockData` / `utils` / 组件。改口径前先找该目录的共享数据/计算文件，不要在页面里重复计算。

### 提醒系统

- `src/app/reminders/`：`ReminderContext` 持有内存 mock 数据；`buildReminders.ts` 通过 `adapters/` 下的多个 adapter（审批、合同、日报、线索、工作项）聚合后统一排序。
- 改提醒行为优先复用这里的纯函数并加测试，不要把时间判断散落到页面。`MainLayout` 顶栏、`ReminderBell`、`ReminderTodoPanel` 等都依赖它。

### 跨模块数据依赖

- `pages/contract-cost/` 复用 `pages/project-management/` 的日报/工时数据。
- `pages/contracts/ContractsContext` 被合同列表、向导、详情、回款看板等共用。
- 合同回款看板在 `pages/contracts/PaymentKanban.tsx` 及 `components/PaymentKanban*`。

## 构建约定（vite.config.ts）

- 必须保留 `react()` 与 `tailwindcss()` 两个插件，即使 Tailwind 用得少。
- `@` 别名指向 `src/`；`figma:asset/<filename>` 解析到 `src/assets/<filename>`。
- `assetsInclude` 只含 `svg`、`csv`；**不要**加入 `.css/.ts/.tsx`。
- 全局样式入口 `src/styles/index.css`，注意其引入顺序。
- UI 混用：业务页面主要用 Arco Design，`src/app/components/ui/` 另有一套 shadcn/Radix 通用组件。

## 提交与仓库卫生

- 不要提交 `.env.local`、`node_modules`、`dist`、`.next/`、`playwright-report/`、`test-results/`、`tmp/`、`output/`（均已在 `.gitignore`）。
- 历史上 `.next/`、`playwright-report/`、`test-results/` 曾被误提交；新增构建产物目录时记得加入 `.gitignore`，不要把产物目录纳入版本库。
- 不要把任何 API Key 写进源码或示例文件。
