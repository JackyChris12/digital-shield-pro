// Platform-specific alert types for real social media integration
export type Platform = 'twitter' | 'instagram' | 'whatsapp' | 'email' | 'web';

export type ThreatType =
    | 'harassment'
    | 'hate_speech'
    | 'sexual_content'
    | 'doxing'
    | 'threats'
    | 'stalking'
    | 'impersonation';

export type AlertType = 'emergency' | 'medical' | 'security' | 'fire' | 'natural_disaster' | 'threat_detection';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'reviewed' | 'resolved' | 'escalated' | 'false_alarm';
export type TriggerSource = 'user' | 'system' | 'integration' | 'ai_detection';
export type DeviceSource = 'mobile_app' | 'web_app' | 'iot_device' | 'wearable' | 'smart_home';

// Platform-specific content data
export interface ContentData {
    message: string;
    sender: string; // @username, phone number, or email
    media_urls?: string[];
    timestamp: string;
    platform_message_id?: string;
}

// AI threat analysis
export interface AIAnalysis {
    toxicity_score: number; // 0.0 to 1.0
    categories: ThreatType[];
    confidence: number; // 0.0 to 1.0
    flagged_keywords: string[];
    severity_justification: string;
}

// User actions taken
export type UserAction =
    | 'blocked_sender'
    | 'reported_platform'
    | 'escalated_authorities'
    | 'notified_safe_circle'
    | 'archived'
    | 'marked_safe';

export interface ActionTimeline {
    action: UserAction;
    timestamp: string;
    automated: boolean;
    details?: string;
}

export interface GeoLocation {
    coordinates: {
        lat: number;
        lng: number;
    };
    address: string;
    ip_address?: string;
    approximate_location?: string;
}

export interface SafeCircleResponse {
    contactName: string;
    response: 'acknowledged' | 'on_way' | 'contacted_authorities' | 'no_response';
    timestamp?: string;
    method: 'sms' | 'call' | 'app';
}

export interface SafeCircleData {
    notified: boolean;
    notified_count: number;
    responses: SafeCircleResponse[];
    escalated: boolean;
    response_time?: string; // e.g., "00:02:14"
}

export interface IntegrationMetadata {
    platform: string;
    account_id?: string;
    sync_status: 'active' | 'paused' | 'error';
    last_sync?: string;
}

export interface AuditLog {
    action: string;
    user: string;
    timestamp: string;
    details?: string;
}

// Main Alert interface with platform integration
export interface Alert {
    id: string;
    platform: Platform;
    threat_type: ThreatType;
    type: AlertType;
    severity: AlertSeverity;
    status: AlertStatus;

    // Content and sender info
    content: ContentData;

    // AI detection
    ai_analysis: AIAnalysis;

    // Location and context
    location: GeoLocation;
    source: DeviceSource;
    trigger: TriggerSource;

    // Safe Circle integration
    safeCircle: SafeCircleData;

    // Actions and timeline
    user_actions: ActionTimeline[];

    // Metadata
    timestamp: string;
    description: string;
    integration?: IntegrationMetadata;
    auditLog?: AuditLog[];
}
