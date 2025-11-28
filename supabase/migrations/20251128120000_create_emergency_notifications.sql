create type notification_status as enum ('pending', 'sent', 'failed', 'responded');

create table public.emergency_notifications (
  id uuid not null default gen_random_uuid(),
  event_id uuid not null references public.emergency_events(id) on delete cascade,
  contact_id uuid not null references public.emergency_contacts(id) on delete cascade,
  status notification_status not null default 'pending',
  sent_at timestamp with time zone,
  updated_at timestamp with time zone default now(),
  constraint emergency_notifications_pkey primary key (id)
);

alter table public.emergency_notifications enable row level security;

create policy "Users can view their own notifications"
on public.emergency_notifications
for select
using (
  exists (
    select 1 from public.emergency_events
    where emergency_events.id = emergency_notifications.event_id
    and emergency_events.user_id = auth.uid()
  )
);
