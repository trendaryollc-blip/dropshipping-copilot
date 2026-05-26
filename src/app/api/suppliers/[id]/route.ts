import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { deleteSupplier, getDocument } from "@/lib/database/operations";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supplier = await getDocument<{ userId?: string }>("suppliers", id);
    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }
    if (supplier.userId && supplier.userId !== auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await deleteSupplier(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete supplier:", err);
    return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
  }
}