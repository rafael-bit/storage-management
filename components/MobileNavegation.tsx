'use client'

import Image from 'next/image'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { MdLogout, MdMenu } from "react-icons/md";
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaUserCircle } from 'react-icons/fa';
import { navItems } from '@/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import FileUploader from './FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';

interface MobileNavegationProps {
	username: string
	email: string
}

export default function MobileNavegation({ username, email }: MobileNavegationProps) {
	const [open, setOpen] = useState(false)
	const pathname = usePathname()

	return (
		<header className='flex h-[60px] justify-between px-5 sm:hidden'>
			<div className="sm:hidden flex items-center">
				<Image src='/bigLogo.png' alt='Logo' width={45} height={25} className='h-[50px] w-[54px]' />
				<h2 className='text-xl font-bold text-brand'>CloudSpace</h2>
			</div>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger>
					<MdMenu size={35} className='text-zinc-500' />
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>
							<div className="w-full mt-4 flex items-center gap-2 bg-brand/10 rounded-full justify-start	p-3">
								<FaUserCircle className='w-7 h-7 text-zinc-400' />
								<div>
									<p className='capitalize text-sm text-zinc-700'>{username}</p>
									<p className='capiton-bottom text-xs text-zinc-700'>{email}</p>
								</div>
							</div>
						</SheetTitle>
					</SheetHeader>
					<SheetFooter>
						<nav className='mt-7 flex-1 gap-1 text-brand'>
							<ul className='flex flex-1 flex-col gap-5'>
								{navItems.map((item) => {
									return (
										<Link key={item.href} href={item.href} className='lg:w-full'>
											<li className={cn('flex  gap-4 w-full justify-start items-center h5 px-[30px] h-[52px] rounded-full', pathname === item.href && 'bg-brand text-white shadow-lg')}>
												<item.icon className='w-6 h-6' />
												<p>{item.name}</p>
											</li>
										</Link>
									)
								})}
							</ul>
						</nav>
					</SheetFooter>
					<div className="flex flex-col justify-between gap-5 py-5">
						<FileUploader />
						<Button type="submit" className='flex justify-center items-center rounded-full bg-brand/10 text-brand shadow-none transition-all hover:bg-brand/20' onClick={signOutUser}><MdLogout className='w-6 h-6' /></Button>
					</div>
				</SheetContent>
			</Sheet>
		</header>
	)
}
