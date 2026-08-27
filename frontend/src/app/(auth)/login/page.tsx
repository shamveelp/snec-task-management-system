import { Metadata } from "next"
import { AuthLayout } from "../../../components/auth/auth-layout"
import { LoginForm } from "../../../components/auth/login-form"

export const metadata: Metadata = {
  title: "Login - FlowTask",
  description: "Login to your FlowTask workspace.",
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
