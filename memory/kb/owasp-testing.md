# OWASP 检测方法库

> 本文件记录 OWASP Top 10 具体检测方法和工具

## 索引
- [A01 Broken Access Control](#a01-broken-access-control)
- [A02 Cryptographic Failures](#a02-cryptographic-failures)
- [A03 Injection](#a03-injection)
- [A07 Auth Failures](#a07-auth-failures)

---

## A01 - Broken Access Control

### 检测方法
```bash
# 测试未授权访问
curl -X GET http://api.example.com/users/999
# 期望: 401 Unauthorized

# 测试越权访问
curl -H "Authorization: Bearer $USER_TOKEN" \
     http://api.example.com/users/1001
# 期望: 403 Forbidden (非本人数据)
```

### 检查清单
- [ ] 每个端点有认证检查
- [ ] 用户只能访问自己的数据
- [ ] 管理员端点有权限验证
- [ ] CORS 配置正确

---

## A02 - Cryptographic Failures

### 检测方法
```bash
# 检查硬编码密钥
grep -r "password\|secret\|api_key\|token" --include="*.py" .

# 检查敏感数据暴露
curl http://api.example.com/api/user/1
# 期望: 密码等敏感字段已加密或隐藏
```

### 检查清单
- [ ] 无硬编码密钥
- [ ] 密码 bcrypt 加密
- [ ] HTTPS 强制
- [ ] 敏感日志脱敏

---

## A03 - Injection

### 检测方法
```bash
# SQL 注入测试
curl "http://api.example.com/search?q=' OR 1=1--"
# 期望: 参数化查询，不执行注入

# XSS 测试
curl -d "name=<script>alert(1)</script>" http://api.example.com/submit
# 期望: 输入被转义
```

### 检查清单
- [ ] 参数化查询
- [ ] ORM 使用正确
- [ ] 输入验证
- [ ] 输出编码

---

## A07 - Auth Failures

### 检测方法
```bash
# 弱密码测试
# 尝试 admin/123456
# 期望: 拒绝

# 暴力破解防护
# 连续 5 次错误登录
# 期望: 账户锁定或延迟响应

# Session 安全
# 检查 Set-Cookie
# httponly; secure; samesite=strict
```

### 检查清单
- [ ] 密码强度验证
- [ ] 账户锁定机制
- [ ] Session HttpOnly
- [ ] Session Timeout

---

## 安全测试命令

```bash
# 依赖安全扫描
pip-audit                          # Python
npm audit                          # Node.js

# OWASP ZAP 扫描
docker run -v $(pwd):/workspace owasp/zap2docker-stable \
  zap-baseline.py -t http://localhost:3000
```

---

## 更新记录
| 日期 | 变更 |
|-----|------|
| 2026-04-16 | 初始版本 (头脑风暴补充) |
