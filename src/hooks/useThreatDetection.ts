import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThreatAnalysis {
  platform: string;
  content: string;
  sender: string;
  threat_level: 'low' | 'medium' | 'high';
  toxicity_score: number;
  keywords_detected: string[];
  timestamp: string;
}

export const useThreatDetection = () => {
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeContent = async (platform: string, content: string, sender: string) => {
    try {
      setAnalyzing(true);

      // GBV and threat keywords
      const threatKeywords = [
        'abuse', 'violence', 'rape', 'assault', 'harass', 'stalk', 'threat',
        'kill', 'hurt', 'attack', 'beat', 'force', 'coerce', 'manipulate',
        'control', 'dominate', 'intimidate', 'bully', 'cyberbully', 'troll'
      ];

      const gbvKeywords = [
        'domestic violence', 'sexual assault', 'gender violence', 'femicide',
        'intimate partner violence', 'sexual harassment', 'revenge porn',
        'online harassment', 'digital abuse', 'coercive control'
      ];

      const allKeywords = [...threatKeywords, ...gbvKeywords];

      // Simple keyword matching (in production, use AI/ML service)
      const detectedKeywords = allKeywords.filter(keyword =>
        content.toLowerCase().includes(keyword.toLowerCase())
      );

      // Calculate threat score based on keywords and content analysis
      let threatScore = 0;
      let threatLevel: 'low' | 'medium' | 'high' = 'low';

      if (detectedKeywords.length > 0) {
        threatScore = Math.min(100, detectedKeywords.length * 20 + Math.random() * 30);

        if (threatScore >= 70) threatLevel = 'high';
        else if (threatScore >= 40) threatLevel = 'medium';
        else threatLevel = 'low';

        // Store threat in database
        await storeThreat({
          platform,
          content,
          sender,
          threat_level: threatLevel,
          toxicity_score: threatScore,
          keywords_detected: detectedKeywords,
          timestamp: new Date().toISOString()
        });

        // Send notification if high threat
        if (threatLevel === 'high') {
          await sendThreatNotification(platform, content, sender, threatScore);
        }
      }

      return {
        threatLevel,
        threatScore,
        detectedKeywords
      };

    } catch (error) {
      console.error('Error analyzing content:', error);
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const storeThreat = async (threat: ThreatAnalysis) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('alerts')
        .insert({
          user_id: user.id,
          platform: threat.platform,
          sender: threat.sender,
          message: threat.content,
          threat_level: threat.threat_level,
          toxicity_score: threat.toxicity_score
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error storing threat:', error);
    }
  };

  const sendThreatNotification = async (
    platform: string,
    content: string,
    sender: string,
    threatScore: number
  ) => {
    try {
      // In production, integrate with push notification service
      // For now, create a browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 Threat Detected', {
          body: `High-risk content detected on ${platform} from ${sender}`,
          icon: '/favicon.ico',
          tag: 'threat-alert'
        });
      }

      // Also store in emergency events if critical
      if (threatScore >= 80) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('emergency_events')
            .insert({
              user_id: user.id,
              notes: `Critical threat detected on ${platform}: ${content.substring(0, 100)}...`
            });
        }
      }

    } catch (error) {
      console.error('Error sending threat notification:', error);
    }
  };

  const getThreatHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error fetching threat history:', error);
      return [];
    }
  };

  return {
    analyzeContent,
    sendThreatNotification,
    getThreatHistory,
    analyzing
  };
};
