import React from 'react'
import Image from 'next/image'

export const dynamic = "force-dynamic";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex min-h-screen'>
			<section className='bg-blue-700 p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5'>
				<div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>
					<div className="flex items-center">
						<Image src='/favicon.ico' alt='Logo' width={45} height={25} className='h-10 w-12' />
						<h2 className='text-xl font-bold text-white'>CloudSpace</h2>
					</div>
					<div className="space-y-5 text-white">
						<h1 className='text-5xl font-bold'>Manage your files the best way</h1>
						<p>This is a place where you can store all your documents</p>
					</div>
					<Image src="/files.png" alt='Icon Files' width={325} height={325} className='transition-all hover:rotate-2 hover:scale-105' />
				</div>
			</section>
			<section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
				<div className="mb-16 lg:hidden">
					<div className="flex items-center">
						<Image src='/favicon.ico' alt='Logo' width={45} height={25} className='h-10 w-12' />
						<h2 className='text-xl font-bold text-brand'>CloudSpace</h2>
					</div>
				</div>
				{children}
			</section>
		</div>
	)
}

export default Layout