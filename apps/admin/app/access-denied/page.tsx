import { AdminLink } from "@/components/ui/admin-link";
import { AuthLayout } from "@/components/ui/auth-layout";

export default function AccessDeniedPage() {
  return (
    <AuthLayout
      title="Access denied"
      subtitle="Your Google account is not on the admin allowlist or has been disabled. No session was created."
    >
      <AdminLink href="/login" className="inline-flex text-sm font-medium">
        ← Back to sign in
      </AdminLink>
    </AuthLayout>
  );
}
