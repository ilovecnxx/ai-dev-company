#!/usr/bin/env node
/**
 * pre:dev-workflow-check.js
 * PreToolUse Hook: 开发工作流检查
 *
 * 触发条件: Bash 命令包含 build/test/dev 等开发命令
 * 作用: 检查前置条件是否满足 (spec.md, plan.md 是否存在)
 */

const fs = require('fs');
const path = require('path');

// 检查的命令模式
const BLOCKED_PATTERNS = [
  { pattern: /npm run (build|test|dev)/, name: 'npm build/test/dev' },
  { pattern: /pnpm (build|test|dev)/, name: 'pnpm build/test/dev' },
  { pattern: /yarn (build|test|dev)/, name: 'yarn build/test/dev' },
  { pattern: /make (build|test)/, name: 'make build/test' },
  { pattern: /docker (build|run)/, name: 'docker build/run' },
];

// 前置条件文件
const REQUIRED_FILES = [
  '.omc/autopilot/spec.md',
  '.omc/plans/autopilot-impl.md',
];

function checkPreconditions() {
  const missing = [];
  for (const file of REQUIRED_FILES) {
    if (!fs.existsSync(file)) {
      missing.push(file);
    }
  }
  return missing;
}

function match(input) {
  const command = typeof input === 'string' ? input : (input.command || '');
  return BLOCKED_PATTERNS.some(p => p.pattern.test(command));
}

function run(input) {
  const command = typeof input === 'string' ? input : (input.command || '');

  // 检查是否匹配需要拦截的命令
  const matched = BLOCKED_PATTERNS.find(p => p.pattern.test(command));
  if (!matched) {
    return { allowed: true };
  }

  // 检查前置条件
  const missing = checkPreconditions();
  if (missing.length > 0) {
    console.error('\n🚫 [Hook] 开发工作流检查 - 拦截');
    console.error(`   命令: ${command}`);
    console.error('   原因: 缺少前置文件');
    missing.forEach(f => console.error(`   - ${f}`));
    console.error('\n   请先通过 autopilot 完成需求分析和计划阶段');
    console.error('   或手动创建这些文件后再试\n');
    return { allowed: false, reason: 'missing-preconditions', missing };
  }

  console.log(`\n✅ [Hook] 开发工作流检查 - 通过`);
  console.log(`   命令: ${matched.name}`);
  return { allowed: true };
}

// 如果直接运行此脚本（测试用）
if (require.main === module) {
  const testCmd = process.argv[2] || 'npm run build';
  const result = run(testCmd);
  console.log('Result:', JSON.stringify(result, null, 2));
  process.exit(result.allowed ? 0 : 1);
}

module.exports = { match, run };