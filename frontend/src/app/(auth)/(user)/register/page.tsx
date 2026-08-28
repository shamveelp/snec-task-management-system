import { Metadata } from "next"
import { RegisterForm } from "../../../../components/auth/register-form"
import { UserAuthLayout } from "../../../../components/auth/user-auth-layout"

export const metadata: Metadata = {
  title: "Register - FlowTask",
  description: "Create a new FlowTask account.",
}

export default function RegisterPage() {
  return (
    <UserAuthLayout>
      <RegisterForm />
    </UserAuthLayout>
  )
}
