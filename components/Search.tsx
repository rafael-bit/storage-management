'use client'

import { FaSearch } from 'react-icons/fa'
import { Input } from './ui/input'
import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.actions'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { useDebounce } from "use-debounce";

export default function Search() {
	const [query, setQuery] = useState('')
	const searchParams = useSearchParams()
	const searchQuery = searchParams.get('query') || ''
	const [results, setResults] = useState<Models.Document[]>([])
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const path = usePathname()
	const [debouncedQuery] = useDebounce(query, 300);

	useEffect(() => {
		const fetchFiles = async () => {
			if (debouncedQuery.length === 0) {
				setResults([]);
				setOpen(false);
				return router.push(path.replace(searchParams.toString(), ""));
			}

			const files = await getFiles({ types: [], searchText: debouncedQuery });
			setResults(files.documents);
			setOpen(true);
		};

		fetchFiles();
	}, [debouncedQuery]);

	useEffect(() => {
		if (!searchQuery) {
			setQuery("");
		}
	}, [searchQuery]);

	const handleClickItem = (file: Models.Document) => {
		setOpen(false)
		setResults([])
		router.push(`/${file.type === 'video' ? 'media' : file.type + 's'}?query=${query}`)
	}

	return (
		<div className='relative w-full md:max-w-[480px]'>
			<div className="flex h-[50px] items-center gap-3 rounded-full px-4 shadow-drop-3 border-2">
				<FaSearch />
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search..."
					className='w-full border-none p-0 shadow-none placeholder:text-zinc-700 focus:!outline-none focus:!ring-0'
				/>
			</div>

			{open && (
				<ul className='absolute left-0 top-14 z-50 flex w-full flex-col gap-3 rounded-lg bg-white p-4 shadow-lg'>
					{results.length > 0 ? (
						results.map((result) => (
							<li key={result.$id} className="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-gray-100">
								<div className="flex items-center gap-3" onClick={() => handleClickItem(result)}>
									<Thumbnail type={result.type} extension={result.extension} className='size-6' />
									<p className='line-clamp-1 text-zinc-700'>{result.name}</p>
								</div>
								<FormattedDateTime date={result.$createdAt} className='text-xs text-zinc-500 line-clamp-1' />
							</li>
						))
					) : (
						<div className="flex flex-col items-center gap-4">
							<p className="text-sm text-zinc-500">No files found</p>
						</div>
					)}
				</ul>
			)}
		</div>
	)
}