#!/usr/bin/env node
/**
 * stop:final-verdict.js
 * Stop Hook: 最终交付判定
 *
 * 作用: 在会话结束时，综合质量检查结果，给出最终判定
 */

const fs = require('fs');
const path = require('path');

// 状态文件路径
const STATE_DIR = '.omc/state';
const QUALITY_STATE_FILE = `${STATE_DIR}/dev-quality-state.json`;
const QUALITY_ISSUES_FILE = `${STATE_DIR}/dev-quality-issues.json`;
const AUTOPILOT_STATE_FILE = `${STATE_DIR}/autopilot-state.json`;

// 判定标准
const THRESHOLDS = {
  maxConsoleLogs: 3,
  maxTodos: 10,
  maxEmptyCatch: 2,
};

// 获取文件数量
function countFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file.isDirectory()) {
      count += countFiles(fullPath, extensions);
    } else if (extensions.includes(path.extname(file.name))) {
      count++;
    }
  }

  return count;
}

// 分析问题
function analyzeIssues(issues) {
  const summary = {
    consoleLogs: 0,
    todos: 0,
    debuggers: 0,
    emptyCatch: 0,
    critical: [],
    warnings: [],
  };

  issues.forEach(issue => {
    switch (issue.type) {
      case 'console.log':
        summary.consoleLogs++;
        summary.warnings.push(`${issue.file}: console.log`);
        break;
      case 'todo-comment':
        summary.todos += issue.count || 1;
        break;
      case 'debugger':
        summary.debuggers++;
        summary.critical.push(`${issue.file}: debugger`);
        break;
      case 'empty-catch':
        summary.emptyCatch++;
        summary.warnings.push(`${issue.file}: empty catch block`);
        break;
    }
  });

  return summary;
}

// 生成判定
function generateVerdict() {
  console.log('\n🎯 [Hook] 最终交付判定\n');

  let verdict = '✅ 通过';
  let blocks = [];

  // 检查质量状态
  if (fs.existsSync(QUALITY_ISSUES_FILE)) {
    const issues = JSON.parse(fs.readFileSync(QUALITY_ISSUES_FILE, 'utf8'));
    const analysis = analyzeIssues(issues);

    console.log(`   代码问题分析:`);
    console.log(`     - console.log: ${analysis.consoleLogs} (阈值: ${THRESHOLDS.maxConsoleLogs})`);
    console.log(`     - TODO/FIXME: ${analysis.todos} (阈值: ${THRESHOLDS.maxTodos})`);
    console.log(`     - debugger: ${analysis.debuggers} (阈值: 0)`);
    console.log(`     - empty catch: ${analysis.emptyCatch} (阈值: ${THRESHOLDS.maxEmptyCatch})`);

    // 判定
    if (analysis.debuggers > 0) {
      verdict = '❌ 阻塞';
      blocks.push('debugger 存在');
    }

    if (analysis.consoleLogs > THRESHOLDS.maxConsoleLogs) {
      verdict = verdict === '✅ 通过' ? '⚠️ 警告' : verdict;
      console.log(`     ⚠️ console.log 超出阈值`);
    }

    if (analysis.emptyCatch > THRESHOLDS.maxEmptyCatch) {
      verdict = verdict === '✅ 通过' ? '⚠️ 警告' : verdict;
      console.log(`     ⚠️ empty catch 超出阈值`);
    }

    if (analysis.critical.length > 0) {
      console.log('\n   🚨 关键问题:');
      analysis.critical.forEach(c => console.log(`     - ${c}`));
    }

    if (analysis.warnings.length > 0) {
      console.log('\n   ⚠️ 警告:');
      analysis.warnings.slice(0, 5).forEach(w => console.log(`     - ${w}`));
      if (analysis.warnings.length > 5) {
        console.log(`     ... 还有 ${analysis.warnings.length - 5} 个警告`);
      }
    }
  } else {
    console.log('   (无质量数据 - 可能未执行开发任务)');
  }

  // 检查 autopilot 状态
  if (fs.existsSync(AUTOPILOT_STATE_FILE)) {
    console.log('\n   📋 Autopilot 状态:');
    const state = JSON.parse(fs.readFileSync(AUTOPILOT_STATE_FILE, 'utf8'));
    console.log(`     - Phase: ${state.currentPhase || 'unknown'}`);
    console.log(`     - QA 循环: ${state.qaCycles || 0}`);
  }

  console.log(`\n   最终判定: ${verdict}`);

  if (blocks.length > 0) {
    console.log('   阻塞原因:');
    blocks.forEach(b => console.log(`     - ${b}`));
  }

  console.log('');

  return { verdict, blocks, analysis };
}

// 清理状态文件
function cleanup() {
  const files = [QUALITY_STATE_FILE, QUALITY_ISSUES_FILE];
  files.forEach(f => {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f);
    }
  });
}

function match() {
  return true; // 匹配所有 Stop 事件
}

function run(input) {
  const result = generateVerdict();

  // 如果通过了判定，清理状态文件
  if (result.verdict === '✅ 通过') {
    cleanup();
  }

  return result;
}

// 直接运行用于测试
if (require.main === module) {
  const result = run({});
  process.exit(result.verdict.startsWith('❌') ? 1 : 0);
}

module.exports = { match, run, generateVerdict };