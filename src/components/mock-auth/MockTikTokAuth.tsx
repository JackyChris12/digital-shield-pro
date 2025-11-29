import { useState } from 'react';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MockTikTokAuthProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const MockTikTokAuth = ({ onSuccess, onCancel }: MockTikTokAuthProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleAuthorize = async () => {
        setIsLoading(true);
        setProgress(0);

        const steps = [
            { delay: 300, progress: 20 },
            { delay: 600, progress: 50 },
            { delay: 900, progress: 80 },
            { delay: 1200, progress: 100 }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, step.delay - (steps.indexOf(step) > 0 ? steps[steps.indexOf(step) - 1].delay : 0)));
            setProgress(step.progress);
        }

        setTimeout(() => {
            onSuccess();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center space-y-6">
                    {/* TikTok Logo */}
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 bg-black rounded-2xl flex items-center justify-center">
                            <Music className="w-10 h-10 text-white" fill="currentColor" />
                        </div>
                        <div className="absolute -top-1 -left-1 w-16 h-16 bg-[#25F4EE] rounded-2xl flex items-center justify-center opacity-30 animate-pulse"></div>
                        <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-[#FE2C55] rounded-2xl flex items-center justify-center opacity-30 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Connect to TikTok
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Aegis Shield wants to access your TikTok account
                        </p>
                    </div>

                    {/* Permissions */}
                    {!isLoading && (
                        <div className="w-full bg-black dark:bg-gray-800 rounded-lg p-4 space-y-2 border-2 border-[#25F4EE]/20">
                            <p className="text-xs font-semibold text-white uppercase tracking-wide">
                                Access Permissions:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-start">
                                    <span className="mr-2 text-[#25F4EE]">→</span>
                                    <span>View your profile information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-[#25F4EE]">→</span>
                                    <span>Access video comments</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-[#FE2C55]">→</span>
                                    <span>Read direct messages</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-[#FE2C55]">→</span>
                                    <span>Monitor interactions</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="w-full space-y-3">
                            <Progress value={progress} className="h-2.5 bg-gray-200 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-[#25F4EE] [&>div]:to-[#FE2C55]" />
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                                Connecting to TikTok...
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    {!isLoading && (
                        <div className="flex flex-col w-full gap-3">
                            <Button
                                onClick={handleAuthorize}
                                className="w-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] hover:from-[#1fd4ce] hover:to-[#e5254d] text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg transform hover:scale-[1.02]"
                            >
                                Authorize Access
                            </Button>
                            <Button
                                onClick={onCancel}
                                variant="ghost"
                                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                Not Now
                            </Button>
                        </div>
                    )}

                    {/* Footer */}
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center max-w-xs">
                        By continuing, you authorize Aegis Shield to protect your TikTok content from threats and harassment.
                    </p>
                </div>
            </Card>
        </div>
    );
};
