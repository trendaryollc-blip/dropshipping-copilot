import { readFileSync } from "fs";

const envText = readFileSync(".env.local", "utf8");
for (const line of envText.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  let val = trimmed.slice(eq + 1).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  process.env[key] = val.replace(/\\n/g, "\n");
}

const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getAuth } = await import("firebase-admin/auth");

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });
}

console.log("Admin SDK:", getAuth().app.options.projectId);
console.log("Client API key set:", Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY));
