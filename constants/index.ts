import { MdSpaceDashboard, MdImage, MdOutlineDocumentScanner, MdPermMedia } from "react-icons/md";
import { AiOutlineDotChart } from "react-icons/ai";

export const navItems = [
	{
		name: "Dashboard",
		href: "/",
		icon: MdSpaceDashboard,
	},
	{
		name: "Documents",
		href: "/documents",
		icon: MdOutlineDocumentScanner,
	},
	{
		name: "Images",
		href: "/images",
		icon: MdImage,
	},
	{
		name: "Media",
		href: "/media",
		icon: MdPermMedia,
	},
	{
		name: "Others",
		href: "/others",
		icon: AiOutlineDotChart,
	},
];

export const sortTypes = [
	{
		label: "Date created (newest)",
		value: "$createdAt-desc",
	},
	{
		label: "Created Date (oldest)",
		value: "$createdAt-asc",
	},
	{
		label: "Name (A-Z)",
		value: "name-asc",
	},
	{
		label: "Name (Z-A)",
		value: "name-desc",
	},
	{
		label: "Size (Highest)",
		value: "size-desc",
	},
	{
		label: "Size (Lowest)",
		value: "size-asc",
	},
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024;