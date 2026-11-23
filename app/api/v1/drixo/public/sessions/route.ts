// Thin adapter; logic lives in app/lib/drixo/server/handlers.ts
import { handleCreateSession } from "../../../../../lib/drixo/server/handlers";

export const dynamic = "force-dynamic";
export const POST = (req: Request) => handleCreateSession(req);
