import { Metadata } from "next"
import { AdminAuthLayout } from "../../../../components/auth/admin-auth-layout"
import { AdminLoginForm } from "../../../../components/auth/admin-login-form"

export const metadata: Metadata = {
  title: "Admin Portal - FlowTask",
  description: "Secure login for system administrators.",
}

export default function AdminLoginPage() {
  return (
    <AdminAuthLayout>
      <AdminLoginForm />
    </AdminAuthLayout>
  )
}
