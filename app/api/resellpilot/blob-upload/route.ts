import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

/*
  Tar emot bilduppladdningar för ResellPilot via Vercel Blob (klient laddar
  upp direkt). Kräver BLOB_READ_WRITE_TOKEN (samma Blob-store som resten av
  appen använder för video – se Storage → Create → Blob i Vercel).
*/

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
        maximumSizeInBytes: 15 * 1024 * 1024, // 15 MB
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        /* inget extra behövs här */
      },
    });
    return Response.json(json);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
