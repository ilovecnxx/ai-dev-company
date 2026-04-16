#!/bin/bash
# start.sh - AI DEV COMPANY 启动脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
cat << 'EOF'
    ___    ____   ____  _______    __
   /   |  /  _/  / __ \/ ____/ |  / /
  / /| |  / /   / / / / __/  | | / /
 / ___ |_/ /   / /_/ / /___  | |/ /
/_/  |_|/___/  /_____/_____/  |___/

  ___ ___  __  __ ___  _   _  ___   __
 / __/ _ \|  \/  | _ \/_\ | \| \ \ / /
| (_| (_) | |\/| |  _/ _ \| .` |\ V /
 \___\___/|_|  |_|_|/_/ \_\_|\_| |_|
EOF

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}        欢迎使用 AI DEV COMPANY - 虚拟软件公司工作流${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 项目说明：${NC}"
echo "   基于 Claude Code 多 Agent 系统，构建虚拟软件开发公司"
echo "   你扮演'甲方'，通过自然语言下达需求，AI 团队完成全流程开发"
echo ""
echo -e "${YELLOW}🎯 核心功能：${NC}"
echo "   • 需求分析 → 架构设计 → 代码实现 → 测试验证 → 安全审查"
echo "   • 全程自动化执行，多 Agent 协作，质量门禁把关"
echo ""
echo -e "${YELLOW}🚀 快速开始：${NC}"
echo "   输入 /autopilot + 你的需求 即可启动"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📝 示例任务（复制以下任一命令体验）：${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}1. REST API 项目${NC}"
echo -e "   ${YELLOW}/autopilot build me a REST API for a bookstore inventory with CRUD using TypeScript${NC}"
echo ""
echo -e "${GREEN}2. 用户认证系统${NC}"
echo -e "   ${YELLOW}/autopilot create a user registration and login system with JWT tokens${NC}"
echo ""
echo -e "${GREEN}3. 博客系统${NC}"
echo -e "   ${YELLOW}/autopilot build me a blog system with markdown support and comments${NC}"
echo ""
echo -e "${GREEN}4. CLI 工具${NC}"
echo -e "   ${YELLOW}/autopilot make me a CLI tool for tracking daily habits with streak counting${NC}"
echo ""
echo -e "${GREEN}5. 微服务架构${NC}"
echo -e "   ${YELLOW}/autopilot design a microservices system with user service, order service, and payment service${NC}"
echo ""
echo -e "${GREEN}6. 在线商店${NC}"
echo -e "   ${YELLOW}/autopilot create an online store with product catalog, shopping cart, and checkout${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}💡 提示：${NC}"
echo "   • 描述越具体，生成效果越好"
echo "   • 可以指定技术栈：TypeScript, Python, Go, React, Vue..."
echo "   • 可以指定数据库：PostgreSQL, MongoDB, Redis..."
echo "   • 使用 /cancel 可随时取消任务"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${RED}请输入你的需求（例如：build me a todo app with auth）${NC}"
echo ""