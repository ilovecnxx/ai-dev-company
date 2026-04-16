# 工作流文档

## 整体架构

```
用户 (甲方)
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  autopilot (CEO)                                         │
│  - 接收需求                                              │
│  - 协调所有 Phase                                         │
└─────────────────────────────────────────────────────────┘
    │
    ▼
Phase 0: 需求扩展 (analyst + architect)
    │
    ▼
Phase 1: 计划生成 (planner + critic)
    │
    ▼
Phase 2: 执行 (executor - Ralph/Ultrawork)
    │
    ▼
Phase 3: QA 循环 (build → test → fix)
    │
    ▼
Phase 4: 多视角验证 (architect + security + code-reviewer)
    │
    ▼
Phase 5: 清理
```

## Hooks 质量强化

### PreToolUse Hooks

| Hook | 触发条件 | 作用 |
|------|----------|------|
| `pre:dev-workflow-check` | Bash (npm/pnpm build, test) | 检查前置条件 |
| `pre:fact-force-gate` | Edit/Write (首次编辑文件) | 强制调研 |

### PostToolUse Hooks

| Hook | 触发条件 | 作用 |
|------|----------|------|
| `post:edit-accumulator` | Edit/Write | 收集编辑文件 |
| `post:quality-gate` | Edit/Write | 质量检查 |
| `post:console-warn` | Edit | 检查 console.log |

### Stop Hooks

| Hook | 作用 |
|------|------|
| `stop:format-typecheck` | 批量格式化 + 类型检查 |
| `stop:final-verdict` | 最终交付判定 |

## Agent 职责

| Agent | 角色 | 职责 |
|-------|------|------|
| autopilot | CEO | 整体协调、流程控制 |
| analyst | 产品经理 | 需求分析、PRD |
| architect | CTO | 架构设计、技术选型 |
| executor | 开发者 | 代码实现 |
| tdd-guide | 测试工程师 | TDD 指导 |
| code-reviewer | 代码审查 | 质量把关 |
| security-reviewer | 安全专家 | 安全审计 |
| critic | 质量总监 | 最终验收 |

## 执行示例

```bash
# 启动 autopilot
/autopilot build me a REST API for todo app with auth

# 或使用 skill
/skill autopilot build me a REST API for todo app with auth
```

## 状态文件

- `.omc/autopilot/spec.md` - 规格说明
- `.omc/plans/autopilot-impl.md` - 实现计划
- `.omc/state/autopilot-state.json` - 运行状态