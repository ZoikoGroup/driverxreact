// Thin adapter; logic lives in app/lib/drixo/server/handlers.ts
import { handleFeedback } from "../../../../../../../lib/drixo/server/handlers";

export const dynamic = "force-dynamic";
export async function POST(
  req: Request,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  return handleFeedback(req, sessionId);
}
