begin;

alter table public.vocabulary enable row level security;
alter table public.review_events enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_settings enable row level security;

revoke all on table public.vocabulary from anon, authenticated;
revoke all on table public.review_events from anon, authenticated;
revoke all on table public.user_progress from anon, authenticated;
revoke all on table public.user_settings from anon, authenticated;

revoke all on sequence public.vocabulary_id_seq from anon, authenticated;
revoke all on sequence public.review_events_id_seq from anon, authenticated;

grant select on table public.vocabulary to authenticated;
grant select, insert on table public.review_events to authenticated;
grant select, insert, update on table public.user_progress to authenticated;
grant select, insert, update on table public.user_settings to authenticated;
grant usage, select on sequence public.review_events_id_seq to authenticated;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.set_updated_at() to postgres, service_role;

drop policy if exists vocabulary_select_authenticated on public.vocabulary;
create policy vocabulary_select_authenticated
on public.vocabulary
for select
to authenticated
using (true);

drop policy if exists review_events_select_own on public.review_events;
create policy review_events_select_own
on public.review_events
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists review_events_insert_own on public.review_events;
create policy review_events_insert_own
on public.review_events
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists user_progress_select_own on public.user_progress;
create policy user_progress_select_own
on public.user_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists user_progress_insert_own on public.user_progress;
create policy user_progress_insert_own
on public.user_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists user_progress_update_own on public.user_progress;
create policy user_progress_update_own
on public.user_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists user_settings_select_own on public.user_settings;
create policy user_settings_select_own
on public.user_settings
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists user_settings_insert_own on public.user_settings;
create policy user_settings_insert_own
on public.user_settings
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists user_settings_update_own on public.user_settings;
create policy user_settings_update_own
on public.user_settings
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;
