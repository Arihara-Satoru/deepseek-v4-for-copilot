#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const REMOVE_START_MARKER = '<!-- marketplace-readme:remove-start -->';
const REMOVE_END_MARKER = '<!-- marketplace-readme:remove-end -->';

/**
 * 读取命令行参数并返回源文件和输出文件路径。
 * @returns {{ sourcePath: string; outputPath: string }} 返回源文件路径和输出文件路径。
 */
function parseCliArgs() {
  const [, , inputArg = 'README.md', outputArg = 'dist/README.marketplace.md'] = process.argv;

  return {
    sourcePath: inputArg,
    outputPath: outputArg,
  };
}

/**
 * 校验并生成 Marketplace 版本的 README 内容。
 * 如果文档中不存在裁剪标记，则保持原文输出，兼容当前仓库的 README 结构。
 * @param {string} sourceText README 原始内容。
 * @returns {string} 处理后的 README 内容。
 */
function buildMarketplaceReadme(sourceText) {
  const normalizedText = sourceText.replace(/\r\n/g, '\n');
  const lines = normalizedText.split('\n');
  const outputLines = [];
  let removing = false;
  let removedBlockCount = 0;

  for (const line of lines) {
    if (line.includes(REMOVE_START_MARKER)) {
      if (removing) {
        throw new Error('检测到嵌套的 marketplace-readme 删除区块。');
      }

      removing = true;
      removedBlockCount += 1;
      continue;
    }

    if (line.includes(REMOVE_END_MARKER)) {
      if (!removing) {
        throw new Error('检测到未匹配的 marketplace-readme 删除结束标记。');
      }

      removing = false;
      continue;
    }

    if (!removing) {
      outputLines.push(line);
    }
  }

  if (removing) {
    throw new Error('marketplace-readme 删除区块没有正确闭合。');
  }

  if (removedBlockCount > 1) {
    throw new Error(`最多只允许 1 个 marketplace-readme 删除区块，当前检测到 ${removedBlockCount} 个。`);
  }

  return outputLines.join('\n');
}

/**
 * 确保输出目录存在，并将处理后的内容写入目标文件。
 * @param {string} outputPath 输出文件路径。
 * @param {string} content 要写入的文件内容。
 * @returns {void} 无返回值。
 */
function writeOutputFile(outputPath, content) {
  const outputDirectory = path.dirname(outputPath);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
}

/**
 * 脚本入口：读取 README、执行裁剪并写入 Marketplace 专用文件。
 * @returns {void} 无返回值。
 */
function main() {
  const { sourcePath, outputPath } = parseCliArgs();
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const marketplaceReadme = buildMarketplaceReadme(sourceText);
  writeOutputFile(outputPath, marketplaceReadme);
}

main();
