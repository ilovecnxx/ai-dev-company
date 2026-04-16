#!/bin/bash
# install.sh - 安装 ai-dev-company Hooks
#
# 将 ai-dev-company 的 Hooks 合并到全局 hooks.json

set -e

CLAUDE_DIR="${HOME}/.claude"
HOOKS_FILE="${CLAUDE_DIR}/hooks/hooks.json"
HOOKS_SOURCE="./config/hooks.json"

echo "🔧 AI Dev Company - Hook 安装脚本"
echo ""

# 检查文件存在
if [ ! -f "$HOOKS_FILE" ]; then
  echo "❌ 错误: $HOOKS_FILE 不存在"
  exit 1
fi

if [ ! -f "$HOOKS_SOURCE" ]; then
  echo "❌ 错误: $HOOKS_SOURCE 不存在"
  exit 1
fi

# 备份
cp "$HOOKS_FILE" "${HOOKS_FILE}.backup.$(date +%Y%m%d%H%M%S)"
echo "✅ 已备份 $HOOKS_FILE"

# TODO: 合并 hooks
# 由于 JSON 合并复杂，建议手动编辑
echo ""
echo "📝 请手动将以下内容添加到 $HOOKS_FILE 的对应位置:"
echo ""
echo "PreToolUse 添加:"
grep -A5 '"matcher": "Bash"' config/hooks.json | head -10
echo ""
echo "PostToolUse 添加:"
grep -A5 '"matcher": "Edit' config/hooks.json | head -10
echo ""
echo "Stop 添加:"
grep -A5 '"matcher": "*"' config/hooks.json | tail -10

echo ""
echo "✅ 安装说明已给出"