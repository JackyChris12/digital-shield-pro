import { ThreatAlert } from './AlertService';

export interface SafeCircleContact {
    id: string;
    name: string;
    email: string;
    phone: string;
    relationship: 'family' | 'friend' | 'colleague' | 'emergency_contact';
    notificationPreference: 'all_alerts' | 'critical_only' | 'emergency_only';
    isVerified: boolean;
    lastNotified?: Date;
}

export interface NotificationResult {
    contactId: string;
    status: 'sent' | 'failed';
    timestamp: Date;
    method: 'email' | 'sms'; // Assuming these are the methods
}

export interface NotificationRecord {
    id: string;
    contactId: string;
    alertId?: string;
    type: 'alert' | 'emergency';
    message: string;
    timestamp: Date;
}

class SafeCircleService {
    private contacts: SafeCircleContact[] = [];
    private notificationHistory: NotificationRecord[] = [];

    constructor() {
        // Load contacts from localStorage
        const storedContacts = localStorage.getItem('safe_circle_contacts');
        if (storedContacts) {
            this.contacts = JSON.parse(storedContacts, (key, value) => {
                if (key === 'lastNotified') return new Date(value);
                return value;
            });
        } else {
            // Initialize with some mock contacts
            this.contacts = [
                {
                    id: 'contact_001',
                    name: 'Mom',
                    email: 'mom@example.com',
                    phone: '+1234567890',
                    relationship: 'family',
                    notificationPreference: 'all_alerts',
                    isVerified: true
                },
                {
                    id: 'contact_002',
                    name: 'Best Friend',
                    email: 'friend@example.com',
                    phone: '+0987654321',
                    relationship: 'friend',
                    notificationPreference: 'critical_only',
                    isVerified: true
                }
            ];
            this.saveContacts();
        }

        const storedHistory = localStorage.getItem('notification_history');
        if (storedHistory) {
            this.notificationHistory = JSON.parse(storedHistory, (key, value) => {
                if (key === 'timestamp') return new Date(value);
                return value;
            });
        }
    }

    // Contact management
    async addContact(contact: Omit<SafeCircleContact, 'id'>): Promise<SafeCircleContact> {
        const newContact: SafeCircleContact = {
            ...contact,
            id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            isVerified: true // Auto-verify for mock
        };
        this.contacts.push(newContact);
        this.saveContacts();
        return newContact;
    }

    async removeContact(contactId: string): Promise<void> {
        this.contacts = this.contacts.filter(c => c.id !== contactId);
        this.saveContacts();
    }

    async getContacts(): Promise<SafeCircleContact[]> {
        return this.contacts;
    }

    async updateContact(contactId: string, updates: Partial<SafeCircleContact>): Promise<void> {
        this.contacts = this.contacts.map(c =>
            c.id === contactId ? { ...c, ...updates } : c
        );
        this.saveContacts();
    }

    // Notification system
    async notifyContacts(alert: ThreatAlert, urgency: 'low' | 'high' | 'emergency'): Promise<NotificationResult[]> {
        const results: NotificationResult[] = [];

        const contactsToNotify = this.contacts.filter(contact => {
            if (urgency === 'emergency') return true; // Notify everyone in emergency
            if (contact.notificationPreference === 'all_alerts') return true;
            if (contact.notificationPreference === 'critical_only' && urgency === 'high') return true;
            return false;
        });

        for (const contact of contactsToNotify) {
            // Simulate sending notification
            console.log(`Sending ${urgency} notification to ${contact.name} (${contact.email})`);

            // Create notification record
            const record: NotificationRecord = {
                id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                contactId: contact.id,
                alertId: alert.id,
                type: 'alert',
                message: this.generateAlertMessage(alert, contact.name),
                timestamp: new Date()
            };

            this.notificationHistory.unshift(record);

            // Update contact last notified
            contact.lastNotified = new Date();

            results.push({
                contactId: contact.id,
                status: 'sent',
                timestamp: new Date(),
                method: 'email'
            });
        }

        this.saveContacts();
        this.saveHistory();
        return results;
    }

    async getNotificationHistory(): Promise<NotificationRecord[]> {
        return this.notificationHistory;
    }

    // Emergency protocol
    async triggerEmergencyProtocol(userLocation?: string, additionalInfo?: string): Promise<void> {
        const contactsToNotify = this.contacts;

        for (const contact of contactsToNotify) {
            console.log(`Sending EMERGENCY notification to ${contact.name} (${contact.email})`);

            const record: NotificationRecord = {
                id: `emerg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                contactId: contact.id,
                type: 'emergency',
                message: this.generateEmergencyMessage(contact.name, userLocation, additionalInfo),
                timestamp: new Date()
            };

            this.notificationHistory.unshift(record);
            contact.lastNotified = new Date();
        }

        this.saveContacts();
        this.saveHistory();
    }

    private generateAlertMessage(alert: ThreatAlert, contactName: string): string {
        return `
🔔 Aegis Shield Alert for User

Threat Level: ${alert.severity.toUpperCase()}
Platform: ${alert.platform}
Type: ${alert.type}

Message: "${alert.comment}"

Time: ${alert.timestamp.toLocaleString()}
View Details: [Link to alert]

Stay safe,
Aegis Shield Team`;
    }

    private generateEmergencyMessage(contactName: string, location?: string, info?: string): string {
        return `
🚨 EMERGENCY ALERT - User needs help!

User has activated the emergency protocol.

Time: ${new Date().toLocaleString()}
Last Location: ${location || 'Unknown'}
Additional Info: ${info || 'None'}

Please check on them immediately.

- Aegis Shield Emergency System`;
    }

    private saveContacts() {
        localStorage.setItem('safe_circle_contacts', JSON.stringify(this.contacts));
    }

    private saveHistory() {
        localStorage.setItem('notification_history', JSON.stringify(this.notificationHistory));
    }
}

export const safeCircleService = new SafeCircleService();
