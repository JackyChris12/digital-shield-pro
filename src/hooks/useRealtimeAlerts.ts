import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertSeverity, AlertStatus, AlertType, Platform, ThreatType } from '@/features/alerts/types';
import { Database } from '@/integrations/supabase/types';

type SupabaseAlert = Database['public']['Tables']['alerts']['Row'];

export const useRealtimeAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const mapSupabaseAlertToAlert = (record: SupabaseAlert): Alert => {
        return {
            id: record.id,
            platform: record.platform as Platform,
            threat_type: record.threat_type as ThreatType,
            type: 'threat_detection' as AlertType, // Default
            severity: record.severity as AlertSeverity,
            status: record.status as AlertStatus,
            content: {
                message: record.message_content,
                sender: record.sender_handle,
                timestamp: record.created_at,
            },
            ai_analysis: {
                toxicity_score: record.toxicity_score,
                categories: [record.threat_type as ThreatType],
                confidence: record.confidence_score,
                flagged_keywords: [], // Not in DB
                severity_justification: 'AI Analysis', // Not in DB
            },
            location: { // Not in DB
                coordinates: { lat: 0, lng: 0 },
                address: 'Unknown',
            },
            source: 'web_app', // Default
            trigger: 'ai_detection', // Default
            safeCircle: {
                notified: record.safe_circle_notified,
                notified_count: 0, // Not in DB
                responses: Array(record.safe_circle_responses).fill({ // Mock array based on count
                    contactName: 'Unknown',
                    response: 'acknowledged',
                    method: 'app'
                }),
                escalated: false,
            },
            user_actions: [],
            timestamp: record.created_at,
            description: `Detected ${record.threat_type} on ${record.platform}`,
        };
    };

    const fetchAlerts = async () => {
        try {
            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setAlerts(data.map(mapSupabaseAlertToAlert));
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();

        const channel = supabase
            .channel('public:alerts')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'alerts' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setAlerts((prev) => {
                            if (prev.some(a => a.id === payload.new.id)) return prev;
                            return [mapSupabaseAlertToAlert(payload.new as SupabaseAlert), ...prev];
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        setAlerts((prev) => prev.map((alert) =>
                            alert.id === payload.new.id ? mapSupabaseAlertToAlert(payload.new as SupabaseAlert) : alert
                        ));
                    } else if (payload.eventType === 'DELETE') {
                        setAlerts((prev) => prev.filter((alert) => alert.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addDemoAlert = async () => {
        try {
            const platforms: Platform[] = ['twitter', 'instagram', 'tiktok'];
            const threats: ThreatType[] = ['harassment', 'hate_speech', 'sexual_content'];
            const severities: AlertSeverity[] = ['medium', 'high', 'critical'];

            const harassmentMessages = [
                "You're so pathetic, why don't you just give up?",
                "Nobody likes you, stop posting this garbage.",
                "I know where you live, you better watch your back.",
                "Delete your account, you're an embarrassment.",
                "Why are you even trying? You'll never be good enough."
            ];

            const hateSpeechMessages = [
                "People like you shouldn't be allowed here.",
                "Go back to where you came from.",
                "Your kind is ruining everything.",
                "Disgusting behavior from a [slur].",
                "We don't want your type in our community."
            ];

            const sexualContentMessages = [
                "Check out these private photos I found of you.",
                "I'm going to leak your nudes if you don't reply.",
                "Hey sexy, want to see something fun?",
                "Nice body, shame about the face.",
                "I bet you're wild in bed."
            ];

            const senders = [
                "@bad_actor_99", "@troll_king", "@hater_123", "@anon_user_x",
                "@dark_knight", "@shadow_stalker", "@toxic_avenger", "@silent_threat"
            ];

            const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
            const randomThreat = threats[Math.floor(Math.random() * threats.length)];
            const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
            const randomSender = senders[Math.floor(Math.random() * senders.length)];

            let messageContent = "";
            if (randomThreat === 'harassment') {
                messageContent = harassmentMessages[Math.floor(Math.random() * harassmentMessages.length)];
            } else if (randomThreat === 'hate_speech') {
                messageContent = hateSpeechMessages[Math.floor(Math.random() * hateSpeechMessages.length)];
            } else {
                messageContent = sexualContentMessages[Math.floor(Math.random() * sexualContentMessages.length)];
            }

            // Toxicity: 0.7 - 0.95
            const toxicityScore = 0.7 + Math.random() * 0.25;
            // Confidence: 0.8 - 0.98
            const confidenceScore = 0.8 + Math.random() * 0.18;

            // Get user ID with better error handling
            let userId = 'anon';
            try {
                const { data: { user } } = await supabase.auth.getUser();
                userId = user?.id || 'anon';
            } catch (authError) {
                console.warn('Could not fetch user, using anonymous:', authError);
            }

            const newAlert = {
                platform: randomPlatform,
                threat_type: randomThreat,
                severity: randomSeverity,
                status: 'active',
                message_content: messageContent,
                sender_handle: randomSender,
                toxicity_score: toxicityScore,
                confidence_score: confidenceScore,
                safe_circle_notified: Math.random() > 0.7, // 30% chance
                safe_circle_responses: Math.floor(Math.random() * 2),
                user_id: userId,
            };

            const { error } = await supabase.from('alerts').insert(newAlert);
            if (error) {
                console.error('Error adding demo alert:', error);
                return {
                    error: {
                        message: error.message || 'Failed to add demo alert to database',
                        code: error.code,
                        details: error.details
                    }
                };
            }

            // Fallback: manually fetch if realtime is slow/not working
            await fetchAlerts();
            return { error: null };
        } catch (error: any) {
            // Catch network errors, fetch errors, and other exceptions
            console.error('Failed to add demo alert:', error);

            let errorMessage = 'An unexpected error occurred';

            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                error: {
                    message: errorMessage,
                    code: error.code || 'UNKNOWN_ERROR',
                    details: error.toString()
                }
            };
        }
    };

    const clearAlerts = async () => {
        const { error } = await supabase.from('alerts').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        if (error) console.error('Error clearing alerts:', error);
        else setAlerts([]);
    };

    return { alerts, loading, addDemoAlert, clearAlerts, refetch: fetchAlerts };
};
