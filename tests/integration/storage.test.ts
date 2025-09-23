import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LocalStorageService } from '../../backend/src/services/storage';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('LocalStorageService', () => {
  let storageService: LocalStorageService;
  const testUploadDir = './test-uploads';

  beforeEach(() => {
    storageService = new LocalStorageService(testUploadDir, 'http://localhost:4101/files');
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testUploadDir, { recursive: true });
    } catch {
      // Directory might not exist, ignore
    }
  });

  describe('store', () => {
    it('should store a file and return relative path', async () => {
      const fileContent = Buffer.from('test file content');
      const filename = 'test-document.pdf';
      const metadata = { uploadedBy: 'user123', purpose: 'payment-proof' };

      const relativePath = await storageService.store(fileContent, filename, metadata);

      // Verify path pattern (YYYY/MM/filename_hash.ext)
      expect(relativePath).toMatch(/^\d{4}\/\d{2}\/test-document_[a-f0-9]{16}\.pdf$/);

      // Verify file exists
      const fullPath = path.join(testUploadDir, relativePath);
      const storedContent = await fs.readFile(fullPath);
      expect(storedContent).toEqual(fileContent);

      // Verify metadata exists
      const metadataPath = `${fullPath}.meta.json`;
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      const parsedMetadata = JSON.parse(metadataContent);
      
      expect(parsedMetadata.uploadedBy).toBe('user123');
      expect(parsedMetadata.purpose).toBe('payment-proof');
      expect(parsedMetadata.originalFilename).toBe(filename);
      expect(parsedMetadata.size).toBe(fileContent.length);
      expect(parsedMetadata.storedAt).toBeTruthy();
    });

    it('should handle files with same name but different content', async () => {
      const file1 = Buffer.from('content 1');
      const file2 = Buffer.from('content 2');
      const filename = 'same-name.pdf';

      const path1 = await storageService.store(file1, filename);
      const path2 = await storageService.store(file2, filename);

      // Paths should be different due to content hash
      expect(path1).not.toBe(path2);
      
      // Both files should exist
      const fullPath1 = path.join(testUploadDir, path1);
      const fullPath2 = path.join(testUploadDir, path2);
      
      expect(await fs.readFile(fullPath1)).toEqual(file1);
      expect(await fs.readFile(fullPath2)).toEqual(file2);
    });

    it('should create directory structure automatically', async () => {
      const fileContent = Buffer.from('test');
      const filename = 'test.pdf';

      const relativePath = await storageService.store(fileContent, filename);
      
      // Should create nested directory structure
      const fullPath = path.join(testUploadDir, relativePath);
      const dirExists = await fs.access(path.dirname(fullPath)).then(() => true).catch(() => false);
      expect(dirExists).toBe(true);
    });
  });

  describe('generateSignedUrl', () => {
    it('should generate valid signed URL with default expiry', async () => {
      const filepath = '2024/01/document_abc123.pdf';
      
      const signedUrl = await storageService.generateSignedUrl(filepath);
      
      expect(signedUrl).toMatch(/^http:\/\/localhost:4101\/files\/2024\/01\/document_abc123\.pdf\?expires=\d+&signature=[a-f0-9]{16}$/);
      
      // Verify URL components
      const url = new URL(signedUrl);
      const expires = parseInt(url.searchParams.get('expires') || '0');
      const signature = url.searchParams.get('signature');
      
      expect(expires).toBeGreaterThan(Math.floor(Date.now() / 1000));
      expect(expires).toBeLessThanOrEqual(Math.floor(Date.now() / 1000) + 3600);
      expect(signature).toHaveLength(16);
    });

    it('should generate URL with custom expiry', async () => {
      const filepath = '2024/01/document.pdf';
      const customExpiry = 7200; // 2 hours
      
      const signedUrl = await storageService.generateSignedUrl(filepath, customExpiry);
      
      const url = new URL(signedUrl);
      const expires = parseInt(url.searchParams.get('expires') || '0');
      
      expect(expires).toBeGreaterThan(Math.floor(Date.now() / 1000) + 7199);
      expect(expires).toBeLessThanOrEqual(Math.floor(Date.now() / 1000) + 7200);
    });

    it('should generate different signatures for different files', async () => {
      const url1 = await storageService.generateSignedUrl('file1.pdf');
      const url2 = await storageService.generateSignedUrl('file2.pdf');
      
      const sig1 = new URL(url1).searchParams.get('signature');
      const sig2 = new URL(url2).searchParams.get('signature');
      
      expect(sig1).not.toBe(sig2);
    });
  });

  describe('delete', () => {
    it('should delete file and metadata', async () => {
      const fileContent = Buffer.from('to be deleted');
      const filename = 'delete-me.pdf';
      const metadata = { test: 'data' };

      // Store file first
      const relativePath = await storageService.store(fileContent, filename, metadata);
      const fullPath = path.join(testUploadDir, relativePath);
      const metadataPath = `${fullPath}.meta.json`;

      // Verify files exist
      expect(await fs.access(fullPath).then(() => true).catch(() => false)).toBe(true);
      expect(await fs.access(metadataPath).then(() => true).catch(() => false)).toBe(true);

      // Delete
      await storageService.delete(relativePath);

      // Verify files are deleted
      expect(await fs.access(fullPath).then(() => true).catch(() => false)).toBe(false);
      expect(await fs.access(metadataPath).then(() => true).catch(() => false)).toBe(false);
    });

    it('should throw error for non-existent file', async () => {
      await expect(storageService.delete('non-existent/file.pdf'))
        .rejects
        .toThrow('Failed to delete file');
    });
  });

  describe('verifySignedUrl', () => {
    it('should verify valid signed URL', async () => {
      const filepath = '2024/01/valid.pdf';
      const signedUrl = await storageService.generateSignedUrl(filepath);
      
      const isValid = LocalStorageService.verifySignedUrl(signedUrl);
      expect(isValid).toBe(true);
    });

    it('should reject expired URL', () => {
      const expiredUrl = 'http://localhost:4101/files/test.pdf?expires=1000000000&signature=abcd1234';
      
      const isValid = LocalStorageService.verifySignedUrl(expiredUrl);
      expect(isValid).toBe(false);
    });

    it('should reject URL with invalid signature', () => {
      const futureExpiry = Math.floor(Date.now() / 1000) + 3600;
      const invalidUrl = `http://localhost:4101/files/test.pdf?expires=${futureExpiry}&signature=invalid`;
      
      const isValid = LocalStorageService.verifySignedUrl(invalidUrl);
      expect(isValid).toBe(false);
    });

    it('should reject malformed URL', () => {
      const malformedUrl = 'not-a-url';
      
      const isValid = LocalStorageService.verifySignedUrl(malformedUrl);
      expect(isValid).toBe(false);
    });
  });

  describe('path patterns', () => {
    it('should organize files by year/month structure', async () => {
      const fileContent = Buffer.from('path test');
      const filename = 'path-test.jpg';

      const relativePath = await storageService.store(fileContent, filename);
      
      // Should match YYYY/MM/filename_hash.ext pattern
      const pathParts = relativePath.split('/');
      expect(pathParts).toHaveLength(3);
      expect(pathParts[0]).toMatch(/^\d{4}$/); // Year
      expect(pathParts[1]).toMatch(/^(0[1-9]|1[0-2])$/); // Month (01-12)
      expect(pathParts[2]).toMatch(/^path-test_[a-f0-9]{16}\.jpg$/); // filename_hash.ext
    });

    it('should preserve file extensions correctly', async () => {
      const testCases = [
        { filename: 'document.pdf', expectedExt: '.pdf' },
        { filename: 'image.PNG', expectedExt: '.PNG' },
        { filename: 'data.json', expectedExt: '.json' },
        { filename: 'no-extension', expectedExt: '' }
      ];

      for (const testCase of testCases) {
        const fileContent = Buffer.from('test');
        const relativePath = await storageService.store(fileContent, testCase.filename);
        
        expect(relativePath).toMatch(new RegExp(`${testCase.expectedExt.replace('.', '\\.')}$`));
      }
    });
  });
});