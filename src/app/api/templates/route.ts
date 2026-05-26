import { NextRequest, NextResponse } from "next/server";
import {
  createPromptTemplate,
  getPromptTemplates,
  updatePromptTemplate,
  deletePromptTemplate,
} from "@/lib/database/operations";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get("module") ?? undefined;

  try {
    const templates = await getPromptTemplates(userId, moduleId);
    return NextResponse.json({ templates });
  } catch (err) {
    console.error("Failed to load prompt templates:", err);
    return NextResponse.json({ error: "Failed to load templates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { moduleId, name, systemPrompt, userPromptTemplate, temperature } = body;
  if (
    typeof moduleId !== "string" ||
    typeof name !== "string" ||
    typeof systemPrompt !== "string" ||
    typeof userPromptTemplate !== "string"
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  try {
    const id = await createPromptTemplate({
      userId,
      moduleId,
      name: name.slice(0, 100),
      systemPrompt: systemPrompt.slice(0, 5000),
      userPromptTemplate: userPromptTemplate.slice(0, 5000),
      temperature: typeof temperature === "number" ? temperature : 0.5,
    });
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Failed to create prompt template:", err);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, name, systemPrompt, userPromptTemplate, temperature } = body;
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Template ID required" }, { status: 400 });
  }

  try {
    await updatePromptTemplate(id, {
      ...(name != null ? { name: String(name).slice(0, 100) } : {}),
      ...(systemPrompt != null ? { systemPrompt: String(systemPrompt).slice(0, 5000) } : {}),
      ...(userPromptTemplate != null ? { userPromptTemplate: String(userPromptTemplate).slice(0, 5000) } : {}),
      ...(temperature != null ? { temperature: Number(temperature) } : {}),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update prompt template:", err);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Template ID required" }, { status: 400 });
  }

  try {
    await deletePromptTemplate(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete prompt template:", err);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
