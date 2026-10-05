import { sendDueReminders } from "@/lib/mail";

export async function POST(request: Request) {
  const secret = process.env.REMINDER_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await sendDueReminders();
  return Response.json(result);
}
