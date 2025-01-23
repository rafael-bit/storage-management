'use client'

import toast from "react-hot-toast"
import { MdClose } from "react-icons/md";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"
import { Button } from "./ui/button";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

export default function OTPModal({ accountId, email }: { accountId: string; email: string }) {
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(true)
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const sessionId = await verifySecret({ accountId, password })

			if (sessionId) router.push("/")
		} catch (err) {
			toast.error((err as Error).message || "Something went wrong.");
		}
	}

	const handleResendOTP = async () => {
		await sendEmailOTP({ email })
	}

	return (
		<>
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-3xl text-center">
							Enter your OTP
						</AlertDialogTitle>
						<MdClose className="absolute right-1 -top-1 cursor-pointer " onClick={() => setIsOpen(false)} />
						<AlertDialogDescription className="text-center">
							We&apos;ve sent a code to <span className="pl-1 text-brand">{email}</span>. Please enter the code below
						</AlertDialogDescription>
					</AlertDialogHeader>
					<InputOTP maxLength={6} value={password} onChange={setPassword}>
						<InputOTPGroup className="w-full flex gap-1 sm:gap-2 justify-center">
							<InputOTPSlot index={0} className="text-[30px] text-brand font-medium rounded border ring-brand shadow size-12" />
							<InputOTPSlot index={1} className="text-[30px] text-brand font-medium rounded border ring-brand shadow size-12" />
							<InputOTPSlot index={2} className="text-[30px] text-brand font-medium rounded border ring-brand shadow size-12" />
							<InputOTPSeparator />
							<InputOTPSlot index={3} className="text-[30px] text-brand font-medium rounded border ring-brand shadow size-12" />
							<InputOTPSlot index={4} className="text-[30px] text-brand font-medium rounded border ring-brand shadow size-12" />
							<InputOTPSlot index={5} className="text-[30px] text-brand font-medium rounded border ring-brand shadow size-12" />
						</InputOTPGroup>
					</InputOTP>
					<AlertDialogFooter>
						<div className="w-full flex flex-col gap-3">
							<AlertDialogAction onClick={handleSubmit} className="bg-brand hover:bg-blue-500">
								Submit
								{isLoading && (
									<div className="flex flex-col items-center">
										<div className="animate-spin rounded-full h-5 w-5 border-t-[2px] border-white"></div>
									</div>
								)}
							</AlertDialogAction>
							<div className="text-center font-bold text-xs text-zinc-700">
								Didn&apos;t receive the code?{" "}
								<Button type="button" variant="link" className="pl-1 text-xs text-zinc-700" onClick={handleResendOTP}>Click to resend</Button>
							</div>
						</div>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
