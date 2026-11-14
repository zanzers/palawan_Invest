import { ALLOWED_TYPES, MAX_FILE_SIZE, MAX_IMAGES } from "@/type/uploadImagesTpye";

export class UploadError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = "UploadError";
  }
}

export function checkFiles(formData: FormData): File[] {
  const entries = formData.getAll("files");

  if (entries.length === 0 || entries.some((f) => !(f instanceof File))) {
    throw new UploadError("Please provide image files");
  }

  const files = entries as File[];
  if (files.length > MAX_IMAGES) throw new UploadError(`Maximum of ${MAX_IMAGES} images allowed`);

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) throw new UploadError(`Unsupported image type: ${file.name}`);
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      throw new UploadError(`${file.name} must be between 1 byte and 5 MB`);
    }
  }
  return files;
}