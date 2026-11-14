import { ImageIcon, XIcon } from "@phosphor-icons/react";
import { Label } from "./fields";
import { uploadImagesProps } from "@/type/uploadImagesTpye";


const MAX_IMAGES = 5;



export default function UploadImage({files, previews, onFilesChange}: uploadImagesProps) {
  return (
      <div>
        <Label>Photos</Label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-6 text-slate-500 hover:border-slate-300">
          <ImageIcon size={28} />
          <span className="text-sm font-medium">Upload images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              onFilesChange([...files, ...picked].slice(0, MAX_IMAGES));
              e.target.value = "";
            }}
          />
        </label>

        {previews.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <li key={src} className="relative aspect-square overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={`Remove image ${i + 1}`}
                  onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <XIcon size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-1.5 text-xs text-slate-400">
          Up to {MAX_IMAGES} images. The first one is the cover.
        </p>
      </div>
  )
}




