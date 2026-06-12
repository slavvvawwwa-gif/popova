import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation.
 * Configure a webhook in Sanity (manage → API → Webhooks) pointing at
 * https://<your-site>/api/revalidate with the secret SANITY_REVALIDATE_SECRET
 * and a projection that includes `_type`. Editing a document instantly busts
 * the matching Next.js cache tag (tags mirror the document `_type`).
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
    if (!body?._type) {
      return new NextResponse("Bad request — missing _type", { status: 400 });
    }

    // Next 16: two-arg form — "max" marks the tag stale (stale-while-revalidate)
    revalidateTag(body._type, "max");
    return NextResponse.json({ revalidated: true, tag: body._type, now: Date.now() });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    return new NextResponse("Error revalidating", { status: 500 });
  }
}
