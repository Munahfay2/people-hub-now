import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** Upload a file or data-URL image; returns public URL or original if upload skipped. */
export async function resolveMediaUrl(
  urlOrData: string | undefined,
  folder: "blogs" | "events"
): Promise<string | undefined> {
  if (!urlOrData?.trim()) return undefined;
  if (!urlOrData.startsWith("data:") || !isSupabaseConfigured) return urlOrData;

  try {
    const res = await fetch(urlOrData);
    const blob = await res.blob();
    const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, blob, {
      contentType: blob.type,
      upsert: false,
    });
    if (error) {
      console.warn("Storage upload failed:", error.message);
      return urlOrData;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.warn("Media upload error:", err);
    return urlOrData;
  }
}
