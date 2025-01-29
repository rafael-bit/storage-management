'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { cn,  getFileType } from '@/lib/utils';
import { MdClose, MdCloudUpload } from "react-icons/md";
import Thumbnail from './Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';

interface FileUploaderProps {
	className?: string;
	ownerId: string;
	accountId: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ ownerId, accountId, className }) => {
	const { toast } = useToast();
	const path = usePathname();
	const [files, setFiles] = useState<File[]>([]);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		setFiles(acceptedFiles);
		const uploadPromises = acceptedFiles.map((file) => {
			if (file.size > MAX_FILE_SIZE) {
				setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

				return toast({
					title: "File too large",
					description: "Please upload a file smaller than 50MB.",
					variant: "destructive",
				})
			}

			return uploadFile({ file, ownerId, accountId, path }).then((uploadedFile) => {
				if(uploadedFile) {
					setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
				}
			})
		})

		await Promise.all(uploadPromises)
		
	}, [ownerId, accountId, path, toast]);

	const { getRootProps, getInputProps} = useDropzone({ onDrop });

	const handleRemoveFile = (e: React.MouseEvent<SVGElement>, fileName: string) => {
		e.stopPropagation();
		setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
	};

	return (
		<div {...getRootProps()} className="flex flex-col items-center gap-4">
			<input {...getInputProps()} />
			<Button type="button" className={cn('bg-brand py-3 px-5 gap-2 shadow', className)}>
				<MdCloudUpload size={20} />
				<p>Upload</p>
			</Button>

			{files.length > 0 && (
				<ul className="fixed bottom-10 right-10 z-40 flex w-full max-w-[480px] flex-col gap-3 rounded-[15px] bg-white p-5 shadow">
					<h3 className="text-lg font-bold">Uploading</h3>
					{files.map((file, index) => {
						const { type, extension } = getFileType(file.name);
						return (
							<li
								key={`${file.name}-${index}`}
								className="flex items-center justify-between gap-3 rounded-xl bg-gray-100 p-3 shadow"
							>
								<div className="flex items-center gap-3">
									<Thumbnail type={type} extension={extension} />
									<div className="mb-2 line-clamp-1 max-w-[300px] text-sm">
										{file.name}
										<div className="relative w-full h-2 bg-gray-200 rounded">
											<div
												className="absolute top-0 left-0 h-full bg-blue-500 animate-pulse"
												style={{
													width: "50%",
													animation: "loaderAnimation 1.5s ease-in-out infinite",
												}}
											></div>
										</div>
									</div>
								</div>
								<MdClose
									size={20}
									className="cursor-pointer text-sky-500"
									onClick={(e) => handleRemoveFile(e, file.name)}
								/>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default FileUploader;