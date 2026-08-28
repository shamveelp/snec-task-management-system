import { Metadata } from "next"
import { AuthLayout } from "../../../../components/auth/auth-layout"
import { RegisterForm } from "../../../../components/auth/register-form"

export const metadata: Metadata = {
  title: "Register - FlowTask",
  description: "Create a new FlowTask account.",
}

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
