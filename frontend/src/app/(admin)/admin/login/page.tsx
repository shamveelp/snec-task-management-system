import { Metadata } from "next"
import { AuthLayout } from "../../../../components/auth/auth-layout"
import { AdminLoginForm } from "../../../../components/auth/admin-login-form"

export const metadata: Metadata = {
  title: "Admin Portal - FlowTask",
  description: "Secure login for system administrators.",
}

export default function AdminLoginPage() {
  return (
    <AuthLayout>
      <AdminLoginForm />
    </AuthLayout>
  )
}
