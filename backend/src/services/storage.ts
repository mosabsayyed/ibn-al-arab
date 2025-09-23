import * as fs from 'fs/promises';
import * as path from 'path';
import { createHash } from 'crypto';

export interface StorageService {
  store(file: Buffer, filename: string, metadata?: Record<string, string>): Promise<string>;
  generateSignedUrl(filepath: string, expiresInSeconds?: number): Promise<string>;
  delete(filepath: string): Promise<void>;
}

export class LocalStorageService implements StorageService {
  private readonly basePath: string;
  private readonly baseUrl: string;

  constructor(basePath: string = './uploads', baseUrl: string = 'http://localhost:4101/files') {
    this.basePath = path.resolve(basePath);
    this.baseUrl = baseUrl;
  }

  async store(file: Buffer, filename: string, metadata?: Record<string, string>): Promise<string> {
    // Ensure uploads directory exists
    await fs.mkdir(this.basePath, { recursive: true });

    // Generate secure file path with hash to avoid collisions
    const hash = createHash('sha256').update(file).digest('hex').substring(0, 16);
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    const secureFilename = `${basename}_${hash}${ext}`;
    
    // Store in organized directory structure (by date)
    const now = new Date();
    const dateDir = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const relativePath = `${dateDir}/${secureFilename}`;
    const fullPath = path.join(this.basePath, relativePath);

    // Ensure subdirectory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file);

    // Store metadata alongside if provided
    if (metadata) {
      const metadataPath = `${fullPath}.meta.json`;
      await fs.writeFile(metadataPath, JSON.stringify({
        ...metadata,
        originalFilename: filename,
        storedAt: now.toISOString(),
        size: file.length
      }));
    }

    return relativePath;
  }

  async generateSignedUrl(filepath: string, expiresInSeconds: number = 3600): Promise<string> {
    // For local development, generate a simple signed URL with expiry
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const signature = createHash('sha256')
      .update(`${filepath}:${expires}:${process.env.STORAGE_SECRET || 'dev-secret'}`)
      .digest('hex')
      .substring(0, 16);
    
    return `${this.baseUrl}/${filepath}?expires=${expires}&signature=${signature}`;
  }

  async delete(filepath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filepath);
    try {
      await fs.unlink(fullPath);
      // Also delete metadata if it exists
      const metadataPath = `${fullPath}.meta.json`;
      try {
        await fs.unlink(metadataPath);
      } catch {
        // Metadata file might not exist, ignore
      }
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  // Utility method to verify signed URLs (for middleware)
  static verifySignedUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const filepath = urlObj.pathname.replace('/files/', '');
      const expires = parseInt(urlObj.searchParams.get('expires') || '0');
      const providedSignature = urlObj.searchParams.get('signature');

      if (!providedSignature || expires < Math.floor(Date.now() / 1000)) {
        return false;
      }

      const expectedSignature = createHash('sha256')
        .update(`${filepath}:${expires}:${process.env.STORAGE_SECRET || 'dev-secret'}`)
        .digest('hex')
        .substring(0, 16);

      return providedSignature === expectedSignature;
    } catch {
      return false;
    }
  }
}

// Export singleton instance for the application
export const storageService = new LocalStorageService();