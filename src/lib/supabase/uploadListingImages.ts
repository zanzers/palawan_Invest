import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { BUCKET, EXTENSIONS } from "@/type/uploadImagesTpye";
import { UploadError } from "@/utils/upload/iamgeUploadUtils";

type Props = {
  db: SupabaseClient;
  userId: string;
  listingId: string;
  files: File[];
  startPosition?: number;
};

export async function uploadListingImages({ db, userId, listingId, files, startPosition = 0 }: Props) {
  const uploadedPaths: string[] = [];

  try {
    const records = [];

    for (const [index, file] of files.entries()) {
      const extension = EXTENSIONS[file.type];
      if (!extension) throw new UploadError(`Unsupported image type: ${file.name}`);

      const imageId = randomUUID();
      const filePath = `listings/${userId}/${listingId}_${imageId}.${extension}`;

      const { error } = await db.storage
        .from(BUCKET)
        .upload(filePath, file, { contentType: file.type, upsert: false });
      if (error) throw error;

      uploadedPaths.push(filePath);
      records.push({ id: imageId, listing_id: listingId, file_path: filePath, position: startPosition + index });
    }

    const { data, error } = await db.from("images").insert(records).select();
    if (error) throw error;
    return data;
  } catch (error) {
    if (uploadedPaths.length > 0) {
      const { error: cleanupError } = await db.storage.from(BUCKET).remove(uploadedPaths);
      if (cleanupError) console.error("Image cleanup failed:", cleanupError);
    }
    throw error;
  }
}