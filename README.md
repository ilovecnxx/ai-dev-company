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

## 虚拟软件公司 - 多 Agent 协作系统 v2.0

基于 Claude Code 官方文档的 subagents 和 agent teams 实现，支持直接 Agent 间协作。

## 核心特性

- **直接协作通道**: Agent 之间可以直接通信，无需经过 CEO 中转
- **持久记忆系统**: 每个 Agent 有独立记忆，支持自我迭代优化
- **ADR 架构决策**: 重要决策记录在案，可追溯
- **安全前置**: Security 参与架构设计早期阶段
- **测试就绪检查**: QA 有明确的测试开始条件

## 组织架构

```
                         用户 (甲方)
                             │
                             ▼
                        ┌─────────┐
                        │   CEO   │ ← 总协调，任务分发，结果汇总
                        └────┬────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌───────┐          ┌─────────┐          ┌───────┐
    │  PM   │◀────────▶│Architect│◀────────▶│Designer│
    │ 产品经理│          │  架构师  │          │ 设计师  │
    └───────┘          └─────────┘          └───────┘
        │                    │                    │
        │              ┌─────┴─────┐              │
        │              ▼           ▼              │
        │    ┌───────────────┐  ┌───────────────┐│
        └────▶  Frontend-Dev  │◀▶│  Backend-Dev  │┘
              │  前端开发      │  │  后端开发     │
              └───────┬───────┘  └───────┬───────┘
                      │                  │
                      └────────┬─────────┘
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

## 直接协作通道

| 协作对 | 内容 | 触发条件 |
|--------|------|----------|
| PM ↔ Architect | 需求可行性确认 | 复杂需求/新功能 |
| PM ↔ Designer | UX 需求澄清 | 设计任务 |
| Designer ↔ Frontend-Dev | 设计稿交接 | 设计完成 |
| Frontend-Dev ↔ Backend-Dev | API 契约确认 | API 开发 |
| Architect ↔ Dev | 技术指导/代码审查 | 任意阶段 |
| Architect ↔ Security | 安全架构评审 | 架构设计阶段 |
| QA ↔ Dev | 测试配合/Bug 报告 | 测试阶段 |
| QA ↔ Security | 安全测试配合 | 安全测试阶段 |

## Agent 成员

| Agent | 角色 | 职责 | 通信 |
|-------|------|------|------|
| **CEO** | 首席执行官 | 任务接收、分派、进度跟踪、质量门禁 | 所有人 |
| **PM** | 产品经理 | 需求分析、PRD、用户故事、MoSCoW 优先级 | CEO, Architect, Designer |
| **Architect** | 架构师 | 系统设计、技术选型、ADR、直接技术指导 | CEO, PM, Dev, Security |
| **Frontend-Dev** | 前端开发 | UI 实现、组件开发、响应式、设计验收 | CEO, Designer, Backend-Dev |
| **Backend-Dev** | 前端开发 | API 开发、数据库、业务逻辑、安全实现 | CEO, Frontend-Dev, QA |
| **QA** | 测试工程师 | 测试策略、执行、Bug 报告、测试就绪检查 | CEO, Dev, Security |
| **Security** | 安全专家 | 安全审计、OWASP Top 10、威胁建模、安全前置 | CEO, Architect, Dev |
| **Designer** | 设计师 | UI/UX 设计、设计系统、设计自检 | CEO, PM, Frontend-Dev |

## 记忆系统

每个 Agent 有独立记忆目录，支持自我迭代优化：

```
memory/
├── ceo/              # 决策记录、会议、团队表现
├── pm/               # 需求模式、项目总结、PRD 模板
├── architect/        # ADR、技术债务、架构模式
├── designer/         # 设计系统、组件模式、UI 模式
├── frontend-dev/     # 组件模式、FAQ、最佳实践
├── backend-dev/      # API 模式、数据库优化、安全实践
├── qa/               # 测试策略、Bug 模式、测试就绪检查
└── security/        # 漏洞模式、威胁模型、OWASP
```

## 工作流程

### 1. 任务接收 (CEO)
```
用户 → CEO: 需求描述
CEO → 分析 → 分解子任务
```

### 2. 需求阶段 (PM + Architect)
```
PM → 需求分析 → PRD + 用户故事
       ↓
Architect → 技术可行性确认
       ↓
PM → 优先级排序 (MoSCoW)
```

### 3. 设计阶段 (Designer + Architect)
```
Designer → 设计稿 + 设计规格
       ↓
Architect → 安全架构评审 (Security 参与)
       ↓
Frontend-Dev → 设计验收清单检查
```

### 4. 开发阶段 (Frontend-Dev + Backend-Dev)
```
并行开发:
  Frontend-Dev → 前端实现
  Backend-Dev → 后端实现

直接协作:
  API 契约确认 (Frontend-Dev ↔ Backend-Dev)
  技术指导 (Architect → Dev)
```

### 5. 测试阶段 (QA + Security)
```
QA → 测试就绪检查 (必须全部通过)
       ↓
QA → 测试执行 (单元/集成/E2E)
       ↓
Security → 安全扫描 + 渗透测试
       ↓
QA → Bug 报告 → Dev 修复 → 复测
```

### 6. 交付阶段 (CEO)
```
CEO → 质量门禁检查
       ↓
所有标准通过 → 交付
       ↓
记录项目总结 → 更新记忆系统
```

## 使用方式

### 与 CEO 对话 (默认)
```
我想要一个用户认证系统，包含注册、登录、JWT 令牌
```

### 直接与特定 Agent 对话
```
@pm 分析这个需求，输出 PRD
@architect 设计系统架构，出 ADR
@designer 做登录页面的设计稿
@frontend-dev 实现登录页面
@backend-dev 实现认证 API
@qa 开始测试就绪检查
@security 审计认证代码
```

### 查看团队成员
```
@ceo 列出团队成员和状态
```

## 启动

```bash
./start.sh
```

## 文档

- [架构文档](docs/ARCHITECTURE.md)
- [工作流](docs/WORKFLOW.md)
- [Agent 协作流程](docs/AGENT_COLLABORATION.md)
- [优化报告](docs/OPTIMIZATION.md)

## 技术栈

基于 Claude Code 官方文档：
- **Subagents**: 自定义 Agent，独立的上下文和工具权限
- **Agent Teams**: 多 Agent 并行协作
- **Hooks**: PreToolUse/PostToolUse/Stop 质量强化
- **Skills**: 领域专业知识注入
- **Memory**: 跨会话持久化

## License

MIT
