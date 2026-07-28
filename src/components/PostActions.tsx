"use client";

import { useState, useTransition } from "react";
import { deletePost, setPostLiked } from "@/app/actions";

export function PostActions({
  id,
  likes,
}: {
  id: string;
  likes: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [hasLiked, setHasLiked] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-1 pt-1">
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            const nextLiked = !hasLiked;
            setHasLiked(nextLiked);
            startTransition(() => {
              setPostLiked(id, nextLiked);
            });
          }}
          className="flex items-center gap-1 text-[12.5px] font-medium text-[#f96167] disabled:opacity-60"
        >
          {hasLiked ? "❤️" : "🤍"} {likes}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (!window.confirm("이 방명록을 삭제할까요?")) return;

            setDeleteError(null);
            startTransition(async () => {
              const result = await deletePost(id);
              if (result?.error) {
                setDeleteError("삭제하지 못했어요. 다시 시도해 주세요.");
              }
            });
          }}
          className="text-[12.5px] font-normal text-[#9ca3af] hover:text-[#6b7280] disabled:opacity-60"
        >
          삭제
        </button>
      </div>

      {deleteError && (
        <p className="text-[11.5px] text-[#f96167]">{deleteError}</p>
      )}
    </div>
  );
}
