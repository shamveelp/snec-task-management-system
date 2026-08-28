import { Metadata } from "next"
import { AuthLayout } from "../../../../components/auth/auth-layout"
import { OrganizationLoginForm } from "../../../../components/auth/organization-login-form"

export const metadata: Metadata = {
  title: "Organization Login - FlowTask",
  description: "Sign in to your organization dashboard.",
}

export default function OrganizationLoginPage() {
  return (
    <AuthLayout>
      <OrganizationLoginForm />
    </AuthLayout>
  )
}
