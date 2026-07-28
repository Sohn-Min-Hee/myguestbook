-- 이미 posts 테이블을 만든 프로젝트에 좋아요(토글)/삭제 기능을 추가하는 마이그레이션
-- Supabase SQL Editor에서 그대로 실행하세요.

alter table public.posts
  add column if not exists likes integer not null default 0;

drop policy if exists "Anyone can delete posts" on public.posts;
create policy "Anyone can delete posts"
  on public.posts
  for delete
  to anon
  using (true);

-- 기존에 increment_post_likes(uuid)로 만들었다면 정리하고 토글 지원 함수로 교체
drop function if exists public.increment_post_likes(uuid);

create or replace function public.adjust_post_likes(post_id uuid, delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes integer;
begin
  update public.posts
  set likes = greatest(0, likes + delta)
  where id = post_id
  returning likes into new_likes;

  return new_likes;
end;
$$;

grant execute on function public.adjust_post_likes(uuid, integer) to anon;
