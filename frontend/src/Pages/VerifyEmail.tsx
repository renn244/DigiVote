import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import axiosFetch from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Mail } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router"

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [otp, setOtp] = useState("")

  const email = searchParams.get('email')

  const { mutate: handleVerifyEmail, isPending } = useMutation({
    mutationKey: ['verifyEmail'],
    mutationFn: async () => {
      const response = await axiosFetch.post('/auth/verifyEmail', {
        token: otp,
        email: email
      })

      // handle
      if(response.status >= 400) {
        throw new Error(response.data.message)
      }

      window.location.assign(response.data.redirect_url)
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  const { mutate: handleResendEmail } = useMutation({
    mutationKey: ['resend'],
    mutationFn: async () => {
      if(!email) {
        return toast.error('email is missing!')
      }
      const response = await axiosFetch.post('/auth/resendEmail', {
        email: email
      })

      if(response.status >= 400) {
        throw new Error(response.data.message)
      }
      
      return response.data
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('email code has been resent')
    },
  })

  return (
    <main className="flex min-h-screen justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="text-gray-500" />
            <span className="text-sm text-gray-500">{email}</span>
          </div>
          <div className="flex justify-center mb-4">
            <InputOTP
            pattern={REGEXP_ONLY_DIGITS}
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)} >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={() => handleVerifyEmail()} disabled={isPending || otp.length !== 6} className="w-full">
            {isPending ? <LoadingSpinner /> : "Verify Email"}
          </Button>
          <Button onClick={() => handleResendEmail()} variant={'link'} className="text-sm">
            Resend verification code
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

export default VerifyEmail 