import { useState, useEffect } from 'react';
import { Twitter, Instagram, Music, Shield, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MockTwitterAuth } from './mock-auth/MockTwitterAuth';
import { MockInstagramAuth } from './mock-auth/MockInstagramAuth';
import { MockTikTokAuth } from './mock-auth/MockTikTokAuth';
import { mockSocialService, MockComment } from '@/services/MockSocialService';
import { toast } from 'sonner';

type Platform = 'twitter' | 'instagram' | 'tiktok';

interface PlatformInfo {
    id: Platform;
    name: string;
    icon: any;
    color: string;
    gradient: string;
}

const platforms: PlatformInfo[] = [
    {
        id: 'twitter',
        name: 'Twitter',
        icon: Twitter,
        color: 'text-[#1DA1F2]',
        gradient: 'from-[#1DA1F2] to-[#1a8cd8]'
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: Instagram,
        color: 'text-pink-500',
        gradient: 'from-purple-600 via-pink-500 to-orange-400'
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: Music,
        color: 'text-black dark:text-white',
        gradient: 'from-[#25F4EE] to-[#FE2C55]'
    }
];

export const SocialPlatformMonitor = () => {
    const [activeAuth, setActiveAuth] = useState<Platform | null>(null);
    const [connectedPlatforms, setConnectedPlatforms] = useState<Record<Platform, boolean>>({
        twitter: false,
        instagram: false,
        tiktok: false
    });
    const [scanningPlatform, setScanningPlatform] = useState<Platform | null>(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [comments, setComments] = useState<Record<Platform, MockComment[]>>({
        twitter: [],
        instagram: [],
        tiktok: []
    });
    const [threatCounts, setThreatCounts] = useState<Record<Platform, number>>({
        twitter: 0,
        instagram: 0,
        tiktok: 0
    });

    useEffect(() => {
        // Check connection status on mount and restore sessions
        const restoreSessions = async () => {
            const updates: Partial<Record<Platform, boolean>> = {};

            for (const p of platforms) {
                if (mockSocialService.isConnected(p.id)) {
                    updates[p.id] = true;

                    // Restore data silently
                    mockSocialService.scanRecentComments(p.id).then(scannedComments => {
                        setComments(prev => ({ ...prev, [p.id]: scannedComments }));

                        const threats = scannedComments.filter(c => c.threatLevel > 0.5).length;
                        setThreatCounts(prev => ({ ...prev, [p.id]: threats }));
                    });

                    // Restart monitoring
                    mockSocialService.startRealTimeMonitoring(p.id, (newComment) => {
                        setComments(prev => ({
                            ...prev,
                            [p.id]: [newComment, ...prev[p.id]].slice(0, 50)
                        }));

                        if (newComment.threatLevel > 0.5) {
                            setThreatCounts(prev => ({ ...prev, [p.id]: prev[p.id] + 1 }));
                        }
                    });
                }
            }

            setConnectedPlatforms(prev => ({ ...prev, ...updates }));
        };

        restoreSessions();

        // Cleanup on unmount
        return () => {
            platforms.forEach(p => mockSocialService.stopRealTimeMonitoring(p.id));
        };
    }, []);

    const handleConnect = async (platform: Platform) => {
        setActiveAuth(platform);
    };

    const handleAuthSuccess = async () => {
        if (!activeAuth) return;

        const platform = activeAuth;
        setActiveAuth(null);
        setScanningPlatform(platform);
        setScanProgress(0);

        try {
            const success = await mockSocialService.connectPlatform(platform);

            if (success) {
                setConnectedPlatforms(prev => ({ ...prev, [platform]: true }));
                toast.success(`Connected to ${platforms.find(p => p.id === platform)?.name}!`);

                // Start scanning
                const progressInterval = setInterval(() => {
                    setScanProgress(prev => {
                        if (prev >= 100) {
                            clearInterval(progressInterval);
                            return 100;
                        }
                        return prev + 10;
                    });
                }, 150);

                const scannedComments = await mockSocialService.scanRecentComments(platform);
                clearInterval(progressInterval);
                setScanProgress(100);

                setComments(prev => ({ ...prev, [platform]: scannedComments }));

                const threats = scannedComments.filter(c => c.threatLevel > 0.5).length;
                setThreatCounts(prev => ({ ...prev, [platform]: threats }));

                setTimeout(() => {
                    setScanningPlatform(null);
                    setScanProgress(0);
                }, 1000);

                // Start real-time monitoring
                mockSocialService.startRealTimeMonitoring(platform, (newComment) => {
                    setComments(prev => ({
                        ...prev,
                        [platform]: [newComment, ...prev[platform]].slice(0, 50) // Keep last 50
                    }));

                    if (newComment.threatLevel > 0.5) {
                        setThreatCounts(prev => ({ ...prev, [platform]: prev[platform] + 1 }));
                    }
                });
            }
        } catch (error) {
            toast.error('Connection failed');
            setScanningPlatform(null);
        }
    };

    const handleDisconnect = async (platform: Platform) => {
        await mockSocialService.disconnectPlatform(platform);
        setConnectedPlatforms(prev => ({ ...prev, [platform]: false }));
        setComments(prev => ({ ...prev, [platform]: [] }));
        setThreatCounts(prev => ({ ...prev, [platform]: 0 }));
        toast.info(`Disconnected from ${platforms.find(p => p.id === platform)?.name}`);
    };

    const getThreatPercentage = (platform: Platform) => {
        const total = comments[platform].length;
        if (total === 0) return 0;
        return Math.round((threatCounts[platform] / total) * 100);
    };

    return (
        <div className="space-y-6">
            {/* Platform Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isConnected = connectedPlatforms[platform.id];
                    const isScanning = scanningPlatform === platform.id;

                    return (
                        <Card key={platform.id} className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${platform.gradient}`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                                    </div>
                                    {isConnected && (
                                        <Badge variant="default" className="bg-green-500">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Connected
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {!isConnected && !isScanning && (
                                    <Button
                                        onClick={() => handleConnect(platform.id)}
                                        className={`w-full bg-gradient-to-r ${platform.gradient} text-white font-semibold hover:opacity-90`}
                                    >
                                        Connect {platform.name}
                                    </Button>
                                )}

                                {isScanning && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Scanning comments...</span>
                                            <span className="font-semibold">{scanProgress}%</span>
                                        </div>
                                        <Progress value={scanProgress} className="h-2" />
                                    </div>
                                )}

                                {isConnected && !isScanning && (
                                    <>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="bg-muted p-2 rounded">
                                                <div className="text-xs text-muted-foreground">Total Comments</div>
                                                <div className="font-bold text-lg">{comments[platform.id].length}</div>
                                            </div>
                                            <div className="bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800">
                                                <div className="text-xs text-red-600 dark:text-red-400">Threats</div>
                                                <div className="font-bold text-lg text-red-600 dark:text-red-400">
                                                    {threatCounts[platform.id]}
                                                </div>
                                            </div>
                                        </div>

                                        {threatCounts[platform.id] > 0 && (
                                            <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded">
                                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                <span className="text-xs text-amber-700 dark:text-amber-400">
                                                    {getThreatPercentage(platform.id)}% threats detected
                                                </span>
                                            </div>
                                        )}

                                        <Button
                                            onClick={() => handleDisconnect(platform.id)}
                                            variant="outline"
                                            className="w-full"
                                            size="sm"
                                        >
                                            Disconnect
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            {Object.values(connectedPlatforms).some(Boolean) && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <CardTitle>Real-Time Activity Monitor</CardTitle>
                        </div>
                        <CardDescription>
                            Live feed of comments across all connected platforms
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-2">
                                {Object.entries(comments)
                                    .flatMap(([platform, platformComments]) =>
                                        platformComments.map(c => ({ ...c, platform: platform as Platform }))
                                    )
                                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                                    .map((comment) => {
                                        const platformInfo = platforms.find(p => p.id === comment.platform);
                                        const Icon = platformInfo?.icon || Shield;

                                        return (
                                            <div
                                                key={comment.id}
                                                className={`p-3 rounded-lg border-l-4 ${comment.threatLevel > 0.7
                                                    ? 'bg-red-50 dark:bg-red-950 border-red-500'
                                                    : comment.threatLevel > 0.4
                                                        ? 'bg-amber-50 dark:bg-amber-950 border-amber-500'
                                                        : 'bg-muted border-muted-foreground'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-start gap-2 flex-1">
                                                        <Icon className={`w-4 h-4 mt-1 ${platformInfo?.color}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-sm">@{comment.author.username}</span>
                                                                {comment.category && (
                                                                    <Badge variant="destructive" className="text-xs">
                                                                        {comment.category}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{comment.text}</p>
                                                            <span className="text-xs text-muted-foreground mt-1 block">
                                                                {new Date(comment.timestamp).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {comment.threatLevel > 0 && (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="text-xs font-semibold text-red-600">
                                                                {Math.round(comment.threatLevel * 100)}%
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                {Object.values(comments).every(arr => arr.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No activity yet. Connect a platform to start monitoring.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {/* Auth Modals */}
            {activeAuth === 'twitter' && (
                <MockTwitterAuth
                    onSuccess={handleAuthSuccess}
                    onCancel={() => setActiveAuth(null)}
                />
            )}
            {activeAuth === 'instagram' && (
                <MockInstagramAuth
                    onSuccess={handleAuthSuccess}
                    onCancel={() => setActiveAuth(null)}
                />
            )}
            {activeAuth === 'tiktok' && (
                <MockTikTokAuth
                    onSuccess={handleAuthSuccess}
                    onCancel={() => setActiveAuth(null)}
                />
            )}
        </div>
    );
};
