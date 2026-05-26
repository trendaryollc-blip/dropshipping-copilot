import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const LOGIN_LIMIT = 15;
const REGISTER_LIMIT = 10;
const API_GENERAL_LIMIT = 200;

const WINDOW_MS = 60 * 1000;
const LONG_WINDOW_MS = 15 * 60 * 1000;
const EXTENDED_WINDOW_MS = 60 * 60 * 1000;

function getRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

function applyHeaders(res: NextResponse, remaining: number, resetAt: number): void {
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  res.headers.set("X-RateLimit-Reset", new Date(resetAt).toISOString());
  res.headers.set("X-RateLimit-Limit", "200");
}

export function rateLimit(limit: number, windowMs: number = WINDOW_MS) {
  return function (request: NextRequest, key?: string) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "default";
    const resolvedKey = key ?? ip;

    const { allowed, remaining, resetAt } = getRateLimit(resolvedKey, limit, windowMs);

    if (allowed) {
      const response = NextResponse.next();
      applyHeaders(response, remaining, resetAt);
      return null;
    }

    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    const response = NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(resetAt).toISOString(),
          "X-RateLimit-Limit": String(limit),
        },
      },
    );
    return response;
  };
}

export const rateLimitLogin = () => rateLimit(LOGIN_LIMIT, LONG_WINDOW_MS);
export const rateLimitRegister = () => rateLimit(REGISTER_LIMIT, EXTENDED_WINDOW_MS);
export const rateLimitApi = () => rateLimit(API_GENERAL_LIMIT, WINDOW_MS);