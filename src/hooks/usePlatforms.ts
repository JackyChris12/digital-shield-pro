import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SocialPlatform } from "@/types/settings";

export const usePlatforms = () => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform database data to SocialPlatform format
      const transformedPlatforms: SocialPlatform[] = data.map(platform => ({
        id: platform.id,
        platform_name: platform.platform_name,
        is_active: platform.is_active,
        last_sync_at: platform.last_sync_at,
        safety_score: calculateSafetyScore(platform), // Mock calculation
        risk_level: getRiskLevel(platform),
        privacy_checklist: getPrivacyChecklist(platform.platform_name),
        quick_tips: getQuickTips(platform.platform_name)
      }));

      setPlatforms(transformedPlatforms);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platformName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in first');
        return;
      }

      // Real OAuth URLs - Replace YOUR_CLIENT_ID and YOUR_REDIRECT_URI with actual values
      const oauthUrls = {
        twitter: `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=YOUR_TWITTER_CLIENT_ID&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&scope=tweet.read%20users.read%20follows.read&state=state&code_challenge=challenge&code_challenge_method=S256`,
        instagram: `https://api.instagram.com/oauth/authorize?client_id=YOUR_INSTAGRAM_CLIENT_ID&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&scope=user_profile,user_media&response_type=code`,
        facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_FACEBOOK_CLIENT_ID&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&scope=email,public_profile,user_friends`,
        whatsapp: `https://api.whatsapp.com/oauth/authorize?client_id=YOUR_WHATSAPP_CLIENT_ID&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&scope=whatsapp_business_management`,
        tiktok: `https://www.tiktok.com/auth/authorize?client_key=YOUR_TIKTOK_CLIENT_KEY&scope=user.info.basic,video.list&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&state=state`
      };

      const oauthUrl = oauthUrls[platformName as keyof typeof oauthUrls];

      if (!oauthUrl) {
        alert(`OAuth not configured for ${platformName}`);
        return;
      }

      // Open OAuth URL in new tab for user to authorize
      window.open(oauthUrl, '_blank', 'width=600,height=600');

      // Listen for callback (in real app, handle redirect_uri callback)
      // For demo, simulate success after 3 seconds
      setTimeout(async () => {
        try {
          const { data, error } = await supabase
            .from('platforms')
            .upsert({
              user_id: user.id,
              platform_name: platformName,
              is_active: true,
              last_sync_at: new Date().toISOString(),
              access_token: `auth_token_${Date.now()}`, // Store real token from callback
            })
            .select()
            .single();

          if (error) throw error;

          // Update local state
          const newPlatform: SocialPlatform = {
            id: data.id,
            platform_name: data.platform_name,
            is_active: true,
            last_sync_at: data.last_sync_at,
            safety_score: 75, // Initial score
            risk_level: 'medium',
            privacy_checklist: getPrivacyChecklist(platformName),
            quick_tips: getQuickTips(platformName)
          };

          setPlatforms(prev => [...prev, newPlatform]);

          alert(`${platformName} connected successfully! You can now manage your platform settings.`);
        } catch (error) {
          console.error('Error connecting platform:', error);
          alert('Failed to connect platform. Please try again.');
        }
      }, 3000); // Simulate OAuth completion time
    } catch (error) {
      console.error('Error connecting platform:', error);
      alert('Failed to connect platform. Please try again.');
    }
  };

  const updatePlatform = async (platformId: string, updates: Partial<SocialPlatform>) => {
    try {
      const { error } = await supabase
        .from('platforms')
        .update({
          is_active: updates.is_active,
          last_sync_at: updates.last_sync_at
        })
        .eq('id', platformId);

      if (error) throw error;

      setPlatforms(prev => prev.map(p =>
        p.id === platformId ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error('Error updating platform:', error);
    }
  };

  return {
    platforms,
    loading,
    connectPlatform,
    updatePlatform,
    refetch: fetchPlatforms
  };
};

// Mock functions for safety calculations
const calculateSafetyScore = (platform: any): number => {
  // Mock calculation based on connection status
  return platform.is_active ? Math.floor(Math.random() * 40) + 60 : 0;
};

const getRiskLevel = (platform: any): 'low' | 'medium' | 'high' => {
  const score = calculateSafetyScore(platform);
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  return 'high';
};

const getPrivacyChecklist = (platformName: string) => {
  const checklists: Record<string, any[]> = {
    twitter: [
      { id: "1", title: "Private Account", completed: false, description: "Make your account private" },
      { id: "2", title: "Location Services", completed: false, description: "Disable location sharing" },
      { id: "3", title: "Two-Factor Auth", completed: false, description: "Enable 2FA" },
    ],
    instagram: [
      { id: "4", title: "Account Privacy", completed: false, description: "Switch to private account" },
      { id: "5", title: "Story Controls", completed: false, description: "Limit story replies" },
    ],
    facebook: [
      { id: "6", title: "Privacy Settings", completed: false, description: "Review privacy settings" },
    ],
    whatsapp: [
      { id: "7", title: "Read Receipts", completed: false, description: "Disable read receipts" },
      { id: "8", title: "Last Seen", completed: false, description: "Hide last seen" },
    ],
    tiktok: [
      { id: "9", title: "Account Privacy", completed: false, description: "Set account to private" },
    ]
  };
  return checklists[platformName] || [];
};

const getQuickTips = (platformName: string): string[] => {
  const tips: Record<string, string[]> = {
    twitter: [
      "Don't share personal information publicly",
      "Use strong passwords",
      "Be cautious with DMs from strangers"
    ],
    instagram: [
      "Review tagged photos before approving",
      "Don't accept requests from strangers",
      "Use close friends for sensitive content"
    ],
    facebook: [
      "Adjust privacy settings regularly",
      "Limit audience for personal posts",
      "Use safety check feature"
    ],
    whatsapp: [
      "Don't share phone number publicly",
      "Block and report spam",
      "Use disappearing messages"
    ],
    tiktok: [
      "Set account to private",
      "Disable duets and stitches",
      "Be mindful of location data"
    ]
  };
  return tips[platformName] || [];
};
