import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth/authenticate";
import { checkFiles, UploadError } from "@/utils/upload/iamgeUploadUtils";
import { uploadListingImages } from "@/lib/supabase/uploadListingImages";

export async function POST(req: Request, { params }: { params: Promise<{ listingId: string }> }) {
  const auth = await authenticate(req);
  if ("response" in auth) return auth.response;

  const { db, user } = auth;
  const { listingId } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(listingId)) {
    return NextResponse.json({ error: "Invalid listing id" }, { status: 400 });
  }

  try {
    // Only the person who created the listing can add images to it
    const { data: listing, error: listingError } = await db
      .from("listings")
      .select("id")
      .eq("id", listingId)
      .eq("created_by", user.id)
      .maybeSingle();

    if (listingError) throw listingError;
    if (!listing) {
      return NextResponse.json({ error: "Listing not found or not authorized" }, { status: 404 });
    }

    const formData = await req.formData();
    const files = checkFiles(formData);
    const position = Number.parseInt(String(formData.get("position") ?? "0"), 10) || 0;

    const images = await uploadListingImages({ db, userId: user.id, listingId, files, startPosition: position });
    return NextResponse.json({ images }, { status: 201 });
  } catch (error) {
    console.error("Image upload failed:", error);

    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not upload listing images" }, { status: 500 });
  }
}