const STORAGE_PREFIX = 'duo_';
const VERSION_KEY = 'duo_version';
const APP_VERSION = '0.1.0';

export interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  keys(): string[];
  exportAll(): string;
  importAll(json: string): void;
}

class LocalStorageService implements IStorageService {
  private prefix = STORAGE_PREFIX;

  private fullKey(key: string): string {
    return this.prefix + key;
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.fullKey(key));
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.fullKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn('StorageService.set failed:', e);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.fullKey(key));
  }

  clear(): void {
    const allKeys = this.keys();
    for (const k of allKeys) {
      this.remove(k);
    }
    localStorage.removeItem(VERSION_KEY);
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        result.push(key.slice(this.prefix.length));
      }
    }
    return result;
  }

  exportAll(): string {
    const data: Record<string, unknown> = {
      _version: APP_VERSION,
      _exportedAt: new Date().toISOString(),
    };
    const allKeys = this.keys();
    for (const k of allKeys) {
      data[k] = this.get(k);
    }
    return JSON.stringify(data, null, 2);
  }

  importAll(json: string): void {
    try {
      const data = JSON.parse(json);
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('_')) continue;
        this.set(key, value);
      }
    } catch {
      throw new Error('导入失败：数据格式不正确');
    }
  }

  initVersion(): void {
    const current = localStorage.getItem(VERSION_KEY);
    if (!current) {
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    } else if (current !== APP_VERSION) {
      console.info(`Storage version changed: ${current} -> ${APP_VERSION}`);
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    }
  }
}

export const storageService = new LocalStorageService();
