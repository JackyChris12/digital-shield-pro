import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertTriangle, X } from "lucide-react";

interface Notification {
    id: string;
    contact_id: string;
    status: 'pending' | 'sent' | 'failed' | 'responded';
    contact: {
        name: string;
        phone: string | null;
        email: string | null;
    };
}

const EmergencyStatus = () => {
    const [activeEvent, setActiveEvent] = useState<any>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        loadActiveEmergency();

        const eventChannel = supabase
            .channel('emergency-events')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'emergency_events' },
                (payload) => {
                    if (payload.new) {
                        setActiveEvent(payload.new);
                        setDismissed(false);
                        loadNotifications(payload.new.id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(eventChannel);
        };
    }, []);

    useEffect(() => {
        if (!activeEvent) return;

        const notificationChannel = supabase
            .channel(`notifications-${activeEvent.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'emergency_notifications',
                    filter: `event_id=eq.${activeEvent.id}`
                },
                () => {
                    loadNotifications(activeEvent.id);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(notificationChannel);
        };
    }, [activeEvent]);

    const loadActiveEmergency = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

            const { data, error } = await supabase
                .from('emergency_events')
                .select('*')
                .eq('user_id', user.id)
                .gte('triggered_at', oneHourAgo)
                .order('triggered_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setActiveEvent(data);
                loadNotifications(data.id);
            } else {
                setActiveEvent(null);
            }
        } catch (error) {
            console.error("Error loading emergency:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadNotifications = async (eventId: string) => {
        try {
            const { data, error } = await supabase
                .from('emergency_notifications')
                .select(`
          *,
          contact:emergency_contacts(name, phone, email)
        `)
                .eq('event_id', eventId);

            if (error) throw error;
            setNotifications(data as any || []);
        } catch (error) {
            console.error("Error loading notifications:", error);
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
    };

    if (loading) return null;
    if (!activeEvent || dismissed) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'responded': return <CheckCircle className="w-4 h-4 text-blue-500" />;
            default: return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
        }
    };

    return (
        <Card className="p-4 border-destructive/50 bg-destructive/5 mb-6 animate-in fade-in slide-in-from-top-4 relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10"
                onClick={handleDismiss}
            >
                <X className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-between mb-4 pr-8">
                <div className="flex items-center gap-2 text-destructive font-bold">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                    <span>Emergency Active</span>
                </div>
                <Badge variant="outline" className="border-destructive text-destructive">
                    Live Tracking
                </Badge>
            </div>

            <div className="space-y-3">
                {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                            {getStatusIcon(notif.status)}
                            <div>
                                <p className="font-medium text-sm">{notif.contact.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {notif.contact.phone || notif.contact.email}
                                </p>
                            </div>
                        </div>
                        <Badge variant={notif.status === 'sent' ? 'default' : 'secondary'} className="capitalize">
                            {notif.status}
                        </Badge>
                    </div>
                ))}
                {notifications.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                        Initializing alerts...
                    </p>
                )}
            </div>
        </Card>
    );
};

export default EmergencyStatus;
