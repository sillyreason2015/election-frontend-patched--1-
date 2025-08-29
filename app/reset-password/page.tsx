'use client'

import { Suspense } from "react"
import ResetPasswordPage from "./resetPasswordPage"

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  )
}
