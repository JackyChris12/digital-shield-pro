import { mockSocialService, MockComment } from './MockSocialService';
import { safeCircleService } from './SafeCircleService';

export interface ThreatAlert {
    id: string;
    type: 'harassment' | 'hate_speech' | 'threat' | 'cyberbullying';
    severity: 'low' | 'medium' | 'high' | 'critical';
    platform: 'twitter' | 'instagram' | 'tiktok';
    message: string;
    timestamp: Date;
    comment: string;
    author: string;
    postUrl: string;
    status: 'new' | 'reviewed' | 'resolved';
}

class AlertService {
    private alerts: ThreatAlert[] = [];
    private listeners: ((alerts: ThreatAlert[]) => void)[] = [];

    constructor() {
        // Load alerts from localStorage
        const stored = localStorage.getItem('mock_alerts');
        if (stored) {
            this.alerts = JSON.parse(stored, (key, value) => {
                if (key === 'timestamp') return new Date(value);
                return value;
            });
        } else {
            // Initialize with some mock data if empty
            this.alerts = [
                {
                    id: "alert_001",
                    type: "harassment",
                    severity: "high",
                    platform: "twitter",
                    message: "Harassing comment detected",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    comment: "You should delete this app, it's trash 🗑️",
                    author: "hater_account",
                    postUrl: "#",
                    status: "new"
                },
                {
                    id: "alert_002",
                    type: "threat",
                    severity: "critical",
                    platform: "instagram",
                    message: "Potential physical threat detected",
                    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                    comment: "I know where you live, watch your back 👀",
                    author: "anonymous_123",
                    postUrl: "#",
                    status: "new"
                }
            ];
            this.saveAlerts();
        }
    }

    createAlert(threatData: {
        platform: string;
        comment: string;
        author: string;
        threatLevel: number;
        category?: string;
    }): ThreatAlert {
        const severity = this.calculateSeverity(threatData.threatLevel, threatData.category);
        const type = (threatData.category as any) || 'harassment';

        const newAlert: ThreatAlert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            severity,
            platform: threatData.platform as any,
            message: `${severity.charAt(0).toUpperCase() + severity.slice(1)} severity ${type.replace('_', ' ')} detected`,
            timestamp: new Date(),
            comment: threatData.comment,
            author: threatData.author,
            postUrl: '#',
            status: 'new'
        };

        this.alerts = [newAlert, ...this.alerts];
        this.saveAlerts();
        this.notifyListeners();

        // Notify Safe Circle if critical or high
        if (severity === 'critical') {
            safeCircleService.notifyContacts(newAlert, 'high');
        } else if (severity === 'high') {
            safeCircleService.notifyContacts(newAlert, 'low');
        }

        return newAlert;
    }

    getAlerts(): ThreatAlert[] {
        return this.alerts;
    }

    updateAlert(alertId: string, status: 'new' | 'reviewed' | 'resolved') {
        this.alerts = this.alerts.map(alert =>
            alert.id === alertId ? { ...alert, status } : alert
        );
        this.saveAlerts();
        this.notifyListeners();
    }

    getAlertStats() {
        return {
            total: this.alerts.length,
            new: this.alerts.filter(a => a.status === 'new').length,
            critical: this.alerts.filter(a => a.severity === 'critical').length,
            byPlatform: {
                twitter: this.alerts.filter(a => a.platform === 'twitter').length,
                instagram: this.alerts.filter(a => a.platform === 'instagram').length,
                tiktok: this.alerts.filter(a => a.platform === 'tiktok').length,
            }
        };
    }

    subscribe(listener: (alerts: ThreatAlert[]) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.alerts));
    }

    private saveAlerts() {
        localStorage.setItem('mock_alerts', JSON.stringify(this.alerts));
    }

    private calculateSeverity(level: number, category?: string): ThreatAlert['severity'] {
        if (category === 'threat' || level > 0.8) return 'critical';
        if (category === 'hate_speech' || level > 0.6) return 'high';
        if (level > 0.4) return 'medium';
        return 'low';
    }
}

export const alertService = new AlertService();
