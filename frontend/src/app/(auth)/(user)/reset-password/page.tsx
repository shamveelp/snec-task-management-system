import { Metadata } from "next"
import { UserAuthLayout } from "../../../../components/auth/user-auth-layout"
import { ResetPasswordForm } from "../../../../components/auth/reset-password-form"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Reset Password - FlowTask",
  description: "Create a new FlowTask password.",
}

export default function ResetPasswordPage() {
  return (
    <UserAuthLayout>
      <Suspense fallback={<div className="flex h-32 items-center justify-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </UserAuthLayout>
  )
}
