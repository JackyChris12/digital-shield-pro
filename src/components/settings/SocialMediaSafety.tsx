import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Twitter, Instagram, MessageCircle, Facebook, Zap, Shield, AlertTriangle, CheckCircle2, XCircle, BookOpen, Lock, FileText, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { SocialPlatform } from "@/types/settings";
import { usePlatforms } from "@/hooks/usePlatforms";

const SocialMediaSafety = () => {
  const { platforms, loading, connectPlatform } = usePlatforms();

  // Define all available platforms
  const availablePlatforms = [
    { name: 'twitter', icon: Twitter, displayName: 'Twitter' },
    { name: 'instagram', icon: Instagram, displayName: 'Instagram' },
    { name: 'facebook', icon: Facebook, displayName: 'Facebook' },
    { name: 'whatsapp', icon: MessageCircle, displayName: 'WhatsApp' },
    { name: 'tiktok', icon: Zap, displayName: 'TikTok' },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleChecklistToggle = (platformId: string, itemId: string) => {
    // Update local checklist (not persisted to DB for demo)
    // In real app, this would update user preferences
    console.log(`Toggled checklist item ${itemId} for platform ${platformId}`);
  };

  const getOverallSafetyScore = () => {
    const activePlatforms = platforms.filter(p => p.is_active);
    if (activePlatforms.length === 0) return 0;
    const totalScore = activePlatforms.reduce((sum, p) => sum + p.safety_score, 0);
    return Math.round(totalScore / activePlatforms.length);
  };

  // Get platform data or create default structure
  const getPlatformData = (platformName: string): SocialPlatform | null => {
    return platforms.find(p => p.platform_name === platformName) || null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Social Media Safety Dashboard</h2>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-muted-foreground">Loading platforms...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Social Media Safety Dashboard</h2>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Monitor and improve your safety across all connected social media platforms. Higher scores mean better protection.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Overall Safety Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-blue-600">{getOverallSafetyScore()}%</div>
            <Progress value={getOverallSafetyScore()} className="flex-1" />
            <Badge className={getRiskColor(getOverallSafetyScore() >= 80 ? 'low' : getOverallSafetyScore() >= 60 ? 'medium' : 'high')}>
              {getOverallSafetyScore() >= 80 ? 'Safe' : getOverallSafetyScore() >= 60 ? 'Caution' : 'At Risk'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availablePlatforms.map((platformInfo) => {
          const platform = getPlatformData(platformInfo.name);
          const Icon = platformInfo.icon;
          const isConnected = platform?.is_active || false;
          const completedItems = platform?.privacy_checklist.filter(item => item.completed).length || 0;
          const totalItems = platform?.privacy_checklist.length || 0;

          return (
            <Card key={platformInfo.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isConnected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${isConnected ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{platformInfo.displayName}</h3>
                      {isConnected && platform?.last_sync_at && (
                        <p className="text-xs text-muted-foreground">
                          Synced {new Date(platform.last_sync_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {isConnected ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="w-3 h-3 mr-1" />
                      Disconnected
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {isConnected && platform && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Safety Score</span>
                        <span className="text-sm text-muted-foreground">{platform.safety_score}%</span>
                      </div>
                      <Progress value={platform.safety_score} className="h-2" />
                      <div className="flex justify-between items-center mt-1">
                        <Badge className={`text-xs ${getRiskColor(platform.risk_level)}`}>
                          {platform.risk_level.toUpperCase()} RISK
                        </Badge>
                        {completedItems}/{totalItems} completed
                      </div>
                    </div>

                    {platform.privacy_checklist.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Privacy Checklist</h4>
                        <div className="space-y-2">
                          {platform.privacy_checklist.map((item) => (
                            <TooltipProvider key={item.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-start gap-2">
                                    <Checkbox
                                      id={item.id}
                                      checked={item.completed}
                                      onCheckedChange={() => handleChecklistToggle(platform.id, item.id)}
                                    />
                                    <label
                                      htmlFor={item.id}
                                      className={`text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                                    >
                                      {item.title}
                                    </label>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{item.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2">Quick Safety Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {platform.quick_tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {platform.risk_level === 'high' && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          High risk detected. Complete privacy checklist items to improve safety.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                {!isConnected && (
                  <Button
                    className="w-full"
                    onClick={() => connectPlatform(platformInfo.name)}
                  >
                    Connect {platformInfo.displayName}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Educational Components */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold">Educational Components</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform-Specific Privacy Configuration Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="twitter">
                <AccordionTrigger>Twitter Privacy Settings</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Go to Settings {'>'} Privacy and safety</li>
                    <li>Enable "Protect your Tweets" to make them private</li>
                    <li>Turn off location services for tweets</li>
                    <li>Review and adjust data sharing preferences</li>
                    <li>Set up two-factor authentication</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="instagram">
                <AccordionTrigger>Instagram Privacy Settings</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Access Settings {'>'} Privacy</li>
                    <li>Switch account to private</li>
                    <li>Disable location sharing</li>
                    <li>Limit story sharing to close friends</li>
                    <li>Review tagged photos approval settings</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="facebook">
                <AccordionTrigger>Facebook Privacy Settings</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Navigate to Settings {'>'} Privacy</li>
                    <li>Adjust who can see your posts</li>
                    <li>Limit past posts visibility</li>
                    <li>Turn off location tracking</li>
                    <li>Review app permissions</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Protocol Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">If You Feel Threatened Online:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Stop all communication with the threat</li>
                  <li>Document all evidence (screenshots, messages, URLs)</li>
                  <li>Report the content to the platform</li>
                  <li>Block the user across all platforms</li>
                  <li>Contact local authorities if physical threats are made</li>
                  <li>Change passwords and enable 2FA</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Digital Evidence Preservation:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Take screenshots of all relevant content</li>
                  <li>Save URLs and timestamps</li>
                  <li>Export chat logs if possible</li>
                  <li>Do not delete any content that could be evidence</li>
                  <li>Use a separate device for documentation</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Digital Literacy Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Understanding Online Privacy</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your data is valuable - protect it</li>
                  <li>• Public posts can be seen by anyone</li>
                  <li>• Once shared, content is hard to remove</li>
                  <li>• Apps collect more data than you think</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Safe Sharing Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Think before you post</li>
                  <li>• Use privacy settings effectively</li>
                  <li>• Be cautious with personal information</li>
                  <li>• Verify information before sharing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Integration */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold">Emergency Integration</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lockdown Mode Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Simulate emergency lockdown procedures to disconnect all accounts and preserve safety.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Lock className="w-4 h-4 mr-2" />
                  Activate Lockdown Mode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lockdown Mode Activated</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      All social media connections have been temporarily disabled. Accounts are now in safe mode.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Actions Taken:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Logged out from all connected platforms</li>
                      <li>• Disabled automatic data sharing</li>
                      <li>• Activated privacy shields</li>
                      <li>• Emergency contacts notified</li>
                    </ul>
                  </div>
                  <Button className="w-full" variant="outline">
                    Deactivate Lockdown
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidence Preservation Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Proper evidence collection is crucial for reporting incidents and legal proceedings.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Collection Steps
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Take clear screenshots</li>
                    <li>Note dates and times</li>
                    <li>Save original URLs</li>
                    <li>Document context</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Storage Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use secure cloud storage</li>
                    <li>• Create dated folders</li>
                    <li>• Backup to multiple locations</li>
                    <li>• Include metadata</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                CyberTipline
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                National Center for Missing & Exploited Children
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Internet Watch Foundation
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                FBI Internet Crime Complaint Center
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Local Law Enforcement
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Crisis Text Line
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMediaSafety;
