// Thin adapter; logic lives in app/lib/drixo/server/handlers.ts
import { handleConfig } from "../../../../../lib/drixo/server/handlers";

export const dynamic = "force-dynamic";
export const GET = (req: Request) => handleConfig(req);
