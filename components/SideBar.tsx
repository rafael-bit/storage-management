'use client'

import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaUserCircle } from "react-icons/fa";


export default function SideBar() {
	const pathname = usePathname()

	return (
		<aside className='hidden h-screen w-[90px] overflow-auto px-5 py-7 sm:flex flex-col lg:w-[280px] xl:w-[325px]'>
			<Link href={'/'}>
				<div className="hidden lg:flex items-center">
					<Image src='/favicon.ico' alt='Logo' width={45} height={25} className='h-[50px] w-[54px]' />
					<h2 className='text-xl font-bold text-brand'>CloudSpace</h2>
				</div>
				<div className="lg:hidden flex items-center">
					<Image src='/favicon.ico' alt='Logo' width={45} height={25} className='h-[50px] w-[54px]' />
				</div>
			</Link>
			<nav className='mt-9 flex-1 gap-1 text-brand'>
				<ul className='flex flex-1 flex-col gap-5'>
					{navItems.map((item) => {
						return (
							<Link key={item.href} href={item.href} className='lg:w-full'>
								<li className={cn('flex text-light-100 gap-4 rounded-xl lg:w-full justify-center lg:justify-start items-center h5 lg:px-[30px] h-[52px] lg:rounded-full', pathname === item.href && 'bg-brand text-white shadow-lg')}>
									<item.icon className='w-6 h-6' />
									<p className='hidden lg:block'>{item.name}</p>
								</li>
							</Link>
						)
					})}
				</ul>
			</nav>
			<div className="w-[90%] flex flex-col items-center">
				<Image src={'/files.png'} alt='Icon Files' width={150} height={150} className='transition-all hover:rotate-2 hover:scale-105' />
			</div>
			<div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand/10 p-1 text-light-100 lg:justify-start lg:p-3">
				<FaUserCircle className='w-7 h-7 text-zinc-400'/>
			</div>
		</aside>
	)
}
