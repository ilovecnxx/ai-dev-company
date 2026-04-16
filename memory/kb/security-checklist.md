# 安全检查清单

> 本文件定义 OWASP Top 10 安全检查标准

## OWASP Top 10 检查项

### A01 - Broken Access Control
- [ ] 认证检查在每个端点
- [ ] 最小权限原则
- [ ] 敏感端点额外验证
- [ ] CORS 配置正确

### A02 - Cryptographic Failures
- [ ] 敏感数据加密存储
- [ ] 使用强加密算法 (AES-256)
- [ ] 无硬编码密钥
- [ ] Key 管理安全

### A03 - Injection
- [ ] 参数化查询
- [ ] 输入验证
- [ ] ORM 使用正确
- [ ] 无 SQL 拼接

### A04 - Insecure Design
- [ ] 威胁建模完成
- [ ] 安全设计模式

### A05 - Security Misconfiguration
- [ ] 默认凭据已修改
- [ ] 错误消息不泄露信息
- [ ] 安全 Headers 配置

### A06 - Vulnerable Components
- [ ] 依赖版本已知
- [ ] 无已知漏洞依赖
- [ ] 持续监控新漏洞

### A07 - Auth Failures
- [ ] 密码强度要求
- [ ] 账户锁定机制
- [ ] Session 管理安全

### A08 - Data Integrity Failures
- [ ] HTTPS 强制
- [ ] 第三方请求验证

### A09 - Logging Failures
- [ ] 审计日志存在
- [ ] 无敏感数据日志
- [ ] 异常监控

### A10 - SSRF
- [ ] URL 验证
- [ ] 禁止本地 IP 访问

## 漏洞报告模板

```markdown
## SEC-[ID]: [漏洞名称]

**严重性**: Critical / High / Medium / Low
**类型**: CWE-[编号]
**位置**: [文件:行号]

### 描述
[详细描述]

### 影响
[影响分析]

### 修复建议
[修复步骤]
```

---

## 更新记录
| 日期 | 变更 |
|-----|------|
| 2026-04-16 | 初始版本 |
