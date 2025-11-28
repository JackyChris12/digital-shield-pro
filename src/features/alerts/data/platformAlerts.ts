import { Alert, Platform, ThreatType } from '../types';

// Helper to generate platform-specific sender info
const generateSender = (platform: Platform): string => {
    switch (platform) {
        case 'twitter': return `@${['stalker_acc', 'toxic_user92', 'harasser_x', 'anon_threat', 'badactor123'][Math.floor(Math.random() * 5)]}`;
        case 'instagram': return `@${['creepy_follower', 'fake_account_', 'threatener99', 'stalker_insta', 'hate_page'][Math.floor(Math.random() * 5)]}`;
        case 'whatsapp': return `+254${Math.floor(Math.random() * 900000000 + 100000000)}`;
        case 'email': return `${['suspicious', 'phishing', 'scammer', 'fraudster', 'harasser'][Math.floor(Math.random() * 5)]}@${['gmail.com', 'yahoo.com', 'tempmail.com'][Math.floor(Math.random() * 3)]}`;
        case 'web': return 'Anonymous';
    }
};

// Real harassment messages (content-warned)
const threatMessages: Record<ThreatType, string[]> = {
    harassment: [
        "I know where you live. You better watch your back.",
        "You're so disgusting. Delete your account.",
        "I'll make sure everyone knows what a fraud you are.",
        "Stop posting or you'll regret it.",
        "You don't deserve to exist online."
    ],
    hate_speech: [
        "[FLAGGED CONTENT: Ethnic slurs and derogatory language]",
        "[FLAGGED CONTENT: Religious hate speech]",
        "[FLAGGED CONTENT: Discriminatory remarks]"
    ],
    sexual_content: [
        "[FLAGGED CONTENT: Unwanted sexual advances]",
        "[FLAGGED CONTENT: Explicit inappropriate content]",
        "Send me pics or I'll leak your info."
    ],
    doxing: [
        "Here's her address: [REDACTED]. Let's pay a visit.",
        "I found her phone number: [REDACTED]",
        "Check out her workplace info I dug up..."
    ],
    threats: [
        "I'm coming for you tonight.",
        "You have 24 hours to comply or else.",
        "Watch your car when you leave work tomorrow."
    ],
    stalking: [
        "Saw you at the coffee shop on 5th street today.",
        "Nice blue dress you wore yesterday.",
        "I know your routine. I'm watching."
    ],
    impersonation: [
        "I created an account pretending to be you.",
        "People think this fake profile is really you.",
        "Your identity is being used without permission."
    ]
};

