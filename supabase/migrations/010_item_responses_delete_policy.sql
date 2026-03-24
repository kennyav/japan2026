-- Allow members to remove their own response row (e.g. un-book without forcing another status).
drop policy if exists "Members can delete own responses" on public.item_responses;

create policy "Members can delete own responses"
  on public.item_responses for delete
  to authenticated
  using (auth.uid() = user_id);
