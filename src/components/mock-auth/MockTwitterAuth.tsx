import { useState } from 'react';
import { Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MockTwitterAuthProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const MockTwitterAuth = ({ onSuccess, onCancel }: MockTwitterAuthProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleAuthorize = async () => {
        setIsLoading(true);
        setProgress(0);

        // Simulate loading steps
        const steps = [
            { delay: 300, progress: 20, message: 'Connecting to Twitter...' },
            { delay: 600, progress: 50, message: 'Authenticating...' },
            { delay: 900, progress: 80, message: 'Granting permissions...' },
            { delay: 1200, progress: 100, message: 'Complete!' }
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
                    {/* Twitter Logo */}
                    <div className="w-16 h-16 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                        <Twitter className="w-10 h-10 text-white" fill="currentColor" />
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Authorize Aegis Shield
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Aegis Shield would like to access your Twitter account
                        </p>
                    </div>

                    {/* Permissions */}
                    {!isLoading && (
                        <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                This application will be able to:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Read your profile information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Access your comments and mentions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Monitor real-time activity</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="w-full space-y-3">
                            <Progress value={progress} className="h-2" />
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Authorizing...
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    {!isLoading && (
                        <div className="flex flex-col w-full gap-3">
                            <Button
                                onClick={handleAuthorize}
                                className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold py-3 rounded-full transition-all duration-200"
                            >
                                Authorize App
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
                        By authorizing, you agree to share your Twitter data with Aegis Shield for threat monitoring purposes.
                    </p>
                </div>
            </Card>
        </div>
    );
};
