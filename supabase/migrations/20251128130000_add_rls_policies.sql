-- Check if policies already exist and drop them if they do
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can insert their own events" ON public.emergency_events;
    DROP POLICY IF EXISTS "Users can insert notifications for their own events" ON public.emergency_notifications;
    DROP POLICY IF EXISTS "Users can update notifications for their own events" ON public.emergency_notifications;
END $$;

-- Allow users to insert their own events
CREATE POLICY "Users can insert their own events"
ON public.emergency_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to insert notifications for their own events
CREATE POLICY "Users can insert notifications for their own events"
ON public.emergency_notifications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.emergency_events
    WHERE emergency_events.id = emergency_notifications.event_id
    AND emergency_events.user_id = auth.uid()
  )
);

-- Allow users to update notifications for their own events
CREATE POLICY "Users can update notifications for their own events"
ON public.emergency_notifications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.emergency_events
    WHERE emergency_events.id = emergency_notifications.event_id
    AND emergency_events.user_id = auth.uid()
  )
);
