// @ts-ignore
const fileService = require('../services/fileService');

describe('FileService', () => {
  describe('getDuplicates', () => {
    it('should return empty map for files with unique sizes', () => {
      // @ts-ignore
      const files = [
        {
          name: 'file1.txt',
          path: '/path/file1.txt',
          size: 100,
          modified: new Date(),
          type: 'file',
        },
        {
          name: 'file2.txt',
          path: '/path/file2.txt',
          size: 200,
          modified: new Date(),
          type: 'file',
        },
      ];

      // @ts-ignore
      const duplicates = fileService.getDuplicates(files);
      expect(duplicates.size).toBe(0);
    });

    it('should group files with same size', () => {
      // @ts-ignore
      const files = [
        {
          name: 'file1.txt',
          path: '/path/file1.txt',
          size: 100,
          modified: new Date(),
          type: 'file',
        },
        {
          name: 'file2.txt',
          path: '/path/file2.txt',
          size: 100,
          modified: new Date(),
          type: 'file',
        },
      ];

      // @ts-ignore
      const duplicates = fileService.getDuplicates(files);
      expect(duplicates.size).toBe(1);
      expect(duplicates.get('100')).toHaveLength(2);
    });

    it('should ignore directories', () => {
      // @ts-ignore
      const files = [
        {
          name: 'dir1',
          path: '/path/dir1',
          size: 0,
          modified: new Date(),
          type: 'directory',
        },
        {
          name: 'dir2',
          path: '/path/dir2',
          size: 0,
          modified: new Date(),
          type: 'directory',
        },
      ];

      // @ts-ignore
      const duplicates = fileService.getDuplicates(files);
      expect(duplicates.size).toBe(0);
    });

    it('should handle mixed files and directories', () => {
      // @ts-ignore
      const files = [
        {
          name: 'dir1',
          path: '/path/dir1',
          size: 0,
          modified: new Date(),
          type: 'directory',
        },
        {
          name: 'file1.txt',
          path: '/path/file1.txt',
          size: 100,
          modified: new Date(),
          type: 'file',
        },
        {
          name: 'file2.txt',
          path: '/path/file2.txt',
          size: 100,
          modified: new Date(),
          type: 'file',
        },
      ];

      // @ts-ignore
      const duplicates = fileService.getDuplicates(files);
      expect(duplicates.size).toBe(1);
      expect(duplicates.get('100')).toHaveLength(2);
    });
  });
});
