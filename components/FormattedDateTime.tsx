import { cn, formatDateTime } from "@/lib/utils";

export const FormattedDateTime = ({
	date,
	className,
}: {
	date: string;
	className?: string;
}) => {
	return (
		<p className={cn("text-sm text-zinc-800", className)}>
			{formatDateTime(date)}
		</p>
	);
};
export default FormattedDateTime;