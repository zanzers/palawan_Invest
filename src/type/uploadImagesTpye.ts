

export type uploadImagesProps = {
    files: File[];
    previews: string[];
    onFilesChange: (file: File[]) => void;
}


export const BUCKET = "Palawan_Invest";
export const MAX_IMAGES = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};