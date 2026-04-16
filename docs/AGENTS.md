# Agent 详细说明

## CEO (首席执行官)

**文件**: `agents/skills/ceo.md`
**模型**: Opus
**颜色**: Purple

### 职责
- 接收用户需求
- 任务分解和分配
- 进度协调
- 质量门禁
- 向用户汇报

### 通信方式
- 直接与用户对话
- 向各 Agent 派发任务
- 汇总各 Agent 结果

### 触发词
- "创建一个 XXX"
- "开发一个 XXX"
- "我想要 XXX"

---

## PM (产品经理)

**文件**: `agents/skills/pm.md`
**模型**: Sonnet
**颜色**: Blue

### 职责
- 需求分析
- PRD 编写
- 用户故事拆分
- 优先级排序
- 验收标准定义

### 通信方式
- 与 CEO 汇报
- 与 Architect 讨论技术可行性
- 与 Designer 确认需求

### 触发词
- "分析需求"
- "写 PRD"
- "拆分用户故事"

---

## Architect (架构师)

**文件**: `agents/skills/architect.md`
**模型**: Opus
**颜色**: Green

### 职责
- 系统架构设计
- 技术选型
- API 合同定义
- 代码规范制定
- 技术方案评审

### 通信方式
- 与 CEO 汇报
- 指导开发团队
- 与 PM 确认技术约束

### 触发词
- "设计架构"
- "技术选型"
- "评审代码"

---

## Frontend-Dev (前端开发)

**文件**: `agents/skills/frontend-dev.md`
**模型**: Sonnet
**颜色**: Cyan

### 职责
- UI 组件开发
- 页面实现
- 状态管理
- 响应式设计
- 与后端 API 对接

### 通信方式
- 与 CEO 汇报
- 与 Designer 确认 UI
- 与 Backend-Dev 确认 API

### 触发词
- "实现前端"
- "写页面"
- "做组件"

---

## Backend-Dev (后端开发)

**文件**: `agents/skills/backend-dev.md`
**模型**: Sonnet
**颜色**: Orange

### 职责
- API 开发
- 数据库设计
- 业务逻辑实现
- 认证/授权
- 性能优化

### 通信方式
- 与 CEO 汇报
- 与 Frontend-Dev 确认 API
- 与 Architect 讨论技术方案

### 触发词
- "实现后端"
- "写 API"
- "设计数据库"

---

## QA (测试工程师)

**文件**: `agents/skills/qa.md`
**模型**: Sonnet
**颜色**: Yellow

### 职责
- 测试策略制定
- 测试用例编写
- 测试执行
- Bug 报告
- 质量评估

### 通信方式
- 与 CEO 汇报
- 与 Dev 协作测试
- 报告 Bug

### 触发词
- "测试"
- "运行测试"
- "报告 Bug"

---

## Security (安全专家)

**文件**: `agents/skills/security.md`
**模型**: Opus
**颜色**: Red

### 职责
- 安全代码审计
- 漏洞扫描
- OWASP Top 10 合规
- 安全建议
- 渗透测试

### 通信方式
- 与 CEO 汇报
- 审计任何代码
- 紧急漏洞立即上报

### 触发词
- "安全审计"
- "检查漏洞"
- "OWASP"

---

## Designer (设计师)

**文件**: `agents/skills/designer.md`
**模型**: Sonnet
**颜色**: Pink

### 职责
- UI 设计
- UX 研究
- 设计系统维护
- 设计稿交付
- 设计规范文档

### 通信方式
- 与 CEO 汇报
- 与 PM 确认需求
- 与 Frontend-Dev 交接设计

### 触发词
- "设计"
- "UI"
- "设计稿"

---

## 如何直接与某个 Agent 对话

使用 @-mention：

```
@pm 分析博客系统的需求

@architect 为博客系统设计架构

@frontend-dev 实现博客列表页

@security 审计登录功能的安全性

@qa 为博客系统编写测试计划
```

## Agent 间通信示例

### CEO 派发任务
```
@architect 为用户认证系统设计架构，包含注册、登录、JWT 令牌

@backend-dev 实现 JWT 认证 API，使用 Node.js + Express

@frontend-dev 实现登录页面，包含表单验证
```

### Agent 报告结果
```
@ceo 认证系统架构设计完成，包含以下组件：
- JWT 令牌管理
- 密码加密 (bcrypt)
- 登录状态管理

可以开始实现了。
```

### 协作示例
```
@frontend-dev @backend-dev 
请确认 API 合同：
- POST /api/auth/register { email, password } → { user, token }
- POST /api/auth/login { email, password } → { user, token }
- GET /api/auth/me → { user }
确认后我开始实现前端。
```