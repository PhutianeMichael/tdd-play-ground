import { IRedisService } from "../../../../../../../shared/infrastructure/redis/interfaces/redis.interface";

export class RedisServiceMock implements IRedisService {
    private store: Map<string, { value: string, expiresAt?: number }> = new Map();
    private healthy = true;

    async get(key: string): Promise<string | null> {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            this.store.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
        } else {
            this.store.set(key, { value });
        }
    }

    async del(key: string): Promise<void> {
        this.store.delete(key);
    }

    async exists(key: string): Promise<boolean> {
        const entry = this.store.get(key);
        if (!entry) return false;
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return false;
        }
        return true;
    }

    async disconnect(): Promise<void> {
        this.healthy = false;
        this.store.clear();
    }

    async isHealthy(): Promise<boolean> {
        return this.healthy;
    }
}

