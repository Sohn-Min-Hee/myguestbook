import { isSupabaseConfigured, supabase, type GuestbookEntry } from "@/lib/supabase";
import { GuestbookForm } from "@/components/GuestbookForm";
import { GuestCard } from "@/components/GuestCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let entries: GuestbookEntry[] = [];
  let errorMessage: string | null = null;

  if (!isSupabaseConfigured || !supabase) {
    errorMessage =
      "Supabase가 아직 연결되지 않았어요. .env.local에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해 주세요.";
  } else {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      errorMessage = "방명록을 불러오지 못했어요. Supabase 설정을 확인해 주세요.";
    } else {
      entries = (data ?? []) as GuestbookEntry[];
    }
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-[#f4f5fa]">
      <div className="flex w-full max-w-[375px] flex-col items-start gap-4 px-5 py-7">
        <header className="flex w-full flex-col items-center gap-1.5">
          <p className="text-[22px] font-bold text-[#2f3c7e]">
            📮 나의 방명록
          </p>
          <p className="text-[13px] font-normal text-[#6b7280]">
            10초 안에 흔적을 남겨주세요
          </p>
        </header>

        <GuestbookForm />

        <section className="flex w-full flex-col items-start gap-3">
          {errorMessage && (
            <p className="w-full text-center text-[13px] text-[#f96167]">
              {errorMessage}
            </p>
          )}

          {!errorMessage && entries.length === 0 && (
            <p className="w-full text-center text-[13px] text-[#6b7280]">
              아직 남겨진 메시지가 없어요. 첫 방명록을 남겨보세요!
            </p>
          )}

          {entries.map((entry) => (
            <GuestCard key={entry.id} entry={entry} />
          ))}
        </section>
      </div>
    </div>
  );
}
