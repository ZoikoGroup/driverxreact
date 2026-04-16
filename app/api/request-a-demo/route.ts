// app/api/request-demo/route.ts   (App Router)
// ------------------------------------------------
import { NextRequest, NextResponse } from "next/server";

/** Shape of the data you expect from the client */
type DemoRequestPayload = {
  firstName?: string;
  lastName?: string;
  email: string;
  company?: string;
  orgType: string;
  deploymentSize: string;
  updates?: boolean;
  /** optional hidden field that can be used by the front‑end */
  request_type?: string;
};

/** What the DriverX API returns (as documented) */
type DriverXResponse = {
  success: boolean;
  message: string;
  /** extra fields are allowed – we keep them in a generic bucket */
  [key: string]: any;
};

/** What we finally send back to the browser */
type ApiResult = {
  ok: boolean;
  message: string;
};

const DRIVERX_ENDPOINT =
  "https://api.driverxmobile.com/api/form/request-demo";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResult>> {
  try {
    // ----------------------------------------------------
    // 1️⃣  Parse incoming JSON
    // ----------------------------------------------------
    const body: DemoRequestPayload = await req.json();

    const {
      firstName,
      lastName,
      email,
      company,
      orgType,
      deploymentSize,
      updates,
      request_type, // <-- may be undefined
    } = body;

    // ----------------------------------------------------
    // 2️⃣  Basic validation (same as you already had)
    // ----------------------------------------------------
    if (!email || !orgType || !deploymentSize) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 3️⃣  Forward the payload to DriverX
    // ----------------------------------------------------
    const driverXRes = await fetch(DRIVERX_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If DriverX ever needs auth you can add it here:
        // Authorization: `Bearer ${process.env.DRIVERX_API_KEY}`,
      },
      // We send **exactly** what we received (including the optional hidden field)
      body: JSON.stringify(body),
    });

    // ----------------------------------------------------
    // 4️⃣  Parse the response from DriverX
    // ----------------------------------------------------
    const driverXJson: DriverXResponse = await driverXRes.json();

    // ----------------------------------------------------
    // 5️⃣  Normalise the response for our front‑end
    // ----------------------------------------------------
    if (driverXRes.ok && driverXJson.success) {
      // success coming from the 3rd‑party
      return NextResponse.json(
        {
          ok: true,
          message: driverXJson.message ?? "Demo booked successfully",
        },
        { status: 200 }
      );
    }

    // If DriverX responded with an error status or success: false
    const errorMessage =
      driverXJson.message ?? "Failed to book demo – unknown error";

    // Preserve the remote status code when it is a client error (>=400)
    const status = driverXRes.status >= 400 ? driverXRes.status : 500;

    return NextResponse.json({ ok: false, message: errorMessage }, { status });
  } catch (err) {
    console.error("❌ /api/request-demo error:", err);
    return NextResponse.json(
      { ok: false, message: "Internal server error – please try again later." },
      { status: 500 }
    );
  }
}
