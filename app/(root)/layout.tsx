import Header from "@/components/Header";
import MobileNavegation from "@/components/MobileNavegation";
import SideBar from "@/components/SideBar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return redirect("/sign-in");
		}

		return (
			<main className="flex h-screen">
				<SideBar {...currentUser} />
				<section className="h-full flex flex-1 flex-col">
					<MobileNavegation {...currentUser} />
					<Header userId={currentUser.$id} accountId={currentUser.accountId} />
					<div className="h-full flex-1 overflow-auto px-5 py-7 sm:mr-5 sm:rounded-[15px] md:mb-7 md:px-9 md:py-10 bg-gray-50">
						{children}
					</div>
				</section>
			</main>
		);
	} catch (error) {
		console.log(error);
		return redirect("/sign-in");
	}
}