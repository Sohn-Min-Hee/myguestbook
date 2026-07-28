import type { GuestbookEntry } from "@/lib/supabase";
import { PostActions } from "@/components/PostActions";

function formatEntryDate(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export function GuestCard({ entry }: { entry: GuestbookEntry }) {
  return (
    <div className="flex w-full flex-col gap-1.5 rounded-[14px] border border-[#e3e6f0] bg-white px-4 py-3.5">
      <div className="flex w-full items-start justify-between">
        <p className="text-[14px] font-bold text-[#2f3c7e]">{entry.name}</p>
        <p className="text-[11.5px] font-normal text-[#6b7280]">
          {formatEntryDate(entry.created_at)}
        </p>
      </div>
      <p className="w-full break-words text-[14px] font-normal text-[#1f2430]">
        {entry.message}
      </p>
      <PostActions id={entry.id} likes={entry.likes} />
    </div>
  );
}
