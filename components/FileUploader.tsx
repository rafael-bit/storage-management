'use client';

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { MdCloudUpload } from "react-icons/md";
import { usePathname } from "next/navigation";
import UploadList from "./UploadList";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileUploaderProps {
	className?: string;
	ownerId: string;
	accountId: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ ownerId, accountId, className }) => {
	const path = usePathname();
	const { files, uploadFiles, removeFile } = useFileUpload(ownerId, accountId, path);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		uploadFiles(acceptedFiles);
	}, [uploadFiles]);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} className="flex flex-col items-center gap-4">
			<input {...getInputProps()} />
			<Button type="button" className={cn('bg-brand py-3 px-5 gap-2 shadow', className)}>
				<MdCloudUpload size={20} />
				<p>Upload</p>
			</Button>

			{files.length > 0 && <UploadList files={files} onRemove={removeFile} />}
		</div>
	);
};

export default FileUploader;