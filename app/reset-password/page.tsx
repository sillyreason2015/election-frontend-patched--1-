'use client'

import { Suspense } from "react"
import ResetPasswordPage from "./resetPasswordPage"


export const dynamic = "force-dynamic"


export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage/>
    </Suspense>
  )
}
