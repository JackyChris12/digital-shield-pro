import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MockInstagramAuthProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const MockInstagramAuth = ({ onSuccess, onCancel }: MockInstagramAuthProps) => {
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
                    {/* Instagram Logo with Gradient */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center">
                        <Instagram className="w-10 h-10 text-white" />
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Log in with Instagram
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Connect your Instagram account to Aegis Shield
                        </p>
                    </div>

                    {/* Permissions */}
                    {!isLoading && (
                        <div className="w-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 rounded-lg p-4 space-y-2 border border-purple-100 dark:border-purple-800">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Permissions requested:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>View your profile and posts</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Read comments on your content</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Access direct messages</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Monitor mentions and tags</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="w-full space-y-3">
                            <Progress value={progress} className="h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:via-pink-500 [&>div]:to-orange-500" />
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Connecting to Instagram...
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    {!isLoading && (
                        <div className="flex flex-col w-full gap-3">
                            <Button
                                onClick={handleAuthorize}
                                className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg"
                            >
                                Continue with Instagram
                            </Button>
                            <Button
                                onClick={onCancel}
                                variant="ghost"
                                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}

                    {/* Footer */}
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center max-w-xs">
                        We'll never post anything without your permission. Your data is secured with end-to-end encryption.
                    </p>
                </div>
            </Card>
        </div>
    );
};
