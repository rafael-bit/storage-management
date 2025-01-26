import Header from "@/components/Header"
import MobileNavegation from "@/components/MobileNavegation"
import SideBar from "@/components/SideBar"
import { getCurrentUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import React from "react"

export default async function layout({ children }: { children: React.ReactNode }) {
	const currentUser = await getCurrentUser()
	if(!currentUser) return redirect('/sign-in')
		
	return (
		<main className="flex h-screen">
			<SideBar {...currentUser}/>
			<section className="h-full flex flex-1 flex-col">
				<MobileNavegation {...currentUser}/>
				<Header />
				<div className="h-full flex-1 overflow-auto px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10">
					{children}
				</div>
			</section>
		</main>
	)
}
