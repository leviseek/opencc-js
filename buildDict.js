import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '3rd', 'OpenCC', 'data', 'dictionary');
const outDir = path.join(__dirname, 'data');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) return [];
  return content.split(/\r?\n/).filter(Boolean);
}

function writeLines(filePath, lines) {
  const data = lines.join('\n');
  fs.writeFileSync(filePath, data ? data + '\n' : '');
}

function buildReverse(lines) {
  const map = new Map();
  for (const line of lines) {
    const [rawKey, rawValues] = line.split('\t');
    if (!rawKey || !rawValues) continue;
    const key = rawKey.trim();
    const values = rawValues.trim().split(/\s+/).filter(Boolean);
    for (const value of values) {
      if (!map.has(value)) map.set(value, []);
      const arr = map.get(value);
      if (!arr.includes(key)) arr.push(key);
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([value, keys]) => `${value}\t${keys.join(' ')}`);
}

function isReverseName(base) {
  return /Rev($|Phrases$)/.test(base);
}

function mergeDictionaries(bases) {
  const allLines = [];
  for (const base of bases) {
    const srcPath = path.join(srcDir, `${base}.txt`);
    const lines = readLines(srcPath);
    allLines.push(...lines);
  }
  // 合并后重新排序去重（key 相同取第一个）
  const map = new Map();
  for (const line of allLines) {
    const [rawKey, rawValues] = line.split('\t');
    if (!rawKey || !rawValues) continue;
    const key = rawKey.trim();
    if (!map.has(key)) map.set(key, rawValues.trim());
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}\t${v}`);
}

function main() {
  ensureDir(outDir);
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.txt'));
  const summary = [];

  // 1. 复制所有原始词典文件
  for (const file of files) {
    const base = path.basename(file, '.txt');
    const srcPath = path.join(srcDir, file);
    const forwardLines = readLines(srcPath);
    const outForward = path.join(outDir, `${base}.txt`);
    writeLines(outForward, forwardLines);
    summary.push(`write ${base}.txt (${forwardLines.length} lines)`);

    if (!isReverseName(base)) {
      const reversed = buildReverse(forwardLines);
      const outReverse = path.join(outDir, `${base}Rev.txt`);
      writeLines(outReverse, reversed);
      summary.push(`write ${base}Rev.txt (${reversed.length} lines)`);
    }
  }

  // 2. 生成 TWPhrases（合并 TWPhrasesIT, TWPhrasesName, TWPhrasesOther）
  const twPhrasesLines = mergeDictionaries(['TWPhrasesIT', 'TWPhrasesName', 'TWPhrasesOther']);
  const outTWPhrases = path.join(outDir, 'TWPhrases.txt');
  writeLines(outTWPhrases, twPhrasesLines);
  summary.push(`write TWPhrases.txt (${twPhrasesLines.length} lines, merged from IT+Name+Other)`);

  // 3. 生成 TWPhrasesRev（反转 TWPhrases）
  const twPhrasesRev = buildReverse(twPhrasesLines);
  const outTWPhrasesRev = path.join(outDir, 'TWPhrasesRev.txt');
  writeLines(outTWPhrasesRev, twPhrasesRev);
  summary.push(`write TWPhrasesRev.txt (${twPhrasesRev.length} lines)`);

  console.log(`Finished building dictionaries to ${outDir}`);
  summary.forEach((msg) => console.log(msg));
}

main();
