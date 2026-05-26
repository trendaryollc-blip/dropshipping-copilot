export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export type FieldRule = {
  required?: boolean;
  type?: "string" | "number" | "boolean" | "array" | "object" | "url" | "email";
  min?: number;
  max?: number;
  allowed?: readonly string[];
};

export type Schema<T extends Record<string, unknown>> = Record<keyof T & string, FieldRule>;

export function validateObject<T extends Record<string, unknown>>(
  input: Record<string, unknown>,
  schema: Schema<T>,
): ValidationResult<T> {
  const errors: Record<string, string> = {};
  const data: Record<string, unknown> = {};

  for (const [field, rule] of Object.entries(schema)) {
    const value = input[field];
    if (rule.required && (value === undefined || value === null || value === "")) {
      errors[field] = "Required";
      continue;
    }
    if (value === undefined || value === null || value === "") continue;

    if (rule.type && !matchesType(value, rule.type)) {
      errors[field] = `Expected ${rule.type}`;
      continue;
    }

    if (rule.type === "number") {
      const numberValue = Number(value);
      if (Number.isNaN(numberValue)) {
        errors[field] = "Expected number";
        continue;
      }
      if (rule.min !== undefined && numberValue < rule.min) errors[field] = `Must be at least ${rule.min}`;
      if (rule.max !== undefined && numberValue > rule.max) errors[field] = `Must be at most ${rule.max}`;
      data[field] = numberValue;
      continue;
    }

    if (typeof value === "string") {
      if (rule.min !== undefined && value.length < rule.min) errors[field] = `Must be at least ${rule.min} characters`;
      if (rule.max !== undefined && value.length > rule.max) errors[field] = `Must be at most ${rule.max} characters`;
      if (rule.allowed && !rule.allowed.includes(value)) errors[field] = "Invalid value";
    }

    data[field] = value;
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: data as T };
}

export async function parseJsonBody(request: Request, maxBytes = 100 * 1024): Promise<Record<string, unknown>> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new Error("Request body too large");
  }
  return await request.json().catch(() => ({}));
}

export function sanitizeText(value: unknown, fallback = ""): string {
  return String(value ?? fallback).replace(/[<>]/g, "").trim();
}

function matchesType(value: unknown, type: FieldRule["type"]): boolean {
  if (type === "array") return Array.isArray(value);
  if (type === "url") return typeof value === "string" && /^https?:\/\//.test(value);
  if (type === "email") return typeof value === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  if (type === "number") return !Number.isNaN(Number(value));
  if (type === "object") return typeof value === "object" && value !== null && !Array.isArray(value);
  return typeof value === type;
}
