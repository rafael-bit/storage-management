import Link from 'next/link'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import ActionDropdown from './ActionDropdown'
import { convertFileSize } from '@/lib/utils'
import FormattedDateTime from './FormattedDateTime'

export default function Card({ file }: { file: Models.Document }) {
	return (
		<Link href={file.url} target='_blank' className='flex cursor-pointer flex-col gap-6 rounded-[15px] bg-white p-5 shadow-sm transition-all'>
			<div className="flex justify-between">
				<Thumbnail type={file.type} extension={file.extension} className='size-14' imageClassName='size-9' />
				<div className="flex flex-col items-end justify-between">
					<ActionDropdown file={file} />
					<p className="text-zinc-600 text-xs">{convertFileSize(file.size)}</p>
				</div>
			</div>

			<div className="flex flex-col gap-2 text-zinc-600">
				<p className="line-clamp-1">{file.name}</p>
				<FormattedDateTime
					date={file.$createdAt}
					className="text-sm text-light-100"
				/>
				<p className="text-sm caption line-clamp-1 text-zinc-600">
					By: {file.owner.username}
				</p>
			</div>
		</Link>
	)
}
