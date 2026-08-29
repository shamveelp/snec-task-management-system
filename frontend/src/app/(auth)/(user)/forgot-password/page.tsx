import { Metadata } from "next"
import { UserAuthLayout } from "../../../../components/auth/user-auth-layout"
import { ForgotPasswordForm } from "../../../../components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - FlowTask",
  description: "Reset your FlowTask password.",
}

export default function ForgotPasswordPage() {
  return (
    <UserAuthLayout>
      <ForgotPasswordForm />
    </UserAuthLayout>
  )
}
