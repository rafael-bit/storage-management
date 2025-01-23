'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import Link from "next/link";
import { createAccount } from "@/lib/actions/user.actions";
import toast from "react-hot-toast";
import OTPModal from "./OTPModal";

type FormType = "signIn" | "signUp";

const authSchema = (formType: FormType) => {
	return z.object({
		email: z.string().email(),
		username:
			formType === "signUp"
				? z.string().min(2).max(50)
				: z.string().optional(),
	});
};

export default function AuthForm({ type }: { type: FormType }) {
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [accountId, setAccountId] = useState(null)

	const formSchema = authSchema(type)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true)

		try {
			const user = await createAccount({
				username: values.username || "",
				email: values.email,
			})

			setAccountId(user.accountId)
		} catch (err) {
			toast.error((err as Error).message || "Something went wrong.");
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:w-4/5 w-full">
					<h1 className="text-blue-600 text-center text-3xl font-extrabold">{type === "signIn" ? "Sign In" : "Sign Up"}</h1>
					{type === "signUp" && (
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<div>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="Enter your username" {...field} />
										</FormControl>
										<FormDescription className="text-xs p-1.5">
											This is your public display name.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>)}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<div>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Enter your email" {...field} />
									</FormControl>
									<FormDescription className="text-xs p-1.5">
										Enter your best email.
									</FormDescription>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
					<Button type="submit" className="flex gap-7 bg-brand hover:bg-blue-500 w-full" disabled={isLoading}>
						{type === "signIn" ? "Sign In" : "Sign Up"}
						{isLoading && (
							<div className="flex flex-col items-center">
								<div className="animate-spin rounded-full h-5 w-5 border-t-[2px] border-white"></div>
							</div>
						)}
					</Button>
					{errorMessage && <p className="text-red-600 mt-2">*{errorMessage}</p>}
					<div className="p-3 flex justify-center">
						<p>{type === "signIn" ? "Don't have an account? " : "Already have an account? "}</p>
						<Link href={type === "signIn" ? "/sign-up" : "/sign-in"} className="ml-1 font-medium text-brand">
							{type === "signIn" ? "Sign Up" : "Sign In"}
						</Link>
					</div>
				</form>
			</Form>
			{accountId && <OTPModal email={form.getValues("email")} accountId={accountId} />}
		</>
	)
}
