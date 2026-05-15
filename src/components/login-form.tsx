"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"
import { signInWithGitHub, createGuestSession } from "@/lib/auth-client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSigningIn, setIsSigningIn] = React.useState(false)
  const [signInError, setSignInError] = React.useState<string | null>(null)

  const handleGitHubSignIn = async () => {
    setSignInError(null)
    setIsSigningIn(true)
    try {
      await signInWithGitHub()
    } catch (error) {
      console.error("Failed to sign in with GitHub:", error)
      setSignInError(
        error instanceof Error ? error.message : "Could not start GitHub sign-in.",
      )
      setIsSigningIn(false)
    }
  }

  const handleGuestContinue = () => {
    createGuestSession()
    window.location.reload()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} className="size-6" />
              </div>
              <span className="sr-only">Mica</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Mica</h1>
            <FieldDescription>
              Sign in to your account or continue as a guest
            </FieldDescription>
          </div>
          <Field className="grid gap-4">
            <Button
              type="button"
              onClick={handleGitHubSignIn}
              disabled={isSigningIn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="mr-2 size-4"
                fill="currentColor"
              >
                <path d="M0 1.94L6.5 1v6.49H0V1.94Zm0 12.12L6.5 15V8.51H0v5.55Zm7.25.97L16 16V8.51H7.25v6.52Zm0-13.06L16 0v7.49H7.25V1.97Z" />
              </svg>
              {isSigningIn ? "Opening GitHub…" : "Continue with GitHub"}
            </Button>
            {signInError ? (
              <p className="text-center text-sm text-destructive" role="alert">
                {signInError}
              </p>
            ) : null}
            <Button variant="ghost" type="button" onClick={handleGuestContinue}>
              Continue as Guest
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}