# ai-dev-company

AI 全自动开发工作流 - 虚拟软件公司

## 简介

基于 Claude Code 多 Agent 系统构建的虚拟软件开发公司。用户扮演"甲方"，通过自然语言下达需求，AI 团队完成从需求分析到部署的全流程。

## 核心架构

- **autopilot skill**: 端到端执行中枢 (CEO)
- **Hooks**: 质量强化层 (Pre/Post/Stop)
- **多 Agent 协作**: analyst → architect → executor → reviewer

## 快速开始

```bash
# 安装依赖
npm install

# 配置 Git hooks (需要手动配置 hooks.json)
./install.sh
```

### 使用 autopilot

```
/autopilot build me a REST API for a todo app with auth
```

## 目录结构

```
ai-dev-company/
├── .omc/              # 运行状态
│   ├── state/         # 状态文件
│   ├── plans/         # 实现计划
│   └── notepad/       # 开发笔记
├── agents/            # Agent 定义
├── config/            # 配置文件
│   └── hooks.json     # Hook 配置
├── docs/              # 文档
│   ├── WORKFLOW.md
│   └── ARCHITECTURE.md
└── scripts/           # 脚本
    └── hooks/          # Hook 脚本
```

## Hooks

| Hook | 类型 | 作用 |
|------|------|------|
| `pre-dev-workflow-check` | PreToolUse | 检查 build/test 前置条件 |
| `post-dev-quality-report` | PostToolUse | 收集编辑文件，检查质量问题 |
| `stop-final-verdict` | Stop | 最终交付判定 |

## 虚拟员工

| 角色 | Agent | 职责 |
|------|-------|------|
| CEO | autopilot | 整体协调 |
| CTO | architect | 架构设计 |
| PM | analyst | 需求分析 |
| 开发者 | executor | 代码实现 |
| QA | tdd-guide | 测试 |
| 安全 | security-reviewer | 安全审计 |

## 工作流程

1. **Phase 0**: 需求扩展 (analyst + architect)
2. **Phase 1**: 计划生成 (planner + critic)
3. **Phase 2**: 执行 (executor)
4. **Phase 3**: QA 循环 (最多 5 次)
5. **Phase 4**: 多视角验证
6. **Phase 5**: 清理

## License

MIT