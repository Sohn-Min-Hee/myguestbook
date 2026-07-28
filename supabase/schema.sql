-- posts table (방명록)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

alter table public.posts enable row level security;

-- 방명록이니까: 누구나 읽기 가능
create policy "Anyone can read posts"
  on public.posts
  for select
  to anon
  using (true);

-- 방명록이니까: 누구나 쓰기 가능 (로그인 없음)
create policy "Anyone can insert posts"
  on public.posts
  for insert
  to anon
  with check (
    char_length(trim(name)) > 0
    and char_length(trim(message)) > 0
    and char_length(name) <= 50
    and char_length(message) <= 500
  );

-- 방명록이니까: 누구나 삭제 가능 (로그인 없음 — 작성자 구분이 없어 누구든 지울 수 있음)
create policy "Anyone can delete posts"
  on public.posts
  for delete
  to anon
  using (true);

-- 좋아요: RLS를 우회해 likes만 안전하게 +1/-1 하는 함수 (다른 컬럼은 손댈 수 없음, 0 미만으로는 안 내려감)
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
