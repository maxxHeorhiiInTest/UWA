import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm border border-uwa-panel-border bg-uwa-panel px-6 py-8">
        <div className="flex flex-col items-center text-uwa-red">
          <Logo className="h-10 w-auto" />
          <h1 className="mt-4 font-heading text-2xl tracking-wide text-uwa-white">
            UWA Admin
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
