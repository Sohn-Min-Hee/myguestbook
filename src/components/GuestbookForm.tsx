"use client";

import { useActionState, useEffect, useRef } from "react";
import { addGuestbookEntry, type GuestbookFormState } from "@/app/actions";

const initialState: GuestbookFormState = {};

export function GuestbookForm() {
  const [state, formAction, isPending] = useActionState(
    addGuestbookEntry,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex w-full flex-col gap-2.5 rounded-[14px] border border-[#e3e6f0] bg-white p-4"
    >
      <input
        name="name"
        type="text"
        placeholder="이름"
        maxLength={50}
        aria-label="이름"
        className="w-full rounded-lg border border-[#e3e6f0] bg-white px-3 py-2.5 text-[14px] text-[#1f2430] placeholder-[#9ca3af] outline-none focus:border-[#f96167]"
      />

      <textarea
        name="message"
        placeholder="메시지를 남겨주세요"
        maxLength={500}
        aria-label="메시지"
        rows={3}
        className="h-[72px] w-full resize-none rounded-lg border border-[#e3e6f0] bg-white px-3 py-2.5 text-[14px] text-[#1f2430] placeholder-[#9ca3af] outline-none focus:border-[#f96167]"
      />

      {state.error && (
        <p role="alert" className="text-[12.5px] font-normal text-[#f96167]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center rounded-lg bg-[#f96167] py-3 text-[15px] font-bold text-white transition disabled:opacity-60"
      >
        {isPending ? "등록 중..." : "남기기"}
      </button>
    </form>
  );
}