// Generate platform-integrated alerts
const generatePlatformAlert = (platform: Platform, index: number): Alert => {
    const threatTypes: ThreatType[] = ['harassment', 'hate_speech', 'sexual_content', 'doxing', 'threats', 'stalking', 'impersonation'];
    const threat_type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const severities = ['critical', 'high', 'medium', 'low'] as const;
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const statuses = ['active', 'reviewed', 'resolved'] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const messages = threatMessages[threat_type];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const sender = generateSender(platform);

    const toxicity_score = severity === 'critical' ? 0.85 + Math.random() * 0.15 :
        severity === 'high' ? 0.65 + Math.random() * 0.2 :
            severity === 'medium' ? 0.45 + Math.random() * 0.2 : 0.2 + Math.random() * 0.25;

    const hoursAgo = Math.floor(Math.random() * 48);
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

    const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];
    const city = cities[Math.floor(Math.random() * cities.length)];

    const responseTime = `00:${String(Math.floor(Math.random() * 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;

    const actions: Alert['user_actions'] = [];
    if (status !== 'active') {
        actions.push({
            action: 'notified_safe_circle',
            timestamp: new Date(new Date(timestamp).getTime() + 30000).toISOString(),
            automated: true,
            details: 'Safe Circle notified via SMS and app'
        });
    }
    if (status === 'resolved') {
        actions.push({
            action: 'blocked_sender',
            timestamp: new Date(new Date(timestamp).getTime() + 120000).toISOString(),
            automated: true,
            details: `Blocked ${sender} on ${platform}`
        });
        actions.push({
            action: 'reported_platform',
            timestamp: new Date(new Date(timestamp).getTime() + 180000).toISOString(),
            automated: false,
            details: `Reported to ${platform} moderation team`
        });
    }

    return {
        id: `ALT-${Date.now() - (index * 100000)}-${platform.toUpperCase()}`,
        platform,
        threat_type,
        type: 'threat_detection',
        severity,
        status,
        content: {
            message,
            sender,
            media_urls: Math.random() > 0.7 ? ['https://placehold.co/400x300/png'] : undefined,
            timestamp,
            platform_message_id: `${platform}_${Math.random().toString(36).substring(7)}`
        },
        ai_analysis: {
            toxicity_score,
            categories: [threat_type],
            confidence: 0.75 + Math.random() * 0.24,
            flagged_keywords: threat_type === 'harassment' ? ['threat', 'watch', 'regret'] :
                threat_type === 'doxing' ? ['address', 'phone', 'info'] :
                    threat_type === 'threats' ? ['coming', 'hours', 'else'] : ['flagged', 'content'],
            severity_justification: `High confidence ${threat_type} detected with ${Math.round(toxicity_score * 100)}% toxicity score`
        },
        location: {
            coordinates: {
                lat: -1.2921 + (Math.random() - 0.5) * 2,
                lng: 36.8219 + (Math.random() - 0.5) * 2
            },
            address: `${Math.floor(Math.random() * 999) + 1} ${['Kenyatta Ave', 'Moi Ave', 'Uhuru Hwy', 'Ngong Rd'][Math.floor(Math.random() * 4)]}, ${city}, Kenya`,
            ip_address: `41.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            approximate_location: `${city}, Kenya`
        },
        source: 'mobile_app',
        trigger: 'ai_detection',
        safeCircle: {
            notified: status !== 'active',
            notified_count: Math.floor(Math.random() * 3) + 3,
            responses: status !== 'active' ? [
                {
                    contactName: 'Sarah Kimani',
                    response: 'acknowledged',
                    timestamp: new Date(new Date(timestamp).getTime() + 45000).toISOString(),
                    method: 'app'
                },
                {
                    contactName: 'John Omondi',
                    response: 'on_way',
                    timestamp: new Date(new Date(timestamp).getTime() + 90000).toISOString(),
                    method: 'sms'
                },
                {
                    contactName: 'Grace Wanjiku',
                    response: severity === 'critical' ? 'contacted_authorities' : 'acknowledged',
                    timestamp: new Date(new Date(timestamp).getTime() + 120000).toISOString(),
                    method: 'call'
                }
            ] : [],
            escalated: severity === 'critical' && status === 'resolved',
            response_time: status !== 'active' ? responseTime : undefined
        },
        user_actions: actions,
        timestamp,
        description: `${platform.toUpperCase()} ${threat_type}: ${message.substring(0, 50)}...`,
        integration: {
            platform: platform.toUpperCase(),
            account_id: `user_${Math.random().toString(36).substring(7)}`,
            sync_status: 'active',
            last_sync: new Date(Date.now() - Math.random() * 300000).toISOString()
        }
    };
};

// Generate 200+ realistic alerts from all platforms
export const platformAlerts: Alert[] = [
    // Twitter threats (40)
    ...Array.from({ length: 40 }, (_, i) => generatePlatformAlert('twitter', i)),
    // Instagram harassment (40)
    ...Array.from({ length: 40 }, (_, i) => generatePlatformAlert('instagram', i + 40)),
    // WhatsApp threats (40)
    ...Array.from({ length: 40 }, (_, i) => generatePlatformAlert('whatsapp', i + 80)),
    // Email phishing (40)
    ...Array.from({ length: 40 }, (_, i) => generatePlatformAlert('email', i + 120)),
    // Web-based threats (40)
    ...Array.from({ length: 40 }, (_, i) => generatePlatformAlert('web', i + 160))
];

export default platformAlerts;
