import { getStorageAdapter } from "@/lib/storage/adapter";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "file is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image uploads are currently supported" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const asset = await getStorageAdapter().upload(file, file.name);
  return Response.json({ mode: "placeholder", asset });
}
