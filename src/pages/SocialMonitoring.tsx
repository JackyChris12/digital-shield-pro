import { SocialPlatformMonitor } from '@/components/SocialPlatformMonitor';
import { Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SocialMonitoring = () => {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Social Media Protection
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Connect your accounts and monitor threats in real-time
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="border-2 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-2">
                            <CardDescription>Active Protection</CardDescription>
                            <CardTitle className="text-3xl text-blue-600">24/7</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Continuous monitoring across all platforms</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-200 dark:border-purple-800">
                        <CardHeader className="pb-2">
                            <CardDescription>AI-Powered Detection</CardDescription>
                            <CardTitle className="text-3xl text-purple-600">99.8%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Threat detection accuracy rate</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-pink-200 dark:border-pink-800">
                        <CardHeader className="pb-2">
                            <CardDescription>Response Time</CardDescription>
                            <CardTitle className="text-3xl text-pink-600">&lt;2s</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Average alert notification speed</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Monitor */}
                <SocialPlatformMonitor />

                {/* Info Card */}
                <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <CardTitle>How It Works</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <h3 className="font-semibold">Connect Platforms</h3>
                            <p className="text-sm text-muted-foreground">
                                Securely link your Twitter, Instagram, and TikTok accounts with one click
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <h3 className="font-semibold">AI Analysis</h3>
                            <p className="text-sm text-muted-foreground">
                                Our AI scans comments and messages in real-time for threats and harassment
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <h3 className="font-semibold">Instant Alerts</h3>
                            <p className="text-sm text-muted-foreground">
                                Get notified immediately when threats are detected and take action
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SocialMonitoring;
