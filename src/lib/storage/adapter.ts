export interface UploadedAsset {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  provider: "placeholder" | "firebase" | "cloudinary" | "s3";
  createdAt: string;
}

export interface StorageAdapter {
  upload(file: File | Blob, fileName: string): Promise<UploadedAsset>;
  remove(assetId: string): Promise<{ success: boolean }>;
}

export class PlaceholderStorageAdapter implements StorageAdapter {
  async upload(file: File | Blob, fileName: string): Promise<UploadedAsset> {
    return {
      id: `asset-${Date.now()}`,
      fileName,
      url: `https://placeholder-storage.example/assets/${encodeURIComponent(fileName)}`,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      provider: "placeholder",
      createdAt: new Date().toISOString(),
    };
  }

  async remove() {
    return { success: true };
  }
}

export function getStorageAdapter(): StorageAdapter {
  return new PlaceholderStorageAdapter();
}
