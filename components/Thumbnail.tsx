import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface Props {
	type: string;
	extension: string;
	url?: string;
	imageClassName?: string;
	className?: string;
}

export default function Thumbnail({
	type,
	extension,
	url = "",
	imageClassName,
	className,
}: Props) {
	const isImage: boolean = type === "image" && extension !== "svg";
	const src: string | null =
		isImage || typeof getFileIcon(extension, type) === "string"
			? (isImage ? url : (getFileIcon(extension, type) as unknown as string))
			: null;

	return (
		<figure className={cn("flex justify-center size-[50px] min-w-[50px] overflow-hidden rounded-full bg-brand/10", className)}>
			{src ? (
				<Image
					src={src}
					alt="thumbnail"
					width={100}
					height={100}
					className={cn(
						"size-8 object-contain",
						imageClassName,
						isImage && "size-full object-cover object-center",
					)}
				/>
			) : (
				React.createElement(getFileIcon(extension, type) as unknown as React.ElementType, {
					size: 40,
					className: cn("text-gray-500", imageClassName),
				})
			)}
		</figure>
	);
};