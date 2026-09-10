import crypto from 'crypto';

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = 16384;

/** Legacy SHA-256 hashes from earlier Peboli builds (no salt). */
function legacySha256(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function scryptDerive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_COST }, (err, derived) => {
      if (err) reject(err);
      else resolve(derived);
    });
  });
}

/** Node built-in scrypt — no extra npm dependency. Format: scrypt:<saltHex>:<hashHex> */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hash = await scryptDerive(password, salt);
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (!storedHash) {
    return { valid: false, needsRehash: false };
  }

  if (storedHash.startsWith('scrypt:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return { valid: false, needsRehash: false };
    const salt = Buffer.from(parts[1], 'hex');
    const expected = Buffer.from(parts[2], 'hex');
    if (expected.length !== SCRYPT_KEYLEN) return { valid: false, needsRehash: false };
    const derived = await scryptDerive(password, salt);
    const valid =
      expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
    return { valid, needsRehash: false };
  }

  // Legacy bcrypt hashes (from earlier Local Shelf builds) — re-run create-admin to migrate
  if (
    storedHash.startsWith('$2a$') ||
    storedHash.startsWith('$2b$') ||
    storedHash.startsWith('$2y$')
  ) {
    return { valid: false, needsRehash: true };
  }

  const valid = legacySha256(password) === storedHash;
  return { valid, needsRehash: valid };
}
