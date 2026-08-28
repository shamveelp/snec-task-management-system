import { Metadata } from "next"
import { OrganizationLoginForm } from "../../../../components/auth/organization-login-form"
import { OrgAuthLayout } from "../../../../components/auth/org-auth-layout"

export const metadata: Metadata = {
  title: "Organization Login - FlowTask",
  description: "Sign in to your organization dashboard.",
}

export default function OrganizationLoginPage() {
  return (
    <OrgAuthLayout>
      <OrganizationLoginForm />
    </OrgAuthLayout>
  )
}
