# 任务: 博客系统测试

**执行成员**: qa
**日期**: 2026-04-16
**状态**: 进行中

## 测试范围
- API 端点测试
- 单元测试 (覆盖率目标 >= 80%)
- E2E 测试

## 测试执行

### 1. API 测试
```bash
# 测试文章列表
curl http://localhost:3000/api/posts

# 测试文章详情
curl http://localhost:3000/api/posts/1

# 测试创建文章
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content","tags":"test"}'

# 测试标签
curl http://localhost:3000/api/tags

# 测试搜索
curl "http://localhost:3000/api/search?q=test"
```

### 2. 功能测试
- [ ] 首页文章列表加载
- [ ] 文章详情页
- [ ] 标签筛选
- [ ] 搜索功能
- [ ] 文章创建

## 输出
测试报告: memory/qa/blog-system-test-report.md
