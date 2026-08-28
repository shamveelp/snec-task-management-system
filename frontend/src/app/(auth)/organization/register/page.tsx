import { Metadata } from "next"
import { AuthLayout } from "../../../../components/auth/auth-layout"
import { OrganizationRegisterForm } from "../../../../components/auth/organization-register-form"

export const metadata: Metadata = {
  title: "Organization Register - FlowTask",
  description: "Create a new organization account.",
}

export default function OrganizationRegisterPage() {
  return (
    <AuthLayout>
      <OrganizationRegisterForm />
    </AuthLayout>
  )
}
