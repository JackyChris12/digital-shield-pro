-- ============================================
-- Migration: Update Alerts Table Schema
-- Date: 2025-11-28
-- Description: Update alerts table to match application requirements
-- ============================================

-- Drop the old alerts table and recreate with the new schema
DROP TABLE IF EXISTS public.alerts CASCADE;

-- Create alerts table with the correct schema
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'email')),
  threat_type TEXT NOT NULL CHECK (threat_type IN ('harassment', 'hate_speech', 'sexual_content', 'cyberbullying', 'phishing', 'impersonation', 'spam')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  message_content TEXT NOT NULL,
  sender_handle TEXT NOT NULL,
  toxicity_score FLOAT NOT NULL CHECK (toxicity_score >= 0 AND toxicity_score <= 1),
  confidence_score FLOAT NOT NULL DEFAULT 0.0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  safe_circle_notified BOOLEAN NOT NULL DEFAULT false,
  safe_circle_responses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON public.alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at timestamp  
CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- Create indexes for better query performance
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_platform ON public.alerts(platform);

-- Insert some sample demo data (optional - remove if you don't want seed data)
-- This will only work if you have a user in your auth.users table
/*
DO $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Get the first user ID from auth.users
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  IF sample_user_id IS NOT NULL THEN
    INSERT INTO public.alerts (
      user_id, platform, threat_type, severity, status,
      message_content, sender_handle, toxicity_score, confidence_score,
      safe_circle_notified, safe_circle_responses
    ) VALUES
    (sample_user_id, 'twitter', 'harassment', 'high', 'active', 
     'You are such a loser, why don''t you just give up?', '@troll_master', 0.87, 0.92, true, 2),
    (sample_user_id, 'instagram', 'hate_speech', 'critical', 'active',
     'People like you don''t belong here.', '@hater_99', 0.94, 0.89, true, 3),
    (sample_user_id, 'tiktok', 'sexual_content', 'medium', 'acknowledged',
     'Hey sexy, wanna chat?', '@creepy_dm', 0.72, 0.85, false, 0);
  END IF;
END $$;
*/
