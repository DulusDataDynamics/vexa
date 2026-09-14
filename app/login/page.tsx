import { AuthForm } from "@/src/components/AuthForm";
import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/projects");
  }

  return <AuthForm mode="login" />;
}
