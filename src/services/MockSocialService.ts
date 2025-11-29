import { toast } from "sonner";
import { alertService } from './AlertService';

export interface MockComment {
    id: string;
    author: { username: string; avatar: string };
    text: string;
    timestamp: Date;
    platform: 'twitter' | 'instagram' | 'tiktok';
    threatLevel: number; // 0-1
    category?: 'harassment' | 'hate_speech' | 'threat';
    postUrl: string;
}

export interface PlatformStats {
    username: string;
    posts: number;
    followers: number;
    connected: boolean;
}

const mockSocialData = {
    profiles: {
        twitter: { username: "user_tw", posts: 45, followers: 234 },
        instagram: { username: "user_ig", posts: 120, followers: 567 },
        tiktok: { username: "user_tt", videos: 89, followers: 891 }
    },
    comments: {
        safe: ["Great content! 👍", "Love this! 😍", "Thanks for sharing!", "Awesome!", "So cool!", "Keep it up!", "Nice work!", "Interesting perspective", "Totally agree!"],
        threats: [
            "You should delete this, it's trash 🗑️",
            "Nobody cares about your opinion 😒",
            "I know where you live, watch your back 👀",
            "You're pathetic and everyone hates you",
            "Ugly and stupid",
            "I'm going to find you",
            "Worst video ever",
            "You are disgusting",
            "Die"
        ]
    }
};

const threatKeywords = {
    harassment: ['stupid', 'idiot', 'pathetic', 'ugly', 'fat'],
    hate_speech: ['hate', 'disgusting', 'trash', 'worthless'],
    threats: ['kill', 'hurt', 'watch your back', 'know where you live', 'find you', 'die']
};

class MockSocialService {
    private connectedPlatforms: Record<string, boolean> = {};
    private monitoringIntervals: Record<string, any> = {};

    constructor() {
        // Load connection status from localStorage
        const stored = localStorage.getItem('mock_connected_platforms');
        if (stored) {
            this.connectedPlatforms = JSON.parse(stored);
        }
    }

    async connectPlatform(platform: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.connectedPlatforms[platform] = true;
                localStorage.setItem('mock_connected_platforms', JSON.stringify(this.connectedPlatforms));
                resolve(true);
            }, 2000); // Simulate network delay
        });
    }

    async disconnectPlatform(platform: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.connectedPlatforms[platform] = false;
                localStorage.setItem('mock_connected_platforms', JSON.stringify(this.connectedPlatforms));
                this.stopRealTimeMonitoring(platform);
                resolve();
            }, 1000);
        });
    }

    async getPlatformStats(platform: string): Promise<PlatformStats | null> {
        if (!this.connectedPlatforms[platform]) return null;

        const key = platform === 'tiktok' ? 'tiktok' : platform === 'twitter' ? 'twitter' : 'instagram';
        const profile = mockSocialData.profiles[key as keyof typeof mockSocialData.profiles];

        return {
            username: profile.username,
            posts: (profile as any).posts || (profile as any).videos || 0,
            followers: profile.followers,
            connected: true
        };
    }

    async scanRecentComments(platform: string): Promise<MockComment[]> {
        // Generate some initial comments
        const comments: MockComment[] = [];
        for (let i = 0; i < 10; i++) {
            comments.push(this.generateRandomComment(platform as 'twitter' | 'instagram' | 'tiktok'));
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(comments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
            }, 1500);
        });
    }

    startRealTimeMonitoring(platform: string, callback: (comment: MockComment) => void) {
        if (this.monitoringIntervals[platform]) return;

        // Immediate check
        this.monitoringIntervals[platform] = setInterval(() => {
            if (Math.random() > 0.6) { // 40% chance of new comment every interval
                const comment = this.generateRandomComment(platform as 'twitter' | 'instagram' | 'tiktok');
                callback(comment);

                if (comment.threatLevel > 0.5) {
                    alertService.createAlert({
                        platform: comment.platform,
                        comment: comment.text,
                        author: comment.author.username,
                        threatLevel: comment.threatLevel,
                        category: comment.category
                    });

                    toast.error(`New threat detected on ${platform}!`, {
                        description: `${comment.author.username}: ${comment.text}`
                    });
                }
            }
        }, 4000); // Check every 4 seconds
    }

    stopRealTimeMonitoring(platform: string) {
        if (this.monitoringIntervals[platform]) {
            clearInterval(this.monitoringIntervals[platform]);
            delete this.monitoringIntervals[platform];
        }
    }

    isConnected(platform: string): boolean {
        return !!this.connectedPlatforms[platform];
    }

    private generateRandomComment(platform: 'twitter' | 'instagram' | 'tiktok'): MockComment {
        const isThreat = Math.random() < 0.25; // 25% chance of threat
        const textPool = isThreat ? mockSocialData.comments.threats : mockSocialData.comments.safe;
        const text = textPool[Math.floor(Math.random() * textPool.length)];

        let threatLevel = 0;
        let category: MockComment['category'] = undefined;

        if (isThreat) {
            // Simple keyword matching
            for (const [cat, keywords] of Object.entries(threatKeywords)) {
                if (keywords.some(k => text.toLowerCase().includes(k))) {
                    category = cat as MockComment['category'];
                    threatLevel = cat === 'threats' ? 0.9 : cat === 'hate_speech' ? 0.7 : 0.5;
                    break;
                }
            }
            if (threatLevel === 0) threatLevel = 0.4; // Default low threat
        }

        return {
            id: Math.random().toString(36).substring(7),
            author: {
                username: `user_${Math.floor(Math.random() * 1000)}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
            },
            text,
            timestamp: new Date(),
            platform,
            threatLevel,
            category,
            postUrl: '#'
        };
    }
}

export const mockSocialService = new MockSocialService();
