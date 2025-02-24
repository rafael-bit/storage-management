import RecentFiles from "@/components/RecentFiles";
import UsageSummary from "@/components/UsageSummary";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";

export default async function Home() {
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10">
      <UsageSummary totalSpace={totalSpace} />
      <RecentFiles files={files.documents} />
    </div>
  );
}