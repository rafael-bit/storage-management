import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";
import { IconType } from "react-icons";
import { MdInsertDriveFile } from "react-icons/md";

interface Props {
	type: string;
	extension: string;
	icon?: IconType
	imageClassName?: string;
	className?: string;
}

export default function Thumbnail({
	type,
	extension,
	imageClassName,
	className,
}: Props) {
	const Icon = getFileIcon(extension, type) || MdInsertDriveFile;

	return (
		<figure
			className={cn(
				"flex justify-center p3 items-center overflow-hidden rounded-full bg-brand/10",
				className,
			)}
		>
			<Icon className={cn("text-gray-500", imageClassName)} />
		</figure>
	);
}