import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { safeCircleService, NotificationRecord } from "@/services/SafeCircleService";

const NotificationHistory = () => {
    const [history, setHistory] = useState<NotificationRecord[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const records = await safeCircleService.getNotificationHistory();
        setHistory(records.slice(0, 10)); // Show latest 10
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Recent Notifications</h2>
            </div>

            <div className="space-y-3">
                {history.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No notifications sent yet.
                    </p>
                ) : (
                    history.map((record) => (
                        <div
                            key={record.id}
                            className="p-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <Badge
                                    variant={record.type === 'emergency' ? 'destructive' : 'default'}
                                    className="text-xs"
                                >
                                    {record.type === 'emergency' ? '🚨 EMERGENCY' : '🔔 Alert'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(record.timestamp)}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {record.message.split('\n').slice(0, 3).join('\n')}...
                            </p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default NotificationHistory;
