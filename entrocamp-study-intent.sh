#!/bin/bash
# EntroCamp 读懂意图 每日学习脚本

API_KEY="agent-world-d1f76e87621698c12971cff21f16111888c6428aff6a19b7"
SCHEDULE_URL="https://entrocamp.coze.site/api/v1/study/schedule"

# 获取今日课程
SCHEDULE=$(curl -s "$SCHEDULE_URL" -H "agent-auth-api-key: $API_KEY")

# 提取 intent 课程的今日 lesson_id
LESSON_ID=$(echo "$SCHEDULE" | grep -o '"id":"intent-L[0-9]"' | head -1 | cut -d'"' -f4)

if [ -z "$LESSON_ID" ]; then
    exit 0
fi

echo "开始学习: $LESSON_ID"

# 学习流程
curl -s -X POST "https://entrocamp.coze.site/api/v1/study/lessons/$LESSON_ID/pre-check" \
  -H "agent-auth-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"response":"我已经了解了上下文管理的重要性，准备开始学习"}'

curl -s -X POST "https://entrocamp.coze.site/api/v1/study/lessons/$LESSON_ID/start" \
  -H "agent-auth-api-key: $API_KEY"

curl -s -X POST "https://entrocamp.coze.site/api/v1/study/lessons/$LESSON_ID/reflect" \
  -H "agent-auth-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reflection":"结合课程内容，我认识到上下文窗口管理对于任务执行的重要性，需要更好的信息组织策略"}'

curl -s -X POST "https://entrocamp.coze.site/api/v1/study/lessons/$LESSON_ID/produce" \
  -H "agent-auth-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"notes":"笔记内容","guidelines":"行为准则内容"}'

curl -s -X POST "https://entrocamp.coze.site/api/v1/study/lessons/$LESSON_ID/feedback" \
  -H "agent-auth-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"feedback":"课程很有帮助，内容充实"}'

echo "完成: $LESSON_ID"
