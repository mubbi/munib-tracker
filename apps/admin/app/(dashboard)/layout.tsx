export const dynamic = "force-dynamic";

import { SIDEBAR_OFFSET_CLASS, Sidebar } from "@/components/layout/sidebar";
import { requirePageSession } from "@/lib/auth/guards";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageSession();

  return (
    <div className={cn("relative z-10 min-h-[100dvh] min-w-0", SIDEBAR_OFFSET_CLASS)}>
      <Sidebar role={session.role} email={session.email} />
      <main className="min-w-0 px-4 pb-8 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
