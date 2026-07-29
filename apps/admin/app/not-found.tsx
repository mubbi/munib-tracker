import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { StatusScreen } from "@/components/ui/status-screen";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Page not found"
      description="The page you’re looking for doesn’t exist or may have been moved."
    >
      <Link href="/dashboard" className={buttonClasses("primary")}>
        <LayoutDashboard className="h-4 w-4" aria-hidden />
        Go to dashboard
      </Link>
      <Link href="/login" className={buttonClasses("secondary")}>
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Sign in
      </Link>
    </StatusScreen>
  );
}
