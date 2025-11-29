export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  email?: string;
  emergency_contacts: EmergencyContact[];
  safety_preferences: SafetyPreferences;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
}

export interface SafetyPreferences {
  language: string;
  accessibility: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface SocialPlatform {
  id: string;
  platform_name: string;
  is_active: boolean;
  last_sync_at?: string;
  safety_score: number;
  risk_level: 'low' | 'medium' | 'high';
  privacy_checklist: PrivacyItem[];
  quick_tips: string[];
}

export interface PrivacyItem {
  id: string;
  title: string;
  completed: boolean;
  description: string;
}

export interface PrivacySettings {
  data_sharing: boolean;
  location_sharing: boolean;
  emergency_data_access: boolean;
  data_export_enabled: boolean;
}

export interface NotificationPreferences {
  alert_notifications: boolean;
  safe_circle_notifications: boolean;
  emergency_alerts: boolean;
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface EmergencyProtocols {
  emergency_button_customization: {
    label: string;
    color: string;
  };
  auto_alert_triggers: string[];
  safe_circle_escalation: boolean;
  backup_safety_plans: BackupPlan[];
}

export interface BackupPlan {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}
