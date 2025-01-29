import { MdSpaceDashboard, MdImage, MdOutlineDocumentScanner, MdPermMedia } from "react-icons/md";
import { FiEdit, FiInfo, FiShare, FiDownload, FiTrash } from "react-icons/fi";
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

export const actionsDropdownItems = [
	{
		label: "Rename",
		icon: FiEdit,
    value: "rename",
	},
	{
		label: "Details",
		icon: FiInfo,
    value: "details",
	},
	{
		label: "Share",
		icon: FiShare,
    value: "share",
	},
	{
		label: "Download",
		icon: FiDownload,
    value: "download",
	},
	{
		label: "Delete",
		icon: FiTrash,
    value: "delete",
	},
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024;