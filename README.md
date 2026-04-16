# AI DEV COMPANY v3.0

> 扁平化组织 · Token 高效 · 自动进化

## 核心理念

- **扁平化**: 无部门、无层级，只有专才成员
- **Token 高效**: 按需唤醒、知识分层、只下发微任务
- **自动进化**: 制度自优化、成员自学习

## 组织架构

```
用户 (甲方)
    │
    ▼
   CEO
    │
    ├──▶ python-dev      (Python 后端)
    ├──▶ frontend-dev     (React 前端)
    ├──▶ qa              (测试)
    └──▶ security         (安全)
```

## 目录结构

```
ai-dev-company/
├── .claude/
│   ├── agents/           # Agent 定义 (扁平化)
│   │   ├── ceo.md
│   │   ├── python-dev.md
│   │   ├── frontend-dev.md
│   │   ├── qa.md
│   │   └── security.md
│   ├── rules/
│   │   └── company-policy.md  # 自动进化制度
│   └── CLAUDE.md
├── memory/
│   ├── kb/              # 共享知识库
│   │   ├── python-patterns.md
│   │   ├── react-patterns.md
│   │   ├── test-strategy.md
│   │   └── security-checklist.md
│   ├── members/         # 成员档案
│   ├── meetings/        # 头脑风暴纪要
│   ├── rollback/        # 制度备份
│   └── announcements.md # 公告板
├── tasks/
│   └── active/          # 进行中任务
└── INSTRUCTIONS.md      # 迭代任务指令
```

## 使用方式

### 与 CEO 对话
```
我需要一个用户认证系统
```

### 直接调度专才
```
@python-dev 实现登录 API
@frontend-dev 实现登录页面
@qa 测试登录流程
@security 审计认证代码
```

### 头脑风暴
```
CEO，开头脑风暴会讨论微服务架构
```

## 成员索引

| 成员 | 专长 | 标签 |
|------|------|------|
| python-dev | Python 后端 | backend, python, api |
| frontend-dev | React 前端 | frontend, react, ui |
| qa | 测试工程 | testing, qa, e2e |
| security | 安全审计 | security, owasp |

## Dev-Test 闭环

```
python-dev 实现功能
       │
       ▼
    qa 测试
       │
   通过? ──┬── 是 ──▶ 交付
           │
           否
           │
           ▼
   python-dev 修复
           │
           ▼
      循环 <= 3
           │
     超过 3 次 ──▶ CEO 仲裁
```

## 制度进化

```
复盘/头脑风暴
       │
       ▼
   CEO 分析根因
       │
       ▼
   备份当前版本 ──▶ memory/rollback/
       │
       ▼
   更新 company-policy.md
       │
       ▼
   公告全体成员
```

## 启动

```bash
# 查看成员状态
@ceo 列出成员

# 开始新任务
@ceo 我需要一个博客系统
```

## License

MIT
