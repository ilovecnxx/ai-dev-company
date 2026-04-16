# AI Dev Company - Agent 定义

## 虚拟员工列表

### 高管层

| 角色 | Agent | 描述 |
|------|-------|------|
| CEO | `autopilot` | 端到端协调，5 Phase 执行 |
| CTO | `architect` | 架构设计，技术决策 |

### 产品层

| 角色 | Agent | 描述 |
|------|-------|------|
| 产品经理 | `analyst` | 需求分析，PRD 生成 |
| 设计师 | `designer` | UI/UX 设计 |

### 开发层

| 角色 | Agent | 描述 |
|------|-------|------|
| 前端开发 | `executor` (Sonnet) | React/Vue/TypeScript |
| 后端开发 | `executor` (Sonnet) | Node.js/Python/Go |
| 全栈工程师 | `executor` (Opus) | 复杂任务 |

### 质量层

| 角色 | Agent | 描述 |
|------|-------|------|
| 测试工程师 | `tdd-guide` | TDD 指导，测试覆盖 |
| 代码审查 | `code-reviewer` | 代码质量 |
| 安全审查 | `security-reviewer` | OWASP Top 10 |
| 性能优化 | `performance-optimizer` | CWV 优化 |
| 质量总监 | `critic` | 最终验收 |

### 运维层

| 角色 | Agent | 描述 |
|------|-------|------|
| SRE | `devops-agent` | 部署，监控 |
| DBA | `database-reviewer` | 数据库优化 |

## 使用方法

这些 Agent 由 autopilot skill 自动调用，不需要手动管理。

如需单独调用：

```
/skill analyst 用户注册功能
/skill architect 微服务架构设计
/skill executor 实现一个 REST API
```