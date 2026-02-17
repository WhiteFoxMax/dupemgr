// @ts-ignore
const fs = require('fs/promises');
// @ts-ignore
const path = require('path');
// @ts-ignore
const crypto = require('crypto');

// Interface definitions (TypeScript will handle the types)
interface FileInfo {
  name: string;
  path: string;
  size: number;
  modified: Date;
  type: 'file' | 'directory';
  hash?: string;
}

// @ts-ignore
async function scanDirectory(folderPath: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  async function walk(dir: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          files.push({
            name: entry.name,
            path: fullPath,
            size: 0,
            modified: new Date(),
            type: 'directory',
          });
          // Recursively scan subdirectories
          await walk(fullPath);
        } else {
          const stats = await fs.stat(fullPath);
          files.push({
            name: entry.name,
            path: fullPath,
            size: stats.size,
            modified: stats.mtime,
            type: 'file',
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
  }

  await walk(folderPath);
  return files;
}

async function computeFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  // @ts-ignore
  return crypto.createHash('sha256').update(content).digest('hex');
}

function getDuplicates(files: FileInfo[]): Map<string, FileInfo[]> {
  // Stub: Group by file size first as a simple duplicate detection
  const groups = new Map<string, FileInfo[]>();

  for (const file of files) {
    if (file.type === 'file') {
      const key = file.size.toString();
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(file);
    }
  }

  // Filter out groups with only one file
  const duplicates = new Map<string, FileInfo[]>();
  for (const [key, items] of groups.entries()) {
    if (items.length > 1) {
      duplicates.set(key, items);
    }
  }

  return duplicates;
}

module.exports = {
  scanDirectory,
  computeFileHash,
  getDuplicates,
};
