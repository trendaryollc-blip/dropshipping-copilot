import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer | null {
  const secret = process.env.SECRETS_ENCRYPTION_KEY || process.env.NEXT_SERVER_SECRET;
  if (!secret) return null;
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string): string {
  const key = getKey();
  if (!key || !value) return value;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptSecret(value: string): string {
  const key = getKey();
  if (!key || !value.startsWith("enc:")) return value;
  const [, ivValue, tagValue, encryptedValue] = value.split(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivValue, "base64"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function maskSecret(value?: string): string {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}
