#!/bin/bash
# session-start-logo.sh
# 会话启动时自动打印 Logo

LOG_FILE="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects/ai-dev-company/logo.txt"

if [ -f "$LOG_FILE" ]; then
  echo ""
  cat "$LOG_FILE"
  echo ""
fi