import { AdminLink } from "@/components/ui/admin-link";
import { AdminSignInGate } from "@/components/ui/admin-sign-in-gate";
import { Alert } from "@/components/ui/alert";
import { AuthLayout } from "@/components/ui/auth-layout";
import { getSession } from "@/lib/auth/session";
import { adminDbErrorMessage } from "@/lib/db-errors";
import { isAuthConfigured } from "@/lib/env";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) {
    return (
      <AuthLayout title="Already signed in" subtitle="Your admin session is active.">
        <AdminLink href="/dashboard" className="inline-flex text-sm font-medium">
          Go to dashboard →
        </AdminLink>
      </AuthLayout>
    );
  }

  const params = await searchParams;
  const configured = isAuthConfigured();
  const errorMessages: Record<string, string> = {
    auth_not_configured: "Google OAuth is not configured on this environment.",
    invalid_oauth: "Invalid OAuth response. Try again.",
    expired_oauth: "OAuth state expired. Try again.",
    oauth_failed: "Google sign-in failed.",
    db_connect: adminDbErrorMessage("db_connect"),
    db_schema: adminDbErrorMessage("db_schema"),
    db_unavailable: adminDbErrorMessage("db_unavailable"),
  };

  return (
    <AuthLayout title="Sign in">
      {params.error ? (
        <Alert variant="error" className="mb-4">
          {errorMessages[params.error] ?? "Sign-in error."}
        </Alert>
      ) : null}
      <AdminSignInGate configured={configured} />
    </AuthLayout>
  );
}
