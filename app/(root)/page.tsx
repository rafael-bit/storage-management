import Link from "next/link";
import { Models } from "node-appwrite";

import ActionDropdown from "@/components/ActionDropdown";
import Chart from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

export default async function Home() {
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10">
      <section>
        <Chart used={totalSpace.used} />

        <ul className="mt-6 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="relative mt-6 rounded-[20px] bg-white p-5 transition-all hover:scale-105"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <summary.icon className="absolute -left-3 top-[-25px] z-10 w-[190px] object-contain" />
                  <h4 className="text-lg relative z-20 w-full text-right">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="text-lg relative z-20 text-center">{summary.title}</h5>
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="h-full rounded-[20px] bg-white p-5 xl:p-8">
        <h2 className="text-2xl xl:text-3xl font-bold text-zinc-800">Recent files uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                />

                <div className="flex w-full flex-col xl:flex-row xl:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="line-clamp-1 w-full text-light-100 sm:max-w-[200px] lg:max-w-[250px]">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
            <p className="mt-10 text-center text-light-200">No files uploaded</p>
        )}
      </section>
    </div>
  );
}
