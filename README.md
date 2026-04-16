# AI DEV COMPANY

```
    ___    ____   ____  _______    __
   /   |  /  _/  / __ \/ ____/ |  / /
  / /| |  / /   / / / / __/  | | / /
 / ___ |_/ /   / /_/ / /___  | |/ /
/_/  |_|/___/  /_____/_____/  |___/

  ___ ___  __  __ ___  _   _  ___   __
 / __/ _ \|  \/  | _ \/_\ | \| \ \ / /
| (_| (_) | |\/| |  _/ _ \| .` |\ V /
 \___\___/|_|  |_|_|/_/ \_\_|\_| |_|
```

**AI 全自动开发工作流 - 虚拟软件公司**

基于 Claude Code 多 Agent 系统，构建虚拟软件开发公司。用户扮演"甲方"，通过自然语言下达需求，AI 团队完成从需求分析到部署的全流程。

## 🚀 快速开始

```bash
cd ai-dev-company
./start.sh
```

或直接输入：
```
/autopilot build me a REST API for a todo app with auth
```

## 📋 示例任务

复制以下任一命令体验：

### 1. REST API 项目
```
/autopilot build me a REST API for a bookstore inventory with CRUD using TypeScript
```

### 2. 用户认证系统
```
/autopilot create a user registration and login system with JWT tokens
```

### 3. 博客系统
```
/autopilot build me a blog system with markdown support and comments
```

### 4. CLI 工具
```
/autopilot make me a CLI tool for tracking daily habits with streak counting
```

### 5. 微服务架构
```
/autopilot design a microservices system with user service, order service, and payment service
```

### 6. 在线商店
```
/autopilot create an online store with product catalog, shopping cart, and checkout
```

## 架构

```
用户 (甲方)
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  autopilot (CEO)                                        │
│  Phase 0: 需求分析 (analyst + architect)               │
│  Phase 1: 计划生成 (planner + critic)                  │
│  Phase 2: 执行 (executor)                              │
│  Phase 3: QA 循环 (build → test → fix)                 │
│  Phase 4: 多视角验证 (architect + security + code)     │
│  Phase 5: 清理                                         │
└─────────────────────────────────────────────────────────┘
```

## 虚拟员工

| 角色 | Agent | 职责 |
|------|-------|------|
| CEO | autopilot | 整体协调 |
| CTO | architect | 架构设计 |
| PM | analyst | 需求分析 |
| 开发者 | executor | 代码实现 |
| QA | tdd-guide | 测试 |
| 安全 | security-reviewer | 安全审计 |
| 质量总监 | critic | 最终验收 |

## 目录结构

```
ai-dev-company/
├── .omc/state/          # 运行状态
├── agents/              # Agent 定义
├── config/              # 配置文件
├── docs/                # 文档
├── scripts/hooks/       # Hook 脚本
├── start.sh             # 启动脚本
├── logo.txt             # ASCII logo
└── README.md
```

## Hooks 质量强化

| Hook | 类型 | 作用 |
|------|------|------|
| `pre-dev-workflow-check` | PreToolUse | 检查 build/test 前置条件 |
| `post-dev-quality-report` | PostToolUse | 收集编辑文件，检查质量问题 |
| `stop-final-verdict` | Stop | 最终交付判定 |

## License

MIT