import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

/*
  Tar emot videouppladdningar via Vercel Blob (klient laddar upp direkt).
  Kräver BLOB_READ_WRITE_TOKEN (sätts automatiskt när man skapar en Blob-store
  i Vercel → Storage). Saknas den svarar vi med fel, och formuläret faller
  tillbaka på att klistra in en videolänk istället.
*/

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"],
        maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
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
