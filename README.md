# AI DEV COMPANY v2.0

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

## 虚拟软件公司 - 多 Agent 协作系统

基于 Claude Code 官方文档的 subagents 和 agent teams 实现。

## 组织架构

```
                    用户 (甲方)
                        │
                        ▼
                   ┌─────────┐
                   │   CEO   │ ← 总协调，任务分发，结果汇总
                   └────┬────┘
                        │
       ┌────────────────┼────────────────┐
       │                │                │
       ▼                ▼                ▼
   ┌───────┐       ┌─────────┐       ┌───────┐
   │  PM   │       │Architect│       │Designer│
   │ 产品经理│      │  架构师  │       │ 设计师  │
   └───────┘       └─────────┘       └───────┘
       │                │                │
       └────────┬──────┘                │
                ▼                        ▼
   ┌─────────────────────┐      ┌───────────────┐
   │  Frontend-Dev       │      │  Backend-Dev  │
   │  前端开发           │◄────►│  后端开发     │
   └─────────────────────┘      └───────────────┘
                │                        │
                └────────┬───────────────┘
                         ▼
                ┌─────────────────┐
                │       QA        │
                │   测试工程师    │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │    Security     │
                │    安全专家     │
                └─────────────────┘
```

## Agent 成员

| Agent | 角色 | 职责 | 通信对象 |
|-------|------|------|----------|
| **CEO** | 首席执行官 | 任务接收、分派、进度跟踪、质量门禁 | 所有人 |
| **PM** | 产品经理 | 需求分析、PRD、用户故事、优先级 | CEO, Architect |
| **Architect** | 架构师 | 系统设计、技术选型、代码质量 | CEO, PM, Dev |
| **Frontend-Dev** | 前端开发 | UI 实现、组件开发、响应式 | CEO, Designer |
| **Backend-Dev** | 后端开发 | API 开发、数据库、业务逻辑 | CEO, Frontend-Dev |
| **QA** | 测试工程师 | 测试策略、执行、bug 报告 | CEO, Dev |
| **Security** | 安全专家 | 安全审计、漏洞评估、OWASP | CEO, Dev |
| **Designer** | 设计师 | UI/UX 设计、设计系统 | CEO, PM, Frontend-Dev |

## 如何使用

### 与 CEO 对话 (默认)

直接描述你的需求，CEO 会自动协调其他 Agent：

```
我想要一个用户认证系统，包含注册、登录、JWT 令牌
```

### 直接与特定 Agent 对话

使用 @-mention 直接与特定 Agent 通信：

```
@pm 分析这个需求
@architect 设计系统架构
@frontend-dev 实现登录页面
@security 审计认证代码
```

### 查看可用 Agent

```
@ceo 列出团队成员
```

## Agent 通信协议

### 用户 → CEO
直接自然语言输入，CEO 分析并分派任务

### CEO → Agent
CEO 通过 Task 或 SendMessage 派发任务

### Agent → CEO
Agent 完成时报告结果或提出问题

### Agent 之间
Agent 可以互相沟通协调（如 Frontend-Dev ↔ Backend-Dev）

## 记忆系统

每个 Agent 有持久化记忆：
```
memory/
├── ceo/           # CEO 的记忆：决策、项目历史
├── pm/            # PM 的记忆：需求模式、文档模板
├── architect/     # 架构师记忆：架构决策、技术偏好
├── frontend-dev/  # 前端记忆：组件模式、常见问题
├── backend-dev/   # 后端记忆：API 模式、安全实践
├── qa/            # QA 记忆：测试策略、Bug 模式
├── security/      # 安全记忆：漏洞模式、审计结果
└── designer/       # 设计师记忆：设计系统、UI 模式
```

## 工作流程

```
1. 用户输入需求
        │
        ▼
2. CEO 接收并分析
        │
        ▼
3. CEO 分派任务给团队
   ├─ → PM: 分析需求 → PRD
   │
   ├─ → Architect: 技术设计 → 架构文档
   │
   ├─ → Designer: UI 设计 → 设计稿
   │
   ├─ → Frontend-Dev + Backend-Dev: 并行开发
   │
   ├─ → QA: 测试 → Bug 报告
   │
   └─ → Security: 安全审计 → 审计报告
        │
        ▼
4. CEO 汇总结果，质量门禁
        │
        ▼
5. 交付用户 (甲方)
```

## 文件结构

```
ai-dev-company/
├── agents/
│   └── skills/              # Agent 定义文件
│       ├── ceo.md           # CEO
│       ├── pm.md           # 产品经理
│       ├── architect.md     # 架构师
│       ├── frontend-dev.md  # 前端开发
│       ├── backend-dev.md   # 后端开发
│       ├── qa.md           # 测试工程师
│       ├── security.md     # 安全专家
│       └── designer.md     # 设计师
├── memory/                  # Agent 持久记忆
│   ├── ceo/
│   ├── pm/
│   ├── architect/
│   └── ...
├── tasks/                   # 任务文件
│   └── active/              # 进行中的任务
├── docs/                    # 文档
│   ├── ARCHITECTURE.md
│   ├── WORKFLOW.md
│   ├── AGENTS.md            # Agent 详细说明
│   └── COMMUNICATION.md     # 通信协议
├── config/                  # 配置
│   ├── hooks.json          # Hook 配置
│   └── workflow.json        # 工作流配置
├── scripts/hooks/            # Hook 脚本
│   ├── pre-dev-workflow-check.js
│   ├── post-dev-quality-report.js
│   └── stop-final-verdict.js
├── start.sh                 # 启动脚本
├── logo.txt                 # ASCII logo
├── README.md                # 本文件
└── .gitignore
```

## 启动

```bash
./start.sh
```

或直接与 CEO 对话：
```
/autopilot 创建一个博客系统
```

## 技术栈

基于 Claude Code 官方文档：
- **Subagents**: 自定义 Agent，独立的上下文和工具权限
- **Agent Teams**: 多 Agent 并行协作
- **Hooks**: PreToolUse/PostToolUse/Stop 质量强化
- **Skills**: 领域专业知识注入
- **Memory**: 跨会话持久化

## License

MIT