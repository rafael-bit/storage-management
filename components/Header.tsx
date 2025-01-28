import React from 'react'
import { Button } from './ui/button'
import { MdLogout } from "react-icons/md";
import Search from './Search';
import { signOutUser } from '@/lib/actions/user.actions';
import FileUploader from './FileUploader';

interface HeaderProps {
	userId: string;
	accountId: string;
}

export default function Header({ userId, accountId }: HeaderProps) {
	return (
		<header className='hidden items-center justify-between gap-5 p-5 sm:flex lg:py-4 xl:gap-10'>
			<Search />
			<div className="flex justify-center items-center min-w-fit gap-3">
				<FileUploader ownerId={userId} accountId={accountId} />
				<form action={async () => {
					'use server'
					signOutUser()
				}}>
					<Button className='flex justify-center p-0 h-[48px] min-w-[50px] items-center rounded-full bg-brand/20 text-brand shadow-none transition-all hover:bg-brand/30' onClick={signOutUser}>
						<MdLogout className='w-6 h-6' />
					</Button>
				</form>
			</div>
		</header>
	)
}
