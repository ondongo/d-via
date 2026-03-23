import { redirect } from "next/navigation";
import { auth } from "@/configs/prisma/auth";

export default async function DashboardPage() {
  const session = await auth();
  const role =
    session?.user && "role" in session.user
      ? String((session.user as { role?: string }).role ?? "").toLowerCase()
      : "";

  if (!session?.user) {
    redirect("/non-authorized");
  }

  if (role === "artisan") {
    redirect("/dashboard/artisan/messages");
  }

  redirect("/dashboard/clients");
}
