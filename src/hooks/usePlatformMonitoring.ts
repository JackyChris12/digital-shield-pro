import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useThreatDetection } from "./useThreatDetection";

export const usePlatformMonitoring = () => {
  const { analyzeContent } = useThreatDetection();

  useEffect(() => {
    startMonitoring();
  }, []);

  const startMonitoring = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get active platforms
      const { data: platforms, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      // Start monitoring each platform
      platforms.forEach(platform => {
        monitorPlatform(platform);
      });

    } catch (error) {
      console.error('Error starting platform monitoring:', error);
    }
  };

  const monitorPlatform = async (platform: any) => {
    try {
      switch (platform.platform_name) {
        case 'twitter':
          await monitorTwitter(platform);
          break;
        case 'instagram':
          await monitorInstagram(platform);
          break;
        case 'facebook':
          await monitorFacebook(platform);
          break;
        case 'whatsapp':
          await monitorWhatsApp(platform);
          break;
        case 'tiktok':
          await monitorTikTok(platform);
          break;
      }
    } catch (error) {
      console.error(`Error monitoring ${platform.platform_name}:`, error);
    }
  };

  const monitorTwitter = async (platform: any) => {
    // Twitter API monitoring
    try {
      const response = await fetch(`https://api.twitter.com/2/users/${platform.user_id}/mentions`, {
        headers: {
          'Authorization': `Bearer ${platform.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Analyze mentions for threats
        data.data?.forEach((mention: any) => {
          analyzeContent('twitter', mention.text, mention.author_id);
        });
      }
    } catch (error) {
      console.error('Twitter monitoring error:', error);
    }
  };

  const monitorInstagram = async (platform: any) => {
    // Instagram API monitoring
    try {
      const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,comments&access_token=${platform.access_token}`);

      if (response.ok) {
        const data = await response.json();
        // Analyze comments for threats
        data.data?.forEach((post: any) => {
          post.comments?.data?.forEach((comment: any) => {
            analyzeContent('instagram', comment.text, comment.from.username);
          });
        });
      }
    } catch (error) {
      console.error('Instagram monitoring error:', error);
    }
  };

  const monitorFacebook = async (platform: any) => {
    // Facebook API monitoring
    try {
      const response = await fetch(`https://graph.facebook.com/me/feed?access_token=${platform.access_token}`);

      if (response.ok) {
        const data = await response.json();
        // Analyze posts and comments for threats
        data.data?.forEach((post: any) => {
          analyzeContent('facebook', post.message || post.story, post.from.name);
        });
      }
    } catch (error) {
      console.error('Facebook monitoring error:', error);
    }
  };

  const monitorWhatsApp = async (platform: any) => {
    // WhatsApp Business API monitoring
    // This would typically be webhook-based, but for demo we'll simulate
    console.log('WhatsApp monitoring active - webhooks would handle real-time messages');
  };

  const monitorTikTok = async (platform: any) => {
    // TikTok API monitoring
    try {
      const response = await fetch(`https://open-api.tiktok.com/research/video/query/?fields=id,video_description,create_time&access_token=${platform.access_token}`);

      if (response.ok) {
        const data = await response.json();
        // Analyze video descriptions and comments for threats
        data.data?.videos?.forEach((video: any) => {
          analyzeContent('tiktok', video.video_description, video.creator_username);
        });
      }
    } catch (error) {
      console.error('TikTok monitoring error:', error);
    }
  };

  // Set up periodic monitoring (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      startMonitoring();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    startMonitoring,
    monitorPlatform
  };
};
