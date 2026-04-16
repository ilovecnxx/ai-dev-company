# GitHub 推送指南

## 当前状态

项目已初始化并完成首次提交，但尚未推送到 GitHub。

## 推送到 GitHub 的步骤

### 方式 1: GitHub CLI

```bash
# 认证
gh auth login

# 创建仓库并推送
cd ai-dev-company
gh repo create ai-dev-company --public --push
```

### 方式 2: 使用 HTTPS

```bash
# 添加 remote
git remote add origin https://github.com/YOUR_USERNAME/ai-dev-company.git

# 推送
git push -u origin main
```

### 方式 3: 使用 SSH

```bash
# 生成 SSH key (如果没有)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到 GitHub
# Settings → SSH and GPG keys → New SSH key

# 添加 remote
git remote add origin git@github.com:YOUR_USERNAME/ai-dev-company.git

# 推送
git push -u origin main
```

## 验证

```bash
git log --oneline -3
git remote -v
```