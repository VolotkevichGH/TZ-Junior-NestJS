import { createHash } from 'crypto'

export function createHashSync(buffer: Buffer): string {
    const hash = createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
}