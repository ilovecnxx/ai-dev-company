#!/usr/bin/env node
/**
 * post:dev-quality-report.js
 * PostToolUse Hook: 开发质量报告
 *
 * 触发条件: Edit/Write 操作后
 * 作用: 收集编辑的文件，记录质量事件，Stop 时生成报告
 */

const fs = require('fs');
const path = require('path');

// 质量事件存储文件
const STATE_FILE = '.omc/state/dev-quality-state.json';
const QUALITY_ISSUES_FILE = '.omc/state/dev-quality-issues.json';

// 初始化状态
function initState() {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify({
      editedFiles: [],
      lastUpdated: new Date().toISOString(),
      sessionId: process.env.CLAUDE_SESSION_ID || 'unknown'
    }, null, 2));
  }
}

// 记录编辑的文件
function recordEdit(filePath) {
  initState();
  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

  if (!state.editedFiles.includes(filePath)) {
    state.editedFiles.push(filePath);
    state.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  }
}

// 检查代码质量问题
function checkQualityIssues(filePath) {
  const issues = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath);

    if (ext === '.js' || ext === '.ts' || ext === '.tsx' || ext === '.jsx') {
      // 检查 console.log
      if (/console\.log\(/.test(content)) {
        issues.push({ type: 'console.log', severity: 'warning', file: filePath });
      }

      // 检查 TODO/FIXME/HACK
      const todoMatches = content.match(/\b(TODO|FIXME|HACK|XXX)\b/g);
      if (todoMatches) {
        issues.push({ type: 'todo-comment', severity: 'info', count: todoMatches.length, file: filePath });
      }

      // 检查 debugger
      if (/debugger/.test(content)) {
        issues.push({ type: 'debugger', severity: 'error', file: filePath });
      }

      // 检查 catch 吞掉错误
      if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(content)) {
        issues.push({ type: 'empty-catch', severity: 'warning', file: filePath });
      }
    }

    // 保存问题
    if (issues.length > 0) {
      saveIssues(issues);
    }
  } catch (e) {
    // 忽略读取错误
  }

  return issues;
}

// 保存问题到文件
function saveIssues(newIssues) {
  const dir = path.dirname(QUALITY_ISSUES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let existing = [];
  if (fs.existsSync(QUALITY_ISSUES_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(QUALITY_ISSUES_FILE, 'utf8'));
    } catch (e) {}
  }

  fs.writeFileSync(QUALITY_ISSUES_FILE, JSON.stringify([...existing, ...newIssues], null, 2));
}

// 生成质量报告
function generateReport() {
  const statePath = STATE_FILE;
  const issuesPath = QUALITY_ISSUES_FILE;

  console.log('\n📊 [Hook] 开发质量报告\n');

  if (fs.existsSync(statePath)) {
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    console.log(`   编辑文件数: ${state.editedFiles.length}`);
    if (state.editedFiles.length > 0) {
      console.log('   文件列表:');
      state.editedFiles.slice(-5).forEach(f => console.log(`     - ${f}`));
      if (state.editedFiles.length > 5) {
        console.log(`     ... 还有 ${state.editedFiles.length - 5} 个文件`);
      }
    }
  }

  if (fs.existsSync(issuesPath)) {
    const issues = JSON.parse(fs.readFileSync(issuesPath, 'utf8'));
    console.log(`\n   发现问题: ${issues.length}`);

    const byType = {};
    issues.forEach(issue => {
      byType[issue.type] = (byType[issue.type] || 0) + 1;
    });

    Object.entries(byType).forEach(([type, count]) => {
      console.log(`     - ${type}: ${count}`);
    });
  }

  console.log('');
}

function match(input) {
  // 匹配 Edit 或 Write 操作
  const tool = typeof input === 'string' ? input : (input.tool || '');
  return tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit';
}

function run(input) {
  const filePath = typeof input === 'string' ? input : (input.file_path || input.filePath || '');

  if (!filePath) {
    return { recorded: false };
  }

  // 记录编辑
  recordEdit(filePath);

  // 检查质量问题
  const issues = checkQualityIssues(filePath);

  return {
    recorded: true,
    file: filePath,
    issues: issues.length,
    issuesSummary: issues.reduce((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {})
  };
}

// 导出生成报告函数供 Stop Hook 调用
run.generateReport = generateReport;

module.exports = { match, run, generateReport };